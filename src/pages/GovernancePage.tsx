import { AppLayout } from "@/layouts/AppLayout";

const GovernancePage = () => {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
          Governance
        </h1>
        <p className="mt-2 text-muted-foreground text-sm">
          Módulo en preparación. Auditoría, gestión de roles, permisos y trazabilidad completa de cambios.
        </p>
      </div>
    </AppLayout>
  );
};

export default GovernancePage;
