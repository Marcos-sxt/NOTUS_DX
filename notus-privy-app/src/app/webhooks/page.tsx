"use client";

import Link from 'next/link';
import { WebhookSection } from '@/components/WebhookSection';

export default function WebhooksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-white text-3xl font-bold">🔗 Webhooks Configuration</h1>
          <Link
            href="/"
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
          >
            ← Voltar para Principal
          </Link>
        </div>
        
        <div className="grid gap-6">
          {/* Webhook Section */}
          <WebhookSection title="🔗 Configuração de Webhooks" />
          
          {/* Information Section */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">📚 Sobre Webhooks</h2>
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold text-lg">O que são Webhooks?</h3>
                <p>
                  Webhooks são notificações em tempo real enviadas pela Notus API quando eventos específicos ocorrem. 
                  Eles permitem que sua aplicação reaja instantaneamente a mudanças no blockchain.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg">Eventos Disponíveis:</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>transaction.created</strong> - Nova transação criada</li>
                  <li><strong>transaction.completed</strong> - Transação confirmada</li>
                  <li><strong>transaction.failed</strong> - Transação falhou</li>
                  <li><strong>wallet.created</strong> - Nova smart wallet criada</li>
                  <li><strong>swap.completed</strong> - Swap executado com sucesso</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg">Como usar:</h3>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Configure um endpoint em sua aplicação para receber webhooks</li>
                  <li>Crie um webhook na interface acima</li>
                  <li>Selecione os eventos que deseja monitorar</li>
                  <li>Teste o webhook para garantir que está funcionando</li>
                  <li>Monitore os eventos em tempo real</li>
                </ol>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg text-blue-800">🔒 Segurança</h3>
                <p className="text-blue-700">
                  Configure um secret para validar a autenticidade dos webhooks. 
                  A Notus API incluirá uma assinatura HMAC no header para verificação.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
