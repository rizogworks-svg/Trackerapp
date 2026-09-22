# Lima tema baru — v7.4

Buka Settings → Tampilan:
- Ocean Blue: biru terang.
- Soft Lavender: ungu pastel.
- Warm Sand: krem hangat.
- Navy Sky: navy gelap dengan aksen biru muda.
- Graphite Rose: abu-ungu gelap dengan aksen rose.

Trackers Green dan Midnight Lime tetap tersedia (total tujuh tema).
Tema diterapkan ke latar workspace, dialog, kartu, navigasi, dan modul PKBON. Ikon mengikuti warna teks. Pilihan tema akun dengan hak edit tetap tersimpan setelah reload; viewer tetap mengikuti perilaku sebelumnya (perubahan tema hanya untuk sesi saat ini).

Patch untuk aplikasi v7.2/v7.3. Perbaikan popup konflik v7.3 ikut disertakan.
1. Ekstrak ZIP.
2. Upload ISI patch ke lokasi index.html pada repo yang sama. Timpa file yang sama, jangan hapus file lainnya.
3. Pertahankan config.js lama (tidak disertakan).
4. Setelah deployment selesai, buka UPDATE_TRACKERS.html dan Aktifkan versi 7.4.
5. Buka Settings → Tampilan, pilih tema.

Tidak ada SQL baru. Pilihan lima tema, penerapan latar, dan penyimpanan setelah reload telah dicek dalam simulasi DOM. Kontras teks utama/sekunder terhadap panel, kartu, dan workspace dihitung minimal 4,5:1 untuk semua tema baru. Belum diuji visual pada browser produksi.
