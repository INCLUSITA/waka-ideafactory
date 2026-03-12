import { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user, signOut } = useAuth();

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 flex flex-col min-h-screen">
        <header className="h-14 border-b border-border flex items-center justify-between px-6 bg-card">
          <h2 className="font-display text-sm font-medium text-muted-foreground tracking-wide uppercase">
            WAKA Platform
          </h2>
          <div className="flex items-center gap-3">
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
