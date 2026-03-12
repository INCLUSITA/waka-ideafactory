import { AppLayout } from "@/layouts/AppLayout";

const IdeasPage = () => {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
          Ideas Pipeline
        </h1>
        <p className="mt-2 text-muted-foreground text-sm">
          Módulo en preparación. Aquí se gestionará el ciclo completo de ideas: captura → evaluación → priorización → validación.
        </p>
      </div>
    </AppLayout>
  );
};

export default IdeasPage;
