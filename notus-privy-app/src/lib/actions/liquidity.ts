/**
 * 💧 Liquidity Pools Actions
 * APENAS endpoints documentados na Notus API
 * Baseado na documentação oficial: https://docs.notus.team/docs/guides/liquidity-pools-quickstart
 */

import { notusAPI } from '../api/client';

// Interfaces baseadas na documentação oficial
export interface TokenAmounts {
  token0Amount: string;
  token1Amount: string;
}

export interface AmountsResponse {
  poolPrice: string;
  amounts: {
    token0MaxAmount: TokenAmounts;
    token1MaxAmount: TokenAmounts;
  };
}

export interface CreateLiquidityParams {
  walletAddress: string;
  toAddress: string;
  chainId: number;
  payGasFeeToken: string;
  gasFeePaymentMethod: 'ADD_TO_AMOUNT' | 'DEDUCT_FROM_AMOUNT';
  token0: string;
  token1: string;
  poolFeePercent: number;
  token0Amount: string;
  token1Amount: string;
  minPrice: string;
  maxPrice: string;
  slippageTolerance: number;
}

export interface CreateLiquidityResponse {
  userOperationHash: string;
  expiresAt: string;
  // Outros campos conforme documentação
}

export interface ExecuteUserOpParams {
  userOperationHash: string;
  signature: string;
}

export interface ExecuteUserOpResponse {
  userOperationHash: string;
  estimatedExecutionTime: string;
}

export const liquidityActions = {
  /**
   * Calcular quantidades de tokens necessárias
   * GET /api/v1/liquidity/amounts
   * Documentado em: https://docs.notus.team/docs/guides/liquidity-pools-quickstart
   */
  getTokenAmounts: (params: {
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
  }) =>
    notusAPI.get('liquidity/amounts', {
      searchParams: params,
    }).json<AmountsResponse>(),

  /**
   * Criar posição de liquidez
   * POST /api/v1/liquidity/create
   * Documentado em: https://docs.notus.team/docs/guides/liquidity-pools-quickstart
   */
  createLiquidityPosition: (params: CreateLiquidityParams) =>
    notusAPI.post('liquidity/create', {
      json: params,
    }).json<CreateLiquidityResponse>(),

  /**
   * Executar User Operation
   * POST /api/v1/crypto/execute-user-op
   * Documentado em: https://docs.notus.team/docs/guides/liquidity-pools-quickstart
   */
  executeUserOperation: (params: ExecuteUserOpParams) =>
    notusAPI.post('crypto/execute-user-op', {
      json: params,
    }).json<ExecuteUserOpResponse>(),
};

// Função helper para criar posição completa (3 passos documentados)
export const createLiquidityPositionComplete = async (params: {
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
  walletAddress: string;
  toAddress: string;
  slippageTolerance: number;
}) => {
  // Passo 1: Calcular quantidades
  const amounts = await liquidityActions.getTokenAmounts({
    chainId: params.chainId,
    token0: params.token0,
    token1: params.token1,
    token0MaxAmount: params.token0MaxAmount,
    token1MaxAmount: params.token1MaxAmount,
    poolFeePercent: params.poolFeePercent,
    minPrice: params.minPrice,
    maxPrice: params.maxPrice,
    payGasFeeToken: params.payGasFeeToken,
    gasFeePaymentMethod: params.gasFeePaymentMethod,
  });

  // Passo 2: Criar posição (usando token0MaxAmount como exemplo)
  const position = await liquidityActions.createLiquidityPosition({
    walletAddress: params.walletAddress,
    toAddress: params.toAddress,
    chainId: params.chainId,
    payGasFeeToken: params.payGasFeeToken,
    gasFeePaymentMethod: params.gasFeePaymentMethod,
    token0: params.token0,
    token1: params.token1,
    poolFeePercent: params.poolFeePercent,
    token0Amount: amounts.amounts.token0MaxAmount.token0Amount,
    token1Amount: amounts.amounts.token0MaxAmount.token1Amount,
    minPrice: params.minPrice,
    maxPrice: params.maxPrice,
    slippageTolerance: params.slippageTolerance,
  });

  return {
    amounts,
    position,
    // Passo 3 será executado pelo frontend com a assinatura
  };
};