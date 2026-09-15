const fs = require('fs');
const path = require('path');

// 1. Mapping kelas dari Excel / parsed_students.json ke kelas_id di supabase/seed.sql
const CLASS_MAPPING = {
  'KELAS X A': { id: 1, nama: 'X-A', tingkat: 10, defaultJk: 'L' },
  'KELAS X B': { id: 2, nama: 'X-B', tingkat: 10, defaultJk: 'P' },
  'KELAS XI A': { id: 3, nama: 'XI-IPA', tingkat: 11, defaultJk: 'L' },
  'KELAS XI B': { id: 4, nama: 'XI-IPS', tingkat: 11, defaultJk: 'P' },
  'KELAS XII A': { id: 5, nama: 'XII-IPA', tingkat: 12, defaultJk: 'L' },
  'KELAS XII B': { id: 6, nama: 'XII-IPS', tingkat: 12, defaultJk: 'P' },
};

function guessGender(nama, className) {
  if (className && (className.endsWith(' B') || className.includes('PUTRI'))) {
    return 'P';
  }
  if (className && (className.endsWith(' A') || className.includes('PUTRA'))) {
    return 'L';
  }

  // Heuristik nama bahasa Indonesia
  const n = (nama || '').toLowerCase();
  const femalePatterns = [
    'putri', 'dewi', 'siti', 'nurul', 'aisyah', 'ayu', 'anisa', 'zahra',
    'laili', 'jannah', 'fitria', 'indah', 'safitri', 'rohmah', 'hasanah',
    'wulandari', 'anggraeni', 'amalia', 'lestari', 'septiana', 'wati', 'ani'
  ];
  for (const pat of femalePatterns) {
    if (n.includes(pat)) return 'P';
  }
  return 'L';
}

function escapeSql(str) {
  if (str == null) return '';
  return String(str).replace(/'/g, "''").trim();
}

function parseStudents(jsonPath) {
  const content = fs.readFileSync(jsonPath, 'utf8');
  const rows = JSON.parse(content);

  const classes = {};
  let currentClass = null;

  for (const row of rows) {
    const col0 = row['DAFTAR PESERTA DIDIK'];

    // Baris header nama kelas, misal: "KELAS X A"
    if (typeof col0 === 'string' && col0.trim().startsWith('KELAS ')) {
      currentClass = col0.trim();
      if (!classes[currentClass]) {
        classes[currentClass] = [];
      }
      continue;
    }

    // Baris siswa: col0 berisi nomor urut (1, 2, 3...)
    if (typeof col0 === 'number' && currentClass) {
      const nama = row['__EMPTY'] ? String(row['__EMPTY']).trim() : '';
      const nisn = row['__EMPTY_1'] ? String(row['__EMPTY_1']).trim() : '';
      const tempatLahir = row['__EMPTY_2'] ? String(row['__EMPTY_2']).trim() : '';
      const tanggalLahir = row['__EMPTY_3'] ? String(row['__EMPTY_3']).trim() : '';

      if (nama) {
        classes[currentClass].push({
          no: col0,
          nama,
          nisn,
          tempatLahir,
          tanggalLahir,
          kelas: currentClass,
        });
      }
    }
  }

  return classes;
}

function generateSql(classes) {
  let globalStudentId = 1;
  const siswaRows = [];
  const anggotaKelasBlocks = [];

  console.log('\n--- RINGKASAN DATA KELAS & SISWA ---');

  for (const [className, students] of Object.entries(classes)) {
    const mapping = CLASS_MAPPING[className];
    if (!mapping) {
      console.warn(`⚠️ Peringatan: Kelas "${className}" tidak ditemukan dalam CLASS_MAPPING`);
      continue;
    }

    const startId = globalStudentId;
    console.log(`📌 ${className} (ID Kelas: ${mapping.id}, Nama DB: ${mapping.nama}): ${students.length} siswa`);

    const studentSqlLines = [];

    for (const student of students) {
      const id = globalStudentId++;
      const kodeSiswa = student.nisn || `AI-2026-${String(id).padStart(3, '0')}`;
      const jk = guessGender(student.nama, className);
      const namaEscaped = escapeSql(student.nama);

      studentSqlLines.push(`(${id}, '${escapeSql(kodeSiswa)}', '${namaEscaped}', '${jk}', true)`);
    }

    const endId = globalStudentId - 1;

    siswaRows.push(`-- ${className} (${mapping.nama} - ${mapping.defaultJk === 'L' ? 'Putra' : 'Putri'})`);
    siswaRows.push(studentSqlLines.join(',\n'));

    // Anggota kelas SQL block
    anggotaKelasBlocks.push(
      `-- ${className} (${mapping.nama} - ID: ${mapping.id})\n` +
      `insert into public.anggota_kelas (kelas_id, siswa_id, mulai_pada, selesai_pada)\n` +
      `select ${mapping.id}, id, '2026-07-15'::date, null\n` +
      `from public.siswa\n` +
      `where id between ${startId} and ${endId}\n` +
      `and not exists (\n` +
      `  select 1 from public.anggota_kelas ak where ak.kelas_id = ${mapping.id} and ak.siswa_id = public.siswa.id\n` +
      `);`
    );
  }

  const totalStudents = globalStudentId - 1;
  console.log(`\nTotal Siswa Terproses: ${totalStudents}`);

  const siswaSql =
    `-- 10.3. Siswa (Data Riil Peserta Didik SMA Ahlul Irfan)\n` +
    `insert into public.siswa (id, kode_siswa, nama, jenis_kelamin, aktif) values\n` +
    siswaRows.join('\n') + '\n' +
    `on conflict (kode_siswa) do update set\n` +
    `  nama = excluded.nama,\n` +
    `  jenis_kelamin = excluded.jenis_kelamin,\n` +
    `  aktif = excluded.aktif;`;

  const anggotaKelasSql =
    `-- 10.4. Anggota Kelas (Daftarkan siswa ke masing-masing rombel)\n` +
    anggotaKelasBlocks.join('\n\n');

  return {
    totalStudents,
    siswaSql,
    anggotaKelasSql,
  };
}

function updateSeedFile(seedPath, siswaSql, anggotaKelasSql) {
  let content = fs.readFileSync(seedPath, 'utf8');

  // Pastikan delete from public.siswa ada di bagian pembersihan (Section 4)
  if (!content.includes('delete from public.siswa;')) {
    content = content.replace(
      'delete from public.anggota_kelas;',
      'delete from public.anggota_kelas;\ndelete from public.siswa;'
    );
    console.log('✅ Ditambahkan pembersihan: delete from public.siswa;');
  }

  // Regex untuk menggantikan 10.3 Siswa dan 10.4 Anggota Kelas
  // Cari dari "-- 10.3. Siswa" sampai sebelum "-- Reset sequence generator"
  const targetRegex = /-- 10\.3\. Siswa[\s\S]*?(?=-- Reset sequence generator)/;

  if (!targetRegex.test(content)) {
    throw new Error('Tidak dapat menemukan bagian 10.3. Siswa di dalam supabase/seed.sql');
  }

  const replacement = `${siswaSql}\n\n${anggotaKelasSql}\n\n`;
  content = content.replace(targetRegex, replacement);

  fs.writeFileSync(seedPath, content, 'utf8');
  console.log(`✅ Berhasil memperbarui ${seedPath}`);
}

function main() {
  const jsonPath = path.join(__dirname, 'parsed_students.json');
  const seedPath = path.join(__dirname, 'supabase', 'seed.sql');

  if (!fs.existsSync(jsonPath)) {
    console.error(`❌ File ${jsonPath} tidak ditemukan.`);
    process.exit(1);
  }

  console.log(`📖 Membaca data siswa dari: ${jsonPath}`);
  const classes = parseStudents(jsonPath);

  const { totalStudents, siswaSql, anggotaKelasSql } = generateSql(classes);

  console.log(`\n📝 Memperbarui ${seedPath}...`);
  updateSeedFile(seedPath, siswaSql, anggotaKelasSql);

  console.log(`\n🎉 Selesai! ${totalStudents} siswa riil berhasil disemai ke dalam ${seedPath}.`);
}

if (require.main === module) {
  main();
}

module.exports = {
  CLASS_MAPPING,
  guessGender,
  parseStudents,
  generateSql,
};
