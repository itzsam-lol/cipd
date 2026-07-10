import { useEffect, useState } from "react";
import { X, Check, ArrowUpRight } from "lucide-react";
import { api, formatApiError } from "@/lib/api";

const EMPTY = { name: "", email: "", phone: "", link: "", message: "" };

export default function ApplyModal({ open, onClose }) {
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      setForm(EMPTY);
      setSent(false);
      setError("");
    }
  }, [open]);

  if (!open) return null;

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await api.post("/apply", form);
      setSent(true);
    } catch (err) {
      setError(formatApiError(err, "Couldn't submit — try again?"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      data-testid="apply-modal"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
    >
      <div
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,0.55)" }}
        onClick={onClose}
      />
      <div
        className="relative w-full max-w-[560px] max-h-[88vh] overflow-y-auto rounded-2xl p-8 sm:p-10"
        style={{ background: "var(--bg)", border: "1px solid var(--border-soft)" }}
      >
        <button
          type="button"
          onClick={onClose}
          data-testid="apply-modal-close"
          className="absolute top-5 right-5 p-2 rounded-full text-ink-3 hover:text-ink"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {sent ? (
          <div className="py-10 text-center">
            <div
              className="inline-flex w-14 h-14 rounded-full items-center justify-center mb-6"
              style={{ background: "linear-gradient(135deg, var(--purple), var(--teal), var(--pink))" }}
            >
              <Check className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-display font-extrabold text-[24px] mb-3">
              Application received.
            </h3>
            <p className="text-ink-2 text-[14.5px] max-w-[380px] mx-auto">
              We read every submission by hand. If it's a fit, we'll reach out
              at the email you gave us before the cohort deadline.
            </p>
          </div>
        ) : (
          <>
            <h3 className="font-display font-extrabold text-[26px] sm:text-[30px] tracking-[-0.02em] mb-2">
              Apply to iPD-CP
            </h3>
            <p className="text-ink-2 text-[14px] mb-8">
              Cohort applications close 31 May 2026. Takes about two minutes.
            </p>

            <form onSubmit={submit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  required
                  data-testid="apply-name"
                  className="field"
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <input
                  required
                  type="email"
                  data-testid="apply-email"
                  className="field"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  data-testid="apply-phone"
                  className="field"
                  placeholder="Phone (optional)"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
                <input
                  data-testid="apply-link"
                  className="field"
                  placeholder="Portfolio / resume link (optional)"
                  value={form.link}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                />
              </div>
              <textarea
                required
                rows={4}
                data-testid="apply-message"
                className="field resize-none w-full"
                placeholder="Branch, year, and why you want in…"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />

              {error && (
                <div className="text-[13px]" style={{ color: "#ec1e79" }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                data-testid="apply-submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-full pl-7 pr-3 py-3 text-[14px] font-medium disabled:opacity-60"
                style={{ background: "var(--ink)", color: "var(--bg)" }}
              >
                {submitting ? "Submitting…" : "Submit application"}
                <span
                  className="inline-flex w-8 h-8 rounded-full items-center justify-center"
                  style={{ background: "color-mix(in srgb, var(--bg) 15%, transparent)" }}
                >
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
