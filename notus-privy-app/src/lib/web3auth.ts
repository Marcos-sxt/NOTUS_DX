/**
 * 🔐 Web3Auth Configuration v10
 * Configuração atualizada para Web3Auth v10.3.2
 * https://web3auth.io/docs/quick-start
 */

"use client";

import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";
import { Web3Auth, Web3AuthOptions } from "@web3auth/modal";
import { polygon, sepolia } from "viem/chains";

// Client ID real do Web3Auth
const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || 
  "BGE7zT5xIdnxmpnJAG10cVH7LwXo1dZX9M9QV_N6Ej5khTF-P30JzJ_atbElxvvXahr1aIUQhhG6-MhFTk-VHEQ";

// Configuração do Web3Auth v10 - corrigida para SAPPHIRE_DEVNET
const web3AuthOptions: Web3AuthOptions = {
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET, // Corrigido: devnet em vez de mainnet
  uiConfig: {
    appName: "Notus DX Research",
    defaultLanguage: "en",
    theme: {
      primary: "#9333ea",
    },
  },
  chainConfig: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0xaa36a7", // Sepolia testnet
    rpcTarget: "https://rpc.ankr.com/eth_sepolia",
    displayName: "Sepolia Testnet",
    blockExplorer: "https://sepolia.etherscan.io",
    ticker: "ETH",
    tickerName: "Ethereum",
    decimals: 18,
  },
};

// Instância global do Web3Auth
export const web3auth = new Web3Auth(web3AuthOptions);

// Inicializar Web3Auth v10 - nova API
export const initWeb3Auth = async () => {
  try {
    await web3auth.init();
    console.log('✅ Web3Auth v10 initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize Web3Auth v10:', error);
    throw error;
  }
};

// Configurações de chain para viem
export const WEB3AUTH_CHAINS = {
  sepolia,
  polygon,
} as const;

// Log da configuração
console.log('🔧 Web3Auth Config v10:', {
  clientId: clientId.slice(0, 20) + '...',
  network: 'SAPPHIRE_DEVNET', // Corrigido
  chainNamespace: 'EIP155',
  chainId: '0xaa36a7',
  chainName: 'Sepolia Testnet',
  rpcTarget: 'https://rpc.ankr.com/eth_sepolia',
  version: '10.3.2',
  configType: 'v10-corrected-network',
});
