import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import { LogOut, LayoutDashboard, FileText, PlusCircle, Calendar, Megaphone, Inbox, Layers } from "lucide-react";

export default function AdminLayout({ children, title }) {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] transition-colors ${
      isActive
        ? "bg-[color-mix(in_srgb,var(--ink)_8%,transparent)] text-ink font-medium"
        : "text-ink-2 hover:text-ink"
    }`;

  return (
    <div
      data-testid="admin-layout"
      className="min-h-screen grid grid-cols-1 lg:grid-cols-[260px_1fr]"
      style={{ background: "var(--bg)", color: "var(--ink)" }}
    >
      <aside
        className="border-r p-6 flex flex-col lg:sticky lg:top-0 lg:h-screen"
        style={{ borderColor: "var(--border-soft)" }}
      >
        <Link to="/" className="flex items-center gap-2 mb-10">
          <Logo className="h-8 w-auto" />
        </Link>
        <div className="text-[10.5px] uppercase tracking-[0.22em] text-ink-3 mb-3 px-3">
          CMS
        </div>
        <nav className="space-y-1">
          <NavLink to="/admin" end className={linkClass} data-testid="admin-nav-dashboard">
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </NavLink>
          <NavLink to="/admin/blogs" className={linkClass} data-testid="admin-nav-blogs">
            <FileText className="w-4 h-4" /> All blogs
          </NavLink>
          <NavLink to="/admin/blogs/new" className={linkClass} data-testid="admin-nav-new">
            <PlusCircle className="w-4 h-4" /> New blog
          </NavLink>
          <NavLink to="/admin/projects" className={linkClass} data-testid="admin-nav-projects">
            <Layers className="w-4 h-4" /> Projects
          </NavLink>
          <NavLink to="/admin/events" className={linkClass} data-testid="admin-nav-events">
            <Calendar className="w-4 h-4" /> Events
          </NavLink>
          <NavLink to="/admin/announcements" className={linkClass} data-testid="admin-nav-announcements">
            <Megaphone className="w-4 h-4" /> Headlines
          </NavLink>
          <NavLink to="/admin/submissions" className={linkClass} data-testid="admin-nav-submissions">
            <Inbox className="w-4 h-4" /> Submissions
          </NavLink>
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
              onClick={() => {
                logout();
                nav("/login");
              }}
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
