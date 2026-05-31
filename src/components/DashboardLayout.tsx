import { NavLink, Outlet, Link } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard, Briefcase, FileText, User, Plus, Users, Menu, X, LogOut,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

type Variant = "candidate" | "admin";

const navs: Record<Variant, { to: string; label: string; icon: typeof LayoutDashboard }[]> = {
  candidate: [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/jobs", label: "Browse Jobs", icon: Briefcase },
    { to: "/dashboard/applications", label: "My Applications", icon: FileText },
    { to: "/dashboard/profile", label: "Profile", icon: User },
  ],
  admin: [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/jobs/new", label: "Create Job", icon: Plus },
    { to: "/admin/jobs", label: "Manage Jobs", icon: Briefcase },
  ],
};

export default function DashboardLayout({ variant }: { variant: Variant }) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const items = navs[variant];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <button
        className="md:hidden fixed top-4 left-4 z-50 h-10 w-10 rounded-lg glass grid place-items-center"
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle sidebar"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open && (
        <div className="md:hidden fixed inset-0 z-30 bg-foreground/20 backdrop-blur-sm" onClick={() => setOpen(false)} />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border transform transition-transform md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-16 px-6 flex items-center border-b border-sidebar-border">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-hero grid place-items-center">
              <Briefcase className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold">TalentBridge</span>
          </Link>
        </div>

        <nav className="p-3 space-y-1">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/dashboard" || item.to === "/admin" || item.to === "/admin/jobs"}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-soft"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 inset-x-0 p-3 border-t border-sidebar-border">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="h-9 w-9 rounded-full bg-gradient-hero grid place-items-center text-primary-foreground font-semibold text-sm">
              {user?.name?.charAt(0).toUpperCase() ?? "?"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="w-full justify-start mt-1" onClick={logout}>
            <LogOut className="h-4 w-4 mr-2" /> Sign out
          </Button>
        </div>
      </aside>

      <main className="md:pl-64">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
