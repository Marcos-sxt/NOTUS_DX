#!/usr/bin/env ts-node

import { http, env, timedOperation, safePrint, log } from '../utils';
import * as fs from 'fs';
import * as path from 'path';

interface Portfolio {
  totalValue: string;
  assets: Array<{
    asset: string;
    amount: string;
    value: string;
    price: string;
    percentage: string;
  }>;
  lastUpdated: string;
}

interface Transaction {
  txid: string;
  type: string;
  asset: string;
  amount: string;
  from: string;
  to: string;
  timestamp: string;
  status: string;
  fee?: string;
}

interface HistoryResponse {
  transactions: Transaction[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

async function getPortfolio(walletAddress: string): Promise<Portfolio> {
  return await timedOperation('get-portfolio', async () => {
    const response = await http.get(`/wallets/${walletAddress}/portfolio`);
    
    log({
      op: 'get-portfolio',
      t_start: Date.now(),
      t_end: Date.now(),
      ms: 0,
      status: response.status,
      wallet: walletAddress
    });
    
    return response.data;
  });
}

async function getTransactionHistory(
  walletAddress: string, 
  page: number = 1, 
  limit: number = 50
): Promise<HistoryResponse> {
  return await timedOperation('get-history', async () => {
    const response = await http.get(`/wallets/${walletAddress}/history`, {
      params: { page, limit }
    });
    
    log({
      op: 'get-history',
      t_start: Date.now(),
      t_end: Date.now(),
      ms: 0,
      status: response.status,
      wallet: walletAddress
    });
    
    return response.data;
  });
}

function exportToCSV(transactions: Transaction[], filename: string): void {
  const csvHeader = 'txid,type,asset,amount,from,to,timestamp,status,fee\n';
  const csvRows = transactions.map(tx => 
    `${tx.txid},${tx.type},${tx.asset},${tx.amount},${tx.from},${tx.to},${tx.timestamp},${tx.status},${tx.fee || ''}`
  ).join('\n');
  
  const csvContent = csvHeader + csvRows;
  
  // Ensure assets directory exists
  const assetsDir = path.join(__dirname, '../assets');
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }
  
  const filepath = path.join(assetsDir, filename);
  fs.writeFileSync(filepath, csvContent);
  
  console.log(`📄 CSV exported: ${filepath}`);
}

async function portfolioOperations() {
  console.log('📊 Notus Labs DX Research - Portfolio & History Operations');
  console.log('=======================================================');
  
  try {
    // Use wallet from previous operations
    const walletAddress = 'WALLET_A_ADDRESS'; // This should be set from previous script
    
    console.log(`\n1️⃣ Analyzing Wallet: ${walletAddress}`);
    
    // Get portfolio
    console.log('\n2️⃣ Fetching Portfolio...');
    const portfolio = await getPortfolio(walletAddress);
    
    console.log('💼 Portfolio Overview:');
    console.log(`Total Value: $${portfolio.totalValue}`);
    console.log(`Last Updated: ${portfolio.lastUpdated}`);
    console.log(`Assets Count: ${portfolio.assets.length}`);
    
    if (portfolio.assets.length === 0) {
      console.log('  No assets in portfolio');
    } else {
      console.log('\n📈 Asset Breakdown:');
      portfolio.assets.forEach(asset => {
        console.log(`  ${asset.asset}: ${asset.amount} ($${asset.value}) - ${asset.percentage}%`);
        console.log(`    Price: $${asset.price}`);
      });
    }
    
    // Get transaction history
    console.log('\n3️⃣ Fetching Transaction History...');
    const history = await getTransactionHistory(walletAddress, 1, 100);
    
    console.log('📜 Transaction History:');
    console.log(`Total Transactions: ${history.total}`);
    console.log(`Page: ${history.page}/${Math.ceil(history.total / history.limit)}`);
    console.log(`Has More: ${history.hasMore}`);
    
    if (history.transactions.length === 0) {
      console.log('  No transactions found');
    } else {
      console.log('\n🔄 Recent Transactions:');
      history.transactions.slice(0, 10).forEach((tx, index) => {
        console.log(`  ${index + 1}. ${tx.type.toUpperCase()} - ${tx.amount} ${tx.asset}`);
        console.log(`     TXID: ${tx.txid.substring(0, 16)}...`);
        console.log(`     From: ${tx.from.substring(0, 8)}...`);
        console.log(`     To: ${tx.to.substring(0, 8)}...`);
        console.log(`     Time: ${tx.timestamp}`);
        console.log(`     Status: ${tx.status}`);
        if (tx.fee) {
          console.log(`     Fee: ${tx.fee}`);
        }
        console.log('');
      });
    }
    
    // Export to CSV
    console.log('\n4️⃣ Exporting Transaction History to CSV...');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const csvFilename = `transaction-history-${timestamp}.csv`;
    exportToCSV(history.transactions, csvFilename);
    
    // Analyze transaction types
    console.log('\n5️⃣ Transaction Analysis...');
    const typeCounts = history.transactions.reduce((acc, tx) => {
      acc[tx.type] = (acc[tx.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    console.log('Transaction Types:');
    Object.entries(typeCounts).forEach(([type, count]) => {
      console.log(`  ${type}: ${count} transactions`);
    });
    
    // Calculate total volume
    const totalVolume = history.transactions.reduce((sum, tx) => {
      return sum + parseFloat(tx.amount);
    }, 0);
    
    console.log(`\nTotal Volume: ${totalVolume} (across all assets)`);
    
    // Save screenshot info
    console.log('\n📸 Screenshot Info:');
    console.log('File: assets/screenshots/portfolio-overview.png');
    console.log('Content: Portfolio breakdown and asset distribution');
    console.log(`CSV Export: assets/${csvFilename}`);
    
    return {
      wallet: walletAddress,
      portfolio,
      history,
      analysis: {
        totalTransactions: history.total,
        transactionTypes: typeCounts,
        totalVolume,
        csvExported: csvFilename
      }
    };
    
  } catch (error: any) {
    console.error('❌ Portfolio operations failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  portfolioOperations();
}
