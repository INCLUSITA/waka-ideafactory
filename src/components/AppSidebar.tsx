import { Link, useLocation } from "react-router-dom";
import { Lightbulb, Box, BarChart3, Settings, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Ideas", path: "/ideas", icon: Lightbulb },
  { label: "Assets", path: "/assets", icon: Box },
  { label: "Analytics", path: "/analytics", icon: BarChart3 },
  { label: "Governance", path: "/governance", icon: Shield },
  { label: "Settings", path: "/settings", icon: Settings },
] as const;

export function AppSidebar() {
  const location = useLocation();

  return (
    <aside className="w-60 bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col">
      {/* Brand */}
      <div className="h-14 flex items-center px-5 border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-md bg-sidebar-primary flex items-center justify-center">
            <span className="font-display text-xs font-bold text-sidebar-primary-foreground">W</span>
          </div>
          <span className="font-display text-sm font-semibold tracking-tight text-sidebar-accent-foreground group-hover:text-sidebar-primary transition-colors">
            WAKA
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {NAV_ITEMS.map(({ label, path, icon: Icon }) => {
          const isActive = location.pathname.startsWith(path);
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
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-sidebar-border">
        <p className="text-[10px] text-sidebar-foreground/50 font-body tracking-wider uppercase">
          Ideas Factory v0.1
        </p>
      </div>
    </aside>
  );
}
