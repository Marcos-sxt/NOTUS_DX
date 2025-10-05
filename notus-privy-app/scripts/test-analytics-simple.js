/**
 * 🧪 Teste Simples dos Endpoints de Analytics da Notus API
 * Script para validar que os endpoints de analytics estão funcionando
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_NOTUS_API_URL || 'https://api.notus.team/api/v1';
const API_KEY = process.env.NEXT_PUBLIC_NOTUS_API_KEY || '';

async function testAnalyticsEndpoints() {
  console.log('🧪 TESTANDO ENDPOINTS REAIS DE ANALYTICS DA NOTUS API\n');
  console.log(`🔗 Base URL: ${API_BASE_URL}`);
  console.log(`🔑 API Key: ${API_KEY ? 'Configurada' : 'NÃO CONFIGURADA'}\n`);

  const endpoints = [
    {
      name: 'Overview Analytics',
      path: '/analytics/overview',
      params: '?period=30d'
    },
    {
      name: 'Transaction Metrics',
      path: '/analytics/transactions',
      params: '?period=30d'
    },
    {
      name: 'User Metrics',
      path: '/analytics/users',
      params: '?period=30d'
    },
    {
      name: 'Liquidity Metrics',
      path: '/analytics/liquidity',
      params: '?period=30d'
    },
    {
      name: 'Swap Metrics',
      path: '/analytics/swaps',
      params: '?period=30d'
    }
  ];

  const results = [];

  for (const endpoint of endpoints) {
    try {
      console.log(`📊 Testando ${endpoint.name}...`);
      
      const url = `${API_BASE_URL}${endpoint.path}${endpoint.params}`;
      console.log(`   URL: ${url}`);
      
      const startTime = Date.now();
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'X-Api-Key': API_KEY,
          'Content-Type': 'application/json',
        },
      });
      const duration = Date.now() - startTime;

      if (response.ok) {
        const data = await response.json();
        results.push({
          endpoint: endpoint.name,
          status: 'SUCCESS',
          statusCode: response.status,
          duration: `${duration}ms`,
          dataReceived: !!data,
          responseKeys: Object.keys(data || {}),
          error: null
        });

        console.log(`✅ ${endpoint.name}: SUCESSO (${response.status}) - ${duration}ms`);
        console.log(`   Dados recebidos: ${Object.keys(data || {}).length} propriedades`);
        console.log(`   Resposta:`, JSON.stringify(data, null, 2).substring(0, 200) + '...\n');

      } else {
        const errorText = await response.text();
        results.push({
          endpoint: endpoint.name,
          status: 'ERROR',
          statusCode: response.status,
          duration: `${duration}ms`,
          dataReceived: false,
          responseKeys: [],
          error: `HTTP ${response.status}: ${errorText}`
        });

        console.log(`❌ ${endpoint.name}: ERRO (${response.status})`);
        console.log(`   Erro: ${errorText}`);
        console.log(`   Duração: ${duration}ms\n`);
      }

    } catch (error) {
      results.push({
        endpoint: endpoint.name,
        status: 'ERROR',
        statusCode: 'N/A',
        duration: 'N/A',
        dataReceived: false,
        responseKeys: [],
        error: error.message
      });

      console.log(`💥 ${endpoint.name}: ERRO FATAL`);
      console.log(`   Erro: ${error.message}\n`);
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
    console.log(`${status} ${result.endpoint}: ${result.status} (${result.statusCode})`);
    if (result.status === 'ERROR') {
      console.log(`   Erro: ${result.error}`);
    } else {
      console.log(`   Duração: ${result.duration}`);
      console.log(`   Propriedades: ${result.responseKeys.join(', ')}`);
    }
    console.log('');
  });

  if (errorCount > 0) {
    console.log('⚠️  ANÁLISE DOS ERROS:');
    const statusCodes = [...new Set(results.filter(r => r.status === 'ERROR').map(r => r.statusCode))];
    statusCodes.forEach(code => {
      const count = results.filter(r => r.statusCode === code).length;
      console.log(`   HTTP ${code}: ${count} endpoint(s)`);
    });
    
    console.log('\n💡 POSSÍVEIS CAUSAS:');
    console.log('   1. Os endpoints de analytics não estão disponíveis na API');
    console.log('   2. A API key não tem permissão para acessar analytics');
    console.log('   3. Os endpoints têm uma estrutura diferente da documentação');
    console.log('   4. A API está temporariamente indisponível');
    console.log('   5. Os endpoints requerem parâmetros diferentes\n');
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
    const hasErrors = results.filter(r => r.status === 'ERROR').length > 0;
    console.log(`\n🏁 Teste finalizado. ${hasErrors ? 'Alguns erros encontrados.' : 'Todos os testes passaram!'}`);
    process.exit(hasErrors ? 1 : 0);
  })
  .catch(error => {
    console.error('💥 Erro fatal nos testes:', error);
    process.exit(1);
  });
