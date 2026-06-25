'use client';

import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Toaster } from 'sonner';
import { Header } from './Header';
import { Footer } from './Footer';
import { ChatWidget } from './ChatWidget';
import { NotificationSimulator } from './NotificationSimulator';
import { ScrollToTop } from './ScrollToTop';

export function SiteLayout({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();

  useEffect(() => {
    const isRTL = i18n.language === 'ar';
    document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
    if (isRTL) {
      document.documentElement.classList.add('font-arabic');
    } else {
      document.documentElement.classList.remove('font-arabic');
    }
  }, [i18n.language]);

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <Header />
      <main className="flex-grow pt-24">
        {children}
      </main>
      <ChatWidget />
      <NotificationSimulator />
      <Footer />
      <Toaster position="top-center" richColors closeButton />
    </div>
  );
}
