import axios from 'axios';

const notusClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_NOTUS_API_URL || 'https://api.notus.team/api/v1',
  headers: {
    'X-Api-Key': process.env.NEXT_PUBLIC_NOTUS_API_KEY || '',
    'Content-Type': 'application/json',
  },
});

export interface SmartWallet {
  accountAbstraction: string;
  externallyOwnedAccount: string;
}

export interface TransferQuote {
  amountIn: string;
  amountOut: string;
  tokenIn: string;
  tokenOut: string;
  rate: string;
  slippage: string;
  fee: string;
  quoteId: string;
}

export interface ExecuteResponse {
  userOpHash: string;
  status: string;
  transactionHash?: string;
}

export class NotusAPI {
  // Registrar smart wallet
  static async registerSmartWallet(eoa: string): Promise<SmartWallet> {
    const FACTORY_ADDRESS = "0x0000000000400CdFef5E2714E63d8040b700BC24";
    
    const response = await notusClient.post('/wallets/register', {
      externallyOwnedAccount: eoa,
      factory: FACTORY_ADDRESS,
      salt: "0"
    });

    return response.data.wallet;
  }

  // Verificar se smart wallet existe
  static async getSmartWalletAddress(eoa: string): Promise<SmartWallet | null> {
    try {
      const FACTORY_ADDRESS = "0x0000000000400CdFef5E2714E63d8040b700BC24";
      
      const response = await notusClient.get('/wallets/address', {
        params: {
          externallyOwnedAccount: eoa,
          factory: FACTORY_ADDRESS,
          salt: "0"
        }
      });

      return response.data.wallet;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error && 
          error.response && typeof error.response === 'object' && 'status' in error.response &&
          error.response.status === 404) {
        return null;
      }
      throw error;
    }
  }

  // Gerar cotação de transfer
  static async getTransferQuote(
    smartWalletAddress: string,
    eoa: string,
    amount: string = "1"
  ): Promise<TransferQuote> {
    const USDC_POLYGON = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
    
    const response = await notusClient.post('/crypto/transfer', {
      amount,
      chainId: 137,
      gasFeePaymentMethod: "DEDUCT_FROM_AMOUNT",
      payGasFeeToken: USDC_POLYGON,
      token: USDC_POLYGON,
      walletAddress: smartWalletAddress,
      toAddress: "0x1234567890123456789012345678901234567890",
      transactionFeePercent: 0
    });

    return response.data;
  }

  // Executar UserOperation
  static async executeUserOperation(quoteId: string, signature: string): Promise<ExecuteResponse> {
    const response = await notusClient.post('/crypto/execute-user-op', {
      quoteId,
      signature
    });

    return response.data;
  }
}
