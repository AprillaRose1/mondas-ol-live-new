'use client';

import { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { I18nextProvider } from 'react-i18next';
import { store, persistor } from '@/store';
import i18nGlobal from '@/lib/i18n/config';
import { dirFor } from '@/lib/i18n/settings';

export function Providers({
  children,
  initialLang,
}: {
  children: React.ReactNode;
  initialLang: string;
}) {
  // Per-request i18n instance seeded with the server-detected language. This both
  // isolates language state across concurrent SSR renders (no shared-singleton
  // race) and gives the client one stable instance whose first render matches the
  // server markup exactly — no hydration mismatch, no first-paint flash.
  const [i18n] = useState(() => {
    const instance = i18nGlobal.cloneInstance({ lng: initialLang });
    if (instance.language !== initialLang) void instance.changeLanguage(initialLang);
    return instance;
  });

  // Keep <html lang>/<html dir> in sync when the user switches language at runtime
  // (RTL for Arabic). The server already set the correct values for the first paint.
  useEffect(() => {
    const apply = (lng: string) => {
      document.documentElement.lang = lng;
      document.documentElement.dir = dirFor(lng);
    };
    apply(i18n.language);
    i18n.on('languageChanged', apply);
    return () => i18n.off('languageChanged', apply);
  }, [i18n]);

  return (
    <I18nextProvider i18n={i18n}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          {children}
        </PersistGate>
      </Provider>
    </I18nextProvider>
  );
}
