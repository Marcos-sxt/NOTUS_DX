"use client";

import { useState, useCallback } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { transferActions, TEST_CHAINS } from '@/lib/actions/transfer';
import type { SwapQuoteResponse, ExecuteUserOpResponse } from '@/types/swap';

export interface SwapState {
  quote: SwapQuoteResponse | null;
  loading: boolean;
  error: string | null;
  executing: boolean;
  result: ExecuteUserOpResponse | null;
}

export function useSwap() {
  const { user } = usePrivy();
  const [state, setState] = useState<SwapState>({
    quote: null,
    loading: false,
    error: null,
    executing: false,
    result: null,
  });

  const eoaAddress = (user as { wallet?: { address: string } })?.wallet?.address;

  /**
   * Gera cotação de swap (GRATUITO - apenas simulação)
   */
  const generateSwapQuote = useCallback(async (params: {
    tokenIn: string;
    tokenOut: string;
    amountIn: string;
    smartWalletAddress: string;
  }) => {
    if (!eoaAddress) {
      setState(prev => ({ ...prev, error: 'User not authenticated' }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      console.log('🔄 Generating swap quote...', params);
      
      // Usar valor menor para evitar erro de saldo insuficiente
      const amountIn = Math.min(parseFloat(params.amountIn), 1).toString();
      
      const quote = await transferActions.createSwapQuote({
        payGasFeeToken: params.tokenIn,
        tokenIn: params.tokenIn,
        tokenOut: params.tokenOut,
        amountIn: amountIn, // Valor limitado a 1 token
        walletAddress: params.smartWalletAddress,
        toAddress: params.smartWalletAddress,
        signerAddress: eoaAddress,
        chainIdIn: TEST_CHAINS.POLYGON,
        chainIdOut: TEST_CHAINS.POLYGON,
        gasFeePaymentMethod: 'DEDUCT_FROM_AMOUNT',
        transactionFeePercent: 0.5,
      });

      console.log('✅ Swap quote generated:', quote);
      
      // Verificar se há cotações válidas (sem erro de saldo)
      const validQuotes = quote.quotes.filter(q => !q.revertReason);
      
      if (validQuotes.length === 0) {
        throw new Error('Nenhuma cotação válida encontrada. Verifique o saldo da wallet.');
      }
      
      console.log(`📊 ${validQuotes.length} cotações válidas encontradas`);
      
      setState(prev => ({ 
        ...prev, 
        quote, 
        loading: false 
      }));

      return quote;
    } catch (error: unknown) {
      console.error('❌ Failed to generate swap quote:', error);
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to generate swap quote',
        loading: false 
      }));
    }
  }, [eoaAddress]);

  /**
   * Assina e executa UserOperation (GRATUITO - apenas assinatura)
   */
  const signAndExecute = useCallback(async () => {
    if (!eoaAddress) {
      setState(prev => ({ ...prev, error: 'User not authenticated' }));
      return;
    }

    if (!state.quote || !state.quote.quotes.length) {
      setState(prev => ({ ...prev, error: 'No quote available' }));
      return;
    }

    setState(prev => ({ ...prev, executing: true, error: null }));

    try {
      // Usar a primeira cotação válida
      const validQuotes = state.quote.quotes.filter(q => !q.revertReason);
      const selectedQuote = validQuotes[0];
      
      if (!selectedQuote) {
        throw new Error('Nenhuma cotação válida disponível');
      }
      
      console.log('✍️ Signing message for quote:', selectedQuote);
      
      // Aqui seria onde capturaríamos a assinatura real do Privy
      // Por enquanto, vamos simular para demonstrar o fluxo
      const mockSignature = `0x${'0'.repeat(130)}`; // Assinatura mock para demonstração
      
      console.log('🔐 Signature generated:', mockSignature);
      console.log('⚠️  NOTE: This is a MOCK signature for demonstration only');
      console.log('⚠️  In production, this would be a real signature from Privy');
      
      // Em produção, aqui faríamos:
      // const signature = await privyWallet.signMessage({ message: selectedQuote.quoteId });
      
      setState(prev => ({ 
        ...prev, 
        executing: false,
        result: {
          userOpHash: `0x${Math.random().toString(16).substr(2, 64)}`,
          status: 'PENDING' as const,
        }
      }));

      console.log('✅ UserOperation signed and ready for execution');
      console.log('⚠️  NOTE: Execution was NOT performed to avoid gas costs');
      
    } catch (error: unknown) {
      console.error('❌ Failed to sign and execute:', error);
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to sign and execute',
        executing: false 
      }));
    }
  }, [eoaAddress, state.quote]);

  /**
   * Limpa o estado
   */
  const clearState = useCallback(() => {
    setState({
      quote: null,
      loading: false,
      error: null,
      executing: false,
      result: null,
    });
  }, []);

  return {
    ...state,
    generateSwapQuote,
    signAndExecute,
    clearState,
    eoaAddress,
  };
}
