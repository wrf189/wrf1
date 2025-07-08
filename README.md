
# OLT Network Topology & Congestion Monitoring System (OLT-NTCM)

Sistem berbasis web untuk **visualisasi topologi jaringan OLT**, **monitoring traffic**, dan **deteksi perangkat**. Sistem ini dikembangkan untuk membantu tim Network Access Engineer dalam mengelola jaringan OLT secara efisien dan interaktif.

## 🚀 Fitur Utama

- Visualisasi topologi perangkat jaringan OLT secara interaktif (Vis-Network)
- Monitoring utilisasi bandwidth uplink dari perangkat OLT melalui API eksternal (NISA)
- Deteksi kondisi perangkat: congestion, redundancy, dan status online/offline
- Manajemen perangkat melalui antarmuka Admin Panel
- Role-based authentication (Admin & User)

---

## 🛠️ Teknologi yang Digunakan

| Layer        | Teknologi/Library           | Versi      |
|--------------|------------------------------|------------|
| Frontend     | React.js                     | 19.0.0     |
|              | Tailwind CSS                 | 4.1.3      |
|              | React Router DOM             | 7.6.0      |
|              | Axios                        | 1.8.4      |
|              | Vis-Network                  | 9.1.9      |
| Build Tool   | Vite                         | 6.2.0      |
| Backend      | Node.js                      | 22.x       |
|              | Express.js                   | 4.21.2     |
|              | Prisma ORM                   | 6.5.0      |
|              | JWT (jsonwebtoken)           | 9.0.2      |
|              | BcryptJS                     | 3.0.2      |
| Database     | PostgreSQL                   | ≥14        |
| Dev Tools    | Nodemon                      | 3.1.9      |
|              | dotenv                       | 16.4.7     |

---

## 📦 Struktur Direktori

```
project-root/
├── client/                  # Source code frontend (React)
│   └── src/
│       └── pages/
│       └── components/
│       └── assets/
│       └── App.jsx
│   └── package.json
│   └── vite.config.js
│
├── server/                  # Source code backend (Express)
│   └── src/
│       └── routes/
│       └── controllers/
│       └── prisma/          # Berisi schema.prisma
│       └── server.js
│   └── .env
│   └── package.json
│
└── README.md
```

---

## 📄 Cara Menjalankan Project

### 1. Clone Repository

```bash
git clone https://github.com/wrf189/wrf1.git
cd wrf1
```

### 2. Setup Backend

```bash
cd server
npm install
nvm use 22
npx prisma generate
npx prisma migrate dev
npm run dev
```

### 3. Setup Frontend

```bash
cd client
npm install
npm run dev
```

Frontend akan berjalan di `http://localhost:1841` dan backend di `http://localhost:3000`

---

## 🌐 Environment Variable

Buat file `.env` di folder `server/`:

```env
DATABASE_URL=postgresql://<username>:<password>@localhost:5432/<nama-db>?schema=public
JWT_SECRET=<your-secret-key>
```

---

## 👥 Hak Akses Pengguna

- **Admin:** dapat menambah, mengedit, dan menghapus data informasi perangkat serta mengelola akun pengguna.
- **User:** hanya dapat melihat menu network topologi dan monitoring.

---

## 📬 Kontak

Jika ada pertanyaan atau kendala dalam menjalankan sistem ini, silakan hubungi:

**Nama:** Wangsa Reisyah Fatahillah  
**Email:** [wangsa.fatahillah@gmail.com]  
**Mitra:** PT Eka Mas Republik (MyRepublic Indonesia)

---

## 📄 Lisensi

Proyek ini diserahkan sebagai bagian dari skripsi Program Studi Broadband Multimedia - Politeknik Negeri Jakarta 
dan diserahkan untuk keperluan internal perusahaan.
