import { Link, useParams, Navigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import Nav from "@/components/Nav";
import Connect from "@/components/Connect";
import BlogArticle from "@/components/BlogArticle";
import { api } from "@/lib/api";

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
              <BlogArticle blog={blog} />
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
