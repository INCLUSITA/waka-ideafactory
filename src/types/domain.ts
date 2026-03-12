/**
 * WAKA Ideas Factory — Core Domain Types
 *
 * Mirrors the Supabase schema exactly.
 * Primary mental model: Applications > Assets > Ideas (secondary).
 */

// ─── Base ────────────────────────────────────────────────────

export type UUID = string;
export type ISODateTime = string;

export interface Timestamped {
  created_at: ISODateTime;
  updated_at: ISODateTime;
}

export interface TenantScoped {
  tenant_id: UUID;
}

export interface Auditable {
  created_by: UUID;
  updated_by: UUID;
}

// ─── Tenancy ─────────────────────────────────────────────────

export type TenantStatus = "active" | "suspended" | "archived";

export interface Tenant extends Timestamped {
  id: UUID;
  name: string;
  slug: string;
  logo_url?: string | null;
  status: TenantStatus;
  settings: Record<string, unknown>;
}

// ─── Users & Roles ───────────────────────────────────────────

export type AppRole = "owner" | "admin" | "editor" | "viewer";

export interface UserProfile extends Timestamped {
  id: UUID;
  email: string;
  display_name: string;
  avatar_url?: string | null;
}

export interface TenantMembership extends Timestamped {
  id: UUID;
  tenant_id: UUID;
  user_id: UUID;
  role: AppRole;
}

// ─── Applications (primary operational entity) ───────────────

export type ApplicationStatus =
  | "draft"
  | "active"
  | "paused"
  | "deprecated"
  | "archived";

export interface Application extends Timestamped, TenantScoped, Auditable {
  id: UUID;
  name: string;
  description: string;
  status: ApplicationStatus;
  metadata: Record<string, unknown>;
}

// ─── Assets ──────────────────────────────────────────────────

export type AssetType =
  | "template"
  | "component"
  | "document"
  | "prompt"
  | "workflow"
  | "dataset";

export type AssetStatus = "draft" | "published" | "deprecated";

export interface Asset extends Timestamped, TenantScoped, Auditable {
  id: UUID;
  application_id?: UUID | null;
  name: string;
  type: AssetType;
  status: AssetStatus;
  description: string;
  version: string;
  tags: string[];
  metadata: Record<string, unknown>;
}

// ─── Ideas (secondary, within operational context) ───────────

export type IdeaStatus =
  | "draft"
  | "submitted"
  | "evaluating"
  | "approved"
  | "in_progress"
  | "validated"
  | "archived"
  | "rejected";

export type IdeaPriority = "low" | "medium" | "high" | "critical";

export interface IdeaScores {
  impact: number;
  feasibility: number;
  alignment: number;
  urgency: number;
  composite?: number;
}

export interface Idea extends Timestamped, TenantScoped, Auditable {
  id: UUID;
  application_id?: UUID | null;
  title: string;
  description: string;
  status: IdeaStatus;
  priority: IdeaPriority;
  tags: string[];
  category?: string | null;
  scores?: IdeaScores | null;
}

// ─── Audit Log ───────────────────────────────────────────────

export type AuditAction =
  | "created"
  | "updated"
  | "deleted"
  | "status_changed"
  | "role_changed"
  | "scored"
  | "published";

export interface AuditEntry extends TenantScoped {
  id: UUID;
  created_at: ISODateTime;
  actor_id: UUID;
  entity_type: string;
  entity_id: UUID;
  action: AuditAction;
  changes?: Record<string, unknown> | null;
  metadata?: Record<string, unknown> | null;
}
