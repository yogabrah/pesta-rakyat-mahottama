# Pesta Rakyat Mahottama — Proposal Penawaran

Website statis proposal penawaran **Pesta Rakyat Mahottama** untuk Pemerintah Kabupaten Klungkung, Bali. Dokumen ini menguraikan rencana acara, pembagian peran, pembiayaan oleh penyelenggara, serta ilustrasi penerimaan parkir yang perlu disepakati bersama Pemda.

**Live site:** [https://yogabrah.github.io/pesta-rakyat-mahottama/](https://yogabrah.github.io/pesta-rakyat-mahottama/)

## Ringkasan

- **Acara:** Pesta Rakyat Mahottama + Pesta Kembang Api
- **Periode:** 22–31 Desember 2026
- **Lokasi usulan:** Lapangan Puputan Klungkung
- **Skema:** kerja sama penyelenggaraan; pembiayaan kegiatan diusulkan oleh penyelenggara
- **Retribusi parkir:** motor Rp4.000 dan mobil Rp6.000 per kendaraan, bila skema disetujui
- **Ilustrasi parkir:** ±Rp55,3 juta untuk 10 malam pada skenario moderat
- **Estimasi biaya penyelenggara:** ±Rp770 juta
- **Target kunjungan:** 50.000 kunjungan

> Seluruh angka retribusi, kunjungan, dan biaya adalah ilustrasi perencanaan, bukan jaminan. Realisasi mengikuti karcis resmi, kunjungan aktual, kesepakatan para pihak, dan ketentuan peraturan daerah yang berlaku.

## Fitur Website

- Proposal lengkap 12 bab dengan navigasi samping dan daftar isi.
- Halaman **Pimpinan Daerah** dengan foto resmi Bupati dan Wakil Bupati Klungkung.
- **Denah 3D interaktif** dengan mode Tata Letak, Malam Puncak, dan Keselamatan. Pada layar kecil, denah dapat digeser agar label tetap terbaca.
- Ilustrasi penerimaan retribusi parkir dengan tiga skenario.
- **Dokumentasi kegiatan sebelumnya**: galeri foto pasar malam, bianglala, odong-odong, aktivitas menggambar anak, dan wahana remaja.
- RAB penyelenggara dan lampiran dokumen.
- Tombol **Buka PDF** mengarah ke file PDF statis yang sudah final—bukan hasil cetak ulang dari HTML.
- Desain responsif untuk ponsel, tablet, dan desktop; dilengkapi `prefers-reduced-motion`.
- Ornamen patra Kamasan minimalis dan tata letak editorial yang konsisten.

## Struktur Repo

```text
.
├── index.html                         # Halaman utama proposal
├── style/
│   └── style.css                      # Seluruh gaya tampilan + aturan cetak PDF
├── script/
│   └── main.js                        # Interaksi denah, navigasi, galeri, ornamen
├── assets/
│   ├── images/
│   │   ├── satria.png                 # Foto Bupati Klungkung
│   │   ├── tjok.png                   # Foto Wakil Bupati Klungkung
│   │   └── dokumentasi/
│   │       ├── pasar-malam.jpg        # Dokumentasi suasana pasar malam
│   │       ├── pasar-malam-cover.jpg  # Versi ringan untuk sampul
│   │       ├── bianglala.jpg          # Dokumentasi wahana bianglala
│   │       ├── odong-odong-anak.jpg   # Dokumentasi wahana anak
│   │       ├── menggambar-anak.jpg    # Dokumentasi aktivitas keluarga
│   │       └── wahana-remaja.jpg      # Dokumentasi wahana remaja
│   └── proposal-pesta-rakyat-mahottama.pdf
├── .gitignore
├── .nojekyll
└── README.md
```

## Menjalankan Secara Lokal

Tidak diperlukan build tool. Buka `index.html` langsung di browser, atau jalankan server statis:

```bash
python3 -m http.server 8000
```

Lalu buka `http://localhost:8000/`.

## Deploy ke GitHub Pages

Repo ini disiapkan untuk GitHub Pages dari **root branch `main`**.

Jika melakukan fork atau membuat repo baru:

1. Upload seluruh isi folder ini ke root repo.
2. Buka **Settings → Pages**.
3. Pilih **Deploy from a branch**.
4. Branch: `main`; folder: `/ (root)`.
5. Simpan dan tunggu proses build.

URL default:

```text
https://<username>.github.io/<nama-repo>/
```

Untuk repo ini:

```text
https://yogabrah.github.io/pesta-rakyat-mahottama/
```

## Memperbarui Konten

- **Teks proposal:** edit `index.html`.
- **Warna, tipografi, layout, dan aturan cetak:** edit `style/style.css`.
- **Denah 3D, navigasi, galeri, dan animasi:** edit `script/main.js`.
- **Foto pimpinan:** ganti `assets/images/satria.png` dan `assets/images/tjok.png` dengan nama file yang sama.
- **Foto dokumentasi:** ganti file di `assets/images/dokumentasi/` dengan nama yang sama, atau sesuaikan `src` pada galeri di `index.html`.
- **PDF:** ganti `assets/proposal-pesta-rakyat-mahottama.pdf`. Tombol **Buka PDF** akan membuka file tersebut. PDF tidak dibuat ulang oleh browser.
- **Domain:** saat ini memakai URL GitHub Pages default. Jika ingin custom domain, tambahkan file `CNAME` dan atur DNS sesuai dokumentasi GitHub Pages.

### Catatan PDF

PDF statis dihasilkan dari `index.html` menggunakan aturan `@media print` di `style/style.css`. Aturan cetak memakai skala huruf yang lebih besar agar tetap nyaman dibaca, tabel RAB ditampilkan pada halaman landscape, dan dokumentasi foto ikut dicetak. Setelah mengubah konten, buat ulang PDF dari HTML agar isi website dan PDF tetap sinkron.

## Catatan Data dan Legal

- Tarif parkir yang digunakan dalam ilustrasi: **Rp4.000 sepeda motor** dan **Rp6.000 mobil**.
- Dasar acuan yang dicantumkan dalam proposal: **Perda Kabupaten Klungkung Nomor 8 Tahun 2019** dan **Perda Kabupaten Klungkung Nomor 4 Tahun 2026 tentang Pajak Daerah dan Retribusi Daerah**.
- Angka skenario parkir menggunakan asumsi tingkat tangkapan parkir, komposisi kendaraan, dan okupansi yang dijelaskan di dalam proposal.
- Rencana biaya penyelenggara bersifat estimasi indikatif dan bukan permintaan pembayaran kepada Pemda.
- Dokumen ini adalah bahan penawaran, bukan perjanjian yang mengikat. Pelaksanaan menunggu izin, kesepakatan, dan koordinasi Pemerintah Kabupaten Klungkung.
- Foto pimpinan daerah digunakan sebagai bagian dari penyajian penerima penawaran dan dilengkapi keterangan sumber.
- Foto dokumentasi kegiatan digunakan sebagai portofolio pengalaman penyelenggara; hasil acara mendatang menyesuaikan lokasi, izin, dan kondisi lapangan.

## Keamanan

Repo ini hanya berisi file statis. Tidak ada API key, token, password, kredensial, atau file `.env` yang di-commit. `.gitignore` mencakup file lingkungan dan cache umum.

## Kredit

- Desain dan pengembangan: tim penyelenggara.
- Foto Bupati dan Wakil Bupati: dokumentasi resmi Pemerintah Kabupaten Klungkung.
- Foto dokumentasi kegiatan: dokumentasi penyelenggara.
- Tipografi: Fraunces, Plus Jakarta Sans, dan IBM Plex Mono melalui Google Fonts.
- Ornamen: adaptasi patra/guratan Kamasan yang disederhanakan.

## Hak Cipta

Materi proposal, identitas acara, dan desain halaman disusun untuk keperluan penawaran Pesta Rakyat Mahottama. Penggunaan ulang di luar konteks penawaran sebaiknya mendapat izin dari penyelenggara.
