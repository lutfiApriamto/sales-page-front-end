# [SalesGen.ai — Frontend](https://sales-page-front-end.vercel.app/)

> AI-powered Sales Page Generator. Ubah informasi produk mentah menjadi halaman penjualan yang persuasif dalam hitungan detik.

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## 📌 Tentang Project

SalesGen.ai adalah aplikasi web fullstack yang memungkinkan pengguna untuk menghasilkan **sales page / landing page profesional** secara otomatis menggunakan kecerdasan buatan (Gemini AI). Repository ini merupakan bagian **Frontend** dari aplikasi tersebut.

**Repository Backend:** [sales-page-backend](https://github.com/lutfiApriamto/sales-page-backend)

---

## ✨ Fitur Utama

- **Autentikasi Lengkap** — Register, Login, Logout, Forgot Password, Reset Password
- **AI Generator** — Generate sales page persuasif menggunakan Gemini AI
- **Live Preview** — Render hasil HTML langsung di browser dengan mode Desktop & Mobile
- **Manajemen Riwayat** — Lihat, hapus, dan regenerate sales page yang pernah dibuat
- **Export HTML** — Download sales page sebagai file `.html` siap hosting
- **Sistem Credit** — Setiap akun mendapatkan 35 credit generate
- **Responsive Design** — Tampilan optimal di semua ukuran layar
- **Dashboard Profesional** — Sidebar collapsible, breadcrumb dinamis, profile dialog

---

## 🛠️ Tech Stack

| Teknologi | Versi | Kegunaan |
|-----------|-------|----------|
| React | 19 | UI Library |
| Vite | 6 | Build Tool & Dev Server |
| Tailwind CSS | 4 | Styling |
| React Router DOM | 6 | Client-side Routing |
| Zustand | latest | State Management |
| Axios | latest | HTTP Client |
| Shadcn/ui | latest | UI Components |
| Lucide React | latest | Icon Library |
| React Hot Toast | latest | Notifikasi |

---

## 📁 Struktur Folder

```
src/
├── app/
│   ├── features/
│   │   ├── LandingPage/        # Halaman publik utama
│   │   ├── Login/              # Halaman login + auth store
│   │   ├── Register/           # Halaman registrasi
│   │   ├── ForgotPassword/     # Halaman lupa password
│   │   ├── ResetPassword/      # Halaman reset password
│   │   ├── Dashboard/          # Halaman dashboard + riwayat
│   │   ├── Generate/           # Form generate sales page
│   │   └── SalesPageDetail/    # Detail & live preview
│   └── router.jsx              # Konfigurasi routing
├── components/
│   ├── AuthSidePanel/          # Panel kiri halaman auth
│   ├── FieldHint/              # Tooltip hint untuk form field
│   ├── layouts/
│   │   ├── DashboardLayout/    # Layout utama dashboard
│   │   ├── ProtectedRoute/     # Auth guard
│   │   └── ContentLayout/      # Wrapper konten halaman
│   └── ui/                     # Shadcn components
└── utils/
    └── axiosService/           # Axios instance & interceptor
```

---

## 🚀 Cara Menjalankan Secara Lokal

### Prasyarat

Pastikan sudah terinstall:
- Node.js >= 18
- npm atau yarn
- Backend API sudah berjalan ([lihat repo backend](https://github.com/lutfiApriamto/sales-page-backend))

### Instalasi

**1. Clone repository**
```bash
git clone https://github.com/lutfiApriamto/sales-page-frontend.git
cd sales-page-frontend
```

**2. Install dependencies**
```bash
npm install
```

**3. Buat file `.env`**
```bash
cp .env.example .env
```

Lalu isi file `.env`:
```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

**4. Jalankan development server**
```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173`

---

## 🌐 Environment Variables

| Variable | Contoh | Keterangan |
|----------|--------|------------|
| `VITE_API_BASE_URL` | `http://127.0.0.1:8000/api` | Base URL backend API |

---

## 📄 Halaman yang Tersedia

### Public (tanpa login)
| Path | Halaman |
|------|---------|
| `/` | Landing Page |
| `/login` | Halaman Login |
| `/register` | Halaman Registrasi |
| `/forgot-password` | Halaman Lupa Password |
| `/reset-password` | Halaman Reset Password |

### Private (wajib login)
| Path | Halaman |
|------|---------|
| `/dashboard` | Dashboard & Riwayat Sales Page |
| `/generate` | Form Generate Sales Page Baru |
| `/sales-page/:id` | Detail & Live Preview Sales Page |

---

## 🔐 Autentikasi

Aplikasi menggunakan **Laravel Sanctum Token** untuk autentikasi. Token disimpan di `localStorage` dan dikirim via header `Authorization: Bearer <token>` pada setiap request ke endpoint private.

---

## 🏗️ Build untuk Production

```bash
npm run build
```

Output akan tersimpan di folder `dist/`.

---

## ☁️ Deployment

Frontend di-deploy di **Vercel**. Pastikan environment variable `VITE_API_BASE_URL` sudah diisi dengan URL backend production.

---

## 👤 Author

**Muhammad Lutfi Apriamto**
- GitHub: [@lutfiApriamto](https://github.com/lutfiApriamto)

---

## 📝 Lisensi

Project ini menggunakan lisensi [MIT](LICENSE).