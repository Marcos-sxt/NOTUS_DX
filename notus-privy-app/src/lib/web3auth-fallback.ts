/**
 * 🔐 Web3Auth Fallback Configuration
 * Configuração alternativa que funciona sem configuração de domínio
 */

"use client";

import { WEB3AUTH_NETWORK } from "@web3auth/base";
import { Web3Auth, Web3AuthOptions } from "@web3auth/modal";
import { sepolia } from "viem/chains";

// Client ID de teste público que permite localhost
const clientId = "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ";

// Configuração mínima que funciona
const web3AuthOptions: Web3AuthOptions = {
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
  uiConfig: {
    appName: "Notus DX Research",
    defaultLanguage: "en",
  },
};

// Instância global do Web3Auth
export const web3auth = new Web3Auth(web3AuthOptions);

// Inicializar Web3Auth
export const initWeb3Auth = async () => {
  try {
    await web3auth.init();
    console.log('✅ Web3Auth initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize Web3Auth:', error);
    throw error;
  }
};

// Configurações de chain para viem
export const WEB3AUTH_CHAINS = {
  sepolia,
} as const;

// Log da configuração
console.log('🔧 Web3Auth Fallback Config:', {
  clientId: clientId.slice(0, 20) + '...',
  network: 'SAPPHIRE_MAINNET',
});
