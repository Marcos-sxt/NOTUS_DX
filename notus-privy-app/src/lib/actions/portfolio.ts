/**
 * 📊 Portfolio & History Actions
 * Endpoints para consulta de portfolio e histórico de transações
 * Baseado na documentação Notus API
 */

import { notusAPI } from '../api/client';

export interface PortfolioResponse {
  tokens: Array<{
    address: string;
    symbol: string;
    name: string;
    decimals: number;
    balance: string;
    balanceUSD: string;
  }>;
  totalValueUSD: string;
}

export interface TransactionHistoryResponse {
  transactions: Array<{
    id: string;
    hash: string;
    type: string;
    status: string;
    amount: string;
    token: string;
    from: string;
    to: string;
    timestamp: string;
    gasUsed?: string;
    gasPrice?: string;
  }>;
  nextLastId?: string;
  total: number;
}

export interface LiquidityPoolResponse {
  pools: Array<{
    id: string;
    name: string;
    token0: {
      address: string;
      symbol: string;
      name: string;
    };
    token1: {
      address: string;
      symbol: string;
      name: string;
    };
    liquidity: string;
    totalValueUSD: string;
    apy: string;
    fees24h: string;
  }>;
  total: number;
}

export const portfolioActions = {
  /**
   * Obter portfolio de uma wallet
   * GET /wallets/{address}/portfolio
   */
  getPortfolio: (walletAddress: string) =>
    notusAPI.get(`wallets/${walletAddress}/portfolio`).json<PortfolioResponse>(),

  /**
   * Obter histórico de transações
   * NOTA: Este endpoint não existe na API atual, retorna 404
   * GET /wallets/{address}/history
   */
  getTransactionHistory: async (walletAddress: string, params?: {
    limit?: number;
    offset?: number;
    lastId?: string;
  }) => {
    // Endpoint não existe, retornar dados vazios
    console.warn(`⚠️ Endpoint /wallets/${walletAddress}/history não existe na API atual`);
    return {
      transactions: [],
      total: 0,
    } as TransactionHistoryResponse;
  },

  /**
   * Obter pools de liquidez disponíveis
   * NOTA: Este endpoint não existe na API atual, retorna 404
   * GET /liquidity/pools
   */
  getLiquidityPools: async (params?: {
    limit?: number;
    offset?: number;
    chainId?: number;
  }) => {
    // Endpoint não existe, retornar dados vazios
    console.warn(`⚠️ Endpoint /liquidity/pools não existe na API atual`);
    return {
      pools: [],
      total: 0,
    } as LiquidityPoolResponse;
  },

  /**
   * Obter detalhes de um pool específico
   * NOTA: Este endpoint não existe na API atual, retorna 404
   * GET /liquidity/pools/{poolId}
   */
  getPoolDetails: async (poolId: string) => {
    // Endpoint não existe, retornar dados vazios
    console.warn(`⚠️ Endpoint /liquidity/pools/${poolId} não existe na API atual`);
    return null;
  },
};
