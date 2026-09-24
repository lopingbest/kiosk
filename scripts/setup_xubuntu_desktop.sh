#!/bin/bash
# ==============================================================================
# Script 1: Setup Kiosk Khusus Xubuntu Desktop / Ubuntu Desktop (XFCE / GNOME)
# Cocok untuk: Live USB (Mode Coba/Demo) maupun Xubuntu yang terpasang
# ==============================================================================

set -e

echo "=========================================================="
echo "   🚀 INSTALASI KIOSK UNTUK XUBUNTU DESKTOP               "
echo "=========================================================="

CURRENT_USER=$(whoami)
APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "📂 Lokasi Projek: $APP_DIR"
echo "👤 User Aktif: $CURRENT_USER"

# 1. Update paket & pastikan Chromium + Unclutter terpasang
echo "📦 [1/4] Memeriksa & memasang Chromium Browser..."
sudo apt update
sudo apt install -y curl chromium-browser unclutter

# 2. Cek & install Node.js jika belum ada
if ! command -v node &> /dev/null; then
    echo "⬇️ [2/4] Menginstal Node.js LTS (v20)..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
fi

echo "✓ Node.js $(node -v) & npm $(npm -v) siap."

# 3. Build / Persiapkan Aplikasi Next.js
echo "🔨 [3/4] Menyiapkan dependensi & build aplikasi Next.js..."
cd "$APP_DIR"
npm install
npm run build

# 4. Buat Autostart Desktop XFCE
echo "⚙️ [4/4] Mengonfigurasi Autostart XFCE / Desktop..."
AUTOSTART_DIR="$HOME/.config/autostart"
mkdir -p "$AUTOSTART_DIR"

cat << EOF > "$AUTOSTART_DIR/kiosk-nextjs.desktop"
[Desktop Entry]
Type=Application
Exec=$APP_DIR/scripts/launch_xubuntu_kiosk.sh
Hidden=false
NoDisplay=false
X-GNOME-Autostart-enabled=true
Name=NextJS Kiosk
Comment=Start Next.js Kiosk in Fullscreen
EOF

# 5. Buat Script Launcher Kiosk
cat << 'EOF' > "$APP_DIR/scripts/launch_xubuntu_kiosk.sh"
#!/bin/bash
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$DIR"

# Matikan Screensaver & Sleep
xset -dpms &
xset s off &
xset s noblank &
which unclutter >/dev/null 2>&1 && unclutter -idle 2 -root &

# Jalankan server Next.js di background jika belum berjalan
if ! curl -s http://localhost:3000 > /dev/null; do
    npm start &
fi

# Tunggu server siap di port 3000
until curl -s http://localhost:3000 > /dev/null; do
    sleep 0.5
done

# Luncurkan Chromium Mode Kiosk
chromium-browser \
  --kiosk \
  --noerrdialogs \
  --disable-infobars \
  --check-for-update-interval=31536000 \
  --disable-pinch \
  --overscroll-history-navigation=0 \
  --no-first-run \
  --autoplay-policy=no-user-gesture-required \
  --disable-features=Translate \
  http://localhost:3000
EOF

chmod +x "$APP_DIR/scripts/launch_xubuntu_kiosk.sh"

echo ""
echo "=========================================================="
echo "  🎉 SUKSES! XUBUNTU KIOSK TELAH SIAP!                   "
echo "  Untuk menjalankan demo Kiosk sekarang, jalankan:       "
echo "  👉 ./scripts/launch_xubuntu_kiosk.sh                   "
echo "=========================================================="
