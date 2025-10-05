"use client";

import { useState, useEffect, useCallback } from 'react';
import { createWalletClient, custom } from 'viem';
import { web3auth, WEB3AUTH_CHAINS, initWeb3Auth } from '@/lib/web3auth';
import { walletActions } from '@/lib/actions/wallet';
import type { WalletAddressResponse } from '@/lib/actions/wallet';

export interface Web3AuthState {
  account: any | null; // eslint-disable-line @typescript-eslint/no-explicit-any
  loggedIn: boolean;
  externallyOwnedAccount: string;
  smartWallet: WalletAddressResponse['wallet'] | null;
  loading: boolean;
  error: string | null;
  isRegistered: boolean;
}

export function useWeb3Auth() {
  const [state, setState] = useState<Web3AuthState>({
    account: null,
    loggedIn: false,
    externallyOwnedAccount: "",
    smartWallet: null,
    loading: false,
    error: null,
    isRegistered: false,
  });

  // Inicializar Web3Auth v10 - nova API
  useEffect(() => {
    const init = async () => {
      try {
        console.log('🔧 Initializing Web3Auth v10...');
        await initWeb3Auth();
        
        // Verificar se já está conectado após inicialização
        if (web3auth.provider) {
          const account = createWalletClient({
            chain: WEB3AUTH_CHAINS.sepolia,
            transport: custom(web3auth.provider),
          });

          const [address] = await account.getAddresses();
          
          setState(prev => ({
            ...prev,
            account,
            externallyOwnedAccount: address,
            loggedIn: web3auth.connected,
          }));

          console.log('✅ Web3Auth v10 already connected:', address);
        }
        
      } catch (error) {
        console.error('❌ Failed to initialize Web3Auth v10:', error);
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Failed to initialize Web3Auth v10',
        }));
      }
    };

    init();
  }, []);

  // Login com Web3Auth conforme documentação oficial
  const login = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      console.log('🔐 Logging in with Web3Auth...');
      
      // Conectar ao Web3Auth conforme documentação oficial
      const web3authProvider = await web3auth.connect();
      
      if (!web3authProvider) {
        throw new Error('Failed to connect to Web3Auth - no provider returned');
      }

      console.log('✅ Web3Auth provider connected');

      // Criar wallet client conforme documentação oficial
      const account = createWalletClient({
        chain: WEB3AUTH_CHAINS.sepolia,
        transport: custom(web3authProvider),
      });

      console.log('✅ Wallet client created');

      // Obter endereços conforme documentação oficial
      const [address] = await account.getAddresses();
      
      console.log('✅ Address obtained:', address);

      setState(prev => ({
        ...prev,
        account,
        externallyOwnedAccount: address,
        loggedIn: web3auth.connected,
        loading: false,
      }));

      // Carregar smart wallet após login
      await loadSmartWallet(address);

    } catch (error) {
      console.error('❌ Login failed:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Login failed',
        loading: false,
      }));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Logout
  const logout = useCallback(async () => {
    try {
      await web3auth.logout();
      setState({
        account: null,
        loggedIn: false,
        externallyOwnedAccount: "",
        smartWallet: null,
        loading: false,
        error: null,
        isRegistered: false,
      });
    } catch (error) {
      console.error('❌ Logout failed:', error);
    }
  }, []);

  // Carregar smart wallet
  const loadSmartWallet = useCallback(async (eoaAddress: string) => {
    if (!eoaAddress) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      console.log('🔍 Loading smart wallet for EOA:', eoaAddress);
      
      const walletData = await walletActions.getAddress({ 
        externallyOwnedAccount: eoaAddress 
      });

      if (walletData.wallet) {
        setState(prev => ({ 
          ...prev, 
          smartWallet: walletData.wallet,
          isRegistered: true, 
          loading: false 
        }));
        console.log('✅ Smart wallet loaded:', walletData.wallet);
      } else {
        setState(prev => ({ 
          ...prev, 
          smartWallet: null,
          isRegistered: false, 
          loading: false 
        }));
        console.log('ℹ️ Smart wallet not registered yet');
      }
    } catch (error: unknown) {
      console.error('Failed to load smart wallet:', error);
      
      if (error && typeof error === 'object' && 'status' in error && error.status === 404) {
        setState(prev => ({ 
          ...prev, 
          smartWallet: null,
          isRegistered: false, 
          loading: false 
        }));
      } else {
        setState(prev => ({ 
          ...prev, 
          error: error instanceof Error ? error.message : 'Failed to load smart wallet',
          loading: false 
        }));
      }
    }
  }, []);

  // Registrar smart wallet
  const registerSmartWallet = useCallback(async () => {
    if (!state.externallyOwnedAccount) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      console.log('🔍 Registering smart wallet for EOA:', state.externallyOwnedAccount);
      
      const walletData = await walletActions.register({
        externallyOwnedAccount: state.externallyOwnedAccount,
        metadata: {
          name: 'Notus DX Challenge Wallet (Web3Auth)',
          description: 'Smart wallet for testing Notus API with Web3Auth',
          authProvider: 'web3auth',
        },
      });

      console.log('✅ Smart wallet registered:', walletData);
      
      setState(prev => ({ 
        ...prev, 
        smartWallet: walletData.wallet,
        isRegistered: true,
        loading: false 
      }));
    } catch (error: unknown) {
      console.error('Failed to register smart wallet:', error);
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to register smart wallet',
        loading: false 
      }));
    }
  }, [state.externallyOwnedAccount]);

  return {
    ...state,
    login,
    logout,
    loadSmartWallet,
    registerSmartWallet,
  };
}
