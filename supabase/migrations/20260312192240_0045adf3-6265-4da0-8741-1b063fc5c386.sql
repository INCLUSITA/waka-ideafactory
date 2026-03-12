
-- ============================================
-- 1. Create missing tables
-- ============================================

-- workspace_records
CREATE TABLE public.workspace_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES public.tenants(id),
  application_id uuid NOT NULL REFERENCES public.applications(id),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  type text NOT NULL DEFAULT 'session',
  status text NOT NULL DEFAULT 'open',
  created_by uuid NOT NULL,
  updated_by uuid NOT NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- pattern_docs
CREATE TABLE public.pattern_docs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES public.tenants(id),
  application_id uuid NOT NULL REFERENCES public.applications(id),
  title text NOT NULL,
  content text NOT NULL DEFAULT '',
  version text NOT NULL DEFAULT '0.1.0',
  status text NOT NULL DEFAULT 'draft',
  created_by uuid NOT NULL,
  updated_by uuid NOT NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  tags text[] NOT NULL DEFAULT '{}'::text[],
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- feedback_events
CREATE TABLE public.feedback_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES public.tenants(id),
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  sentiment text NOT NULL DEFAULT 'neutral',
  comment text,
  created_by uuid NOT NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================
-- 2. RLS on new tables
-- ============================================

ALTER TABLE public.workspace_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pattern_docs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback_events ENABLE ROW LEVEL SECURITY;

-- workspace_records
CREATE POLICY "Members can view workspace_records" ON public.workspace_records
  FOR SELECT TO authenticated USING (is_tenant_member(auth.uid(), tenant_id));
CREATE POLICY "Editors+ can manage workspace_records" ON public.workspace_records
  FOR ALL TO authenticated
  USING (has_tenant_role(auth.uid(), tenant_id, 'owner'::app_role) OR has_tenant_role(auth.uid(), tenant_id, 'admin'::app_role) OR has_tenant_role(auth.uid(), tenant_id, 'editor'::app_role))
  WITH CHECK (has_tenant_role(auth.uid(), tenant_id, 'owner'::app_role) OR has_tenant_role(auth.uid(), tenant_id, 'admin'::app_role) OR has_tenant_role(auth.uid(), tenant_id, 'editor'::app_role));

-- pattern_docs
CREATE POLICY "Members can view pattern_docs" ON public.pattern_docs
  FOR SELECT TO authenticated USING (is_tenant_member(auth.uid(), tenant_id));
CREATE POLICY "Editors+ can manage pattern_docs" ON public.pattern_docs
  FOR ALL TO authenticated
  USING (has_tenant_role(auth.uid(), tenant_id, 'owner'::app_role) OR has_tenant_role(auth.uid(), tenant_id, 'admin'::app_role) OR has_tenant_role(auth.uid(), tenant_id, 'editor'::app_role))
  WITH CHECK (has_tenant_role(auth.uid(), tenant_id, 'owner'::app_role) OR has_tenant_role(auth.uid(), tenant_id, 'admin'::app_role) OR has_tenant_role(auth.uid(), tenant_id, 'editor'::app_role));

-- feedback_events
CREATE POLICY "Members can view feedback_events" ON public.feedback_events
  FOR SELECT TO authenticated USING (is_tenant_member(auth.uid(), tenant_id));
CREATE POLICY "Editors+ can manage feedback_events" ON public.feedback_events
  FOR ALL TO authenticated
  USING (has_tenant_role(auth.uid(), tenant_id, 'owner'::app_role) OR has_tenant_role(auth.uid(), tenant_id, 'admin'::app_role) OR has_tenant_role(auth.uid(), tenant_id, 'editor'::app_role))
  WITH CHECK (has_tenant_role(auth.uid(), tenant_id, 'owner'::app_role) OR has_tenant_role(auth.uid(), tenant_id, 'admin'::app_role) OR has_tenant_role(auth.uid(), tenant_id, 'editor'::app_role));

-- updated_at triggers
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.workspace_records FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.pattern_docs FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================
-- 3. Audit logging triggers
-- ============================================

CREATE OR REPLACE FUNCTION public.audit_log_trigger()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.audit_log (tenant_id, actor_id, entity_type, entity_id, action, changes, metadata)
    VALUES (
      NEW.tenant_id,
      COALESCE(NEW.created_by, auth.uid()),
      TG_TABLE_NAME,
      NEW.id,
      'created'::audit_action,
      to_jsonb(NEW),
      jsonb_build_object('op', TG_OP)
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.audit_log (tenant_id, actor_id, entity_type, entity_id, action, changes, metadata)
    VALUES (
      NEW.tenant_id,
      COALESCE(NEW.updated_by, auth.uid()),
      TG_TABLE_NAME,
      NEW.id,
      CASE
        WHEN OLD.status IS DISTINCT FROM NEW.status THEN 'status_changed'::audit_action
        ELSE 'updated'::audit_action
      END,
      jsonb_build_object('old', to_jsonb(OLD), 'new', to_jsonb(NEW)),
      jsonb_build_object('op', TG_OP)
    );
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.audit_log (tenant_id, actor_id, entity_type, entity_id, action, changes, metadata)
    VALUES (
      OLD.tenant_id,
      auth.uid(),
      TG_TABLE_NAME,
      OLD.id,
      'deleted'::audit_action,
      to_jsonb(OLD),
      jsonb_build_object('op', TG_OP)
    );
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

-- Attach audit triggers to all operational tables
CREATE TRIGGER audit_trigger AFTER INSERT OR UPDATE OR DELETE ON public.applications FOR EACH ROW EXECUTE FUNCTION audit_log_trigger();
CREATE TRIGGER audit_trigger AFTER INSERT OR UPDATE OR DELETE ON public.assets FOR EACH ROW EXECUTE FUNCTION audit_log_trigger();
CREATE TRIGGER audit_trigger AFTER INSERT OR UPDATE OR DELETE ON public.workspace_records FOR EACH ROW EXECUTE FUNCTION audit_log_trigger();
CREATE TRIGGER audit_trigger AFTER INSERT OR UPDATE OR DELETE ON public.pattern_docs FOR EACH ROW EXECUTE FUNCTION audit_log_trigger();
CREATE TRIGGER audit_trigger AFTER INSERT OR UPDATE OR DELETE ON public.feedback_events FOR EACH ROW EXECUTE FUNCTION audit_log_trigger();
