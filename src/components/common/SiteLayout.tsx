'use client';

import React from 'react';
import { Toaster } from 'sonner';
import { Header } from './Header';
import { Footer } from './Footer';
import { ChatWidget } from './ChatWidget';
import { NotificationSimulator } from './NotificationSimulator';
import { ScrollToTop } from './ScrollToTop';

export function SiteLayout({ children }: { children: React.ReactNode }) {
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
