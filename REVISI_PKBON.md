# Revisi input nominal PKBON — 21 September 2026

Perbaikan: ketikan setelah pemisah ribuan tidak lagi dianggap sebagai pecahan desimal. Nominal ratusan juta, miliaran, dan triliunan dapat diketik; pengelompokan ribuan dan posisi kursor dipertahankan. Harga Satuan diperlebar menjadi 260 px, Total 200 px, Keterangan diperkecil menjadi 140 px. Pada layar sempit tabel dapat digeser horizontal.

## Cara memasang pada aplikasi yang sudah berjalan

1. Download backup workspace dan simpan form yang sedang dibuka.
2. Ekstrak paket ini ke folder terpisah.
3. Salin hanya empat file berikut ke lokasi yang sama pada folder aplikasi Anda, lalu pilih replace:
   - assets/js/pkbon.js
   - assets/css/workspace.css
   - index.html
   - sw.js
4. Pertahankan assets/js/config.js milik Anda yang sudah berhasil login. Config dalam paket lengkap masih berasal dari paket awal; jangan menimpakan seluruh folder pada instalasi yang sudah dikonfigurasi.
5. Muat ulang aplikasi. Jika pemberitahuan versi baru muncul, klik Perbarui setelah menyimpan form. Tutup tab lama dan buka kembali bila perlu.
6. Coba ketik 250000000: tampilan harus menjadi 250.000.000. Volume 2 menghasilkan total Rp 500.000.000.

Tidak perlu menjalankan SQL lagi. Untuk GitHub, unggah empat file yang berubah di lokasi yang sama. Sebelum upload pertama, gunakan folder lokal yang konfigurasinya sudah benar dan telah diberi empat file revisi ini.

Pengujian: kasus ketikan berurutan hingga 1.234.567.890.123, paste nominal, hapus input, serta posisi kursor diuji melalui simulator DOM. Tampilan browser asli belum diverifikasi di lingkungan pengerjaan ini.
