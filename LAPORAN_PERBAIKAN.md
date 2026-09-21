# Laporan perbaikan — Trackers Workspace

Tanggal pengerjaan: 20 September 2026. Sumber: aplikasi dalam `Trackers.rar` dan HTML acuan Detail Site yang disediakan.

## Temuan utama

Aplikasi memiliki modul yang cukup lengkap, tetapi beberapa modul saling mengganggu karena selector global, pengaitan data lewat nama site, normalisasi yang membuang data lama, dan sinkronisasi snapshot tanpa pemeriksaan versi. UI juga ditimpa beberapa stylesheet yang saling bertabrakan.

Perbaikan dilakukan pada kode aplikasi asli. Tidak ada penggantian aplikasi dengan demo statis dan tidak ada data contoh yang dimasukkan ke workspace pengguna.

| Area | Masalah yang ditemukan | Perubahan |
| --- | --- | --- |
| UI seluruh modul | Beberapa stylesheet saling menimpa | Satu stylesheet; warna, border, panel, sidebar, tombol, form dan tabel konsisten mengikuti HTML acuan; breakpoint desktop/tablet/HP; tema gelap tetap tersedia |
| Detail Site | Informasi/progres/aktivitas acuan belum terhubung ke data nyata | Informasi lengkap, task tersimpan, progres dari task, status BAST, aktivitas site, archive/restore, share/pin/edit |
| Projects | Pencarian terbatas, arsip/filter/export belum konsisten | Cari berdasarkan identitas, pilihan aktif/arsip/semua, jumlah hasil, reset, export mengikuti filter; validasi identitas duplikat |
| Edit/import site | Properti tambahan dapat hilang | Pertahankan task, finance, arsip, PLN, Oneflux dan BAST; validasi tanggal/tinggi tower; migrasi pengait PKBON lama sebelum rename |
| Dashboard/report | Ringkasan dan pinned tidak konsisten dengan arsip | Ringkasan site aktif, semua pin ditampilkan, filter arsip pada report |
| PKBON history | Selector `[data-open]` Projects menimpa tombol Buka PKBON | Selector dibatasi ke daftar Projects masing-masing |
| PKBON per site | Site bernama sama dapat mencampur biaya antarproject | Pengait ID internal stabil; pemilih menampilkan Project ID/Site ID/SOW; dokumen ambigu tidak dihitung ke beberapa site |
| PKBON nominal | Volume desimal dan parsing rupiah tidak konsisten | Volume pecahan, nominal nonnegatif, perhitungan terpusat; draft tetap dapat disimpan untuk dilengkapi |
| PKBON status | Quick status bisa melewati pemeriksaan form | Status selain Draft memvalidasi identitas, tanggal, bank/penerima dan rincian biaya |
| PKBON print | Preview hanya memuat 16 rincian | Semua rincian masuk; tinggi halaman fleksibel, header tabel berulang dan pengaturan pemisahan baris |
| PKBON master/lampiran | Perubahan master tidak semuanya tersinkron | Event perubahan semua master; snapshot pengaturan/pejabat pada dokumen; batas tipe/ukuran gambar dan penanganan pembatalan |
| Finance | Nama addwork kehilangan fokus; perubahan SOW membuang baris lama | Pembaruan field tanpa membangun ulang input; baris dan pembayaran lama dipertahankan; total mengikuti PKBON site yang benar |
| BAST manual | Undo tidak membatalkan tahap yang dipilih | Undo membatalkan tahap itu dan tahap sesudahnya; langkah berikut membutuhkan tahap sebelumnya |
| BAST Proses | BOQ kosong dianggap selesai | Status berdasarkan isian nyata; Done membutuhkan input; identitas site jelas; detail diperbarui langsung |
| Oneflux | Template hanya tersedia untuk SOW tertentu | Template lama dipertahankan dan item custom dapat ditambahkan untuk semua SOW |
| Modal | Dialog bertumpuk/shortcut Escape mengganggu alur | Urutan modal, pengembalian fokus, focus trap, dan pembatasan penutupan dialog yang wajib diselesaikan |
| Backup/restore | Backup lengkap tidak tersedia; penulisan bisa parsial | Backup workspace lengkap, validasi record bertingkat, rollback batch penyimpanan pada kegagalan |
| Storage | Gagal simpan tetap berisiko tampak berhasil | Pesan kegagalan; peringatan penyimpanan sementara; tab lama ditahan menulis; data rusak tidak diganti workspace kosong |
| Cloud | Upload dapat menimpa perubahan perangkat lain | RPC dengan versi yang diharapkan; dialog konflik; perubahan selama upload tetap ditandai pending; tidak upload setelah pembacaan cloud gagal |
| Akun | Data lokal akun sebelumnya dapat ikut terunggah | Pemisahan snapshot lokal saat pergantian akun; pemeriksaan akses sebelum sync |
| Backend | Akses nonaktif belum ditegakkan pada penulisan snapshot | Migrasi 003: RPC, pemeriksaan akun aktif, penguncian transaksi, dan revoke jalur tulis langsung |
| PWA | Cache/aktivasi update berpotensi mengganggu workspace lain atau form aktif | Cache per scope, tawaran update setelah form disimpan, API akun tidak disimpan dalam cache |
| Distribusi | Harus menyiapkan server sendiri | Launcher Windows, server Python dan Node tanpa dependensi tambahan |

## Bukti dan batas pengujian

Rincian hasil ada di `TESTING_CHECKLIST.md`; seluruh tes menggunakan data buatan. Uji logika dan simulasi DOM bukan uji browser visual. File XLSX diuji silang dengan openpyxl. Pemeriksaan HTML memeriksa keberadaan aset dan keunikan ID, bukan tampilan pixel.

Browser interaktif tidak dapat mengakses aplikasi lokal pada lingkungan pengerjaan ini. Karena itu belum ada screenshot hasil render, verifikasi layout HP, atau bukti cetak/PWA dari perangkat asli. Supabase asli juga tidak diakses: SQL belum dieksekusi, login/email reset/RLS/admin belum diuji terhadap project Anda. Paket menyediakan kode dan migrasi untuk diuji melalui checklist sebelum penggunaan produksi.

## Catatan penggunaan

- Aplikasi tetap menyimpan snapshot **per akun**, sesuai arsitektur awal. Belum ada workspace project bersama lintas akun atau penggabungan perubahan per-field.
- Role admin/owner mengendalikan administrasi akun; pembatasan edit per modul belum menjadi bagian arsitektur aplikasi ini.
- File/lampiran berada di penyimpanan browser dan snapshot JSON. Data besar tetap dibatasi kuota perangkat; backup berkala diperlukan sebelum impor/restore besar.
- PKBON lama yang ambigu perlu dipilih ulang ke site yang benar lalu disimpan. Sistem tidak menebak pengeluaran milik site mana.
- Migrasi 003 wajib untuk sync versi ini. Semua tab/perangkat versi lama perlu diperbarui sesudah migrasi.
