import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "@/admin/AdminLayout";
import { api } from "@/lib/api";
import { FileText, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function AdminDashboard() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/admin/blogs")
      .then((r) => setBlogs(r.data))
      .finally(() => setLoading(false));
  }, []);

  const published = blogs.filter((b) => b.published).length;
  const drafts = blogs.length - published;
  const recent = blogs.slice(0, 5);

  return (
    <AdminLayout title="Dashboard">
      <div className="grid sm:grid-cols-3 gap-5 mb-12">
        {[
          { label: "All blogs", value: blogs.length, icon: FileText },
          { label: "Published", value: published, icon: Eye },
          { label: "Drafts", value: drafts, icon: EyeOff },
        ].map((s) => (
          <div
            key={s.label}
            className="p-6 rounded-2xl border"
            style={{ borderColor: "var(--border-soft)" }}
            data-testid={`stat-${s.label.toLowerCase()}`}
          >
            <s.icon className="w-5 h-5 mb-6 text-ink-3" />
            <div
              className="font-display font-extrabold tracking-[-0.03em] leading-none"
              style={{ fontSize: "clamp(2rem, 3vw, 2.6rem)" }}
            >
              {loading ? "—" : s.value}
            </div>
            <div className="mt-3 text-[11px] uppercase tracking-[0.22em] text-ink-3">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-end justify-between mb-6">
        <h2 className="font-display font-bold text-[20px]">Recent</h2>
        <Link
          to="/admin/blogs"
          className="link-underline text-[13px] text-ink-2"
          data-testid="dashboard-see-all"
        >
          See all →
        </Link>
      </div>
      <ul
        className="rounded-2xl border divide-y"
        style={{ borderColor: "var(--border-soft)" }}
      >
        {loading && (
          <li className="px-6 py-5 text-ink-3 text-[13px]">Loading…</li>
        )}
        {!loading && recent.length === 0 && (
          <li className="px-6 py-8 text-ink-3 text-[13.5px] text-center">
            No blogs yet —{" "}
            <Link to="/admin/blogs/new" className="link-underline text-ink">
              create your first one
            </Link>
          </li>
        )}
        {recent.map((b) => (
          <li key={b.id} className="px-6 py-5 flex items-center gap-5">
            <span
              className={`inline-block w-2 h-2 rounded-full ${
                b.published ? "bg-emerald-500" : "bg-amber-400"
              }`}
            />
            <Link
              to={`/admin/blogs/edit/${b.id}`}
              className="font-display font-medium text-[15px] flex-1 truncate hover:underline"
              data-testid={`recent-${b.id}`}
            >
              {b.title}
            </Link>
            <span className="text-[11px] uppercase tracking-[0.18em] text-ink-3">
              {b.published ? "Live" : "Draft"}
            </span>
            <Link
              to={`/admin/blogs/edit/${b.id}`}
              className="text-ink-2 hover:text-ink"
            >
              <ArrowRight className="w-4 h-4" />
            </Link>
          </li>
        ))}
      </ul>
    </AdminLayout>
  );
}
