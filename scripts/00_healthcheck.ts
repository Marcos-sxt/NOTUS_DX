#!/usr/bin/env ts-node

import { http, validateEnv, env, timedOperation, safePrint } from '../utils';

async function healthCheck() {
  console.log('🔍 Notus Labs DX Research - Health Check');
  console.log('=====================================');
  
  try {
    // Validate environment
    validateEnv();
    
    // Test API connectivity with wallets endpoint
    await timedOperation('healthcheck', async () => {
      const response = await http.get('/wallets');
      console.log('✅ API Health Check:', response.status);
      safePrint(response.data);
    });
    
    // Display configuration
    console.log('\n📋 Configuration:');
    console.log(`Base URL: ${env.baseURL}`);
    console.log(`Network: ${env.network}`);
    console.log(`Asset A: ${env.assetA}`);
    console.log(`Asset B: ${env.assetB}`);
    console.log(`API Key: ${env.apiKey ? '✅ Set' : '❌ Missing'}`);
    
    console.log('\n🎯 Ready to start DX research!');
    
  } catch (error: any) {
    console.error('❌ Health check failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  healthCheck();
}
