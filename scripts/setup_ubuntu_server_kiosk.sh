#!/bin/bash
# ==============================================================================
# Script Khusus: Konfigurasi Ubuntu Server 24.04 LTS menjadi Next.js Kiosk
# ==============================================================================

set -e

echo "================================================================="
echo "   🚀 INSTALASI KIOSK PADA UBUNTU SERVER 24.04 LTS               "
echo "   (Mode Ultra-Cepat, Ringan & Auto-Start Fullscreen)            "
echo "================================================================="

# 1. Update paket sistem
echo "📦 [1/6] Memperbarui repositori paket..."
sudo apt update && sudo apt upgrade -y

# 2. Install X11 Server, Openbox (Window Manager Ringan), Chromium & Tools
echo "📦 [2/6] Menginstal Xorg Display Server, Openbox, Chromium & Unclutter..."
sudo apt install -y \
  xorg \
  openbox \
  chromium-browser \
  curl \
  unclutter \
  lightdm \
  alsa-utils \
  fonts-noto-color-emoji \
  fonts-dejavu-core

# 3. Install Node.js LTS (v20) jika belum ada
if ! command -v node &> /dev/null; then
    echo "⬇️ [3/6] Menginstal Node.js LTS (v20)..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
fi

echo "✓ Node.js $(node -v) & npm $(npm -v) terpasang."

# 4. Buat User 'kiosk' untuk Auto-Login
CURRENT_USER=$(whoami)
KIOSK_USER="kiosk"

if ! id -u "$KIOSK_USER" >/dev/null 2>&1; then
    echo "👤 [4/6] Membuat user '$KIOSK_USER'..."
    sudo useradd -m -s /bin/bash "$KIOSK_USER"
    sudo usermod -aG sudo,video,audio,input,render "$KIOSK_USER"
    echo "$KIOSK_USER:kiosk123" | sudo chpasswd
fi

# 5. Konfigurasi Auto-Login di LightDM Display Manager
echo "⚙️ [5/6] Mengaktifkan Auto-Login tanpa password..."
sudo mkdir -p /etc/lightdm/lightdm.conf.d
cat << 'EOF' | sudo tee /etc/lightdm/lightdm.conf.d/50-kiosk.conf
[Seat:*]
autologin-user=kiosk
autologin-user-timeout=0
user-session=openbox
pam-service=lightdm-autologin
pam-autologin-service=lightdm-autologin
EOF

# 6. Salin dan Build Aplikasi Next.js
APP_DIR="/home/$KIOSK_USER/app_boot"
echo "📂 Menyiapkan aplikasi di $APP_DIR..."
sudo mkdir -p "$APP_DIR"
sudo cp -r ./* "$APP_DIR/" 2>/dev/null || true
sudo chown -R "$KIOSK_USER:$KIOSK_USER" "$APP_DIR"

echo "🔨 Membangun (Build) Next.js untuk performa produksi..."
cd "$APP_DIR"
sudo -u "$KIOSK_USER" npm install --production
sudo -u "$KIOSK_USER" npm run build

# 7. Buat Systemd Service Auto-Start Next.js
cat << 'EOF' | sudo tee /etc/systemd/system/nextjs-kiosk.service
[Unit]
Description=Next.js Ubuntu Server Kiosk
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

# 8. Konfigurasi Openbox Autostart (Jalankan Chromium Fullscreen Kiosk)
sudo mkdir -p "/home/$KIOSK_USER/.config/openbox"
cat << 'EOF' | sudo tee "/home/$KIOSK_USER/.config/openbox/autostart"
# Sembunyikan kursor mouse setelah 2 detik tidak digerakkan
unclutter -idle 2 -root &

# Matikan Screensaver dan Sleep Timer
xset -dpms &
xset s off &
xset s noblank &

# Tunggu server Next.js aktif di port 3000
until curl -s http://localhost:3000 > /dev/null; do
    sleep 0.5
done

# Buka Chromium dalam mode Fullscreen Kiosk murni
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

# 9. Aktifkan dan jalankan service
sudo systemctl daemon-reload
sudo systemctl enable lightdm
sudo systemctl enable nextjs-kiosk.service
sudo systemctl restart nextjs-kiosk.service

echo ""
echo "================================================================="
echo "  🎉 SUKSES! UBUNTU SERVER KIOSK BERHASIL DIKONFIGURASI!         "
echo "  Silakan restart sistem: 'sudo reboot'                         "
echo "  Komputer akan langsung membuka aplikasi Next.js Fullscreen!   "
echo "================================================================="
