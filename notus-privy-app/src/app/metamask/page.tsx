"use client";

import Link from 'next/link';
import { useMetaMask } from '@/hooks/useMetaMask';
import { useMetaMaskSwap } from '@/hooks/useMetaMaskSwap';
import { TEST_TOKENS } from '@/lib/actions/transfer';
import { PortfolioSection } from '@/components/PortfolioSection';
import { LiquiditySection } from '@/components/LiquiditySection';
import { CrossChainSwapSection } from '@/components/CrossChainSwapSection';

export default function MetaMaskPage() {
  const { 
    account, 
    connected, 
    externallyOwnedAccount, 
    smartWallet, 
    loading, 
    error, 
    connect, 
    disconnect, 
    registerSmartWallet,
    isMetaMaskAvailable 
  } = useMetaMask();

  const { 
    quote, 
    loading: swapLoading, 
    error: swapError, 
    executing, 
    result,
    generateSwapQuote, 
    signAndExecute, 
    clearState 
  } = useMetaMaskSwap(account, externallyOwnedAccount);

  if (!isMetaMaskAvailable) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-white text-4xl font-bold mb-8">MetaMask + Notus API Integration</h1>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">
            ❌ MetaMask não está instalado ou não está disponível
          </div>
          <p className="text-gray-300 mb-8">
            Instale a extensão MetaMask para continuar
          </p>
          <Link
            href="/"
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
          >
            ← Voltar para Privy
          </Link>
        </div>
      </div>
    );
  }

  if (!connected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-white text-4xl font-bold mb-8">MetaMask + Notus API Integration</h1>
          <p className="text-gray-300 mb-8">Conecte sua carteira MetaMask para começar</p>
          <button
            onClick={connect}
            disabled={loading}
            className="bg-orange-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-orange-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Conectando...' : 'Conectar MetaMask'}
          </button>
          <div className="mt-4">
            <Link
              href="/"
              className="text-gray-400 hover:text-gray-200 transition-colors"
            >
              ← Voltar para Privy
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-900 via-blue-900 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-white text-3xl font-bold">MetaMask + Notus API Integration</h1>
          <Link
            href="/"
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
          >
            ← Voltar para Privy
          </Link>
        </div>
        
        <div className="grid gap-6">
          {/* User Information */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Informações da Carteira</h2>
            <div className="space-y-2">
              <div><strong>Endereço EOA:</strong> {externallyOwnedAccount}</div>
              <div><strong>Provedor:</strong> MetaMask</div>
              <div><strong>Rede:</strong> Polygon Mainnet</div>
            </div>
            <button
              onClick={disconnect}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Desconectar
            </button>
          </div>

          {/* Smart Wallet Section */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Smart Wallet</h2>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                ❌ Erro: {error}
              </div>
            )}
            
            {smartWallet ? (
              <div className="space-y-2">
                <div><strong>Smart Wallet:</strong> {smartWallet.accountAbstraction}</div>
                <div><strong>EOA:</strong> {smartWallet.externallyOwnedAccount}</div>
                <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                  ✅ Smart wallet criada com sucesso com MetaMask!
                </div>
              </div>
            ) : (
              <div>
                <p className="mb-2">Crie uma smart wallet para sua EOA:</p>
                <div className="mb-4 text-sm text-gray-600">
                  <div><strong>Endereço EOA:</strong> {externallyOwnedAccount}</div>
                </div>
                <button
                  onClick={registerSmartWallet}
                  disabled={loading}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? 'Criando...' : 'Criar Smart Wallet'}
                </button>
              </div>
            )}
          </div>

          {/* Portfolio Section */}
          {smartWallet && (
            <PortfolioSection 
              walletAddress={smartWallet.accountAbstraction}
              title="📊 Portfolio & Histórico (MetaMask)"
            />
          )}

          {/* Liquidity Pools Section */}
          {smartWallet && (
            <LiquiditySection 
              walletAddress={smartWallet.accountAbstraction}
              title="💧 Liquidity Pools (MetaMask)"
              onSignMessage={async (message: string) => {
                // Em produção, usar o MetaMask para assinar
                return `0x${'0'.repeat(130)}`;
              }}
            />
          )}

          {/* Cross-Chain Swap Section */}
          {smartWallet && (
            <CrossChainSwapSection 
              walletAddress={smartWallet.accountAbstraction}
              title="🌉 Cross-Chain Swap (MetaMask)"
              onSignMessage={async (message: string) => {
                // Em produção, usar o MetaMask para assinar
                return `0x${'0'.repeat(130)}`;
              }}
            />
          )}

          {/* Swap Test Section */}
          {smartWallet && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">🔄 Teste de Swap MetaMask (Sem Custos de Gas)</h2>
              
              {swapError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  ❌ Erro: {swapError}
                </div>
              )}
              
              {!quote ? (
                <div>
                  <p className="mb-4 text-gray-600">Teste geração de cotação e assinatura REAL com MetaMask (GRÁTIS):</p>
                  <div className="space-y-3">
                    <div className="text-sm text-gray-500">
                      <div><strong>De:</strong> 1 USDC</div>
                      <div><strong>Para:</strong> WMATIC</div>
                      <div><strong>Smart Wallet:</strong> {smartWallet.accountAbstraction}</div>
                      <div><strong>Provedor:</strong> MetaMask</div>
                    </div>
                    <button
                      onClick={() => generateSwapQuote({
                        tokenIn: TEST_TOKENS.USDC,
                        tokenOut: TEST_TOKENS.WMATIC,
                        amountIn: "1",
                        smartWalletAddress: smartWallet.accountAbstraction,
                      })}
                      disabled={swapLoading}
                      className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 disabled:opacity-50"
                    >
                      {swapLoading ? 'Gerando Cotação...' : 'Gerar Cotação de Swap (GRÁTIS)'}
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                    ✅ Cotação de Swap Gerada com Sucesso com MetaMask!
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div><strong>Quote ID:</strong> {quote.swap.quoteId}</div>
                    <div><strong>Amount In:</strong> {quote.swap.amountIn} USDC</div>
                    <div><strong>Amount Out:</strong> {quote.swap.amountOut} WMATIC</div>
                    <div><strong>Rate:</strong> 1 USDC = {quote.swap.rate} WMATIC</div>
                    <div><strong>Slippage:</strong> {quote.swap.slippage}%</div>
                    <div><strong>Fee:</strong> {quote.swap.fee} USDC</div>
                  </div>
                  
                  <div className="mt-4 space-x-2">
                    <button
                      onClick={() => signAndExecute(quote.swap.quoteId)}
                      disabled={executing}
                      className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 disabled:opacity-50"
                    >
                      {executing ? 'Assinando...' : 'Assinar & Executar (ASSINATURA REAL)'}
                    </button>
                    <button
                      onClick={clearState}
                      className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                    >
                      Limpar
                    </button>
                  </div>
                </div>
              )}
              
              {result && (
                <div className="mt-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded">
                  <div><strong>UserOp Hash:</strong> {result.userOpHash}</div>
                  <div><strong>Status:</strong> {result.status}</div>
                  <div className="text-xs mt-2">
                    ✅ Esta assinatura foi gerada com autenticação REAL do MetaMask!
                    <br />
                    ⚠️ A execução NÃO foi realizada para evitar custos de gas
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
