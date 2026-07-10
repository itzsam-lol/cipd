import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import AdminLayout from "@/admin/AdminLayout";
import { api, formatApiError } from "@/lib/api";
import { ArrowLeft, ImageIcon, X } from "lucide-react";

const inputClass =
  "w-full rounded-lg border px-4 py-2.5 text-[14px] bg-transparent outline-none focus:border-ink/40 transition-colors";

export default function AdminProjectEditor() {
  const { id } = useParams();
  const nav = useNavigate();
  const isNew = !id;

  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("");
  const [sub, setSub] = useState("");
  const [color, setColor] = useState("#0FB5A8");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState("");
  const fileRef = useRef(null);

  useEffect(() => {
    if (isNew) return;
    api
      .get(`/admin/projects/${id}`)
      .then((r) => {
        const p = r.data;
        setTitle(p.title || "");
        setTag(p.tag || "");
        setSub(p.sub || "");
        setColor(p.color || "#0FB5A8");
        setImage(p.image || null);
      })
      .catch((e) => setErr(formatApiError(e)))
      .finally(() => setLoading(false));
  }, [id, isNew]);

  const onImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    setUploading(true);
    try {
      const { data } = await api.post("/admin/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setImage(`${process.env.REACT_APP_BACKEND_URL}${data.url}`);
    } catch (e2) {
      setErr(formatApiError(e2, "Upload failed"));
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const save = async () => {
    setErr("");
    setSaving(true);
    const body = { title, tag, sub, color, image };
    try {
      if (isNew) {
        await api.post("/admin/projects", body);
      } else {
        await api.put(`/admin/projects/${id}`, body);
      }
      nav("/admin/projects");
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
    <AdminLayout title={isNew ? "New project" : "Edit project"}>
      <Link
        to="/admin/projects"
        className="inline-flex items-center gap-2 text-[13px] text-ink-3 hover:text-ink mb-8"
      >
        <ArrowLeft className="w-4 h-4" /> All projects
      </Link>

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
            Image
          </label>
          {image ? (
            <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden">
              <img src={image} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => setImage(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full inline-flex items-center justify-center"
                style={{ background: "rgba(0,0,0,0.6)", color: "#fff" }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="w-full aspect-[16/10] rounded-xl border border-dashed flex items-center justify-center text-ink-3 hover:text-ink text-[13.5px] transition-colors"
              style={{ borderColor: "var(--border-soft)" }}
            >
              <ImageIcon className="w-5 h-5 mr-2" />
              {uploading ? "Uploading…" : "Add an image"}
            </button>
          )}
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onImage} />
        </div>

        <div>
          <label className="block text-[11px] uppercase tracking-[0.18em] text-ink-3 mb-2">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Aira"
            data-testid="project-title"
            className={inputClass}
            style={{ borderColor: "var(--border-soft)" }}
          />
        </div>

        <div>
          <label className="block text-[11px] uppercase tracking-[0.18em] text-ink-3 mb-2">
            Category tag
          </label>
          <input
            type="text"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            placeholder="Wearable Health"
            data-testid="project-tag"
            className={inputClass}
            style={{ borderColor: "var(--border-soft)" }}
          />
        </div>

        <div>
          <label className="block text-[11px] uppercase tracking-[0.18em] text-ink-3 mb-2">
            One-line description
          </label>
          <textarea
            value={sub}
            onChange={(e) => setSub(e.target.value)}
            rows={2}
            placeholder="A coin-sized respiratory monitor for tier-2 clinics."
            data-testid="project-sub"
            className={`${inputClass} resize-none`}
            style={{ borderColor: "var(--border-soft)" }}
          />
        </div>

        <div>
          <label className="block text-[11px] uppercase tracking-[0.18em] text-ink-3 mb-2">
            Accent color
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              data-testid="project-color"
              className="w-11 h-11 rounded-lg border cursor-pointer"
              style={{ borderColor: "var(--border-soft)" }}
            />
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className={inputClass}
              style={{ borderColor: "var(--border-soft)" }}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={save}
          disabled={saving || !title.trim()}
          data-testid="save-project"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-[13px] font-medium disabled:opacity-60"
          style={{ background: "var(--ink)", color: "var(--bg)" }}
        >
          {saving ? "Saving…" : isNew ? "Create project" : "Save changes"}
        </button>
      </div>
    </AdminLayout>
  );
}
