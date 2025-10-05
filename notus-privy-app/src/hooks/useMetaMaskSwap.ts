"use client";

import { useState, useCallback } from 'react';
import { transferActions, TEST_CHAINS } from '@/lib/actions/transfer';
import type { SwapQuoteResponse, ExecuteUserOpResponse } from '@/types/swap';

export interface MetaMaskSwapState {
  quote: SwapQuoteResponse | null;
  loading: boolean;
  error: string | null;
  executing: boolean;
  result: ExecuteUserOpResponse | null;
}

export function useMetaMaskSwap(account: any, externallyOwnedAccount: string) { // eslint-disable-line @typescript-eslint/no-explicit-any
  const [state, setState] = useState<MetaMaskSwapState>({
    quote: null,
    loading: false,
    error: null,
    executing: false,
    result: null,
  });

  const generateSwapQuote = useCallback(async ({
    tokenIn,
    tokenOut,
    amountIn,
    smartWalletAddress,
  }: {
    tokenIn: string;
    tokenOut: string;
    amountIn: string;
    smartWalletAddress: string;
  }) => {
    if (!externallyOwnedAccount || !smartWalletAddress) {
      setState(prev => ({ ...prev, error: 'EOA ou Smart Wallet não disponível' }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null, quote: null, result: null }));

    try {
      console.log('🔍 Gerando cotação de swap com MetaMask...');
      
      const quote = await transferActions.createSwapQuote({
        payGasFeeToken: tokenIn, // Pagar gas com o mesmo token de entrada
        tokenIn,
        tokenOut,
        amountIn,
        walletAddress: smartWalletAddress,
        toAddress: smartWalletAddress,
        signerAddress: externallyOwnedAccount,
        chainIdIn: TEST_CHAINS.POLYGON, // Polygon mainnet
        chainIdOut: TEST_CHAINS.POLYGON,
        gasFeePaymentMethod: "DEDUCT_FROM_AMOUNT",
      });

      console.log('✅ Cotação de swap gerada:', quote);
      setState(prev => ({ ...prev, quote, loading: false }));
      return quote;
    } catch (error: unknown) {
      console.error('❌ Erro ao gerar cotação de swap:', error);
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Erro ao gerar cotação de swap',
        loading: false 
      }));
    }
  }, [externallyOwnedAccount]);

  const signAndExecute = useCallback(async (quoteId: string) => {
    if (!account || !externallyOwnedAccount) {
      setState(prev => ({ ...prev, error: 'Conta MetaMask ou EOA não disponível' }));
      return;
    }

    setState(prev => ({ ...prev, executing: true, error: null, result: null }));

    try {
      console.log('🔐 Assinando mensagem com MetaMask...');
      
      // Assinar a mensagem usando MetaMask (seguindo documentação Notus)
      const signature = await account.signMessage({
        account: externallyOwnedAccount,
        message: {
          raw: quoteId,
        },
      });

      console.log('✅ Mensagem assinada:', signature);
      console.log('🚀 Simulando execução de UserOperation...');

      // Executar UserOperation com assinatura real
      const executeResult = await transferActions.executeUserOperation({
        quoteId,
        signature, // Assinatura REAL do MetaMask
      });

      console.log('✅ UserOperation simulado:', executeResult);
      setState(prev => ({ ...prev, result: executeResult, executing: false }));
    } catch (error: unknown) {
      console.error('❌ Erro ao assinar e executar:', error);
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Erro ao assinar e executar',
        executing: false 
      }));
    }
  }, [account, externallyOwnedAccount]);

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
