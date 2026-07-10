import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "@/admin/AdminLayout";
import { api, formatApiError } from "@/lib/api";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";

const ACCENT_DOT = {
  teal: "var(--teal)",
  pink: "var(--pink)",
  purple: "var(--purple)",
};

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = () =>
    api
      .get("/admin/events")
      .then((r) => setEvents(r.data))
      .catch((e) => setError(formatApiError(e)))
      .finally(() => setLoading(false));

  useEffect(() => {
    reload();
  }, []);

  const del = async (ev) => {
    if (!window.confirm(`Delete "${ev.title}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/admin/events/${ev.id}`);
      reload();
    } catch (e) {
      setError(formatApiError(e));
    }
  };

  return (
    <AdminLayout title="Events">
      <div className="flex items-center justify-between mb-8">
        <div className="text-[13px] text-ink-3">
          {loading ? "Loading…" : `${events.length} total`}
        </div>
        <Link
          to="/admin/events/new"
          data-testid="new-event-btn"
          className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-medium"
          style={{ background: "var(--ink)", color: "var(--bg)" }}
        >
          <PlusCircle className="w-4 h-4" /> New event
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
        <div
          className="hidden sm:grid grid-cols-[140px_1fr_180px_100px] gap-4 px-6 py-4 text-[11px] uppercase tracking-[0.18em] text-ink-3 border-b"
          style={{ borderColor: "var(--border-soft)" }}
        >
          <div>Date</div>
          <div>Title</div>
          <div>Location</div>
          <div className="text-right">Actions</div>
        </div>

        {!loading && events.length === 0 && (
          <div className="px-6 py-16 text-center text-ink-3 text-[13.5px]">
            No events yet —{" "}
            <Link to="/admin/events/new" className="link-underline text-ink">
              create your first one
            </Link>
          </div>
        )}

        <ul className="divide-y" style={{ borderColor: "var(--border-soft)" }}>
          {events.map((ev) => (
            <li
              key={ev.id}
              data-testid={`event-row-${ev.id}`}
              className="px-6 py-5 grid grid-cols-1 sm:grid-cols-[140px_1fr_180px_100px] gap-4 items-center"
            >
              <div className="flex items-center gap-2 text-[13px] text-ink-2">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: ACCENT_DOT[ev.accent] || ACCENT_DOT.teal }}
                />
                {ev.date}
              </div>
              <div className="min-w-0">
                <Link
                  to={`/admin/events/edit/${ev.id}`}
                  className="font-display font-medium text-[15.5px] truncate hover:underline block"
                >
                  {ev.title}
                </Link>
              </div>
              <div className="text-[12.5px] text-ink-3 truncate">{ev.location}</div>
              <div className="flex items-center gap-1 sm:justify-end">
                <Link
                  to={`/admin/events/edit/${ev.id}`}
                  className="p-2 rounded-lg hover:bg-[color-mix(in_srgb,var(--ink)_6%,transparent)] text-ink-2 hover:text-ink"
                  title="Edit"
                >
                  <Pencil className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => del(ev)}
                  data-testid={`delete-event-${ev.id}`}
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
