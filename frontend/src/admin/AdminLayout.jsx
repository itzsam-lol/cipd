import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import {
  LogOut,
  LayoutDashboard,
  FileText,
  PlusCircle,
  Calendar,
  Megaphone,
  Inbox,
  Layers,
  Menu,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  { to: "/admin", end: true, icon: LayoutDashboard, label: "Dashboard", testid: "admin-nav-dashboard" },
  { to: "/admin/blogs", icon: FileText, label: "All blogs", testid: "admin-nav-blogs" },
  { to: "/admin/blogs/new", icon: PlusCircle, label: "New blog", testid: "admin-nav-new" },
  { to: "/admin/projects", icon: Layers, label: "Projects", testid: "admin-nav-projects" },
  { to: "/admin/events", icon: Calendar, label: "Events", testid: "admin-nav-events" },
  { to: "/admin/announcements", icon: Megaphone, label: "Headlines", testid: "admin-nav-announcements" },
  { to: "/admin/submissions", icon: Inbox, label: "Submissions", testid: "admin-nav-submissions" },
];

export default function AdminLayout({ children, title }) {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] transition-colors ${
      isActive
        ? "bg-[color-mix(in_srgb,var(--ink)_8%,transparent)] text-ink font-medium"
        : "text-ink-2 hover:text-ink"
    }`;

  const doLogout = () => {
    logout();
    nav("/login");
  };

  return (
    <div
      data-testid="admin-layout"
      className="min-h-screen lg:grid lg:grid-cols-[260px_1fr]"
      style={{ background: "var(--bg)", color: "var(--ink)" }}
    >
      {/* Mobile top bar */}
      <div
        className="lg:hidden sticky top-0 z-40 flex items-center justify-between px-6 h-16 border-b"
        style={{ background: "var(--bg)", borderColor: "var(--border-soft)" }}
      >
        <Link to="/" className="flex items-center gap-2">
          <Logo className="h-8 w-auto" />
        </Link>
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          data-testid="admin-menu-toggle"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="w-10 h-10 inline-flex items-center justify-center rounded-full text-ink"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
      {menuOpen && (
        <div
          className="lg:hidden sticky top-16 z-30 px-6 py-6 border-b"
          style={{ background: "var(--bg)", borderColor: "var(--border-soft)" }}
        >
          <div className="text-[10.5px] uppercase tracking-[0.22em] text-ink-3 mb-3 px-3">CMS</div>
          <nav className="space-y-1 mb-6">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={linkClass}
                data-testid={item.testid}
                onClick={() => setMenuOpen(false)}
              >
                <item.icon className="w-4 h-4" /> {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="pt-4 border-t flex items-center justify-between" style={{ borderColor: "var(--border-soft)" }}>
            <div className="min-w-0">
              <div className="text-[13px] font-medium truncate">{user?.name || "Admin"}</div>
              <div className="text-[11px] text-ink-3 truncate">{user?.email}</div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <ThemeToggle />
              <button
                onClick={doLogout}
                data-testid="admin-logout-mobile"
                className="inline-flex items-center gap-2 text-[12.5px] text-ink-2 hover:text-ink"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex border-r p-6 flex-col lg:sticky lg:top-0 lg:h-screen"
        style={{ borderColor: "var(--border-soft)" }}
      >
        <Link to="/" className="flex items-center gap-2 mb-10">
          <Logo className="h-8 w-auto" />
        </Link>
        <div className="text-[10.5px] uppercase tracking-[0.22em] text-ink-3 mb-3 px-3">
          CMS
        </div>
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={linkClass} data-testid={item.testid}>
              <item.icon className="w-4 h-4" /> {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t" style={{ borderColor: "var(--border-soft)" }}>
          <div className="flex items-center gap-3 mb-4 px-2">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-[13px]"
              style={{ background: "color-mix(in srgb, var(--ink) 10%, transparent)" }}
            >
              {(user?.name || user?.email || "?").slice(0, 1).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="text-[13px] font-medium truncate">{user?.name || "Admin"}</div>
              <div className="text-[11px] text-ink-3 truncate">{user?.email}</div>
            </div>
          </div>
          <div className="flex items-center justify-between px-2">
            <ThemeToggle />
            <button
              onClick={doLogout}
              data-testid="admin-logout"
              className="inline-flex items-center gap-2 text-[12.5px] text-ink-2 hover:text-ink"
            >
              <LogOut className="w-4 h-4" /> Sign out
            </button>
          </div>
        </div>
      </aside>

      <main className="px-6 sm:px-10 py-10 sm:py-14 max-w-[1280px] w-full">
        {title && (
          <h1
            className="font-display font-extrabold leading-[1] tracking-[-0.03em] mb-10"
            style={{ fontSize: "clamp(1.85rem, 3.4vw, 2.6rem)" }}
          >
            {title}
          </h1>
        )}
        {children}
      </main>
    </div>
  );
}
