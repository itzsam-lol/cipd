import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import Nav from "@/components/Nav";
import Connect from "@/components/Connect";
import { api } from "@/lib/api";

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/blogs")
      .then((r) => setBlogs(r.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main
      data-testid="blogs-page"
      className="text-ink"
      style={{
        overflowX: "clip",
        background: "var(--bg)",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <Nav />

      <section
        data-testid="blogs-hero"
        className="px-6 sm:px-10 pt-40 sm:pt-48 pb-20 sm:pb-28"
      >
        <div className="max-w-[1100px] mx-auto">
          <div className="text-[11px] uppercase tracking-[0.22em] text-ink-3 mb-8">
            Notes from the lab
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="font-extrabold leading-[0.92] tracking-[-0.04em]"
            style={{ fontSize: "clamp(2.75rem, 7vw, 6.5rem)" }}
          >
            Words by <br />
            <span className="accent-gradient-text">our faculty.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 max-w-[560px] text-[17px] leading-[1.65] text-ink-2"
          >
            Occasional long-form notes, essays and field reports from the
            researchers, engineers and faculty behind CiPD. Quiet pieces —
            meant to be read slowly.
          </motion.p>
        </div>
      </section>

      <section
        data-testid="blogs-list"
        className="px-6 sm:px-10 pb-32 sm:pb-48 border-t"
        style={{ borderColor: "var(--border-soft)" }}
      >
        <div className="max-w-[1100px] mx-auto">
          {loading && (
            <div className="py-24 text-center text-ink-3 text-[13px]">
              Loading…
            </div>
          )}

          {!loading && blogs.length === 0 && (
            <div className="py-24 text-center text-ink-3 text-[13.5px]">
              No essays published yet. Check back soon.
            </div>
          )}

          <ul>
            {blogs.map((b, i) => (
              <motion.li
                key={b.slug}
                data-testid={`blog-item-${b.slug}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  to={`/blogs/${b.slug}`}
                  className="group block py-14 sm:py-16 border-b grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 lg:items-end transition-colors"
                  style={{ borderColor: "var(--border-soft)" }}
                >
                  {b.coverImage && (
                    <div
                      className="absolute right-10 top-1/2 -translate-y-1/2 w-40 h-28 rounded-xl overflow-hidden hidden xl:block opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ pointerEvents: "none" }}
                    >
                      <img
                        src={b.coverImage}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-4 text-[11px] uppercase tracking-[0.22em] text-ink-3 mb-6 flex-wrap">
                      <span>{b.tag || "Note"}</span>
                      <span className="w-6 h-px bg-current opacity-40" />
                      <span>
                        {new Date(b.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <h2
                      className="font-extrabold leading-[0.98] tracking-[-0.03em]"
                      style={{ fontSize: "clamp(2rem, 4.5vw, 4rem)" }}
                    >
                      {b.title}
                    </h2>
                    {b.excerpt && (
                      <p className="mt-6 max-w-[640px] text-[16.5px] leading-[1.6] text-ink-2">
                        {b.excerpt}
                      </p>
                    )}
                    <div className="mt-8 flex items-center gap-3 text-[13px] text-ink-3">
                      <span className="font-medium text-ink">
                        {b.author?.name || "CiPD"}
                      </span>
                      <span className="opacity-50">·</span>
                      <span>{b.author?.role || "Faculty · CiPD"}</span>
                    </div>
                  </div>
                  <span
                    className="inline-flex w-14 h-14 rounded-full items-center justify-center border self-end transition-transform duration-500 group-hover:rotate-45 shrink-0"
                    style={{ borderColor: "var(--border-soft)" }}
                  >
                    <ArrowUpRight className="w-5 h-5" />
                  </span>
                </Link>
              </motion.li>
            ))}
          </ul>

          <div className="mt-20 text-[13px] text-ink-3 max-w-[560px] leading-[1.6]">
            More essays will appear as faculty publish them. If you'd like to
            contribute as a CiPD faculty member, write to{" "}
            <a href="mailto:cipd@iiitd.ac.in" className="link-underline text-ink">
              cipd@iiitd.ac.in
            </a>
            .
          </div>
        </div>
      </section>

      <Connect />
    </main>
  );
}
