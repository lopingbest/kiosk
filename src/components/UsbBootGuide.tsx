'use client';

import React, { useState } from 'react';
import { 
  Usb, 
  Terminal, 
  FileCode, 
  CheckCircle, 
  Copy, 
  Check, 
  ExternalLink, 
  Layers, 
  Flame, 
  Monitor, 
  ArrowRight,
  ShieldCheck,
  FolderPlus
} from 'lucide-react';
import { soundFx } from '@/lib/sound';

export default function UsbBootGuide() {
  const [activeTab, setActiveTab] = useState<'steps' | 'scripts' | 'methods'>('steps');
  const [activeScript, setActiveScript] = useState<'setup' | 'systemd' | 'kiosk' | 'grub'>('setup');
  const [copiedScript, setCopiedScript] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    soundFx.playSuccess();
    navigator.clipboard.writeText(text);
    setCopiedScript(id);
    setTimeout(() => setCopiedScript(null), 2000);
  };

  const scripts = {
    setup: `#!/bin/bash
# ==============================================================================
# Script Otomatis: Konfigurasi Ubuntu USB Kiosk Next.js
# Jalankan script ini di dalam Ubuntu Live USB (dengan persistence)
# ==============================================================================

set -e
echo "🚀 [1/5] Memperbarui sistem & menginstal dependensi Kiosk..."
sudo apt update
sudo apt install -y nodejs npm chromium-browser openbox xorg lightdm curl

echo "📦 [2/5] Memastikan user 'kiosk' tersedia & auto-login..."
if ! id -u kiosk >/dev/null 2>&1; then
    sudo useradd -m -s /bin/bash kiosk
    sudo usermod -aG sudo,video,audio,input kiosk
    echo "kiosk:kiosk" | sudo chpasswd
fi

# Setup Auto Login via LightDM atau Getty
sudo mkdir -p /etc/lightdm/lightdm.conf.d
cat << 'EOF' | sudo tee /etc/lightdm/lightdm.conf.d/50-kiosk.conf
[Seat:*]
autologin-user=kiosk
autologin-user-timeout=0
user-session=openbox
EOF

echo "⚙️ [3/5] Memasang file aplikasi Next.js..."
mkdir -p /home/kiosk/app_boot
# Copy file projek ke folder kiosk
sudo cp -r . /home/kiosk/app_boot/
sudo chown -R kiosk:kiosk /home/kiosk/app_boot

echo "🔨 [4/5] Membangun (build) aplikasi Next.js..."
cd /home/kiosk/app_boot
npm install --production
npm run build

echo "🖥️ [5/5] Membuat Systemd Service Auto-Start..."
cat << 'EOF' | sudo tee /etc/systemd/system/nextjs-kiosk.service
[Unit]
Description=Next.js Kiosk Server
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

# Setup Openbox Autostart untuk menjalankan Chromium Kiosk
mkdir -p /home/kiosk/.config/openbox
cat << 'EOF' > /home/kiosk/.config/openbox/autostart
# Matikan Screen Saver & Sleep Mode
xset -dpms &
xset s off &
xset s noblank &

# Tunggu server Next.js siap
until curl -s http://localhost:3000 > /dev/null; do
    sleep 1
done

# Jalankan Chromium Layar Penuh Kiosk
chromium-browser \\
  --kiosk \\
  --noerrdialogs \\
  --disable-infobars \\
  --check-for-update-interval=31536000 \\
  --disable-pinch \\
  --overscroll-history-navigation=0 \\
  --no-first-run \\
  --autoplay-policy=no-user-gesture-required \\
  http://localhost:3000 &
EOF

sudo chown -R kiosk:kiosk /home/kiosk/.config

sudo systemctl daemon-reload
sudo systemctl enable nextjs-kiosk.service
sudo systemctl restart nextjs-kiosk.service

echo "✅ Selesai! Saat USB ini di-boot di komputer mana pun, Next.js akan langsung tayang Fullscreen!"`,

    systemd: `[Unit]
Description=Next.js Kiosk Daemon on USB Boot
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
WantedBy=multi-user.target`,

    kiosk: `#!/bin/bash
# Matikan Screen Dimming / Screensaver
xset -dpms
xset s off
xset s noblank

# Tunggu sampai port 3000 Next.js siap menerima koneksi
while ! nc -z localhost 3000; do   
  sleep 0.5
done

# Luncurkan Chromium Mode Kiosk Penuh
chromium-browser \\
  --kiosk \\
  --noerrdialogs \\
  --disable-infobars \\
  --disable-translate \\
  --disable-features=Translate \\
  --disable-session-crashed-bubble \\
  --no-first-run \\
  --fast \\
  --fast-start \\
  http://localhost:3000`,

    grub: `set default="0"
set timeout=1

menuentry "Ubuntu USB Boot Kiosk (Next.js Auto-Start)" {
    set gfxpayload=keep
    linux   /casper/vmlinuz boot=casper persistent quiet splash nomodeset_off ---
    initrd  /casper/initrd
}`
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Header Navigation */}
      <div className="glass-panel" style={{ padding: '10px 16px', display: 'flex', gap: '8px', borderRadius: '14px', alignSelf: 'flex-start' }}>
        <button
          onClick={() => {
            soundFx.playClick();
            setActiveTab('steps');
          }}
          className={activeTab === 'steps' ? 'btn btn-primary' : 'btn btn-secondary'}
          style={{ fontSize: '13px', padding: '8px 16px' }}
        >
          <Usb size={15} /> 5 Langkah Mudah Setup USB
        </button>
        <button
          onClick={() => {
            soundFx.playClick();
            setActiveTab('scripts');
          }}
          className={activeTab === 'scripts' ? 'btn btn-primary' : 'btn btn-secondary'}
          style={{ fontSize: '13px', padding: '8px 16px' }}
        >
          <FileCode size={15} /> Skrip & Konfigurasi Otomatis
        </button>
        <button
          onClick={() => {
            soundFx.playClick();
            setActiveTab('methods');
          }}
          className={activeTab === 'methods' ? 'btn btn-primary' : 'btn btn-secondary'}
          style={{ fontSize: '13px', padding: '8px 16px' }}
        >
          <Layers size={15} /> 3 Metode Booting USB
        </button>
      </div>

      {/* Tab 1: 5 Langkah Setup */}
      {activeTab === 'steps' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Step 1 */}
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '18px', borderLeft: '4px solid var(--primary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '14px' }}>
                1
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Download ISO Ubuntu & Siapkan Flashdisk</h3>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6', marginLeft: '40px' }}>
              Gunakan Flashdisk USB minimal <b>8 GB atau 16 GB (USB 3.0 disarankan)</b>. Unduh ISO <b>Ubuntu 24.04 LTS Desktop</b> atau <b>Xubuntu Minimal</b> (lebih ringan untuk booting cepat).
            </p>
          </div>

          {/* Step 2 */}
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '18px', borderLeft: '4px solid var(--secondary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--secondary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '14px' }}>
                2
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Flash ke USB dengan Fitur Persistent Partition</h3>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6', marginLeft: '40px' }}>
              Saat membuat USB dengan software <b>Rufus</b> (Windows) atau <b>Ventoy</b> / <b>mkusb</b> (Linux):
              <br />
              👉 Aktifkan opsi <b>Persistent partition size</b> (geser slider ke 4 GB - 10 GB). 
              <br />
              <i>(Fitur Persistence ini wajib agar perubahan tema, data instalasi Node.js, dan Next.js tetap tersimpan permanen di flashdisk saat PC dimatikan).</i>
            </p>
          </div>

          {/* Step 3 */}
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '18px', borderLeft: '4px solid var(--success)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--success)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '14px' }}>
                3
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Salin Folder Aplikasi Next.js ke Flashdisk</h3>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6', marginLeft: '40px' }}>
              Boot komputer Anda ke USB Ubuntu, buka terminal, dan salin seluruh source code projek ini ke folder:
              <br />
              <code style={{ background: 'rgba(0,0,0,0.5)', padding: '4px 10px', borderRadius: '6px', color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
                /home/kiosk/app_boot
              </code>
            </p>
          </div>

          {/* Step 4 */}
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '18px', borderLeft: '4px solid var(--warning)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--warning)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '14px' }}>
                4
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Jalankan Script setup_kiosk.sh</h3>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6', marginLeft: '40px' }}>
              Jalankan perintah berikut di terminal Ubuntu USB:
              <br />
              <code style={{ display: 'block', background: 'rgba(0,0,0,0.5)', padding: '8px 12px', borderRadius: '6px', color: 'var(--primary)', fontFamily: 'var(--font-mono)', marginTop: '6px' }}>
                chmod +x setup_kiosk.sh && sudo ./setup_kiosk.sh
              </code>
              <span style={{ fontSize: '12px', marginTop: '4px', display: 'block' }}>
                Script ini secara otomatis mengonfigurasi Systemd service, auto-login user kiosk, dan autostart browser Chromium Fullscreen mode.
              </span>
            </p>
          </div>

          {/* Step 5 */}
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '18px', borderLeft: '4px solid var(--info)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--info)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '14px' }}>
                5
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Selesai! USB Siap Dipakai di Komputer Mana Saja</h3>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6', marginLeft: '40px' }}>
              Colokkan flashdisk ke PC target apa saja, nyalakan, dan tekan tombol Boot Menu (<b>F12, F8, F11, atau Esc</b>). Komputer akan otomatis boot ke Ubuntu dan langsung membuka aplikasi Next.js ini secara fullscreen dengan tema pilihan Anda!
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: Code & Script Viewer */}
      {activeTab === 'scripts' && (
        <div className="glass-panel" style={{ borderRadius: '18px', padding: '24px' }}>
          {/* Script Sub-tabs */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => {
                  soundFx.playClick();
                  setActiveScript('setup');
                }}
                className={activeScript === 'setup' ? 'btn btn-primary' : 'btn btn-secondary'}
                style={{ fontSize: '12px', padding: '6px 12px' }}
              >
                setup_kiosk.sh
              </button>
              <button
                onClick={() => {
                  soundFx.playClick();
                  setActiveScript('systemd');
                }}
                className={activeScript === 'systemd' ? 'btn btn-primary' : 'btn btn-secondary'}
                style={{ fontSize: '12px', padding: '6px 12px' }}
              >
                nextjs-kiosk.service
              </button>
              <button
                onClick={() => {
                  soundFx.playClick();
                  setActiveScript('kiosk');
                }}
                className={activeScript === 'kiosk' ? 'btn btn-primary' : 'btn btn-secondary'}
                style={{ fontSize: '12px', padding: '6px 12px' }}
              >
                kiosk_autostart.sh
              </button>
              <button
                onClick={() => {
                  soundFx.playClick();
                  setActiveScript('grub');
                }}
                className={activeScript === 'grub' ? 'btn btn-primary' : 'btn btn-secondary'}
                style={{ fontSize: '12px', padding: '6px 12px' }}
              >
                grub.cfg (Silent Boot)
              </button>
            </div>

            <button
              onClick={() => copyToClipboard(scripts[activeScript], activeScript)}
              className="btn btn-primary"
              style={{ fontSize: '12px', padding: '6px 14px' }}
            >
              {copiedScript === activeScript ? (
                <>
                  <Check size={14} /> Tersalin!
                </>
              ) : (
                <>
                  <Copy size={14} /> Salin Skrip
                </>
              )}
            </button>
          </div>

          {/* Script Output Container */}
          <div className="terminal-window" style={{ maxHeight: '420px', overflowY: 'auto', padding: '16px' }}>
            <pre style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)', fontSize: '13px', lineHeight: '1.5' }}>
              {scripts[activeScript]}
            </pre>
          </div>
        </div>
      )}

      {/* Tab 3: 3 Metode Booting */}
      {activeTab === 'methods' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {/* Method 1 */}
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '18px' }}>
            <span className="badge badge-primary font-mono" style={{ marginBottom: '12px', fontSize: '11px' }}>
              METODE 1 (PALING MUDAH & POPULER)
            </span>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>
              Rufus / Ventoy dengan Persistence Ext4
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: '1.5', marginBottom: '16px' }}>
              Cukup colokkan Flashdisk ke laptop, buka software Rufus di Windows, pilih ISO Ubuntu, dan tentukan ukuran Persistent Partition (contoh: 8 GB).
            </p>
            <ul style={{ fontSize: '13px', color: 'var(--text)', display: 'flex', flexDirection: 'column', gap: '6px', paddingLeft: '18px' }}>
              <li>Tidak perlu format ulang jika memakai Ventoy</li>
              <li>Bisa simpan file projek Next.js langsung</li>
              <li>Mendukung UEFI Secure Boot</li>
            </ul>
          </div>

          {/* Method 2 */}
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '18px' }}>
            <span className="badge badge-success font-mono" style={{ marginBottom: '12px', fontSize: '11px' }}>
              METODE 2 (ULTRA-RINGAN & BOOT &lt; 5 DETIK)
            </span>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>
              Ubuntu Server + Openbox Window Manager
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: '1.5', marginBottom: '16px' }}>
              Gunakan Ubuntu Server Minimal tanpa desktop GNOME yang berat. Tampilkan Chromium langsung di atas X11 / Openbox.
            </p>
            <ul style={{ fontSize: '13px', color: 'var(--text)', display: 'flex', flexDirection: 'column', gap: '6px', paddingLeft: '18px' }}>
              <li>Penggunaan RAM hanya ~350 MB</li>
              <li>Booting sangat instan ke halaman Next.js</li>
              <li>Cocok untuk Mini PC / Kiosk Display / POS</li>
            </ul>
          </div>

          {/* Method 3 */}
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '18px' }}>
            <span className="badge badge-warning font-mono" style={{ marginBottom: '12px', fontSize: '11px' }}>
              METODE 3 (FULL KIOSK STANDALONE)
            </span>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>
              Ubuntu Full Install ke Flashdisk
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: '1.5', marginBottom: '16px' }}>
              Lakukan instalasi lengkap Ubuntu seperti menginstal ke SSD/Harddisk, namun arahkan target disk instalasi ke Flashdisk USB Anda.
            </p>
            <ul style={{ fontSize: '13px', color: 'var(--text)', display: 'flex', flexDirection: 'column', gap: '6px', paddingLeft: '18px' }}>
              <li>Kapasitas penyimpanan 100% penuh</li>
              <li>Bisa pasang driver khusus Nvidia / AMD / Audio</li>
              <li>Performa read-write stabil</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
