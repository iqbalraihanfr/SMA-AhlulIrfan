begin;
alter function public.today_wib() set search_path = '';
alter function public.is_today_wib(date) set search_path = '';
revoke all on function public.is_admin(), public.is_super_admin(), public.current_guru_id() from public, anon;
grant execute on function public.is_admin(), public.is_super_admin(), public.current_guru_id() to authenticated;
do $$ begin
  if to_regprocedure('public.rls_auto_enable()') is not null then
    revoke all on function public.rls_auto_enable() from public, anon, authenticated;
  end if;
end $$;
notify pgrst, 'reload schema';
commit;
