"use client";

import { PrivyProvider } from '@privy-io/react-auth';
import { ReactNode } from 'react';

interface PrivyWrapperProps {
  children: ReactNode;
}

export function PrivyWrapper({ children }: PrivyWrapperProps) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  
  console.log('🔍 PrivyWrapper Debug:');
  console.log('App ID:', appId);
  console.log('App ID Type:', typeof appId);
  console.log('App ID Length:', appId?.length);

  if (!appId) {
    console.error('❌ NEXT_PUBLIC_PRIVY_APP_ID is not defined');
    return <div>Error: Privy App ID not configured</div>;
  }

  return (
    <PrivyProvider
      appId={appId}
      config={{
        appearance: {
          theme: 'light',
          accentColor: '#676FFF',
        },
        embeddedWallets: {
          ethereum: {
            createOnLogin: 'users-without-wallets',
          },
        },
        mfa: {
          noPromptOnMfaRequired: false,
        },
        loginMethods: ['email', 'wallet'],
      }}
    >
      <div key="privy-children-wrapper" suppressHydrationWarning>
        {children}
      </div>
    </PrivyProvider>
  );
}
