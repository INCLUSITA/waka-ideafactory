import { AppLayout } from "@/layouts/AppLayout";

const AnalyticsPage = () => {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
          Analytics
        </h1>
        <p className="mt-2 text-muted-foreground text-sm">
          Módulo en preparación. Métricas de impacto, velocidad del pipeline y salud operativa.
        </p>
      </div>
    </AppLayout>
  );
};

export default AnalyticsPage;
