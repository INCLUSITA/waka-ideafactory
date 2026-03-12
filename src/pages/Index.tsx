import { AppLayout } from "@/layouts/AppLayout";
import {
  AppWindow,
  Box,
  FileText,
  BarChart3,
  Shield,
  Activity,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const QUICK_LINKS = [
  {
    title: "Applications",
    description: "Gestiona las aplicaciones del ecosistema WAKA.",
    icon: AppWindow,
    path: "/applications",
    primary: true,
  },
  {
    title: "Assets",
    description: "Templates, componentes y activos reutilizables.",
    icon: Box,
    path: "/assets",
  },
  {
    title: "Pattern Docs",
    description: "Patrones, decisiones y documentos de gobernanza.",
    icon: FileText,
    path: "/patterns",
  },
  {
    title: "Analytics",
    description: "Métricas operativas y salud del ecosistema.",
    icon: BarChart3,
    path: "/analytics",
  },
  {
    title: "Governance",
    description: "Auditoría, roles y trazabilidad.",
    icon: Shield,
    path: "/governance",
  },
] as const;

const Index = () => {
  const { user } = useAuth();
  const displayName = user?.user_metadata?.display_name || user?.email?.split("@")[0] || "Operador";

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto">
        {/* Hero */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold text-primary tracking-wider uppercase">
              Control Tower
            </span>
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
            Bienvenido, {displayName}
          </h1>
          <p className="mt-2 text-muted-foreground text-base max-w-2xl">
            Centro operativo de WAKA. Desde aquí evolucionas las aplicaciones,
            capacidades y activos del ecosistema.
          </p>
        </div>

        {/* Primary action */}
        <Link
          to="/applications"
          className="block mb-6 rounded-lg border-2 border-primary/30 bg-primary/5 p-6 hover:border-primary/60 hover:bg-primary/10 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/15 flex items-center justify-center group-hover:bg-primary/25 transition-colors">
              <AppWindow className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-foreground">
                Applications
              </h2>
              <p className="text-sm text-muted-foreground">
                El punto de entrada operativo. Gestiona el ciclo de vida de cada
                aplicación WAKA.
              </p>
            </div>
          </div>
        </Link>

        {/* Secondary modules */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {QUICK_LINKS.filter((l) => !("primary" in l && l.primary)).map(
            ({ title, description, icon: Icon, path }) => (
              <Link
                key={path}
                to={path}
                className="group rounded-lg border border-border bg-card p-4 hover:border-primary/40 hover:shadow-md transition-all"
              >
                <div className="w-9 h-9 rounded-md bg-muted flex items-center justify-center mb-3 group-hover:bg-primary/10 transition-colors">
                  <Icon className="w-4.5 h-4.5 text-primary" />
                </div>
                <h3 className="font-display text-sm font-semibold text-foreground">
                  {title}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  {description}
                </p>
              </Link>
            )
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
