"use client";

import { PrivyProvider } from '@privy-io/react-auth';

// Debug: Vamos ver o que está sendo carregado
console.log('🔍 Debug Privy Config:');
console.log('NEXT_PUBLIC_PRIVY_APP_ID:', process.env.NEXT_PUBLIC_PRIVY_APP_ID);
console.log('Type:', typeof process.env.NEXT_PUBLIC_PRIVY_APP_ID);
console.log('Length:', process.env.NEXT_PUBLIC_PRIVY_APP_ID?.length);

// Configuração mínima baseada na documentação oficial do Privy
export const privyConfig = {
  appId: process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
  config: {
    appearance: {
      theme: 'light',
      accentColor: '#676FFF',
    },
    embeddedWallets: {
      createOnLogin: 'users-without-wallets',
    }
  },
};

export { PrivyProvider };
