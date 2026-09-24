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

## 🚀 Panduan Menjalankan di Live USB (100% Offline / Zero Internet)

Saat Anda melakukan booting dari flashdisk **Ventoy** (pilih `Try or Install Xubuntu` ➡️ `Try Xubuntu (safe graphics)`), buka terminal (`Ctrl + Alt + T`) lalu jalankan perintah ini:

```bash
# 1. Buka & Mount partisi Flashdisk Ventoy
sudo losetup -r /dev/loop99 /dev/sda1 2>/dev/null || true
sudo mkdir -p /mnt/usb
sudo mount -t exfat -o ro /dev/loop99 /mnt/usb 2>/dev/null || sudo mount -o ro /dev/sda1 /mnt/usb

# 2. Jalankan Kiosk 100% Offline (Menggunakan Browser Bawaan & Node.js Portable)
sudo /mnt/usb/START_OFFLINE_KIOSK.sh
```

---

## ⚙️ Panduan Mode Deployment Lainnya

Projek ini juga dilengkapi dengan skrip otomatis untuk kebutuhan khusus:

### 1. Mode Xubuntu Desktop (Live Session / Terhubung WiFi)
Jika perangkat terhubung ke internet dan ingin memasang Chromium otomatis:
```bash
cd app_boot/scripts
chmod +x setup_xubuntu_desktop.sh
sudo ./setup_xubuntu_desktop.sh
```

### 2. Mode Ubuntu Server (Dedicated Standalone Kiosk)
Mengubah Ubuntu Server menjadi mesin Kiosk mandiri yang otomatis login dan membuka Next.js Fullscreen saat PC dihidupkan:
```bash
cd app_boot/scripts
chmod +x setup_ubuntu_server.sh
sudo ./setup_ubuntu_server.sh
sudo reboot
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
MIT License © 2026 [lopingbest](https://github.com/lopingbest)
