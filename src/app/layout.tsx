import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ubuntu USB Boot Kiosk | Next.js Multi-Theme System',
  description: 'A dedicated multi-theme kiosk system designed for Ubuntu USB live boot environments with system diagnostics, terminal, and hardware utilities.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var savedTheme = localStorage.getItem('app_boot_theme') || 'cyberpunk';
                  document.documentElement.setAttribute('data-theme', savedTheme);
                  document.body ? document.body.className = 'theme-' + savedTheme : null;
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="theme-cyberpunk">
        <div className="bg-grid-overlay" />
        <div className="bg-ambient-glow" />
        {children}
      </body>
    </html>
  );
}
