"use client";

import { useState, useEffect, useCallback } from 'react';
import { walletActions, WalletAddressResponse } from '@/lib/actions/wallet';
import { usePrivy } from '@privy-io/react-auth';

export interface SmartWalletState {
  wallet: WalletAddressResponse['wallet'] | null;
  loading: boolean;
  error: string | null;
  isRegistered: boolean;
}

export function useSmartWallet() {
  const { user } = usePrivy();
  const [state, setState] = useState<SmartWalletState>({
    wallet: null,
    loading: false,
    error: null,
    isRegistered: false,
  });

  const walletAddress = (user as { wallet?: { address: string } })?.wallet?.address;

  // Registrar wallet
  const registerWallet = useCallback(async () => {
    if (!walletAddress) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      console.log('🔍 Registering smart wallet for EOA:', walletAddress);
      
      const walletData = await walletActions.register({
        externallyOwnedAccount: walletAddress,
        metadata: {
          name: 'Notus DX Challenge Wallet',
          description: 'Smart wallet for testing Notus API functionality',
        },
      });

      console.log('✅ Smart wallet registered:', walletData);
      
      setState(prev => ({ 
        ...prev, 
        wallet: walletData.wallet,
        isRegistered: true,
        loading: false 
      }));
    } catch (error: unknown) {
      console.error('Failed to register wallet:', error);
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to register wallet',
        loading: false 
      }));
    }
  }, [walletAddress]);

  // Carregar dados da wallet
  const loadWallet = useCallback(async () => {
    if (!walletAddress) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      console.log('🔍 Checking wallet registration for EOA:', walletAddress);
      
      // Verificar se a wallet está registrada
      const walletData = await walletActions.getAddress({ 
        externallyOwnedAccount: walletAddress 
      });

      if (walletData.wallet) {
        // Wallet já registrada
        setState(prev => ({ 
          ...prev, 
          wallet: walletData.wallet,
          isRegistered: true, 
          loading: false 
        }));
        console.log('✅ Wallet already registered:', walletData.wallet);
      } else {
        // Wallet não registrada
        setState(prev => ({ 
          ...prev, 
          wallet: null,
          isRegistered: false, 
          loading: false 
        }));
        console.log('ℹ️ Wallet not registered yet');
      }
    } catch (error: unknown) {
      console.error('Failed to load wallet:', error);
      
      // Se for erro 404, significa que a wallet não está registrada
      if (error && typeof error === 'object' && 'status' in error && error.status === 404) {
        setState(prev => ({ 
          ...prev, 
          wallet: null,
          isRegistered: false, 
          loading: false 
        }));
      } else {
        setState(prev => ({ 
          ...prev, 
          error: error instanceof Error ? error.message : 'Failed to load wallet',
          loading: false 
        }));
      }
    }
  }, [walletAddress]);

  // Carregar dados da wallet quando o usuário estiver disponível
  useEffect(() => {
    if (walletAddress) {
      loadWallet();
    }
  }, [walletAddress, loadWallet]);

  // Auto-registrar wallet se não estiver registrada (removido para evitar erros)
  // useEffect(() => {
  //   if (walletAddress && !state.wallet && !state.loading && !state.error && !state.isRegistered) {
  //     console.log('🔄 Auto-registrando wallet...');
  //     registerWallet();
  //   }
  // }, [walletAddress, state.wallet, state.loading, state.error, state.isRegistered, registerWallet]);

  return {
    ...state,
    loadWallet,
    registerWallet,
  };
}
