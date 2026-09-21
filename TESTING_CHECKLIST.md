# Pengujian Trackers Workspace v6

Dijalankan 20 September 2026 dengan Node.js 24.19.0. Seluruh data uji adalah data buatan. Tidak ada koneksi atau perubahan pada Supabase produksi.

## Hasil otomatis

| Pemeriksaan | Hasil |
| --- | --- |
| Suite regresi terakhir | **47 lulus, 0 gagal, 0 dilewati**, sekitar 46 detik |
| Sintaks produksi | 11 file JavaScript/server lolos `node --check` |
| HTML | 455 ID unik; tidak ada ID duplikat |
| Referensi HTML | 25 referensi script/style/gambar/manifest diperiksa; tidak ada aset lokal hilang |
| Server lokal Node | Halaman utama, JS, CSS, manifest, service worker, dan ikon merespons HTTP 200 dengan MIME yang sesuai; path tidak dikenal merespons 404 |
| Kompatibilitas XLSX export | File dapat dibaca openpyxl; ID dengan nol depan, angka, freeze header, dan teks mirip formula dipertahankan |
| Kompatibilitas XLSX import | Fixture terkompresi dari openpyxl: kolom kosong, ID teks, karakter XML, dan tanggal sistem 1904 dibaca dengan benar |

Log lengkap suite terakhir tersedia di `tests/RESULTS.txt`. Jalankan ulang dengan:

```sh
node --test tests/regression.test.cjs
```

Cakupan suite: tanggal/nominal, CSV, struktur XLSX/checksum, identitas site, startup/routing, pencarian/filter arsip, master dalam dialog site, edit tanpa kehilangan modul, task/progres, checklist Oneflux custom, BAST undo dan validasi proses, finance/pembayaran, notes, import, tombol history PKBON, simpan/duplikat/status PKBON, pemilihan site ambigu, rincian print lebih dari 16 baris, dirty state, quota/rollback, perubahan tab lain, snapshot rusak, pergantian akun, akun nonaktif, kegagalan baca cloud, konflik, dan perubahan lokal selama upload.

**Batas hasil:** pengaitan event UI diuji melalui DOM simulator, bukan browser renderer. Layanan Supabase disimulasikan. Hasil ini tidak membuktikan tampilan pixel, email nyata, RLS pada database asli, dialog cetak, canvas lampiran, atau pemasangan PWA.

## Checklist perangkat dan layanan asli — belum dijalankan

Gunakan workspace/akun uji sebelum data operasional. Checklist ini mencantumkan hasil yang diharapkan, bukan hasil yang sudah terverifikasi.

| Alur | Langkah | Hasil yang diharapkan |
| --- | --- | --- |
| Upgrade | Backup, tutup tab lama, jalankan 003, pasang frontend baru | Data lama masih ada; tidak ada error migrasi; sync memakai RPC baru |
| Login/logout | Login dengan akun valid, password salah, lalu logout | Login valid membuka aplikasi; error ditampilkan; logout menutup akses workspace |
| Reset password | Minta reset, buka email, simpan password baru | Tautan kembali ke URL aplikasi; password baru dapat dipakai |
| Admin | Owner ubah role/akses akun uji; coba dari viewer | RPC administrasi berhasil untuk admin/owner dan ditolak untuk pengguna lain |
| Akun nonaktif | Nonaktifkan akun uji, login ulang dan coba write RPC | Akses/penulisan ditolak server |
| Pemisahan akun | Akun A isi site lalu logout; masuk sebagai B lalu A | B tidak melihat/mengunggah data A; data A kembali saat masuk lagi |
| Sinkronisasi | Ubah site, tunggu Tersinkron, buka akun sama di browser lain | Data yang sudah tersimpan di cloud sama |
| Konflik | Dua browser membaca versi sama, lalu menyimpan perubahan berbeda | Penulis kedua mendapat konflik; backup tersedia; sumber dapat dipilih |
| Putus koneksi | Dalam sesi aktif, matikan jaringan dan edit, lalu nyalakan kembali | Data lokal tetap ada; status sync menjelaskan kegagalan; retry tidak menimpa versi lain diam-diam |
| Site | Tambah, edit nama, ubah SOW, pin, archive, restore | Identitas/modul/riwayat lama tetap terhubung; filter/ringkasan sesuai |
| PLN | Isi status/daya/ID/RFI/HO/kelengkapan/catatan; simpan dan reload | Seluruh nilai kembali; share memuat data yang diisi |
| Oneflux | Ubah status/catatan, tambah/hapus item custom, simpan | Progres berubah sesuai item; data bertahan setelah reload |
| BAST | Isi BOQ/PO dan proses dokumen, tandai selesai, batal tahap sebelumnya | Tahap yang belum lengkap tidak selesai; progres/detail konsisten; GR tidak melompati prasyarat |
| Finance | Isi harga, tambah addwork, beberapa pembayaran, buka/tutup dialog | Nilai dan total benar; input tidak kehilangan fokus; pembayaran tetap ada setelah SOW berubah |
| PKBON | Isi bank/penerima, pejabat, template, 20+ rincian, gambar; simpan/duplikat | Total benar, draft baru punya nomor berbeda, site terhubung benar; snapshot dokumen lama tetap stabil |
| Print/PDF | Cetak 20+ rincian dan lampiran dari perangkat asli | Tidak ada baris terpotong/hilang, pemisahan halaman dapat dibaca, lampiran tampil |
| Backup | Download workspace, ubah data uji, restore; coba JSON rusak | Backup valid memulihkan data dan lampiran; JSON rusak ditolak tanpa mengganti data |
| Import/export | Download template, isi, import, filter, export dan buka di Excel | Identitas nol depan tetap utuh jika kolom teks; baris invalid dilaporkan; export sesuai filter |
| Notes/report | Edit/pin/archive catatan; filter report per periode/arsip | Data bertahan setelah reload; filter dan total konsisten |
| Target/notifikasi | Buat target regional/SOW dan site dengan SPMK mendekati/lewat target | Deadline, status perhatian, dan daftar notifikasi sesuai data |
| UI desktop/HP | Periksa 1440, 1024, 768, dan 390 px; buka setiap menu/dialog | Warna/panel sesuai acuan; konten terbaca; tabel dapat digeser; kontrol tidak tertutup |
| Akses keyboard | Tab/Shift+Tab/Escape pada form dan dialog bertumpuk | Fokus berada pada dialog aktif dan kembali saat ditutup; dialog wajib tidak tertutup tanpa pilihan |
| PWA | Install dari HTTPS, buka ulang; deploy versi baru; pilih Perbarui | Aplikasi terpasang; pembaruan menunggu pilihan pengguna; form dapat disimpan dahulu |
| Reset data | Pada akun uji saja, ketik konfirmasi reset | Reset lokal/cloud hanya terjadi setelah konfirmasi; kegagalan cloud tidak menghapus salinan lokal |

Jika satu pemeriksaan gagal, catat langkah, browser/perangkat, screenshot, dan pesan console/network. Jangan memasukkan password, token, atau secret key ke laporan.
