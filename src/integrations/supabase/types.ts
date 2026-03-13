export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      applications: {
        Row: {
          created_at: string
          created_by: string
          description: string
          id: string
          metadata: Json
          name: string
          status: Database["public"]["Enums"]["application_status"]
          tenant_id: string
          updated_at: string
          updated_by: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string
          id?: string
          metadata?: Json
          name: string
          status?: Database["public"]["Enums"]["application_status"]
          tenant_id: string
          updated_at?: string
          updated_by: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string
          id?: string
          metadata?: Json
          name?: string
          status?: Database["public"]["Enums"]["application_status"]
          tenant_id?: string
          updated_at?: string
          updated_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      assets: {
        Row: {
          application_id: string | null
          created_at: string
          created_by: string
          description: string
          id: string
          linked_pattern_id: string | null
          metadata: Json
          name: string
          status: Database["public"]["Enums"]["asset_status"]
          tags: string[]
          tenant_id: string
          type: Database["public"]["Enums"]["asset_type"]
          updated_at: string
          updated_by: string
          version: string
        }
        Insert: {
          application_id?: string | null
          created_at?: string
          created_by: string
          description?: string
          id?: string
          linked_pattern_id?: string | null
          metadata?: Json
          name: string
          status?: Database["public"]["Enums"]["asset_status"]
          tags?: string[]
          tenant_id: string
          type?: Database["public"]["Enums"]["asset_type"]
          updated_at?: string
          updated_by: string
          version?: string
        }
        Update: {
          application_id?: string | null
          created_at?: string
          created_by?: string
          description?: string
          id?: string
          linked_pattern_id?: string | null
          metadata?: Json
          name?: string
          status?: Database["public"]["Enums"]["asset_status"]
          tags?: string[]
          tenant_id?: string
          type?: Database["public"]["Enums"]["asset_type"]
          updated_at?: string
          updated_by?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "assets_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assets_linked_pattern_id_fkey"
            columns: ["linked_pattern_id"]
            isOneToOne: false
            referencedRelation: "pattern_docs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assets_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_log: {
        Row: {
          action: Database["public"]["Enums"]["audit_action"]
          actor_id: string
          changes: Json | null
          created_at: string
          entity_id: string
          entity_type: string
          id: string
          metadata: Json | null
          tenant_id: string
        }
        Insert: {
          action: Database["public"]["Enums"]["audit_action"]
          actor_id: string
          changes?: Json | null
          created_at?: string
          entity_id: string
          entity_type: string
          id?: string
          metadata?: Json | null
          tenant_id: string
        }
        Update: {
          action?: Database["public"]["Enums"]["audit_action"]
          actor_id?: string
          changes?: Json | null
          created_at?: string
          entity_id?: string
          entity_type?: string
          id?: string
          metadata?: Json | null
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_log_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback_events: {
        Row: {
          comment: string | null
          created_at: string
          created_by: string
          entity_id: string
          entity_type: string
          id: string
          linked_asset_id: string | null
          metadata: Json
          sentiment: string
          tenant_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          created_by: string
          entity_id: string
          entity_type: string
          id?: string
          linked_asset_id?: string | null
          metadata?: Json
          sentiment?: string
          tenant_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          created_by?: string
          entity_id?: string
          entity_type?: string
          id?: string
          linked_asset_id?: string | null
          metadata?: Json
          sentiment?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feedback_events_linked_asset_id_fkey"
            columns: ["linked_asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_events_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      ideas: {
        Row: {
          application_id: string | null
          category: string | null
          created_at: string
          created_by: string
          description: string
          id: string
          priority: Database["public"]["Enums"]["idea_priority"]
          scores: Json | null
          status: Database["public"]["Enums"]["idea_status"]
          tags: string[]
          tenant_id: string
          title: string
          updated_at: string
          updated_by: string
        }
        Insert: {
          application_id?: string | null
          category?: string | null
          created_at?: string
          created_by: string
          description?: string
          id?: string
          priority?: Database["public"]["Enums"]["idea_priority"]
          scores?: Json | null
          status?: Database["public"]["Enums"]["idea_status"]
          tags?: string[]
          tenant_id: string
          title: string
          updated_at?: string
          updated_by: string
        }
        Update: {
          application_id?: string | null
          category?: string | null
          created_at?: string
          created_by?: string
          description?: string
          id?: string
          priority?: Database["public"]["Enums"]["idea_priority"]
          scores?: Json | null
          status?: Database["public"]["Enums"]["idea_status"]
          tags?: string[]
          tenant_id?: string
          title?: string
          updated_at?: string
          updated_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "ideas_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ideas_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      pattern_docs: {
        Row: {
          application_id: string
          content: string
          created_at: string
          created_by: string
          id: string
          metadata: Json
          status: string
          tags: string[]
          tenant_id: string
          title: string
          updated_at: string
          updated_by: string
          version: string
        }
        Insert: {
          application_id: string
          content?: string
          created_at?: string
          created_by: string
          id?: string
          metadata?: Json
          status?: string
          tags?: string[]
          tenant_id: string
          title: string
          updated_at?: string
          updated_by: string
          version?: string
        }
        Update: {
          application_id?: string
          content?: string
          created_at?: string
          created_by?: string
          id?: string
          metadata?: Json
          status?: string
          tags?: string[]
          tenant_id?: string
          title?: string
          updated_at?: string
          updated_by?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "pattern_docs_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pattern_docs_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string
          email: string
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string
          email: string
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string
          email?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      tenant_memberships: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          tenant_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          tenant_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          tenant_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenant_memberships_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          created_at: string
          id: string
          logo_url: string | null
          name: string
          settings: Json
          slug: string
          status: Database["public"]["Enums"]["tenant_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name: string
          settings?: Json
          slug: string
          status?: Database["public"]["Enums"]["tenant_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name?: string
          settings?: Json
          slug?: string
          status?: Database["public"]["Enums"]["tenant_status"]
          updated_at?: string
        }
        Relationships: []
      }
      workspace_records: {
        Row: {
          application_id: string
          created_at: string
          created_by: string
          description: string
          id: string
          linked_asset_ids: string[]
          metadata: Json
          next_action: string
          owner_id: string | null
          priority: string
          status: string
          tenant_id: string
          title: string
          type: string
          updated_at: string
          updated_by: string
        }
        Insert: {
          application_id: string
          created_at?: string
          created_by: string
          description?: string
          id?: string
          linked_asset_ids?: string[]
          metadata?: Json
          next_action?: string
          owner_id?: string | null
          priority?: string
          status?: string
          tenant_id: string
          title: string
          type?: string
          updated_at?: string
          updated_by: string
        }
        Update: {
          application_id?: string
          created_at?: string
          created_by?: string
          description?: string
          id?: string
          linked_asset_ids?: string[]
          metadata?: Json
          next_action?: string
          owner_id?: string | null
          priority?: string
          status?: string
          tenant_id?: string
          title?: string
          type?: string
          updated_at?: string
          updated_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_records_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workspace_records_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_tenant_ids: { Args: { _user_id: string }; Returns: string[] }
      has_tenant_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _tenant_id: string
          _user_id: string
        }
        Returns: boolean
      }
      is_tenant_member: {
        Args: { _tenant_id: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "owner" | "admin" | "editor" | "viewer"
      application_status:
        | "draft"
        | "active"
        | "paused"
        | "deprecated"
        | "archived"
      asset_status: "draft" | "published" | "deprecated"
      asset_type:
        | "template"
        | "component"
        | "document"
        | "prompt"
        | "workflow"
        | "dataset"
      audit_action:
        | "created"
        | "updated"
        | "deleted"
        | "status_changed"
        | "role_changed"
        | "scored"
        | "published"
      idea_priority: "low" | "medium" | "high" | "critical"
      idea_status:
        | "draft"
        | "submitted"
        | "evaluating"
        | "approved"
        | "in_progress"
        | "validated"
        | "archived"
        | "rejected"
      tenant_status: "active" | "suspended" | "archived"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["owner", "admin", "editor", "viewer"],
      application_status: [
        "draft",
        "active",
        "paused",
        "deprecated",
        "archived",
      ],
      asset_status: ["draft", "published", "deprecated"],
      asset_type: [
        "template",
        "component",
        "document",
        "prompt",
        "workflow",
        "dataset",
      ],
      audit_action: [
        "created",
        "updated",
        "deleted",
        "status_changed",
        "role_changed",
        "scored",
        "published",
      ],
      idea_priority: ["low", "medium", "high", "critical"],
      idea_status: [
        "draft",
        "submitted",
        "evaluating",
        "approved",
        "in_progress",
        "validated",
        "archived",
        "rejected",
      ],
      tenant_status: ["active", "suspended", "archived"],
    },
  },
} as const
