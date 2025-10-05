"use client";

import { useState, useEffect } from 'react';

interface WebhookEvent {
  id: string;
  event_type: string;
  data: any;
  timestamp: string;
  received_at: string;
}

interface WebhookSectionProps {
  title?: string;
}

export function WebhookSection({ title = "🔗 Webhooks" }: WebhookSectionProps) {
  const [webhookEvents, setWebhookEvents] = useState<WebhookEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [showInstructions, setShowInstructions] = useState(true);

  useEffect(() => {
    // URL do webhook baseada no ambiente
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    setWebhookUrl(`${baseUrl}/api/webhooks`);
  }, []);

  const testWebhookEndpoint = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/webhooks');
      const data = await response.json();
      
      if (response.ok) {
        console.log('✅ Endpoint de webhook funcionando:', data);
      } else {
        throw new Error(data.error || 'Erro ao testar endpoint');
      }
    } catch (err) {
      console.error('❌ Erro ao testar webhook:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const copyWebhookUrl = () => {
    navigator.clipboard.writeText(webhookUrl);
    // Aqui você pode adicionar uma notificação de sucesso
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">{title}</h2>
        <div className="flex space-x-2">
          <button
            onClick={testWebhookEndpoint}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Testando...' : 'Testar Endpoint'}
          </button>
          <button
            onClick={() => setShowInstructions(!showInstructions)}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            {showInstructions ? 'Ocultar' : 'Mostrar'} Instruções
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Erro ao testar endpoint
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Instruções de Configuração */}
      {showInstructions && (
        <div className="mb-6 p-6 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-blue-900">
            📋 Como Configurar Webhooks
          </h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-blue-800 mb-2">1. Acesse o Dashboard da Notus</h4>
              <p className="text-blue-700 text-sm mb-2">
                Vá para <a href="https://dashboard.notus.team" target="_blank" rel="noopener noreferrer" className="underline">dashboard.notus.team</a> e faça login
              </p>
            </div>

            <div>
              <h4 className="font-medium text-blue-800 mb-2">2. Navegue para a seção Webhooks</h4>
              <p className="text-blue-700 text-sm mb-2">
                No menu lateral, clique em "Webhooks"
              </p>
            </div>

            <div>
              <h4 className="font-medium text-blue-800 mb-2">3. Crie um novo Webhook</h4>
              <p className="text-blue-700 text-sm mb-2">
                Clique em "Create Webhook" e configure:
              </p>
              <div className="ml-4 space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-blue-600">•</span>
                  <span className="text-blue-700 text-sm">
                    <strong>Webhook URL:</strong> 
                    <code className="bg-blue-100 px-2 py-1 rounded text-xs ml-1">
                      {webhookUrl}
                    </code>
                    <button
                      onClick={copyWebhookUrl}
                      className="ml-2 text-blue-600 hover:text-blue-800 text-xs underline"
                    >
                      (copiar)
                    </button>
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-blue-600">•</span>
                  <span className="text-blue-700 text-sm">
                    <strong>Eventos:</strong> Selecione os eventos que deseja receber
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-blue-800 mb-2">4. Eventos Disponíveis</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {[
                  'Swap',
                  'Cross swap', 
                  'Withdraw transfer',
                  'Deposit transfer',
                  'Add liquidity',
                  'KYC',
                  'On ramp',
                  'Off ramp'
                ].map((event) => (
                  <div key={event} className="flex items-center space-x-2">
                    <span className="text-green-600">✓</span>
                    <span className="text-blue-700">{event}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
              <h4 className="font-medium text-yellow-800 mb-1">⚠️ Importante</h4>
              <p className="text-yellow-700 text-sm">
                Certifique-se de que sua aplicação está rodando e acessível publicamente 
                para receber os webhooks da Notus.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Status do Endpoint */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">🔗 Status do Endpoint</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">URL do Webhook:</span>
            <code className="bg-gray-100 px-2 py-1 rounded text-sm">{webhookUrl}</code>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Status:</span>
            <span className="text-green-600 font-medium">✅ Ativo</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Validação de Assinatura:</span>
            <span className="text-green-600 font-medium">✅ Implementada</span>
          </div>
        </div>
      </div>

      {/* Eventos Recebidos */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">📨 Eventos Recebidos</h3>
        {webhookEvents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📭</div>
            <p>Nenhum evento recebido ainda</p>
            <p className="text-sm mt-1">
              Configure um webhook no Dashboard da Notus para começar a receber eventos
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {webhookEvents.map((event) => (
              <div key={event.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div className="flex-1">
                  <div className="font-medium">{event.event_type}</div>
                  <div className="text-sm text-gray-600">
                    ID: {event.id}
                  </div>
                  <div className="text-sm text-gray-500">
                    Recebido: {new Date(event.received_at).toLocaleString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm px-2 py-1 rounded bg-green-100 text-green-800">
                    Processado
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Informações Técnicas */}
      <div className="text-xs text-gray-500 mt-4">
        <p>🔧 Endpoint implementado com validação Svix e suporte a todos os eventos da Notus</p>
        <p>📚 Documentação: <a href="https://docs.notus.team/docs/guides/webhook-signature" target="_blank" rel="noopener noreferrer" className="underline">Notus Webhook Signature</a></p>
      </div>
    </div>
  );
}