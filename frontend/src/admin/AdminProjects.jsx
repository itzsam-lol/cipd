import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "@/admin/AdminLayout";
import { api, formatApiError } from "@/lib/api";
import { PlusCircle, Pencil, Trash2, ChevronUp, ChevronDown } from "lucide-react";

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = () =>
    api
      .get("/admin/projects")
      .then((r) => setProjects(r.data))
      .catch((e) => setError(formatApiError(e)))
      .finally(() => setLoading(false));

  useEffect(() => {
    reload();
  }, []);

  const move = async (p, direction) => {
    try {
      await api.put(`/admin/projects/${p.id}/move`, null, { params: { direction } });
      reload();
    } catch (e) {
      setError(formatApiError(e));
    }
  };

  const del = async (p) => {
    if (!window.confirm(`Delete "${p.title}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/admin/projects/${p.id}`);
      reload();
    } catch (e) {
      setError(formatApiError(e));
    }
  };

  return (
    <AdminLayout title="Featured projects">
      <p className="text-[13.5px] text-ink-2 mb-8 max-w-[560px]">
        These appear in the horizontal-scroll Projects section on the
        homepage, in this order.
      </p>

      <div className="flex items-center justify-between mb-8">
        <div className="text-[13px] text-ink-3">
          {loading ? "Loading…" : `${projects.length} total`}
        </div>
        <Link
          to="/admin/projects/new"
          data-testid="new-project-btn"
          className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-medium"
          style={{ background: "var(--ink)", color: "var(--bg)" }}
        >
          <PlusCircle className="w-4 h-4" /> New project
        </Link>
      </div>

      {error && (
        <div
          className="mb-6 px-4 py-3 rounded-lg text-[13px]"
          style={{ background: "color-mix(in srgb, #ec1e79 12%, transparent)", color: "#ec1e79" }}
        >
          {error}
        </div>
      )}

      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "var(--border-soft)" }}>
        {!loading && projects.length === 0 && (
          <div className="px-6 py-16 text-center text-ink-3 text-[13.5px]">
            No projects yet —{" "}
            <Link to="/admin/projects/new" className="link-underline text-ink">
              add your first one
            </Link>
          </div>
        )}

        <ul className="divide-y" style={{ borderColor: "var(--border-soft)" }}>
          {projects.map((p, i) => (
            <li
              key={p.id}
              data-testid={`project-row-${p.id}`}
              className="px-6 py-5 flex items-center gap-4"
            >
              <div className="flex flex-col shrink-0">
                <button
                  onClick={() => move(p, "up")}
                  disabled={i === 0}
                  className="p-1 text-ink-3 hover:text-ink disabled:opacity-20"
                  title="Move up"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => move(p, "down")}
                  disabled={i === projects.length - 1}
                  className="p-1 text-ink-3 hover:text-ink disabled:opacity-20"
                  title="Move down"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              <div
                className="w-14 h-14 rounded-xl overflow-hidden shrink-0 flex items-center justify-center"
                style={{ background: p.color || "var(--teal)" }}
              >
                {p.image && (
                  <img src={p.image} alt="" className="w-full h-full object-cover" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <Link
                  to={`/admin/projects/edit/${p.id}`}
                  className="font-display font-medium text-[15.5px] truncate hover:underline block"
                >
                  {p.title}
                </Link>
                <div className="text-[12.5px] text-ink-3 truncate mt-1">
                  {p.tag || "—"}
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <Link
                  to={`/admin/projects/edit/${p.id}`}
                  className="p-2 rounded-lg hover:bg-[color-mix(in_srgb,var(--ink)_6%,transparent)] text-ink-2 hover:text-ink"
                  title="Edit"
                >
                  <Pencil className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => del(p)}
                  data-testid={`delete-project-${p.id}`}
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
