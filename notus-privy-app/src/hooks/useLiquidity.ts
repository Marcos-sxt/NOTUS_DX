"use client";

import { useState, useCallback } from 'react';
import { 
  liquidityActions, 
  AmountsResponse, 
  CreateLiquidityResponse, 
  ExecuteUserOpResponse,
  createLiquidityPositionComplete 
} from '@/lib/actions/liquidity';

export interface LiquidityState {
  amounts: AmountsResponse | null;
  position: CreateLiquidityResponse | null;
  loading: boolean;
  error: string | null;
  creatingPosition: boolean;
  executing: boolean;
}

export function useLiquidity(walletAddress: string | null) {
  const [state, setState] = useState<LiquidityState>({
    amounts: null,
    position: null,
    loading: false,
    error: null,
    creatingPosition: false,
    executing: false,
  });

  /**
   * Calcular quantidades de tokens necessárias
   * GET /api/v1/liquidity/amounts
   */
  const calculateTokenAmounts = useCallback(async (params: {
    chainId: number;
    token0: string;
    token1: string;
    token0MaxAmount: number;
    token1MaxAmount: number;
    poolFeePercent: number;
    minPrice: string;
    maxPrice: string;
    payGasFeeToken: string;
    gasFeePaymentMethod: 'ADD_TO_AMOUNT' | 'DEDUCT_FROM_AMOUNT';
  }) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      console.log('💧 Calculando quantidades de tokens...');
      
      const amounts = await liquidityActions.getTokenAmounts(params);
      
      console.log('✅ Quantidades calculadas:', amounts);
      setState(prev => ({ ...prev, amounts, loading: false }));
      return amounts;
    } catch (error: unknown) {
      console.error('❌ Erro ao calcular quantidades:', error);
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Erro ao calcular quantidades',
        loading: false 
      }));
    }
  }, []);

  /**
   * Criar posição de liquidez
   * POST /api/v1/liquidity/create
   */
  const createPosition = useCallback(async (params: {
    chainId: number;
    token0: string;
    token1: string;
    poolFeePercent: number;
    token0Amount: string;
    token1Amount: string;
    minPrice: string;
    maxPrice: string;
    payGasFeeToken: string;
    gasFeePaymentMethod: 'ADD_TO_AMOUNT' | 'DEDUCT_FROM_AMOUNT';
    slippageTolerance: number;
  }) => {
    if (!walletAddress) return;

    setState(prev => ({ ...prev, creatingPosition: true, error: null }));

    try {
      console.log('💧 Criando posição de liquidez...');
      
      const position = await liquidityActions.createLiquidityPosition({
        ...params,
        walletAddress,
        toAddress: walletAddress,
      });
      
      console.log('✅ Posição criada:', position);
      setState(prev => ({ ...prev, position, creatingPosition: false }));
      return position;
    } catch (error: unknown) {
      console.error('❌ Erro ao criar posição:', error);
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Erro ao criar posição',
        creatingPosition: false 
      }));
    }
  }, [walletAddress]);

  /**
   * Executar User Operation
   * POST /api/v1/crypto/execute-user-op
   */
  const executeUserOperation = useCallback(async (userOperationHash: string, signature: string) => {
    setState(prev => ({ ...prev, executing: true, error: null }));

    try {
      console.log('💧 Executando User Operation...');
      
      const result = await liquidityActions.executeUserOperation({
        userOperationHash,
        signature,
      });
      
      console.log('✅ User Operation executada:', result);
      setState(prev => ({ ...prev, executing: false }));
      return result;
    } catch (error: unknown) {
      console.error('❌ Erro ao executar User Operation:', error);
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Erro ao executar User Operation',
        executing: false 
      }));
    }
  }, []);

  /**
   * Fluxo completo: Calcular + Criar + Executar
   * Usa os 3 endpoints documentados em sequência
   */
  const createLiquidityPositionComplete = useCallback(async (params: {
    chainId: number;
    token0: string;
    token1: string;
    token0MaxAmount: number;
    token1MaxAmount: number;
    poolFeePercent: number;
    minPrice: string;
    maxPrice: string;
    payGasFeeToken: string;
    gasFeePaymentMethod: 'ADD_TO_AMOUNT' | 'DEDUCT_FROM_AMOUNT';
    slippageTolerance: number;
  }) => {
    if (!walletAddress) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      console.log('💧 Iniciando fluxo completo de liquidez...');
      
      const result = await createLiquidityPositionComplete({
        ...params,
        walletAddress,
        toAddress: walletAddress,
      });
      
      console.log('✅ Fluxo completo concluído:', result);
      setState(prev => ({ ...prev, ...result, loading: false }));
      return result;
    } catch (error: unknown) {
      console.error('❌ Erro no fluxo completo:', error);
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Erro no fluxo completo',
        loading: false 
      }));
    }
  }, [walletAddress]);

  const clearState = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      amounts: null, 
      position: null, 
      error: null 
    }));
  }, []);

  return {
    ...state,
    calculateTokenAmounts,
    createPosition,
    executeUserOperation,
    createLiquidityPositionComplete,
    clearState,
  };
}