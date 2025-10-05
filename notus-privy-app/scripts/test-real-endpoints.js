const fetch = require('node-fetch');
require('dotenv').config({ path: '../.env.local' });

const BASE_URL = process.env.NEXT_PUBLIC_NOTUS_API_URL;
const API_KEY = process.env.NEXT_PUBLIC_NOTUS_API_KEY;

async function testEndpoint(name, url, options = {}) {
  const startTime = process.hrtime.bigint();
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'x-api-key': API_KEY,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    const endTime = process.hrtime.bigint();
    const durationMs = Number(endTime - startTime) / 1_000_000;
    const data = await response.json();

    if (response.ok) {
      console.log(`✅ ${name} - ${response.status} - ${durationMs}ms`);
      console.log(`📦 Resposta: ${JSON.stringify(data, null, 2)}`);
      return { success: true, durationMs, status: response.status, data };
    } else {
      console.log(`❌ ${name} - ${response.status} - ${durationMs}ms`);
      console.log(`   Erro: ${JSON.stringify(data)}`);
      return { success: false, durationMs, status: response.status, error: data };
    }
  } catch (error) {
    const endTime = process.hrtime.bigint();
    const durationMs = Number(endTime - startTime) / 1_000_000;
    console.log(`❌ ${name} - ERRO - ${durationMs}ms`);
    console.log(`   Erro: ${error.message}`);
    return { success: false, durationMs, status: 0, error: error.message };
  }
}

async function runRealTests() {
  console.log('🔍 TESTANDO APENAS ENDPOINTS REAIS');
  console.log(`📡 Base URL: ${BASE_URL}`);
  console.log(`🔑 API Key: ${API_KEY ? API_KEY.substring(0, 10) + '...' : 'NÃO ENCONTRADA'}`);

  if (!API_KEY) {
    console.error('❌ NEXT_PUBLIC_NOTUS_API_KEY não encontrada');
    return;
  }

  console.log('\n🎯 TESTANDO ENDPOINTS CONFIRMADOS NA DOCUMENTAÇÃO\n');

  const results = [];

  // TESTE 1: GET /liquidity/amounts (CONFIRMADO NA DOCS)
  console.log('============================================================');
  console.log('💧 TESTE 1: GET /liquidity/amounts');
  console.log('============================================================');
  const amountsParams = new URLSearchParams({
    chainId: '137',
    token0: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    token1: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
    token0MaxAmount: '200',
    token1MaxAmount: '300',
    poolFeePercent: '0.01',
    minPrice: '0.98',
    maxPrice: '1.02',
    payGasFeeToken: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    gasFeePaymentMethod: 'ADD_TO_AMOUNT'
  });
  
  results.push(await testEndpoint(
    'GET /liquidity/amounts',
    `${BASE_URL}/liquidity/amounts?${amountsParams.toString()}`,
    { method: 'GET' }
  ));

  console.log('\n============================================================');
  console.log('📊 RESUMO DOS TESTES');
  console.log('============================================================');
  
  const successCount = results.filter(r => r.success).length;
  const totalCount = results.length;
  
  console.log(`✅ Sucessos: ${successCount}/${totalCount}`);
  console.log(`❌ Falhas: ${totalCount - successCount}`);
  
  if (successCount === totalCount) {
    console.log('🎉 TODOS OS ENDPOINTS TESTADOS ESTÃO FUNCIONANDO!');
  } else {
    console.log('⚠️  ALGUNS ENDPOINTS TÊM PROBLEMAS');
  }
}

runRealTests();
