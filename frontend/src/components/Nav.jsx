import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";

const LINKS = [
  { label: "Home", to: "/", kind: "route" },
  { label: "iPD-CP", to: "/ipd-cp", kind: "route" },
  { label: "Projects", to: "/#projects", kind: "hash" },
  { label: "Events", to: "/#events", kind: "hash" },
  { label: "Blogs", to: "/blogs", kind: "route" },
  { label: "Connect", to: "/#connect", kind: "hash" },
  { label: "Idea", to: "/#share", kind: "hash" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (l) => {
    if (l.kind === "route") return pathname === l.to;
    return false;
  };

  return (
    <header
      data-testid="nav-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "backdrop-blur-xl border-b border-black/5 dark:border-white/5" : ""
      }`}
      style={
        scrolled
          ? { background: "color-mix(in srgb, var(--bg) 80%, transparent)" }
          : { background: "transparent" }
      }
    >
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 h-[72px] flex items-center justify-between gap-6">
        <Link to="/" data-testid="nav-logo" className="flex items-center gap-3 shrink-0">
          <Logo className="h-9 w-auto" />
          <span className="hidden xl:inline text-[11px] uppercase tracking-[0.2em] text-ink-3 border-l border-black/10 dark:border-white/15 pl-3">
            IIIT Delhi
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-7 lg:gap-9">
          {LINKS.map((l) => {
            const cls = `link-underline text-[13.5px] transition-colors ${
              isActive(l) ? "text-ink font-medium" : "text-ink-2 hover:text-ink"
            }`;
            const testid = `nav-link-${l.label.toLowerCase().replace(/[^a-z]/g, "-")}`;
            return l.kind === "route" ? (
              <Link key={l.label} to={l.to} data-testid={testid} className={cls}>
                {l.label}
              </Link>
            ) : (
              <a key={l.label} href={l.to} data-testid={testid} className={cls}>
                {l.label}
              </a>
            );
          })}
        </nav>
        <div className="flex items-center gap-3 shrink-0">
          <ThemeToggle />
          <Link
            to="/ipd-cp"
            data-testid="nav-cta"
            className="hidden sm:inline-flex group items-center gap-1.5 rounded-full text-[13px] font-medium pl-5 pr-3 py-2.5 transition-colors"
            style={{ background: "var(--ink)", color: "var(--bg)" }}
          >
            Apply
            <span
              className="inline-flex w-6 h-6 rounded-full items-center justify-center group-hover:rotate-45 transition-transform duration-500"
              style={{ background: "color-mix(in srgb, var(--bg) 15%, transparent)" }}
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
