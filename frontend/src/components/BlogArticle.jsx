import { motion } from "framer-motion";
import TiptapRender from "@/components/TiptapRender";
import readingTime from "@/lib/readingTime";

// Shared render path for a blog's content — used by both the live BlogPost
// page and the admin editor's preview, so preview can never drift from what
// actually publishes.
export default function BlogArticle({ blog, animate = true }) {
  const H1 = animate ? motion.h1 : "h1";
  const motionProps = animate
    ? {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
      }
    : {};

  return (
    <>
      <div className="flex items-center gap-4 text-[11px] uppercase tracking-[0.22em] text-ink-3 mb-10 flex-wrap">
        <span>{blog.tag || "Note"}</span>
        <span className="w-6 h-px bg-current opacity-40" />
        <span>
          {new Date(blog.createdAt || Date.now()).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
        <span className="w-6 h-px bg-current opacity-40" />
        <span data-testid="reading-time">{readingTime(blog.content)}</span>
      </div>

      <H1
        {...motionProps}
        className="font-extrabold leading-[1.04] tracking-[-0.035em]"
        style={{ fontSize: "clamp(2.1rem, 4.5vw, 3.4rem)" }}
        data-testid="blog-title"
      >
        {blog.title || "Untitled"}
      </H1>

      {blog.excerpt && (
        <p
          className="mt-7 text-[20px] sm:text-[22px] leading-[1.5] text-ink-2"
          style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontStyle: "italic" }}
          data-testid="blog-subtitle"
        >
          {blog.excerpt}
        </p>
      )}

      <div
        className="mt-10 pt-6 border-t flex items-center gap-3 text-[13px]"
        style={{ borderColor: "var(--border-soft)" }}
      >
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center font-bold"
          style={{ background: "color-mix(in srgb, var(--ink) 10%, transparent)" }}
        >
          {(blog.author?.name || "C")
            .split(" ")
            .map((w) => w[0])
            .slice(0, 2)
            .join("")
            .toUpperCase()}
        </div>
        <div>
          <div className="font-medium text-ink">{blog.author?.name || "CiPD"}</div>
          <div className="text-ink-3 text-[12px] uppercase tracking-[0.15em]">
            {blog.author?.role || "Faculty · CiPD"}
          </div>
        </div>
      </div>

      {blog.coverImage && (
        <div className="mt-12 rounded-2xl overflow-hidden">
          <img src={blog.coverImage} alt={blog.title} className="w-full h-auto object-cover" />
        </div>
      )}

      <div className="mt-14 blog-body" data-testid="blog-body">
        <TiptapRender doc={blog.content} />
      </div>
    </>
  );
}
