/**
 * 🔄 Swap Types
 * Tipos para operações de swap e transferência
 */

export interface SwapQuoteResponse {
  quotes: Array<{
    quoteId: string | null;
    tokenIn: string;
    tokenOut: string;
    amountIn: string;
    amountOut: string;
    minAmountOut: string;
    chainIn: number;
    chainOut: number;
    swapProvider: string;
    estimatedExecutionTime: string;
    estimatedGasFees: {
      payGasFeeToken: string;
      maxGasFeeToken: string;
      gasFeeTokenAmount: string;
      gasFeeTokenAmountUSD: string;
      maxGasFeeNative: string;
    };
    estimatedCollectedFee: {
      collectedFee: string;
      collectedFeeToken: string;
      collectedFeePercent: string;
      notusCollectedFee: string;
      notusCollectedFeePercent: string;
    };
    revertReason?: {
      decoded: string;
      raw: string;
      utf8: string;
    };
  }>;
}

export interface TransferQuoteResponse {
  transfer: {
    quoteId: string;
    token: string;
    amount: string;
    toAddress: string;
    fromAddress: string;
    gasFee: string;
    totalFee: string;
    validUntil: string;
  };
}

export interface ExecuteUserOpResponse {
  userOpHash: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  transactionHash?: string;
  error?: string;
}

export interface SwapParams {
  payGasFeeToken: string;
  tokenIn: string;
  tokenOut: string;
  amountIn: string;
  walletAddress: string;
  toAddress: string;
  signerAddress: string;
  chainIdIn: number;
  chainIdOut: number;
  gasFeePaymentMethod: 'ADD_TO_AMOUNT' | 'DEDUCT_FROM_AMOUNT';
  transactionFeePercent?: number;
}

export interface TransferParams {
  amount: string;
  chainId: number;
  gasFeePaymentMethod: 'ADD_TO_AMOUNT' | 'DEDUCT_FROM_AMOUNT';
  payGasFeeToken: string;
  token: string;
  walletAddress: string;
  toAddress: string;
  transactionFeePercent?: number;
}

export interface ExecuteParams {
  quoteId: string;
  signature: string;
}
