"use client";

import { useState, useCallback } from 'react';
import { crossChainActions, CrossChainSwapQuote, CrossChainSwapParams, CrossChainSwapStatus } from '@/lib/actions/crossChain';

export interface CrossChainSwapState {
  quote: CrossChainSwapQuote | null;
  status: CrossChainSwapStatus | null;
  loading: boolean;
  error: string | null;
  executing: boolean;
  supportedChains: Array<{
    chainId: number;
    name: string;
    symbol: string;
    rpcUrl: string;
    blockExplorer: string;
    isTestnet: boolean;
  }>;
  chainTokens: Record<number, Array<{
    address: string;
    symbol: string;
    name: string;
    decimals: number;
    logoUrl?: string;
  }>>;
}

export function useCrossChainSwap() {
  const [state, setState] = useState<CrossChainSwapState>({
    quote: null,
    status: null,
    loading: false,
    error: null,
    executing: false,
    supportedChains: [],
    chainTokens: {},
  });

  const loadSupportedChains = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      console.log('🌉 Carregando chains suportadas...');
      
      const chains = await crossChainActions.getSupportedChains();
      
      console.log('✅ Chains carregadas:', chains?.length || 0);
      console.log('🔍 Chains data:', chains);
      setState(prev => ({ ...prev, supportedChains: Array.isArray(chains) ? chains : [], loading: false }));
    } catch (error: unknown) {
      console.error('❌ Erro ao carregar chains:', error);
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Erro ao carregar chains',
        loading: false 
      }));
    }
  }, []);

  const loadChainTokens = useCallback(async (chainId: number) => {
    if (state.chainTokens[chainId]) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      console.log(`🌉 Carregando tokens da chain ${chainId}...`);
      
      const tokens = await crossChainActions.getChainTokens(chainId);
      
      console.log(`✅ Tokens carregados para chain ${chainId}:`, tokens.length);
      setState(prev => ({ 
        ...prev, 
        chainTokens: { ...prev.chainTokens, [chainId]: tokens },
        loading: false 
      }));
    } catch (error: unknown) {
      console.error(`❌ Erro ao carregar tokens da chain ${chainId}:`, error);
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : `Erro ao carregar tokens da chain ${chainId}`,
        loading: false 
      }));
    }
  }, [state.chainTokens]);

  // Não carregar tokens automaticamente pois o endpoint não existe
  // const loadChainTokens = useCallback(async (chainId: number) => {
  //   // Endpoint não existe, não fazer nada
  // }, []);

  const createCrossChainQuote = useCallback(async (params: CrossChainSwapParams) => {
    setState(prev => ({ ...prev, loading: true, error: null, quote: null }));

    try {
      console.log('🌉 Criando cotação de cross-chain swap...');
      
      const quote = await crossChainActions.createCrossChainQuote(params);
      
      console.log('✅ Cotação criada:', quote);
      setState(prev => ({ ...prev, quote, loading: false }));
      return quote;
    } catch (error: unknown) {
      console.error('❌ Erro ao criar cotação:', error);
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Erro ao criar cotação',
        loading: false 
      }));
    }
  }, []);

  const executeCrossChainSwap = useCallback(async (quoteId: string, signature: string) => {
    setState(prev => ({ ...prev, executing: true, error: null }));

    try {
      console.log('🌉 Executando cross-chain swap...');
      
      const result = await crossChainActions.executeCrossChainSwap({
        quoteId,
        signature,
      });
      
      console.log('✅ Cross-chain swap executado:', result);
      setState(prev => ({ ...prev, executing: false }));
      return result;
    } catch (error: unknown) {
      console.error('❌ Erro ao executar cross-chain swap:', error);
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Erro ao executar cross-chain swap',
        executing: false 
      }));
    }
  }, []);

  const checkSwapStatus = useCallback(async (quoteId: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      console.log('🌉 Verificando status do swap...');
      
      const status = await crossChainActions.getCrossChainStatus(quoteId);
      
      console.log('✅ Status verificado:', status);
      setState(prev => ({ ...prev, status, loading: false }));
      return status;
    } catch (error: unknown) {
      console.error('❌ Erro ao verificar status:', error);
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Erro ao verificar status',
        loading: false 
      }));
    }
  }, []);

  const clearQuote = useCallback(() => {
    setState(prev => ({ ...prev, quote: null, status: null }));
  }, []);

  return {
    ...state,
    loadSupportedChains,
    loadChainTokens,
    createCrossChainQuote,
    executeCrossChainSwap,
    checkSwapStatus,
    clearQuote,
  };
}
