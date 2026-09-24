'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Send, Trash2, HelpCircle, Sparkles } from 'lucide-react';
import { THEMES, ThemeConfig } from '@/lib/themes';
import { soundFx } from '@/lib/sound';

interface TerminalConsoleProps {
  currentTheme: ThemeConfig;
  onSelectTheme: (theme: ThemeConfig) => void;
}

interface CommandHistoryItem {
  id: string;
  command: string;
  output: React.ReactNode;
  timestamp: string;
}

export default function TerminalConsole({ currentTheme, onSelectTheme }: TerminalConsoleProps) {
  const [inputVal, setInputVal] = useState<string>('');
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [commandList, setCommandList] = useState<string[]>([]);
  const [items, setItems] = useState<CommandHistoryItem[]>([
    {
      id: 'welcome',
      command: 'fastfetch',
      timestamp: new Date().toLocaleTimeString(),
      output: (
        <div style={{ color: 'var(--text)', whiteSpace: 'pre-wrap', lineHeight: '1.4' }}>
          <div style={{ color: 'var(--primary)', fontWeight: 700, marginBottom: '8px' }}>
{`       _,met$$$$$gg.          kiosk@ubuntu-live-usb
    ,g$$$$$$$$$$$$$$$P.       ---------------------
  ,g$$P"     """Y$$.".        OS: Ubuntu 24.04.1 LTS x86_64
 ,$$P'              \`$$$.     Host: Live USB Kiosk Engine v2.4
',$$P       ,ggs.     \`$$b:   Kernel: 6.8.0-45-generic
\`d$$'     ,$P"'   .    $$$    Uptime: 23 mins
 $$P      d$'     ,    $$P    Shell: bash 5.2.21 / Next.js Terminal
 $$:      $$.   -    ,d$$'    Resolution: 1920x1080 @ 60Hz
 $$;      Y$b._   _,d$P'      WM: Openbox / Chromium Kiosk Mode
 Y$$.    \`."Y$$$$P"'          Theme: ` + currentTheme.name + `
  \`$$b.                       Memory: 3420MiB / 8192MiB (41%)
    \`Y$$b                     Storage: SanDisk USB 32GB (casper-rw)
      \`"Y$b._
          \`"""`}
          </div>
          <div style={{ color: 'var(--text-muted)' }}>
            Ketik <span style={{ color: 'var(--primary)', fontWeight: 700 }}>help</span> untuk melihat daftar perintah CLI yang tersedia.
          </div>
        </div>
      ),
    },
  ]);

  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [items]);

  const handleRunCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    soundFx.playClick();
    setCommandList((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    const parts = trimmed.split(' ');
    const mainCmd = parts[0].toLowerCase();
    const args = parts.slice(1);
    const nowStr = new Date().toLocaleTimeString();

    let outputNode: React.ReactNode = null;

    switch (mainCmd) {
      case 'help':
        outputNode = (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', color: 'var(--text)' }}>
            <div style={{ color: 'var(--primary)', fontWeight: 700, marginBottom: '4px' }}>
              DAFTAR PERINTAH KIOSK TERMINAL:
            </div>
            <div><span style={{ color: 'var(--primary)', fontWeight: 600 }}>fastfetch / neofetch</span> - Tampilkan logo dan info lengkap sistem</div>
            <div><span style={{ color: 'var(--primary)', fontWeight: 600 }}>theme list</span> - Daftar seluruh tema yang tersedia</div>
            <div><span style={{ color: 'var(--primary)', fontWeight: 600 }}>theme set &lt;id&gt;</span> - Ganti tema langsung via CLI (contoh: theme set oled)</div>
            <div><span style={{ color: 'var(--primary)', fontWeight: 600 }}>uname -a</span> - Informasi Kernel Linux</div>
            <div><span style={{ color: 'var(--primary)', fontWeight: 600 }}>df -h</span> - Status partisi disk dan USB storage</div>
            <div><span style={{ color: 'var(--primary)', fontWeight: 600 }}>free -m</span> - Kapasitas dan penggunaan RAM</div>
            <div><span style={{ color: 'var(--primary)', fontWeight: 600 }}>ping &lt;host&gt;</span> - Test koneksi internet dan latency</div>
            <div><span style={{ color: 'var(--primary)', fontWeight: 600 }}>uptime</span> - Lama sistem berjalan sejak USB di-boot</div>
            <div><span style={{ color: 'var(--primary)', fontWeight: 600 }}>kiosk-info</span> - Parameter Chromium kiosk runtime</div>
            <div><span style={{ color: 'var(--primary)', fontWeight: 600 }}>clear</span> - Bersihkan riwayat layar terminal</div>
          </div>
        );
        break;

      case 'fastfetch':
      case 'neofetch':
        outputNode = (
          <div style={{ color: 'var(--primary)', whiteSpace: 'pre-wrap', lineHeight: '1.4' }}>
{`       _,met$$$$$gg.          kiosk@ubuntu-live-usb
    ,g$$$$$$$$$$$$$$$P.       ---------------------
  ,g$$P"     """Y$$.".        OS: Ubuntu 24.04.1 LTS x86_64
 ,$$P'              \`$$$.     Host: Live USB Kiosk Engine v2.4
',$$P       ,ggs.     \`$$b:   Kernel: 6.8.0-45-generic
\`d$$'     ,$P"'   .    $$$    Uptime: 23 mins
 $$P      d$'     ,    $$P    Shell: bash 5.2.21 / Next.js Terminal
 $$:      $$.   -    ,d$$'    Resolution: 1920x1080 @ 60Hz
 $$;      Y$b._   _,d$P'      WM: Openbox / Chromium Kiosk Mode
 Y$$.    \`."Y$$$$P"'          Theme: ` + currentTheme.name + `
  \`$$b.                       Memory: 3420MiB / 8192MiB (41%)
    \`Y$$b                     Storage: SanDisk USB 32GB (casper-rw)`}
          </div>
        );
        break;

      case 'theme':
        if (args[0] === 'list') {
          outputNode = (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ color: 'var(--primary)', fontWeight: 700 }}>TEMA TERSEDIA ({THEMES.length}):</div>
              {THEMES.map((t) => (
                <div key={t.id} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <span style={{ color: t.colors.primary, fontWeight: 700, width: '110px' }}>{t.id}</span>
                  <span style={{ color: 'var(--text)' }}>{t.name}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>({t.tagline})</span>
                  {t.id === currentTheme.id && <span className="badge badge-primary" style={{ fontSize: '10px' }}>AKTIF</span>}
                </div>
              ))}
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Ketik <code style={{ color: 'var(--primary)' }}>theme set &lt;id&gt;</code> untuk menerapkan.
              </div>
            </div>
          );
        } else if (args[0] === 'set' && args[1]) {
          const targetId = args[1].toLowerCase();
          const found = THEMES.find((t) => t.id === targetId || t.name.toLowerCase().includes(targetId));
          if (found) {
            onSelectTheme(found);
            outputNode = (
              <div style={{ color: 'var(--success)', fontWeight: 600 }}>
                ✓ Tema berhasil diganti ke: <span style={{ color: found.colors.primary }}>{found.name}</span>!
              </div>
            );
          } else {
            outputNode = (
              <div style={{ color: 'var(--danger)' }}>
                ✗ Tema &quot;{args[1]}&quot; tidak ditemukan. Ketik <span style={{ color: 'var(--primary)' }}>theme list</span> untuk melihat ID yang valid.
              </div>
            );
          }
        } else {
          outputNode = (
            <div style={{ color: 'var(--warning)' }}>
              Penggunaan: <code>theme list</code> atau <code>theme set &lt;id&gt;</code>
            </div>
          );
        }
        break;

      case 'uname':
        outputNode = (
          <div style={{ color: 'var(--text)' }}>
            Linux ubuntu-live-kiosk 6.8.0-45-generic #45-Ubuntu SMP PREEMPT_DYNAMIC Thu Jun 13 14:18:22 UTC 2024 x86_64 x86_64 x86_64 GNU/Linux
          </div>
        );
        break;

      case 'df':
        outputNode = (
          <div style={{ whiteSpace: 'pre', color: 'var(--text)', fontSize: '12px' }}>
{`Filesystem      Size  Used Avail Use% Mounted on
udev            3.9G     0  3.9G   0% /dev
tmpfs           794M  2.1M  792M   1% /run
/dev/sdb1        29G  4.8G   23G  18% /cdrom (USB Live)
/dev/loop0      2.4G  2.4G     0 100% /rofs (SquashFS)
cow              29G  4.8G   23G  18% / (casper-rw overlay)
tmpfs           3.9G   12K  3.9G   1% /dev/shm`}
          </div>
        );
        break;

      case 'free':
        outputNode = (
          <div style={{ whiteSpace: 'pre', color: 'var(--text)', fontSize: '12px' }}>
{`               total        used        free      shared  buff/cache   available
Mem:            7938        3420        2814         142        1704        4102
Swap:           2048           0        2048`}
          </div>
        );
        break;

      case 'uptime':
        outputNode = (
          <div style={{ color: 'var(--text)' }}>
            20:10:45 up 24 min,  1 user,  load average: 0.18, 0.22, 0.15
          </div>
        );
        break;

      case 'ping': {
        const host = args[0] || '8.8.8.8';
        outputNode = (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', color: 'var(--text)', fontSize: '12px' }}>
            <div>PING {host} ({host}) 56(84) bytes of data.</div>
            <div>64 bytes from {host}: icmp_seq=1 ttl=118 time=14.2 ms</div>
            <div>64 bytes from {host}: icmp_seq=2 ttl=118 time=13.8 ms</div>
            <div>64 bytes from {host}: icmp_seq=3 ttl=118 time=14.5 ms</div>
            <div style={{ color: 'var(--success)', marginTop: '4px' }}>--- {host} ping statistics --- 3 packets transmitted, 3 received, 0% packet loss, time 2003ms</div>
          </div>
        );
        break;
      }

      case 'kiosk-info':
        outputNode = (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', color: 'var(--text)', fontSize: '12px' }}>
            <div style={{ color: 'var(--primary)', fontWeight: 700 }}>CHROMIUM KIOSK LAUNCH PARAMETERS:</div>
            <div>--kiosk --noerrdialogs --disable-infobars</div>
            <div>--check-for-update-interval=31536000 --disable-pinch</div>
            <div>--overscroll-history-navigation=0 --no-first-run</div>
            <div>--autoplay-policy=no-user-gesture-required</div>
            <div>Target URL: http://localhost:3000</div>
          </div>
        );
        break;

      case 'clear':
        setItems([]);
        setInputVal('');
        return;

      default:
        outputNode = (
          <div style={{ color: 'var(--danger)' }}>
            bash: {mainCmd}: command not found. Ketik <span style={{ color: 'var(--primary)', fontWeight: 600 }}>help</span> untuk perintah yang tersedia.
          </div>
        );
        break;
    }

    setItems((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        command: trimmed,
        output: outputNode,
        timestamp: nowStr,
      },
    ]);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleRunCommand(inputVal);
    } else if (e.key === 'ArrowUp') {
      if (commandList.length > 0) {
        const nextIdx = historyIndex + 1 < commandList.length ? historyIndex + 1 : historyIndex;
        setHistoryIndex(nextIdx);
        setInputVal(commandList[commandList.length - 1 - nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInputVal(commandList[commandList.length - 1 - nextIdx]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputVal('');
      }
    }
  };

  return (
    <div className="terminal-window" style={{ display: 'flex', flexDirection: 'column', minHeight: '520px' }}>
      {/* Terminal Title Bar */}
      <div className="terminal-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="terminal-dot" style={{ backgroundColor: '#ef4444' }} />
          <span className="terminal-dot" style={{ backgroundColor: '#f59e0b' }} />
          <span className="terminal-dot" style={{ backgroundColor: '#10b981' }} />
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginLeft: '8px' }}>
            kiosk@ubuntu-live: ~ (Bash Shell)
          </span>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => handleRunCommand('fastfetch')}
            className="btn btn-secondary"
            style={{ padding: '4px 10px', fontSize: '11px' }}
          >
            <Sparkles size={12} /> fastfetch
          </button>
          <button
            onClick={() => handleRunCommand('theme list')}
            className="btn btn-secondary"
            style={{ padding: '4px 10px', fontSize: '11px' }}
          >
            theme list
          </button>
          <button
            onClick={() => {
              soundFx.playClick();
              setItems([]);
            }}
            className="btn btn-secondary"
            style={{ padding: '4px 10px', fontSize: '11px' }}
            title="Clear Terminal"
          >
            <Trash2 size={12} /> Clear
          </button>
        </div>
      </div>

      {/* Terminal Body Output */}
      <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {items.map((item) => (
          <div key={item.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: 'var(--primary)', fontWeight: 700 }}>kiosk@ubuntu-live:~$</span>
              <span style={{ color: '#fff', fontWeight: 600 }}>{item.command}</span>
              <span style={{ fontSize: '11px', color: 'var(--text-subtle)', marginLeft: 'auto' }}>{item.timestamp}</span>
            </div>
            <div style={{ paddingLeft: '8px', borderLeft: '2px solid rgba(255, 255, 255, 0.08)' }}>
              {item.output}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Terminal Input Bar */}
      <div style={{
        padding: '12px 16px',
        background: 'rgba(255, 255, 255, 0.03)',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <span style={{ color: 'var(--primary)', fontWeight: 700, flexShrink: 0 }}>kiosk@ubuntu-live:~$</span>
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ketik perintah di sini (contoh: help, fastfetch, theme set matrix, df -h)..."
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            color: 'var(--text)',
            fontFamily: 'var(--font-mono)',
            fontSize: '14px',
            outline: 'none',
          }}
          autoFocus
        />
        <button
          onClick={() => handleRunCommand(inputVal)}
          className="btn btn-primary"
          style={{ padding: '6px 14px', fontSize: '12px' }}
        >
          <Send size={13} /> Kirim
        </button>
      </div>
    </div>
  );
}
