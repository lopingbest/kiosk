#!/bin/bash
# ==============================================================================
# 🚀 1-CLICK 100% OFFLINE KIOSK LAUNCHER (ZERO INTERNET / ZERO DOWNLOADS)
# ==============================================================================

set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
echo "=========================================================="
echo "   🚀 MEMULAI NEXT.JS KIOSK (100% OFFLINE / STANDALONE)   "
echo "=========================================================="

echo "📂 Lokasi Flashdisk: $DIR"

# 1. Salin aplikasi ke RAM (/tmp/kiosk_app) untuk akses super cepat
echo "⚡ [1/4] Memuat server ke RAM..."
mkdir -p /tmp/kiosk_app
cp -r "$DIR/app_boot/.next/standalone"/* /tmp/kiosk_app/ 2>/dev/null || true
cp -r "$DIR/app_boot/.next/standalone/.next" /tmp/kiosk_app/ 2>/dev/null || true
mkdir -p /tmp/kiosk_app/bin
cp "$DIR/app_boot/bin/node" /tmp/kiosk_app/bin/node 2>/dev/null || true
chmod +x /tmp/kiosk_app/bin/node

# 2. Matikan Screensaver & Sleep Timer
xset -dpms 2>/dev/null || true
xset s off 2>/dev/null || true
xset s noblank 2>/dev/null || true

# 3. Jalankan Server Next.js Standalone
echo "🖥️ [2/4] Menjalankan Server Next.js di latar belakang (Port 3000)..."
pkill -f "node server.js" 2>/dev/null || true
cd /tmp/kiosk_app
PORT=3000 /tmp/kiosk_app/bin/node server.js &

# 4. Tunggu Server Siap Menerima Koneksi
echo "⏳ [3/4] Menunggu server siap..."
for i in {1..30}; do
    if curl -s http://localhost:3000 > /dev/null 2>&1 || (exec 3<>/dev/tcp/127.0.0.1/3000) 2>/dev/null; then
        echo "✓ Server Next.js Siap!"
        break
    fi
    sleep 0.5
done

# 5. Luncurkan Browser Kiosk Fullscreen
echo "🌐 [4/4] Membuka Browser Kiosk Fullscreen..."
if command -v firefox >/dev/null 2>&1; then
    firefox --kiosk http://localhost:3000 &
elif command -v chromium-browser >/dev/null 2>&1; then
    chromium-browser --kiosk --noerrdialogs --disable-infobars http://localhost:3000 &
elif command -v google-chrome >/dev/null 2>&1; then
    google-chrome --kiosk --noerrdialogs http://localhost:3000 &
else
    xdg-open http://localhost:3000 &
fi

echo ""
echo "=========================================================="
echo "  🎉 SUKSES! APLIKASI KIOSK OFFLINE TELAH AKTIF!          "
echo "  Tekan Ctrl+T untuk berganti tema, F11 untuk Fullscreen  "
echo "=========================================================="
