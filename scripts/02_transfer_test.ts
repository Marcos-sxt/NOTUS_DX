#!/usr/bin/env ts-node

import { http, env, timedOperation, safePrint, log } from '../utils';

async function testTransferQuote() {
  console.log('💸 Notus Labs DX Research - Transfer Quote Test');
  console.log('===============================================');
  
  try {
    // Test transfer quote endpoint
    console.log('\n1️⃣ Testing Transfer Quote...');
    
    const transferRequest = {
      amount: "1",
      chainId: 137, // Polygon
      gasFeePaymentMethod: "ADD_TO_AMOUNT",
      payGasFeeToken: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", // USDC Polygon
      token: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", // USDC Polygon
      walletAddress: "0x01f08096482e98bf702fb023d9d4ff7cb1ffd3b3", // Our smart wallet
      toAddress: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6", // EOA address
      transactionFeePercent: 0
    };
    
    const response = await timedOperation('transfer-quote', async () => {
      return await http.post('/crypto/transfer', transferRequest);
    });
    
    console.log('✅ Transfer Quote Response:');
    safePrint(response.data);
    
    return response.data;
    
  } catch (error: any) {
    console.error('❌ Transfer quote test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    throw error;
  }
}

async function testSwapQuote() {
  console.log('🔄 Notus Labs DX Research - Swap Quote Test');
  console.log('===========================================');
  
  try {
    // Test swap quote endpoint
    console.log('\n1️⃣ Testing Swap Quote...');
    
    const swapRequest = {
      amount: "1",
      chainId: 137, // Polygon
      gasFeePaymentMethod: "ADD_TO_AMOUNT",
      payGasFeeToken: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", // USDC Polygon
      tokenIn: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", // USDC Polygon
      tokenOut: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270", // WMATIC Polygon
      walletAddress: "0x01f08096482e98bf702fb023d9d4ff7cb1ffd3b3", // Our smart wallet
      transactionFeePercent: 0
    };
    
    const response = await timedOperation('swap-quote', async () => {
      return await http.post('/crypto/swap', swapRequest);
    });
    
    console.log('✅ Swap Quote Response:');
    safePrint(response.data);
    
    return response.data;
    
  } catch (error: any) {
    console.error('❌ Swap quote test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    throw error;
  }
}

async function testCrossSwapQuote() {
  console.log('🌉 Notus Labs DX Research - Cross-Swap Quote Test');
  console.log('=================================================');
  
  try {
    // Test cross-swap quote endpoint
    console.log('\n1️⃣ Testing Cross-Swap Quote...');
    
    const crossSwapRequest = {
      amount: "1",
      chainInId: 137, // Polygon
      chainOutId: 1, // Ethereum
      gasFeePaymentMethod: "ADD_TO_AMOUNT",
      payGasFeeToken: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", // USDC Polygon
      tokenIn: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", // USDC Polygon
      tokenOut: "0xA0b86a33E6441b8c4C8C0e4B8b8c4C8C0e4B8b8c4", // USDC Ethereum (placeholder)
      walletAddress: "0x01f08096482e98bf702fb023d9d4ff7cb1ffd3b3", // Our smart wallet
      transactionFeePercent: 0
    };
    
    const response = await timedOperation('cross-swap-quote', async () => {
      return await http.post('/crypto/cross-swap', crossSwapRequest);
    });
    
    console.log('✅ Cross-Swap Quote Response:');
    safePrint(response.data);
    
    return response.data;
    
  } catch (error: any) {
    console.error('❌ Cross-swap quote test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    throw error;
  }
}

async function testAllEndpoints() {
  console.log('🧪 Notus Labs DX Research - Testing All Documented Endpoints');
  console.log('===========================================================');
  
  try {
    // Test transfer quote
    await testTransferQuote();
    
    console.log('\n' + '='.repeat(60) + '\n');
    
    // Test swap quote
    await testSwapQuote();
    
    console.log('\n' + '='.repeat(60) + '\n');
    
    // Test cross-swap quote
    await testCrossSwapQuote();
    
    console.log('\n🎉 All endpoint tests completed!');
    
  } catch (error: any) {
    console.error('❌ Endpoint testing failed:', error.message);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  testAllEndpoints();
}




