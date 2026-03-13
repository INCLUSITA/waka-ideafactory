
-- Add operational fields to workspace_records
ALTER TABLE public.workspace_records
  ADD COLUMN IF NOT EXISTS owner_id uuid DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS next_action text DEFAULT ''::text NOT NULL,
  ADD COLUMN IF NOT EXISTS priority text DEFAULT 'medium'::text NOT NULL;

-- Add linking columns
ALTER TABLE public.workspace_records
  ADD COLUMN IF NOT EXISTS linked_asset_ids uuid[] DEFAULT '{}'::uuid[] NOT NULL;

ALTER TABLE public.assets
  ADD COLUMN IF NOT EXISTS linked_pattern_id uuid DEFAULT NULL REFERENCES public.pattern_docs(id) ON DELETE SET NULL;

ALTER TABLE public.feedback_events
  ADD COLUMN IF NOT EXISTS linked_asset_id uuid DEFAULT NULL REFERENCES public.assets(id) ON DELETE SET NULL;

-- Re-create audit triggers that were dropped
CREATE OR REPLACE TRIGGER audit_applications
  AFTER INSERT OR UPDATE OR DELETE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.audit_log_trigger();

CREATE OR REPLACE TRIGGER audit_assets
  AFTER INSERT OR UPDATE OR DELETE ON public.assets
  FOR EACH ROW EXECUTE FUNCTION public.audit_log_trigger();

CREATE OR REPLACE TRIGGER audit_workspace_records
  AFTER INSERT OR UPDATE OR DELETE ON public.workspace_records
  FOR EACH ROW EXECUTE FUNCTION public.audit_log_trigger();

CREATE OR REPLACE TRIGGER audit_pattern_docs
  AFTER INSERT OR UPDATE OR DELETE ON public.pattern_docs
  FOR EACH ROW EXECUTE FUNCTION public.audit_log_trigger();

CREATE OR REPLACE TRIGGER audit_feedback_events
  AFTER INSERT OR UPDATE OR DELETE ON public.feedback_events
  FOR EACH ROW EXECUTE FUNCTION public.audit_log_trigger();
