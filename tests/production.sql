-- Run with psql -v ON_ERROR_STOP=1 -d sma_production_test -f tests/production.sql.
-- Disposable, local database only. No real school data or credentials.
\set ON_ERROR_STOP on
set client_min_messages = warning;
do $$ begin
  if current_database() <> 'sma_production_test' or inet_server_addr() is distinct from '127.0.0.1'::inet then
    raise exception 'This check requires the disposable local sma_production_test database.';
  end if;
end $$;
do $$ begin
  if not exists(select 1 from pg_roles where rolname='anon') then create role anon nologin; end if;
  if not exists(select 1 from pg_roles where rolname='authenticated') then create role authenticated nologin; end if;
end $$;
create schema auth;
create table auth.users(id uuid primary key);
create function auth.uid() returns uuid language sql stable as $$
  select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid;
$$;
create schema storage;
create table storage.buckets(id text primary key, name text, public boolean, file_size_limit bigint, allowed_mime_types text[]);
create table storage.objects(id bigint generated always as identity, bucket_id text references storage.buckets, name text);
alter table storage.objects enable row level security;
grant usage on schema public, auth, storage to anon, authenticated;
grant all on storage.objects to anon, authenticated;
grant usage on all sequences in schema storage to authenticated;
alter default privileges in schema public grant all on tables to anon, authenticated;
alter default privileges in schema public grant usage on sequences to authenticated;
\ir ../supabase/schema.sql
-- Simulate the legacy permissive policies found in production.
create policy legacy_students_public on public.siswa for select using (true);
create policy legacy_news_public on public.berita for select using (true);
create policy "Allow upload to images" on storage.objects for insert with check (bucket_id='images');
create policy "Allow update to images" on storage.objects for update using (bucket_id='images');
insert into public.album(judul, slug, image_url) values ('Old album', 'old-album', 'https://example.org/old.jpg');
insert into public.berita(judul, slug, isi, status) values ('Legacy published', 'legacy-published', 'Text', 'terbit');
\ir ../supabase/migrations/20261005013237_production_readiness.sql
\ir ../supabase/migrations/20261005023236_restrict_helper_access.sql
do $$ begin
  assert (select diterbitkan_pada is not null from public.berita where slug='legacy-published'), 'Old published article hidden';
end $$;
begin;
insert into auth.users values
 ('00000000-0000-0000-0000-000000000001'), ('00000000-0000-0000-0000-000000000002'),
 ('00000000-0000-0000-0000-000000000003'), ('00000000-0000-0000-0000-000000000004');
insert into public.guru(id,nama) values (101,'Teacher A'),(102,'Teacher B');
insert into public.users(id,nama,email,peran,guru_id) values
 ('00000000-0000-0000-0000-000000000001','Owner','owner@example.org','super-admin',null),
 ('00000000-0000-0000-0000-000000000002','Admin','admin@example.org','admin',null),
 ('00000000-0000-0000-0000-000000000003','Teacher A','teacher-a@example.org','guru',101),
 ('00000000-0000-0000-0000-000000000004','Teacher B','teacher-b@example.org','guru',102);
insert into public.tahun_ajaran(id,nama,semester,mulai_pada,selesai_pada,aktif)
 values (101,'2026/2027','ganjil',public.today_wib()-30,public.today_wib()+120,true);
insert into public.kelas(id,tahun_ajaran_id,nama,tingkat,wali_kelas_id)
 values(101,101,'X-A',10,101),(102,101,'X-B',10,102);
insert into public.siswa(id,kode_siswa,nama) values (101,'A1','Student A'),(102,'A2','Student B'),(103,'B1','Student C');
insert into public.anggota_kelas(kelas_id,siswa_id,mulai_pada)
 values(101,101,public.today_wib()-30),(101,102,public.today_wib()-30),(102,103,public.today_wib()-30);
insert into public.berita(judul,slug,isi,status,diterbitkan_pada) values
 ('Published','published','Text','terbit',now()-interval '1 hour'),
 ('Future','future','Text','terbit',now()+interval '1 day'),('Draft','draft','Text','draft',null);

set local role anon;
do $$ begin
  begin perform 1 from public.siswa; assert false, 'Anonymous student read must fail';
  exception when insufficient_privilege then null; end;
  assert (select count(*) from public.berita) = 2, 'Draft and future news leaked';
  begin insert into storage.objects(bucket_id,name) values('images','anonymous.jpg');
    assert false, 'Anonymous image upload must fail'; exception when insufficient_privilege then null; end;
end $$;
reset role;

set local role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000002',true);
do $$ declare n integer; begin
  update public.users set peran='super-admin' where id=auth.uid();
  get diagnostics n = row_count;
  assert n=0, 'Admin must not promote own role';
  begin delete from public.riwayat_presensi; assert false, 'Audit delete must fail';
  exception when insufficient_privilege then null; end;
  begin perform public.simpan_tahun_ajaran(null,'2026/2027','ganjil',public.today_wib(),public.today_wib()+10,true);
    assert false, 'Duplicate period must fail'; exception when unique_violation then null; end;
  assert (select aktif from public.tahun_ajaran where id=101), 'Failed insert disabled the active period';
  insert into storage.objects(bucket_id,name) values('images','test/photo.jpg');
  assert (select foto_urls from public.album where slug='old-album') = array['https://example.org/old.jpg'], 'Old photo lost';
end $$;

select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000003',true);
do $$ declare result jsonb; n integer; begin
  assert (select count(*) from public.siswa)=2, 'Teacher roster access is wrong';
  begin perform public.simpan_presensi(102,public.today_wib(),1,'[{"siswa_id":103,"status":"hadir"}]',true,null);
    assert false, 'Teacher must not edit another class'; exception when insufficient_privilege then null; end;
  begin perform public.simpan_presensi(101,public.today_wib(),1,'[]',true,null);
    assert false, 'Empty finalization must fail'; exception when invalid_parameter_value then null; end;
  begin perform public.simpan_presensi(101,public.today_wib(),1,'[{"siswa_id":101,"status":"hadir"}]',true,null);
    assert false, 'Incomplete finalization must fail'; exception when invalid_parameter_value then null; end;
  begin perform public.simpan_presensi(101,public.today_wib(),1,'[{"siswa_id":103,"status":"hadir"}]',false,null);
    assert false, 'Foreign roster entry must fail'; exception when invalid_parameter_value then null; end;
  result := public.simpan_presensi(101,public.today_wib(),1,'[{"siswa_id":101,"status":"hadir"},{"siswa_id":102,"status":"terlambat"}]',true,null);
  assert result->>'status'='selesai' and (result->>'versi')::int=2, 'First finalization failed';
  select count(*) into n from public.riwayat_presensi where aksi='selesaikan';
  assert n=1, 'Finalization action violates audit contract';
  begin perform public.simpan_presensi(101,public.today_wib(),1,'[{"siswa_id":101,"status":"hadir"},{"siswa_id":102,"status":"hadir"}]',true,null);
    assert false, 'Stale write must fail'; exception when raise_exception then
      if sqlerrm not like 'KONFLIK_VERSI:%' then raise; end if; end;
  perform public.simpan_presensi(101,public.today_wib(),2,'[{"siswa_id":101,"status":"hadir"},{"siswa_id":102,"status":"terlambat"}]',true,null);
  assert (select count(*) from public.riwayat_presensi where aksi='selesaikan')=1, 'Repeated save duplicates finalization audit';
  assert (select count(*) from public.rekap_presensi(101,null,public.today_wib(),public.today_wib()))=2, 'Rekap leaks other class';
  assert (select persentase from public.rekap_presensi(101,101,public.today_wib(),public.today_wib()) where siswa_id=102)=100, 'Late student should count present';
  begin insert into storage.objects(bucket_id,name) values('images','teacher.jpg');
    assert false, 'Teacher upload must fail'; exception when insufficient_privilege then null; end;
end $$;

select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000001',true);
do $$ begin
  begin delete from public.users where id=auth.uid(); assert false, 'Last owner deletion must fail';
  exception when check_violation then null; end;
  begin update public.users set peran='admin' where id=auth.uid(); assert false, 'Last owner demotion must fail';
  exception when check_violation then null; end;
end $$;
rollback;
\echo 'PASS: production migration, RLS, upload permissions, attendance, rekap, and atomic period saves'
