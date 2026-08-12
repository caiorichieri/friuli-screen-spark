ALTER POLICY "Admins view all roles" ON public.user_roles TO authenticated;
ALTER POLICY "Admins manage roles" ON public.user_roles TO authenticated;
ALTER POLICY "Admins manage categories" ON public.service_categories TO authenticated;
ALTER POLICY "Admins read all services" ON public.services TO authenticated;
ALTER POLICY "Admins manage services" ON public.services TO authenticated;
ALTER POLICY "Admins read all clients" ON public.clients TO authenticated;
ALTER POLICY "Admins manage clients" ON public.clients TO authenticated;
ALTER POLICY "Admins manage projects" ON public.projects TO authenticated;
ALTER POLICY "Admins manage project_items" ON public.project_items TO authenticated;
ALTER POLICY "Admins manage payment_schedules" ON public.payment_schedules TO authenticated;
ALTER POLICY "Admins manage portfolio categories" ON public.portfolio_categories TO authenticated;

ALTER POLICY "Admins upload client logos" ON storage.objects TO authenticated;
ALTER POLICY "Admins update client logos" ON storage.objects TO authenticated;
ALTER POLICY "Admins delete client logos" ON storage.objects TO authenticated;
ALTER POLICY "Admins list client logos" ON storage.objects TO authenticated;
ALTER POLICY "Admins upload project images" ON storage.objects TO authenticated;
ALTER POLICY "Admins update project images" ON storage.objects TO authenticated;
ALTER POLICY "Admins delete project images" ON storage.objects TO authenticated;

-- RLS policies for signed-in users need to evaluate these helpers
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_client_manager(uuid) TO authenticated;