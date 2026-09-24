'use client';

import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  HardDrive, 
  Layers, 
  Terminal, 
  Activity, 
  CheckCircle, 
  AlertTriangle, 
  Server, 
  Monitor, 
  FileText, 
  Wifi, 
  Play, 
  RefreshCw,
  Usb,
  Shield,
  Zap,
  Radio
} from 'lucide-react';
import { soundFx } from '@/lib/sound';

interface SystemOverviewProps {
  onNavigateTab: (tab: string) => void;
  cpuPercent: number;
  ramPercent: number;
}

interface BootLogEntry {
  id: string;
  time: string;
  service: string;
  level: 'info' | 'ok' | 'warn';
  message: string;
}

export default function SystemOverview({ onNavigateTab, cpuPercent, ramPercent }: SystemOverviewProps) {
  const [logs, setLogs] = useState<BootLogEntry[]>([
    { id: '1', time: '0.000000', service: 'kernel', level: 'info', message: 'Linux version 6.8.0-generic (buildd@lcy02-amd64-077)' },
    { id: '2', time: '0.142010', service: 'systemd[1]', level: 'info', message: 'Mounted /sys/kernel/security and cgroups hierarchy.' },
    { id: '3', time: '0.489102', service: 'udevd', level: 'ok', message: 'Detected Bootable USB Device (SanDisk Ultra 32GB 3.0).' },
    { id: '4', time: '0.812390', service: 'overlayfs', level: 'ok', message: 'Mounted persistent overlay /media/usb-live/casper-rw.' },
    { id: '5', time: '1.240182', service: 'networkd', level: 'info', message: 'DHCP lease acquired: 192.168.1.104/24 on eth0.' },
    { id: '6', time: '1.580211', service: 'nextjs-kiosk.service', level: 'ok', message: 'Started Next.js Kiosk Server at http://localhost:3000.' },
    { id: '7', time: '1.890450', service: 'chromium-kiosk', level: 'ok', message: 'Launched Chromium in fullscreen kiosk mode on display :0.' },
  ]);

  const [activeTabSub, setActiveTabSub] = useState<'specs' | 'logs' | 'health'>('specs');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  useEffect(() => {
    // Add periodic live status heartbeats
    const interval = setInterval(() => {
      const now = (performance.now() / 1000).toFixed(6);
      const randomHeartbeats = [
        { service: 'kiosk-agent', message: `Heartbeat ping OK. Heap usage: 48.2MB, Memory stable.` },
        { service: 'kernel', message: `USB persistence write flush complete (0 errors).` },
        { service: 'xorg-server', message: `Frame sync: 60.0 FPS. No dropped frames.` },
      ];
      const randomChoice = randomHeartbeats[Math.floor(Math.random() * randomHeartbeats.length)];
      setLogs((prev) => [
        ...prev.slice(-14),
        {
          id: Math.random().toString(),
          time: now,
          service: randomChoice.service,
          level: 'info',
          message: randomChoice.message,
        },
      ]);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    soundFx.playClick();
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      soundFx.playSuccess();
    }, 600);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner: Status & Quick Metric Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '16px'
      }}>
        {/* Card 1: Boot Medium */}
        <div className="glass-panel glass-panel-hover" style={{ padding: '20px', borderRadius: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Media Boot
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(0, 240, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Usb size={18} color="var(--primary)" />
            </div>
          </div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text)', marginBottom: '4px' }}>
            USB 3.2 Live Boot
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="status-dot status-dot-pulse" style={{ backgroundColor: 'var(--success)' }} />
            <span>Persistent Overlay Active (rw)</span>
          </div>
        </div>

        {/* Card 2: CPU Processor */}
        <div className="glass-panel glass-panel-hover" style={{ padding: '20px', borderRadius: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Beban Prosesor (CPU)
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Cpu size={18} color="var(--success)" />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '4px' }}>
            <span className="font-mono" style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text)' }}>
              {cpuPercent}%
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>4 Cores / 8 Threads</span>
          </div>
          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${cpuPercent}%`, backgroundColor: 'var(--success)' }} />
          </div>
        </div>

        {/* Card 3: RAM Usage */}
        <div className="glass-panel glass-panel-hover" style={{ padding: '20px', borderRadius: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Memori RAM
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(236, 72, 153, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Activity size={18} color="var(--secondary)" />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '4px' }}>
            <span className="font-mono" style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text)' }}>
              {ramPercent}%
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>3.4 GB / 8.0 GB</span>
          </div>
          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${ramPercent}%` }} />
          </div>
        </div>

        {/* Card 4: Kiosk Security & Mode */}
        <div className="glass-panel glass-panel-hover" style={{ padding: '20px', borderRadius: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Status Kiosk
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={18} color="var(--warning)" />
            </div>
          </div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text)', marginBottom: '4px' }}>
            Lockdown Standby
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Auto-Restart on Crash • Screen Keep-Alive
          </div>
        </div>
      </div>

      {/* Quick Launch Actions Matrix */}
      <div>
        <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Zap size={16} color="var(--primary)" />
          <span>Akses Cepat Modul Kiosk</span>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px'
        }}>
          <button
            onClick={() => {
              soundFx.playClick();
              onNavigateTab('terminal');
            }}
            className="glass-panel glass-panel-hover"
            style={{
              padding: '16px',
              borderRadius: '14px',
              textAlign: 'left',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: 'var(--text)',
              border: '1px solid var(--border)'
            }}
          >
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(34, 197, 94, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Terminal size={20} color="var(--primary)" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '14px' }}>Terminal Sandbox</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Jalankan CLI & Perintah</div>
            </div>
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              onNavigateTab('tester');
            }}
            className="glass-panel glass-panel-hover"
            style={{
              padding: '16px',
              borderRadius: '14px',
              textAlign: 'left',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: 'var(--text)',
              border: '1px solid var(--border)'
            }}
          >
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(0, 240, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Monitor size={20} color="var(--primary)" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '14px' }}>Uji Hardware & Layar</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Dead pixel, Audio, Keyboard</div>
            </div>
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              onNavigateTab('storage');
            }}
            className="glass-panel glass-panel-hover"
            style={{
              padding: '16px',
              borderRadius: '14px',
              textAlign: 'left',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: 'var(--text)',
              border: '1px solid var(--border)'
            }}
          >
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <HardDrive size={20} color="var(--warning)" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '14px' }}>Explorer USB Storage</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Partisi & File System</div>
            </div>
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              onNavigateTab('network');
            }}
            className="glass-panel glass-panel-hover"
            style={{
              padding: '16px',
              borderRadius: '14px',
              textAlign: 'left',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: 'var(--text)',
              border: '1px solid var(--border)'
            }}
          >
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(129, 140, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Wifi size={20} color="var(--info)" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '14px' }}>Diagnostik Jaringan</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Ping, Latency, Speedtest</div>
            </div>
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              onNavigateTab('guide');
            }}
            className="glass-panel glass-panel-hover"
            style={{
              padding: '16px',
              borderRadius: '14px',
              textAlign: 'left',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: 'var(--text)',
              border: '1px solid var(--border)'
            }}
          >
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(236, 72, 153, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <FileText size={20} color="var(--secondary)" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '14px' }}>Panduan Boot USB</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Script & Cara Install ke Flashdisk</div>
            </div>
          </button>
        </div>
      </div>

      {/* Main Specs Table & Live Boot Log Tabs */}
      <div className="glass-panel" style={{ borderRadius: '18px', padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '16px', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => {
                soundFx.playClick();
                setActiveTabSub('specs');
              }}
              className={activeTabSub === 'specs' ? 'btn btn-primary' : 'btn btn-secondary'}
              style={{ fontSize: '13px', padding: '8px 16px' }}
            >
              <Server size={15} /> Spesifikasi Sistem Ubuntu
            </button>
            <button
              onClick={() => {
                soundFx.playClick();
                setActiveTabSub('logs');
              }}
              className={activeTabSub === 'logs' ? 'btn btn-primary' : 'btn btn-secondary'}
              style={{ fontSize: '13px', padding: '8px 16px' }}
            >
              <Radio size={15} /> Log Boot & Systemd ({logs.length})
            </button>
          </div>

          <button
            onClick={handleRefresh}
            className="btn btn-secondary"
            style={{ fontSize: '12px', padding: '6px 12px' }}
            disabled={isRefreshing}
          >
            <RefreshCw size={14} className={isRefreshing ? 'spin' : ''} />
            <span>{isRefreshing ? 'Memperbarui...' : 'Segarkan Data'}</span>
          </button>
        </div>

        {activeTabSub === 'specs' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Sistem Operasi</span>
                <span style={{ fontWeight: 700, fontSize: '13px' }}>Ubuntu 24.04.1 LTS (Noble Numbat)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Linux Kernel</span>
                <span className="font-mono" style={{ fontWeight: 700, fontSize: '13px', color: 'var(--primary)' }}>6.8.0-45-generic (x86_64)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Mode Boot</span>
                <span className="badge badge-success" style={{ fontSize: '11px' }}>UEFI Bootloader (GRUB2)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Kiosk Web Engine</span>
                <span style={{ fontWeight: 700, fontSize: '13px' }}>Next.js 14 Standalone / Chromium Kiosk</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Display Server</span>
                <span style={{ fontWeight: 700, fontSize: '13px' }}>X11 Server (:0) / Cage Wayland</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Resolusi Layar</span>
                <span className="font-mono" style={{ fontWeight: 700, fontSize: '13px' }}>1920 x 1080 @ 60Hz (Full HD)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Auto-Login User</span>
                <span className="font-mono" style={{ fontWeight: 700, fontSize: '13px', color: 'var(--secondary)' }}>kiosk (nopasswd)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Penyimpanan USB</span>
                <span className="font-mono" style={{ fontWeight: 700, fontSize: '13px' }}>SanDisk 32GB (casper-rw persistent)</span>
              </div>
            </div>
          </div>
        )}

        {activeTabSub === 'logs' && (
          <div className="terminal-window" style={{ maxHeight: '320px', overflowY: 'auto', padding: '14px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {logs.map((log) => (
                <div key={log.id} style={{ fontSize: '12px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--text-subtle)', flexShrink: 0 }}>[{log.time}]</span>
                  <span style={{ color: log.service.includes('systemd') ? 'var(--primary)' : 'var(--secondary)', fontWeight: 600, flexShrink: 0, minWidth: '130px' }}>
                    {log.service}:
                  </span>
                  <span style={{ color: log.level === 'ok' ? 'var(--success)' : 'var(--text)' }}>
                    {log.message}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
