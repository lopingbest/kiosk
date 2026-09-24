#!/bin/bash
# ==============================================================================
# Script: 100% OFFLINE KIOSK LAUNCHER (ZERO INTERNET / ZERO DOWNLOADS)
# Menggunakan Node.js Portable & Browser Bawaan (Firefox/Chromium)
# ==============================================================================

set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
echo "=========================================================="
echo "   🚀 MENJALANKAN KIOSK NEXT.JS (MODE 100% OFFLINE)       "
echo "=========================================================="

echo "📂 Lokasi Projek: $DIR"

# 1. Menyiapkan Runtime di RAM (/tmp/kiosk_app) untuk performa instan
echo "⚡ Memuat aplikasi ke RAM..."
mkdir -p /tmp/kiosk_app
cp -r "$DIR/.next/standalone"/* /tmp/kiosk_app/ 2>/dev/null || true
cp -r "$DIR/.next/standalone/.next" /tmp/kiosk_app/ 2>/dev/null || true
mkdir -p /tmp/kiosk_app/bin
cp "$DIR/bin/node" /tmp/kiosk_app/bin/node 2>/dev/null || true
chmod +x /tmp/kiosk_app/bin/node

# 2. Matikan Screensaver & Sleep Mode
xset -dpms 2>/dev/null || true
xset s off 2>/dev/null || true
xset s noblank 2>/dev/null || true

# 3. Jalankan Server Next.js Standalone
echo "🖥️ Menjalankan Server Next.js di port 3000..."
cd /tmp/kiosk_app
PORT=3000 /tmp/kiosk_app/bin/node server.js &

# 4. Tunggu Server Siap Menerima Koneksi
echo "⏳ Menunggu server siap..."
for i in {1..30}; do
    if curl -s http://localhost:3000 > /dev/null 2>&1 || (exec 3<>/dev/tcp/127.0.0.1/3000) 2>/dev/null; then
        echo "✓ Server Next.js Siap!"
        break
    fi
    sleep 0.5
done

# 5. Luncurkan Browser Bawaan dalam Mode Kiosk Fullscreen
echo "🌐 Membuka Browser Kiosk Fullscreen..."
if command -v firefox >/dev/null 2>&1; then
    echo "Menggunakan Firefox Kiosk..."
    firefox --kiosk http://localhost:3000 &
elif command -v chromium-browser >/dev/null 2>&1; then
    echo "Menggunakan Chromium Kiosk..."
    chromium-browser --kiosk --noerrdialogs --disable-infobars http://localhost:3000 &
elif command -v google-chrome >/dev/null 2>&1; then
    google-chrome --kiosk --noerrdialogs http://localhost:3000 &
else
    echo "Membuka browser sistem default..."
    xdg-open http://localhost:3000 &
fi

echo "=========================================================="
echo "  🎉 SUKSES! APLIKASI KIOSK OFFLINE BERHASIL TAYANG!      "
echo "=========================================================="
