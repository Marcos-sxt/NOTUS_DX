#!/usr/bin/env ts-node

import { http, env, timedOperation, safePrint, log } from '../utils';

interface SwapQuote {
  fromAsset: string;
  toAsset: string;
  fromAmount: string;
  toAmount: string;
  rate: string;
  slippage: string;
  fee: string;
  route: any[];
}

interface SwapRequest {
  wallet: string;
  fromAsset: string;
  toAsset: string;
  amount: string;
  slippageTolerance?: string;
  network: string;
}

interface SwapResponse {
  txid: string;
  status: string;
  fromAsset: string;
  toAsset: string;
  fromAmount: string;
  toAmount: string;
  slippage: string;
  fee: string;
}

async function getSwapQuote(fromAsset: string, toAsset: string, amount: string): Promise<SwapQuote> {
  return await timedOperation('swap-quote', async () => {
    const response = await http.get('/swaps/quote', {
      params: {
        fromAsset,
        toAsset,
        amount,
        network: env.network
      }
    });
    
    const quote = response.data;
    log({
      op: 'swap-quote',
      t_start: Date.now(),
      t_end: Date.now(),
      ms: 0,
      status: response.status,
      amount: quote.fromAmount,
      asset: `${quote.fromAsset}->${quote.toAsset}`
    });
    
    return quote;
  });
}

async function executeSwap(swapRequest: SwapRequest): Promise<SwapResponse> {
  return await timedOperation('swap-execute', async () => {
    const response = await http.post('/swaps', swapRequest);
    const swap = response.data;
    
    log({
      op: 'swap-execute',
      t_start: Date.now(),
      t_end: Date.now(),
      ms: 0,
      status: response.status,
      txid: swap.txid,
      amount: swap.fromAmount,
      asset: `${swap.fromAsset}->${swap.toAsset}`
    });
    
    return swap;
  });
}

async function getWalletBalance(address: string, asset: string): Promise<string> {
  const response = await http.get(`/wallets/${address}/balances`);
  const balances = response.data;
  const balance = balances.find((b: any) => b.asset === asset);
  return balance ? balance.amount : '0';
}

async function swapOperations() {
  console.log('🔄 Notus Labs DX Research - Swap Operations');
  console.log('==========================================');
  
  try {
    // Use wallet from previous operations
    const walletAddress = 'WALLET_A_ADDRESS'; // This should be set from previous script
    
    console.log(`\n1️⃣ Using Wallet: ${walletAddress}`);
    
    // Check initial balances
    console.log('\n2️⃣ Checking Initial Balances...');
    const balanceA_before = await getWalletBalance(walletAddress, env.assetA);
    const balanceB_before = await getWalletBalance(walletAddress, env.assetB);
    
    console.log(`Initial ${env.assetA}: ${balanceA_before}`);
    console.log(`Initial ${env.assetB}: ${balanceB_before}`);
    
    // Get swap quote
    console.log('\n3️⃣ Getting Swap Quote...');
    const swapAmount = '1.0'; // Small amount for testing
    const quote = await getSwapQuote(env.assetA, env.assetB, swapAmount);
    
    console.log('📊 Swap Quote:');
    console.log(`From: ${quote.fromAmount} ${quote.fromAsset}`);
    console.log(`To: ${quote.toAmount} ${quote.toAsset}`);
    console.log(`Rate: 1 ${quote.fromAsset} = ${quote.rate} ${quote.toAsset}`);
    console.log(`Slippage: ${quote.slippage}%`);
    console.log(`Fee: ${quote.fee} ${quote.fromAsset}`);
    console.log(`Route: ${quote.route.length} hops`);
    
    // Execute swap
    console.log('\n4️⃣ Executing Swap...');
    const swapRequest: SwapRequest = {
      wallet: walletAddress,
      fromAsset: env.assetA,
      toAsset: env.assetB,
      amount: swapAmount,
      slippageTolerance: '0.5', // 0.5% slippage tolerance
      network: env.network
    };
    
    const swap = await executeSwap(swapRequest);
    
    console.log('✅ Swap Executed:');
    console.log(`Transaction ID: ${swap.txid}`);
    console.log(`From: ${swap.fromAmount} ${swap.fromAsset}`);
    console.log(`To: ${swap.toAmount} ${swap.toAsset}`);
    console.log(`Actual Slippage: ${swap.slippage}%`);
    console.log(`Fee Paid: ${swap.fee} ${swap.fromAsset}`);
    console.log(`Status: ${swap.status}`);
    
    // Wait for transaction confirmation
    console.log('\n5️⃣ Waiting for Transaction Confirmation...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Check final balances
    console.log('\n6️⃣ Checking Final Balances...');
    const balanceA_after = await getWalletBalance(walletAddress, env.assetA);
    const balanceB_after = await getWalletBalance(walletAddress, env.assetB);
    
    console.log(`Final ${env.assetA}: ${balanceA_after}`);
    console.log(`Final ${env.assetB}: ${balanceB_after}`);
    
    // Calculate actual changes
    const deltaA = parseFloat(balanceA_after) - parseFloat(balanceA_before);
    const deltaB = parseFloat(balanceB_after) - parseFloat(balanceB_before);
    
    console.log(`\n📈 Balance Changes:`);
    console.log(`${env.assetA} change: ${deltaA}`);
    console.log(`${env.assetB} change: ${deltaB}`);
    
    // Validate swap execution
    console.log('\n7️⃣ Validating Swap Execution...');
    const expectedDecrease = parseFloat(swapAmount) + parseFloat(swap.fee);
    const actualDecrease = Math.abs(deltaA);
    
    if (Math.abs(actualDecrease - expectedDecrease) < 0.001) {
      console.log('✅ Swap validation passed');
    } else {
      console.log('⚠️ Swap validation failed - check amounts and fees');
    }
    
    // Save screenshot info
    console.log('\n📸 Screenshot Info:');
    console.log('File: assets/screenshots/swap-executed.png');
    console.log('Content: Swap transaction details and balance changes');
    
    return {
      wallet: walletAddress,
      swap,
      balances: {
        A_before: balanceA_before,
        A_after: balanceA_after,
        B_before: balanceB_before,
        B_after: balanceB_after
      },
      quote
    };
    
  } catch (error: any) {
    console.error('❌ Swap operations failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  swapOperations();
}
