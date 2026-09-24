'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import SystemOverview from '@/components/SystemOverview';
import ThemeSelector from '@/components/ThemeSelector';
import TerminalConsole from '@/components/TerminalConsole';
import HardwareTester from '@/components/HardwareTester';
import StorageExplorer from '@/components/StorageExplorer';
import NetworkHub from '@/components/NetworkHub';
import UsbBootGuide from '@/components/UsbBootGuide';
import PowerModal from '@/components/PowerModal';
import { THEMES, ThemeConfig, DEFAULT_THEME_ID } from '@/lib/themes';
import { soundFx } from '@/lib/sound';
import { 
  LayoutDashboard, 
  Palette, 
  Terminal, 
  Monitor, 
  HardDrive, 
  Wifi, 
  BookOpen,
  Keyboard
} from 'lucide-react';

export default function Home() {
  const [currentTheme, setCurrentTheme] = useState<ThemeConfig>(THEMES[0]);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isThemeModalOpen, setIsThemeModalOpen] = useState<boolean>(false);
  const [isPowerModalOpen, setIsPowerModalOpen] = useState<boolean>(false);
  const [cpuPercent, setCpuPercent] = useState<number>(24);
  const [ramPercent, setRamPercent] = useState<number>(42);

  // Initialize theme from localStorage on client mount
  useEffect(() => {
    try {
      const savedThemeId = localStorage.getItem('app_boot_theme');
      if (savedThemeId) {
        const found = THEMES.find((t) => t.id === savedThemeId);
        if (found) {
          setCurrentTheme(found);
          document.body.className = `theme-${found.id}`;
          document.documentElement.setAttribute('data-theme', found.id);
        }
      }
    } catch {
      // Ignore
    }

    // Dynamic subtle CPU / RAM variations
    const metricInterval = setInterval(() => {
      setCpuPercent((prev) => Math.min(95, Math.max(12, prev + Math.floor(Math.random() * 9 - 4))));
      setRamPercent((prev) => Math.min(88, Math.max(35, prev + Math.floor(Math.random() * 5 - 2))));
    }, 4000);

    // Global keyboard hotkeys
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+T or Alt+T: Cycle Themes
      if ((e.ctrlKey || e.altKey) && e.key.toLowerCase() === 't') {
        e.preventDefault();
        setCurrentTheme((curr) => {
          const currentIndex = THEMES.findIndex((t) => t.id === curr.id);
          const nextIndex = (currentIndex + 1) % THEMES.length;
          const nextTheme = THEMES[nextIndex];
          document.body.className = `theme-${nextTheme.id}`;
          document.documentElement.setAttribute('data-theme', nextTheme.id);
          localStorage.setItem('app_boot_theme', nextTheme.id);
          soundFx.playThemeSwitch();
          return nextTheme;
        });
      }
      // Ctrl+` : Open Terminal
      if (e.ctrlKey && e.key === '`') {
        e.preventDefault();
        setActiveTab('terminal');
        soundFx.playClick();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearInterval(metricInterval);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSelectTheme = (theme: ThemeConfig) => {
    setCurrentTheme(theme);
    document.body.className = `theme-${theme.id}`;
    document.documentElement.setAttribute('data-theme', theme.id);
    try {
      localStorage.setItem('app_boot_theme', theme.id);
    } catch {
      // Ignore
    }
  };

  const navItems = [
    { id: 'overview', label: 'Ringkasan Sistem', icon: LayoutDashboard },
    { id: 'themes', label: 'Studio & Tema (8)', icon: Palette, badge: 'Multi-Theme' },
    { id: 'terminal', label: 'Terminal CLI', icon: Terminal },
    { id: 'tester', label: 'Uji Hardware', icon: Monitor },
    { id: 'storage', label: 'Storage USB', icon: HardDrive },
    { id: 'network', label: 'Jaringan', icon: Wifi },
    { id: 'guide', label: 'Panduan Booting USB', icon: BookOpen, badge: 'Guide' },
  ];

  return (
    <div className="app-container">
      {/* Top Kiosk Header Bar */}
      <Header
        currentTheme={currentTheme}
        onSelectTheme={handleSelectTheme}
        onOpenThemeModal={() => setIsThemeModalOpen(true)}
        onOpenPowerModal={() => setIsPowerModalOpen(true)}
        cpuPercent={cpuPercent}
        ramPercent={ramPercent}
      />

      {/* Main Container */}
      <main className="main-content">
        {/* Navigation Tabs Bar */}
        <div 
          className="glass-panel" 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            marginBottom: '24px',
            borderRadius: '16px',
            overflowX: 'auto',
            border: '1px solid var(--border)'
          }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  soundFx.playClick();
                  setActiveTab(item.id);
                }}
                className={isActive ? 'btn btn-primary' : 'btn btn-secondary'}
                style={{
                  padding: '10px 18px',
                  borderRadius: '12px',
                  fontSize: '13px',
                  fontWeight: 600,
                  flexShrink: 0,
                  gap: '8px',
                }}
              >
                <Icon size={16} />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    style={{
                      fontSize: '10px',
                      padding: '2px 6px',
                      borderRadius: '999px',
                      background: isActive ? '#000' : 'rgba(255,255,255,0.1)',
                      color: isActive ? '#fff' : 'var(--text-muted)',
                      marginLeft: '2px',
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px', paddingRight: '6px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Keyboard size={13} /> <span className="font-mono">Ctrl+T</span> Ganti Tema
            </span>
          </div>
        </div>

        {/* Tab Content Rendering */}
        {activeTab === 'overview' && (
          <SystemOverview
            onNavigateTab={(tab) => {
              soundFx.playClick();
              setActiveTab(tab);
            }}
            cpuPercent={cpuPercent}
            ramPercent={ramPercent}
          />
        )}

        {activeTab === 'themes' && (
          <ThemeSelector
            currentTheme={currentTheme}
            onSelectTheme={handleSelectTheme}
          />
        )}

        {activeTab === 'terminal' && (
          <TerminalConsole
            currentTheme={currentTheme}
            onSelectTheme={handleSelectTheme}
          />
        )}

        {activeTab === 'tester' && <HardwareTester />}

        {activeTab === 'storage' && <StorageExplorer />}

        {activeTab === 'network' && <NetworkHub />}

        {activeTab === 'guide' && <UsbBootGuide />}
      </main>

      {/* Theme Studio Modal */}
      {isThemeModalOpen && (
        <ThemeSelector
          currentTheme={currentTheme}
          onSelectTheme={handleSelectTheme}
          isModal={true}
          onCloseModal={() => setIsThemeModalOpen(false)}
        />
      )}

      {/* Power Control Modal */}
      {isPowerModalOpen && (
        <PowerModal onClose={() => setIsPowerModalOpen(false)} />
      )}
    </div>
  );
}
