import { AppLayout } from "@/layouts/AppLayout";

const AssetsPage = () => {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
          Assets
        </h1>
        <p className="mt-2 text-muted-foreground text-sm">
          Módulo en preparación. Gestión de templates, componentes, prompts y activos reutilizables generados desde ideas.
        </p>
      </div>
    </AppLayout>
  );
};

export default AssetsPage;
