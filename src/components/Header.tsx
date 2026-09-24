'use client';

import React, { useState, useEffect } from 'react';
import { 
  Maximize, 
  Minimize, 
  Volume2, 
  VolumeX, 
  Palette, 
  Power, 
  Cpu, 
  HardDrive, 
  Wifi, 
  WifiOff, 
  Clock, 
  ShieldCheck,
  Usb
} from 'lucide-react';
import { THEMES, ThemeConfig } from '@/lib/themes';
import { soundFx } from '@/lib/sound';

interface HeaderProps {
  currentTheme: ThemeConfig;
  onSelectTheme: (theme: ThemeConfig) => void;
  onOpenThemeModal: () => void;
  onOpenPowerModal: () => void;
  cpuPercent?: number;
  ramPercent?: number;
}

export default function Header({
  currentTheme,
  onSelectTheme,
  onOpenThemeModal,
  onOpenPowerModal,
  cpuPercent = 24,
  ramPercent = 42,
}: HeaderProps) {
  const [time, setTime] = useState<string>('');
  const [dateStr, setDateStr] = useState<string>('');
  const [uptime, setUptime] = useState<number>(142); // Seconds counter
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [showThemeDropdown, setShowThemeDropdown] = useState<boolean>(false);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour12: false }));
      setDateStr(now.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }));
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    const uptimeTimer = setInterval(() => setUptime((prev) => prev + 1), 1000);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      clearInterval(timer);
      clearInterval(uptimeTimer);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const formatUptime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleFullscreen = () => {
    soundFx.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundFx.enabled = next;
    if (next) soundFx.playSuccess();
  };

  return (
    <header className="glass-panel" style={{ margin: '16px 24px 0 24px', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', position: 'sticky', top: '16px', zIndex: 40 }}>
      {/* Brand & Boot Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 0 16px ${currentTheme.colors.primaryGlow}`,
          color: '#000',
          fontWeight: 900,
          fontSize: '18px',
          flexShrink: 0
        }}>
          <Usb size={22} color="#000" strokeWidth={2.5} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: 800, fontSize: '18px', letterSpacing: '-0.02em' }}>UBUNTU BOOT KIOSK</span>
            <span className="badge badge-primary font-mono" style={{ fontSize: '10px', padding: '2px 8px' }}>
              <span className="status-dot status-dot-pulse" style={{ backgroundColor: currentTheme.colors.primary }} />
              LIVE USB v2.4
            </span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '12px', marginTop: '2px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={12} /> Uptime: <span className="font-mono" style={{ color: 'var(--text)' }}>{formatUptime(uptime)}</span>
            </span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ShieldCheck size={12} color={currentTheme.colors.success} /> Persistence: <b style={{ color: currentTheme.colors.success }}>EXT4 RW</b>
            </span>
          </div>
        </div>
      </div>

      {/* Middle System Mini Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* CPU Usage */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.04)', padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
          <Cpu size={15} color={currentTheme.colors.primary} />
          <div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>CPU LOAD</div>
            <div className="font-mono" style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)' }}>{cpuPercent}%</div>
          </div>
          <div style={{ width: '38px', height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', overflow: 'hidden', marginLeft: '4px' }}>
            <div style={{ width: `${cpuPercent}%`, height: '100%', backgroundColor: cpuPercent > 80 ? 'var(--danger)' : currentTheme.colors.primary, transition: 'width 0.3s ease' }} />
          </div>
        </div>

        {/* RAM Usage */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.04)', padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
          <HardDrive size={15} color={currentTheme.colors.secondary} />
          <div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>RAM USAGE</div>
            <div className="font-mono" style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)' }}>{ramPercent}%</div>
          </div>
          <div style={{ width: '38px', height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', overflow: 'hidden', marginLeft: '4px' }}>
            <div style={{ width: `${ramPercent}%`, height: '100%', backgroundColor: ramPercent > 85 ? 'var(--danger)' : currentTheme.colors.secondary, transition: 'width 0.3s ease' }} />
          </div>
        </div>

        {/* Network status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255, 255, 255, 0.04)', padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
          {isOnline ? (
            <>
              <Wifi size={15} color={currentTheme.colors.success} />
              <span style={{ fontSize: '12px', fontWeight: 600, color: currentTheme.colors.success }}>Online</span>
            </>
          ) : (
            <>
              <WifiOff size={15} color={currentTheme.colors.danger} />
              <span style={{ fontSize: '12px', fontWeight: 600, color: currentTheme.colors.danger }}>Offline</span>
            </>
          )}
        </div>

        {/* Big Clock */}
        <div style={{ textAlign: 'right', minWidth: '100px' }}>
          <div className="font-mono" style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text)', letterSpacing: '0.04em' }}>
            {time || '00:00:00'}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            {dateStr || 'Booting...'}
          </div>
        </div>
      </div>

      {/* Control Actions & Theme Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }}>
        {/* Quick Theme Switcher Button */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => {
              soundFx.playClick();
              setShowThemeDropdown(!showThemeDropdown);
            }}
            className="btn btn-secondary"
            style={{ padding: '8px 14px', gap: '10px' }}
            title="Ganti Tema (Switch Theme)"
          >
            <div style={{
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              backgroundColor: currentTheme.colors.primary,
              boxShadow: `0 0 8px ${currentTheme.colors.primaryGlow}`
            }} />
            <span style={{ fontWeight: 600 }}>{currentTheme.name}</span>
            <Palette size={15} color={currentTheme.colors.primary} />
          </button>

          {/* Quick Theme Dropdown */}
          {showThemeDropdown && (
            <div 
              className="glass-panel" 
              style={{
                position: 'absolute',
                top: '120%',
                right: 0,
                width: '240px',
                padding: '8px',
                zIndex: 100,
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                boxShadow: '0 12px 36px rgba(0,0,0,0.6)'
              }}
            >
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', padding: '6px 8px', textTransform: 'uppercase' }}>
                Pilih Tema Kiosk (8 Tema)
              </div>
              {THEMES.map((theme) => {
                const isSelected = theme.id === currentTheme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => {
                      onSelectTheme(theme);
                      setShowThemeDropdown(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: isSelected ? `1px solid ${theme.colors.borderHighlight}` : '1px solid transparent',
                      background: isSelected ? 'var(--surface-active)' : 'transparent',
                      color: 'var(--text)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.background = 'var(--surface-hover)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: theme.colors.primary,
                        boxShadow: isSelected ? `0 0 8px ${theme.colors.primaryGlow}` : 'none'
                      }} />
                      <span style={{ fontSize: '13px', fontWeight: isSelected ? 700 : 500 }}>
                        {theme.name}
                      </span>
                    </div>
                    {isSelected && (
                      <span className="font-mono" style={{ fontSize: '10px', color: theme.colors.primary }}>ACTIVE</span>
                    )}
                  </button>
                );
              })}
              <div style={{ borderTop: '1px solid var(--border)', marginTop: '4px', paddingTop: '6px' }}>
                <button
                  onClick={() => {
                    setShowThemeDropdown(false);
                    onOpenThemeModal();
                  }}
                  className="btn btn-secondary"
                  style={{ width: '100%', fontSize: '12px', padding: '6px 10px' }}
                >
                  <Palette size={13} /> Buka Studio Tema Lengkap
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sound toggle */}
        <button
          onClick={toggleSound}
          className="btn btn-secondary btn-icon"
          title={soundEnabled ? 'Matikan Suara FX' : 'Aktifkan Suara FX'}
        >
          {soundEnabled ? <Volume2 size={18} color={currentTheme.colors.primary} /> : <VolumeX size={18} color="var(--text-muted)" />}
        </button>

        {/* Fullscreen toggle */}
        <button
          onClick={toggleFullscreen}
          className="btn btn-secondary btn-icon"
          title={isFullscreen ? 'Keluar Fullscreen' : 'Masuk Mode Kiosk Layar Penuh (F11)'}
        >
          {isFullscreen ? <Minimize size={18} color={currentTheme.colors.primary} /> : <Maximize size={18} color="var(--text)" />}
        </button>

        {/* Power / Reboot Modal trigger */}
        <button
          onClick={() => {
            soundFx.playClick();
            onOpenPowerModal();
          }}
          className="btn btn-danger btn-icon"
          title="Matikan / Restart Sistem USB Kiosk"
        >
          <Power size={18} />
        </button>
      </div>
    </header>
  );
}
