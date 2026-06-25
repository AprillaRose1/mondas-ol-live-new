import type { Metadata } from 'next';
import './globals.css';
import { fontBody, fontDisplay } from '@/app/fonts';
import { Providers } from '@/app/providers';

export const metadata: Metadata = {
  title: 'Mondas Öl',
  description: 'Premium olive oil from Dougga, Tunisia',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`dark ${fontDisplay.variable} ${fontBody.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
