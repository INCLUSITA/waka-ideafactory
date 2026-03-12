import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  AppWindow,
  Box,
  FileText,
  BarChart3,
  Shield,
  Settings,
  Lightbulb,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_SECTIONS = [
  {
    label: "OPERACIONES",
    items: [
      { label: "Control Tower", path: "/", icon: LayoutDashboard, exact: true },
      { label: "Applications", path: "/applications", icon: AppWindow },
    ],
  },
  {
    label: "WORKSPACE",
    items: [
      { label: "Assets", path: "/assets", icon: Box },
      { label: "Pattern Docs", path: "/patterns", icon: FileText },
      { label: "Ideas", path: "/ideas", icon: Lightbulb },
    ],
  },
  {
    label: "GOBERNANZA",
    items: [
      { label: "Analytics", path: "/analytics", icon: BarChart3 },
      { label: "Governance", path: "/governance", icon: Shield },
      { label: "Settings", path: "/settings", icon: Settings },
    ],
  },
] as const;

interface AppSidebarProps {
  tenantName?: string;
}

export function AppSidebar({ tenantName }: AppSidebarProps) {
  const location = useLocation();

  return (
    <aside className="w-60 bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col">
      {/* Brand */}
      <div className="h-14 flex items-center px-5 border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-md bg-sidebar-primary flex items-center justify-center">
            <span className="font-display text-xs font-bold text-sidebar-primary-foreground">W</span>
          </div>
          <div className="flex flex-col">
            <span className="font-display text-sm font-semibold tracking-tight text-sidebar-accent-foreground group-hover:text-sidebar-primary transition-colors leading-none">
              WAKA
            </span>
            <span className="text-[9px] text-sidebar-foreground/50 tracking-wider uppercase leading-none mt-0.5">
              Ideas Factory
            </span>
          </div>
        </Link>
      </div>

      {/* Tenant context */}
      {tenantName && (
        <div className="px-4 py-2.5 border-b border-sidebar-border">
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-sidebar-accent">
            <Building2 className="w-3.5 h-3.5 text-sidebar-primary shrink-0" />
            <span className="text-[11px] font-medium text-sidebar-accent-foreground truncate">
              {tenantName}
            </span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 py-3 px-3 space-y-5 overflow-y-auto">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            <p className="px-3 mb-1.5 text-[10px] font-semibold tracking-widest text-sidebar-foreground/40 uppercase">
              {section.label}
            </p>
            <div className="space-y-0.5">
              {section.items.map(({ label, path, icon: Icon, ...rest }) => {
                const exact = "exact" in rest && rest.exact;
                const isActive = exact
                  ? location.pathname === path
                  : location.pathname.startsWith(path);
                return (
                  <Link
                    key={path}
                    to={path}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-primary"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-sidebar-border">
        <p className="text-[10px] text-sidebar-foreground/50 font-body tracking-wider uppercase">
          WAKA Platform v0.3
        </p>
      </div>
    </aside>
  );
}
