import { AppLayout } from "@/layouts/AppLayout";
import { FileText } from "lucide-react";

export default function PatternsPage() {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-1">
          <FileText className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold text-primary tracking-wider uppercase">
            Pattern Docs
          </span>
        </div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
          Pattern Docs
        </h1>
        <p className="mt-2 text-muted-foreground text-sm max-w-xl">
          Patrones reutilizables, decisiones arquitectónicas y documentos de
          gobernanza del ecosistema WAKA.
        </p>
      </div>
    </AppLayout>
  );
}
