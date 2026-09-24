#!/bin/bash
# ==============================================================================
# Script Otomatis: Konfigurasi Ubuntu USB Boot Kiosk Next.js
# Jalankan script ini di Ubuntu Live USB (dengan persistent partition)
# ==============================================================================

set -e

echo "=========================================================="
echo "   🚀 INSTALASI UBUNTU USB BOOT KIOSK (NEXT.JS APP)       "
echo "=========================================================="

# 1. Update paket & Install Chromium + Openbox + Node.js jika belum ada
echo "📦 [1/6] Memperbarui repositori & menginstal tools Kiosk..."
sudo apt update
sudo apt install -y curl chromium-browser openbox xorg lightdm unclutter xdotool

# 2. Cek apakah Node.js sudah terpasang
if ! command -v node &> /dev/null; then
    echo "⬇️ Menginstal Node.js LTS..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
fi

echo "✓ Node.js $(node -v) & npm $(npm -v) siap."

# 3. Setup User Kiosk
KIOSK_USER="kiosk"
if ! id -u "$KIOSK_USER" >/dev/null 2>&1; then
    echo "👤 [2/6] Membuat user '$KIOSK_USER' untuk auto-login..."
    sudo useradd -m -s /bin/bash "$KIOSK_USER"
    sudo usermod -aG sudo,video,audio,input "$KIOSK_USER"
    echo "$KIOSK_USER:$KIOSK_USER" | sudo chpasswd
fi

# 4. Salin / Set izin direktori aplikasi
APP_DIR="/home/$KIOSK_USER/app_boot"
echo "📂 [3/6] Menyiapkan direktori aplikasi di $APP_DIR..."
sudo mkdir -p "$APP_DIR"
sudo cp -r ./* "$APP_DIR/" 2>/dev/null || true
sudo chown -R "$KIOSK_USER:$KIOSK_USER" "$APP_DIR"

# 5. Build Next.js ke mode produksi standalone
echo "🔨 [4/6] Membangun (Build) Next.js untuk performa maksimal..."
cd "$APP_DIR"
sudo -u "$KIOSK_USER" npm run build

# 6. Konfigurasi Auto-Login di LightDM
echo "⚙️ [5/6] Mengaktifkan Auto-Login user kiosk tanpa password..."
sudo mkdir -p /etc/lightdm/lightdm.conf.d
cat << 'EOF' | sudo tee /etc/lightdm/lightdm.conf.d/50-kiosk.conf
[Seat:*]
autologin-user=kiosk
autologin-user-timeout=0
user-session=openbox
EOF

# 7. Konfigurasi Openbox Autostart (Chromium Kiosk Layar Penuh)
echo "🖥️ [6/6] Menyiapkan script autostart Chromium Kiosk..."
sudo mkdir -p "/home/$KIOSK_USER/.config/openbox"
cat << 'EOF' | sudo tee "/home/$KIOSK_USER/.config/openbox/autostart"
# Sembunyikan kursor mouse saat tidak digerakkan
unclutter -idle 3 -root &

# Matikan Screensaver & Sleep Mode
xset -dpms &
xset s off &
xset s noblank &

# Tunggu server Next.js siap menerima koneksi pada port 3000
until curl -s http://localhost:3000 > /dev/null; do
    sleep 0.5
done

# Luncurkan Chromium Mode Kiosk Layar Penuh
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
  http://localhost:3000 &
EOF

sudo chown -R "$KIOSK_USER:$KIOSK_USER" "/home/$KIOSK_USER/.config"

# 8. Setup Systemd Service untuk Next.js
cat << 'EOF' | sudo tee /etc/systemd/system/nextjs-kiosk.service
[Unit]
Description=Next.js Ubuntu USB Boot Kiosk Server
After=network.target

[Service]
Type=simple
User=kiosk
WorkingDirectory=/home/kiosk/app_boot
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=3
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable nextjs-kiosk.service
sudo systemctl restart nextjs-kiosk.service

echo ""
echo "=========================================================="
echo "  🎉 SUKSES! KONFIGURASI KIOSK USB TELAH SELESAI!        "
echo "  Saat PC di-boot dari USB ini, aplikasi Next.js akan     "
echo "  otomatis berjalan layar penuh (Fullscreen Kiosk).       "
echo "=========================================================="
