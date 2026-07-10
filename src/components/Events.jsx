import { motion } from "framer-motion";

const EVENTS = [
  {
    date: "14 Mar",
    year: "2026",
    title: "Hardware Hack Night",
    where: "R&D Block · 7 PM",
    blurb:
      "An overnight build sprint. Bring an idea, leave with a working prototype and pizza grease on your hands.",
    accent: "var(--teal)",
  },
  {
    date: "02 Apr",
    year: "2026",
    title: "iPD-CP Cohort 03 Demo Day",
    where: "Auditorium · 6 PM",
    blurb:
      "24 weeks of work — 12 teams, 12 production-grade boards, judged by industry & VCs.",
    accent: "var(--pink)",
  },
  {
    date: "21 Apr",
    year: "2026",
    title: "PCB Design Masterclass",
    where: "Fab Lab · 4 PM",
    blurb:
      "A four-hour deep dive into impedance control, layer stack-up, and DFM with our resident hardware lead.",
    accent: "var(--purple)",
  },
  {
    date: "31 May",
    year: "2026",
    title: "iPD-CP Cohort 04 — Applications Close",
    where: "Online",
    blurb:
      "The last day to apply to our flagship 24-week intensive product development certificate programme.",
    accent: "var(--teal)",
  },
];

export default function Events() {
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
              <span className="text-ink-3">Build something.</span>
            </h2>
          </div>
          <div className="lg:col-span-5 flex lg:items-end">
            <p className="text-[17px] leading-[1.6] text-ink-2 max-w-[420px]">
              We host hands-on workshops, all-night hackathons and an annual
              demo day. Open to every IIIT Delhi student, and most of them to
              the wider community too.
            </p>
          </div>
        </div>

        <div className="relative">
          {/* vertical thread */}
          <div className="absolute left-[22px] sm:left-[110px] top-0 bottom-0 w-px bg-ink/10" />

          <ul className="space-y-20 sm:space-y-28">
            {EVENTS.map((e, i) => (
              <motion.li
                key={e.title}
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
                  style={{ background: e.accent }}
                />
                <span
                  className="absolute left-[6px] sm:left-[94px] top-[-6px] w-8 h-8 rounded-full"
                  style={{ background: e.accent, opacity: 0.15 }}
                />

                {/* date */}
                <div className="absolute left-0 top-0 hidden sm:block w-[80px]">
                  <div
                    className="font-display font-extrabold tracking-[-0.03em] leading-none text-ink"
                    style={{ fontSize: "clamp(1.5rem, 2.2vw, 2.1rem)" }}
                  >
                    {e.date}
                  </div>
                  <div className="text-[12px] text-ink-3 mt-1 tracking-wider">{e.year}</div>
                </div>

                {/* content */}
                <div className="max-w-[640px]">
                  <div className="text-[11px] uppercase tracking-[0.22em] text-ink-3 mb-3 sm:hidden">
                    {e.date} · {e.year}
                  </div>
                  <h3
                    className="font-display font-bold tracking-[-0.02em] text-ink leading-[1.05]"
                    style={{ fontSize: "clamp(1.75rem, 3.4vw, 3rem)" }}
                  >
                    {e.title}
                  </h3>
                  <div className="text-[13px] uppercase tracking-[0.2em] text-ink-3 mt-3">
                    {e.where}
                  </div>
                  <p className="mt-5 text-[16px] md:text-[17px] leading-[1.6] text-ink-2">
                    {e.blurb}
                  </p>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
