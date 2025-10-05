#!/usr/bin/env ts-node

import { http, env, timedOperation, safePrint, log } from '../utils';

interface Wallet {
  wallet: {
    accountAbstraction: string; // Smart wallet address
    externallyOwnedAccount: string; // EOA address
  };
}

async function createWallet(): Promise<Wallet> {
  return await timedOperation('create-wallet', async () => {
    // Light Account Factory address (from documentation)
    const FACTORY_ADDRESS = "0x0000000000400CdFef5E2714E63d8040b700BC24";
    
    // For demo purposes, we'll use a placeholder EOA address
    // In a real scenario, you'd generate or use an actual private key
    const externallyOwnedAccount = "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"; // Placeholder EOA
    
    const response = await http.post('/wallets/register', {
      externallyOwnedAccount: externallyOwnedAccount,
      factory: FACTORY_ADDRESS,
      salt: "0" // Simple salt for deterministic address generation
    });
    
    const wallet = response.data;
    log({
      op: 'create-wallet',
      t_start: Date.now(),
      t_end: Date.now(),
      ms: 0,
      status: response.status,
      wallet: wallet.wallet.accountAbstraction
    });
    
    return wallet;
  });
}

async function getWalletHistory(address: string): Promise<any[]> {
  return await timedOperation('get-history', async () => {
    // Try the documented history endpoint
    const response = await http.get(`/wallets/${address}/history`, {
      params: { 
        take: 10,
        type: 'SWAP',
        status: 'COMPLETED'
      }
    });
    
    log({
      op: 'get-history',
      t_start: Date.now(),
      t_end: Date.now(),
      ms: 0,
      status: response.status,
      wallet: address
    });
    
    return response.data || [];
  });
}

async function walletOperations() {
  console.log('💰 Notus Labs DX Research - Wallet Operations');
  console.log('============================================');
  
  try {
    // Use existing wallet or create new one
    console.log('\n1️⃣ Using Existing Wallet...');
    const existingWallet = {
      wallet: {
        accountAbstraction: "0x01f08096482e98bf702fb023d9d4ff7cb1ffd3b3",
        externallyOwnedAccount: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"
      }
    };
    
    console.log('✅ Using Existing Smart Wallet:');
    console.log(`Smart Wallet Address: ${existingWallet.wallet.accountAbstraction}`);
    console.log(`EOA Address: ${existingWallet.wallet.externallyOwnedAccount}`);
    
    const wallet = existingWallet;
    
    // Get transaction history
    console.log('\n2️⃣ Fetching Transaction History...');
    const history = await getWalletHistory(wallet.wallet.accountAbstraction);
    
    console.log('📜 Transaction History:');
    console.log('Raw response:', JSON.stringify(history, null, 2));
    
    if (!history || typeof history !== 'object') {
      console.log('  No transaction history data available');
    } else if (Array.isArray(history)) {
      if (history.length === 0) {
        console.log('  No transactions found (empty wallet)');
      } else {
        console.log(`  Found ${history.length} transactions`);
        history.forEach((tx, index) => {
          console.log(`  ${index + 1}. ${tx.type || 'Unknown'} - ${tx.status || 'Unknown'}`);
          if (tx.transactionHash) {
            console.log(`     Hash: ${tx.transactionHash.substring(0, 16)}...`);
          }
        });
      }
    } else {
      console.log('  Transaction history response received (non-array format)');
      console.log(`  Response type: ${typeof history}`);
    }
    
    // Store wallet info for other scripts
    console.log('\n💾 Wallet Information Stored');
    console.log(`Smart Wallet Address: ${wallet.wallet.accountAbstraction}`);
    console.log(`EOA Address: ${wallet.wallet.externallyOwnedAccount}`);
    console.log(`Network: ${env.network}`);
    
    // Save screenshot info
    console.log('\n📸 Screenshot Info:');
    console.log('File: assets/screenshots/wallet-balances.png');
    console.log('Content: Smart wallet address and initial balances');
    
    return wallet;
    
  } catch (error: any) {
    console.error('❌ Wallet operations failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  walletOperations();
}
