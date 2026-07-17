import { useEffect, useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, MapPin, CalendarPlus } from "lucide-react";
import Nav from "@/components/Nav";
import Connect from "@/components/Connect";
import { api } from "@/lib/api";

const ACCENT_VARS = {
  teal: "var(--teal)",
  pink: "var(--pink)",
  purple: "var(--purple)",
};

function formatLong(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function googleCalendarUrl(event) {
  const d = new Date(event.date);
  if (Number.isNaN(d.getTime())) return null;
  const start = d.toISOString().slice(0, 10).replace(/-/g, "");
  const endD = new Date(d);
  endD.setDate(endD.getDate() + 1);
  const end = endD.toISOString().slice(0, 10).replace(/-/g, "");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${start}/${end}`,
    details: event.description || "",
    location: event.location || "",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export default function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    setStatus("loading");
    api
      .get(`/events/${id}`)
      .then((r) => {
        setEvent(r.data);
        setStatus("ok");
      })
      .catch(() => setStatus("notfound"));
  }, [id]);

  if (status === "notfound") return <Navigate to="/events" replace />;

  const accent = event ? ACCENT_VARS[event.accent] || ACCENT_VARS.teal : ACCENT_VARS.teal;
  const calUrl = event ? googleCalendarUrl(event) : null;

  return (
    <main
      data-testid="event-detail-page"
      className="text-ink"
      style={{ overflowX: "clip", background: "var(--bg)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <Nav />

      <article className="px-6 sm:px-10 pt-36 sm:pt-44 pb-28">
        <div style={{ maxWidth: "var(--read-width)", margin: "0 auto" }}>
          <Link
            to="/events"
            data-testid="event-back"
            className="inline-flex items-center gap-2 text-[13px] text-ink-3 hover:text-ink transition-colors mb-12"
          >
            <ArrowLeft className="w-4 h-4" /> All events
          </Link>

          {status === "loading" || !event ? (
            <div className="py-24 text-ink-3 text-[13px]">Loading…</div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Banner */}
              <div
                className="relative rounded-2xl overflow-hidden aspect-[16/9] mb-10 flex items-center justify-center"
                style={{ background: "#0a0a0a" }}
              >
                <div
                  className="absolute inset-0 opacity-70"
                  style={{ background: `radial-gradient(circle at 50% 40%, ${accent}, transparent 65%)` }}
                />
                <span className="relative font-display font-extrabold text-white text-center text-[18px] sm:text-[24px] uppercase tracking-[0.2em] px-8 break-words">
                  {event.title}
                </span>
              </div>

              <h1
                data-testid="event-title"
                className="font-extrabold leading-[1.04] tracking-[-0.035em] break-words"
                style={{ fontSize: "clamp(2.1rem, 4.5vw, 3.4rem)" }}
              >
                {event.title}
              </h1>

              {/* Details card */}
              <div
                className="mt-10 rounded-2xl border p-6 sm:p-8 space-y-5"
                style={{ borderColor: "var(--border-soft)" }}
              >
                <div className="flex items-start gap-4">
                  <span
                    className="inline-flex w-10 h-10 rounded-full items-center justify-center shrink-0"
                    style={{ background: "color-mix(in srgb, var(--ink) 6%, transparent)" }}
                  >
                    <Calendar className="w-4 h-4" />
                  </span>
                  <div>
                    <div className="text-[15px] font-medium">{formatLong(event.date)}</div>
                    <div className="text-[12.5px] text-ink-3 uppercase tracking-[0.15em] mt-0.5">Date</div>
                  </div>
                </div>
                {event.location && (
                  <div className="flex items-start gap-4">
                    <span
                      className="inline-flex w-10 h-10 rounded-full items-center justify-center shrink-0"
                      style={{ background: "color-mix(in srgb, var(--ink) 6%, transparent)" }}
                    >
                      <MapPin className="w-4 h-4" />
                    </span>
                    <div>
                      <div className="text-[15px] font-medium">{event.location}</div>
                      <div className="text-[12.5px] text-ink-3 uppercase tracking-[0.15em] mt-0.5">Location</div>
                    </div>
                  </div>
                )}
                {calUrl && (
                  <a
                    href={calUrl}
                    target="_blank"
                    rel="noreferrer"
                    data-testid="event-add-to-calendar"
                    className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-medium"
                    style={{ background: "var(--ink)", color: "var(--bg)" }}
                  >
                    <CalendarPlus className="w-4 h-4" /> Add to calendar
                  </a>
                )}
              </div>

              {event.description && (
                <div className="mt-12 blog-body" data-testid="event-description">
                  <p
                    className="text-[17px] leading-[1.7] text-ink-2 whitespace-pre-wrap break-words"
                    style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}
                  >
                    {event.description}
                  </p>
                </div>
              )}

              <div
                className="mt-20 pt-10 border-t flex items-center justify-between"
                style={{ borderColor: "var(--border-soft)" }}
              >
                <Link to="/events" className="link-underline text-[14px] text-ink-2" data-testid="event-back-bottom">
                  ← Back to all events
                </Link>
                <span className="text-[12px] uppercase tracking-[0.2em] text-ink-3">CiPD · 2026</span>
              </div>
            </motion.div>
          )}
        </div>
      </article>

      <Connect />
    </main>
  );
}
