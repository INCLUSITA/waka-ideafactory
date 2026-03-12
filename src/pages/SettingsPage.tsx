import { AppLayout } from "@/layouts/AppLayout";

const SettingsPage = () => {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
          Settings
        </h1>
        <p className="mt-2 text-muted-foreground text-sm">
          Configuración de tenant, integraciones y preferencias de la plataforma.
        </p>
      </div>
    </AppLayout>
  );
};

export default SettingsPage;
