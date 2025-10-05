"use client";

import { useState, useCallback } from 'react';
import { portfolioActions, PortfolioResponse, TransactionHistoryResponse } from '@/lib/actions/portfolio';

export interface PortfolioState {
  portfolio: PortfolioResponse | null;
  history: TransactionHistoryResponse | null;
  loading: boolean;
  error: string | null;
}

export function usePortfolio(walletAddress: string | null) {
  const [state, setState] = useState<PortfolioState>({
    portfolio: null,
    history: null,
    loading: false,
    error: null,
  });

  const loadPortfolio = useCallback(async () => {
    if (!walletAddress) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      console.log('📊 Carregando portfolio para wallet:', walletAddress);
      
      const portfolio = await portfolioActions.getPortfolio(walletAddress);
      
      console.log('✅ Portfolio carregado:', portfolio);
      setState(prev => ({ ...prev, portfolio, loading: false }));
    } catch (error: unknown) {
      console.error('❌ Erro ao carregar portfolio:', error);
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Erro ao carregar portfolio',
        loading: false 
      }));
    }
  }, [walletAddress]);

  const loadHistory = useCallback(async (limit = 10) => {
    if (!walletAddress) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      console.log('📜 Carregando histórico para wallet:', walletAddress);
      
      const history = await portfolioActions.getTransactionHistory(walletAddress, { limit });
      
      console.log('✅ Histórico carregado:', history);
      setState(prev => ({ ...prev, history, loading: false }));
    } catch (error: unknown) {
      console.error('❌ Erro ao carregar histórico:', error);
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Erro ao carregar histórico',
        loading: false 
      }));
    }
  }, [walletAddress]);

  const refreshData = useCallback(async () => {
    if (!walletAddress) return;
    
    await Promise.all([
      loadPortfolio(),
      loadHistory(),
    ]);
  }, [walletAddress, loadPortfolio, loadHistory]);

  return {
    ...state,
    loadPortfolio,
    loadHistory,
    refreshData,
  };
}
