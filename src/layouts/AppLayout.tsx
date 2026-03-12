import { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useTenantContext } from "@/hooks/useTenantContext";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { LogOut, Building2 } from "lucide-react";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user, signOut } = useAuth();
  const { tenant } = useTenantContext();

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar tenantName={tenant?.name} />
      <main className="flex-1 flex flex-col min-h-screen">
        <header className="h-14 border-b border-border flex items-center justify-between px-6 bg-card">
          <h2 className="font-display text-sm font-medium text-muted-foreground tracking-wide uppercase">
            WAKA Platform
          </h2>
          <div className="flex items-center gap-4">
            {tenant && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted border border-border">
                <Building2 className="w-3 h-3 text-primary" />
                <span className="text-xs font-medium text-foreground">{tenant.name}</span>
              </div>
            )}
            {user && (
              <span className="text-xs text-muted-foreground">
                {user.user_metadata?.display_name || user.email}
              </span>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => signOut()}
              className="h-8 w-8"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </header>
        <div className="flex-1 p-6 animate-fade-in">{children}</div>
      </main>
    </div>
  );
}
