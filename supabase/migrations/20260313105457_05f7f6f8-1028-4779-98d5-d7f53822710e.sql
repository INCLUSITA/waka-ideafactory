-- Remove duplicate audit_trigger (the generic one) from all tables, keep named ones
DROP TRIGGER IF EXISTS audit_trigger ON public.applications;
DROP TRIGGER IF EXISTS audit_trigger ON public.assets;
DROP TRIGGER IF EXISTS audit_trigger ON public.workspace_records;
DROP TRIGGER IF EXISTS audit_trigger ON public.pattern_docs;
DROP TRIGGER IF EXISTS audit_trigger ON public.feedback_events;