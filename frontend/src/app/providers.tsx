'use client';

import React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { PredictionStoreProvider } from '@/context/PredictionStore';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <PredictionStoreProvider>
        {children}
      </PredictionStoreProvider>
    </AuthProvider>
  );
}
