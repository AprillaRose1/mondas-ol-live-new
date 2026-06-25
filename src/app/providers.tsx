'use client';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/store';
import { AuthHydrator } from '@/components/providers/auth-hydrator';
import '@/lib/i18n/config';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthHydrator />
        {children}
      </PersistGate>
    </Provider>
  );
}
