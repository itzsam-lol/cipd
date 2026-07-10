import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import AdminLayout from "@/admin/AdminLayout";
import TipTapEditor from "@/admin/TipTapEditor";
import BlogPreviewModal from "@/admin/BlogPreviewModal";
import { api, formatApiError } from "@/lib/api";
import { ArrowLeft, ImageIcon, X, Eye, Save } from "lucide-react";

const EMPTY_DOC = { type: "doc", content: [{ type: "paragraph" }] };

export default function AdminBlogEditor() {
  const { id } = useParams();
  const nav = useNavigate();
  const isNew = !id;

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [tag, setTag] = useState("Note");
  const [content, setContent] = useState(EMPTY_DOC);
  const [coverImage, setCoverImage] = useState(null);
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [slug, setSlug] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const fileRef = useRef(null);
  const excerptRef = useRef(null);

  const resizeExcerpt = () => {
    const el = excerptRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  useEffect(() => {
    resizeExcerpt();
  }, [excerpt, loading]);

  useEffect(() => {
    if (isNew) return;
    api
      .get(`/admin/blogs/${id}`)
      .then((r) => {
        const b = r.data;
        setTitle(b.title || "");
        setExcerpt(b.excerpt || "");
        setTag(b.tag || "Note");
        setContent(b.content || EMPTY_DOC);
        setCoverImage(b.coverImage || null);
        setPublished(!!b.published);
        setSlug(b.slug || "");
      })
      .catch((e) => setErr(formatApiError(e)))
      .finally(() => setLoading(false));
  }, [id, isNew]);

  const save = async (override = {}) => {
    setErr("");
    setSaving(true);
    const body = {
      title,
      excerpt,
      tag,
      content,
      coverImage,
      published,
      ...override,
    };
    try {
      const { data } = isNew
        ? await api.post("/admin/blogs", body)
        : await api.put(`/admin/blogs/${id}`, body);
      if (isNew) {
        nav(`/admin/blogs/edit/${data.id}`, { replace: true });
      } else {
        setSlug(data.slug);
        setPublished(data.published);
      }
      return data;
    } catch (e) {
      setErr(formatApiError(e));
      return null;
    } finally {
      setSaving(false);
    }
  };

  const onCover = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    try {
      const { data } = await api.post("/admin/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setCoverImage(`${process.env.REACT_APP_BACKEND_URL}${data.url}`);
    } catch (e2) {
      setErr(formatApiError(e2, "Upload failed"));
    } finally {
      e.target.value = "";
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-ink-3 text-[13px]">Loading…</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Sticky action bar */}
      <div
        className="flex items-center justify-between mb-12 flex-wrap gap-4 pb-6 border-b"
        style={{ borderColor: "var(--border-soft)" }}
      >
        <Link
          to="/admin/blogs"
          className="inline-flex items-center gap-2 text-[13px] text-ink-3 hover:text-ink"
        >
          <ArrowLeft className="w-4 h-4" /> All blogs
        </Link>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-[11px] uppercase tracking-[0.18em] text-ink-3">
            {published ? "Published" : "Draft"}
          </span>
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            disabled={!title.trim()}
            className="inline-flex items-center gap-2 text-[13px] text-ink-2 hover:text-ink disabled:opacity-40"
            data-testid="preview-link"
          >
            <Eye className="w-4 h-4" /> Preview
          </button>
          {!isNew && slug && published && (
            <Link
              to={`/blogs/${slug}`}
              target="_blank"
              className="inline-flex items-center gap-2 text-[13px] text-ink-3 hover:text-ink"
              data-testid="view-live-link"
            >
              View live
            </Link>
          )}
          <button
            type="button"
            onClick={() => save({ published: false })}
            disabled={saving}
            data-testid="save-draft"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[13px] border text-ink-2 hover:text-ink disabled:opacity-50"
            style={{ borderColor: "var(--border-soft)" }}
          >
            <Save className="w-4 h-4" /> Save draft
          </button>
          <button
            type="button"
            onClick={() => save({ published: true })}
            disabled={saving || !title.trim()}
            data-testid="publish-blog"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-[13px] font-medium disabled:opacity-60"
            style={{ background: "var(--ink)", color: "var(--bg)" }}
          >
            {published ? "Update" : "Publish"}
          </button>
        </div>
      </div>

      {err && (
        <div
          className="mb-6 px-4 py-3 rounded-lg text-[13px] max-w-[720px] mx-auto"
          style={{
            background: "color-mix(in srgb, #ec1e79 12%, transparent)",
            color: "#ec1e79",
          }}
        >
          {err}
        </div>
      )}

      <div className="tt-medium-page">
        {/* Cover image */}
        <div className="tt-cover">
          {coverImage ? (
            <div className="tt-cover-img">
              <img src={coverImage} alt="" />
              <button
                type="button"
                onClick={() => setCoverImage(null)}
                data-testid="remove-cover"
                className="tt-cover-x"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              data-testid="upload-cover"
              className="tt-cover-empty"
            >
              <ImageIcon className="w-5 h-5 mr-2" />
              <span>Add a cover image</span>
            </button>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onCover}
          />
        </div>

        {/* Title */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          data-testid="blog-title"
          className="tt-medium-title"
        />

        {/* Subtitle */}
        <textarea
          ref={excerptRef}
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          onInput={resizeExcerpt}
          placeholder="Add a description…"
          data-testid="blog-excerpt"
          rows={2}
          className="tt-medium-subtitle"
        />

        {/* Tag pill */}
        <div className="tt-medium-meta">
          <span className="tt-meta-label">Tag</span>
          <select
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            data-testid="blog-tag"
            className="tt-meta-select"
          >
            {["Note", "Essay", "Research", "Field Report", "Announcement"].map((t) => (
              <option key={t} value={t} style={{ background: "var(--bg)" }}>
                {t}
              </option>
            ))}
          </select>
          {!isNew && slug && (
            <span className="tt-meta-slug">/blogs/{slug}</span>
          )}
        </div>

        {/* Content */}
        <TipTapEditor value={content} onChange={setContent} />

        <div className="tt-medium-help">
          Type <kbd>/</kbd> on a new line for commands. Drop or paste images
          directly. Select text for formatting.
        </div>
      </div>

      <BlogPreviewModal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title={title}
        excerpt={excerpt}
        tag={tag}
        content={content}
        coverImage={coverImage}
      />
    </AdminLayout>
  );
}
