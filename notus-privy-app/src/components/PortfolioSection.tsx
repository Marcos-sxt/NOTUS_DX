"use client";

import { usePortfolio } from '@/hooks/usePortfolio';
import { useEffect } from 'react';

interface PortfolioSectionProps {
  walletAddress: string | null;
  title?: string;
}

export function PortfolioSection({ walletAddress, title = "Portfolio & Histórico" }: PortfolioSectionProps) {
  const { portfolio, history, loading, error, loadPortfolio, loadHistory, refreshData } = usePortfolio(walletAddress);

  useEffect(() => {
    if (walletAddress) {
      loadPortfolio();
      loadHistory();
    }
  }, [walletAddress, loadPortfolio, loadHistory]);

  if (!walletAddress) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        <button
          onClick={refreshData}
          disabled={loading}
          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Atualizando...' : 'Atualizar'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          ❌ Erro: {error}
        </div>
      )}

      {loading && !portfolio && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-800">Carregando dados...</p>
        </div>
      )}

      {/* Portfolio Section */}
      {portfolio && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-900">💰 Portfolio</h3>
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="text-2xl font-bold text-green-600">
              ${parseFloat(portfolio.totalValueUSD).toFixed(2)} USD
            </div>
            <div className="text-sm text-gray-800">Valor Total</div>
          </div>
          
          <div className="space-y-2">
            {portfolio.tokens.map((token, index) => (
              <div key={`token-${token.address}-${index}`} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div>
                  <div className="font-medium">{token.symbol}</div>
                  <div className="text-sm text-gray-800">{token.name}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">
                    {parseFloat(token.balance).toFixed(6)} {token.symbol}
                  </div>
                  <div className="text-sm text-gray-800">
                    ${parseFloat(token.balanceUSD).toFixed(2)} USD
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transaction History Section */}
      {history && (
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-900">📜 Histórico de Transações</h3>
          <div className="text-sm text-gray-800 mb-3">
            Total: {history.total} transações
          </div>
          
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {history.transactions.map((tx, index) => (
              <div key={`tx-${tx.id || tx.hash}-${index}`} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div className="flex-1">
                  <div className="font-medium text-sm">
                    {tx.type} - {tx.status}
                  </div>
                  <div className="text-xs text-gray-800 font-mono">
                    {tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}
                  </div>
                  <div className="text-xs text-gray-700">
                    {new Date(tx.timestamp).toLocaleString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">
                    {parseFloat(tx.amount).toFixed(6)} {tx.token}
                  </div>
                  <div className="text-xs text-gray-800">
                    {tx.from.slice(0, 6)}...{tx.to.slice(-4)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
