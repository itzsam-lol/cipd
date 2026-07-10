import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Check } from "lucide-react";

export default function ShareIdeas() {
  const [form, setForm] = useState({ name: "", email: "", idea: "" });
  const [sent, setSent] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setForm({ name: "", email: "", idea: "" });
      setSent(false);
    }, 3200);
  };

  return (
    <section
      id="share"
      data-testid="share-ideas-section"
      className="relative px-6 sm:px-10 py-40 sm:py-56 overflow-hidden"
    >
      <div className="blob" style={{ background: "var(--pink)", width: 520, height: 520, top: "-100px", left: "-120px", opacity: 0.18 }} />
      <div className="blob" style={{ background: "var(--teal)", width: 460, height: 460, bottom: "-100px", right: "-120px", opacity: 0.18 }} />
      <div className="blob" style={{ background: "var(--purple)", width: 340, height: 340, top: "40%", left: "55%", opacity: 0.12 }} />

      <div className="max-w-[1100px] mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-ink-2 mb-10"
        >
          <Sparkles className="w-3.5 h-3.5" />
          A signature invitation
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-extrabold leading-[0.92] tracking-[-0.04em]"
          style={{ fontSize: "clamp(3rem, 9vw, 9rem)" }}
        >
          Got a wild <br />
          <span className="accent-gradient-text">idea?</span> <br />
          Pitch it.
        </motion.h2>

        <p className="mt-10 max-w-[520px] text-[18px] leading-[1.6] text-ink-2">
          We read every submission. The good ones become breadboards, the great
          ones become products, the wild ones become research papers — and a
          few become all three.
        </p>

        <form
          onSubmit={submit}
          data-testid="share-ideas-form"
          className="mt-16 max-w-[720px] grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-2"
        >
          <input
            data-testid="share-input-name"
            className="field"
            placeholder="Your name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            data-testid="share-input-email"
            type="email"
            className="field"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <textarea
            data-testid="share-input-idea"
            className="field sm:col-span-2 resize-none"
            rows={3}
            placeholder="Describe your idea in one sentence…"
            value={form.idea}
            onChange={(e) => setForm({ ...form, idea: e.target.value })}
            required
          />
          <div className="sm:col-span-2 mt-10 flex items-center gap-6">
            <button
              type="submit"
              data-testid="share-submit"
              data-cursor="hover"
              disabled={sent}
              className="group relative inline-flex items-center gap-3 rounded-full pl-8 pr-3 py-3 text-white text-[14px] font-medium overflow-hidden disabled:opacity-90"
              style={{ background: "var(--ink)" }}
            >
              <span>{sent ? "Got it, we'll be in touch" : "Send my idea"}</span>
              <span
                className="inline-flex w-9 h-9 rounded-full items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, var(--purple), var(--teal), var(--pink))",
                }}
              >
                {sent ? (
                  <Check className="w-4 h-4 text-white" />
                ) : (
                  <Sparkles className="w-4 h-4 text-white" />
                )}
              </span>
            </button>
            <span className="text-[12px] text-ink-3 uppercase tracking-[0.18em]">
              No bureaucracy. Reply within 5 working days.
            </span>
          </div>
        </form>
      </div>
    </section>
  );
}
