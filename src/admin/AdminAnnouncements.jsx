import { useEffect, useState } from "react";
import AdminLayout from "@/admin/AdminLayout";
import { api, formatApiError } from "@/lib/api";
import { PlusCircle, Trash2, Eye, EyeOff, Check, X } from "lucide-react";

export default function AdminAnnouncements() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newText, setNewText] = useState("");
  const [newLink, setNewLink] = useState("");
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editLink, setEditLink] = useState("");

  const reload = () =>
    api
      .get("/admin/announcements")
      .then((r) => setItems(r.data))
      .catch((e) => setError(formatApiError(e)))
      .finally(() => setLoading(false));

  useEffect(() => {
    reload();
  }, []);

  const add = async () => {
    if (!newText.trim()) return;
    setAdding(true);
    setError("");
    try {
      await api.post("/admin/announcements", {
        text: newText.trim(),
        link: newLink.trim() || null,
        active: true,
      });
      setNewText("");
      setNewLink("");
      reload();
    } catch (e) {
      setError(formatApiError(e));
    } finally {
      setAdding(false);
    }
  };

  const toggleActive = async (a) => {
    try {
      await api.put(`/admin/announcements/${a.id}`, {
        text: a.text,
        link: a.link,
        active: !a.active,
      });
      reload();
    } catch (e) {
      setError(formatApiError(e));
    }
  };

  const startEdit = (a) => {
    setEditingId(a.id);
    setEditText(a.text);
    setEditLink(a.link || "");
  };

  const saveEdit = async (a) => {
    try {
      await api.put(`/admin/announcements/${a.id}`, {
        text: editText.trim() || a.text,
        link: editLink.trim() || null,
        active: a.active,
      });
      setEditingId(null);
      reload();
    } catch (e) {
      setError(formatApiError(e));
    }
  };

  const del = async (a) => {
    if (!window.confirm("Delete this headline? This cannot be undone.")) return;
    try {
      await api.delete(`/admin/announcements/${a.id}`);
      reload();
    } catch (e) {
      setError(formatApiError(e));
    }
  };

  return (
    <AdminLayout title="Headlines">
      <p className="text-[13.5px] text-ink-2 mb-8 max-w-[560px]">
        Short headlines that scroll in the ticker bar at the top of every
        page. Only active ones show on the live site.
      </p>

      {error && (
        <div
          className="mb-6 px-4 py-3 rounded-lg text-[13px]"
          style={{ background: "color-mix(in srgb, #ec1e79 12%, transparent)", color: "#ec1e79" }}
        >
          {error}
        </div>
      )}

      <div
        className="rounded-2xl border p-5 mb-8 flex flex-col sm:flex-row gap-3"
        style={{ borderColor: "var(--border-soft)" }}
      >
        <input
          type="text"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder="Applications for Cohort 04 are now open"
          data-testid="new-announcement-text"
          className="flex-1 rounded-lg border px-4 py-2.5 text-[14px] bg-transparent outline-none focus:border-ink/40"
          style={{ borderColor: "var(--border-soft)" }}
        />
        <input
          type="text"
          value={newLink}
          onChange={(e) => setNewLink(e.target.value)}
          placeholder="Link (optional)"
          data-testid="new-announcement-link"
          className="sm:w-[220px] rounded-lg border px-4 py-2.5 text-[14px] bg-transparent outline-none focus:border-ink/40"
          style={{ borderColor: "var(--border-soft)" }}
        />
        <button
          type="button"
          onClick={add}
          disabled={adding || !newText.trim()}
          data-testid="add-announcement"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-medium disabled:opacity-60 shrink-0"
          style={{ background: "var(--ink)", color: "var(--bg)" }}
        >
          <PlusCircle className="w-4 h-4" /> Add
        </button>
      </div>

      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "var(--border-soft)" }}>
        {!loading && items.length === 0 && (
          <div className="px-6 py-16 text-center text-ink-3 text-[13.5px]">
            No headlines yet — add one above.
          </div>
        )}
        <ul className="divide-y" style={{ borderColor: "var(--border-soft)" }}>
          {items.map((a) => (
            <li key={a.id} data-testid={`announcement-row-${a.id}`} className="px-6 py-4 flex items-center gap-4">
              {editingId === a.id ? (
                <>
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="flex-1 rounded-lg border px-3 py-2 text-[13.5px] bg-transparent outline-none"
                    style={{ borderColor: "var(--border-soft)" }}
                  />
                  <input
                    type="text"
                    value={editLink}
                    onChange={(e) => setEditLink(e.target.value)}
                    placeholder="Link"
                    className="w-[180px] rounded-lg border px-3 py-2 text-[13.5px] bg-transparent outline-none hidden sm:block"
                    style={{ borderColor: "var(--border-soft)" }}
                  />
                  <button onClick={() => saveEdit(a)} className="p-2 text-emerald-600" title="Save">
                    <Check className="w-4 h-4" />
                  </button>
                  <button onClick={() => setEditingId(null)} className="p-2 text-ink-3" title="Cancel">
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => toggleActive(a)}
                    className={`p-2 rounded-lg shrink-0 ${a.active ? "text-emerald-600" : "text-ink-3"}`}
                    title={a.active ? "Active — click to deactivate" : "Inactive — click to activate"}
                  >
                    {a.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => startEdit(a)}
                    className="flex-1 min-w-0 text-left text-[14px] truncate hover:underline"
                  >
                    {a.text}
                  </button>
                  <button
                    onClick={() => del(a)}
                    data-testid={`delete-announcement-${a.id}`}
                    className="p-2 rounded-lg text-ink-2 hover:text-[#ec1e79] shrink-0"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </AdminLayout>
  );
}
