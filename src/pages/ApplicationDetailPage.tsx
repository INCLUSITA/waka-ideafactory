import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { AppLayout } from "@/layouts/AppLayout";
import { useAuth } from "@/hooks/useAuth";
import { applicationsRepo, assetsRepo, workspaceRecordsRepo, patternDocsRepo, feedbackEventsRepo, auditRepo } from "@/data";
import type { Application, Asset, WorkspaceRecord, PatternDoc, FeedbackEvent, AuditEntry } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, AppWindow, ClipboardList, Box, FileText, MessageSquare, History, Plus } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { getValidTransitions, STATUS_LABELS, type ApplicationStatus } from "@/lib/lifecycle";

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  active: "bg-primary/15 text-primary",
  paused: "bg-[hsl(var(--waka-warning))]/15 text-[hsl(var(--waka-warning))]",
  deprecated: "bg-destructive/15 text-destructive",
  archived: "bg-muted text-muted-foreground",
  open: "bg-primary/15 text-primary",
  in_progress: "bg-[hsl(var(--waka-warning))]/15 text-[hsl(var(--waka-warning))]",
  resolved: "bg-[hsl(var(--waka-success))]/15 text-[hsl(var(--waka-success))]",
  review: "bg-[hsl(var(--waka-info))]/15 text-[hsl(var(--waka-info))]",
  approved: "bg-[hsl(var(--waka-success))]/15 text-[hsl(var(--waka-success))]",
  superseded: "bg-muted text-muted-foreground",
  published: "bg-[hsl(var(--waka-success))]/15 text-[hsl(var(--waka-success))]",
  created: "bg-primary/15 text-primary",
  updated: "bg-[hsl(var(--waka-info))]/15 text-[hsl(var(--waka-info))]",
  deleted: "bg-destructive/15 text-destructive",
  status_changed: "bg-[hsl(var(--waka-warning))]/15 text-[hsl(var(--waka-warning))]",
};

function EmptyState({ icon: Icon, message }: { icon: React.ElementType; message: string }) {
  return (
    <div className="text-center py-12 border border-dashed border-border rounded-lg bg-card">
      <Icon className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <Badge variant="secondary" className={cn("text-[10px] font-semibold uppercase tracking-wider", STATUS_COLORS[status] || "")}>
      {status.replace("_", " ")}
    </Badge>
  );
}

function ItemRow({ title, subtitle, status, date }: { title: string; subtitle?: string; status: string; date: string }) {
  return (
    <div className="flex items-center justify-between py-3 px-4 border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground truncate">{title}</p>
        {subtitle && <p className="text-xs text-muted-foreground truncate mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3 shrink-0 ml-4">
        <StatusBadge status={status} />
        <span className="text-[10px] text-muted-foreground/60 w-20 text-right">
          {new Date(date).toLocaleDateString("es")}
        </span>
      </div>
    </div>
  );
}

export default function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [app, setApp] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<WorkspaceRecord[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [patterns, setPatterns] = useState<PatternDoc[]>([]);
  const [feedback, setFeedback] = useState<FeedbackEvent[]>([]);
  const [audit, setAudit] = useState<AuditEntry[]>([]);
  const [transitioning, setTransitioning] = useState(false);

  // Create dialogs
  const [recordDialogOpen, setRecordDialogOpen] = useState(false);
  const [assetDialogOpen, setAssetDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  // Form state
  const [newRecordTitle, setNewRecordTitle] = useState("");
  const [newRecordType, setNewRecordType] = useState("session");
  const [newRecordDesc, setNewRecordDesc] = useState("");
  const [newAssetName, setNewAssetName] = useState("");
  const [newAssetType, setNewAssetType] = useState("document");
  const [newAssetDesc, setNewAssetDesc] = useState("");
  const [patternDialogOpen, setPatternDialogOpen] = useState(false);
  const [newPatternTitle, setNewPatternTitle] = useState("");
  const [newPatternContent, setNewPatternContent] = useState("");
  const [newPatternVersion, setNewPatternVersion] = useState("0.1.0");
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [newFeedbackComment, setNewFeedbackComment] = useState("");
  const [newFeedbackSentiment, setNewFeedbackSentiment] = useState("neutral");

  const loadData = () => {
    if (!id) return;
    setLoading(true);

    Promise.all([
      applicationsRepo.findById(id),
      workspaceRecordsRepo.findAll({ order_by: "created_at" }),
      assetsRepo.findAll({ order_by: "created_at" }),
      patternDocsRepo.findAll({ order_by: "created_at" }),
      feedbackEventsRepo.findAll({ order_by: "created_at" }),
      auditRepo.findAll({ order_by: "created_at", limit: 50 }),
    ])
      .then(([appData, allRecords, allAssets, allPatterns, allFeedback, allAudit]) => {
        setApp(appData);
        setRecords(allRecords.filter((r) => r.application_id === id));
        setAssets(allAssets.filter((a) => a.application_id === id));
        setPatterns(allPatterns.filter((p) => p.application_id === id));
        setFeedback(allFeedback.filter((f) => f.entity_type === "application" && f.entity_id === id));
        const appRecordIds = new Set(allRecords.filter(r => r.application_id === id).map(r => r.id));
        const appAssetIds = new Set(allAssets.filter(a => a.application_id === id).map(a => a.id));
        const appPatternIds = new Set(allPatterns.filter(p => p.application_id === id).map(p => p.id));
        setAudit(allAudit.filter((a) =>
          (a.entity_type === "applications" && a.entity_id === id) ||
          (a.entity_type === "workspace_records" && appRecordIds.has(a.entity_id)) ||
          (a.entity_type === "assets" && appAssetIds.has(a.entity_id)) ||
          (a.entity_type === "pattern_docs" && appPatternIds.has(a.entity_id)) ||
          (a.entity_type === "feedback_events" && allFeedback.some(f => f.id === a.entity_id && f.entity_type === "application" && f.entity_id === id))
        ));
      })
      .catch(() => toast.error("Error cargando aplicación"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, [id]);

  const handleTransition = async (newStatus: ApplicationStatus) => {
    if (!app || !user) return;
    setTransitioning(true);
    try {
      const updated = await applicationsRepo.update(app.id, {
        status: newStatus,
        updated_by: user.id,
      } as any);
      setApp(updated);
      toast.success(`Estado cambiado a ${STATUS_LABELS[newStatus]}`);
      loadData();
    } catch {
      toast.error("Error cambiando estado");
    } finally {
      setTransitioning(false);
    }
  };

  const handleCreateRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !app) return;
    setCreating(true);
    try {
      await workspaceRecordsRepo.create({
        title: newRecordTitle,
        description: newRecordDesc,
        type: newRecordType as any,
        status: "open",
        application_id: app.id,
        tenant_id: app.tenant_id,
        created_by: user.id,
        updated_by: user.id,
        metadata: {},
      } as any);
      setNewRecordTitle("");
      setNewRecordDesc("");
      setNewRecordType("session");
      setRecordDialogOpen(false);
      toast.success("Workspace record creado");
      loadData();
    } catch {
      toast.error("Error creando record");
    } finally {
      setCreating(false);
    }
  };

  const handleCreateAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !app) return;
    setCreating(true);
    try {
      await assetsRepo.create({
        name: newAssetName,
        description: newAssetDesc,
        type: newAssetType as any,
        status: "draft",
        application_id: app.id,
        tenant_id: app.tenant_id,
        created_by: user.id,
        updated_by: user.id,
        version: "0.1.0",
        tags: [],
        metadata: {},
      } as any);
      setNewAssetName("");
      setNewAssetDesc("");
      setNewAssetType("document");
      setAssetDialogOpen(false);
      toast.success("Asset creado");
      loadData();
    } catch {
      toast.error("Error creando asset");
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-20">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </AppLayout>
    );
  }

  if (!app) {
    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto text-center py-20">
          <p className="text-muted-foreground">Aplicación no encontrada.</p>
          <Link to="/applications" className="text-primary text-sm mt-2 inline-block hover:underline">
            ← Volver a Applications
          </Link>
        </div>
      </AppLayout>
    );
  }

  const validTransitions = getValidTransitions(app.status as ApplicationStatus);

  const TAB_COUNTS = [
    { key: "records", label: "Workspace", count: records.length, icon: ClipboardList },
    { key: "assets", label: "Assets", count: assets.length, icon: Box },
    { key: "patterns", label: "Patterns", count: patterns.length, icon: FileText },
    { key: "feedback", label: "Feedback", count: feedback.length, icon: MessageSquare },
    { key: "audit", label: "Audit", count: audit.length, icon: History },
  ];

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <Link
          to="/applications"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors mb-4"
        >
          <ArrowLeft className="w-3 h-3" />
          Applications
        </Link>

        {/* Header with lifecycle controls */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <AppWindow className="w-5 h-5 text-primary" />
              <StatusBadge status={app.status} />
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
              {app.name}
            </h1>
            {app.description && (
              <p className="mt-1 text-sm text-muted-foreground max-w-2xl">
                {app.description}
              </p>
            )}
          </div>

          {/* Lifecycle transitions */}
          {validTransitions.length > 0 && (
            <div className="flex items-center gap-2">
              {validTransitions.map((target) => (
                <Button
                  key={target}
                  size="sm"
                  variant={target === "active" ? "default" : "outline"}
                  disabled={transitioning}
                  onClick={() => handleTransition(target)}
                  className="text-xs"
                >
                  → {STATUS_LABELS[target]}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="records" className="w-full">
          <TabsList className="w-full justify-start bg-muted/50 border border-border rounded-lg p-1 h-auto flex-wrap">
            {TAB_COUNTS.map(({ key, label, count, icon: Icon }) => (
              <TabsTrigger
                key={key}
                value={key}
                className="gap-2 data-[state=active]:bg-card data-[state=active]:shadow-sm text-xs px-3 py-2"
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
                {count > 0 && (
                  <span className="ml-1 text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-semibold">
                    {count}
                  </span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Workspace Records */}
          <TabsContent value="records" className="mt-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-sm font-semibold text-foreground">Workspace Records</h3>
              <Dialog open={recordDialogOpen} onOpenChange={setRecordDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                    <Plus className="w-3.5 h-3.5" /> Nuevo Record
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Crear Workspace Record</DialogTitle></DialogHeader>
                  <form onSubmit={handleCreateRecord} className="space-y-4 mt-2">
                    <div className="space-y-2">
                      <Label>Título</Label>
                      <Input value={newRecordTitle} onChange={(e) => setNewRecordTitle(e.target.value)} required placeholder="e.g. Sprint Review Q1" />
                    </div>
                    <div className="space-y-2">
                      <Label>Tipo</Label>
                      <Select value={newRecordType} onValueChange={setNewRecordType}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="session">Session</SelectItem>
                          <SelectItem value="change_request">Change Request</SelectItem>
                          <SelectItem value="decision">Decision</SelectItem>
                          <SelectItem value="exploration">Exploration</SelectItem>
                          <SelectItem value="review">Review</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Descripción</Label>
                      <Textarea value={newRecordDesc} onChange={(e) => setNewRecordDesc(e.target.value)} rows={3} placeholder="Describe el contexto..." />
                    </div>
                    <Button type="submit" className="w-full" disabled={creating}>
                      {creating ? "Creando..." : "Crear Record"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            {records.length === 0 ? (
              <EmptyState icon={ClipboardList} message="No hay workspace records para esta aplicación." />
            ) : (
              <div className="border border-border rounded-lg bg-card overflow-hidden">
                {records.map((r) => (
                  <ItemRow key={r.id} title={r.title} subtitle={r.type.replace("_", " ")} status={r.status} date={r.created_at} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Assets */}
          <TabsContent value="assets" className="mt-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-sm font-semibold text-foreground">Assets</h3>
              <Dialog open={assetDialogOpen} onOpenChange={setAssetDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                    <Plus className="w-3.5 h-3.5" /> Nuevo Asset
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Crear Asset</DialogTitle></DialogHeader>
                  <form onSubmit={handleCreateAsset} className="space-y-4 mt-2">
                    <div className="space-y-2">
                      <Label>Nombre</Label>
                      <Input value={newAssetName} onChange={(e) => setNewAssetName(e.target.value)} required placeholder="e.g. Onboarding Template" />
                    </div>
                    <div className="space-y-2">
                      <Label>Tipo</Label>
                      <Select value={newAssetType} onValueChange={setNewAssetType}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="template">Template</SelectItem>
                          <SelectItem value="component">Component</SelectItem>
                          <SelectItem value="document">Document</SelectItem>
                          <SelectItem value="prompt">Prompt</SelectItem>
                          <SelectItem value="workflow">Workflow</SelectItem>
                          <SelectItem value="dataset">Dataset</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Descripción</Label>
                      <Textarea value={newAssetDesc} onChange={(e) => setNewAssetDesc(e.target.value)} rows={3} placeholder="Describe el asset..." />
                    </div>
                    <Button type="submit" className="w-full" disabled={creating}>
                      {creating ? "Creando..." : "Crear Asset"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            {assets.length === 0 ? (
              <EmptyState icon={Box} message="No hay assets para esta aplicación." />
            ) : (
              <div className="border border-border rounded-lg bg-card overflow-hidden">
                {assets.map((a) => (
                  <ItemRow key={a.id} title={a.name} subtitle={`${a.type} · v${a.version}`} status={a.status} date={a.created_at} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Pattern Docs */}
          <TabsContent value="patterns" className="mt-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-sm font-semibold text-foreground">Pattern Docs</h3>
              <Dialog open={patternDialogOpen} onOpenChange={setPatternDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                    <Plus className="w-3.5 h-3.5" /> Nuevo Pattern Doc
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Crear Pattern Doc</DialogTitle></DialogHeader>
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    if (!user || !app) return;
                    setCreating(true);
                    try {
                      const doc = await patternDocsRepo.create({
                        title: newPatternTitle,
                        content: newPatternContent,
                        version: newPatternVersion,
                        status: "draft",
                        application_id: app.id,
                        tenant_id: app.tenant_id,
                        created_by: user.id,
                        updated_by: user.id,
                        tags: [],
                        metadata: {},
                      } as any);
                      setPatterns((prev) => [doc, ...prev]);
                      setNewPatternTitle("");
                      setNewPatternContent("");
                      setNewPatternVersion("0.1.0");
                      setPatternDialogOpen(false);
                      toast.success("Pattern Doc creado");
                    } catch {
                      toast.error("Error creando pattern doc");
                    } finally {
                      setCreating(false);
                    }
                  }} className="space-y-4 mt-2">
                    <div className="space-y-2">
                      <Label>Título</Label>
                      <Input value={newPatternTitle} onChange={(e) => setNewPatternTitle(e.target.value)} required placeholder="e.g. Auth Flow Pattern" />
                    </div>
                    <div className="space-y-2">
                      <Label>Contenido</Label>
                      <Textarea value={newPatternContent} onChange={(e) => setNewPatternContent(e.target.value)} rows={5} placeholder="Describe el patrón, decisiones, rationale..." />
                    </div>
                    <div className="space-y-2">
                      <Label>Versión</Label>
                      <Input value={newPatternVersion} onChange={(e) => setNewPatternVersion(e.target.value)} placeholder="0.1.0" />
                    </div>
                    <Button type="submit" className="w-full" disabled={creating}>
                      {creating ? "Creando..." : "Crear Pattern Doc"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            {patterns.length === 0 ? (
              <EmptyState icon={FileText} message="No hay pattern docs para esta aplicación." />
            ) : (
              <div className="border border-border rounded-lg bg-card overflow-hidden">
                {patterns.map((p) => (
                  <ItemRow key={p.id} title={p.title} subtitle={`v${p.version}`} status={p.status} date={p.created_at} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Feedback */}
          <TabsContent value="feedback" className="mt-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-sm font-semibold text-foreground">Feedback</h3>
              <Dialog open={feedbackDialogOpen} onOpenChange={setFeedbackDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                    <Plus className="w-3.5 h-3.5" /> Nuevo Feedback
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Registrar Feedback</DialogTitle></DialogHeader>
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    if (!user || !app) return;
                    setCreating(true);
                    try {
                      const fb = await feedbackEventsRepo.create({
                        entity_type: "application",
                        entity_id: app.id,
                        comment: newFeedbackComment,
                        sentiment: newFeedbackSentiment,
                        tenant_id: app.tenant_id,
                        created_by: user.id,
                        metadata: {},
                      } as any);
                      setFeedback((prev) => [fb, ...prev]);
                      setNewFeedbackComment("");
                      setNewFeedbackSentiment("neutral");
                      setFeedbackDialogOpen(false);
                      toast.success("Feedback registrado");
                    } catch {
                      toast.error("Error registrando feedback");
                    } finally {
                      setCreating(false);
                    }
                  }} className="space-y-4 mt-2">
                    <div className="space-y-2">
                      <Label>Sentiment</Label>
                      <Select value={newFeedbackSentiment} onValueChange={setNewFeedbackSentiment}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="positive">Positivo</SelectItem>
                          <SelectItem value="neutral">Neutral</SelectItem>
                          <SelectItem value="negative">Negativo</SelectItem>
                          <SelectItem value="mixed">Mixto</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Comentario</Label>
                      <Textarea value={newFeedbackComment} onChange={(e) => setNewFeedbackComment(e.target.value)} rows={3} placeholder="Describe el feedback..." />
                    </div>
                    <Button type="submit" className="w-full" disabled={creating}>
                      {creating ? "Registrando..." : "Registrar Feedback"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            {feedback.length === 0 ? (
              <EmptyState icon={MessageSquare} message="No hay feedback para esta aplicación." />
            ) : (
              <div className="border border-border rounded-lg bg-card overflow-hidden">
                {feedback.map((f) => (
                  <ItemRow key={f.id} title={f.comment || "Sin comentario"} subtitle={f.sentiment} status={f.sentiment} date={f.created_at} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Audit */}
          <TabsContent value="audit" className="mt-4">
            <h3 className="font-display text-sm font-semibold text-foreground mb-3">Audit Trail</h3>
            {audit.length === 0 ? (
              <EmptyState icon={History} message="No hay registros de auditoría para esta aplicación." />
            ) : (
              <div className="border border-border rounded-lg bg-card overflow-hidden">
                {audit.map((a) => (
                  <ItemRow key={a.id} title={`${a.action} on ${a.entity_type}`} subtitle={a.entity_id} status={a.action} date={a.created_at} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
