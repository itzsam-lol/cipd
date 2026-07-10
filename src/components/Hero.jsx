import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import BlobScene from "./BlobScene";

const ease = [0.16, 1, 0.3, 1];

export default function Hero() {
  return (
    <section
      id="top"
      data-testid="hero-section"
      className="relative min-h-[100svh] pt-28 pb-16 px-6 sm:px-10 overflow-hidden"
    >
      {/* faint accent blobs */}
      <div
        className="blob"
        style={{
          background: "var(--teal)",
          width: 380,
          height: 380,
          top: "-80px",
          right: "-60px",
          opacity: 0.18,
        }}
      />
      <div
        className="blob"
        style={{
          background: "var(--pink)",
          width: 320,
          height: 320,
          bottom: "10%",
          left: "-80px",
          opacity: 0.14,
        }}
      />

      <div className="max-w-[1400px] mx-auto grid lg:grid-cols-12 gap-10 items-center min-h-[85vh]">
        <div className="lg:col-span-7 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-ink-2 mb-10"
          >
            <span className="w-6 h-px bg-ink/40" />
            Centre for Intelligent Product Development
            <span className="w-6 h-px bg-ink/40" />
          </motion.div>

          <h1
            data-testid="hero-heading"
            className="font-display font-extrabold leading-[0.86] tracking-[-0.04em]"
            style={{ fontSize: "clamp(3.5rem, 9.5vw, 10.5rem)" }}
          >
            {["Ideas.", "Products.", "Impact."].map((word, i) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.15 + i * 0.12, ease }}
                className="block"
              >
                {i === 1 ? <span className="accent-gradient-text">{word}</span> : word}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease }}
            className="mt-10 max-w-[520px] text-[17px] md:text-[18px] leading-[1.6] text-ink-2"
          >
            We are where research meets reality — a hardware-first studio at
            IIIT Delhi turning early ideas into production-ready intelligent
            products.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.95, ease }}
            className="mt-12 flex items-center gap-8"
          >
            <a
              href="#story"
              data-testid="hero-cta-explore"
              data-cursor="hover"
              className="inline-flex items-center gap-3 text-[14px] font-medium text-ink"
            >
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-ink/15 group">
                <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              </span>
              Scroll the story
            </a>
            <a
              href="#projects"
              data-testid="hero-cta-projects"
              data-cursor="hover"
              className="link-underline text-[14px] text-ink-2"
            >
              See featured projects
            </a>
          </motion.div>
        </div>

        {/* 3D Blob */}
        <div className="lg:col-span-5 relative h-[420px] sm:h-[520px] lg:h-[640px]">
          <BlobScene />
          <div className="absolute bottom-3 right-3 text-[10px] uppercase tracking-[0.22em] text-ink-3">
            Interactive · move your cursor
          </div>
        </div>
      </div>

      {/* marquee */}
      <div className="absolute bottom-6 left-0 right-0 overflow-hidden">
        <div className="marquee-track whitespace-nowrap flex gap-12 text-[12px] uppercase tracking-[0.22em] text-ink-3">
          {Array.from({ length: 2 }).map((_, k) => (
            <span key={k} className="flex gap-12">
              <span>Embedded Systems</span>
              <span>•</span>
              <span>PCB Design</span>
              <span>•</span>
              <span>Firmware</span>
              <span>•</span>
              <span>Robotics</span>
              <span>•</span>
              <span>Sensors</span>
              <span>•</span>
              <span>Edge AI</span>
              <span>•</span>
              <span>Mechatronics</span>
              <span>•</span>
              <span>Production Hardware</span>
              <span>•</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
