# Pesta Rakyat Mahottama — Proposal Izin Tanpa Biaya

Website statis proposal penawaran **Pesta Rakyat Mahottama** untuk Pemerintah Kabupaten Klungkung, Bali. Dokumen ini mengajukan **izin tanpa biaya**: seluruh pembiayaan acara ditanggung penyelenggara, sementara daerah berpotensi menerima retribusi parkir.

**Live site:** [https://yogabrah.github.io/pesta-rakyat-mahottama/](https://yogabrah.github.io/pesta-rakyat-mahottama/)

## Ringkasan

- **Acara:** Pesta Rakyat Mahottama + Pesta Kembang Api
- **Periode:** 22–31 Desember 2026
- **Lokasi usulan:** Lapangan Puputan Klungkung
- **Skema:** Izin tanpa biaya; Rp0 dari APBD
- **Retribusi parkir:** motor Rp4.000 dan mobil Rp6.000 per kendaraan
- **Potensi parkir:** ilustrasi moderat ±Rp55,3 juta untuk 10 malam
- **Investasi penyelenggara:** ±Rp770 juta, ditanggung sendiri
- **Target kunjungan:** 50.000 kunjungan

> Angka retribusi dan kunjungan adalah ilustrasi perencanaan. Realisasi mengikuti karcis resmi, kunjungan aktual, dan ketentuan peraturan daerah yang berlaku.

## Fitur Website

- Proposal lengkap 12 bab dengan navigasi samping dan daftar isi.
- Halaman **Pimpinan Daerah** dengan foto resmi Bupati dan Wakil Bupati Klungkung.
- **Denah 3D interaktif** dengan mode Tata Letak, Malam Puncak, dan Keselamatan.
- Ilustrasi penerimaan retribusi parkir dengan tiga skenario.
- RAB penyelenggara dan lampiran dokumen.
- Tombol **Buka PDF** mengarah ke file PDF statis yang sudah final—bukan hasil cetak ulang dari HTML.
- Desain responsif, animasi ringan, serta ornamen patra Kamasan minimalis.
- Mendukung `prefers-reduced-motion` untuk pengguna yang mematikan animasi.

## Struktur Repo

```text
.
├── index.html                         # Halaman utama proposal
├── style/
│   └── style.css                      # Seluruh gaya tampilan
├── script/
│   └── main.js                        # Interaksi denah, navigasi, dan ornamen
├── assets/
│   ├── images/
│   │   ├── satria.png                 # Foto Bupati Klungkung
│   │   └── tjok.png                   # Foto Wakil Bupati Klungkung
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
- **Warna, tipografi, dan layout:** edit `style/style.css`.
- **Denah 3D, navigasi, animasi:** edit `script/main.js`.
- **Foto pimpinan:** ganti `assets/images/satria.png` dan `assets/images/tjok.png` dengan nama file yang sama.
- **PDF:** ganti `assets/proposal-pesta-rakyat-mahottama.pdf`. Tombol **Buka PDF** akan membuka file tersebut. PDF tidak dibuat ulang oleh browser.
- **Domain:** saat ini memakai URL GitHub Pages default. Jika ingin custom domain, tambahkan file `CNAME` dan atur DNS sesuai dokumentasi GitHub Pages.

## Catatan Data dan Legal

- Tarif parkir yang digunakan dalam ilustrasi: **Rp4.000 sepeda motor** dan **Rp6.000 mobil**.
- Dasar acuan yang dicantumkan dalam proposal: **Perda Kabupaten Klungkung Nomor 8 Tahun 2019** dan **Perda Kabupaten Klungkung Nomor 4 Tahun 2026 tentang Pajak Daerah dan Retribusi Daerah**.
- Angka skenario parkir menggunakan asumsi tingkat tangkapan parkir, komposisi kendaraan, dan okupansi yang dijelaskan di dalam proposal.
- Dokumen ini adalah bahan penawaran, bukan perjanjian yang mengikat. Pelaksanaan menunggu izin dan koordinasi Pemerintah Kabupaten Klungkung.
- Foto pimpinan daerah digunakan sebagai bagian dari penyajian penerima penawaran dan dilengkapi keterangan sumber.

## Keamanan

Repo ini hanya berisi file statis. Tidak ada API key, token, password, kredensial, atau file `.env` yang di-commit. `.gitignore` mencakup file lingkungan dan cache umum.

## Kredit

- Desain dan pengembangan: tim penyelenggara.
- Foto Bupati dan Wakil Bupati: dokumentasi resmi Pemerintah Kabupaten Klungkung.
- Tipografi: Fraunces, Plus Jakarta Sans, dan IBM Plex Mono melalui Google Fonts.
- Ornamen: adaptasi patra/guratan Kamasan yang disederhanakan.

## Hak Cipta

Materi proposal, identitas acara, dan desain halaman disusun untuk keperluan penawaran Pesta Rakyat Mahottama. Penggunaan ulang di luar konteks penawaran sebaiknya mendapat izin dari penyelenggara.
