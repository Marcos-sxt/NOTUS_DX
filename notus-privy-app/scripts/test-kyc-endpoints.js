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

async function runKYCTests() {
  console.log('🔍 TESTANDO ENDPOINTS DE KYC');
  console.log(`📡 Base URL: ${BASE_URL}`);
  console.log(`🔑 API Key: ${API_KEY ? API_KEY.substring(0, 10) + '...' : 'NÃO ENCONTRADA'}`);

  if (!API_KEY) {
    console.error('❌ NEXT_PUBLIC_NOTUS_API_KEY não encontrada');
    return;
  }

  console.log('\n🎯 TESTANDO ENDPOINTS DE KYC IMPLEMENTADOS\n');

  const results = [];

  // TESTE 1: POST /kyc/individual-verification-sessions/standard (Criar sessão KYC)
  console.log('============================================================');
  console.log('🆔 TESTE 1: POST /kyc/individual-verification-sessions/standard');
  console.log('============================================================');
  const createSessionBody = {
    firstName: "João",
    lastName: "Silva",
    birthDate: "1990-01-01",
    documentId: "12345678901",
    documentCategory: "IDENTITY_CARD",
    documentCountry: "BRAZIL",
    livenessRequired: true,
    email: "joao.silva@example.com",
    address: "Rua das Flores, 123",
    city: "São Paulo",
    state: "SP",
    postalCode: "01234-567"
  };
  
  results.push(await testEndpoint(
    'POST /kyc/individual-verification-sessions/standard',
    `${BASE_URL}/kyc/individual-verification-sessions/standard`,
    { method: 'POST', body: JSON.stringify(createSessionBody) }
  ));

  // TESTE 2: GET /kyc/individual-verification-sessions/standard/:sessionId (Verificar status)
  console.log('\n============================================================');
  console.log('🆔 TESTE 2: GET /kyc/individual-verification-sessions/standard/:sessionId');
  console.log('============================================================');
  const mockSessionId = "mock-session-id-123";
  
  results.push(await testEndpoint(
    'GET /kyc/individual-verification-sessions/standard/:sessionId',
    `${BASE_URL}/kyc/individual-verification-sessions/standard/${mockSessionId}`,
    { method: 'GET' }
  ));

  // TESTE 3: POST /kyc/individual-verification-sessions/standard/:sessionId/process (Finalizar)
  console.log('\n============================================================');
  console.log('🆔 TESTE 3: POST /kyc/individual-verification-sessions/standard/:sessionId/process');
  console.log('============================================================');
  
  results.push(await testEndpoint(
    'POST /kyc/individual-verification-sessions/standard/:sessionId/process',
    `${BASE_URL}/kyc/individual-verification-sessions/standard/${mockSessionId}/process`,
    { method: 'POST' }
  ));

  console.log('\n============================================================');
  console.log('📊 RESUMO DOS TESTES DE KYC');
  console.log('============================================================');
  
  const successCount = results.filter(r => r.success).length;
  const totalCount = results.length;
  
  console.log(`✅ Sucessos: ${successCount}/${totalCount}`);
  console.log(`❌ Falhas: ${totalCount - successCount}`);
  
  if (successCount === totalCount) {
    console.log('🎉 TODOS OS ENDPOINTS DE KYC ESTÃO FUNCIONANDO!');
  } else {
    console.log('⚠️  ALGUNS ENDPOINTS DE KYC TÊM PROBLEMAS');
  }
}

runKYCTests();
