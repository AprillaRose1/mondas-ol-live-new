import type { Metadata } from 'next';
import { cookies, headers } from 'next/headers';
import './globals.css';
import { fontBody, fontDisplay } from '@/app/fonts';
import { Providers } from '@/app/providers';
import { pickLanguage, dirFor, LANG_COOKIE } from '@/lib/i18n/settings';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: 'Mondas Öl',
  description: 'Premium olive oil from Dougga, Tunisia',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Detect the request language on the server so the initial HTML renders in the
  // right language: correct <html lang>/dir for SEO + a11y, and no flash on hydrate.
  const [cookieStore, headerStore] = await Promise.all([cookies(), headers()]);
  const lang = pickLanguage(
    cookieStore.get(LANG_COOKIE)?.value,
    headerStore.get('accept-language'),
  );

  return (
    <html
      lang={lang}
      dir={dirFor(lang)}
      className={`dark ${fontDisplay.variable} ${fontBody.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased">
        <Providers initialLang={lang}>{children}</Providers>
      </body>
    </html>
  );
}
