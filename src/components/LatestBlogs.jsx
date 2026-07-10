import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { api } from "@/lib/api";

export default function LatestBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/blogs")
      .then((r) => setBlogs(r.data.slice(0, 3)))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && blogs.length === 0) return null;

  return (
    <section
      id="blogs-preview"
      data-testid="latest-blogs-section"
      className="relative px-6 sm:px-10 py-32 sm:py-48"
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-end justify-between mb-16 flex-wrap gap-6">
          <div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-ink-3 mb-6">
              Notes from the lab
            </div>
            <h2
              className="font-display font-extrabold leading-[0.95] tracking-[-0.03em]"
              style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)" }}
            >
              Words by <br />
              <span className="text-ink-3">our faculty.</span>
            </h2>
          </div>
          <Link
            to="/blogs"
            data-testid="latest-blogs-view-all"
            className="link-underline text-[13.5px] text-ink-2 shrink-0"
          >
            View all essays →
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((b, i) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                to={`/blogs/${b.slug}`}
                data-testid={`latest-blog-${b.slug}`}
                className="group block"
              >
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-5">
                  {b.coverImage ? (
                    <img
                      src={b.coverImage}
                      alt=""
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{
                        background:
                          "linear-gradient(135deg, var(--purple), var(--teal), var(--pink))",
                        opacity: 0.85,
                      }}
                    >
                      <span className="font-display font-extrabold text-white text-[15px] uppercase tracking-[0.2em]">
                        CiPD
                      </span>
                    </div>
                  )}
                  <span
                    className="absolute top-4 right-4 inline-flex w-10 h-10 rounded-full items-center justify-center transition-transform duration-500 group-hover:rotate-45"
                    style={{ background: "rgba(255,255,255,0.9)", color: "#111" }}
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-ink-3 mb-3">
                  <span>{b.tag || "Note"}</span>
                </div>
                <h3 className="font-display font-bold text-[19px] leading-[1.2] tracking-[-0.01em] group-hover:underline">
                  {b.title}
                </h3>
                {b.excerpt && (
                  <p className="mt-3 text-[14.5px] leading-[1.55] text-ink-2 line-clamp-2">
                    {b.excerpt}
                  </p>
                )}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
