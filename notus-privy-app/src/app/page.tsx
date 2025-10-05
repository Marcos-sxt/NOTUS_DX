"use client";

import { usePrivy } from '@privy-io/react-auth';
import { useSmartWallet } from '@/hooks/useSmartWallet';
import { useSwap } from '@/hooks/useSwap';
import { TEST_TOKENS } from '@/lib/actions/transfer';
import { PortfolioSection } from '@/components/PortfolioSection';
import { LiquiditySection } from '@/components/LiquiditySection';
import { CrossChainSwapSection } from '@/components/CrossChainSwapSection';
import Link from 'next/link';

export default function Home() {
  const { user, login, logout } = usePrivy();
  const { wallet, loading, error, registerWallet } = useSmartWallet();
  const { 
    quote, 
    loading: swapLoading, 
    error: swapError, 
    executing, 
    result,
    generateSwapQuote, 
    signAndExecute, 
    clearState 
  } = useSwap();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-white text-4xl font-bold mb-8">Notus DX Research</h1>
          <p className="text-white mb-8">Choose your authentication method:</p>
          <div className="space-x-4">
            <button
              onClick={login}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Sign In with Privy
            </button>
            <Link
              href="/web3auth"
              className="bg-purple-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-purple-700 transition-colors inline-block"
            >
              Sign In with Web3Auth
            </Link>
            <Link
              href="/metamask"
              className="bg-orange-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-orange-700 transition-colors inline-block"
            >
              Connect MetaMask
            </Link>
            <Link
              href="/webhooks"
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors inline-block"
            >
              Configure Webhooks
            </Link>
            <Link
              href="/kyc"
              className="bg-amber-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-amber-700 transition-colors inline-block"
            >
              KYC & Ramp
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-black text-3xl font-bold mb-8 text-center">Privy + Notus API Integration</h1>
        
        <div className="grid gap-6">
          {/* User Information */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">User Information</h2>
            <div className="space-y-2">
              <div><strong className="text-gray-800">User ID:</strong> <span className="text-gray-900">{user.id}</span></div>
              <div><strong className="text-gray-800">Email:</strong> <span className="text-gray-900">{user.email?.address || 'N/A'}</span></div>
              <div><strong className="text-gray-800">Wallet:</strong> <span className="text-gray-900 font-mono text-sm">{user.wallet?.address || 'N/A'}</span></div>
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
            
            {wallet ? (
              <div className="space-y-2">
                <div><strong className="text-gray-800">Smart Wallet:</strong> <span className="text-gray-900 font-mono text-sm">{wallet.accountAbstraction}</span></div>
                <div><strong className="text-gray-800">EOA:</strong> <span className="text-gray-900 font-mono text-sm">{wallet.externallyOwnedAccount}</span></div>
                <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-800 rounded">
                  ✅ Smart wallet created successfully!
                </div>
              </div>
            ) : (
              <div>
                <p className="mb-2 text-gray-900">Create a smart wallet for your EOA:</p>
                <div className="mb-4 text-sm text-gray-800">
                  <span><strong>EOA Address:</strong> <span className="text-gray-900 font-mono">{user?.wallet?.address || 'N/A'}</span></span>
                </div>
                <button
                  onClick={registerWallet}
                  disabled={loading}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Smart Wallet'}
                </button>
              </div>
            )}
          </div>

                 {/* Portfolio Section */}
                 {wallet && (
                   <PortfolioSection 
                     walletAddress={wallet.accountAbstraction}
                     title="📊 Portfolio & Histórico (Privy)"
                   />
                 )}

                 {/* Liquidity Pools Section */}
                 {wallet && (
                   <LiquiditySection 
                     walletAddress={wallet.accountAbstraction}
                     title="💧 Liquidity Pools (Privy)"
                     onSignMessage={async (message: string) => {
                       // Em produção, usar o Privy para assinar
                       return `0x${'0'.repeat(130)}`;
                     }}
                   />
                 )}

                 {/* Cross-Chain Swap Section */}
                 {wallet && (
                   <CrossChainSwapSection 
                     walletAddress={wallet.accountAbstraction}
                     title="🌉 Cross-Chain Swap (Privy)"
                     onSignMessage={async (message: string) => {
                       // Em produção, usar o Privy para assinar
                       return `0x${'0'.repeat(130)}`;
                     }}
                   />
                 )}

                 {/* Swap Test Section */}
                 {wallet && (
                   <div className="bg-white p-6 rounded-lg shadow">
                     <h2 className="text-xl font-semibold mb-4 text-gray-900">🔄 Legitimate Swap Test (No Gas Costs)</h2>
                     
                     {swapError && (
                       <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                         ❌ Error: {swapError}
                       </div>
                     )}
                     
                     {!quote ? (
                       <div>
                         <p className="mb-4 text-gray-800">Test swap quote generation and signature (FREE):</p>
                         <div className="space-y-3">
                           <div className="text-sm text-gray-700">
                             <div><strong className="text-gray-800">From:</strong> <span className="text-gray-900">1 USDC</span></div>
                             <div><strong className="text-gray-800">To:</strong> <span className="text-gray-900">WMATIC</span></div>
                             <div><strong className="text-gray-800">Smart Wallet:</strong> <span className="text-gray-900 font-mono text-xs">{wallet.accountAbstraction}</span></div>
                           </div>
                           <button
                             onClick={() => generateSwapQuote({
                               tokenIn: TEST_TOKENS.USDC,
                               tokenOut: TEST_TOKENS.WMATIC,
                               amountIn: "1",
                               smartWalletAddress: wallet.accountAbstraction,
                             })}
                             disabled={swapLoading}
                             className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                           >
                             {swapLoading ? 'Generating Quote...' : 'Generate Swap Quote (FREE)'}
                           </button>
                         </div>
                       </div>
                     ) : (
                       <div>
                         <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-800 rounded">
                           ✅ Swap Quotes Generated Successfully!
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
                             onClick={signAndExecute}
                             disabled={executing || !quote.quotes.some(q => !q.revertReason)}
                             className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                           >
                             {executing ? 'Signing...' : 'Sign & Execute (FREE)'}
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
                         <div className="text-xs mt-2 text-blue-800">
                           ⚠️ This is a demonstration - no real transaction was executed to avoid gas costs
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