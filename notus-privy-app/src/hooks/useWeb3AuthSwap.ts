"use client";

import { useState, useCallback } from 'react';
import { transferActions, TEST_CHAINS } from '@/lib/actions/transfer';
import type { SwapQuoteResponse, ExecuteUserOpResponse } from '@/types/swap';

export interface Web3AuthSwapState {
  quote: SwapQuoteResponse | null;
  loading: boolean;
  error: string | null;
  executing: boolean;
  result: ExecuteUserOpResponse | null;
}

export function useWeb3AuthSwap(account: any, externallyOwnedAccount: string) { // eslint-disable-line @typescript-eslint/no-explicit-any
  const [state, setState] = useState<Web3AuthSwapState>({
    quote: null,
    loading: false,
    error: null,
    executing: false,
    result: null,
  });

  /**
   * Gera cotação de swap (GRATUITO - apenas simulação)
   */
  const generateSwapQuote = useCallback(async (params: {
    tokenIn: string;
    tokenOut: string;
    amountIn: string;
    smartWalletAddress: string;
  }) => {
    if (!externallyOwnedAccount) {
      setState(prev => ({ ...prev, error: 'User not authenticated' }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      console.log('🔄 Generating swap quote with Web3Auth...', params);
      
      const quote = await transferActions.createSwapQuote({
        payGasFeeToken: params.tokenIn,
        tokenIn: params.tokenIn,
        tokenOut: params.tokenOut,
        amountIn: params.amountIn,
        walletAddress: params.smartWalletAddress,
        toAddress: params.smartWalletAddress,
        signerAddress: externallyOwnedAccount,
        chainIdIn: TEST_CHAINS.POLYGON,
        chainIdOut: TEST_CHAINS.POLYGON,
        gasFeePaymentMethod: 'DEDUCT_FROM_AMOUNT',
        transactionFeePercent: 0.5,
      });

      console.log('✅ Swap quote generated with Web3Auth:', quote);
      
      // Verificar se há cotações válidas (sem erro de saldo)
      const validQuotes = quote.quotes.filter(q => !q.revertReason);
      
      if (validQuotes.length === 0) {
        throw new Error('Nenhuma cotação válida encontrada. Verifique o saldo da wallet.');
      }
      
      console.log(`📊 ${validQuotes.length} cotações válidas encontradas com Web3Auth`);
      
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
  }, [externallyOwnedAccount]);

  /**
   * Assina e executa UserOperation (GRATUITO - apenas assinatura real)
   */
  const signAndExecute = useCallback(async (quoteId: string) => {
    if (!account || !externallyOwnedAccount) {
      setState(prev => ({ ...prev, error: 'User not authenticated' }));
      return;
    }

    setState(prev => ({ ...prev, executing: true, error: null }));

    try {
      console.log('✍️ Signing message with Web3Auth for quote:', quoteId);
      
      // Assinatura REAL usando Web3Auth + viem
      const signature = await account.signMessage({
        account: externallyOwnedAccount,
        message: {
          raw: quoteId,
        },
      });
      
      console.log('🔐 Real signature generated with Web3Auth:', signature);
      console.log('✅ This is a REAL signature from Web3Auth!');
      
      // Em produção, aqui faríamos a execução real:
      // const result = await transferActions.executeUserOperation({
      //   quoteId,
      //   signature,
      // });
      
      // Para demonstração, simulamos o resultado
      setState(prev => ({ 
        ...prev, 
        executing: false,
        result: {
          userOpHash: `0x${Math.random().toString(16).substr(2, 64)}`,
          status: 'PENDING' as const,
        }
      }));

      console.log('✅ UserOperation signed with Web3Auth and ready for execution');
      console.log('⚠️  NOTE: Execution was NOT performed to avoid gas costs');
      
    } catch (error: unknown) {
      console.error('❌ Failed to sign and execute:', error);
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to sign and execute',
        executing: false 
      }));
    }
  }, [account, externallyOwnedAccount]);

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
  };
}
