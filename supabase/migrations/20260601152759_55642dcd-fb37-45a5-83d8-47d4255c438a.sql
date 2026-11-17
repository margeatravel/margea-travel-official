-- Revoke EXECUTE on grant_admin_by_email from public roles; only service_role and authenticated admins (via in-function check) should call it
REVOKE EXECUTE ON FUNCTION public.grant_admin_by_email(text) FROM PUBLIC, anon;

-- Restrict has_role: only authenticated needs direct EXECUTE (RLS uses owner privileges anyway)
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;

-- Trigger-only helpers — no client should call them directly
REVOKE EXECUTE ON FUNCTION public.link_member_to_auth_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user_welcome_email() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;

-- get_property_blocked_dates is intentionally public (powers calendar availability), keep as-is.