import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import AdminLayout from "@/admin/AdminLayout";
import { api, formatApiError } from "@/lib/api";
import { ArrowLeft, Eye } from "lucide-react";

const ACCENTS = [
  { value: "teal", label: "Teal" },
  { value: "pink", label: "Pink" },
  { value: "purple", label: "Purple" },
];

const inputClass =
  "w-full rounded-lg border px-4 py-2.5 text-[14px] bg-transparent outline-none focus:border-ink/40 transition-colors";

export default function AdminEventEditor() {
  const { id } = useParams();
  const nav = useNavigate();
  const isNew = !id;

  const [date, setDate] = useState("");
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [accent, setAccent] = useState("teal");
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (isNew) return;
    api
      .get(`/admin/events/${id}`)
      .then((r) => {
        const e = r.data;
        setDate(e.date || "");
        setTitle(e.title || "");
        setLocation(e.location || "");
        setDescription(e.description || "");
        setAccent(e.accent || "teal");
      })
      .catch((e) => setErr(formatApiError(e)))
      .finally(() => setLoading(false));
  }, [id, isNew]);

  const save = async () => {
    setErr("");
    setSaving(true);
    const body = { date, title, location, description, accent };
    try {
      if (isNew) {
        await api.post("/admin/events", body);
      } else {
        await api.put(`/admin/events/${id}`, body);
      }
      nav("/admin/events");
    } catch (e) {
      setErr(formatApiError(e));
    } finally {
      setSaving(false);
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
    <AdminLayout title={isNew ? "New event" : "Edit event"}>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <Link
          to="/admin/events"
          className="inline-flex items-center gap-2 text-[13px] text-ink-3 hover:text-ink"
        >
          <ArrowLeft className="w-4 h-4" /> All events
        </Link>
        {!isNew && (
          <Link
            to={`/events/${id}`}
            target="_blank"
            data-testid="preview-event-link"
            className="inline-flex items-center gap-2 text-[13px] text-ink-2 hover:text-ink"
          >
            <Eye className="w-4 h-4" /> Preview
          </Link>
        )}
      </div>

      {err && (
        <div
          className="mb-6 px-4 py-3 rounded-lg text-[13px] max-w-[560px]"
          style={{ background: "color-mix(in srgb, #ec1e79 12%, transparent)", color: "#ec1e79" }}
        >
          {err}
        </div>
      )}

      <div className="max-w-[560px] space-y-6">
        <div>
          <label className="block text-[11px] uppercase tracking-[0.18em] text-ink-3 mb-2">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(ev) => setDate(ev.target.value)}
            data-testid="event-date"
            className={inputClass}
            style={{ borderColor: "var(--border-soft)" }}
          />
        </div>

        <div>
          <label className="block text-[11px] uppercase tracking-[0.18em] text-ink-3 mb-2">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(ev) => setTitle(ev.target.value)}
            placeholder="Hardware Hack Night"
            data-testid="event-title"
            className={inputClass}
            style={{ borderColor: "var(--border-soft)" }}
          />
        </div>

        <div>
          <label className="block text-[11px] uppercase tracking-[0.18em] text-ink-3 mb-2">
            Location
          </label>
          <input
            type="text"
            value={location}
            onChange={(ev) => setLocation(ev.target.value)}
            placeholder="R&D Block · 7 PM"
            data-testid="event-location"
            className={inputClass}
            style={{ borderColor: "var(--border-soft)" }}
          />
        </div>

        <div>
          <label className="block text-[11px] uppercase tracking-[0.18em] text-ink-3 mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(ev) => setDescription(ev.target.value)}
            rows={4}
            placeholder="A short blurb about the event…"
            data-testid="event-description"
            className={inputClass}
            style={{ borderColor: "var(--border-soft)" }}
          />
        </div>

        <div>
          <label className="block text-[11px] uppercase tracking-[0.18em] text-ink-3 mb-2">
            Accent color
          </label>
          <div className="flex items-center gap-3">
            {ACCENTS.map((a) => (
              <button
                key={a.value}
                type="button"
                onClick={() => setAccent(a.value)}
                data-testid={`event-accent-${a.value}`}
                className="flex items-center gap-2 rounded-full px-4 py-2 text-[13px] border transition-colors"
                style={{
                  borderColor: accent === a.value ? "var(--ink)" : "var(--border-soft)",
                  color: accent === a.value ? "var(--ink)" : "var(--ink-2, inherit)",
                }}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: `var(--${a.value})` }}
                />
                {a.label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={save}
          disabled={saving || !title.trim() || !date}
          data-testid="save-event"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-[13px] font-medium disabled:opacity-60"
          style={{ background: "var(--ink)", color: "var(--bg)" }}
        >
          {saving ? "Saving…" : isNew ? "Create event" : "Save changes"}
        </button>
      </div>
    </AdminLayout>
  );
}
