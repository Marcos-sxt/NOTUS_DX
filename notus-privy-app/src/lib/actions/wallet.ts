/**
 * 🔐 Smart Wallets Actions
 * Endpoints para gerenciamento de smart wallets
 * Baseado no exemplo notus-dx-challenge-privy-example
 */

import { notusAPI } from '../api/client';

// Factory address para smart wallets (Light Account Factory)
export const FACTORY_ADDRESS = "0x0000000000400CdFef5E2714E63d8040b700BC24";

export interface WalletAddressResponse {
  wallet: {
    accountAbstraction: string;
    externallyOwnedAccount: string;
  };
  registeredAt?: string;
}

export interface WalletListResponse {
  wallets: Array<{
    accountAbstraction: string;
    externallyOwnedAccount: string;
    registeredAt: string;
  }>;
  total: number;
  page: number;
  perPage: number;
}

export interface WalletPortfolioResponse {
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

export interface WalletHistoryResponse {
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
  }>;
  nextLastId?: string;
  total: number;
}

export const walletActions = {
  /**
   * Registra uma nova smart wallet
   * POST /wallets/register
   */
  register: (params: {
    externallyOwnedAccount: string;
    factory?: string;
    salt?: string;
    metadata?: Record<string, unknown>;
  }) =>
    notusAPI.post("wallets/register", {
      json: {
        factory: FACTORY_ADDRESS,
        salt: "0",
        ...params,
      },
    }).json<WalletAddressResponse>(),

  /**
   * Busca endereço da smart wallet
   * GET /wallets/address
   */
  getAddress: (params: {
    externallyOwnedAccount: string;
    factory?: string;
    salt?: string;
    eip7702?: boolean;
  }) =>
    notusAPI.get("wallets/address", {
      searchParams: {
        factory: FACTORY_ADDRESS,
        salt: "0",
        ...params,
      },
    }).json<WalletAddressResponse>(),

  /**
   * Lista smart wallets do projeto
   * GET /wallets
   */
  listWallets: (page: number = 1, perPage: number = 20) =>
    notusAPI.get("wallets", {
      searchParams: { page, perPage },
    }).json<WalletListResponse>(),

  /**
   * Obtém portfolio da smart wallet
   * GET /wallets/{walletAddress}/portfolio
   */
  getPortfolio: (walletAddress: string) =>
    notusAPI.get(`wallets/${walletAddress}/portfolio`).json<WalletPortfolioResponse>(),

  /**
   * Obtém histórico de transações da smart wallet
   * GET /wallets/{walletAddress}/history
   */
  getHistory: (walletAddress: string, params?: {
    take?: number;
    lastId?: string;
    type?: string;
    status?: string;
    chains?: string;
    createdAt?: string;
  }) =>
    notusAPI.get(`wallets/${walletAddress}/history`, {
      searchParams: params,
    }).json<WalletHistoryResponse>(),
};
