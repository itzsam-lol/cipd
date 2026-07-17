import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const PHASES = [
  {
    n: "01",
    title: "Idea",
    line: "It starts as a sketch on a whiteboard, a wire on a breadboard, a question nobody else is asking.",
    img: "https://images.unsplash.com/photo-1488229297570-58520851e868?auto=format&fit=crop&w=1600&q=80",
  },
  {
    n: "02",
    title: "Research",
    line: "We prototype hard. We measure, fail, redesign — until physics, code, and intent agree on one thing.",
    img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1600&q=80",
  },
  {
    n: "03",
    title: "Development",
    line: "PCBs are fabbed, firmware ships, enclosures are CNC-milled. The lab becomes a factory floor.",
    img: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80",
  },
  {
    n: "04",
    title: "Impact",
    line: "A device leaves the building. Someone, somewhere, lives a little better — that is the only metric.",
    img: "https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=1600&q=80",
  },
];

function Phase({ phase, i }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const imgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.15, 1, 1.05]);

  return (
    <div
      ref={ref}
      data-testid={`story-phase-${i}`}
      className={`grid lg:grid-cols-12 gap-10 items-center min-h-[80vh] ${
        i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
      }`}
    >
      <div className="lg:col-span-7 relative h-[60vh] overflow-hidden rounded-[20px]">
        <motion.img
          src={phase.img}
          alt={phase.title}
          style={{ scale: imgScale }}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        <span className="absolute top-6 left-6 text-white/90 font-display text-[13px] uppercase tracking-[0.2em]">
          Phase {phase.n}
        </span>
      </div>
      <motion.div style={{ y }} className="lg:col-span-5">
        <div className="text-[11px] uppercase tracking-[0.22em] text-ink-3 mb-5">
          {phase.n} — Step {i + 1} of 4
        </div>
        <h3
          className="font-display font-extrabold leading-[0.95] tracking-[-0.03em]"
          style={{ fontSize: "clamp(3rem, 6vw, 6rem)" }}
        >
          {phase.title}
          <span className="accent-gradient-text">.</span>
        </h3>
        <p className="mt-7 text-[17px] md:text-[19px] leading-[1.6] text-ink-2 max-w-[440px]">
          {phase.line}
        </p>
      </motion.div>
    </div>
  );
}

export default function Story() {
  return (
    <section
      id="story"
      data-testid="story-section"
      className="relative px-6 sm:px-10 py-32 sm:py-48"
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-24 max-w-[760px]">
          <div className="text-[11px] uppercase tracking-[0.22em] text-ink-3 mb-6">
            How we build
          </div>
          <h2
            className="font-display font-extrabold leading-[0.95] tracking-[-0.03em]"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)" }}
          >
            From a thought, <br />
            <span className="accent-gradient-text">to a thing in your hand.</span>
          </h2>
        </div>

        <div className="space-y-28 lg:space-y-48">
          {PHASES.map((p, i) => (
            <Phase key={p.n} phase={p} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
