/**
 * WAKA Ideas Factory — Core Domain Types
 * 
 * Designed for multi-tenancy, governance, and traceability.
 * These types define the contracts that services and UI consume.
 * Backend schemas (Supabase tables) should mirror these structures.
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

export interface Tenant extends Timestamped {
  id: UUID;
  name: string;
  slug: string;
  logo_url?: string;
  settings: TenantSettings;
  status: "active" | "suspended" | "archived";
}

export interface TenantSettings {
  features_enabled: string[];
  max_members: number;
  branding?: {
    primary_color?: string;
    logo_url?: string;
  };
}

// ─── Users & Roles ───────────────────────────────────────────

export type AppRole = "admin" | "editor" | "viewer" | "owner";

export interface UserProfile extends Timestamped {
  id: UUID;
  email: string;
  display_name: string;
  avatar_url?: string;
}

export interface TenantMembership extends Timestamped {
  id: UUID;
  tenant_id: UUID;
  user_id: UUID;
  role: AppRole;
}

// ─── Ideas Pipeline ──────────────────────────────────────────

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

export interface Idea extends Timestamped, TenantScoped, Auditable {
  id: UUID;
  title: string;
  description: string;
  status: IdeaStatus;
  priority: IdeaPriority;
  tags: string[];
  category?: string;
  attachments: UUID[];
  // AXIOM-lite readiness: scoring dimensions
  scores?: IdeaScores;
}

export interface IdeaScores {
  impact: number;       // 1-10
  feasibility: number;  // 1-10
  alignment: number;    // 1-10
  urgency: number;      // 1-10
  composite?: number;   // calculated
}

// ─── Assets (NEXUS-lite readiness) ───────────────────────────

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
  name: string;
  type: AssetType;
  status: AssetStatus;
  description: string;
  version: string;
  tags: string[];
  metadata: Record<string, unknown>;
  source_idea_id?: UUID; // traceability back to idea
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
  timestamp: ISODateTime;
  actor_id: UUID;
  entity_type: "idea" | "asset" | "tenant" | "membership";
  entity_id: UUID;
  action: AuditAction;
  changes?: Record<string, { from: unknown; to: unknown }>;
  metadata?: Record<string, unknown>;
}
