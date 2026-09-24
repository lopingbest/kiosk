'use client';

import React from 'react';
import { THEMES, ThemeConfig } from '@/lib/themes';
import { soundFx } from '@/lib/sound';
import { Check, Sparkles, Sliders, Moon, Sun, Terminal, Shield, RefreshCw, X } from 'lucide-react';

interface ThemeSelectorProps {
  currentTheme: ThemeConfig;
  onSelectTheme: (theme: ThemeConfig) => void;
  isModal?: boolean;
  onCloseModal?: () => void;
}

export default function ThemeSelector({
  currentTheme,
  onSelectTheme,
  isModal = false,
  onCloseModal,
}: ThemeSelectorProps) {
  const handleSelect = (theme: ThemeConfig) => {
    soundFx.playThemeSwitch();
    onSelectTheme(theme);
  };

  const content = (
    <div>
      {/* Studio Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 800 }}>Studio Tema Kiosk & Tampilan</h2>
            <span className="badge badge-primary font-mono" style={{ fontSize: '11px' }}>
              <Sparkles size={13} /> 8 Tema Tersedia
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
            Pilih visual tema untuk booting USB Ubuntu Kiosk Anda. Tema tersimpan permanen di persistence storage.
          </p>
        </div>

        {isModal && onCloseModal && (
          <button onClick={onCloseModal} className="btn btn-secondary btn-icon">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Grid of 8 Themes */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '16px',
        marginBottom: '28px'
      }}>
        {THEMES.map((theme) => {
          const isSelected = theme.id === currentTheme.id;
          return (
            <div
              key={theme.id}
              onClick={() => handleSelect(theme)}
              className="glass-panel glass-card-interactive"
              style={{
                padding: '18px',
                borderRadius: '16px',
                border: isSelected ? `2px solid ${theme.colors.borderHighlight}` : '1px solid var(--border)',
                boxShadow: isSelected ? `0 0 24px ${theme.colors.primaryGlow}` : 'var(--shadow-card)',
                background: isSelected ? 'var(--surface-active)' : 'var(--surface)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '14px',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              {/* Card Header */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '10px',
                      backgroundColor: theme.colors.bg,
                      border: `1px solid ${theme.colors.border}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: `0 0 10px ${theme.colors.primaryGlow}`
                    }}>
                      {theme.category === 'dark' && <Moon size={16} color={theme.colors.primary} />}
                      {theme.category === 'light' && <Sun size={16} color={theme.colors.primary} />}
                      {theme.category === 'oled' && <Shield size={16} color={theme.colors.primary} />}
                      {theme.category === 'retro' && <Terminal size={16} color={theme.colors.primary} />}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text)' }}>
                        {theme.name}
                      </div>
                      <span className="font-mono" style={{ fontSize: '11px', color: 'var(--text-subtle)', textTransform: 'uppercase' }}>
                        {theme.category} • {theme.pattern}
                      </span>
                    </div>
                  </div>

                  {isSelected ? (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: theme.colors.primary,
                      color: '#000',
                      padding: '4px 10px',
                      borderRadius: '999px',
                      fontSize: '11px',
                      fontWeight: 800
                    }}>
                      <Check size={13} strokeWidth={3} /> AKTIF
                    </div>
                  ) : (
                    <button className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '11px', borderRadius: '999px' }}>
                      Pilih
                    </button>
                  )}
                </div>

                <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                  {theme.tagline}
                </p>
              </div>

              {/* Color Swatches Palette */}
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-subtle)', fontWeight: 600, marginBottom: '6px', textTransform: 'uppercase' }}>
                  Palet Warna
                </div>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <div
                    title={`Background: ${theme.colors.bg}`}
                    style={{ width: '28px', height: '24px', borderRadius: '6px', backgroundColor: theme.colors.bg, border: '1px solid rgba(255,255,255,0.2)' }}
                  />
                  <div
                    title={`Surface: ${theme.colors.surface}`}
                    style={{ width: '28px', height: '24px', borderRadius: '6px', backgroundColor: theme.colors.surfaceHover, border: '1px solid rgba(255,255,255,0.2)' }}
                  />
                  <div
                    title={`Primary Accent: ${theme.colors.primary}`}
                    style={{ width: '28px', height: '24px', borderRadius: '6px', backgroundColor: theme.colors.primary, boxShadow: `0 0 8px ${theme.colors.primaryGlow}` }}
                  />
                  <div
                    title={`Secondary Accent: ${theme.colors.secondary}`}
                    style={{ width: '28px', height: '24px', borderRadius: '6px', backgroundColor: theme.colors.secondary }}
                  />
                  <div
                    title={`Highlight: ${theme.colors.accent}`}
                    style={{ width: '28px', height: '24px', borderRadius: '6px', backgroundColor: theme.colors.accent }}
                  />
                  <div
                    title={`Status Success: ${theme.colors.success}`}
                    style={{ width: '28px', height: '24px', borderRadius: '6px', backgroundColor: theme.colors.success }}
                  />
                </div>
              </div>

              {/* Mini Interactive Preview Element */}
              <div style={{
                background: theme.colors.bg,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '10px',
                padding: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: theme.colors.primary }} />
                  <span className="font-mono" style={{ fontSize: '11px', color: theme.colors.text }}>Live Preview</span>
                </div>
                <span style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  backgroundColor: theme.colors.primary,
                  color: '#000',
                  padding: '2px 8px',
                  borderRadius: '4px'
                }}>
                  BUTTON
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Component Sandbox */}
      <div className="glass-panel" style={{ padding: '24px', borderRadius: '18px', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <Sliders size={20} color="var(--primary)" />
          <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Pratinjau Komponen UI (Tema: {currentTheme.name})</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 600 }}>TOMBOL INTERAKTIF</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button className="btn btn-primary" onClick={() => soundFx.playClick()}>
                Primary Glow
              </button>
              <button className="btn btn-secondary" onClick={() => soundFx.playClick()}>
                Glass Action
              </button>
              <button className="btn btn-danger" onClick={() => soundFx.playClick()}>
                Danger
              </button>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 600 }}>BADGES & STATUS</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span className="badge badge-primary">Cyan Glow</span>
              <span className="badge badge-success">OK - 200</span>
              <span className="badge badge-warning">High Load</span>
              <span className="badge badge-danger">Offline</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 600 }}>PROGRESS BAR</div>
            <div className="progress-container" style={{ marginTop: '8px' }}>
              <div className="progress-bar" style={{ width: '68%' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginTop: '6px', color: 'var(--text-muted)' }}>
              <span>Storage Persistence</span>
              <span className="font-mono">68% (21.7 GB / 32 GB)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="modal-backdrop" onClick={onCloseModal}>
        <div
          className="glass-panel"
          style={{
            maxWidth: '1100px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '28px',
            borderRadius: '24px',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {content}
        </div>
      </div>
    );
  }

  return content;
}
