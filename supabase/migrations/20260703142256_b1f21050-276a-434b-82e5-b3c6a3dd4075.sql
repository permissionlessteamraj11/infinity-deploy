
-- Admin-only policies for admin tables
CREATE POLICY "admin login attempts admin only" ON public.admin_login_attempts FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin banned devices admin only" ON public.admin_banned_devices FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Restrict SECURITY DEFINER function execution
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.credit_referral_commission(UUID, NUMERIC, TEXT) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon;
-- has_role stays callable by authenticated (used in RLS policies via SQL, but explicit revoke of anon)
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO authenticated;
