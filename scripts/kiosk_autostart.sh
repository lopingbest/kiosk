#!/bin/bash
# ==============================================================================
# Script Launcher Kiosk: Chromium Fullscreen Kiosk Mode
# ==============================================================================

# Nonaktifkan power saving, DPMS, dan blank screen
xset -dpms
xset s off
xset s noblank

# Sembunyikan kursor setelah 2 detik tidak aktif
which unclutter >/dev/null 2>&1 && unclutter -idle 2 -root &

# Loop tunggu server Next.js localhost:3000
echo "Menunggu server Next.js berjalan di port 3000..."
while ! curl -s http://localhost:3000 > /dev/null; do
    sleep 0.5
done

# Luncurkan Chromium Kiosk
chromium-browser \
  --kiosk \
  --noerrdialogs \
  --disable-infobars \
  --disable-translate \
  --disable-features=Translate \
  --disable-session-crashed-bubble \
  --no-first-run \
  --fast \
  --fast-start \
  --autoplay-policy=no-user-gesture-required \
  --overscroll-history-navigation=0 \
  --disable-pinch \
  http://localhost:3000
