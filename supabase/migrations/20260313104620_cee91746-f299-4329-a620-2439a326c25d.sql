-- Attach audit_log_trigger to all operational tables
CREATE TRIGGER audit_applications
  AFTER INSERT OR UPDATE OR DELETE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.audit_log_trigger();

CREATE TRIGGER audit_assets
  AFTER INSERT OR UPDATE OR DELETE ON public.assets
  FOR EACH ROW EXECUTE FUNCTION public.audit_log_trigger();

CREATE TRIGGER audit_workspace_records
  AFTER INSERT OR UPDATE OR DELETE ON public.workspace_records
  FOR EACH ROW EXECUTE FUNCTION public.audit_log_trigger();

CREATE TRIGGER audit_pattern_docs
  AFTER INSERT OR UPDATE OR DELETE ON public.pattern_docs
  FOR EACH ROW EXECUTE FUNCTION public.audit_log_trigger();

CREATE TRIGGER audit_feedback_events
  AFTER INSERT OR UPDATE OR DELETE ON public.feedback_events
  FOR EACH ROW EXECUTE FUNCTION public.audit_log_trigger();