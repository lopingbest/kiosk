'use client';

import React, { useState, useEffect } from 'react';
import { 
  Wifi, 
  Activity, 
  Globe, 
  ArrowDown, 
  ArrowUp, 
  Play, 
  RefreshCw, 
  CheckCircle2,
  ShieldAlert
} from 'lucide-react';
import { soundFx } from '@/lib/sound';

export default function NetworkHub() {
  const [latency, setLatency] = useState<number>(14);
  const [history, setHistory] = useState<number[]>([14, 15, 13, 16, 14, 12, 15, 14, 13, 17, 14, 15]);
  const [isTestingSpeed, setIsTestingSpeed] = useState<boolean>(false);
  const [speedResults, setSpeedResults] = useState<{ download: number; upload: number; jitter: number }>({
    download: 94.2,
    upload: 48.6,
    jitter: 1.2,
  });

  useEffect(() => {
    const pingTimer = setInterval(() => {
      const nextPing = Math.floor(12 + Math.random() * 6);
      setLatency(nextPing);
      setHistory((prev) => [...prev.slice(-15), nextPing]);
    }, 2500);

    return () => clearInterval(pingTimer);
  }, []);

  const runSpeedTest = () => {
    soundFx.playClick();
    setIsTestingSpeed(true);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setSpeedResults({
        download: parseFloat((50 + Math.random() * 60).toFixed(1)),
        upload: parseFloat((20 + Math.random() * 35).toFixed(1)),
        jitter: parseFloat((0.8 + Math.random() * 1.5).toFixed(1)),
      });
      if (step >= 8) {
        clearInterval(interval);
        setIsTestingSpeed(false);
        soundFx.playSuccess();
      }
    }, 300);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Cards: Latency & Speed Status */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
        <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>PING LATENCY</span>
            <Activity size={18} color="var(--primary)" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}>
            <span className="font-mono" style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text)' }}>
              {latency}
            </span>
            <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>ms</span>
            <span className="badge badge-success" style={{ fontSize: '10px', marginLeft: 'auto' }}>Sangat Bagus</span>
          </div>

          {/* Mini latency sparkline */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '36px', paddingTop: '8px' }}>
            {history.map((val, idx) => {
              const heightPct = Math.min(100, Math.max(20, (val / 30) * 100));
              return (
                <div
                  key={idx}
                  style={{
                    flex: 1,
                    height: `${heightPct}%`,
                    backgroundColor: 'var(--primary)',
                    borderRadius: '2px',
                    opacity: 0.3 + (idx / history.length) * 0.7,
                    transition: 'all 0.3s ease'
                  }}
                />
              );
            })}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>SPEED TEST KIOSK</span>
            <button
              onClick={runSpeedTest}
              disabled={isTestingSpeed}
              className="btn btn-primary"
              style={{ padding: '4px 12px', fontSize: '11px' }}
            >
              {isTestingSpeed ? <RefreshCw size={12} className="spin" /> : <Play size={12} />}
              <span>{isTestingSpeed ? 'Menguji...' : 'Uji Sekarang'}</span>
            </button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px' }}>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ArrowDown size={13} color="var(--success)" /> DOWNLOAD
              </div>
              <div className="font-mono" style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text)' }}>
                {speedResults.download} <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-muted)' }}>Mbps</span>
              </div>
            </div>
            <div style={{ width: '1px', height: '36px', background: 'var(--border)' }} />
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ArrowUp size={13} color="var(--secondary)" /> UPLOAD
              </div>
              <div className="font-mono" style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text)' }}>
                {speedResults.upload} <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-muted)' }}>Mbps</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Network Interface & DNS Details */}
      <div className="glass-panel" style={{ borderRadius: '18px', padding: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Globe size={18} color="var(--primary)" />
          <span>Konfigurasi Jaringan Ubuntu Kiosk</span>
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          <div style={{ padding: '14px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>INTERFACE UTAMA</div>
            <div className="font-mono" style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text)', marginTop: '2px' }}>
              eth0 (Gigabit Ethernet)
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-subtle)', marginTop: '4px' }}>
              MAC: 52:54:00:12:34:56 • Status: UP/LOWER_UP
            </div>
          </div>

          <div style={{ padding: '14px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>ALAMAT IP LOKAL (DHCP)</div>
            <div className="font-mono" style={{ fontSize: '15px', fontWeight: 700, color: 'var(--primary)', marginTop: '2px' }}>
              192.168.1.104 / 24
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-subtle)', marginTop: '4px' }}>
              Gateway: 192.168.1.1
            </div>
          </div>

          <div style={{ padding: '14px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>RESOLVER DNS</div>
            <div className="font-mono" style={{ fontSize: '15px', fontWeight: 700, color: 'var(--secondary)', marginTop: '2px' }}>
              1.1.1.1 (Cloudflare) / 8.8.8.8 (Google)
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-subtle)', marginTop: '4px' }}>
              DNSSEC Validated
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
