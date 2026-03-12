/**
 * Base repository — typed Supabase adapter.
 * All domain repositories extend this for consistent data access.
 */
import { supabase } from "@/integrations/supabase/client";

export type TableName =
  | "tenants"
  | "profiles"
  | "tenant_memberships"
  | "applications"
  | "assets"
  | "ideas"
  | "workspace_records"
  | "pattern_docs"
  | "feedback_events"
  | "audit_log";

export interface QueryFilters {
  tenant_id?: string;
  status?: string;
  limit?: number;
  offset?: number;
  order_by?: string;
  ascending?: boolean;
}

/**
 * Generic repository for Supabase tables.
 * Uses `any` casts at the Supabase boundary because the auto-generated types
 * haven't been refreshed yet — our domain types are the source of truth.
 */
export class BaseRepository<T extends { id: string }> {
  constructor(protected readonly table: TableName) {}

  async findAll(filters?: QueryFilters): Promise<T[]> {
    let query = (supabase.from as any)(this.table).select("*");

    if (filters?.tenant_id) {
      query = query.eq("tenant_id", filters.tenant_id);
    }
    if (filters?.status) {
      query = query.eq("status", filters.status);
    }
    if (filters?.order_by) {
      query = query.order(filters.order_by, {
        ascending: filters.ascending ?? false,
      });
    } else {
      query = query.order("created_at", { ascending: false });
    }
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }
    if (filters?.offset) {
      query = query.range(
        filters.offset,
        filters.offset + (filters.limit ?? 50) - 1
      );
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []) as T[];
  }

  async findById(id: string): Promise<T | null> {
    const { data, error } = await (supabase.from as any)(this.table)
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data as T | null;
  }

  async create(payload: Omit<T, "id" | "created_at" | "updated_at">): Promise<T> {
    const { data, error } = await (supabase.from(this.table) as any)
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    return data as T;
  }

  async update(id: string, payload: Partial<T>): Promise<T> {
    const { data, error } = await (supabase.from(this.table) as any)
      .update(payload)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data as T;
  }

  async remove(id: string): Promise<void> {
    const { error } = await (supabase.from(this.table) as any)
      .delete()
      .eq("id", id);
    if (error) throw error;
  }
}
