/**
 * 💸 Transfer & Swap Actions
 * Endpoints para operações de transferência e swap
 * Baseado na documentação Notus API
 */

import { notusAPI } from '../api/client';
import type { 
  TransferQuoteResponse, 
  ExecuteUserOpResponse,
  SwapQuoteResponse,
  SwapParams,
  TransferParams,
  ExecuteParams
} from '@/types/swap';

export const transferActions = {
  /**
   * Criar cotação de transferência
   * POST /crypto/transfer
   */
  createTransferQuote: (params: TransferParams) =>
    notusAPI.post('crypto/transfer', {
      json: params,
    }).json<TransferQuoteResponse>(),

  /**
   * Criar cotação de swap
   * POST /crypto/swap
   */
  createSwapQuote: (params: SwapParams) =>
    notusAPI.post('crypto/swap', {
      json: params,
    }).json<SwapQuoteResponse>(),

  /**
   * Executar UserOperation (transferência ou swap)
   * POST /crypto/execute-user-op
   */
  executeUserOperation: (params: ExecuteParams) =>
    notusAPI.post('crypto/execute-user-op', {
      json: params,
    }).json<ExecuteUserOpResponse>(),
};

// Constantes úteis para testes
export const TEST_TOKENS = {
  // Polygon tokens para teste
  USDC: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
  WMATIC: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
  USDT: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
  // Native token
  NATIVE: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
} as const;

export const TEST_CHAINS = {
  POLYGON: 137,
  ETHEREUM: 1,
  SEPOLIA: 11155111,
} as const;