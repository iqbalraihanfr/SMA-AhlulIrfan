begin;
alter table public.guru enable row level security;
alter table public.berita enable row level security;
alter table public.struktur_organisasi enable row level security;
alter table public.ekstrakurikuler enable row level security;
alter table public.album enable row level security;
alter table public.konten_halaman enable row level security;
alter table public.pengaturan_situs enable row level security;
alter table public.users enable row level security;
alter table public.tahun_ajaran enable row level security;
alter table public.kelas enable row level security;
alter table public.siswa enable row level security;
alter table public.anggota_kelas enable row level security;
alter table public.presensi enable row level security;
alter table public.kehadiran_siswa enable row level security;
alter table public.riwayat_presensi enable row level security;
alter table public.riwayat_presensi alter column alasan type varchar(500);
-- Preserve already-published articles saved before the publication date was used.
update public.berita set diterbitkan_pada = coalesce(created_at, now())
  where status = 'terbit' and diterbitkan_pada is null;
-- Check if current user is admin or super-admin
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.users
    where id = auth.uid()
      and peran in ('admin', 'super-admin')
  );
$$ language sql stable security definer set search_path = '';

-- Get current user's linked guru_id
create or replace function public.current_guru_id()
returns bigint as $$
  select guru_id from public.users
  where id = auth.uid();
$$ language sql stable security definer set search_path = '';

-- Account management is reserved for super-admins.
create or replace function public.is_super_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.users where id = auth.uid() and peran = 'super-admin');
$$;

-- Check if a given date is today in WIB (Asia/Jakarta)
create or replace function public.is_today_wib(p_tanggal date)
returns boolean as $$
  select p_tanggal = (timezone('Asia/Jakarta', now())::date);
$$ language sql stable;

-- Get current date in WIB (Asia/Jakarta)
create or replace function public.today_wib()
returns date as $$
  select timezone('Asia/Jakarta', now())::date;
$$ language sql stable;

do $$
declare row record;
begin
  for row in select tablename, policyname from pg_policies where schemaname = 'public'
    and tablename in ('users','tahun_ajaran','kelas','siswa','anggota_kelas','presensi','kehadiran_siswa','riwayat_presensi','guru','berita','struktur_organisasi','ekstrakurikuler','album','konten_halaman','pengaturan_situs') loop
    execute format('drop policy %I on public.%I', row.policyname, row.tablename);
  end loop;
end;
$$;
-- Public read policies for profile website
drop policy if exists "Allow public read access to active guru" on public.guru;
create policy "Allow public read access to active guru" on public.guru for select using (aktif = true);

drop policy if exists "Allow public read access to published berita" on public.berita;
create policy "Allow public read access to published berita" on public.berita for select using (status = 'terbit' and diterbitkan_pada <= now());

drop policy if exists "Allow public read access to struktur_organisasi" on public.struktur_organisasi;
create policy "Allow public read access to struktur_organisasi" on public.struktur_organisasi for select using (true);

drop policy if exists "Allow public read access to ekstrakurikuler" on public.ekstrakurikuler;
create policy "Allow public read access to ekstrakurikuler" on public.ekstrakurikuler for select using (true);

drop policy if exists "Allow public read access to album" on public.album;
create policy "Allow public read access to album" on public.album for select using (true);

drop policy if exists "Allow public read access to published konten_halaman" on public.konten_halaman;
create policy "Allow public read access to published konten_halaman" on public.konten_halaman for select using (terbit = true);

drop policy if exists "Allow public read access to pengaturan_situs" on public.pengaturan_situs;
create policy "Allow public read access to pengaturan_situs" on public.pengaturan_situs for select using (true);

-- Admin full management policies
drop policy if exists "Admins can do everything on guru" on public.guru;
create policy "Admins can do everything on guru" on public.guru to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins can do everything on berita" on public.berita;
create policy "Admins can do everything on berita" on public.berita to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins can do everything on struktur_organisasi" on public.struktur_organisasi;
create policy "Admins can do everything on struktur_organisasi" on public.struktur_organisasi to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins can do everything on ekstrakurikuler" on public.ekstrakurikuler;
create policy "Admins can do everything on ekstrakurikuler" on public.ekstrakurikuler to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins can do everything on album" on public.album;
create policy "Admins can do everything on album" on public.album to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins can do everything on konten_halaman" on public.konten_halaman;
create policy "Admins can do everything on konten_halaman" on public.konten_halaman to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins can do everything on pengaturan_situs" on public.pengaturan_situs;
create policy "Admins can do everything on pengaturan_situs" on public.pengaturan_situs to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins can do everything on users" on public.users;
create policy "Admins can do everything on users" on public.users to authenticated using (public.is_super_admin()) with check (public.is_super_admin());

drop policy if exists "Users can read own profile" on public.users;
create policy "Users can read own profile" on public.users for select to authenticated using (auth.uid() = id);

-- Absensi: tahun_ajaran policies
drop policy if exists "Admins can do everything on tahun_ajaran" on public.tahun_ajaran;
create policy "Admins can do everything on tahun_ajaran" on public.tahun_ajaran
  to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Authenticated users can view tahun_ajaran" on public.tahun_ajaran;
create policy "Authenticated users can view tahun_ajaran" on public.tahun_ajaran
  for select to authenticated using (true);

-- Absensi: kelas policies
drop policy if exists "Admins can do everything on kelas" on public.kelas;
create policy "Admins can do everything on kelas" on public.kelas
  to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Guru can view assigned kelas" on public.kelas;
create policy "Guru can view assigned kelas" on public.kelas
  for select to authenticated using (
    public.is_admin() or (wali_kelas_id is not null and wali_kelas_id = public.current_guru_id())
  );

-- Absensi: siswa policies
drop policy if exists "Admins can do everything on siswa" on public.siswa;
create policy "Admins can do everything on siswa" on public.siswa
  to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Guru can view siswa in assigned kelas" on public.siswa;
create policy "Guru can view siswa in assigned kelas" on public.siswa
  for select to authenticated using (
    public.is_admin() or exists (
      select 1 from public.anggota_kelas ak
      join public.kelas k on k.id = ak.kelas_id
      where ak.siswa_id = public.siswa.id
        and k.wali_kelas_id = public.current_guru_id()
    )
  );

-- Absensi: anggota_kelas policies
drop policy if exists "Admins can do everything on anggota_kelas" on public.anggota_kelas;
create policy "Admins can do everything on anggota_kelas" on public.anggota_kelas
  to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Guru can view anggota_kelas in assigned kelas" on public.anggota_kelas;
create policy "Guru can view anggota_kelas in assigned kelas" on public.anggota_kelas
  for select to authenticated using (
    public.is_admin() or exists (
      select 1 from public.kelas k
      where k.id = public.anggota_kelas.kelas_id
        and k.wali_kelas_id = public.current_guru_id()
    )
  );

-- Absensi: presensi policies
drop policy if exists "Admins can manage all presensi" on public.presensi;
create policy "Admins can manage all presensi" on public.presensi
  to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Guru can view presensi of assigned kelas" on public.presensi;
create policy "Guru can view presensi of assigned kelas" on public.presensi
  for select to authenticated using (
    public.is_admin() or exists (
      select 1 from public.kelas k
      where k.id = public.presensi.kelas_id
        and k.wali_kelas_id = public.current_guru_id()
    )
  );

drop policy if exists "Guru can insert presensi for today in assigned kelas" on public.presensi;
create policy "Guru can insert presensi for today in assigned kelas" on public.presensi
  for insert to authenticated with check (
    public.is_admin() or (
      public.is_today_wib(tanggal)
      and exists (
        select 1 from public.kelas k
        where k.id = public.presensi.kelas_id
          and k.wali_kelas_id = public.current_guru_id()
      )
    )
  );

drop policy if exists "Guru can update presensi for today in assigned kelas" on public.presensi;
create policy "Guru can update presensi for today in assigned kelas" on public.presensi
  for update to authenticated using (
    public.is_admin() or (
      public.is_today_wib(tanggal)
      and exists (
        select 1 from public.kelas k
        where k.id = public.presensi.kelas_id
          and k.wali_kelas_id = public.current_guru_id()
      )
    )
  ) with check (
    public.is_admin() or (
      public.is_today_wib(tanggal)
      and exists (
        select 1 from public.kelas k
        where k.id = public.presensi.kelas_id
          and k.wali_kelas_id = public.current_guru_id()
      )
    )
  );

drop policy if exists "No one can delete presensi" on public.presensi;
create policy "No one can delete presensi" on public.presensi
  for delete to authenticated using (false);

-- Absensi: kehadiran_siswa policies
drop policy if exists "Admins can do everything on kehadiran_siswa" on public.kehadiran_siswa;
create policy "Admins can do everything on kehadiran_siswa" on public.kehadiran_siswa
  to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Users can view kehadiran_siswa for allowed presensi" on public.kehadiran_siswa;
create policy "Users can view kehadiran_siswa for allowed presensi" on public.kehadiran_siswa
  for select to authenticated using (
    public.is_admin() or exists (
      select 1 from public.presensi p
      join public.kelas k on k.id = p.kelas_id
      where p.id = public.kehadiran_siswa.presensi_id
        and k.wali_kelas_id = public.current_guru_id()
    )
  );

drop policy if exists "Users can insert kehadiran_siswa for allowed presensi" on public.kehadiran_siswa;
create policy "Users can insert kehadiran_siswa for allowed presensi" on public.kehadiran_siswa
  for insert to authenticated with check (
    public.is_admin() or exists (
      select 1 from public.presensi p
      join public.kelas k on k.id = p.kelas_id
      where p.id = public.kehadiran_siswa.presensi_id
        and k.wali_kelas_id = public.current_guru_id()
        and public.is_today_wib(p.tanggal)
    )
  );

drop policy if exists "Users can update kehadiran_siswa for allowed presensi" on public.kehadiran_siswa;
create policy "Users can update kehadiran_siswa for allowed presensi" on public.kehadiran_siswa
  for update to authenticated using (
    public.is_admin() or exists (
      select 1 from public.presensi p
      join public.kelas k on k.id = p.kelas_id
      where p.id = public.kehadiran_siswa.presensi_id
        and k.wali_kelas_id = public.current_guru_id()
        and public.is_today_wib(p.tanggal)
    )
  ) with check (
    public.is_admin() or exists (
      select 1 from public.presensi p
      join public.kelas k on k.id = p.kelas_id
      where p.id = public.kehadiran_siswa.presensi_id
        and k.wali_kelas_id = public.current_guru_id()
        and public.is_today_wib(p.tanggal)
    )
  );

drop policy if exists "No one can delete kehadiran_siswa" on public.kehadiran_siswa;
create policy "No one can delete kehadiran_siswa" on public.kehadiran_siswa
  for delete to authenticated using (false);

-- Absensi: riwayat_presensi policies (Append-Only Audit Log)
drop policy if exists "Admins can do everything on riwayat_presensi" on public.riwayat_presensi;
create policy "Admins can do everything on riwayat_presensi" on public.riwayat_presensi
  for select to authenticated using (public.is_admin());

drop policy if exists "Users can view riwayat_presensi for allowed presensi" on public.riwayat_presensi;
create policy "Users can view riwayat_presensi for allowed presensi" on public.riwayat_presensi
  for select to authenticated using (
    public.is_admin() or exists (
      select 1 from public.presensi p
      join public.kelas k on k.id = p.kelas_id
      where p.id = public.riwayat_presensi.presensi_id
        and k.wali_kelas_id = public.current_guru_id()
    )
  );

drop policy if exists "Users can insert riwayat_presensi for allowed presensi" on public.riwayat_presensi;
create policy "Users can insert riwayat_presensi for allowed presensi" on public.riwayat_presensi
  for insert to authenticated with check (
    public.is_admin() or exists (
      select 1 from public.presensi p
      join public.kelas k on k.id = p.kelas_id
      where p.id = public.riwayat_presensi.presensi_id
        and k.wali_kelas_id = public.current_guru_id()
    )
  );

drop policy if exists "No one can update riwayat_presensi" on public.riwayat_presensi;
create policy "No one can update riwayat_presensi" on public.riwayat_presensi
  for update to authenticated using (false);

drop policy if exists "No one can delete riwayat_presensi" on public.riwayat_presensi;
create policy "No one can delete riwayat_presensi" on public.riwayat_presensi
  for delete to authenticated using (false);

create or replace function public.simpan_presensi(
  p_kelas_id bigint,
  p_tanggal date,
  p_versi int,
  p_baris jsonb,
  p_selesaikan boolean default false,
  p_alasan text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_user_id uuid;
  v_is_admin boolean;
  v_guru_id bigint;
  v_wali_kelas_id bigint;
  v_presensi public.presensi%rowtype;
  v_existing_kehadiran public.kehadiran_siswa%rowtype;
  v_elem jsonb;
  v_siswa_id bigint;
  v_status varchar(20);
  v_catatan varchar(255);
  v_today date;
  v_is_new_session boolean := false;
  v_updated_rows int := 0;
  v_status_sebelum text;
begin
  -- 1. Check authentication
  v_user_id := auth.uid();
  if v_user_id is null then
    raise exception 'UNAUTHORIZED: Pengguna tidak terautentikasi.' using errcode = '42501';
  end if;

  v_today := (timezone('Asia/Jakarta', now())::date);
  if p_kelas_id is null or p_tanggal is null or p_versi is null or p_versi < 1
     or p_baris is null or jsonb_typeof(p_baris) <> 'array' or jsonb_array_length(p_baris) = 0
     or p_selesaikan is null or length(coalesce(p_alasan, '')) > 500 then
    raise exception 'VALIDASI_GAGAL: Data presensi tidak lengkap.' using errcode = '22023';
  end if;
  -- 2. Validate date (cannot be in the future)
  if p_tanggal > v_today then
    raise exception 'VALIDASI_GAGAL: Tanggal presensi tidak boleh di masa depan.' using errcode = '22023';
  end if;

  -- 3. Authorization check
  v_is_admin := exists (
    select 1 from public.users where id = v_user_id and peran in ('admin', 'super-admin')
  );

  if not v_is_admin then
    -- Must be a guru assigned as wali_kelas
    select guru_id into v_guru_id from public.users where id = v_user_id;
    if v_guru_id is null then
      raise exception 'FORBIDDEN: Akun Anda belum terhubung dengan data guru.' using errcode = '42501';
    end if;

    select wali_kelas_id into v_wali_kelas_id from public.kelas where id = p_kelas_id;
    if v_wali_kelas_id is null or v_wali_kelas_id != v_guru_id then
      raise exception 'FORBIDDEN: Anda bukan wali kelas dari kelas ini.' using errcode = '42501';
    end if;

    -- Guru can only edit today
    if p_tanggal != v_today then
      raise exception 'FORBIDDEN: Guru hanya dapat mengisi atau mengubah presensi untuk hari ini.' using errcode = '42501';
    end if;
  else
    -- Admin editing past date requires reason of at least 10 chars
    if p_tanggal < v_today then
      if p_alasan is null or length(trim(p_alasan)) < 10 then
        raise exception 'VALIDASI_GAGAL: Alasan koreksi tanggal lampau wajib diisi minimal 10 karakter.' using errcode = '22023';
      end if;
    end if;
  end if;

  if exists (select 1 from jsonb_array_elements(p_baris) e group by e->>'siswa_id' having count(*) > 1) then
    raise exception 'VALIDASI_GAGAL: Siswa tidak boleh berulang.' using errcode = '22023';
  end if;
  if exists (
    select 1 from jsonb_array_elements(p_baris) e
    where not exists (
      select 1 from public.anggota_kelas ak
      where ak.kelas_id = p_kelas_id and ak.siswa_id = (e->>'siswa_id')::bigint
        and ak.mulai_pada <= p_tanggal and (ak.selesai_pada is null or ak.selesai_pada >= p_tanggal)
    ) or coalesce(e->>'status', '') not in ('belum_diisi', 'hadir', 'sakit', 'izin', 'alpa', 'terlambat')
  ) then
    raise exception 'VALIDASI_GAGAL: Siswa atau status tidak sesuai roster kelas.' using errcode = '22023';
  end if;


  -- 4. Finalization rule: if finalizing, ensure no status is 'belum_diisi'
  if p_selesaikan then
    for v_elem in select * from jsonb_array_elements(p_baris)
    loop
      v_status := v_elem->>'status';
      if v_status is null or v_status = 'belum_diisi' then
        raise exception 'VALIDASI_GAGAL: Semua siswa harus memiliki status kehadiran (tidak boleh belum diisi) untuk menyelesaikan absensi.' using errcode = '22023';
      end if;
    end loop;
  end if;

  -- Serialize saves for the same class and date, including the first insert.
  perform pg_advisory_xact_lock(hashtextextended(p_kelas_id::text || ':' || p_tanggal::text, 0));
  -- 5. Lock and retrieve or insert presensi session
  select * into v_presensi
  from public.presensi
  where kelas_id = p_kelas_id and tanggal = p_tanggal
  for update;

  v_status_sebelum := v_presensi.status;
  if p_selesaikan or v_status_sebelum = 'selesai' then
    if jsonb_array_length(p_baris) <> (
      select count(distinct siswa_id) from public.anggota_kelas
      where kelas_id = p_kelas_id and mulai_pada <= p_tanggal
        and (selesai_pada is null or selesai_pada >= p_tanggal)
    ) or exists (select 1 from jsonb_array_elements(p_baris) e where e->>'status' = 'belum_diisi') then
      raise exception 'VALIDASI_GAGAL: Finalisasi memerlukan seluruh siswa pada roster dan status lengkap.' using errcode = '22023';
    end if;
  end if;

  if v_presensi.id is null then
    if p_versi <> 1 then
      raise exception 'KONFLIK_VERSI: Sesi presensi belum tersedia.' using errcode = 'P0001';
    end if;
    v_is_new_session := true;
    insert into public.presensi (
      kelas_id,
      tanggal,
      status,
      dicatat_oleh,
      versi,
      selesai_pada
    ) values (
      p_kelas_id,
      p_tanggal,
      case when p_selesaikan then 'selesai' else 'draf' end,
      v_user_id,
      2,
      case when p_selesaikan then now() else null end
    )
    returning * into v_presensi;

    -- Log audit for session creation
    insert into public.riwayat_presensi (
      presensi_id,
      siswa_id,
      user_id,
      aksi,
      status_sebelum,
      status_sesudah,
      alasan
    ) values (
      v_presensi.id,
      null,
      v_user_id,
      case when p_selesaikan then 'selesaikan' else 'buat_draf' end,
      null,
      case when p_selesaikan then 'selesai' else 'draf' end,
      p_alasan
    );
  else
    -- Version check for optimistic concurrency control
    if v_presensi.versi != p_versi then
      raise exception 'KONFLIK_VERSI: Data telah diubah pengguna lain (versi database: %, versi dikirim: %). Muat ulang sebelum menyimpan.'
        , v_presensi.versi, p_versi
        using errcode = 'P0001';
    end if;

    -- Update session
    update public.presensi
    set
      status = case when p_selesaikan then 'selesai' else status end,
      versi = v_presensi.versi + 1,
      selesai_pada = case
        when p_selesaikan and selesai_pada is null then now()
        else selesai_pada
      end,
      updated_at = now()
    where id = v_presensi.id
    returning * into v_presensi;

    -- If status changed to selesai
    if p_selesaikan and v_status_sebelum = 'draf' then
      insert into public.riwayat_presensi (
        presensi_id,
        siswa_id,
        user_id,
        aksi,
        status_sebelum,
        status_sesudah,
        alasan
      ) values (
        v_presensi.id,
        null,
        v_user_id,
        'selesaikan',
        'draf',
        'selesai',
        p_alasan
      );
    end if;
  end if;

  -- 6. Upsert kehadiran_siswa & record audit log for each student
  for v_elem in select * from jsonb_array_elements(p_baris)
  loop
    v_siswa_id := (v_elem->>'siswa_id')::bigint;
    v_status := coalesce(v_elem->>'status', 'belum_diisi');
    v_catatan := v_elem->>'catatan';

    -- Validate status value
    if v_status not in ('belum_diisi', 'hadir', 'sakit', 'izin', 'alpa', 'terlambat') then
      raise exception 'VALIDASI_GAGAL: Status kehadiran "%" tidak valid.', v_status using errcode = '22023';
    end if;

    select * into v_existing_kehadiran
    from public.kehadiran_siswa
    where presensi_id = v_presensi.id and siswa_id = v_siswa_id
    for update;

    if not found then
      -- Insert new attendance record
      insert into public.kehadiran_siswa (
        presensi_id,
        siswa_id,
        status,
        catatan,
        diubah_oleh
      ) values (
        v_presensi.id,
        v_siswa_id,
        v_status,
        v_catatan,
        v_user_id
      );

      -- Record audit log
      insert into public.riwayat_presensi (
        presensi_id,
        siswa_id,
        user_id,
        aksi,
        status_sebelum,
        status_sesudah,
        catatan_sebelum,
        catatan_sesudah,
        alasan
      ) values (
        v_presensi.id,
        v_siswa_id,
        v_user_id,
        case when v_is_new_session then 'buat_draf' else 'ubah_status' end,
        null,
        v_status,
        null,
        v_catatan,
        p_alasan
      );
    else
      -- Check if status or notes changed
      if v_existing_kehadiran.status is distinct from v_status
         or v_existing_kehadiran.catatan is distinct from v_catatan then

        insert into public.riwayat_presensi (
          presensi_id,
          siswa_id,
          user_id,
          aksi,
          status_sebelum,
          status_sesudah,
          catatan_sebelum,
          catatan_sesudah,
          alasan
        ) values (
          v_presensi.id,
          v_siswa_id,
          v_user_id,
          'ubah_status',
          v_existing_kehadiran.status,
          v_status,
          v_existing_kehadiran.catatan,
          v_catatan,
          p_alasan
        );

        update public.kehadiran_siswa
        set
          status = v_status,
          catatan = v_catatan,
          diubah_oleh = v_user_id,
          updated_at = now()
        where id = v_existing_kehadiran.id;
      end if;
    end if;
    v_updated_rows := v_updated_rows + 1;
  end loop;

  -- 7. Return summary object
  return jsonb_build_object(
    'id', v_presensi.id,
    'kelas_id', v_presensi.kelas_id,
    'tanggal', v_presensi.tanggal,
    'status', v_presensi.status,
    'versi', v_presensi.versi,
    'selesai_pada', v_presensi.selesai_pada,
    'dicatat_oleh', v_presensi.dicatat_oleh,
    'total_baris', v_updated_rows
  );
end;
$$;

-- Overload for single-object payload invocation
create or replace function public.simpan_presensi(p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_kelas_id bigint;
  v_tanggal date;
  v_versi int;
  v_baris jsonb;
  v_selesaikan boolean;
  v_alasan text;
begin
  v_kelas_id := coalesce((p_payload->>'kelas_id')::bigint, (p_payload->>'kelasId')::bigint);
  v_tanggal := coalesce((p_payload->>'tanggal')::date);
  v_versi := coalesce((p_payload->>'versi')::int, 1);
  v_baris := coalesce(p_payload->'baris', '[]'::jsonb);
  v_selesaikan := coalesce((p_payload->>'selesaikan')::boolean, false);
  v_alasan := p_payload->>'alasan';

  return public.simpan_presensi(
    v_kelas_id,
    v_tanggal,
    v_versi,
    v_baris,
    v_selesaikan,
    v_alasan
  );
end;
$$;

-- Storage
-- Remove the temporary seeding rules that allowed anonymous uploads/overwrites.
drop policy if exists "Allow upload to images" on storage.objects;
drop policy if exists "Allow update to images" on storage.objects;
insert into storage.buckets (id, name, public) values ('images', 'images', true)
on conflict (id) do nothing;
drop policy if exists "Admins can upload images" on storage.objects;
create policy "Admins can upload images" on storage.objects for insert to authenticated with check (bucket_id = 'images' and public.is_admin());
drop policy if exists "Admins can update images" on storage.objects;
create policy "Admins can update images" on storage.objects for update to authenticated using (bucket_id = 'images' and public.is_admin());
drop policy if exists "Admins can delete images" on storage.objects;
create policy "Admins can delete images" on storage.objects for delete to authenticated using (bucket_id = 'images' and public.is_admin());
drop policy if exists "Anyone can read images" on storage.objects;
create policy "Anyone can read images" on storage.objects for select using (bucket_id = 'images');

-- Multi-photo albums retain the existing cover URL for all existing callers.
alter table public.album add column if not exists foto_urls text[] not null default '{}';
update public.album set foto_urls = array[image_url] where image_url is not null and cardinality(foto_urls) = 0;
alter table public.album drop constraint if exists album_foto_urls_limit;
alter table public.album add constraint album_foto_urls_limit check (cardinality(foto_urls) <= 50);

-- All writes to attendance and its audit trail go through the validated transaction.
revoke all on public.users, public.tahun_ajaran, public.kelas, public.siswa, public.anggota_kelas,
  public.presensi, public.kehadiran_siswa, public.riwayat_presensi from anon;
grant select, insert, update, delete on public.users, public.tahun_ajaran, public.kelas,
  public.siswa, public.anggota_kelas to authenticated;
revoke insert, update, delete, truncate on public.presensi, public.kehadiran_siswa, public.riwayat_presensi from authenticated;
grant select on public.presensi, public.kehadiran_siswa, public.riwayat_presensi to authenticated;
revoke all on function public.simpan_presensi(bigint,date,integer,jsonb,boolean,text), public.simpan_presensi(jsonb) from public, anon;
grant execute on function public.simpan_presensi(bigint,date,integer,jsonb,boolean,text), public.simpan_presensi(jsonb) to authenticated;

create or replace function public.simpan_tahun_ajaran(
  p_id bigint, p_nama text, p_semester text, p_mulai_pada date, p_selesai_pada date, p_aktif boolean
) returns bigint language plpgsql security invoker set search_path = '' as $$
declare v_id bigint;
begin
  if not public.is_admin() then raise exception 'FORBIDDEN: Hanya admin.' using errcode = '42501'; end if;
  if p_nama is null or length(trim(p_nama)) not between 1 and 20
     or p_semester is null or p_semester not in ('ganjil', 'genap') or p_aktif is null
     or p_mulai_pada is null or p_selesai_pada is null or p_selesai_pada <= p_mulai_pada then
    raise exception 'VALIDASI_GAGAL: Tahun ajaran tidak valid.' using errcode = '22023';
  end if;
  -- ponytail: one school-wide lock; use a school ID if this becomes multi-school.
  perform pg_advisory_xact_lock(849241);
  if p_aktif then
    update public.tahun_ajaran set aktif = false where id is distinct from p_id and aktif;
  end if;
  if p_id is null then
    insert into public.tahun_ajaran(nama, semester, mulai_pada, selesai_pada, aktif)
      values(trim(p_nama), p_semester, p_mulai_pada, p_selesai_pada, p_aktif) returning id into v_id;
  else
    update public.tahun_ajaran set nama = trim(p_nama), semester = p_semester,
      mulai_pada = p_mulai_pada, selesai_pada = p_selesai_pada, aktif = p_aktif, updated_at = now()
      where id = p_id returning id into v_id;
    if v_id is null then raise exception 'Tahun ajaran tidak ditemukan.' using errcode = 'P0002'; end if;
  end if;
  return v_id;
end;
$$;
revoke all on function public.simpan_tahun_ajaran(bigint,text,text,date,date,boolean) from public, anon;
grant execute on function public.simpan_tahun_ajaran(bigint,text,text,date,date,boolean) to authenticated;

create or replace function public.rekap_presensi(
  p_tahun_ajaran_id bigint, p_kelas_id bigint, p_mulai date, p_selesai date
) returns table(kelas_id bigint, siswa_id bigint, kelas text, kode_siswa text, nama text,
  hadir bigint, sakit bigint, izin bigint, alpa bigint, terlambat bigint, total bigint, persentase numeric)
language plpgsql stable security invoker set search_path = '' as $$
begin
  if auth.uid() is null then raise exception 'UNAUTHORIZED' using errcode = '42501'; end if;
  if p_tahun_ajaran_id is null or p_mulai is null or p_selesai is null
    or p_selesai < p_mulai or p_selesai - p_mulai > 366 then
    raise exception 'Periode rekap tidak valid (maksimal satu tahun).' using errcode = '22023';
  end if;
  return query
  with roster as (
    select distinct ak.kelas_id, ak.siswa_id from public.anggota_kelas ak
    join public.kelas k on k.id = ak.kelas_id
    where k.tahun_ajaran_id = p_tahun_ajaran_id and (p_kelas_id is null or k.id = p_kelas_id)
      and ak.mulai_pada <= p_selesai and (ak.selesai_pada is null or ak.selesai_pada >= p_mulai)
  ), attendance as (
    select p.kelas_id, ks.siswa_id, ks.status, p.tanggal
    from public.kehadiran_siswa ks join public.presensi p on p.id = ks.presensi_id
    where p.status = 'selesai' and p.tanggal between p_mulai and p_selesai
      and ks.status <> 'belum_diisi'
  )
  select r.kelas_id, r.siswa_id, k.nama::text, s.kode_siswa::text, s.nama::text,
    count(*) filter (where a.status = 'hadir'), count(*) filter (where a.status = 'sakit'),
    count(*) filter (where a.status = 'izin'), count(*) filter (where a.status = 'alpa'),
    count(*) filter (where a.status = 'terlambat'), count(a.status),
    coalesce(round(100.0 * count(*) filter (where a.status in ('hadir', 'terlambat')) / nullif(count(a.status), 0), 1), 0)
  from roster r join public.kelas k on k.id = r.kelas_id join public.siswa s on s.id = r.siswa_id
  left join attendance a on a.kelas_id = r.kelas_id and a.siswa_id = r.siswa_id and exists (
    select 1 from public.anggota_kelas ak where ak.kelas_id = r.kelas_id and ak.siswa_id = r.siswa_id
      and ak.mulai_pada <= a.tanggal and (ak.selesai_pada is null or ak.selesai_pada >= a.tanggal)
  )
  group by r.kelas_id, r.siswa_id, k.nama, s.kode_siswa, s.nama;
end;
$$;
revoke all on function public.rekap_presensi(bigint,bigint,date,date) from public, anon;
grant execute on function public.rekap_presensi(bigint,bigint,date,date) to authenticated;

-- Storage limits apply even if a client bypasses the upload form.
update storage.buckets set file_size_limit = 8388608,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp'] where id = 'images';

-- Protect the last owner even when two administrators change roles concurrently.
create or replace function public.lindungi_super_admin_terakhir()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if old.peran = 'super-admin' and (tg_op = 'DELETE' or new.peran <> 'super-admin') then
    perform pg_advisory_xact_lock(849242);
    if (select count(*) from public.users where peran = 'super-admin') <= 1 then
      raise exception 'Super-admin terakhir tidak dapat dihapus atau diturunkan perannya.' using errcode = '23514';
    end if;
  end if;
  if tg_op = 'DELETE' then return old; end if;
  return new;
end;
$$;
revoke all on function public.lindungi_super_admin_terakhir() from public, anon, authenticated;
drop trigger if exists lindungi_super_admin_terakhir on public.users;
create trigger lindungi_super_admin_terakhir before update of peran or delete on public.users
  for each row execute function public.lindungi_super_admin_terakhir();

notify pgrst, 'reload schema';

commit;
