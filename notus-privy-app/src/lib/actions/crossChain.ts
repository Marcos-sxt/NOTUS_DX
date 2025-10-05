/**
 * 🌉 Cross-Chain Swap Actions
 * Endpoints para swaps entre diferentes chains
 * Baseado na documentação Notus API
 */

import { notusAPI } from '../api/client';

export interface CrossChainSwapQuote {
  quoteId: string;
  tokenIn: {
    address: string;
    symbol: string;
    chainId: number;
  };
  tokenOut: {
    address: string;
    symbol: string;
    chainId: number;
  };
  amountIn: string;
  amountOut: string;
  rate: string;
  slippage: string;
  fee: string;
  bridgeFee: string;
  estimatedTime: string;
  route: Array<{
    chainId: number;
    chainName: string;
    action: string;
    estimatedTime: string;
  }>;
}

export interface CrossChainSwapParams {
  tokenIn: string;
  tokenOut: string;
  amountIn: string;
  chainIdIn: number;
  chainIdOut: number;
  walletAddress: string;
  toAddress: string;
  signerAddress: string;
  slippageTolerance?: number;
}

export interface CrossChainSwapStatus {
  quoteId: string;
  status: 'pending' | 'bridging' | 'completed' | 'failed';
  currentStep: number;
  totalSteps: number;
  currentChain: number;
  transactionHashes: Array<{
    chainId: number;
    hash: string;
    status: 'pending' | 'confirmed' | 'failed';
  }>;
  estimatedCompletion: string;
  error?: string;
}

export const crossChainActions = {
  /**
   * Criar cotação de cross-chain swap
   * POST /crypto/cross-swap
   */
  createCrossChainQuote: (params: CrossChainSwapParams) =>
    notusAPI.post('crypto/cross-swap', {
      json: params,
    }).json<CrossChainSwapQuote>(),

  /**
   * Executar cross-chain swap
   * POST /crypto/execute-cross-swap
   */
  executeCrossChainSwap: (params: {
    quoteId: string;
    signature: string;
  }) =>
    notusAPI.post('crypto/execute-cross-swap', {
      json: params,
    }).json<{ userOpHash: string; status: string }>(),

  /**
   * Verificar status do cross-chain swap
   * GET /crypto/cross-swap/{quoteId}/status
   */
  getCrossChainStatus: (quoteId: string) =>
    notusAPI.get(`crypto/cross-swap/${quoteId}/status`).json<CrossChainSwapStatus>(),

  /**
   * Listar chains suportadas
   * GET /crypto/chains
   */
  getSupportedChains: async () => {
    try {
      const response = await notusAPI.get('crypto/chains').json<any>();
      console.log('🔍 API Response for chains:', response);
      
      // Se a resposta for um array, retornar diretamente
      if (Array.isArray(response)) {
        return response;
      }
      
      // Se a resposta for um objeto com propriedade chains, retornar chains
      if (response && Array.isArray(response.chains)) {
        return response.chains;
      }
      
      // Se a resposta for um objeto com propriedade data, retornar data
      if (response && Array.isArray(response.data)) {
        return response.data;
      }
      
      // Se não for nenhum dos casos acima, retornar array vazio
      console.warn('⚠️ Unexpected response format for chains:', response);
      return [];
    } catch (error) {
      console.error('❌ Error fetching chains:', error);
      return [];
    }
  },

  /**
   * Listar tokens suportados por chain
   * NOTA: Este endpoint não existe na API atual, retorna 404
   * GET /crypto/chains/{chainId}/tokens
   */
  getChainTokens: async (chainId: number) => {
    // Endpoint não existe, retornar lista vazia
    console.warn(`⚠️ Endpoint /crypto/chains/${chainId}/tokens não existe na API atual`);
    return [];
  },
};
