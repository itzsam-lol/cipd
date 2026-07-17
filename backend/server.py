"""CiPD CMS backend — FastAPI + MongoDB.

Routes:
- /api/auth/login           — mock email/password login (returns JWT)
- /api/auth/me              — current user (protected)
- /api/blogs                — public, list published
- /api/blogs/{slug}         — public, by slug
- /api/admin/blogs          — protected, list all (any status)
- /api/admin/blogs/{id}     — protected, get one
- /api/admin/blogs          — protected POST, create
- /api/admin/blogs/{id}     — protected PUT, update
- /api/admin/blogs/{id}     — protected DELETE
- /api/events               — public, list events
- /api/events/{id}          — public, single event
- /api/admin/events         — protected CRUD
- /api/announcements        — public, list active ticker headlines
- /api/admin/announcements  — protected CRUD
- /api/apply                — public POST, iPD-CP application
- /api/share-idea           — public POST, share-an-idea form
- /api/admin/submissions    — protected, list/read/delete form submissions
- /api/admin/upload         — protected, upload media to S3
- /api/files/{path:path}    — public proxy that streams stored media
"""

from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

import os
import re
import uuid
import logging
import bcrypt
import boto3
import jwt
from botocore.exceptions import ClientError
from datetime import datetime, timezone, timedelta
from typing import List, Optional, Any

from fastapi import (
    FastAPI,
    APIRouter,
    Depends,
    HTTPException,
    Request,
    UploadFile,
    File,
    Response,
    Query,
    Header,
)
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

# ---------- Setup ----------

MONGO_URL = os.environ["MONGO_URL"]
DB_NAME = os.environ["DB_NAME"]
JWT_SECRET = os.environ["JWT_SECRET"]
ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "admin@example.com").lower()
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "admin123")
ADMIN_NAME = os.environ.get("ADMIN_NAME", "Admin")
S3_BUCKET_NAME = os.environ.get("S3_BUCKET_NAME", "")
AWS_REGION = os.environ.get("AWS_REGION", "")
APP_NAME = os.environ.get("APP_NAME", "cipd-cms")
FACULTY_DOMAIN = os.environ.get("FACULTY_EMAIL_DOMAIN", "iiitd.ac.in")
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_TTL = timedelta(days=7)

MAX_LOGIN_ATTEMPTS = 5
LOGIN_LOCKOUT_DURATION = timedelta(minutes=15)
MAX_UPLOAD_SIZE = 10 * 1024 * 1024  # 10 MB

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

app = FastAPI(title="CiPD CMS")
api_router = APIRouter(prefix="/api")
bearer_scheme = HTTPBearer(auto_error=False)

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger("cipd")

# ---------- Rate limiting ----------

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# ---------- CORS ----------

_cors_env = os.environ.get("CORS_ORIGINS", "").strip()
if _cors_env:
    CORS_ORIGINS = [o.strip() for o in _cors_env.split(",") if o.strip()]
else:
    CORS_ORIGINS = ["http://localhost:3000", "http://127.0.0.1:3000"]
    logger.warning(
        "CORS_ORIGINS not set — defaulting to localhost dev origins only. "
        "Set CORS_ORIGINS to the real frontend origin(s) in production."
    )
if "*" in CORS_ORIGINS:
    logger.warning(
        "CORS_ORIGINS includes '*' — wildcard origins combined with credentials "
        "are rejected by browsers and unsafe. Set explicit origins instead."
    )


# ---------- Helpers ----------

def hash_password(p: str) -> str:
    return bcrypt.hashpw(p.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False


def create_token(user: dict) -> str:
    payload = {
        "sub": user["id"],
        "email": user["email"],
        "role": user.get("role", "admin"),
        "exp": datetime.now(timezone.utc) + ACCESS_TOKEN_TTL,
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def slugify(title: str) -> str:
    s = re.sub(r"[^a-zA-Z0-9\s-]", "", title or "").strip().lower()
    s = re.sub(r"[\s_-]+", "-", s)
    s = re.sub(r"^-+|-+$", "", s)
    return s or f"untitled-{uuid.uuid4().hex[:6]}"


async def get_current_user(
    creds: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> dict:
    if not creds or not creds.credentials:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(creds.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = await db.users.find_one({"id": payload["sub"]}, {"_id": 0, "password_hash": 0})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


_s3_client = None


def s3_client():
    global _s3_client
    if _s3_client is None:
        _s3_client = boto3.client("s3", region_name=AWS_REGION or None)
    return _s3_client


def put_object(path: str, data: bytes, content_type: str) -> dict:
    if not S3_BUCKET_NAME:
        raise RuntimeError("S3_BUCKET_NAME missing")
    s3_client().put_object(Bucket=S3_BUCKET_NAME, Key=path, Body=data, ContentType=content_type)
    return {"path": path, "size": len(data)}


def get_object(path: str):
    if not S3_BUCKET_NAME:
        raise RuntimeError("S3_BUCKET_NAME missing")
    obj = s3_client().get_object(Bucket=S3_BUCKET_NAME, Key=path)
    return obj["Body"].read(), obj.get("ContentType", "application/octet-stream")


def sniff_image(data: bytes) -> Optional[tuple]:
    """Identify image type from magic bytes. Never trust client-supplied content-type/extension."""
    if data.startswith(b"\xff\xd8\xff"):
        return ("jpg", "image/jpeg")
    if data.startswith(b"\x89PNG\r\n\x1a\n"):
        return ("png", "image/png")
    if data.startswith((b"GIF87a", b"GIF89a")):
        return ("gif", "image/gif")
    if data[:4] == b"RIFF" and data[8:12] == b"WEBP":
        return ("webp", "image/webp")
    return None


async def audit_log(
    request: Request,
    action: str,
    user: Optional[dict] = None,
    target: Optional[str] = None,
    success: bool = True,
    detail: str = "",
) -> None:
    await db.audit_logs.insert_one(
        {
            "id": str(uuid.uuid4()),
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "action": action,
            "actor_id": (user or {}).get("id"),
            "actor_email": (user or {}).get("email"),
            "target": target,
            "success": success,
            "detail": detail,
            "ip": get_remote_address(request),
        }
    )


# ---------- Models ----------

class LoginIn(BaseModel):
    email: str
    password: str


class BlogIn(BaseModel):
    title: str
    excerpt: str = ""
    content: Any  # Tiptap JSON document
    coverImage: Optional[str] = None
    tag: Optional[str] = None
    published: bool = False


class BlogOut(BaseModel):
    id: str
    title: str
    slug: str
    excerpt: str
    content: Any
    coverImage: Optional[str] = None
    tag: Optional[str] = None
    author: dict
    published: bool
    createdAt: str
    updatedAt: str


class EventIn(BaseModel):
    date: str  # ISO date, e.g. "2026-03-14"
    title: str
    location: str = ""
    description: str = ""
    accent: str = "teal"  # teal | pink | purple


class ProjectIn(BaseModel):
    title: str
    tag: str = ""
    sub: str = ""
    color: str = "#0FB5A8"
    image: Optional[str] = None


class AnnouncementIn(BaseModel):
    text: str
    link: Optional[str] = None
    active: bool = True


class SubmissionIn(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    message: str = ""
    link: Optional[str] = None


def serialize_doc(doc: dict) -> dict:
    return {k: v for k, v in doc.items() if k != "_id"}


serialize_blog = serialize_doc


async def ensure_unique_slug(base: str, exclude_id: Optional[str] = None) -> str:
    slug = base
    n = 2
    while True:
        q = {"slug": slug}
        if exclude_id:
            q["id"] = {"$ne": exclude_id}
        if not await db.blogs.find_one(q):
            return slug
        slug = f"{base}-{n}"
        n += 1


# ---------- Auth Endpoints ----------

@api_router.post("/auth/login")
@limiter.limit("5/minute")
async def login(request: Request, body: LoginIn):
    email = (body.email or "").strip().lower()
    user = await db.users.find_one({"email": email})
    now = datetime.now(timezone.utc)

    if user and user.get("locked_until"):
        locked_until = datetime.fromisoformat(user["locked_until"])
        if locked_until > now:
            await audit_log(request, "login_blocked_locked", target=email, success=False)
            raise HTTPException(status_code=423, detail="Account locked due to failed attempts. Try again later.")

    if not user or not verify_password(body.password, user.get("password_hash", "")):
        if user:
            attempts = user.get("failed_attempts", 0) + 1
            update = {"failed_attempts": attempts}
            if attempts >= MAX_LOGIN_ATTEMPTS:
                update["locked_until"] = (now + LOGIN_LOCKOUT_DURATION).isoformat()
                update["failed_attempts"] = 0
            await db.users.update_one({"email": email}, {"$set": update})
        await audit_log(request, "login_failed", target=email, success=False)
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if user.get("failed_attempts") or user.get("locked_until"):
        await db.users.update_one({"email": email}, {"$set": {"failed_attempts": 0, "locked_until": None}})

    token = create_token({"id": user["id"], "email": user["email"], "role": user.get("role", "admin")})
    await audit_log(request, "login_success", user=user, target=email)
    return {
        "token": token,
        "user": {
            "id": user["id"],
            "email": user["email"],
            "name": user.get("name", ""),
            "role": user.get("role", "admin"),
        },
    }


@api_router.get("/auth/me")
async def me(user: dict = Depends(get_current_user)):
    return user


# ---------- Public Blogs ----------

@api_router.get("/blogs")
async def list_published_blogs():
    cursor = db.blogs.find({"published": True}).sort("createdAt", -1)
    return [serialize_blog(d) async for d in cursor]


@api_router.get("/blogs/{slug}")
async def get_published_blog(slug: str):
    doc = await db.blogs.find_one({"slug": slug, "published": True})
    if not doc:
        raise HTTPException(status_code=404, detail="Blog not found")
    return serialize_blog(doc)


# ---------- Admin Blogs ----------

@api_router.get("/admin/blogs")
async def list_all_blogs(user: dict = Depends(get_current_user)):
    cursor = db.blogs.find({}).sort("updatedAt", -1)
    return [serialize_blog(d) async for d in cursor]


@api_router.get("/admin/blogs/{blog_id}")
async def get_blog_admin(blog_id: str, user: dict = Depends(get_current_user)):
    doc = await db.blogs.find_one({"id": blog_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Blog not found")
    return serialize_blog(doc)


@api_router.post("/admin/blogs")
@limiter.limit("30/minute")
async def create_blog(request: Request, body: BlogIn, user: dict = Depends(get_current_user)):
    base = slugify(body.title)
    slug = await ensure_unique_slug(base)
    now = datetime.now(timezone.utc).isoformat()
    doc = {
        "id": str(uuid.uuid4()),
        "title": body.title.strip() or "Untitled",
        "slug": slug,
        "excerpt": body.excerpt or "",
        "content": body.content if body.content is not None else {},
        "coverImage": body.coverImage,
        "tag": body.tag or "Note",
        "author": {
            "id": user["id"],
            "name": user.get("name", ""),
            "email": user["email"],
            "role": "Faculty · CiPD",
        },
        "published": bool(body.published),
        "createdAt": now,
        "updatedAt": now,
    }
    await db.blogs.insert_one(doc)
    await audit_log(request, "blog_create", user=user, target=doc["id"], detail=doc["title"])
    return serialize_blog(doc)


@api_router.put("/admin/blogs/{blog_id}")
@limiter.limit("30/minute")
async def update_blog(request: Request, blog_id: str, body: BlogIn, user: dict = Depends(get_current_user)):
    existing = await db.blogs.find_one({"id": blog_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Blog not found")
    updates = {
        "title": body.title.strip() or existing["title"],
        "excerpt": body.excerpt or "",
        "content": body.content if body.content is not None else existing.get("content", {}),
        "coverImage": body.coverImage,
        "tag": body.tag or existing.get("tag", "Note"),
        "published": bool(body.published),
        "updatedAt": datetime.now(timezone.utc).isoformat(),
    }
    # regenerate slug if title changed
    if updates["title"] != existing.get("title"):
        updates["slug"] = await ensure_unique_slug(slugify(updates["title"]), exclude_id=blog_id)
    await db.blogs.update_one({"id": blog_id}, {"$set": updates})
    doc = await db.blogs.find_one({"id": blog_id})
    await audit_log(request, "blog_update", user=user, target=blog_id, detail=updates.get("title", ""))
    return serialize_blog(doc)


@api_router.delete("/admin/blogs/{blog_id}")
@limiter.limit("30/minute")
async def delete_blog(request: Request, blog_id: str, user: dict = Depends(get_current_user)):
    res = await db.blogs.delete_one({"id": blog_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Blog not found")
    await audit_log(request, "blog_delete", user=user, target=blog_id)
    return {"ok": True}


# ---------- Events ----------

@api_router.get("/events")
async def list_events():
    cursor = db.events.find({}).sort("date", 1)
    return [serialize_doc(d) async for d in cursor]


@api_router.get("/events/{event_id}")
async def get_event_public(event_id: str):
    doc = await db.events.find_one({"id": event_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Event not found")
    return serialize_doc(doc)


@api_router.get("/admin/events")
async def list_all_events(user: dict = Depends(get_current_user)):
    cursor = db.events.find({}).sort("date", 1)
    return [serialize_doc(d) async for d in cursor]


@api_router.get("/admin/events/{event_id}")
async def get_event_admin(event_id: str, user: dict = Depends(get_current_user)):
    doc = await db.events.find_one({"id": event_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Event not found")
    return serialize_doc(doc)


@api_router.post("/admin/events")
@limiter.limit("30/minute")
async def create_event(request: Request, body: EventIn, user: dict = Depends(get_current_user)):
    now = datetime.now(timezone.utc).isoformat()
    doc = {
        "id": str(uuid.uuid4()),
        "date": body.date,
        "title": body.title.strip() or "Untitled event",
        "location": body.location or "",
        "description": body.description or "",
        "accent": body.accent or "teal",
        "createdAt": now,
        "updatedAt": now,
    }
    await db.events.insert_one(doc)
    await audit_log(request, "event_create", user=user, target=doc["id"], detail=doc["title"])
    return serialize_doc(doc)


@api_router.put("/admin/events/{event_id}")
@limiter.limit("30/minute")
async def update_event(request: Request, event_id: str, body: EventIn, user: dict = Depends(get_current_user)):
    existing = await db.events.find_one({"id": event_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Event not found")
    updates = {
        "date": body.date,
        "title": body.title.strip() or existing["title"],
        "location": body.location or "",
        "description": body.description or "",
        "accent": body.accent or "teal",
        "updatedAt": datetime.now(timezone.utc).isoformat(),
    }
    await db.events.update_one({"id": event_id}, {"$set": updates})
    doc = await db.events.find_one({"id": event_id})
    await audit_log(request, "event_update", user=user, target=event_id, detail=updates.get("title", ""))
    return serialize_doc(doc)


@api_router.delete("/admin/events/{event_id}")
@limiter.limit("30/minute")
async def delete_event(request: Request, event_id: str, user: dict = Depends(get_current_user)):
    res = await db.events.delete_one({"id": event_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Event not found")
    await audit_log(request, "event_delete", user=user, target=event_id)
    return {"ok": True}


# ---------- Projects ----------

@api_router.get("/projects")
async def list_projects():
    cursor = db.projects.find({}).sort("order", 1)
    return [serialize_doc(d) async for d in cursor]


@api_router.get("/admin/projects")
async def list_all_projects(user: dict = Depends(get_current_user)):
    cursor = db.projects.find({}).sort("order", 1)
    return [serialize_doc(d) async for d in cursor]


@api_router.get("/admin/projects/{project_id}")
async def get_project_admin(project_id: str, user: dict = Depends(get_current_user)):
    doc = await db.projects.find_one({"id": project_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Project not found")
    return serialize_doc(doc)


@api_router.post("/admin/projects")
@limiter.limit("30/minute")
async def create_project(request: Request, body: ProjectIn, user: dict = Depends(get_current_user)):
    now = datetime.now(timezone.utc).isoformat()
    max_order_doc = await db.projects.find_one(sort=[("order", -1)])
    next_order = (max_order_doc["order"] + 1) if max_order_doc else 0
    doc = {
        "id": str(uuid.uuid4()),
        "title": body.title.strip() or "Untitled project",
        "tag": body.tag or "",
        "sub": body.sub or "",
        "color": body.color or "#0FB5A8",
        "image": body.image,
        "order": next_order,
        "createdAt": now,
        "updatedAt": now,
    }
    await db.projects.insert_one(doc)
    await audit_log(request, "project_create", user=user, target=doc["id"], detail=doc["title"])
    return serialize_doc(doc)


@api_router.put("/admin/projects/{project_id}")
@limiter.limit("30/minute")
async def update_project(request: Request, project_id: str, body: ProjectIn, user: dict = Depends(get_current_user)):
    existing = await db.projects.find_one({"id": project_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Project not found")
    updates = {
        "title": body.title.strip() or existing["title"],
        "tag": body.tag or "",
        "sub": body.sub or "",
        "color": body.color or "#0FB5A8",
        "image": body.image,
        "updatedAt": datetime.now(timezone.utc).isoformat(),
    }
    await db.projects.update_one({"id": project_id}, {"$set": updates})
    doc = await db.projects.find_one({"id": project_id})
    await audit_log(request, "project_update", user=user, target=project_id, detail=updates.get("title", ""))
    return serialize_doc(doc)


@api_router.put("/admin/projects/{project_id}/move")
@limiter.limit("30/minute")
async def move_project(request: Request, project_id: str, direction: str = Query(...), user: dict = Depends(get_current_user)):
    if direction not in ("up", "down"):
        raise HTTPException(status_code=400, detail="direction must be 'up' or 'down'")
    current = await db.projects.find_one({"id": project_id})
    if not current:
        raise HTTPException(status_code=404, detail="Project not found")
    neighbor = await db.projects.find_one(
        {"order": {"$lt": current["order"]} if direction == "up" else {"$gt": current["order"]}},
        sort=[("order", -1 if direction == "up" else 1)],
    )
    if not neighbor:
        return {"ok": True}
    await db.projects.update_one({"id": current["id"]}, {"$set": {"order": neighbor["order"]}})
    await db.projects.update_one({"id": neighbor["id"]}, {"$set": {"order": current["order"]}})
    return {"ok": True}


@api_router.delete("/admin/projects/{project_id}")
@limiter.limit("30/minute")
async def delete_project(request: Request, project_id: str, user: dict = Depends(get_current_user)):
    res = await db.projects.delete_one({"id": project_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    await audit_log(request, "project_delete", user=user, target=project_id)
    return {"ok": True}


# ---------- Announcements ----------

@api_router.get("/announcements")
async def list_announcements():
    cursor = db.announcements.find({"active": True}).sort("createdAt", 1)
    return [serialize_doc(d) async for d in cursor]


@api_router.get("/admin/announcements")
async def list_all_announcements(user: dict = Depends(get_current_user)):
    cursor = db.announcements.find({}).sort("createdAt", 1)
    return [serialize_doc(d) async for d in cursor]


@api_router.post("/admin/announcements")
@limiter.limit("30/minute")
async def create_announcement(request: Request, body: AnnouncementIn, user: dict = Depends(get_current_user)):
    now = datetime.now(timezone.utc).isoformat()
    doc = {
        "id": str(uuid.uuid4()),
        "text": body.text.strip(),
        "link": body.link or None,
        "active": bool(body.active),
        "createdAt": now,
        "updatedAt": now,
    }
    await db.announcements.insert_one(doc)
    await audit_log(request, "announcement_create", user=user, target=doc["id"], detail=doc["text"])
    return serialize_doc(doc)


@api_router.put("/admin/announcements/{announcement_id}")
@limiter.limit("30/minute")
async def update_announcement(
    request: Request, announcement_id: str, body: AnnouncementIn, user: dict = Depends(get_current_user)
):
    existing = await db.announcements.find_one({"id": announcement_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Announcement not found")
    updates = {
        "text": body.text.strip() or existing["text"],
        "link": body.link or None,
        "active": bool(body.active),
        "updatedAt": datetime.now(timezone.utc).isoformat(),
    }
    await db.announcements.update_one({"id": announcement_id}, {"$set": updates})
    doc = await db.announcements.find_one({"id": announcement_id})
    await audit_log(request, "announcement_update", user=user, target=announcement_id)
    return serialize_doc(doc)


@api_router.delete("/admin/announcements/{announcement_id}")
@limiter.limit("30/minute")
async def delete_announcement(request: Request, announcement_id: str, user: dict = Depends(get_current_user)):
    res = await db.announcements.delete_one({"id": announcement_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Announcement not found")
    await audit_log(request, "announcement_delete", user=user, target=announcement_id)
    return {"ok": True}


# ---------- Submissions (iPD-CP applications + Share-an-Idea) ----------

async def create_submission(request: Request, sub_type: str, body: SubmissionIn) -> dict:
    email = (body.email or "").strip().lower()
    if "@" not in email or "." not in email.split("@")[-1]:
        raise HTTPException(status_code=400, detail="Enter a valid email address")
    now = datetime.now(timezone.utc).isoformat()
    doc = {
        "id": str(uuid.uuid4()),
        "type": sub_type,
        "name": body.name.strip(),
        "email": email,
        "phone": (body.phone or "").strip() or None,
        "message": (body.message or "").strip(),
        "link": (body.link or "").strip() or None,
        "read": False,
        "createdAt": now,
    }
    await db.submissions.insert_one(doc)
    await audit_log(request, f"submission_{sub_type}", target=doc["id"], detail=email)
    return serialize_doc(doc)


@api_router.post("/apply")
@limiter.limit("5/minute")
async def apply_ipdcp(request: Request, body: SubmissionIn):
    doc = await create_submission(request, "ipdcp_application", body)
    return {"ok": True, "id": doc["id"]}


@api_router.post("/share-idea")
@limiter.limit("5/minute")
async def share_idea(request: Request, body: SubmissionIn):
    doc = await create_submission(request, "share_idea", body)
    return {"ok": True, "id": doc["id"]}


@api_router.get("/admin/submissions")
async def list_submissions(
    type: Optional[str] = Query(None), user: dict = Depends(get_current_user)
):
    q = {"type": type} if type else {}
    cursor = db.submissions.find(q).sort("createdAt", -1)
    return [serialize_doc(d) async for d in cursor]


@api_router.put("/admin/submissions/{submission_id}/read")
@limiter.limit("60/minute")
async def mark_submission_read(request: Request, submission_id: str, user: dict = Depends(get_current_user)):
    res = await db.submissions.update_one({"id": submission_id}, {"$set": {"read": True}})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Submission not found")
    return {"ok": True}


@api_router.delete("/admin/submissions/{submission_id}")
@limiter.limit("30/minute")
async def delete_submission(request: Request, submission_id: str, user: dict = Depends(get_current_user)):
    res = await db.submissions.delete_one({"id": submission_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Submission not found")
    await audit_log(request, "submission_delete", user=user, target=submission_id)
    return {"ok": True}


# ---------- Media Upload ----------

@api_router.post("/admin/upload")
@limiter.limit("20/minute")
async def upload(request: Request, file: UploadFile = File(...), user: dict = Depends(get_current_user)):
    data = await file.read()

    if len(data) > MAX_UPLOAD_SIZE:
        await audit_log(request, "upload_rejected", user=user, detail="too_large", success=False)
        raise HTTPException(status_code=413, detail="File too large (max 10MB)")

    sniffed = sniff_image(data)
    if not sniffed:
        await audit_log(request, "upload_rejected", user=user, detail="not_an_image", success=False)
        raise HTTPException(status_code=400, detail="Only jpg, png, gif or webp images are allowed")
    ext, content_type = sniffed

    path = f"{APP_NAME}/uploads/{user['id']}/{uuid.uuid4()}.{ext}"
    result = put_object(path, data, content_type)
    # Reference in DB
    await db.files.insert_one(
        {
            "id": str(uuid.uuid4()),
            "storage_path": result["path"],
            "uploader_id": user["id"],
            "original_filename": file.filename,
            "content_type": content_type,
            "size": result.get("size", len(data)),
            "is_deleted": False,
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
    )
    await audit_log(request, "upload", user=user, target=result["path"])
    public_url = f"/api/files/{result['path']}"
    return {"url": public_url, "path": result["path"], "size": result.get("size", len(data))}


@api_router.get("/files/{path:path}")
async def serve_file(path: str):
    record = await db.files.find_one({"storage_path": path, "is_deleted": False})
    if not record:
        raise HTTPException(status_code=404, detail="File not found")
    try:
        data, content_type = get_object(path)
    except ClientError:
        raise HTTPException(status_code=404, detail="File not in storage")
    return Response(
        content=data,
        media_type=record.get("content_type") or content_type,
        headers={"Cache-Control": "public, max-age=86400"},
    )


# ---------- Health ----------

@api_router.get("/")
async def root():
    return {"status": "ok", "service": "cipd-cms"}


# ---------- Startup ----------

async def seed_admin():
    user = await db.users.find_one({"email": ADMIN_EMAIL})
    if user is None:
        new_user = {
            "id": str(uuid.uuid4()),
            "email": ADMIN_EMAIL,
            "password_hash": hash_password(ADMIN_PASSWORD),
            "name": ADMIN_NAME,
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
        await db.users.insert_one(new_user)
        logger.info(f"Seeded admin user: {ADMIN_EMAIL}")
    else:
        # keep password in sync with env
        if not verify_password(ADMIN_PASSWORD, user.get("password_hash", "")):
            await db.users.update_one(
                {"email": ADMIN_EMAIL},
                {"$set": {"password_hash": hash_password(ADMIN_PASSWORD)}},
            )
            logger.info(f"Updated admin password for {ADMIN_EMAIL}")


async def seed_initial_blogs():
    """Seed two starter blogs (Wikipedia content) if collection is empty."""
    count = await db.blogs.count_documents({})
    if count > 0:
        return
    admin = await db.users.find_one({"email": ADMIN_EMAIL})
    if not admin:
        return
    author = {
        "id": admin["id"],
        "name": admin.get("name", ""),
        "email": admin["email"],
        "role": "Faculty · CiPD",
    }
    now = datetime.now(timezone.utc).isoformat()
    seeds = [
        {
            "title": "On Proto-Languages",
            "excerpt": "How we reconstruct the ancestor of a language family — and what that tells us about reconstruction in any system.",
            "tag": "Essay",
            "paragraphs": [
                "In the tree model of historical linguistics, a proto-language is a postulated ancestral language from which a number of attested languages are believed to have descended by evolution, forming a language family. Proto-languages are usually unattested, or partially attested at best. They are reconstructed by way of the comparative method.",
                "In the family-tree metaphor, a proto-language can be called a mother language. Occasionally, the German term Ursprache (from ur- 'primordial, original' + Sprache 'language') is used instead. It is also sometimes called the common or primitive form of a language — Common Germanic, Primitive Norse.",
                "Typically, the proto-language is not known directly. It is by definition a linguistic reconstruction formulated by applying the comparative method to a group of languages featuring similar characteristics. The tree is a statement of similarity and a hypothesis that the similarity results from descent from a common language.",
                "The comparative method, a process of deduction, begins from a set of characteristics found in the attested languages. If the entire set can be accounted for by descent from the proto-language — which must contain the proto-forms of them all — the tree, or phylogeny, is regarded as a complete explanation and, by Occam's razor, given credibility.",
                "Some universally accepted proto-languages are Proto-Afroasiatic, Proto-Indo-European, Proto-Uralic and Proto-Dravidian. In a few fortuitous instances — Latin for the Romance languages, Vedic Sanskrit for the Indo-Aryan languages — a literary history exists from as early as a few millennia ago, allowing descent to be traced in detail.",
                "There are no objective criteria for the evaluation of different reconstruction systems yielding different proto-languages. Many researchers concerned with linguistic reconstruction agree that the traditional comparative method is an 'intuitive undertaking.' Every reconstructed system is also a portrait of its reconstructor.",
            ],
        },
        {
            "title": "What Is a Blog, Really?",
            "excerpt": "A short anthropology of the form — from late-90s diary pages to the multi-author publications of today.",
            "tag": "Note",
            "paragraphs": [
                "A blog — a truncation of 'weblog' — is an informational website consisting of discrete, often informal diary-style text entries also known as posts. Posts are typically displayed in reverse chronological order so that the most recent post appears first.",
                "In the 2000s, blogs were often the work of a single individual, occasionally of a small group, and often covered a single subject or topic. In the 2010s, multi-author blogs (MABs) emerged, featuring the writing of multiple authors, sometimes professionally edited.",
                "The emergence and growth of blogs in the late 1990s coincided with the advent of web publishing tools that facilitated the posting of content by non-technical users who did not have much experience with HTML or computer programming.",
                "Many blogs provide commentary on a particular subject or topic, ranging from philosophy, religion and arts to science, politics and sports. Others function as more personal online diaries or as online brand advertising of a particular individual or company.",
                "The term 'weblog' was coined by Jorn Barger on 17 December 1997. The short form 'blog' was coined by Peter Merholz, who jokingly broke the word weblog into the phrase 'we blog' in the sidebar of his blog Peterme.com in May 1999.",
            ],
        },
    ]
    for s in seeds:
        # Build a tiptap-compatible JSON document
        content = {
            "type": "doc",
            "content": [
                {"type": "paragraph", "content": [{"type": "text", "text": p}]}
                for p in s["paragraphs"]
            ],
        }
        doc = {
            "id": str(uuid.uuid4()),
            "title": s["title"],
            "slug": await ensure_unique_slug(slugify(s["title"])),
            "excerpt": s["excerpt"],
            "content": content,
            "coverImage": None,
            "tag": s["tag"],
            "author": author,
            "published": True,
            "createdAt": now,
            "updatedAt": now,
        }
        await db.blogs.insert_one(doc)
    logger.info("Seeded initial blogs")


@app.on_event("startup")
async def on_startup():
    await db.users.create_index("email", unique=True)
    await db.blogs.create_index("slug", unique=True)
    await db.blogs.create_index("published")
    await db.events.create_index("date")
    await db.announcements.create_index("active")
    await db.submissions.create_index("type")
    await db.submissions.create_index("createdAt")
    await db.audit_logs.create_index("timestamp")
    await db.audit_logs.create_index("actor_email")
    await seed_admin()
    await seed_initial_blogs()
    if not S3_BUCKET_NAME:
        logger.warning("S3_BUCKET_NAME not set — media uploads will fail until it's configured")


@app.on_event("shutdown")
async def on_shutdown():
    client.close()


# ---------- Include router + middleware ----------

app.include_router(api_router)


@app.middleware("http")
async def security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
    response.headers["Content-Security-Policy"] = (
        "default-src 'self'; img-src 'self' data: https:; media-src 'self' https:; "
        "script-src 'self'; style-src 'self' 'unsafe-inline'; frame-ancestors 'none'"
    )
    response.headers["Strict-Transport-Security"] = "max-age=63072000; includeSubDomains"
    return response


app.add_middleware(SlowAPIMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
