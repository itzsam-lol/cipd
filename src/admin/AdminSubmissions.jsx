import { useEffect, useState } from "react";
import AdminLayout from "@/admin/AdminLayout";
import { api, formatApiError } from "@/lib/api";
import { ChevronDown, ChevronUp, Trash2, Mail, Phone, Link as LinkIcon } from "lucide-react";

const FILTERS = [
  { value: "", label: "All" },
  { value: "ipdcp_application", label: "iPD-CP applications" },
  { value: "share_idea", label: "Ideas" },
];

export default function AdminSubmissions() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("");
  const [expanded, setExpanded] = useState(null);

  const reload = (type) =>
    api
      .get("/admin/submissions", { params: type ? { type } : {} })
      .then((r) => setItems(r.data))
      .catch((e) => setError(formatApiError(e)))
      .finally(() => setLoading(false));

  useEffect(() => {
    setLoading(true);
    reload(filter);
  }, [filter]);

  const toggle = async (s) => {
    const next = expanded === s.id ? null : s.id;
    setExpanded(next);
    if (next && !s.read) {
      try {
        await api.put(`/admin/submissions/${s.id}/read`);
        setItems((prev) => prev.map((x) => (x.id === s.id ? { ...x, read: true } : x)));
      } catch {
        // non-critical
      }
    }
  };

  const del = async (s) => {
    if (!window.confirm(`Delete this submission from ${s.name}? This cannot be undone.`)) return;
    try {
      await api.delete(`/admin/submissions/${s.id}`);
      reload(filter);
    } catch (e) {
      setError(formatApiError(e));
    }
  };

  return (
    <AdminLayout title="Submissions">
      <div className="flex items-center gap-2 mb-8 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            data-testid={`submissions-filter-${f.value || "all"}`}
            className="px-4 py-2 rounded-full text-[13px] border transition-colors"
            style={{
              borderColor: filter === f.value ? "var(--ink)" : "var(--border-soft)",
              background: filter === f.value ? "var(--ink)" : "transparent",
              color: filter === f.value ? "var(--bg)" : "var(--ink-2, inherit)",
            }}
          >
            {f.label}
          </button>
        ))}
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
        {!loading && items.length === 0 && (
          <div className="px-6 py-16 text-center text-ink-3 text-[13.5px]">
            No submissions yet.
          </div>
        )}
        <ul className="divide-y" style={{ borderColor: "var(--border-soft)" }}>
          {items.map((s) => (
            <li key={s.id} data-testid={`submission-row-${s.id}`}>
              <button
                onClick={() => toggle(s)}
                className="w-full px-6 py-5 flex items-center gap-4 text-left"
              >
                {!s.read && (
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: "var(--pink)" }} />
                )}
                {s.read && <span className="w-2 h-2 shrink-0" />}
                <span
                  className="text-[10.5px] uppercase tracking-[0.18em] px-2.5 py-1 rounded-full shrink-0"
                  style={{ background: "color-mix(in srgb, var(--ink) 6%, transparent)", color: "var(--ink-2, inherit)" }}
                >
                  {s.type === "ipdcp_application" ? "iPD-CP" : "Idea"}
                </span>
                <span className="font-display font-medium text-[14.5px] truncate flex-1">
                  {s.name}
                </span>
                <span className="text-[12.5px] text-ink-3 hidden sm:block">
                  {new Date(s.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                {expanded === s.id ? (
                  <ChevronUp className="w-4 h-4 text-ink-3 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-ink-3 shrink-0" />
                )}
              </button>

              {expanded === s.id && (
                <div className="px-6 pb-6 pl-[52px] sm:pl-[52px]">
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-ink-2 mb-4">
                    <a href={`mailto:${s.email}`} className="inline-flex items-center gap-2 hover:text-ink">
                      <Mail className="w-3.5 h-3.5" /> {s.email}
                    </a>
                    {s.phone && (
                      <span className="inline-flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5" /> {s.phone}
                      </span>
                    )}
                    {s.link && (
                      <a
                        href={s.link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 hover:text-ink truncate max-w-[280px]"
                      >
                        <LinkIcon className="w-3.5 h-3.5" /> {s.link}
                      </a>
                    )}
                  </div>
                  {s.message && (
                    <p className="text-[14px] leading-[1.6] text-ink max-w-[640px] whitespace-pre-wrap mb-4">
                      {s.message}
                    </p>
                  )}
                  <button
                    onClick={() => del(s)}
                    data-testid={`delete-submission-${s.id}`}
                    className="inline-flex items-center gap-2 text-[12.5px] text-ink-3 hover:text-[#ec1e79]"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </AdminLayout>
  );
}
