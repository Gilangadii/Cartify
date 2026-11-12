🛒 Cartify

Cartify adalah aplikasi web e-commerce berbasis Node.js, Express, PostgreSQL, Sequelize, dan EJS. Aplikasi ini dilengkapi dengan fitur autentikasi dan otorisasi pengguna (Admin & Customer), katalog produk dengan pencarian dan filter kategori, manajemen keranjang belanja (shopping cart), pengelolaan profil pengiriman, serta pembuatan bukti transaksi/invoice PDF secara otomatis saat checkout.

📋 Prasyarat Sistem (Software yang Harus Terpasang)
Sebelum menjalankan aplikasi ini, pastikan perangkatmu sudah terinstal:
Node.js (disarankan versi v18 atau v20 ke atas — sudah termasuk npm)
PostgreSQL (database server yang aktif berjalan)
Git (opsional, untuk melakukan clone repository)

📦 Daftar Package / Dependencies Utama
Aplikasi ini menggunakan beberapa library utama yang akan terinstal otomatis melalui npm install:
express — Framework web server Node.js
ejs — Template engine untuk merender halaman tampilan (Views)
pg & pg-hstore — Driver koneksi database PostgreSQL
sequelize — ORM untuk mengelola model, relasi, dan query database
sequelize-cli — CLI untuk menjalankan migration dan seeder database
bcryptjs — Enkripsi (hashing) password pengguna
express-session — Manajemen sesi login pengguna
easyinvoice — Generator dokumen invoice PDF otomatis saat checkout

🚀 Cara Instalasi & Menjalankan Aplikasi
Ikuti langkah-langkah berikut di terminal untuk menjalankan Cartify di komputer lokal:
1. Clone Repository & Masuk ke Folder Proyek
git clone <url-repository-kamu>
cd pair-project-phase1

2. Instal Semua Dependencies
Jalankan perintah berikut untuk mengunduh semua package yang terdaftar di package.json:
npm install
(Jika ada package yang belum tercatat di package.json, jalankan instalasi manual berikut:)
npm install express ejs pg pg-hstore sequelize bcryptjs express-session easyinvoice
npm install --save-dev sequelize-cli nodemon

3. Konfigurasi Database PostgreSQL
Buka file config/config.json, lalu sesuaikan username, password, dan database pada bagian "development" sesuai dengan pengaturan PostgreSQL di komputermu:
{
  "development": {
    "username": "postgres",
    "password": "password_postgres_kamu",
    "database": "cartify_db",
    "host": "127.0.0.1",
    "dialect": "postgres"
  }
}

4. Buat Database, Jalankan Migration, & Seeding Data Awal
Jalankan perintah Sequelize CLI berikut secara berurutan di terminal:
npx sequelize-cli db:create
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all

5. Jalankan Server Aplikasi
Jalankan server menggunakan Node.js atau Nodemon:
node app.js
# atau jika menggunakan nodemon:
npx nodemon app.js

6. Akses Aplikasi di Browser
Buka browser dan kunjungi alamat:
http://localhost:3000

✨ Fitur Utama Aplikasi
Landing Page & Autentikasi: Halaman utama Cartify dengan fitur Register, Login, dan Logout berbasis session serta enkripsi password (bcryptjs).
Role-Based Access Control:
Admin: Dapat menambah, mengedit, dan menghapus produk serta melihat stok barang.
Customer: Dapat melihat katalog produk, menambahkan produk ke keranjang, mengelola profil, dan melakukan checkout.

Manajemen Profil Pengiriman: Relasi One-to-One antara User dan Profile untuk menyimpan nama penerima, nomor telepon, dan alamat pengiriman sebelum melakukan transaksi.

Keranjang Belanja & Checkout PDF: Menghitung subtotal per item dan total belanja secara otomatis, serta menghasilkan file invoice berformat .pdf siap unduh setelah transaksi selesai.
