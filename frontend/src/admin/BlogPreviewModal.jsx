import { X } from "lucide-react";
import BlogArticle from "@/components/BlogArticle";
import { useAuth } from "@/auth/AuthContext";

export default function BlogPreviewModal({ open, onClose, title, excerpt, tag, content, coverImage, createdAt }) {
  const { user } = useAuth();

  if (!open) return null;

  const blog = {
    title,
    excerpt,
    tag,
    content,
    coverImage,
    createdAt: createdAt || new Date().toISOString(),
    author: { name: user?.name || "CiPD", role: "Faculty · CiPD" },
  };

  return (
    <div data-testid="blog-preview-modal" className="fixed inset-0 z-[100] overflow-y-auto" style={{ background: "var(--bg)" }}>
      <div
        className="sticky top-0 z-10 flex items-center justify-between px-6 sm:px-10 py-4 backdrop-blur-xl border-b"
        style={{ background: "color-mix(in srgb, var(--bg) 88%, transparent)", borderColor: "var(--border-soft)" }}
      >
        <span className="text-[11px] uppercase tracking-[0.22em] text-ink-3">
          Preview — this is not published
        </span>
        <button
          type="button"
          onClick={onClose}
          data-testid="close-blog-preview"
          className="inline-flex items-center gap-2 text-[13px] text-ink-2 hover:text-ink"
        >
          <X className="w-4 h-4" /> Close preview
        </button>
      </div>

      <article className="px-6 sm:px-10 pt-16 pb-28">
        <div style={{ maxWidth: "var(--read-width)", margin: "0 auto" }}>
          <BlogArticle blog={blog} animate={false} />
        </div>
      </article>
    </div>
  );
}
