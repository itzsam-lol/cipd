import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "@/admin/AdminLayout";
import { api, formatApiError } from "@/lib/api";
import { PlusCircle, Eye, EyeOff, Pencil, Trash2 } from "lucide-react";

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = () =>
    api
      .get("/admin/blogs")
      .then((r) => setBlogs(r.data))
      .catch((e) => setError(formatApiError(e)))
      .finally(() => setLoading(false));

  useEffect(() => {
    reload();
  }, []);

  const togglePublish = async (b) => {
    try {
      await api.put(`/admin/blogs/${b.id}`, {
        title: b.title,
        excerpt: b.excerpt,
        content: b.content,
        coverImage: b.coverImage,
        tag: b.tag,
        published: !b.published,
      });
      reload();
    } catch (e) {
      setError(formatApiError(e));
    }
  };

  const del = async (b) => {
    if (!window.confirm(`Delete "${b.title}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/admin/blogs/${b.id}`);
      reload();
    } catch (e) {
      setError(formatApiError(e));
    }
  };

  return (
    <AdminLayout title="All blogs">
      <div className="flex items-center justify-between mb-8">
        <div className="text-[13px] text-ink-3">
          {loading ? "Loading…" : `${blogs.length} total`}
        </div>
        <Link
          to="/admin/blogs/new"
          data-testid="new-blog-btn"
          className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-medium"
          style={{ background: "var(--ink)", color: "var(--bg)" }}
        >
          <PlusCircle className="w-4 h-4" /> New blog
        </Link>
      </div>

      {error && (
        <div
          className="mb-6 px-4 py-3 rounded-lg text-[13px]"
          style={{
            background: "color-mix(in srgb, #ec1e79 12%, transparent)",
            color: "#ec1e79",
          }}
        >
          {error}
        </div>
      )}

      <div
        className="rounded-2xl border overflow-hidden"
        style={{ borderColor: "var(--border-soft)" }}
      >
        <div
          className="hidden sm:grid grid-cols-[1fr_120px_140px_180px] gap-4 px-6 py-4 text-[11px] uppercase tracking-[0.18em] text-ink-3 border-b"
          style={{ borderColor: "var(--border-soft)" }}
        >
          <div>Title</div>
          <div>Status</div>
          <div>Updated</div>
          <div className="text-right">Actions</div>
        </div>

        {!loading && blogs.length === 0 && (
          <div className="px-6 py-16 text-center text-ink-3 text-[13.5px]">
            No blogs yet —{" "}
            <Link to="/admin/blogs/new" className="link-underline text-ink">
              create your first one
            </Link>
          </div>
        )}

        <ul className="divide-y" style={{ borderColor: "var(--border-soft)" }}>
          {blogs.map((b) => (
            <li
              key={b.id}
              data-testid={`row-${b.id}`}
              className="px-6 py-5 grid grid-cols-1 sm:grid-cols-[1fr_120px_140px_180px] gap-4 items-center"
            >
              <div className="min-w-0">
                <Link
                  to={`/admin/blogs/edit/${b.id}`}
                  className="font-display font-medium text-[15.5px] truncate hover:underline block"
                >
                  {b.title}
                </Link>
                <div className="text-[12.5px] text-ink-3 truncate mt-1">
                  /{b.slug}
                </div>
              </div>
              <div>
                <span
                  className={`inline-flex items-center gap-1.5 text-[12px] px-2.5 py-1 rounded-full ${
                    b.published
                      ? "bg-emerald-500/10 text-emerald-600"
                      : "bg-amber-500/10 text-amber-600"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      b.published ? "bg-emerald-500" : "bg-amber-500"
                    }`}
                  />
                  {b.published ? "Published" : "Draft"}
                </span>
              </div>
              <div className="text-[12.5px] text-ink-3">
                {new Date(b.updatedAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </div>
              <div className="flex items-center gap-1 sm:justify-end">
                <button
                  onClick={() => togglePublish(b)}
                  data-testid={`toggle-${b.id}`}
                  className="p-2 rounded-lg hover:bg-[color-mix(in_srgb,var(--ink)_6%,transparent)] text-ink-2 hover:text-ink"
                  title={b.published ? "Unpublish" : "Publish"}
                >
                  {b.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <Link
                  to={`/admin/blogs/edit/${b.id}`}
                  className="p-2 rounded-lg hover:bg-[color-mix(in_srgb,var(--ink)_6%,transparent)] text-ink-2 hover:text-ink"
                  title="Edit"
                >
                  <Pencil className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => del(b)}
                  data-testid={`delete-${b.id}`}
                  className="p-2 rounded-lg hover:bg-[color-mix(in_srgb,#ec1e79_10%,transparent)] text-ink-2 hover:text-[#ec1e79]"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </AdminLayout>
  );
}
