# Mulai di sini — Trackers Workspace v6

Paket ini berisi perbaikan aplikasi asli dan UI yang mengikuti HTML Detail Site yang diberikan. Buka `LAPORAN_PERBAIKAN.md` untuk rincian perubahan, dan `TESTING_CHECKLIST.md` untuk hasil pengujian serta pemeriksaan yang masih perlu dilakukan di perangkat asli.

## 1. Siapkan Supabase

Konfigurasi project lama tetap ada di `assets/js/config.js`. Tidak ada akun atau password contoh. Gunakan akun Supabase Auth milik aplikasi Anda.

**Jika SQL 001 dan 002 sudah pernah dijalankan:** jalankan isi `supabase/003_sync_safety.sql` lewat SQL Editor di project Supabase yang sama. Migrasi ini diperlukan untuk menyimpan data dari versi baru.

**Jika setup baru:** buat akun pertama yang akan menjadi owner di Supabase Auth, lalu jalankan file berikut berurutan:

1. `supabase/001_user_state.sql`
2. `supabase/002_profiles_and_roles.sql`
3. `supabase/003_sync_safety.sql`

SQL 002 menjadikan akun terlama sebagai owner jika belum ada owner. Periksa akun tersebut sebelum membagikan akses. Tambahkan pengguna melalui Supabase Auth; aplikasi tidak memiliki pendaftaran publik. Untuk penggunaan privat, nonaktifkan pendaftaran pengguna baru di konfigurasi Auth.

Di Authentication → URL Configuration, isi Site URL dengan URL aplikasi dan tambahkan alamat yang dipakai ke Redirect URLs. Untuk launcher lokal, tambahkan `http://localhost:8080/`. Jika membuka `/index.html` secara eksplisit, tambahkan alamat lengkap itu juga. Ini diperlukan agar tautan reset password kembali ke aplikasi. [Dokumentasi Supabase](https://supabase.com/docs/guides/auth/redirect-urls).

**Urutan upgrade:** simpan/backup pekerjaan lama, tutup tab versi lama, jalankan migrasi 003, lalu pasang frontend baru. Versi lama tidak dapat menulis melalui jalur lama setelah migrasi 003. Migrasi tidak menghapus snapshot yang sudah ada.

## 2. Jalankan di komputer

Ekstrak ZIP terlebih dahulu.

- **Windows:** buka `START_TRACKERS.bat`. Launcher menggunakan Python 3 atau Node.js yang sudah terpasang.
- **Mac/Linux dengan Python:** buka terminal di folder aplikasi, lalu jalankan `python3 serve.py`.
- **Dengan Node.js 24:** jalankan `node server.cjs` atau `npm start`.

Buka `http://localhost:8080/`, biarkan terminal tetap berjalan, lalu login. Tidak perlu `npm install`. Jangan membuka `index.html` menggunakan `file://`; login, import, dan PWA membutuhkan server HTTP/HTTPS.

Login dan pemeriksaan akses awal membutuhkan internet serta akses ke Supabase/CDN. Jika muncul pesan tentang `003_sync_safety.sql`, selesaikan langkah 1.

## 3. Pasang ke hosting yang dipakai sebelumnya

Unggah isi folder aplikasi, sehingga `index.html`, `assets/`, `sw.js`, dan `manifest.webmanifest` berada pada direktori web yang sama. Panduan GitHub Pages ada di `README.md`. Paket ini belum dipublikasikan ke hosting Anda.

Gunakan domain dan browser yang sama bila ingin mempertahankan data lokal lama. Data localhost dan data domain hosting berada di penyimpanan browser yang berbeda. Untuk pindah perangkat/domain, gunakan cloud akun yang sama atau backup workspace.

Jika ada pemberitahuan versi baru, simpan form lalu klik **Perbarui**. Tutup tab lama lain agar tidak ada dua versi menulis bersamaan.

## 4. Periksa data sebelum bekerja

1. Login dan periksa daftar site serta riwayat PKBON.
2. Klik status sync di header. Tunggu **Tersinkron**.
3. Bila muncul konflik, download backup dari dialog tersebut, lalu pilih sumber yang benar. Aplikasi tidak menggabungkan dua snapshot otomatis.
4. Buka Settings → Backup Workspace → Download Backup. Simpan file JSON sebelum impor besar atau restore.
5. Jalankan pemeriksaan manual pada `TESTING_CHECKLIST.md`, terutama login/reset password, cetak PKBON, dan tampilan HP.

Untuk PKBON lama dengan nama site yang sama pada beberapa project/SOW, buka dokumennya, pilih site lengkap dari saran input Site, lalu simpan. Pilihan menyertakan Project ID, Site ID, dan SOW agar pengeluaran terhubung ke site yang benar.
