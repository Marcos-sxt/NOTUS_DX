/**
 * 🧪 Teste dos Endpoints de Webhooks da Notus API
 * Script para validar se os endpoints de webhooks estão funcionando
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_NOTUS_API_URL || 'https://api.notus.team/api/v1';
const API_KEY = process.env.NEXT_PUBLIC_NOTUS_API_KEY || '';

async function testWebhooksEndpoints() {
  console.log('🧪 TESTANDO ENDPOINTS DE WEBHOOKS DA NOTUS API\n');
  console.log(`🔗 Base URL: ${API_BASE_URL}`);
  console.log(`🔑 API Key: ${API_KEY ? 'CONFIGURADA' : 'NÃO CONFIGURADA'}\n`);

  const endpoints = [
    { name: 'Listar Webhooks', path: '/webhooks', method: 'GET' },
    { name: 'Criar Webhook', path: '/webhooks', method: 'POST' },
    { name: 'Webhook Details', path: '/webhooks/test-id', method: 'GET' },
    { name: 'Atualizar Webhook', path: '/webhooks/test-id', method: 'PUT' },
    { name: 'Deletar Webhook', path: '/webhooks/test-id', method: 'DELETE' },
    { name: 'Webhook Events', path: '/webhooks/test-id/events', method: 'GET' },
    { name: 'Testar Webhook', path: '/webhooks/test-id/test', method: 'POST' },
  ];

  const results = [];
  const errorCounts = {};

  for (const endpoint of endpoints) {
    const url = `${API_BASE_URL}${endpoint.path}`;
    console.log(`🔗 Testando ${endpoint.name}...`);
    console.log(`   URL: ${url}`);
    console.log(`   Method: ${endpoint.method}`);
    const startTime = process.hrtime.bigint();

    try {
      const options = {
        method: endpoint.method,
        headers: {
          'X-Api-Key': API_KEY,
          'Content-Type': 'application/json',
        },
      };

      // Para POST/PUT, adicionar body de teste
      if (endpoint.method === 'POST' || endpoint.method === 'PUT') {
        options.body = JSON.stringify({
          url: 'https://example.com/webhook',
          events: ['transaction.completed'],
        });
      }

      const response = await fetch(url, options);

      const endTime = process.hrtime.bigint();
      const durationMs = Number(endTime - startTime) / 1_000_000;

      if (response.ok) {
        const data = await response.json();
        console.log(`✅ ${endpoint.name}: SUCESSO (${response.status})`);
        results.push({ name: endpoint.name, status: 'SUCCESS', httpStatus: response.status, duration: durationMs, data });
      } else {
        const errorData = await response.json();
        console.log(`❌ ${endpoint.name}: ERRO (${response.status})`);
        console.log(`   Erro: ${JSON.stringify(errorData)}`);
        results.push({ name: endpoint.name, status: 'ERROR', httpStatus: response.status, duration: durationMs, error: errorData });
        errorCounts[response.status] = (errorCounts[response.status] || 0) + 1;
      }
    } catch (error) {
      const endTime = process.hrtime.bigint();
      const durationMs = Number(endTime - startTime) / 1_000_000;
      console.log(`💥 ${endpoint.name}: EXCEÇÃO`);
      console.log(`   Erro: ${error.message}`);
      results.push({ name: endpoint.name, status: 'EXCEPTION', duration: durationMs, error: error.message });
      errorCounts['EXCEPTION'] = (errorCounts['EXCEPTION'] || 0) + 1;
      console.log(`   Duração: ${durationMs.toFixed(0)}ms\n`);
    }
  }

  console.log('📋 RELATÓRIO FINAL DOS TESTES DE WEBHOOKS\n');
  console.log('============================================================');
  const successfulTests = results.filter(r => r.status === 'SUCCESS').length;
  const errorTests = results.filter(r => r.status === 'ERROR' || r.status === 'EXCEPTION').length;
  const totalTests = results.length;

  console.log(`Total de endpoints testados: ${totalTests}`);
  console.log(`Sucessos: ${successfulTests}`);
  console.log(`Erros: ${errorTests}`);
  console.log(`Taxa de sucesso: ${(successfulTests / totalTests * 100).toFixed(1)}%\n`);

  results.forEach(r => {
    if (r.status !== 'SUCCESS') {
      console.log(`❌ ${r.name}: ${r.status} (${r.httpStatus || 'N/A'})`);
      console.log(`   Erro: ${r.httpStatus ? `HTTP ${r.httpStatus}: ${JSON.stringify(r.error)}` : r.error}\n`);
    }
  });

  if (Object.keys(errorCounts).length > 0) {
    console.log('⚠️  ANÁLISE DOS ERROS:');
    for (const status in errorCounts) {
      console.log(`   ${status}: ${errorCounts[status]} endpoint(s)`);
    }
    console.log('\n💡 POSSÍVEIS CAUSAS:');
    console.log('   1. Os endpoints de webhooks não estão disponíveis na API');
    console.log('   2. A API key não tem permissão para acessar webhooks');
    console.log('   3. Os endpoints têm uma estrutura diferente da documentação');
    console.log('   4. A API está temporariamente indisponível');
    console.log('   5. Os endpoints requerem parâmetros diferentes');
  }

  console.log('\n🎯 CONCLUSÃO:');
  if (successfulTests === totalTests) {
    console.log('✅ Todos os endpoints de Webhooks estão funcionando corretamente.');
  } else if (successfulTests > 0) {
    console.log('⚠️  Alguns endpoints de Webhooks estão funcionando, mas outros falharam.');
  } else {
    console.log('❌ Nenhum endpoint de Webhooks está funcionando.');
  }
  console.log('❌ Verifique a configuração da API e a documentação.\n');
  console.log('🏁 Teste finalizado.\n');

  return results;
}

testWebhooksEndpoints()
  .then(results => {
    process.exit(results.filter(r => r.status === 'ERROR' || r.status === 'EXCEPTION').length > 0 ? 1 : 0);
  })
  .catch(error => {
    console.error('💥 Erro fatal nos testes:', error);
    process.exit(1);
  });
