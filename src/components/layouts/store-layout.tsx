'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Toaster } from 'sonner';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { WhatsAppButton } from '@/components/common/WhatsAppButton';
import { NotificationSimulator } from '@/components/common/NotificationSimulator';
import { ScrollToTop } from '@/components/common/ScrollToTop';
import { PageTransition } from '@/components/motion/page-transition';
// import { MeteorField } from '@/components/motion/meteor-field';

export function StoreLayout({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();
  const pathname = usePathname();
  const isFullBleedHero = pathname === '/' || pathname === '/story';

  useEffect(() => {
    const isRTL = i18n.language === 'ar';
    document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
    document.documentElement.classList.toggle('font-arabic', isRTL);
  }, [i18n.language]);

  return (
    <div className="flex min-h-screen flex-col">
      {/* <MeteorField /> */}
      <ScrollToTop />
      <Header />
      <main className={cn('relative z-[1] flex-grow', !isFullBleedHero && 'pt-[4.5rem] md:pt-20')}>
        <PageTransition>{children}</PageTransition>
      </main>
      <WhatsAppButton />
      <NotificationSimulator />
      <Footer />
      <Toaster
        position="top-right"
        richColors
        closeButton
        style={{ top: '50%', transform: 'translateY(-50%)' }}
        toastOptions={{
          className: '!bg-bg-card !text-text-main !border-border-subtle font-sans',
        }}
      />
    </div>
  );
}
