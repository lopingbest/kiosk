'use client';

import React, { useState } from 'react';
import { 
  Folder, 
  File, 
  HardDrive, 
  Usb, 
  Database, 
  FileCode, 
  FileText, 
  ShieldCheck, 
  Layers, 
  ChevronRight,
  Download,
  Eye
} from 'lucide-react';
import { soundFx } from '@/lib/sound';

interface VirtualFile {
  name: string;
  size: string;
  type: 'dir' | 'file';
  path: string;
  content?: string;
  badge?: string;
}

export default function StorageExplorer() {
  const [currentPath, setCurrentPath] = useState<string>('/media/usb-live');
  const [selectedFile, setSelectedFile] = useState<VirtualFile | null>({
    name: 'kiosk-config.json',
    size: '1.2 KB',
    type: 'file',
    path: '/media/usb-live/kiosk-config.json',
    content: JSON.stringify({
      version: '2.4.0',
      device: 'SanDisk Ultra 32GB USB 3.0',
      autoStart: true,
      fullscreenKiosk: true,
      defaultTheme: 'cyberpunk',
      hardwareAcceleration: true,
      persistentStorage: {
        partition: '/dev/sdb2',
        label: 'casper-rw',
        filesystem: 'ext4',
        mount: '/media/usb-live',
        freeSpaceMB: 24500
      },
      network: {
        preferEthernet: true,
        autoConnectWifi: true
      }
    }, null, 2)
  });

  const filesMap: Record<string, VirtualFile[]> = {
    '/media/usb-live': [
      { name: 'casper-rw', size: '24.6 GB (Overlay)', type: 'dir', path: '/media/usb-live/casper-rw', badge: 'Persistence' },
      { name: 'app_boot', size: '48.5 MB', type: 'dir', path: '/media/usb-live/app_boot', badge: 'Next.js App' },
      { name: 'kiosk-config.json', size: '1.2 KB', type: 'file', path: '/media/usb-live/kiosk-config.json', content: JSON.stringify({
        version: '2.4.0',
        device: 'SanDisk Ultra 32GB USB 3.0',
        autoStart: true,
        fullscreenKiosk: true,
        defaultTheme: 'cyberpunk',
        hardwareAcceleration: true,
      }, null, 2) },
      { name: 'setup_kiosk.sh', size: '3.4 KB', type: 'file', path: '/media/usb-live/setup_kiosk.sh', content: '#!/bin/bash\n# Ubuntu USB Auto Kiosk Setup Script\necho "Configuring Ubuntu USB Kiosk..."' },
      { name: 'README.txt', size: '850 B', type: 'file', path: '/media/usb-live/README.txt', content: 'UBUNTU LIVE USB KIOSK STATION\n\nBootable on any x86_64 UEFI PC.\nSupports persistence data saving.' },
    ],
    '/media/usb-live/app_boot': [
      { name: 'package.json', size: '820 B', type: 'file', path: '/media/usb-live/app_boot/package.json', content: '{\n  "name": "app-boot-kiosk",\n  "version": "1.0.0",\n  "dependencies": {\n    "next": "^14.2.15",\n    "react": "^18.3.1"\n  }\n}' },
      { name: 'next.config.mjs', size: '180 B', type: 'file', path: '/media/usb-live/app_boot/next.config.mjs', content: '/** @type {import("next").NextConfig} */\nconst nextConfig = { output: "standalone" };\nexport default nextConfig;' },
      { name: 'src', size: '12 Items', type: 'dir', path: '/media/usb-live/app_boot/src' },
    ],
  };

  const currentFiles = filesMap[currentPath] || filesMap['/media/usb-live'];

  const handleSelectFile = (file: VirtualFile) => {
    soundFx.playClick();
    if (file.type === 'dir' && filesMap[file.path]) {
      setCurrentPath(file.path);
    } else if (file.type === 'file') {
      setSelectedFile(file);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Storage Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>PARTISI LIVE USB (SanDisk)</span>
            <Usb size={18} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text)', marginBottom: '4px' }}>
            24.6 GB Bebas <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>/ 32.0 GB</span>
          </div>
          <div className="progress-container" style={{ margin: '8px 0' }}>
            <div className="progress-bar" style={{ width: '23%' }} />
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
            <span>/dev/sdb1 (FAT32 Boot) + /dev/sdb2 (Ext4)</span>
            <span style={{ color: 'var(--success)', fontWeight: 600 }}>Healthy 100%</span>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>RAM OVERLAY DISK</span>
            <Layers size={18} color="var(--secondary)" />
          </div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text)', marginBottom: '4px' }}>
            tmpfs /dev/shm <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>3.9 GB</span>
          </div>
          <div className="progress-container" style={{ margin: '8px 0' }}>
            <div className="progress-bar" style={{ width: '8%', backgroundColor: 'var(--secondary)' }} />
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
            <span>Cache Memori Sangat Cepat</span>
            <span className="font-mono">Read: 4.8 GB/s</span>
          </div>
        </div>
      </div>

      {/* File Browser Grid */}
      <div className="glass-panel" style={{ borderRadius: '18px', padding: '24px' }}>
        {/* Navigation Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '16px', borderBottom: '1px solid var(--border)', marginBottom: '20px' }}>
          <button
            onClick={() => {
              soundFx.playClick();
              setCurrentPath('/media/usb-live');
            }}
            className="btn btn-secondary"
            style={{ padding: '4px 10px', fontSize: '12px' }}
          >
            <Usb size={13} /> /media/usb-live
          </button>
          {currentPath !== '/media/usb-live' && (
            <>
              <ChevronRight size={14} color="var(--text-muted)" />
              <span className="font-mono" style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: 700 }}>
                {currentPath.replace('/media/usb-live/', '')}
              </span>
            </>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* File List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {currentFiles.map((file) => (
              <div
                key={file.name}
                onClick={() => handleSelectFile(file)}
                className="glass-panel glass-card-interactive"
                style={{
                  padding: '12px 16px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  border: selectedFile?.name === file.name ? '1px solid var(--primary)' : '1px solid var(--border)',
                  background: selectedFile?.name === file.name ? 'var(--surface-active)' : 'var(--surface)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {file.type === 'dir' ? (
                    <Folder size={18} color="var(--warning)" />
                  ) : file.name.endsWith('.json') || file.name.endsWith('.sh') ? (
                    <FileCode size={18} color="var(--primary)" />
                  ) : (
                    <FileText size={18} color="var(--text-muted)" />
                  )}
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>{file.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{file.size}</div>
                  </div>
                </div>

                {file.badge && (
                  <span className="badge badge-primary font-mono" style={{ fontSize: '10px' }}>
                    {file.badge}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* File Content Preview */}
          <div className="terminal-window" style={{ display: 'flex', flexDirection: 'column', minHeight: '280px' }}>
            <div className="terminal-header">
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary)' }}>
                {selectedFile ? selectedFile.name : 'Pilih File untuk Melihat Isi'}
              </span>
              {selectedFile && (
                <span className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {selectedFile.size}
                </span>
              )}
            </div>
            <div style={{ flex: 1, padding: '16px', overflowY: 'auto' }}>
              {selectedFile?.content ? (
                <pre style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)', fontSize: '12px', lineHeight: '1.5' }}>
                  {selectedFile.content}
                </pre>
              ) : (
                <div style={{ color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center', marginTop: '60px' }}>
                  Klik salah satu file di sebelah kiri untuk melihat isinya secara langsung.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
