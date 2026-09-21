# Tanggal pekerjaan — 21 September 2026

Kelola pekerjaan sekarang memiliki tanggal opsional pada pekerjaan baru dan pekerjaan yang sudah ada. Pilih tanggal melalui kalender atau ketik tanggal sesuai format browser. Tanggal tampil di ringkasan progres site, tersimpan bersama task, ikut backup dan snapshot cloud. Data lama tanpa tanggal tetap dapat digunakan. Persentase progres tetap berdasarkan status Completed.

## Memasang pada aplikasi yang sudah berhasil login

Ekstrak paket ke folder terpisah. Simpan form yang sedang dibuka dan download backup. Salin lima file berikut ke lokasi yang sama dalam aplikasi Anda dan pilih Replace:
- assets/js/workspace.js
- assets/js/pkbon.js (termasuk perbaikan nominal sebelumnya)
- assets/css/workspace.css
- index.html
- sw.js

Jangan mengganti assets/js/config.js yang telah berisi project Supabase Anda. Tidak perlu menjalankan SQL lagi. Refresh, pilih Perbarui bila tersedia, lalu buka ulang aplikasi. Untuk GitHub, unggah kelima file pada lokasi yang sama.

Buka Detail Site > Kelola pekerjaan. Isi nama dan tanggal opsional, klik Tambah, kemudian Simpan pekerjaan. Untuk mengubah tanggal pekerjaan lama, edit tanggal pada barisnya kemudian Simpan pekerjaan. Batal tidak menyimpan perubahan. Tanggal dapat dikosongkan kembali.

Tes logika meliputi tambah/edit/hapus tanggal, batal, muat ulang, pekerjaan lama tanpa tanggal, tanggal tidak valid dan progres yang tetap konsisten. Tampilan kalender/browser asli belum diverifikasi di lingkungan ini.
