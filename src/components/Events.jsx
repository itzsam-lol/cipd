import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { api } from "@/lib/api";

const ACCENT_VARS = {
  teal: "var(--teal)",
  pink: "var(--pink)",
  purple: "var(--purple)",
};

function formatDate(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return { day: "", year: "" };
  return {
    day: d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
    year: String(d.getFullYear()),
  };
}

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/events")
      .then((r) => setEvents(r.data.slice(0, 3)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section
      id="events"
      data-testid="events-section"
      className="relative px-6 sm:px-10 py-32 sm:py-48"
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="grid lg:grid-cols-12 gap-10 mb-24">
          <div className="lg:col-span-7">
            <div className="text-[11px] uppercase tracking-[0.22em] text-ink-3 mb-6">
              What&apos;s next
            </div>
            <h2
              className="font-display font-extrabold leading-[0.95] tracking-[-0.03em]"
              style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)" }}
            >
              Show up. <br />
              <span className="accent-gradient-text">Build something.</span>
            </h2>
          </div>
          <div className="lg:col-span-5 flex lg:flex-col lg:items-end lg:justify-end gap-6">
            <p className="text-[17px] leading-[1.6] text-ink-2 max-w-[420px] lg:text-right">
              We host hands-on workshops, all-night hackathons and an annual
              demo day. Open to every IIIT Delhi student, and most of them to
              the wider community too.
            </p>
            <Link
              to="/events"
              data-testid="events-view-all"
              className="link-underline text-[13.5px] text-ink-2 shrink-0"
            >
              View all events →
            </Link>
          </div>
        </div>

        {loading && (
          <div className="py-16 text-center text-ink-3 text-[13px]">Loading…</div>
        )}

        {!loading && events.length === 0 && (
          <div className="py-16 text-center text-ink-3 text-[13.5px]">
            No upcoming events right now. Check back soon.
          </div>
        )}

        {!loading && events.length > 0 && (
          <div className="relative">
            {/* vertical thread */}
            <div className="absolute left-[22px] sm:left-[110px] top-0 bottom-0 w-px bg-ink/10" />

            <ul className="space-y-20 sm:space-y-28">
              {events.map((e, i) => {
                const { day, year } = formatDate(e.date);
                const accent = ACCENT_VARS[e.accent] || ACCENT_VARS.teal;
                return (
                  <motion.li
                    key={e.id}
                    data-testid={`event-${i}`}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="relative pl-14 sm:pl-[170px]"
                  >
                    {/* node */}
                    <span
                      className="absolute left-[14px] sm:left-[102px] top-2 w-4 h-4 rounded-full"
                      style={{ background: accent }}
                    />
                    <span
                      className="absolute left-[6px] sm:left-[94px] top-[-6px] w-8 h-8 rounded-full"
                      style={{ background: accent, opacity: 0.15 }}
                    />

                    {/* date */}
                    <div className="absolute left-0 top-0 hidden sm:block w-[80px]">
                      <div
                        className="font-display font-extrabold tracking-[-0.03em] leading-none text-ink"
                        style={{ fontSize: "clamp(1.5rem, 2.2vw, 2.1rem)" }}
                      >
                        {day}
                      </div>
                      <div className="text-[12px] text-ink-3 mt-1 tracking-wider">{year}</div>
                    </div>

                    {/* content */}
                    <Link to={`/events/${e.id}`} className="group block max-w-[640px]">
                      <div className="text-[11px] uppercase tracking-[0.22em] text-ink-3 mb-3 sm:hidden">
                        {day} · {year}
                      </div>
                      <h3
                        className="font-display font-bold tracking-[-0.02em] text-ink leading-[1.05] break-words group-hover:underline"
                        style={{ fontSize: "clamp(1.75rem, 3.4vw, 3rem)" }}
                      >
                        {e.title}
                      </h3>
                      {e.location && (
                        <div className="text-[13px] uppercase tracking-[0.2em] text-ink-3 mt-3">
                          {e.location}
                        </div>
                      )}
                      {e.description && (
                        <p className="mt-5 text-[16px] md:text-[17px] leading-[1.6] text-ink-2 break-words">
                          {e.description}
                        </p>
                      )}
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
