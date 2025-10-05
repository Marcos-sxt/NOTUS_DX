"use client";

import { useLiquidity } from '@/hooks/useLiquidity';
import { useEffect, useState } from 'react';

interface LiquiditySectionProps {
  walletAddress: string | null;
  title?: string;
  onSignMessage?: (message: string) => Promise<string>;
}

export function LiquiditySection({ walletAddress, title = "💧 Liquidity Pools", onSignMessage }: LiquiditySectionProps) {
  const {
    amounts,
    position,
    loading,
    error,
    creatingPosition,
    executing,
    calculateTokenAmounts,
    createPosition,
    executeUserOperation,
    clearState,
  } = useLiquidity(walletAddress);

  // Estados do formulário
  const [formData, setFormData] = useState({
    chainId: 137, // Polygon
    token0: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', // USDC
    token1: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', // USDT
    token0MaxAmount: 200,
    token1MaxAmount: 300,
    poolFeePercent: 0.01,
    minPrice: '0.98',
    maxPrice: '1.02',
    payGasFeeToken: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', // USDC
    gasFeePaymentMethod: 'ADD_TO_AMOUNT' as const,
    slippageTolerance: 0.5,
  });

  const handleCalculateAmounts = async () => {
    try {
      await calculateTokenAmounts(formData);
    } catch (error) {
      console.error('Erro ao calcular quantidades:', error);
    }
  };

  const handleCreatePosition = async () => {
    if (!amounts || !walletAddress) return;

    try {
      // Usar quantidades calculadas (token0MaxAmount como exemplo)
      const positionParams = {
        ...formData,
        token0Amount: amounts.amounts.token0MaxAmount.token0Amount,
        token1Amount: amounts.amounts.token0MaxAmount.token1Amount,
      };

      await createPosition(positionParams);
    } catch (error) {
      console.error('Erro ao criar posição:', error);
    }
  };

  const handleExecutePosition = async () => {
    if (!position || !onSignMessage) return;

    try {
      // Assinar a mensagem
      const signature = await onSignMessage(position.userOperationHash);
      
      // Executar User Operation
      await executeUserOperation(position.userOperationHash, signature);
    } catch (error) {
      console.error('Erro ao executar posição:', error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        <button
          onClick={clearState}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Limpar
        </button>
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
                Erro
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Formulário de Configuração */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">
          📋 Configuração da Posição
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">
              Token 0 (USDC)
            </label>
            <input
              type="text"
              value={formData.token0}
              onChange={(e) => setFormData(prev => ({ ...prev, token0: e.target.value }))}
              className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">
              Token 1 (USDT)
            </label>
            <input
              type="text"
              value={formData.token1}
              onChange={(e) => setFormData(prev => ({ ...prev, token1: e.target.value }))}
              className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">
              Quantidade Máxima Token 0
            </label>
            <input
              type="number"
              value={formData.token0MaxAmount}
              onChange={(e) => setFormData(prev => ({ ...prev, token0MaxAmount: Number(e.target.value) }))}
              className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">
              Quantidade Máxima Token 1
            </label>
            <input
              type="number"
              value={formData.token1MaxAmount}
              onChange={(e) => setFormData(prev => ({ ...prev, token1MaxAmount: Number(e.target.value) }))}
              className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">
              Taxa do Pool (%)
            </label>
            <select
              value={formData.poolFeePercent}
              onChange={(e) => setFormData(prev => ({ ...prev, poolFeePercent: Number(e.target.value) }))}
              className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={0.01}>0.01%</option>
              <option value={0.05}>0.05%</option>
              <option value={0.3}>0.3%</option>
              <option value={1}>1%</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">
              Faixa de Preço Mín
            </label>
            <input
              type="text"
              value={formData.minPrice}
              onChange={(e) => setFormData(prev => ({ ...prev, minPrice: e.target.value }))}
              className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">
              Faixa de Preço Máx
            </label>
            <input
              type="text"
              value={formData.maxPrice}
              onChange={(e) => setFormData(prev => ({ ...prev, maxPrice: e.target.value }))}
              className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">
              Slippage (%)
            </label>
            <input
              type="number"
              value={formData.slippageTolerance}
              onChange={(e) => setFormData(prev => ({ ...prev, slippageTolerance: Number(e.target.value) }))}
              className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="mt-4 flex space-x-2">
          <button
            onClick={handleCalculateAmounts}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Calculando...' : '1. Calcular Quantidades'}
          </button>
        </div>
      </div>

      {/* Resultado do Cálculo */}
      {amounts && (
        <div className="mb-6 p-4 bg-green-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-gray-900">
            📊 Quantidades Calculadas
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-800">Token 0 Max Amount</h4>
              <p className="text-green-700">
                Token 0: {amounts.amounts.token0MaxAmount.token0Amount}
              </p>
              <p className="text-green-700">
                Token 1: {amounts.amounts.token0MaxAmount.token1Amount}
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-800">Token 1 Max Amount</h4>
              <p className="text-green-700">
                Token 0: {amounts.amounts.token1MaxAmount.token0Amount}
              </p>
              <p className="text-green-700">
                Token 1: {amounts.amounts.token1MaxAmount.token1Amount}
              </p>
            </div>
          </div>
          <div className="mt-3">
            <p className="text-green-700">
              <strong>Preço do Pool:</strong> {amounts.poolPrice}
            </p>
          </div>
          
          <div className="mt-4">
            <button
              onClick={handleCreatePosition}
              disabled={creatingPosition}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {creatingPosition ? 'Criando...' : '2. Criar Posição'}
            </button>
          </div>
        </div>
      )}

      {/* Posição Criada */}
      {position && (
        <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-gray-900">
            🎯 Posição Criada
          </h3>
          <div className="space-y-2">
            <p className="text-yellow-800">
              <strong>User Operation Hash:</strong> {position.userOperationHash}
            </p>
            <p className="text-yellow-800">
              <strong>Expira em:</strong> {new Date(position.expiresAt).toLocaleString()}
            </p>
          </div>
          
          <div className="mt-4">
            <button
              onClick={handleExecutePosition}
              disabled={executing || !onSignMessage}
              className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 disabled:opacity-50"
            >
              {executing ? 'Executando...' : '3. Executar Posição'}
            </button>
          </div>
        </div>
      )}

      {/* Informações Técnicas */}
      <div className="text-xs text-gray-800 mt-4">
        <p>🔧 Implementação baseada na documentação oficial da Notus API</p>
        <p>📚 Endpoints utilizados: /liquidity/amounts, /liquidity/create, /crypto/execute-user-op</p>
        <p>⚠️ Suporte atual: Uniswap v3 na rede Polygon (Chain ID: 137)</p>
      </div>
    </div>
  );
}