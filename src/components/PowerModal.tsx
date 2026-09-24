'use client';

import React, { useState } from 'react';
import { Power, RotateCcw, RefreshCw, X, AlertTriangle, CheckCircle } from 'lucide-react';
import { soundFx } from '@/lib/sound';

interface PowerModalProps {
  onClose: () => void;
}

export default function PowerModal({ onClose }: PowerModalProps) {
  const [actionState, setActionState] = useState<string | null>(null);

  const handleAction = (actionName: string) => {
    soundFx.playBeep(300, 0.2, 'sawtooth');
    setActionState(actionName);
    setTimeout(() => {
      if (actionName === 'reload') {
        window.location.reload();
      } else {
        soundFx.playSuccess();
        setTimeout(() => {
          setActionState(null);
          onClose();
        }, 1500);
      }
    }, 1200);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="glass-panel"
        style={{
          maxWidth: '480px',
          width: '100%',
          padding: '28px',
          borderRadius: '20px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
          border: '1px solid var(--border)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Power size={20} color="var(--danger)" />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Manajemen Daya Kiosk</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Kontrol sistem Ubuntu USB Kiosk</p>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-secondary btn-icon">
            <X size={18} />
          </button>
        </div>

        {actionState ? (
          <div style={{ padding: '30px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <RefreshCw size={36} color="var(--primary)" className="spin" />
            <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)' }}>
              Memproses {actionState.toUpperCase()}...
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Mengirim sinyal ACPI ke sistem operasi Ubuntu Live USB...
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
            <button
              onClick={() => handleAction('reload')}
              className="glass-panel glass-panel-hover"
              style={{
                padding: '14px 18px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                color: 'var(--text)',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <RotateCcw size={18} color="var(--primary)" />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 700, fontSize: '14px' }}>Muat Ulang Aplikasi (Reload)</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Refresh browser Kiosk tanpa mematikan PC</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleAction('reboot')}
              className="glass-panel glass-panel-hover"
              style={{
                padding: '14px 18px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                background: 'rgba(245, 158, 11, 0.05)',
                color: 'var(--text)',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <RefreshCw size={18} color="var(--warning)" />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 700, fontSize: '14px' }}>Mulai Ulang Komputer (Reboot)</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Restart OS Ubuntu & boot ulang dari USB</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleAction('shutdown')}
              className="glass-panel glass-panel-hover"
              style={{
                padding: '14px 18px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                background: 'rgba(239, 68, 68, 0.08)',
                color: 'var(--text)',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Power size={18} color="var(--danger)" />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 700, fontSize: '14px' }}>Matikan Komputer (Power Off)</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Sinkronisasi storage persistence lalu matikan daya</div>
                </div>
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
