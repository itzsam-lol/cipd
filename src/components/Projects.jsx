import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";

const PROJECTS = [
  {
    tag: "Wearable Health",
    title: "Aira",
    sub: "A coin-sized respiratory monitor for tier-2 clinics.",
    color: "#0FB5A8",
    img: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=2000&q=85",
  },
  {
    tag: "Edge AI",
    title: "Pulse-7",
    sub: "On-device inference board running 70M-param vision models at 11W.",
    color: "#6E2DBE",
    img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=2000&q=85",
  },
  {
    tag: "Robotics",
    title: "Halt",
    sub: "An open-source mobile manipulator for rural last-mile logistics.",
    color: "#EC1E79",
    img: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&w=2000&q=85",
  },
  {
    tag: "Sensing",
    title: "Field-One",
    sub: "Soil-moisture sensor mesh that runs five years on a single coin cell.",
    color: "#0FB5A8",
    img: "https://images.unsplash.com/photo-1592659762303-90081d34b277?auto=format&fit=crop&w=2000&q=85",
  },
];

export default function Projects() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  // horizontal translate maps the 4 panels (we slide width * (count-1) / count)
  const x = useTransform(scrollYProgress, [0, 1], ["0%", `-${(PROJECTS.length - 1) * 100}vw`]);

  return (
    <section
      id="projects"
      data-testid="projects-section"
      ref={ref}
      className="relative"
      style={{ height: `${PROJECTS.length * 100}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden" style={{ background: "var(--bg)" }}>
        <div className="absolute top-10 left-6 sm:left-10 z-10">
          <div className="text-[11px] uppercase tracking-[0.22em] text-ink-3">
            Featured projects
          </div>
          <div className="font-display text-[20px] mt-1 text-ink">
            Scroll to drift through →
          </div>
        </div>

        <motion.div style={{ x }} className="flex h-full" data-testid="projects-track">
          {PROJECTS.map((p, i) => (
            <div
              key={p.title}
              className="w-screen h-full flex-shrink-0 flex items-center justify-center px-6 sm:px-16"
              data-testid={`project-${i}`}
            >
              <div className="grid lg:grid-cols-12 gap-10 w-full max-w-[1300px] items-center">
                <div className="lg:col-span-7 relative h-[55vh] sm:h-[70vh] rounded-[24px] overflow-hidden">
                  <img
                    src={p.img}
                    alt={p.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div
                    className="absolute inset-0 mix-blend-multiply opacity-20"
                    style={{ background: p.color }}
                  />
                  <div className="absolute top-6 left-6 text-white text-[11px] uppercase tracking-[0.22em]">
                    {p.tag}
                  </div>
                  <div className="absolute bottom-6 left-6 text-white/90 text-[12px] tracking-wider">
                    0{i + 1} / 0{PROJECTS.length}
                  </div>
                </div>
                <div className="lg:col-span-5">
                  <div className="text-[11px] uppercase tracking-[0.22em] text-ink-3 mb-5">
                    {p.tag}
                  </div>
                  <h3
                    className="font-display font-extrabold leading-[0.92] tracking-[-0.03em]"
                    style={{ fontSize: "clamp(3rem, 7vw, 7.5rem)" }}
                  >
                    {p.title}
                    <span style={{ color: p.color }}>.</span>
                  </h3>
                  <p className="mt-6 text-[17px] md:text-[19px] leading-[1.55] text-ink-2 max-w-[440px]">
                    {p.sub}
                  </p>
                  <a
                    href="#share"
                    data-cursor="hover"
                    className="mt-10 inline-flex items-center gap-2 text-[14px] font-medium text-ink"
                  >
                    Read the build log
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
