import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { useState } from "react";

const VIDEO_ID = "C8cfSDmtQxo";

export default function FeaturedVideo() {
  const [playing, setPlaying] = useState(false);
  return (
    <section
      data-testid="featured-video"
      className="relative px-6 sm:px-10 py-32 sm:py-48"
      style={{ background: "var(--bg-soft)" }}
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5">
            <div className="text-[11px] uppercase tracking-[0.22em] text-ink-3 mb-6">
              In motion
            </div>
            <h2
              className="font-display font-extrabold leading-[0.95] tracking-[-0.03em]"
              style={{ fontSize: "clamp(2.25rem, 5vw, 4.5rem)" }}
            >
              The lab, <br />
              <span className="accent-gradient-text">on a roll.</span>
            </h2>
            <p className="mt-7 max-w-[420px] text-[17px] leading-[1.6] text-ink-2">
              A sixty-second glimpse into how a week looks here &mdash; soldering
              irons, scope traces, late-night demos, and the rare quiet moment
              right before a board boots for the first time.
            </p>
            <div className="mt-10 flex items-center gap-3 text-[12px] uppercase tracking-[0.22em] text-ink-3">
              <span className="w-8 h-px bg-ink/30" />
              CiPD · IIIT Delhi · 2026
            </div>
          </div>

          <div className="lg:col-span-7 flex justify-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="relative rounded-[28px] overflow-hidden shadow-[0_30px_80px_-30px_rgba(0,0,0,0.35)]"
              style={{ aspectRatio: "9 / 16", width: "min(360px, 80vw)" }}
              data-testid="video-frame"
            >
              {playing ? (
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&playsinline=1&modestbranding=1&rel=0`}
                  title="CiPD Featured"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <button
                  onClick={() => setPlaying(true)}
                  data-testid="video-play"
                  data-cursor="hover"
                  className="absolute inset-0 group"
                >
                  <img
                    src={`https://img.youtube.com/vi/${VIDEO_ID}/maxresdefault.jpg`}
                    onError={(e) => {
                      e.currentTarget.src = `https://img.youtube.com/vi/${VIDEO_ID}/hqdefault.jpg`;
                    }}
                    alt="Featured"
                    className="absolute inset-0 w-full h-full object-cover scale-110 group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/15 group-hover:bg-black/25 transition" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-white/95 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
                      <Play className="w-7 h-7 ml-1 fill-ink text-ink" />
                    </div>
                  </div>
                  <div className="absolute bottom-5 left-5 text-white text-[11px] uppercase tracking-[0.22em]">
                    Play · 0:60
                  </div>
                </button>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
