import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Nav from "@/components/Nav";
import Connect from "@/components/Connect";
import { api } from "@/lib/api";

const ACCENT_VARS = {
  teal: "var(--teal)",
  pink: "var(--pink)",
  purple: "var(--purple)",
};

function formatDate(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function AccentPanel({ accent, title, className = "" }) {
  const color = ACCENT_VARS[accent] || ACCENT_VARS.teal;
  return (
    <div
      className={`relative rounded-2xl overflow-hidden flex items-center justify-center ${className}`}
      style={{ background: "#0a0a0a" }}
    >
      <div
        className="absolute inset-0 opacity-70"
        style={{ background: `radial-gradient(circle at 50% 40%, ${color}, transparent 65%)` }}
      />
      <span className="relative font-display font-extrabold text-white text-center text-[15px] uppercase tracking-[0.2em] px-6">
        {title}
      </span>
    </div>
  );
}

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/events")
      .then((r) => setEvents(r.data))
      .finally(() => setLoading(false));
  }, []);

  const [featured, ...rest] = events;

  return (
    <main
      data-testid="events-page"
      className="text-ink"
      style={{ overflowX: "clip", background: "var(--bg)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <Nav />

      <section className="px-6 sm:px-10 pt-40 sm:pt-48 pb-16 sm:pb-20">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-[11px] uppercase tracking-[0.22em] text-ink-3 mb-8">
            Events
          </div>
          <h1
            className="font-extrabold leading-[0.92] tracking-[-0.04em]"
            style={{ fontSize: "clamp(2.75rem, 7vw, 6rem)" }}
          >
            Show up. <br />
            <span className="accent-gradient-text">Build something.</span>
          </h1>
          <p className="mt-8 max-w-[560px] text-[16.5px] leading-[1.65] text-ink-2">
            Hands-on workshops, all-night hackathons and an annual demo day —
            open to every IIIT Delhi student, and most of them to the wider
            community too.
          </p>
        </div>
      </section>

      {loading && (
        <div className="px-6 sm:px-10 py-24 text-center text-ink-3 text-[13px]">Loading…</div>
      )}

      {!loading && events.length === 0 && (
        <div className="px-6 sm:px-10 py-24 text-center text-ink-3 text-[13.5px] border-t" style={{ borderColor: "var(--border-soft)" }}>
          No events scheduled right now. Check back soon.
        </div>
      )}

      {!loading && featured && (
        <section
          className="px-6 sm:px-10 pb-20 sm:pb-24 border-t"
          style={{ borderColor: "var(--border-soft)" }}
        >
          <div className="max-w-[1200px] mx-auto pt-16 sm:pt-20">
            <div className="text-[11px] uppercase tracking-[0.2em] text-ink-3 mb-8">
              Next up
            </div>
            <motion.div
              id={`event-${featured.id}`}
              data-testid={`event-featured-${featured.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center scroll-mt-32"
            >
              <div>
                <h2 className="font-display font-extrabold text-[28px] sm:text-[36px] leading-[1.1] tracking-[-0.02em] mb-4">
                  {featured.title}
                </h2>
                <div className="text-[13px] text-ink-3 mb-1">{formatDate(featured.date)}</div>
                {featured.location && (
                  <div className="text-[13px] uppercase tracking-[0.18em] text-ink-3 mb-6">
                    {featured.location}
                  </div>
                )}
                {featured.description && (
                  <p className="text-[15.5px] leading-[1.65] text-ink-2 max-w-[440px] mb-8">
                    {featured.description}
                  </p>
                )}
              </div>
              <AccentPanel accent={featured.accent} title={featured.title} className="aspect-[16/10]" />
            </motion.div>
          </div>
        </section>
      )}

      {!loading && rest.length > 0 && (
        <section className="px-6 sm:px-10 pb-32 sm:pb-48 border-t" style={{ borderColor: "var(--border-soft)" }}>
          <div className="max-w-[1200px] mx-auto pt-16 sm:pt-20">
            <div className="grid sm:grid-cols-2 gap-x-12">
              {rest.map((e, i) => (
                <motion.div
                  key={e.id}
                  id={`event-${e.id}`}
                  data-testid={`event-row-${e.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: (i % 2) * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="py-10 border-t first:sm:border-t-0 flex flex-col gap-5 scroll-mt-32"
                  style={{ borderColor: "var(--border-soft)" }}
                >
                  <div>
                    <h3 className="font-display font-bold text-[19px] leading-[1.25] tracking-[-0.01em] mb-3">
                      {e.title}
                    </h3>
                    <div className="text-[12.5px] text-ink-3">{formatDate(e.date)}</div>
                    {e.location && (
                      <div className="text-[11px] uppercase tracking-[0.18em] text-ink-3 mt-1">
                        {e.location}
                      </div>
                    )}
                  </div>
                  <AccentPanel accent={e.accent} title={e.title} className="aspect-[16/9]" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Connect />
    </main>
  );
}
