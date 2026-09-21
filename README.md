# Trackers Workspace v6

Aplikasi vanilla HTML/CSS/JavaScript untuk pengelolaan site. Perbaikan ini memakai aplikasi dari `Trackers.rar` dan bahasa visual dari `Trackers-Detail-Site-UI(1).html`: sidebar hijau, panel hijau muda, informasi site, progress pekerjaan, status BAST, aktivitas, dan modul site.

Mulai dengan **MULAI_DI_SINI.md**. Hasil audit ada di **LAPORAN_PERBAIKAN.md**. Hasil pengujian serta pemeriksaan perangkat asli ada di **TESTING_CHECKLIST.md**.

## Fitur

- Dashboard: total/status site aktif, progres, pinned projects, aktivitas, notifikasi deadline.
- Projects: tambah/edit, filter, pencarian global, arsip/pulihkan, import CSV/XLSX/XLS, export XLSX.
- Detail Site: informasi lengkap, checklist pekerjaan/progres, aktivitas per site, pin, share/copy, Maps.
- PLN: status, daya, ID pelanggan, RFI, HO, kelengkapan, dan catatan.
- Oneflux: checklist bawaan dan tambahan, status, catatan, share.
- BAST: tahapan BOQ → PO → BAUT → BAPWP → BAST → GR serta modul BAST Proses.
- Finance: harga per bagian pekerjaan, addwork, riwayat pembayaran, piutang, biaya PKBON terbayar, profit/cashflow.
- PKBON: form, rincian biaya, bank, pejabat/tanda tangan, lampiran, template, riwayat, duplikat, rekap/export, preview/cetak.
- Note Pad: tambah/edit, pin, arsip/pulihkan, hapus, pencarian.
- Reporting: filter periode/regional/tenant/SOW/status/arsip dan export.
- Settings: master client/tenant/target, tema, backup/restore, install PWA, reset data.
- Akun: email/password, reset password, profil/role, pengelolaan role/akses oleh admin/owner, snapshot cloud per akun.

## Menjalankan dan menguji

```sh
node server.cjs
```

Buka `http://localhost:8080/`. Alternatif: `python3 serve.py` atau launcher Windows. Tidak ada proses build dan tidak perlu mengunduh paket npm untuk menjalankan server atau tes.

```sh
node --test tests/regression.test.cjs
```

Tes dijalankan dengan Node.js 24.19.0. DOM simulator di `tests/dom-harness.cjs` hanya menguji logika dan pengaitan event; tidak merender CSS. Fixture XLSX di `tests/fixtures/` menggunakan data buatan.

## Struktur kode

| File/folder | Fungsi |
| --- | --- |
| `index.html` | Semua halaman dan dialog |
| `assets/css/workspace.css` | Sistem UI tunggal untuk seluruh modul |
| `assets/js/core.js` | Tanggal, nominal, CSV, identitas site, validasi backup, penulisan batch |
| `assets/js/sheets.js` | Import/export XLSX tanpa CDN untuk format biasa |
| `assets/js/app.js` | Projects, dashboard, BAST, finance, PLN, Oneflux, notes, reporting |
| `assets/js/pkbon.js` | Modul PKBON dan cetak |
| `assets/js/workspace.js` | Integrasi detail, task, arsip, modal, backup, import/export |
| `assets/js/cloud.js` | Auth, akses, admin, sinkronisasi dan konflik |
| `assets/js/config.js` | URL project Supabase dan publishable key |
| `assets/js/boot.js`, `sw.js` | PWA, pencarian header, pembaruan aplikasi |
| `supabase/` | Migrasi database 001–003 |
| `tests/` | Regresi dengan data buatan dan layanan cloud simulasi |

## Penyimpanan dan sinkronisasi

Nama tabel `trackly_user_state` dan key browser lama dipertahankan. Data lokal dinormalisasi ketika dibaca. Finance dan modul lain dipertahankan saat edit site atau perubahan SOW.

Setiap akun menyimpan snapshot workspace sendiri. Snapshot memuat site, master, notes, PKBON, pengaturan, dan lampiran. Pergantian akun menyimpan salinan lokal akun sebelumnya dan memuat ruang kerja akun tujuan. Data tidak dibagikan otomatis antar pengguna.

Migrasi 003 mengharuskan penulisan melalui `trackers_save_state`, dengan pemeriksaan pengguna aktif dan versi data. Bila perangkat lain sudah mengubah snapshot, dialog konflik meminta pilihan sumber setelah menyediakan tombol backup. Tidak ada penggabungan per-field otomatis. Simulasi konflik sudah diuji; migrasi belum dijalankan ke project Supabase asli pada pengerjaan ini.

Role admin/owner mengendalikan administrasi akun. Role lain tetap memakai workspace pribadi; aplikasi belum menyediakan workspace tim bersama atau pembatasan edit per modul. Tombol menonaktifkan akses diperiksa kembali di sisi database melalui RPC.

Backup Workspace berupa JSON, termasuk lampiran PKBON, tanpa password atau token login. Backup PKBON lama tetap khusus data PKBON. Restore mengganti data lokal setelah validasi dan konfirmasi, lalu dijadwalkan untuk sync. Jika penyimpanan penuh atau data lokal rusak, aplikasi menampilkan kegagalan dan menahan penulisan yang tidak aman. Data rusak dapat diunduh sebagai file pemulihan mentah, untuk diperbaiki di luar aplikasi sebelum di-restore.

## Import/export

Gunakan template dari Projects → New Site → Import. Kolom wajib: SITE NAME, PROJECT ID, SITE ID, CLIENT, TENANT, REGIONAL, SOW. Identitas import adalah kombinasi Project ID + Site ID + SOW. Baris dengan identitas yang sama memperbarui site; modul yang sudah ada dipertahankan.

Tanggal menerima `YYYY-MM-DD`, `DD/MM/YYYY`, atau tanggal Excel. Nomor yang harus mempertahankan nol depan, seperti Project ID, harus ditulis sebagai teks dalam spreadsheet. Import XLSX memakai sheet `FORMAT INPUT SITE` jika ada, atau sheet pertama. Batas: 20 MB dan 20.000 baris. Workbook berpassword tidak didukung. Formula tidak dihitung; impor memakai nilai tersimpan di workbook. Simpan file dari Excel terlebih dahulu bila workbook berisi formula.

CSV dan XLSX biasa diproses tanpa pustaka eksternal. XLSX terkompresi membutuhkan browser dengan `DecompressionStream('deflate-raw')`; jika tidak tersedia, gunakan CSV atau perbarui browser. Format biner `.xls` lama memuat SheetJS 0.20.3 dari CDN saat diperlukan. [Distribusi resmi SheetJS](https://docs.sheetjs.com/docs/getting-started/installation/standalone/).

Export Projects dan Reporting mengikuti filter saat ini. File export adalah XLSX sungguhan dan nilai teks yang menyerupai formula tetap ditulis sebagai teks. Export bukan backup lengkap: gunakan Backup Workspace untuk memindahkan seluruh data dan lampiran.

## Supabase

Jalankan SQL 001 → 002 → 003 untuk setup baru; instalasi yang sudah memiliki 001/002 cukup menjalankan 003. Akun owner awal berasal dari akun terlama yang ada ketika 002 dijalankan. Siapkan akun owner terlebih dahulu untuk project baru.

Frontend memerlukan URL Supabase dan publishable key. Jangan memasukkan secret/service-role key ke file frontend. Akses data diperiksa melalui RLS dan RPC. [Dokumentasi RLS Supabase](https://supabase.com/docs/guides/database/postgres/row-level-security).

Atur Site URL dan Redirect URLs sesuai URL aplikasi, termasuk path subfolder jika ada. Reset password kembali ke `location.origin + location.pathname`. SMTP, pengiriman email, dan kelayakan akun mengikuti konfigurasi project Anda. [Pengaturan redirect Supabase](https://supabase.com/docs/guides/auth/redirect-urls).

SDK Supabase dimuat saat runtime dari CDN, dengan fallback dan timeout. Jika layanan tidak tersedia, aplikasi menampilkan pesan kegagalan. Login awal dan pemeriksaan akses membutuhkan internet. Paket tidak memuat kredensial admin.

## Hosting dan PWA

Untuk GitHub Pages, unggah isi folder ini ke repository sehingga `index.html` ada di root. Pada Settings → Pages, pilih Deploy from a branch, lalu branch dan folder root yang sesuai. Tidak perlu build. Terapkan perubahan pada repository/domain aplikasi lama bila ingin mempertahankan asal penyimpanan browser. [Panduan resmi GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

Service worker menyimpan aset aplikasi pada cache sesuai scope. Respons akun dan API tidak di-cache. Pembaruan ditawarkan dengan tombol Perbarui agar pengguna dapat menyimpan form terlebih dahulu. HTTPS diperlukan untuk penggunaan PWA di hosting; localhost dapat digunakan untuk pengembangan. Penggunaan kembali saat offline tetap bergantung pada sesi yang sudah berjalan; pembukaan sesi yang membutuhkan pemeriksaan akses tidak dijamin saat offline.

Gunakan Settings → Install App atau menu pemasangan browser bila tersedia. Instalasi dan siklus pembaruan PWA perlu diuji di perangkat asli.
