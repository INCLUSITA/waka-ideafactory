import { AppLayout } from "@/layouts/AppLayout";
import { Lightbulb, Box, BarChart3, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const MODULES = [
  {
    title: "Ideas Pipeline",
    description: "Captura, evalúa y prioriza ideas para evolucionar WAKA.",
    icon: Lightbulb,
    path: "/ideas",
    ready: false,
  },
  {
    title: "Assets",
    description: "Gestiona templates, componentes y activos reutilizables.",
    icon: Box,
    path: "/assets",
    ready: false,
  },
  {
    title: "Analytics",
    description: "Métricas de impacto, velocidad y salud del pipeline.",
    icon: BarChart3,
    path: "/analytics",
    ready: false,
  },
  {
    title: "Governance",
    description: "Auditoría, roles y trazabilidad completa.",
    icon: Shield,
    path: "/governance",
    ready: false,
  },
] as const;

const Index = () => {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        {/* Hero */}
        <div className="mb-10">
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
            Ideas Factory
          </h1>
          <p className="mt-2 text-muted-foreground text-base max-w-xl">
            La plataforma interna con la que WAKA evoluciona WAKA. Captura ideas,
            genera activos, valida impacto.
          </p>
        </div>

        {/* Module cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {MODULES.map(({ title, description, icon: Icon, path, ready }) => (
            <Link
              key={path}
              to={path}
              className="group relative rounded-lg border border-border bg-card p-5 hover:border-primary/40 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-semibold text-foreground">
                    {title}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    {description}
                  </p>
                </div>
              </div>
              {!ready && (
                <span className="absolute top-3 right-3 text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                  Próximamente
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
