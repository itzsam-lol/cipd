import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import AnnouncementTicker from "@/components/AnnouncementTicker";

const LINKS = [
  { label: "Home", to: "/", kind: "route" },
  { label: "iPD-CP", to: "/ipd-cp", kind: "route" },
  { label: "Projects", to: "/#projects", kind: "hash" },
  { label: "Events", to: "/events", kind: "route" },
  { label: "Blogs", to: "/blogs", kind: "route" },
  { label: "Connect", to: "/#connect", kind: "hash" },
  { label: "Idea", to: "/#share", kind: "hash" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on route change and lock body scroll while open
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const isActive = (l) => {
    if (l.kind === "route") return pathname === l.to;
    return false;
  };

  return (
    <header
      data-testid="nav-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || menuOpen ? "backdrop-blur-xl border-b border-black/5 dark:border-white/5" : ""
      }`}
      style={
        scrolled || menuOpen
          ? { background: "color-mix(in srgb, var(--bg) 92%, transparent)" }
          : { background: "transparent" }
      }
    >
      <AnnouncementTicker />
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
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            data-testid="nav-menu-toggle"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full text-ink"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      <div
        data-testid="nav-mobile-menu"
        className={`md:hidden overflow-hidden transition-[max-height,opacity] duration-400 ease-out ${
          menuOpen ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"
        }`}
        style={{
          background: "var(--bg)",
          borderTop: menuOpen ? "1px solid var(--border-soft)" : "none",
        }}
      >
        <nav className="px-6 py-6 flex flex-col gap-1">
          {LINKS.map((l) => {
            const cls = `py-3 text-[17px] font-display font-medium transition-colors ${
              isActive(l) ? "text-ink" : "text-ink-2"
            }`;
            const testid = `nav-mobile-link-${l.label.toLowerCase().replace(/[^a-z]/g, "-")}`;
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
          <Link
            to="/ipd-cp"
            data-testid="nav-mobile-cta"
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-full text-[14px] font-medium px-6 py-3"
            style={{ background: "var(--ink)", color: "var(--bg)" }}
          >
            Apply
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </nav>
      </div>
    </header>
  );
}
