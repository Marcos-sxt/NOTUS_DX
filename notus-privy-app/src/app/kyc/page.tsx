"use client";

import Link from 'next/link';
import { KYCRealFlow } from '@/components/KYCRealFlow';

export default function KYCPage() {
  // Para demonstração, usando um userId fixo
  // Em produção, isso viria da autenticação
  const userId = "demo-user-123";

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900 via-orange-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-white text-3xl font-bold">🆔 KYC & Ramp</h1>
          <Link
            href="/"
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
          >
            ← Voltar para Principal
          </Link>
        </div>
        
        <div className="grid gap-6">
          {/* KYC Section */}
          <KYCRealFlow userId={userId} />
          
          {/* Information Section */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">📚 Sobre KYC & Ramp</h2>
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold text-lg">KYC (Know Your Customer)</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>Básico:</strong> Verificação de identidade simples</li>
                  <li><strong>Avançado:</strong> Documentos adicionais e verificação de endereço</li>
                  <li><strong>Premium:</strong> Verificação completa com limites elevados</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg">Ramp (Fiat On/Off)</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>Depósito:</strong> Converter fiat (USD, BRL, EUR) para crypto</li>
                  <li><strong>Saque:</strong> Converter crypto para fiat</li>
                  <li><strong>Métodos:</strong> Cartão de crédito, transferência bancária, carteiras digitais</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg text-blue-800">🔒 Segurança e Compliance</h3>
                <p className="text-blue-700">
                  Todos os processos seguem regulamentações internacionais de AML/KYC, 
                  garantindo segurança e conformidade para usuários e instituições.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
