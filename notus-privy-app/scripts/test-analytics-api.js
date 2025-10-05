/**
 * 🧪 Teste dos Endpoints Reais de Analytics da Notus API
 * Script para validar que os endpoints de analytics estão funcionando
 */

import ky from 'ky';

// Configuração da API Notus
const notusAPI = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_NOTUS_API_URL || 'https://api.notus.team/api/v1',
  headers: {
    'X-Api-Key': process.env.NEXT_PUBLIC_NOTUS_API_KEY || '',
    'Content-Type': 'application/json',
  },
});

async function testAnalyticsEndpoints() {
  console.log('🧪 TESTANDO ENDPOINTS REAIS DE ANALYTICS DA NOTUS API\n');

  const endpoints = [
    {
      name: 'Overview Analytics',
      method: 'GET',
      path: 'analytics/overview',
      params: { period: '30d' }
    },
    {
      name: 'Transaction Metrics',
      method: 'GET', 
      path: 'analytics/transactions',
      params: { period: '30d' }
    },
    {
      name: 'User Metrics',
      method: 'GET',
      path: 'analytics/users', 
      params: { period: '30d' }
    },
    {
      name: 'Liquidity Metrics',
      method: 'GET',
      path: 'analytics/liquidity',
      params: { period: '30d' }
    },
    {
      name: 'Swap Metrics',
      method: 'GET',
      path: 'analytics/swaps',
      params: { period: '30d' }
    }
  ];

  const results = [];

  for (const endpoint of endpoints) {
    try {
      console.log(`📊 Testando ${endpoint.name}...`);
      
      const startTime = Date.now();
      const response = await notusAPI.get(endpoint.path, {
        searchParams: endpoint.params
      }).json();
      const duration = Date.now() - startTime;

      results.push({
        endpoint: endpoint.name,
        status: 'SUCCESS',
        duration: `${duration}ms`,
        dataReceived: !!response,
        responseKeys: Object.keys(response || {}),
        error: null
      });

      console.log(`✅ ${endpoint.name}: SUCESSO (${duration}ms)`);
      console.log(`   Dados recebidos: ${Object.keys(response || {}).length} propriedades`);
      console.log(`   Resposta:`, JSON.stringify(response, null, 2).substring(0, 200) + '...\n');

    } catch (error) {
      results.push({
        endpoint: endpoint.name,
        status: 'ERROR',
        duration: 'N/A',
        dataReceived: false,
        responseKeys: [],
        error: error.message
      });

      console.log(`❌ ${endpoint.name}: ERRO`);
      console.log(`   Erro: ${error.message}`);
      console.log(`   Status: ${error.response?.status || 'N/A'}\n`);
    }
  }

  // Relatório final
  console.log('📋 RELATÓRIO FINAL DOS TESTES DE ANALYTICS\n');
  console.log('='.repeat(60));
  
  const successCount = results.filter(r => r.status === 'SUCCESS').length;
  const errorCount = results.filter(r => r.status === 'ERROR').length;
  
  console.log(`Total de endpoints testados: ${results.length}`);
  console.log(`Sucessos: ${successCount}`);
  console.log(`Erros: ${errorCount}`);
  console.log(`Taxa de sucesso: ${((successCount / results.length) * 100).toFixed(1)}%\n`);

  results.forEach(result => {
    const status = result.status === 'SUCCESS' ? '✅' : '❌';
    console.log(`${status} ${result.endpoint}: ${result.status}`);
    if (result.status === 'ERROR') {
      console.log(`   Erro: ${result.error}`);
    } else {
      console.log(`   Duração: ${result.duration}`);
      console.log(`   Propriedades: ${result.responseKeys.join(', ')}`);
    }
    console.log('');
  });

  if (errorCount > 0) {
    console.log('⚠️  ATENÇÃO: Alguns endpoints retornaram erro.');
    console.log('   Isso pode indicar que:');
    console.log('   1. Os endpoints de analytics não estão disponíveis na API');
    console.log('   2. A API key não tem permissão para acessar analytics');
    console.log('   3. Os endpoints têm uma estrutura diferente da documentação');
    console.log('   4. A API está temporariamente indisponível\n');
  }

  console.log('🎯 CONCLUSÃO:');
  if (successCount === results.length) {
    console.log('✅ Todos os endpoints de Analytics estão funcionando perfeitamente!');
    console.log('✅ A implementação está pronta para o relatório de testes.');
  } else if (successCount > 0) {
    console.log('⚠️  Alguns endpoints funcionam, outros não.');
    console.log('⚠️  Verifique a documentação da API para endpoints corretos.');
  } else {
    console.log('❌ Nenhum endpoint de Analytics está funcionando.');
    console.log('❌ Verifique a configuração da API e a documentação.');
  }

  return results;
}

// Executar testes
testAnalyticsEndpoints()
  .then(results => {
    process.exit(results.filter(r => r.status === 'ERROR').length > 0 ? 1 : 0);
  })
  .catch(error => {
    console.error('💥 Erro fatal nos testes:', error);
    process.exit(1);
  });
