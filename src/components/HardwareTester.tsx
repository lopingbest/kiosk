'use client';

import React, { useState, useEffect } from 'react';
import { 
  Monitor, 
  Volume2, 
  Keyboard, 
  Eye, 
  CheckCircle2, 
  Sparkles, 
  Maximize2,
  Play,
  Square,
  RefreshCw
} from 'lucide-react';
import { soundFx } from '@/lib/sound';

export default function HardwareTester() {
  const [activeTab, setActiveTab] = useState<'screen' | 'audio' | 'keyboard'>('screen');
  const [fullscreenColor, setFullscreenColor] = useState<string | null>(null);
  const [pressedKeys, setPressedKeys] = useState<{ key: string; code: string; time: string }[]>([]);
  const [screenInfo, setScreenInfo] = useState<{ width: number; height: number; dpr: number; colorDepth: number }>({
    width: 1920,
    height: 1080,
    dpr: 1,
    colorDepth: 24,
  });

  const [isPlayingTone, setIsPlayingTone] = useState<boolean>(false);
  const [audioOsc, setAudioOsc] = useState<OscillatorNode | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setScreenInfo({
        width: window.screen.width,
        height: window.screen.height,
        dpr: window.devicePixelRatio || 1,
        colorDepth: window.screen.colorDepth || 24,
      });

      const handleKey = (e: KeyboardEvent) => {
        if (activeTab === 'keyboard') {
          soundFx.playBeep(400 + Math.random() * 200, 0.03);
          setPressedKeys((prev) => [
            { key: e.key, code: e.code, time: new Date().toLocaleTimeString() },
            ...prev.slice(0, 15),
          ]);
        }
      };

      window.addEventListener('keydown', handleKey);
      return () => window.removeEventListener('keydown', handleKey);
    }
  }, [activeTab]);

  const testColors = [
    { name: 'Pure Red', hex: '#ff0000' },
    { name: 'Pure Green', hex: '#00ff00' },
    { name: 'Pure Blue', hex: '#0000ff' },
    { name: 'Solid White', hex: '#ffffff' },
    { name: 'True Black (OLED)', hex: '#000000' },
    { name: 'Cyan', hex: '#00ffff' },
    { name: 'Magenta', hex: '#ff00ff' },
    { name: 'Yellow', hex: '#ffff00' },
  ];

  const playTone = (freq: number) => {
    soundFx.playBeep(freq, 0.5);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Sub Tabs */}
      <div className="glass-panel" style={{ padding: '8px', display: 'flex', gap: '8px', borderRadius: '14px', alignSelf: 'flex-start' }}>
        <button
          onClick={() => {
            soundFx.playClick();
            setActiveTab('screen');
          }}
          className={activeTab === 'screen' ? 'btn btn-primary' : 'btn btn-secondary'}
          style={{ fontSize: '13px', padding: '8px 16px' }}
        >
          <Monitor size={15} /> Layar & Dead Pixel
        </button>
        <button
          onClick={() => {
            soundFx.playClick();
            setActiveTab('audio');
          }}
          className={activeTab === 'audio' ? 'btn btn-primary' : 'btn btn-secondary'}
          style={{ fontSize: '13px', padding: '8px 16px' }}
        >
          <Volume2 size={15} /> Speaker & Audio
        </button>
        <button
          onClick={() => {
            soundFx.playClick();
            setActiveTab('keyboard');
          }}
          className={activeTab === 'keyboard' ? 'btn btn-primary' : 'btn btn-secondary'}
          style={{ fontSize: '13px', padding: '8px 16px' }}
        >
          <Keyboard size={15} /> Uji Tombol Keyboard
        </button>
      </div>

      {/* Screen Tester */}
      {activeTab === 'screen' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '18px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>
              Uji Kalibrasi Warna & Deteksi Dead Pixel
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '20px' }}>
              Klik salah satu warna di bawah untuk membuka layar penuh (Fullscreen). Periksa apakah terdapat bintik mati (dead/stuck pixel) pada monitor komputer. Tekan ESC atau klik untuk keluar.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', marginBottom: '24px' }}>
              {testColors.map((c) => (
                <button
                  key={c.hex}
                  onClick={() => {
                    soundFx.playClick();
                    setFullscreenColor(c.hex);
                  }}
                  style={{
                    backgroundColor: c.hex,
                    height: '75px',
                    borderRadius: '12px',
                    border: '2px solid rgba(255,255,255,0.25)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: c.hex === '#ffffff' || c.hex === '#00ffff' || c.hex === '#ffff00' ? '#000' : '#fff',
                    fontWeight: 700,
                    fontSize: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    transition: 'transform 0.15s ease'
                  }}
                >
                  <Maximize2 size={14} style={{ marginBottom: '4px' }} />
                  {c.name}
                </button>
              ))}
            </div>

            {/* Display Specs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
              <div style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>RESOLUSI SCREEN</div>
                <div className="font-mono" style={{ fontSize: '16px', fontWeight: 700, color: 'var(--primary)' }}>
                  {screenInfo.width} × {screenInfo.height} px
                </div>
              </div>
              <div style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>DEVICE PIXEL RATIO</div>
                <div className="font-mono" style={{ fontSize: '16px', fontWeight: 700, color: 'var(--secondary)' }}>
                  {screenInfo.dpr}x (Scale)
                </div>
              </div>
              <div style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>KEDALAMAN WARNA</div>
                <div className="font-mono" style={{ fontSize: '16px', fontWeight: 700, color: 'var(--success)' }}>
                  {screenInfo.colorDepth}-bit True Color
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Audio Tester */}
      {activeTab === 'audio' && (
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '18px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>
            Uji Frekuensi Speaker & Output Suara
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '20px' }}>
            Uji driver audio ALSA / PulseAudio Ubuntu Live USB dengan membunyikan nada frekuensi sintetis murni.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <button
              onClick={() => playTone(60)}
              className="glass-panel glass-panel-hover"
              style={{ padding: '16px', borderRadius: '12px', cursor: 'pointer', textAlign: 'center', color: 'var(--text)' }}
            >
              <Volume2 size={24} color="var(--primary)" style={{ margin: '0 auto 8px' }} />
              <div style={{ fontWeight: 700, fontSize: '15px' }}>Bass Subwoofer</div>
              <div className="font-mono" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>60 Hz Sine Tone</div>
            </button>

            <button
              onClick={() => playTone(440)}
              className="glass-panel glass-panel-hover"
              style={{ padding: '16px', borderRadius: '12px', cursor: 'pointer', textAlign: 'center', color: 'var(--text)' }}
            >
              <Volume2 size={24} color="var(--secondary)" style={{ margin: '0 auto 8px' }} />
              <div style={{ fontWeight: 700, fontSize: '15px' }}>Concert Pitch A4</div>
              <div className="font-mono" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>440 Hz Standard</div>
            </button>

            <button
              onClick={() => playTone(1000)}
              className="glass-panel glass-panel-hover"
              style={{ padding: '16px', borderRadius: '12px', cursor: 'pointer', textAlign: 'center', color: 'var(--text)' }}
            >
              <Volume2 size={24} color="var(--success)" style={{ margin: '0 auto 8px' }} />
              <div style={{ fontWeight: 700, fontSize: '15px' }}>Midrange Beep</div>
              <div className="font-mono" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>1000 Hz Calibration</div>
            </button>

            <button
              onClick={() => playTone(5000)}
              className="glass-panel glass-panel-hover"
              style={{ padding: '16px', borderRadius: '12px', cursor: 'pointer', textAlign: 'center', color: 'var(--text)' }}
            >
              <Volume2 size={24} color="var(--warning)" style={{ margin: '0 auto 8px' }} />
              <div style={{ fontWeight: 700, fontSize: '15px' }}>Treble Tweeter</div>
              <div className="font-mono" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>5000 Hz High-End</div>
            </button>
          </div>
        </div>
      )}

      {/* Keyboard Tester */}
      {activeTab === 'keyboard' && (
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Uji Tombol Input Keyboard</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
                Tekan tombol apa saja pada keyboard fisik Anda untuk memverifikasi fungsionalitas input.
              </p>
            </div>
            <button
              onClick={() => setPressedKeys([])}
              className="btn btn-secondary"
              style={{ fontSize: '12px' }}
            >
              <RefreshCw size={13} /> Bersihkan Riwayat
            </button>
          </div>

          <div style={{ minHeight: '180px', background: 'rgba(0,0,0,0.4)', borderRadius: '12px', padding: '16px', border: '1px solid var(--border)' }}>
            {pressedKeys.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px 0', fontSize: '14px' }}>
                Belum ada tombol ditekan. Silakan tekan sembarang tombol di keyboard...
              </div>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {pressedKeys.map((k, i) => (
                  <div
                    key={i}
                    style={{
                      background: i === 0 ? 'var(--primary)' : 'var(--surface-active)',
                      color: i === 0 ? '#000' : 'var(--text)',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontFamily: 'var(--font-mono)',
                      fontSize: '14px',
                      boxShadow: i === 0 ? '0 0 16px var(--primary-glow)' : 'none',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {k.key === ' ' ? 'Space' : k.key} <span style={{ fontSize: '10px', opacity: 0.8 }}>({k.code})</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Fullscreen Dead Pixel Mode */}
      {fullscreenColor && (
        <div
          onClick={() => setFullscreenColor(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: fullscreenColor,
            zIndex: 9999,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            padding: '40px',
          }}
        >
          <div
            style={{
              backgroundColor: 'rgba(0,0,0,0.75)',
              color: '#fff',
              padding: '10px 20px',
              borderRadius: '999px',
              fontSize: '13px',
              fontWeight: 600,
              boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
            }}
          >
            Klik di mana saja untuk keluar dari mode dead pixel test
          </div>
        </div>
      )}
    </div>
  );
}
