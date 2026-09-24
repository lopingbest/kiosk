# 🚀 Ubuntu USB Boot Kiosk (Next.js Multi-Theme System)

Sebuah sistem aplikasi Kiosk modern berbasis **Next.js 14**, dilengkapi dengan **8 tema interaktif**, pemantau sistem real-time, terminal CLI, pengujian layar/hardware, dan skrip instalasi otomatis untuk **Bootable USB Ubuntu (Live & Standalone)**.

---

## 🌟 Fitur Utama

- **🎨 8 Pilihan Tema Interaktif**:
  - `Cyberpunk Neon` (Cyan & Magenta Glow)
  - `Midnight OLED` (True Pure Black #000000 & Emerald)
  - `Tokyo Sunset` (Synthwave Violet, Warm Pink & Orange)
  - `Nordic Arctic` (Deep Navy & Ice Cyan)
  - `Matrix Terminal` (Hacker Phosphor Green CRT + Scanlines)
  - `Daylight Modern` (Clean Light Mode & Sapphire Indigo)
  - `Crimson Ember` (Volcanic Obsidian & Ruby)
  - `Emerald Aurora` (Deep Jade & Bioluminescent Mint)
- **⌨️ Pintasan Keyboard Kiosk**:
  - `Ctrl + T` : Ganti tema secara instan
  - `F11` : Mode Layar Penuh (Fullscreen)
  - `Ctrl + \`` : Buka Terminal CLI
- **🖥️ Modul Kiosk Terintegrasi**:
  - **Live System Overview**: Real-time CPU, RAM, Uptime, OS kernel info, dan log boot kernel.
  - **Interactive Terminal Sandbox**: Fastfetch/Neofetch, `theme set <id>`, ping tester, df -h, free -m.
  - **Hardware Tester**: Uji kalibrasi warna, deteksi dead pixel (8 layar penuh), uji frekuensi speaker (60Hz–5kHz), dan uji tombol keyboard.
  - **Storage & USB Explorer**: Penjelajah partisi flashdisk dan file konfigurasi.
  - **Diagnostik Jaringan**: Grafik live latency dan tes bandwidth.
  - **Manajemen Daya**: Reload, Reboot, dan Shutdown modal.

---

## 🚀 Panduan Booting USB

Projek ini dilengkapi dengan skrip otomatis untuk 2 skenario deployment:

### 1. Mode Xubuntu Desktop (Live USB / Demo Cepat)
Cocok untuk demo di memori RAM tanpa menginstal apa pun ke harddisk laptop/PC:
```bash
cd scripts
chmod +x setup_xubuntu_desktop.sh
sudo ./setup_xubuntu_desktop.sh
```

### 2. Mode Ubuntu Server (Dedicated Standalone Kiosk)
Mengubah Ubuntu Server menjadi mesin Kiosk mandiri yang otomatis login dan membuka Next.js Fullscreen saat PC dihidupkan:
```bash
cd scripts
chmod +x setup_ubuntu_server.sh
sudo ./setup_ubuntu_server.sh
sudo reboot
```

### 3. Mode 100% Offline (Zero Downloads)
Jalankan file master di root flashdisk:
```bash
./START_OFFLINE_KIOSK.sh
```

---

## 🛠️ Pengembangan Lokal

```bash
# Install dependensi
npm install

# Jalankan server pengembangan
npm run dev

# Bangun versi produksi
npm run build

# Jalankan versi produksi
npm start
```

---

## 📄 Lisensi
MIT License © 2026 lopingbest
