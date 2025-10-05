#!/usr/bin/env node

/**
 * 🧪 Teste dos Endpoints de Liquidity Pools
 * Testa se os endpoints documentados estão ativos
 */

const API_BASE = 'https://api.notus.team/api/v1';
const API_KEY = process.env.NEXT_PUBLIC_NOTUS_API_KEY;

if (!API_KEY) {
  console.error('❌ NEXT_PUBLIC_NOTUS_API_KEY não encontrada');
  process.exit(1);
}

console.log('🔍 Testando endpoints de Liquidity Pools...');
console.log('📡 Base URL:', API_BASE);
console.log('🔑 API Key:', API_KEY.substring(0, 10) + '...');

async function testEndpoint(method, endpoint, params = {}) {
  const url = `${API_BASE}${endpoint}`;
  const startTime = Date.now();
  
  try {
    console.log(`\n📡 Testando ${method} ${endpoint}...`);
    
    const options = {
      method,
      headers: {
        'x-api-key': API_KEY,
        'Content-Type': 'application/json'
      }
    };

    if (method === 'GET' && Object.keys(params).length > 0) {
      const searchParams = new URLSearchParams(params);
      const fullUrl = `${url}?${searchParams}`;
      console.log(`🔗 URL completa: ${fullUrl}`);
      
      const response = await fetch(fullUrl, options);
      const duration = Date.now() - startTime;
      
      console.log(`⏱️  Tempo: ${duration}ms`);
      console.log(`📊 Status: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Sucesso! Resposta:`, JSON.stringify(data, null, 2));
        return { success: true, data, duration };
      } else {
        const errorText = await response.text();
        console.log(`❌ Erro:`, errorText);
        return { success: false, error: errorText, duration };
      }
    } else if (method === 'POST') {
      options.body = JSON.stringify(params);
      console.log(`📦 Body:`, JSON.stringify(params, null, 2));
      
      const response = await fetch(url, options);
      const duration = Date.now() - startTime;
      
      console.log(`⏱️  Tempo: ${duration}ms`);
      console.log(`📊 Status: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Sucesso! Resposta:`, JSON.stringify(data, null, 2));
        return { success: true, data, duration };
      } else {
        const errorText = await response.text();
        console.log(`❌ Erro:`, errorText);
        return { success: false, error: errorText, duration };
      }
    }
  } catch (error) {
    const duration = Date.now() - startTime;
    console.log(`💥 Erro de rede:`, error.message);
    return { success: false, error: error.message, duration };
  }
}

async function runTests() {
  console.log('\n🎯 INICIANDO TESTES DOS ENDPOINTS DOCUMENTADOS\n');
  
  const results = [];
  
  // Teste 1: GET /liquidity/amounts (endpoint documentado)
  console.log('='.repeat(60));
  console.log('📋 TESTE 1: GET /liquidity/amounts');
  console.log('='.repeat(60));
  
  const amountsParams = {
    chainId: 137,
    token0: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', // USDC
    token1: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', // USDT
    token0MaxAmount: 200,
    token1MaxAmount: 300,
    poolFeePercent: 0.01,
    minPrice: '0.98',
    maxPrice: '1.02',
    payGasFeeToken: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    gasFeePaymentMethod: 'ADD_TO_AMOUNT'
  };
  
  const amountsResult = await testEndpoint('GET', '/liquidity/amounts', amountsParams);
  results.push({ endpoint: 'GET /liquidity/amounts', ...amountsResult });
  
  // Teste 2: POST /liquidity/create (endpoint documentado)
  console.log('\n' + '='.repeat(60));
  console.log('📋 TESTE 2: POST /liquidity/create');
  console.log('='.repeat(60));
  
  const createParams = {
    walletAddress: '0x6e397ddf51d9f15dbe0414538e7529f51f2e5464', // Wallet de teste
    toAddress: '0x6e397ddf51d9f15dbe0414538e7529f51f2e5464',
    chainId: 137,
    payGasFeeToken: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    gasFeePaymentMethod: 'ADD_TO_AMOUNT',
    token0: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    token1: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
    poolFeePercent: 0.01,
    token0Amount: '200',
    token1Amount: '199.59920435476736768744',
    minPrice: '0.98',
    maxPrice: '1.02',
    slippageTolerance: 0.5
  };
  
  const createResult = await testEndpoint('POST', '/liquidity/create', createParams);
  results.push({ endpoint: 'POST /liquidity/create', ...createResult });
  
  // Teste 3: POST /crypto/execute-user-op (endpoint documentado)
  console.log('\n' + '='.repeat(60));
  console.log('📋 TESTE 3: POST /crypto/execute-user-op');
  console.log('='.repeat(60));
  
  const executeParams = {
    userOperationHash: '0x592b6d58aea182a9e4bfb58c93999b5b01bb465dfeda3867e364ee933660feb1', // Hash de teste
    signature: '0x1b2c3d4e5f6789abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
  };
  
  const executeResult = await testEndpoint('POST', '/crypto/execute-user-op', executeParams);
  results.push({ endpoint: 'POST /crypto/execute-user-op', ...executeResult });
  
  // Resumo dos resultados
  console.log('\n' + '='.repeat(60));
  console.log('📊 RESUMO DOS TESTES');
  console.log('='.repeat(60));
  
  results.forEach((result, index) => {
    const status = result.success ? '✅' : '❌';
    const time = `${result.duration}ms`;
    console.log(`${status} ${result.endpoint} - ${time}`);
    if (!result.success) {
      console.log(`   Erro: ${result.error}`);
    }
  });
  
  const successCount = results.filter(r => r.success).length;
  const totalCount = results.length;
  
  console.log(`\n🎯 RESULTADO FINAL: ${successCount}/${totalCount} endpoints funcionando`);
  
  if (successCount === totalCount) {
    console.log('🎉 TODOS OS ENDPOINTS ESTÃO FUNCIONANDO!');
  } else {
    console.log('⚠️  ALGUNS ENDPOINTS TÊM PROBLEMAS');
  }
}

// Executar testes
runTests().catch(console.error);
