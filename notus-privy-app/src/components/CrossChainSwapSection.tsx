"use client";

import { useCrossChainSwap } from '@/hooks/useCrossChainSwap';
import { useEffect, useState } from 'react';

interface CrossChainSwapSectionProps {
  walletAddress: string | null;
  title?: string;
  onSignMessage?: (message: string) => Promise<string>;
}

export function CrossChainSwapSection({ walletAddress, title = "🌉 Cross-Chain Swap", onSignMessage }: CrossChainSwapSectionProps) {
  const {
    quote,
    status,
    loading,
    error,
    executing,
    supportedChains,
    chainTokens,
    loadSupportedChains,
    loadChainTokens,
    createCrossChainQuote,
    executeCrossChainSwap,
    checkSwapStatus,
    clearQuote,
  } = useCrossChainSwap();

  const [swapParams, setSwapParams] = useState({
    tokenIn: '',
    tokenOut: '',
    amountIn: '',
    chainIdIn: 137, // Polygon
    chainIdOut: 1,  // Ethereum
    toAddress: '',
  });

  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);

  useEffect(() => {
    loadSupportedChains();
  }, [loadSupportedChains]);

  useEffect(() => {
    if (swapParams.chainIdIn) {
      loadChainTokens(swapParams.chainIdIn);
    }
  }, [swapParams.chainIdIn, loadChainTokens]);

  useEffect(() => {
    if (swapParams.chainIdOut) {
      loadChainTokens(swapParams.chainIdOut);
    }
  }, [swapParams.chainIdOut, loadChainTokens]);

  useEffect(() => {
    if (walletAddress) {
      setSwapParams(prev => ({ ...prev, toAddress: walletAddress }));
    }
  }, [walletAddress]);

  const handleCreateQuote = async () => {
    if (!walletAddress || !swapParams.tokenIn || !swapParams.tokenOut || !swapParams.amountIn) return;

    try {
      const quote = await createCrossChainQuote({
        ...swapParams,
        walletAddress,
        signerAddress: walletAddress,
        slippageTolerance: 0.5,
      });

      if (quote) {
        setSelectedQuoteId(quote.quoteId);
      }
    } catch (error) {
      console.error('Erro ao criar cotação:', error);
    }
  };

  const handleExecuteSwap = async () => {
    if (!quote || !onSignMessage) return;

    try {
      // Simular assinatura (em produção, usar onSignMessage)
      const mockSignature = `0x${'0'.repeat(130)}`;
      await executeCrossChainSwap(quote.quoteId, mockSignature);
      
      // Verificar status periodicamente
      if (quote.quoteId) {
        setSelectedQuoteId(quote.quoteId);
        const interval = setInterval(async () => {
          const currentStatus = await checkSwapStatus(quote.quoteId);
          if (currentStatus?.status === 'completed' || currentStatus?.status === 'failed') {
            clearInterval(interval);
          }
        }, 5000);
      }
    } catch (error) {
      console.error('Erro ao executar swap:', error);
    }
  };

  const handleCheckStatus = async () => {
    if (selectedQuoteId) {
      await checkSwapStatus(selectedQuoteId);
    }
  };

  if (!walletAddress) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        <button
          onClick={() => {
            loadSupportedChains();
            clearQuote();
          }}
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

      {/* Swap Form */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-900">Configurar Cross-Chain Swap</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* From Chain */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">
              Chain de Origem
            </label>
            <select
              value={swapParams.chainIdIn}
              onChange={(e) => setSwapParams(prev => ({ ...prev, chainIdIn: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Array.isArray(supportedChains) ? supportedChains.map((chain) => (
                <option key={chain.chainId} value={chain.chainId}>
                  {chain.name} {chain.isTestnet ? '(Testnet)' : ''}
                </option>
              )) : []}
            </select>
          </div>

          {/* To Chain */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">
              Chain de Destino
            </label>
            <select
              value={swapParams.chainIdOut}
              onChange={(e) => setSwapParams(prev => ({ ...prev, chainIdOut: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Array.isArray(supportedChains) ? supportedChains.map((chain) => (
                <option key={chain.chainId} value={chain.chainId}>
                  {chain.name} {chain.isTestnet ? '(Testnet)' : ''}
                </option>
              )) : []}
            </select>
          </div>

          {/* Token In */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">
              Token de Origem
            </label>
            <select
              value={swapParams.tokenIn}
              onChange={(e) => setSwapParams(prev => ({ ...prev, tokenIn: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione um token</option>
              {chainTokens[swapParams.chainIdIn]?.map((token) => (
                <option key={token.address} value={token.address}>
                  {token.symbol} - {token.name}
                </option>
              ))}
            </select>
          </div>

          {/* Token Out */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">
              Token de Destino
            </label>
            <select
              value={swapParams.tokenOut}
              onChange={(e) => setSwapParams(prev => ({ ...prev, tokenOut: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione um token</option>
              {chainTokens[swapParams.chainIdOut]?.map((token) => (
                <option key={token.address} value={token.address}>
                  {token.symbol} - {token.name}
                </option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-800 mb-1">
              Quantidade
            </label>
            <input
              type="number"
              value={swapParams.amountIn}
              onChange={(e) => setSwapParams(prev => ({ ...prev, amountIn: e.target.value }))}
              placeholder="0.0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mt-4 flex space-x-2">
          <button
            onClick={handleCreateQuote}
            disabled={loading || !swapParams.tokenIn || !swapParams.tokenOut || !swapParams.amountIn}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Criando Cotação...' : 'Criar Cotação'}
          </button>
          <button
            onClick={clearQuote}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Limpar
          </button>
        </div>
      </div>

      {/* Quote Display */}
      {quote && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-gray-900">📊 Cotação de Cross-Chain Swap</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-800">De</div>
              <div className="font-medium">
                {quote.amountIn} {quote.tokenIn.symbol} ({quote.tokenIn.chainId})
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-800">Para</div>
              <div className="font-medium">
                {quote.amountOut} {quote.tokenOut.symbol} ({quote.tokenOut.chainId})
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-800">Taxa</div>
              <div className="font-medium">{quote.rate}</div>
            </div>
            <div>
              <div className="text-sm text-gray-800">Slippage</div>
              <div className="font-medium">{quote.slippage}%</div>
            </div>
            <div>
              <div className="text-sm text-gray-800">Fee</div>
              <div className="font-medium">{quote.fee}</div>
            </div>
            <div>
              <div className="text-sm text-gray-800">Bridge Fee</div>
              <div className="font-medium">{quote.bridgeFee}</div>
            </div>
            <div>
              <div className="text-sm text-gray-800">Tempo Estimado</div>
              <div className="font-medium">{quote.estimatedTime}</div>
            </div>
          </div>

          {/* Route */}
          <div className="mt-4">
            <div className="text-sm text-gray-800 mb-2">Rota:</div>
            <div className="space-y-1">
              {quote.route.map((step, index) => (
                <div key={index} className="text-sm">
                  {index + 1}. {step.action} em {step.chainName} ({step.estimatedTime})
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 flex space-x-2">
            <button
              onClick={handleExecuteSwap}
              disabled={executing}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {executing ? 'Executando...' : 'Executar Swap'}
            </button>
            <button
              onClick={handleCheckStatus}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Verificar Status
            </button>
          </div>
        </div>
      )}

      {/* Status Display */}
      {status && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-gray-900">📈 Status do Swap</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-800">Status:</span>
              <span className={`font-medium ${
                status.status === 'completed' ? 'text-green-600' :
                status.status === 'failed' ? 'text-red-600' :
                'text-yellow-600'
              }`}>
                {status.status}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-800">Progresso:</span>
              <span className="text-gray-900">{status.currentStep}/{status.totalSteps}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-800">Chain Atual:</span>
              <span className="text-gray-900">{status.currentChain}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-800">Conclusão Estimada:</span>
              <span className="text-gray-900">{status.estimatedCompletion}</span>
            </div>
          </div>

          {status.transactionHashes.length > 0 && (
            <div className="mt-4">
              <div className="text-sm text-gray-800 mb-2">Transações:</div>
              <div className="space-y-1">
                {status.transactionHashes.map((tx, index) => (
                  <div key={index} className="text-sm text-gray-900">
                    Chain {tx.chainId}: {tx.hash.slice(0, 10)}...{tx.hash.slice(-8)} ({tx.status})
                  </div>
                ))}
              </div>
            </div>
          )}

          {status.error && (
            <div className="mt-4 p-2 bg-red-100 text-red-700 rounded text-sm">
              Erro: {status.error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
