"use client";

import { useState, useEffect, useCallback } from 'react';
import { createWalletClient, custom } from 'viem';
import { polygon } from 'viem/chains';
import { walletActions } from '@/lib/actions/wallet';
import type { WalletAddressResponse } from '@/lib/actions/wallet';

export interface MetaMaskState {
  account: any | null; // eslint-disable-line @typescript-eslint/no-explicit-any
  connected: boolean;
  externallyOwnedAccount: string;
  smartWallet: WalletAddressResponse['wallet'] | null;
  loading: boolean;
  error: string | null;
  isRegistered: boolean;
}

export function useMetaMask() {
  const [state, setState] = useState<MetaMaskState>({
    account: null,
    connected: false,
    externallyOwnedAccount: '',
    smartWallet: null,
    loading: false,
    error: null,
    isRegistered: false,
  });

  // Verificar se MetaMask está disponível
  const isMetaMaskAvailable = typeof window !== 'undefined' && window.ethereum;

  // Função para conectar ao MetaMask
  const connect = useCallback(async () => {
    if (!isMetaMaskAvailable) {
      setState(prev => ({ 
        ...prev, 
        error: 'MetaMask não está instalado ou não está disponível' 
      }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      console.log('🦊 Conectando ao MetaMask...');
      
      // Solicitar permissão para conectar
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      // Criar wallet client
      const account = createWalletClient({
        chain: polygon,
        transport: custom(window.ethereum),
      });

      // Obter endereço da conta
      const [address] = await account.getAddresses();
      
      setState(prev => ({
        ...prev,
        account,
        externallyOwnedAccount: address,
        connected: true,
        loading: false,
      }));

      console.log('✅ MetaMask conectado com sucesso:', address);
      
      // Carregar smart wallet após conectar
      await loadSmartWallet(address);
      
    } catch (error: unknown) {
      console.error('❌ Erro ao conectar MetaMask:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Erro ao conectar MetaMask',
        loading: false,
      }));
    }
  }, [isMetaMaskAvailable]);

  // Função para carregar smart wallet
  const loadSmartWallet = useCallback(async (eoaAddress: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      console.log('🔍 Verificando smart wallet para EOA:', eoaAddress);
      
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
        console.log('✅ Smart wallet encontrada:', walletData.wallet);
      } else {
        setState(prev => ({ 
          ...prev, 
          smartWallet: null,
          isRegistered: false, 
          loading: false 
        }));
        console.log('ℹ️ Smart wallet não registrada ainda');
      }
    } catch (error: unknown) {
      console.error('Erro ao carregar smart wallet:', error);
      
      if (error && typeof error === 'object' && 'status' in error && (error as { status: number }).status === 404) {
        setState(prev => ({ 
          ...prev, 
          smartWallet: null,
          isRegistered: false, 
          loading: false 
        }));
      } else {
        setState(prev => ({ 
          ...prev, 
          error: error instanceof Error ? error.message : 'Erro ao carregar smart wallet',
          loading: false 
        }));
      }
    }
  }, []);

  // Função para desconectar
  const disconnect = useCallback(() => {
    setState({
      account: null,
      connected: false,
      externallyOwnedAccount: '',
      smartWallet: null,
      loading: false,
      error: null,
      isRegistered: false,
    });
    console.log('👋 MetaMask desconectado');
  }, []);

  // Função para registrar smart wallet
  const registerSmartWallet = useCallback(async () => {
    if (!state.externallyOwnedAccount) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      console.log('🔍 Registrando smart wallet para EOA:', state.externallyOwnedAccount);
      
      const walletData = await walletActions.register({
        externallyOwnedAccount: state.externallyOwnedAccount,
        metadata: {
          name: 'Notus DX Challenge MetaMask Wallet',
          description: 'Smart wallet para teste da API Notus com MetaMask',
        },
      });

      console.log('✅ Smart wallet registrada:', walletData);
      
      setState(prev => ({ 
        ...prev, 
        smartWallet: walletData.wallet,
        isRegistered: true,
        loading: false 
      }));
    } catch (error: unknown) {
      console.error('Erro ao registrar smart wallet:', error);
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Erro ao registrar smart wallet',
        loading: false 
      }));
    }
  }, [state.externallyOwnedAccount]);

  // Verificar conexão existente ao montar o componente
  useEffect(() => {
    const checkConnection = async () => {
      if (!isMetaMaskAvailable) return;

      try {
        // Verificar se já está conectado
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        
        if (accounts.length > 0) {
          const account = createWalletClient({
            chain: polygon,
            transport: custom(window.ethereum),
          });
          
          const [address] = await account.getAddresses();
          
          setState(prev => ({
            ...prev,
            account,
            externallyOwnedAccount: address,
            connected: true,
          }));
          
          // Carregar smart wallet
          await loadSmartWallet(address);
        }
      } catch (error) {
        console.error('Erro ao verificar conexão MetaMask:', error);
      }
    };

    checkConnection();
  }, [isMetaMaskAvailable, loadSmartWallet]);

  return {
    ...state,
    connect,
    disconnect,
    registerSmartWallet,
    isMetaMaskAvailable,
  };
}
