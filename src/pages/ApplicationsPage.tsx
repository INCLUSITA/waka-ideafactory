import { useEffect, useState } from "react";
import { AppLayout } from "@/layouts/AppLayout";
import { useAuth } from "@/hooks/useAuth";
import { applicationsRepo } from "@/data";
import { membershipsRepo } from "@/data";
import type { Application, TenantMembership } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, AppWindow, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  active: "bg-primary/15 text-primary",
  paused: "bg-[hsl(var(--waka-warning))]/15 text-[hsl(var(--waka-warning))]",
  deprecated: "bg-destructive/15 text-destructive",
  archived: "bg-muted text-muted-foreground",
};

export default function ApplicationsPage() {
  const { user } = useAuth();
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [membership, setMembership] = useState<TenantMembership | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!user) return;
    // Get first tenant membership to scope queries
    membershipsRepo
      .findAll({ order_by: "created_at", ascending: true, limit: 1 })
      .then((ms) => {
        if (ms.length > 0) {
          setMembership(ms[0]);
          return applicationsRepo.findAll({ tenant_id: ms[0].tenant_id });
        }
        return [];
      })
      .then((data) => setApps(data))
      .catch(() => toast.error("Error cargando aplicaciones"))
      .finally(() => setLoading(false));
  }, [user]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !membership) return;
    setCreating(true);
    try {
      const app = await applicationsRepo.create({
        name,
        description,
        tenant_id: membership.tenant_id,
        created_by: user.id,
        updated_by: user.id,
        status: "draft",
        metadata: {},
      } as any);
      setApps((prev) => [app, ...prev]);
      setName("");
      setDescription("");
      setDialogOpen(false);
      toast.success("Aplicación creada");
    } catch {
      toast.error("Error creando aplicación");
    } finally {
      setCreating(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <AppWindow className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold text-primary tracking-wider uppercase">
                Applications
              </span>
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
              Ecosistema de Aplicaciones
            </h1>
            <p className="mt-1 text-sm text-muted-foreground max-w-xl">
              Cada aplicación representa un producto o capacidad del ecosistema
              WAKA. Gestiona su ciclo de vida completo.
            </p>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                Nueva Aplicación
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear Aplicación</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4 mt-2">
                <div className="space-y-2">
                  <Label htmlFor="app-name">Nombre</Label>
                  <Input
                    id="app-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. WAKA Pay"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="app-desc">Descripción</Label>
                  <Textarea
                    id="app-desc"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe el propósito de esta aplicación..."
                    rows={3}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={creating}>
                  {creating ? "Creando..." : "Crear Aplicación"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : apps.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border rounded-lg bg-card">
            <AppWindow className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              No hay aplicaciones aún. Crea la primera para empezar.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {apps.map((app) => (
              <Link
                key={app.id}
                to={`/applications/${app.id}`}
                className="group rounded-lg border border-border bg-card p-5 hover:border-primary/40 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <Badge
                    variant="secondary"
                    className={cn(
                      "text-[10px] font-semibold uppercase tracking-wider",
                      STATUS_COLORS[app.status] || ""
                    )}
                  >
                    {app.status}
                  </Badge>
                  <ArrowRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary transition-colors" />
                </div>
                <h3 className="font-display text-base font-bold text-foreground mb-1">
                  {app.name}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {app.description || "Sin descripción"}
                </p>
                <p className="mt-3 text-[10px] text-muted-foreground/60">
                  {new Date(app.created_at).toLocaleDateString("es")}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
