/**
 * 🆔 KYC & Ramp Actions
 * Endpoints para KYC e Ramp (fiat on/off ramp)
 * Baseado na documentação oficial Notus API
 * https://docs.notus.team/docs/guides/kyc-quickstart
 * https://docs.notus.team/docs/guides/ramp-quickstart
 */

import { notusAPI } from '../api/client';

// KYC Types - Baseado na documentação oficial e resposta real da API
export interface KYCVerificationSession {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  document: {
    id: string;
    type: string | null;
    category: string;
  };
  status: 'PENDING' | 'VERIFYING' | 'COMPLETED' | 'FAILED' | 'EXPIRED';
  livenessRequired: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface KYCCreateSessionResponse {
  session: KYCVerificationSession;
  backDocumentUpload?: {
    url: string;
    fields: Record<string, string>;
  };
  frontDocumentUpload: {
    url: string;
    fields: Record<string, string>;
  };
}

export interface DocumentUploadData {
  url: string;
  fields: Record<string, string>;
}

export interface KYCStatusResponse {
  session: KYCVerificationSession & {
    individualId?: string; // Present when status is COMPLETED
  };
}

export interface KYCCreateSessionParams {
  firstName: string;
  lastName: string;
  birthDate: string;
  documentId: string;
  documentCategory: 'PASSPORT' | 'DRIVERS_LICENSE' | 'IDENTITY_CARD';
  documentCountry: string;
  livenessRequired: boolean;
  email: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
}

export interface KYCFinalizeParams {
  sessionId: string;
}

// Ramp Types - Baseado na documentação oficial
export interface RampDepositQuote {
  quoteId: string;
  amountToSendInFiatCurrency: string;
  amountToReceiveInCryptoCurrency: string;
  expiresAt: string;
}

export interface RampDepositQuoteParams {
  paymentMethodToSend: string;
  receiveCryptoCurrency: 'USDC' | 'BRZ';
  amountToSendInFiatCurrency: string;
  individualId: string;
  walletAddress: string;
  chainId: number;
}

export interface RampDepositOrder {
  orderId: string;
  expiresAt: string;
  paymentMethodToSendDetails: {
    type: 'PIX' | 'BANK_TRANSFER' | 'CARD';
    pixKey?: string;
    qrCode?: string;
    bankDetails?: {
      accountNumber: string;
      routingNumber: string;
      bankName: string;
    };
  };
}

export interface RampWithdrawQuote {
  quoteId: string;
  estimatedGasFeeInCryptoCurrency: string;
  transactionFeeInCryptoCurrency: string;
  amountToReceiveInFiatCurrency: string;
}

export interface RampWithdrawQuoteParams {
  individualId: string;
  amountToSendInCryptoCurrency: string;
  cryptoCurrencyToSend: 'USDC' | 'BRZ';
  paymentMethodToReceiveDetails: {
    type: 'BANK_TRANSFER' | 'PIX';
    bankAccount?: {
      accountNumber: string;
      routingNumber: string;
      bankName: string;
    };
    pixKey?: string;
  };
  chainId: number;
}

export interface RampWithdrawOrder {
  userOperationHash: string;
  orderId: string;
  amountToSendInCryptoCurrency: string;
  amountToReceiveInFiatCurrency: string;
  transactionFeeAmountInCryptoCurrency: string;
  estimatedGasFeeAmountInCryptoCurrency: string;
}

export const kycActions = {
  /**
   * Criar sessão de verificação KYC
   * POST /kyc/individual-verification-sessions/standard
   * Documentação: https://docs.notus.team/docs/guides/kyc-quickstart
   */
  createVerificationSession: (params: KYCCreateSessionParams) =>
    notusAPI.post('kyc/individual-verification-sessions/standard', {
      json: params,
    }).json<KYCCreateSessionResponse>(),

  /**
   * Verificar status da sessão KYC
   * GET /kyc/individual-verification-sessions/standard/:sessionId
   * Documentação: https://docs.notus.team/docs/guides/kyc-quickstart
   */
  getVerificationSession: (sessionId: string) =>
    notusAPI.get(`kyc/individual-verification-sessions/standard/${sessionId}`)
      .json<KYCStatusResponse>(),

  /**
   * Finalizar processo de verificação KYC
   * POST /kyc/individual-verification-sessions/standard/:sessionId/process
   * Documentação: https://docs.notus.team/docs/guides/kyc-quickstart
   */
  finalizeVerification: (sessionId: string) =>
    notusAPI.post(`kyc/individual-verification-sessions/standard/${sessionId}/process`)
      .json<{ status: string; individualId?: string }>(),

  /**
   * Upload de documento para S3
   * Upload direto para AWS S3 usando as URLs fornecidas
   */
  uploadDocument: async (file: File, uploadData: DocumentUploadData): Promise<boolean> => {
    try {
      const formData = new FormData();
      
      // Adicionar campos AWS S3 obrigatórios
      Object.entries(uploadData.fields).forEach(([key, value]) => {
        formData.append(key, value);
      });
      
      // Adicionar arquivo
      formData.append('file', file);
      
      // Upload para S3
      const response = await fetch(uploadData.url, {
        method: 'POST',
        body: formData
      });
      
      return response.ok;
    } catch (error) {
      console.error('Erro no upload do documento:', error);
      return false;
    }
  },
};

export const rampActions = {
  /**
   * Criar cotação de depósito fiat
   * POST /fiat/deposit/quote
   * Documentação: https://docs.notus.team/docs/guides/ramp-quickstart
   */
  createDepositQuote: (params: RampDepositQuoteParams) =>
    notusAPI.post('fiat/deposit/quote', {
      json: params,
    }).json<RampDepositQuote>(),

  /**
   * Criar ordem de depósito fiat
   * POST /fiat/deposit
   * Documentação: https://docs.notus.team/docs/guides/ramp-quickstart
   */
  createDepositOrder: (params: { quoteId: string }) =>
    notusAPI.post('fiat/deposit', {
      json: params,
    }).json<RampDepositOrder>(),

  /**
   * Criar cotação de saque fiat
   * POST /fiat/withdraw/quote
   * Documentação: https://docs.notus.team/docs/guides/ramp-quickstart
   */
  createWithdrawQuote: (params: RampWithdrawQuoteParams) =>
    notusAPI.post('fiat/withdraw/quote', {
      json: params,
    }).json<RampWithdrawQuote>(),

  /**
   * Criar ordem de saque fiat
   * POST /fiat/withdraw
   * Documentação: https://docs.notus.team/docs/guides/ramp-quickstart
   */
  createWithdrawOrder: (params: { quoteId: string }) =>
    notusAPI.post('fiat/withdraw', {
      json: params,
    }).json<RampWithdrawOrder>(),
};
