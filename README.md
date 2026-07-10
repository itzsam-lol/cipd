# CiPD — Centre for Intelligent Product Development, IIIT Delhi

A premium, editorial-grade website + CMS for the Centre for Intelligent Product Development (CiPD) at IIIT-Delhi.

Designed to feel like Apple / Stripe / Linear — generous typography, large visual storytelling sections, an interactive 3D logo, dark/light themes, and a fully self-hosted Medium-style blogging platform under `/admin`.

> Goal: When a student or sponsor visits, they should think — *"These people build interesting things, and I want to work with them."*

---

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Features](#features)
5. [Setup & Local Development](#setup--local-development)
6. [Environment Variables](#environment-variables)
7. [API Reference](#api-reference)
8. [Database Schema](#database-schema)
9. [CMS Usage Guide](#cms-usage-guide)
10. [Admin Credentials](#admin-credentials)
11. [Implementation Notes & Gotchas](#implementation-notes--gotchas)
12. [Roadmap / Future Plans](#roadmap--future-plans)

---

## Overview

CiPD is split into two halves:

- **Public site** — Home, iPD-CP (program page), and Blogs. Editorial storytelling, custom typography, a cursor-reactive Three.js blob, smooth dark/light theme switching.
- **CMS (`/admin`)** — JWT-protected dashboard with full CRUD for blog posts, a Medium-style Tiptap rich-text editor (slash commands, bubble toolbar, captioned standalone images/videos), and media uploads to AWS S3.

The public Blogs page consumes the same FastAPI backend, so anything published in the CMS appears live instantly with computed reading time and Tiptap-rendered content.

---

## Tech Stack

### Frontend
- **React 19** + Create React App (via `craco`)
- **Tailwind CSS** + shadcn/ui primitives
- **Three.js** (vanilla — *not* react-three-fiber, see [Gotchas](#implementation-notes--gotchas))
- **Tiptap v3** — `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-image`, `@tiptap/extension-link`, `@tiptap/extension-placeholder`, `@tiptap/extension-youtube`
- **Framer Motion** — scroll-triggered parallax & horizontal-scroll Projects
- **lucide-react** — icons
- **next-themes** — dark/light mode persistence
- **React Router v7** — public + admin routing
- **Plus Jakarta Sans** (headings) + **Inter** (body) — Google Fonts
- **Axios** — API client

### Backend
- **FastAPI** (`uvicorn`) on `0.0.0.0:8001`
- **MongoDB** (via `motor` + `pymongo`)
- **PyJWT** + `bcrypt` for auth
- **boto3** — AWS S3 for media storage
- **slowapi** — rate limiting on auth/admin routes

### Infrastructure
- All routing prefixed with `/api` is forwarded to FastAPI
- Frontend served on port `3000`, backend on `8001`

---

## Project Structure

```
/app
├── backend/
│   ├── .env                       # MONGO_URL, DB_NAME, JWT_SECRET, S3_BUCKET_NAME
│   ├── requirements.txt
│   └── server.py                  # FastAPI app — auth, CRUD, uploads, file proxy
│
├── frontend/
│   ├── package.json
│   ├── tailwind.config.js
│   ├── public/index.html
│   └── src/
│       ├── App.js                 # Router — public + admin routes
│       ├── index.css              # Global Tailwind + CSS variables
│       │
│       ├── pages/                 # Public pages
│       │   ├── Home.jsx
│       │   ├── IpdCp.jsx          # iPD Capstone Program page
│       │   ├── Blogs.jsx          # Public listing
│       │   ├── BlogPost.jsx       # /blogs/:slug
│       │   └── Login.jsx
│       │
│       ├── admin/                 # CMS
│       │   ├── AdminLayout.jsx
│       │   ├── AdminDashboard.jsx
│       │   ├── AdminBlogs.jsx
│       │   ├── AdminBlogEditor.jsx
│       │   ├── TipTapEditor.jsx   # Medium-style editor core
│       │   ├── BubbleToolbar.jsx
│       │   ├── SlashMenu.jsx
│       │   └── extensions/
│       │       ├── CaptionedImage.jsx
│       │       ├── CaptionedYoutube.jsx
│       │       └── slashItems.js
│       │
│       ├── auth/
│       │   ├── AuthContext.jsx
│       │   └── ProtectedRoute.jsx
│       │
│       ├── components/            # Public-site UI
│       │   ├── Nav.jsx, Hero.jsx, Story.jsx
│       │   ├── BlobScene.jsx      # Vanilla Three.js
│       │   ├── Projects.jsx, Events.jsx, FeaturedVideo.jsx
│       │   ├── StudentExperience.jsx, ShareIdeas.jsx, Connect.jsx
│       │   ├── ThemeToggle.jsx, SmoothScroll.jsx, Cursor.jsx
│       │   ├── Logo.jsx
│       │   └── TiptapRender.jsx   # Renders Tiptap JSON on public pages
│       │
│       ├── lib/
│       │   ├── api.js             # Axios client (uses REACT_APP_BACKEND_URL)
│       │   └── readingTime.js
│       │
│       └── styles/
│           └── tiptap.css         # Medium-style editor + render styles
│
└── memory/
    ├── PRD.md
    └── test_credentials.md
```

---

## Features

### Public Site
- Sticky glass nav with anchor links, logo, theme toggle, Apply CTA
- Massive editorial hero — *"Ideas. Products. Impact."* + cursor-reactive 3D blob
- Storytelling scroll: Idea → Research → Development → Impact
- Featured YouTube short in 9:16 frame
- Apple-style horizontal-scroll Projects
- Timeline-style Events
- Asymmetric bento Student Experience gallery
- Share-an-Idea CTA
- Footer with contact + Maps iframe + socials
- **Dark / light theme toggle** (persisted via `next-themes`)
- **iPD-CP page** with gradient continuous-flow text + branded logo
- **Blogs index** + dynamic `/blogs/:slug` post pages with computed reading time

### CMS (`/admin`)
- JWT login (mock auth, see [Roadmap](#roadmap--future-plans))
- Dashboard with blog stats
- Blog list with publish/unpublish toggle, delete, edit
- Editor:
  - Title + slug + excerpt + cover image
  - **Medium-style Tiptap editor** — type `/` for slash menu (heading, quote, code, image, video, divider, list)
  - **Bubble toolbar** on text selection (bold, italic, link, headings, etc.)
  - **Block-level captioned images & YouTube videos** (custom Tiptap nodes — `CaptionedImage`, `CaptionedYoutube`)
  - Media uploads to AWS S3
- Save as draft / Publish

---

## Setup & Local Development

### Backend
```bash
cd /app/backend
pip install -r requirements.txt
# supervisor handles starting; manual run:
# uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

### Frontend
```bash
cd /app/frontend
yarn install
yarn start          # CRA on :3000
```

### Restart services
```bash
sudo supervisorctl restart backend
sudo supervisorctl restart frontend
```

### Logs
```bash
tail -n 200 /var/log/supervisor/backend.err.log
tail -n 200 /var/log/supervisor/frontend.err.log
```

---

## Environment Variables

### `backend/.env`
| Key | Purpose |
|-----|---------|
| `MONGO_URL` | MongoDB connection string |
| `DB_NAME` | Mongo database name |
| `JWT_SECRET` | JWT signing key |
| `S3_BUCKET_NAME` | AWS S3 bucket used for media storage |
| `AWS_REGION` | AWS region for the S3 bucket (e.g. `ap-south-1`) |
| `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` | IAM credentials with read/write access to the bucket (omit if running on infra with an attached IAM role) |
| `CORS_ORIGINS` | Comma-separated allowed frontend origin(s), e.g. `https://cipd.iiitd.ac.in`. Defaults to localhost-only if unset — **must** be set in production. |

### `frontend/.env`
| Key | Purpose |
|-----|---------|
| `REACT_APP_BACKEND_URL` | Public backend URL — all API calls must use this |
| `GENERATE_SOURCEMAP` | `false` (avoids missing R3F transitive sourcemaps) |

> **Never** hardcode URLs, ports, or secrets in source files. Always read from env.

---

## API Reference

All routes prefixed with `/api`. Auth routes return a JWT — pass via `Authorization: Bearer <token>`.

### Auth
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/login` | Email + password → JWT |
| GET | `/api/auth/me` | Current user from token |

### Public Blogs
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/blogs` | List published blogs |
| GET | `/api/blogs/{slug}` | Single blog by slug |

### Admin Blogs (requires JWT)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/admin/blogs` | List all (incl. drafts) |
| GET | `/api/admin/blogs/{id}` | Single by id |
| POST | `/api/admin/blogs` | Create |
| PUT | `/api/admin/blogs/{id}` | Update |
| DELETE | `/api/admin/blogs/{id}` | Delete |

### Media
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/admin/upload` | Multipart upload → AWS S3 |
| GET | `/api/files/{path}` | Proxy download from object storage |

---

## Database Schema

### `users`
```js
{
  email: string,
  password_hash: string,   // bcrypt
  role: "admin",
  created_at: ISODate
}
```

### `blogs`
```js
{
  title: string,
  slug: string,            // unique, URL-safe
  excerpt: string,
  content: object,         // Tiptap JSON document
  coverImage: string,      // /api/files/... path
  author: string,
  published: boolean,
  created_at: ISODate,
  updated_at: ISODate
}
```

### `files`
```js
{
  filename: string,
  path: string,            // object-storage key
  content_type: string,
  size: number,
  uploaded_by: string,     // user email
  uploaded_at: ISODate
}
```

---

## CMS Usage Guide

1. Go to `/login` and sign in with the admin credentials below.
2. Land on `/admin` — dashboard.
3. Click **New blog** → fill in title, slug, excerpt, upload cover.
4. In the body editor:
   - Just start typing for normal paragraphs.
   - Press `/` to open the **slash menu** — pick heading, quote, code, list, divider, image, or video.
   - **Select text** → a floating **bubble toolbar** appears for bold / italic / link / heading-2 / heading-3.
   - Inserting an image or YouTube embed creates a *block-level* element with a caption input below it.
5. **Save Draft** keeps it private; **Publish** makes it appear on `/blogs`.

---

## Admin Credentials

On first boot, the backend seeds one admin account from `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_NAME` in `backend/.env`. Set these to real values before deploying — **never commit them, and never use the package defaults (`admin@example.com` / `admin123`) outside local dev.**

- **URL:** `/login`

This is a seeded mock-login account. See [Roadmap](#roadmap--future-plans) for the planned Google OAuth migration, which will replace it.

---

## Implementation Notes & Gotchas

These are battle-scarred decisions — please respect them unless you've reproduced the original issue:

- **Three.js is vanilla, NOT react-three-fiber.** This was originally forced by a Babel plugin (since removed from `package.json`) that injected an `x-line-number` prop into every JSX element, which R3F rejected on intrinsic mesh/geometry/material tags. `BlobScene.jsx` builds everything via `new THREE.Mesh()` inside a `useEffect` instead. The plugin is gone now, but the vanilla approach hasn't been re-tested against R3F — **don't revert to JSX R3F tags** without verifying the scene still renders correctly.
- **`GENERATE_SOURCEMAP=false`** is set so R3F's transitive deps don't crash CRA with missing sourcemaps.
- **`craco.config.js`** excludes `source-map-loader` from `node_modules` for the same reason.
- **`main` uses `overflow: clip`**, not `overflow-hidden`, so the sticky horizontal-scroll Projects section behaves correctly.
- **Tiptap editor does NOT use shadcn components** — it uses `/app/frontend/src/styles/tiptap.css` to mimic Medium. The captioned image/video extensions render as **block-level** custom nodes, not inline images.
- **Lenis (smooth scroll) is disabled** — it interfered with programmatic `scrollTo` and screenshot tooling. Native CSS smooth-scroll is sufficient.
- All API calls **must** use `process.env.REACT_APP_BACKEND_URL` (never hardcode).
- Use **`yarn`** for frontend deps. `npm` causes breaking installs.

---

## Roadmap / Future Plans

### 🔴 P0 — Pre-deployment essentials
- [ ] **Google OAuth** restricted to `@iiitd.ac.in` domain — replaces mock JWT auth
- [ ] **"Access Denied"** fallback page for unauthorized email domains
- [ ] Production environment configuration & deploy

### 🟠 P1 — CMS quality of life
- [ ] **Auto-save** in the Tiptap editor (currently manual Save/Publish only)
- [ ] **Notion-style drag handle** on the left margin to reorder blocks
- [ ] **Cover-image cropper** modal before upload

### 🟢 P2 — Public-site polish
- [ ] **Per-blog reading-progress bar** on `/blogs/:slug`
- [ ] **Subscribe form** on the Blogs index → email capture into MongoDB
- [ ] **Keyboard shortcuts dialog** (`?`) in the editor showing all slash commands + bubble menu shortcuts
- [ ] Replace procedural 3D logo with **real Blender-exported CiPD logo**
- [ ] Self-hosted hero video (replace YouTube short)
- [ ] Newsletter subscription
- [ ] Locale support (Hindi)
- [ ] Persist *Share Idea* submissions to MongoDB + sponsor dashboard

---

## License

Internal — IIIT Delhi / CiPD. Not for redistribution.

## Authors

Centre for Intelligent Product Development, IIIT-Delhi.
