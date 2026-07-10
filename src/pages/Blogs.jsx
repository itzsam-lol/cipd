import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Nav from "@/components/Nav";
import Connect from "@/components/Connect";
import { api } from "@/lib/api";

function CoverPanel({ coverImage, title, className = "" }) {
  return (
    <div className={`relative rounded-2xl overflow-hidden ${className}`}>
      {coverImage ? (
        <img src={coverImage} alt="" className="w-full h-full object-cover" />
      ) : (
        <div
          className="w-full h-full flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, var(--purple), var(--teal), var(--pink))",
            opacity: 0.85,
          }}
        >
          <span className="font-display font-extrabold text-white text-[13px] uppercase tracking-[0.2em] px-6 text-center">
            {title}
          </span>
        </div>
      )}
    </div>
  );
}

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    api
      .get("/blogs")
      .then((r) => setBlogs(r.data))
      .finally(() => setLoading(false));
  }, []);

  const tags = useMemo(() => {
    const set = new Set(blogs.map((b) => b.tag || "Note"));
    return ["All", ...Array.from(set)];
  }, [blogs]);

  const filtered = useMemo(
    () => (filter === "All" ? blogs : blogs.filter((b) => (b.tag || "Note") === filter)),
    [blogs, filter],
  );

  const [featured, ...rest] = filtered;

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

      <section data-testid="blogs-hero" className="px-6 sm:px-10 pt-40 sm:pt-48 pb-16 sm:pb-20">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-[11px] uppercase tracking-[0.22em] text-ink-3 mb-8">
            Notes from the lab
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="font-extrabold leading-[0.92] tracking-[-0.04em]"
            style={{ fontSize: "clamp(2.75rem, 7vw, 6rem)" }}
          >
            Words by <br />
            <span className="accent-gradient-text">our faculty.</span>
          </motion.h1>
          <p className="mt-8 max-w-[560px] text-[16.5px] leading-[1.65] text-ink-2">
            Occasional long-form notes, essays and field reports from the
            researchers, engineers and faculty behind CiPD.
          </p>

          {tags.length > 1 && (
            <div className="flex items-center gap-2 mt-12 flex-wrap" data-testid="blogs-filter-tabs">
              {tags.map((t) => (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  data-testid={`blogs-filter-${t.toLowerCase().replace(/\s+/g, "-")}`}
                  className="px-4 py-2 rounded-full text-[13px] border transition-colors"
                  style={{
                    borderColor: filter === t ? "var(--ink)" : "var(--border-soft)",
                    background: filter === t ? "var(--ink)" : "transparent",
                    color: filter === t ? "var(--bg)" : "inherit",
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {loading && (
        <div className="px-6 sm:px-10 py-24 text-center text-ink-3 text-[13px]">Loading…</div>
      )}

      {!loading && filtered.length === 0 && (
        <div
          className="px-6 sm:px-10 py-24 text-center text-ink-3 text-[13.5px] border-t"
          style={{ borderColor: "var(--border-soft)" }}
        >
          No essays here yet. Check back soon.
        </div>
      )}

      {!loading && featured && (
        <section className="px-6 sm:px-10 pb-20 sm:pb-24 border-t" style={{ borderColor: "var(--border-soft)" }}>
          <div className="max-w-[1200px] mx-auto pt-16 sm:pt-20">
            <div className="text-[11px] uppercase tracking-[0.2em] text-ink-3 mb-8">Featured</div>
            <Link
              to={`/blogs/${featured.slug}`}
              data-testid={`blog-featured-${featured.slug}`}
              className="group grid lg:grid-cols-2 gap-10 lg:gap-16 items-center"
            >
              <div>
                <h2 className="font-display font-extrabold text-[28px] sm:text-[36px] leading-[1.1] tracking-[-0.02em] mb-4 group-hover:underline">
                  {featured.title}
                </h2>
                <div className="flex items-center gap-3 text-[12.5px] text-ink-3 mb-6">
                  <span>{featured.tag || "Note"}</span>
                  <span className="opacity-40">·</span>
                  <span>
                    {new Date(featured.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                {featured.excerpt && (
                  <p className="text-[15.5px] leading-[1.65] text-ink-2 max-w-[440px] mb-8">
                    {featured.excerpt}
                  </p>
                )}
                <span
                  className="inline-flex items-center gap-3 rounded-full pl-5 pr-2 py-2 text-[13px] font-medium"
                  style={{ background: "color-mix(in srgb, var(--ink) 6%, transparent)" }}
                >
                  Read essay
                  <span
                    className="inline-flex w-7 h-7 rounded-full items-center justify-center transition-transform duration-500 group-hover:rotate-45"
                    style={{ background: "var(--ink)", color: "var(--bg)" }}
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </span>
              </div>
              <CoverPanel coverImage={featured.coverImage} title={featured.title} className="aspect-[16/10]" />
            </Link>
          </div>
        </section>
      )}

      {!loading && rest.length > 0 && (
        <section
          data-testid="blogs-list"
          className="px-6 sm:px-10 pb-32 sm:pb-48 border-t"
          style={{ borderColor: "var(--border-soft)" }}
        >
          <div className="max-w-[1200px] mx-auto pt-16 sm:pt-20">
            <div className="grid sm:grid-cols-2 gap-x-12">
              {rest.map((b, i) => (
                <motion.div
                  key={b.slug}
                  data-testid={`blog-item-${b.slug}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: (i % 2) * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="py-10 border-t first:sm:border-t-0"
                  style={{ borderColor: "var(--border-soft)" }}
                >
                  <Link to={`/blogs/${b.slug}`} className="group flex flex-col gap-5">
                    <div>
                      <h3 className="font-display font-bold text-[19px] leading-[1.25] tracking-[-0.01em] mb-3 group-hover:underline">
                        {b.title}
                      </h3>
                      <div className="flex items-center gap-3 text-[12px] text-ink-3">
                        <span>{b.tag || "Note"}</span>
                        <span className="opacity-40">·</span>
                        <span>
                          {new Date(b.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                    <CoverPanel coverImage={b.coverImage} title={b.title} className="aspect-[16/9]" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="max-w-[1200px] mx-auto mt-20 text-[13px] text-ink-3 leading-[1.6]">
            If you'd like to contribute as a CiPD faculty member, write to{" "}
            <a href="mailto:cipd@iiitd.ac.in" className="link-underline text-ink">
              cipd@iiitd.ac.in
            </a>
            .
          </div>
        </section>
      )}

      <Connect />
    </main>
  );
}
