"use client";

import Link from 'next/link';
import { useWeb3Auth } from '@/hooks/useWeb3Auth';
import { useWeb3AuthSwap } from '@/hooks/useWeb3AuthSwap';
import { TEST_TOKENS } from '@/lib/actions/transfer';
import { PortfolioSection } from '@/components/PortfolioSection';
import { LiquiditySection } from '@/components/LiquiditySection';
import { CrossChainSwapSection } from '@/components/CrossChainSwapSection';

export default function Web3AuthPage() {
  const { 
    account, 
    loggedIn, 
    externallyOwnedAccount, 
    smartWallet, 
    loading, 
    error, 
    login, 
    logout, 
    registerSmartWallet 
  } = useWeb3Auth();

  const { 
    quote, 
    loading: swapLoading, 
    error: swapError, 
    executing, 
    result,
    generateSwapQuote, 
    signAndExecute, 
    clearState 
  } = useWeb3AuthSwap(account, externallyOwnedAccount);

  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-white text-4xl font-bold mb-8">Web3Auth + Notus API Integration</h1>
          <p className="text-gray-300 mb-8">Teste legítimo de autenticação social com smart wallets</p>
          <button
            onClick={login}
            disabled={loading}
            className="bg-purple-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Connecting...' : 'Sign In with Web3Auth'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-white text-3xl font-bold">Web3Auth + Notus API Integration</h1>
          <Link
            href="/"
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
          >
            ← Back to Privy
          </Link>
        </div>
        
        <div className="grid gap-6">
          {/* User Information */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">User Information</h2>
            <div className="space-y-2">
              <div><strong>EOA Address:</strong> {externallyOwnedAccount}</div>
              <div><strong>Auth Provider:</strong> Web3Auth</div>
              <div><strong>Chain:</strong> Sepolia Testnet</div>
            </div>
            <button
              onClick={logout}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Sign Out
            </button>
          </div>

          {/* Smart Wallet Section */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Smart Wallet</h2>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                ❌ Error: {error}
              </div>
            )}
            
            {smartWallet ? (
              <div className="space-y-2">
                <div><strong>Smart Wallet:</strong> {smartWallet.accountAbstraction}</div>
                <div><strong>EOA:</strong> {smartWallet.externallyOwnedAccount}</div>
                <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                  ✅ Smart wallet created successfully with Web3Auth!
                </div>
              </div>
            ) : (
              <div>
                <p className="mb-2">Create a smart wallet for your EOA:</p>
                <div className="mb-4 text-sm text-gray-600">
                  <div><strong>EOA Address:</strong> {externallyOwnedAccount}</div>
                </div>
                <button
                  onClick={registerSmartWallet}
                  disabled={loading}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Smart Wallet'}
                </button>
              </div>
            )}
          </div>

          {/* Portfolio Section */}
          {smartWallet && (
            <PortfolioSection 
              walletAddress={smartWallet.accountAbstraction}
              title="📊 Portfolio & Histórico (Web3Auth)"
            />
          )}

          {/* Liquidity Pools Section */}
          {smartWallet && (
            <LiquiditySection 
              walletAddress={smartWallet.accountAbstraction}
              title="💧 Liquidity Pools (Web3Auth)"
              onSignMessage={async (message: string) => {
                // Em produção, usar o Web3Auth para assinar
                return `0x${'0'.repeat(130)}`;
              }}
            />
          )}

          {/* Cross-Chain Swap Section */}
          {smartWallet && (
            <CrossChainSwapSection 
              walletAddress={smartWallet.accountAbstraction}
              title="🌉 Cross-Chain Swap (Web3Auth)"
              onSignMessage={async (message: string) => {
                // Em produção, usar o Web3Auth para assinar
                return `0x${'0'.repeat(130)}`;
              }}
            />
          )}

          {/* Swap Test Section */}
          {smartWallet && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">🔄 Web3Auth Swap Test (No Gas Costs)</h2>
              
              {swapError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  ❌ Error: {swapError}
                </div>
              )}
              
              {!quote ? (
                <div>
                  <p className="mb-4 text-gray-800">Test swap quote generation and REAL signature with Web3Auth (FREE):</p>
                  <div className="space-y-3">
                    <div className="text-sm text-gray-700">
                      <div><strong className="text-gray-800">From:</strong> <span className="text-gray-900">1 USDC</span></div>
                      <div><strong className="text-gray-800">To:</strong> <span className="text-gray-900">WMATIC</span></div>
                      <div><strong className="text-gray-800">Smart Wallet:</strong> <span className="text-gray-900 font-mono text-xs">{smartWallet.accountAbstraction}</span></div>
                      <div><strong className="text-gray-800">Auth Provider:</strong> <span className="text-gray-900">Web3Auth</span></div>
                    </div>
                    <button
                      onClick={() => generateSwapQuote({
                        tokenIn: TEST_TOKENS.USDC,
                        tokenOut: TEST_TOKENS.WMATIC,
                        amountIn: "1",
                        smartWalletAddress: smartWallet.accountAbstraction,
                      })}
                      disabled={swapLoading}
                      className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
                    >
                      {swapLoading ? 'Generating Quote...' : 'Generate Swap Quote (FREE)'}
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                    ✅ Swap Quote Generated Successfully with Web3Auth!
                  </div>
                  
                  <div className="space-y-4">
                    {quote.quotes.map((q, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded border">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-900">Provider: {q.swapProvider}</h4>
                          {q.revertReason ? (
                            <span className="text-red-600 text-sm">❌ Saldo Insuficiente</span>
                          ) : (
                            <span className="text-green-600 text-sm">✅ Válida</span>
                          )}
                        </div>
                        
                        {!q.revertReason && (
                          <div className="space-y-1 text-sm text-gray-700">
                            <div><strong>Amount In:</strong> {q.amountIn} USDC</div>
                            <div><strong>Amount Out:</strong> {q.minAmountOut} USDT</div>
                            <div><strong>Gas Fee:</strong> {q.estimatedGasFees.gasFeeTokenAmount} USDC</div>
                            <div><strong>Notus Fee:</strong> {q.estimatedCollectedFee.notusCollectedFee}%</div>
                            <div><strong>Execution Time:</strong> {new Date(q.estimatedExecutionTime).toLocaleString()}</div>
                          </div>
                        )}
                        
                        {q.revertReason && (
                          <div className="text-sm text-red-600">
                            <strong>Erro:</strong> {q.revertReason.decoded}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 space-x-2">
                    <button
                      onClick={() => {
                        const validQuotes = quote.quotes.filter(q => !q.revertReason);
                        if (validQuotes.length > 0) {
                          signAndExecute(validQuotes[0].quoteId || 'mock-quote-id');
                        }
                      }}
                      disabled={executing || !quote.quotes.some(q => !q.revertReason)}
                      className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
                    >
                      {executing ? 'Signing...' : 'Sign & Execute (REAL SIGNATURE)'}
                    </button>
                    <button
                      onClick={clearState}
                      className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              )}
              
              {result && (
                <div className="mt-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded">
                  <div><strong>UserOp Hash:</strong> {result.userOpHash}</div>
                  <div><strong>Status:</strong> {result.status}</div>
                  <div className="text-xs mt-2">
                    ✅ This signature was generated with REAL Web3Auth authentication!
                    <br />
                    ⚠️ Execution was NOT performed to avoid gas costs
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
