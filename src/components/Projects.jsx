import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { api } from "@/lib/api";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const count = Math.max(projects.length, 1);
  const x = useTransform(scrollYProgress, [0, 1], ["0%", `-${(count - 1) * 100}vw`]);

  useEffect(() => {
    api
      .get("/projects")
      .then((r) => setProjects(r.data))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && projects.length === 0) return null;

  return (
    <section id="projects" data-testid="projects-section" className="relative">
      {!loading && (
        <>
          {/* Desktop / tablet: sticky horizontal drift, scroll-driven */}
          <div
            ref={ref}
            className="hidden lg:block relative"
            style={{ height: `${count * 100}vh` }}
          >
            <div className="sticky top-0 h-screen overflow-hidden" style={{ background: "var(--bg)" }}>
              <div className="absolute top-10 left-10 z-10">
                <div className="text-[11px] uppercase tracking-[0.22em] text-ink-3">
                  Featured projects
                </div>
                <div className="font-display text-[20px] mt-1 text-ink">
                  Scroll to drift through →
                </div>
              </div>

              <motion.div style={{ x }} className="flex h-full" data-testid="projects-track">
                {projects.map((p, i) => (
                  <div
                    key={p.id}
                    className="w-screen h-full flex-shrink-0 flex items-center justify-center px-16"
                    data-testid={`project-${i}`}
                  >
                    <div className="grid grid-cols-12 gap-10 w-full max-w-[1300px] items-center">
                      <div className="col-span-7 relative h-[70vh] rounded-[24px] overflow-hidden">
                        {p.image ? (
                          <img
                            src={p.image}
                            alt={p.title}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0" style={{ background: p.color || "var(--teal)" }} />
                        )}
                        <div
                          className="absolute inset-0 mix-blend-multiply opacity-20"
                          style={{ background: p.color }}
                        />
                        <div className="absolute top-6 left-6 text-white text-[11px] uppercase tracking-[0.22em]">
                          {p.tag}
                        </div>
                        <div className="absolute bottom-6 left-6 text-white/90 text-[12px] tracking-wider">
                          0{i + 1} / 0{projects.length}
                        </div>
                      </div>
                      <div className="col-span-5">
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
                        <p className="mt-6 text-[17px] md:text-[19px] leading-[1.55] text-ink-2 max-w-[440px] break-words">
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
          </div>

          {/* Mobile: plain stacked list — a scroll-jacked horizontal carousel doesn't
              translate to touch scrolling, so this is a deliberately different layout,
              not a smaller version of the desktop one. */}
          <div className="lg:hidden px-6 py-24">
            <div className="mb-12">
              <div className="text-[11px] uppercase tracking-[0.22em] text-ink-3">
                Featured projects
              </div>
            </div>
            <div className="space-y-16">
              {projects.map((p, i) => (
                <div key={p.id} data-testid={`project-mobile-${i}`}>
                  <div className="relative h-[42vh] rounded-2xl overflow-hidden mb-6">
                    {p.image ? (
                      <img src={p.image} alt={p.title} className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0" style={{ background: p.color || "var(--teal)" }} />
                    )}
                    <div className="absolute top-5 left-5 text-white text-[11px] uppercase tracking-[0.22em]">
                      {p.tag}
                    </div>
                    <div className="absolute bottom-5 left-5 text-white/90 text-[12px] tracking-wider">
                      0{i + 1} / 0{projects.length}
                    </div>
                  </div>
                  <h3
                    className="font-display font-extrabold leading-[0.95] tracking-[-0.03em] text-[2.75rem]"
                  >
                    {p.title}
                    <span style={{ color: p.color }}>.</span>
                  </h3>
                  <p className="mt-4 text-[16px] leading-[1.55] text-ink-2 break-words">{p.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
