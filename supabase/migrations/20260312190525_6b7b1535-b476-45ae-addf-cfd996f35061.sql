
-- Auto-onboarding: when a profile is created, auto-create a personal tenant + owner membership
CREATE OR REPLACE FUNCTION public.handle_new_profile_onboarding()
  RETURNS trigger
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO 'public'
AS $$
DECLARE
  _tenant_id uuid;
  _slug text;
BEGIN
  -- Generate a unique slug from display_name or email
  _slug := lower(regexp_replace(
    COALESCE(NULLIF(NEW.display_name, ''), split_part(NEW.email, '@', 1)),
    '[^a-z0-9]+', '-', 'g'
  ));
  -- Append random suffix for uniqueness
  _slug := _slug || '-' || substr(gen_random_uuid()::text, 1, 8);

  -- Create personal tenant
  INSERT INTO public.tenants (name, slug, status, settings)
  VALUES (
    COALESCE(NULLIF(NEW.display_name, ''), split_part(NEW.email, '@', 1)) || '''s Workspace',
    _slug,
    'active',
    '{}'::jsonb
  )
  RETURNING id INTO _tenant_id;

  -- Assign as owner
  INSERT INTO public.tenant_memberships (tenant_id, user_id, role)
  VALUES (_tenant_id, NEW.id, 'owner');

  RETURN NEW;
END;
$$;

-- Allow INSERT on tenants for the trigger (security definer handles it, but we need the policy for the function)
-- The function runs as SECURITY DEFINER so it bypasses RLS.

-- Create the trigger on profiles table
CREATE TRIGGER on_profile_created_onboarding
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_profile_onboarding();
