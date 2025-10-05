#!/usr/bin/env ts-node

import { http, env, timedOperation, safePrint, log, assertBalanceChange } from '../utils';

interface TransferRequest {
  from: string;
  to: string;
  asset: string;
  amount: string;
  network: string;
}

interface TransferResponse {
  txid: string;
  status: string;
  amount: string;
  asset: string;
  from: string;
  to: string;
}

async function createSecondWallet(): Promise<string> {
  return await timedOperation('create-second-wallet', async () => {
    const response = await http.post('/wallets', {
      network: env.network,
      seed: env.walletSeedB || undefined
    });
    
    const wallet = response.data;
    log({
      op: 'create-second-wallet',
      t_start: Date.now(),
      t_end: Date.now(),
      ms: 0,
      status: response.status,
      wallet: wallet.address
    });
    
    return wallet.address;
  });
}

async function getWalletBalance(address: string, asset: string): Promise<string> {
  const response = await http.get(`/wallets/${address}/balances`);
  const balances = response.data;
  const balance = balances.find((b: any) => b.asset === asset);
  return balance ? balance.amount : '0';
}

async function transferFunds(from: string, to: string, asset: string, amount: string): Promise<TransferResponse> {
  return await timedOperation('transfer', async () => {
    const transferRequest: TransferRequest = {
      from,
      to,
      asset,
      amount,
      network: env.network
    };
    
    const response = await http.post('/transfers', transferRequest);
    const transfer = response.data;
    
    log({
      op: 'transfer',
      t_start: Date.now(),
      t_end: Date.now(),
      ms: 0,
      status: response.status,
      txid: transfer.txid,
      amount: transfer.amount,
      asset: transfer.asset,
      wallet: from
    });
    
    return transfer;
  });
}

async function transferOperations() {
  console.log('💸 Notus Labs DX Research - Transfer Operations');
  console.log('===============================================');
  
  try {
    // Create second wallet
    console.log('\n1️⃣ Creating Second Wallet...');
    const walletB = await createSecondWallet();
    console.log(`✅ Second Wallet Created: ${walletB}`);
    
    // For demo purposes, we'll use the first wallet as sender
    // In a real scenario, you'd need to fund it first
    const walletA = 'WALLET_A_ADDRESS'; // This should be set from previous script
    
    console.log('\n2️⃣ Checking Initial Balances...');
    const balanceA_before = await getWalletBalance(walletA, env.assetA);
    const balanceB_before = await getWalletBalance(walletB, env.assetA);
    
    console.log(`Wallet A (${walletA.substring(0, 8)}...): ${balanceA_before} ${env.assetA}`);
    console.log(`Wallet B (${walletB.substring(0, 8)}...): ${balanceB_before} ${env.assetA}`);
    
    // Perform transfer
    console.log('\n3️⃣ Performing Transfer...');
    const transferAmount = '1.0'; // Small amount for testing
    const transfer = await transferFunds(walletA, walletB, env.assetA, transferAmount);
    
    console.log('✅ Transfer Completed:');
    console.log(`Transaction ID: ${transfer.txid}`);
    console.log(`Amount: ${transfer.amount} ${transfer.asset}`);
    console.log(`From: ${transfer.from}`);
    console.log(`To: ${transfer.to}`);
    console.log(`Status: ${transfer.status}`);
    
    // Wait a moment for transaction to be processed
    console.log('\n4️⃣ Waiting for Transaction Confirmation...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check balances after transfer
    console.log('\n5️⃣ Checking Final Balances...');
    const balanceA_after = await getWalletBalance(walletA, env.assetA);
    const balanceB_after = await getWalletBalance(walletB, env.assetA);
    
    console.log(`Wallet A (${walletA.substring(0, 8)}...): ${balanceA_after} ${env.assetA}`);
    console.log(`Wallet B (${walletB.substring(0, 8)}...): ${balanceB_after} ${env.assetA}`);
    
    // Validate balance changes
    console.log('\n6️⃣ Validating Balance Changes...');
    const deltaA = parseFloat(balanceA_after) - parseFloat(balanceA_before);
    const deltaB = parseFloat(balanceB_after) - parseFloat(balanceB_before);
    
    console.log(`Wallet A change: ${deltaA} ${env.assetA}`);
    console.log(`Wallet B change: ${deltaB} ${env.assetA}`);
    
    if (Math.abs(deltaA + deltaB) < 0.0001) { // Account for potential fees
      console.log('✅ Balance validation passed (conservation of funds)');
    } else {
      console.log('⚠️ Balance validation failed - check for fees or errors');
    }
    
    // Save screenshot info
    console.log('\n📸 Screenshot Info:');
    console.log('File: assets/screenshots/transfer-completed.png');
    console.log('Content: Transfer transaction details and balance changes');
    
    return {
      walletA,
      walletB,
      transfer,
      balances: {
        A_before: balanceA_before,
        A_after: balanceA_after,
        B_before: balanceB_before,
        B_after: balanceB_after
      }
    };
    
  } catch (error: any) {
    console.error('❌ Transfer operations failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  transferOperations();
}
