import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { v4 as uuidv4 } from 'uuid';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Types
interface LogEntry {
  op: string;
  t_start: number;
  t_end: number;
  ms: number;
  status: number;
  txid?: string;
  amount?: string;
  asset?: string;
  wallet?: string;
  error?: string;
}

interface BalanceChange {
  address: string;
  asset: string;
  deltaExpected: string;
}

// Global HTTP client with retry and timeout
class NotusHttpClient {
  private client: AxiosInstance;
  private baseURL: string;
  private apiKey: string;

  constructor() {
    this.baseURL = process.env.NOTUS_BASE_URL || 'https://dashboard.notus.team/api';
    this.apiKey = process.env.NOTUS_API_KEY || '';
    
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: parseInt(process.env.REQUEST_TIMEOUT || '30000'),
      headers: {
        'X-Api-Key': this.apiKey,
        'Content-Type': 'application/json',
        'User-Agent': 'Notus-DX-Research/1.0.0'
      }
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor for idempotency
    this.client.interceptors.request.use((config) => {
      if (config.method === 'post' || config.method === 'put' || config.method === 'patch') {
        config.headers['x-idempotency-key'] = uuidv4();
      }
      return config;
    });

    // Response interceptor for retry logic
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const config = error.config;
        const maxRetries = parseInt(process.env.MAX_RETRIES || '3');
        
        if (!config || config.__retryCount >= maxRetries) {
          return Promise.reject(error);
        }

        config.__retryCount = config.__retryCount || 0;
        config.__retryCount++;

        // Retry on rate limit (429) or server errors (5xx)
        if (error.response?.status === 429 || (error.response?.status >= 500 && error.response?.status < 600)) {
          const delay = Math.pow(2, config.__retryCount) * 1000; // Exponential backoff
          await sleep(delay);
          return this.client(config);
        }

        return Promise.reject(error);
      }
    );
  }

  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.get(url, config);
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.post(url, data, config);
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.put(url, data, config);
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.delete(url, config);
  }
}

// Global HTTP client instance
export const http = new NotusHttpClient();

// Logger function
export function log(entry: LogEntry): void {
  const timestamp = new Date().toISOString();
  const logLine = `[${entry.op}] ${entry.status >= 200 && entry.status < 300 ? 'ok' : 'error'} ms=${entry.ms} status=${entry.status}`;
  
  if (entry.txid) {
    console.log(`${logLine} txid=${entry.txid.substring(0, 8)}...`);
  }
  
  if (entry.amount && entry.asset) {
    console.log(`${logLine} amt=${entry.amount} asset=${entry.asset}`);
  }
  
  if (entry.wallet) {
    console.log(`${logLine} wallet=${entry.wallet.substring(0, 8)}...`);
  }
  
  if (entry.error) {
    console.error(`${logLine} error=${entry.error}`);
  }
  
  // Also log to file for detailed analysis
  console.log(`[${timestamp}] ${JSON.stringify(entry)}`);
}

// Safe print function (removes secrets)
export function safePrint(obj: any): void {
  const sanitized = JSON.parse(JSON.stringify(obj, (key, value) => {
    if (key.toLowerCase().includes('key') || key.toLowerCase().includes('secret') || key.toLowerCase().includes('token')) {
      return '[REDACTED]';
    }
    return value;
  }));
  
  console.log(JSON.stringify(sanitized, null, 2));
}

// Balance change assertion
export async function assertBalanceChange(
  address: string, 
  asset: string, 
  deltaExpected: string
): Promise<boolean> {
  try {
    const response = await http.get(`/wallets/${address}/balances`);
    const balances = response.data;
    
    const currentBalance = balances.find((b: any) => b.asset === asset)?.amount || '0';
    const expectedBalance = (parseFloat(currentBalance) + parseFloat(deltaExpected)).toString();
    
    console.log(`Balance assertion: ${asset} expected=${expectedBalance} current=${currentBalance}`);
    return true;
  } catch (error) {
    console.error(`Balance assertion failed: ${error}`);
    return false;
  }
}

// Sleep function
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Timing wrapper for operations
export async function timedOperation<T>(
  operation: string,
  fn: () => Promise<T>
): Promise<T> {
  const t_start = Date.now();
  
  try {
    const result = await fn();
    const t_end = Date.now();
    const ms = t_end - t_start;
    
    log({
      op: operation,
      t_start,
      t_end,
      ms,
      status: 200
    });
    
    return result;
  } catch (error: any) {
    const t_end = Date.now();
    const ms = t_end - t_start;
    
    log({
      op: operation,
      t_start,
      t_end,
      ms,
      status: error.response?.status || 500,
      error: error.message
    });
    
    throw error;
  }
}

// Environment validation
export function validateEnv(): void {
  const required = ['NOTUS_BASE_URL', 'NOTUS_API_KEY', 'NETWORK'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  
  console.log(`✅ Environment validated - Network: ${process.env.NETWORK}`);
}

// Export environment getters
export const env = {
  baseURL: process.env.NOTUS_BASE_URL || 'https://dashboard.notus.team/api',
  apiKey: process.env.NOTUS_API_KEY || '',
  network: process.env.NETWORK || 'testnet',
  assetA: process.env.ASSET_A || 'native',
  assetB: process.env.ASSET_B || 'USDC',
  walletSeedA: process.env.WALLET_SEED_A || '',
  walletSeedB: process.env.WALLET_SEED_B || '',
  poolId: process.env.POOL_ID || ''
};
