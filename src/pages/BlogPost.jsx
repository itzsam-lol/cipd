import { Link, useParams, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import Nav from "@/components/Nav";
import Connect from "@/components/Connect";
import TiptapRender from "@/components/TiptapRender";
import { api } from "@/lib/api";
import readingTime from "@/lib/readingTime";

export default function BlogPost() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    setStatus("loading");
    api
      .get(`/blogs/${slug}`)
      .then((r) => {
        setBlog(r.data);
        setStatus("ok");
      })
      .catch(() => setStatus("notfound"));
  }, [slug]);

  if (status === "notfound") return <Navigate to="/blogs" replace />;

  return (
    <main
      data-testid="blog-post-page"
      className="text-ink"
      style={{
        overflowX: "clip",
        background: "var(--bg)",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <Nav />

      <article className="px-6 sm:px-10 pt-36 sm:pt-44 pb-28">
        <div style={{ maxWidth: "var(--read-width)", margin: "0 auto" }}>
          <Link
            to="/blogs"
            data-testid="blog-back"
            className="inline-flex items-center gap-2 text-[13px] text-ink-3 hover:text-ink transition-colors mb-12"
          >
            <ArrowLeft className="w-4 h-4" /> All notes
          </Link>

          {status === "loading" || !blog ? (
            <div className="py-24 text-ink-3 text-[13px]">Loading…</div>
          ) : (
            <>
              {/* Tag + date + reading time */}
              <div className="flex items-center gap-4 text-[11px] uppercase tracking-[0.22em] text-ink-3 mb-10 flex-wrap">
                <span>{blog.tag || "Note"}</span>
                <span className="w-6 h-px bg-current opacity-40" />
                <span>
                  {new Date(blog.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                <span className="w-6 h-px bg-current opacity-40" />
                <span data-testid="reading-time">{readingTime(blog.content)}</span>
              </div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="font-extrabold leading-[1.04] tracking-[-0.035em]"
                style={{ fontSize: "clamp(2.1rem, 4.5vw, 3.4rem)" }}
                data-testid="blog-title"
              >
                {blog.title}
              </motion.h1>

              {/* Subtitle / description */}
              {blog.excerpt && (
                <p
                  className="mt-7 text-[20px] sm:text-[22px] leading-[1.5] text-ink-2"
                  style={{
                    fontFamily: "'Source Serif 4', Georgia, serif",
                    fontStyle: "italic",
                  }}
                  data-testid="blog-subtitle"
                >
                  {blog.excerpt}
                </p>
              )}

              {/* Author */}
              <div
                className="mt-10 pt-6 border-t flex items-center gap-3 text-[13px]"
                style={{ borderColor: "var(--border-soft)" }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold"
                  style={{
                    background: "color-mix(in srgb, var(--ink) 10%, transparent)",
                  }}
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

              {/* Cover image */}
              {blog.coverImage && (
                <div className="mt-12 rounded-2xl overflow-hidden">
                  <img
                    src={blog.coverImage}
                    alt={blog.title}
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}

              {/* Content */}
              <div className="mt-14 blog-body" data-testid="blog-body">
                <TiptapRender doc={blog.content} />
              </div>

              <div
                className="mt-20 pt-10 border-t flex items-center justify-between"
                style={{ borderColor: "var(--border-soft)" }}
              >
                <Link
                  to="/blogs"
                  className="link-underline text-[14px] text-ink-2"
                  data-testid="blog-back-bottom"
                >
                  ← Back to all notes
                </Link>
                <span className="text-[12px] uppercase tracking-[0.2em] text-ink-3">
                  CiPD · 2026
                </span>
              </div>
            </>
          )}
        </div>
      </article>

      <Connect />
    </main>
  );
}
