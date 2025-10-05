#!/usr/bin/env ts-node

import { http, env, timedOperation, safePrint, log } from '../utils';

interface Pool {
  id: string;
  tokenA: string;
  tokenB: string;
  reserveA: string;
  reserveB: string;
  totalSupply: string;
  fee: string;
  apr: string;
  tvl: string;
}

interface AddLiquidityRequest {
  wallet: string;
  poolId: string;
  tokenA: string;
  tokenB: string;
  amountA: string;
  amountB: string;
  slippageTolerance?: string;
  network: string;
}

interface RemoveLiquidityRequest {
  wallet: string;
  poolId: string;
  lpTokens: string;
  slippageTolerance?: string;
  network: string;
}

interface LiquidityResponse {
  txid: string;
  status: string;
  lpTokens: string;
  share: string;
  poolId: string;
}

async function listPools(): Promise<Pool[]> {
  return await timedOperation('list-pools', async () => {
    const response = await http.get('/pools', {
      params: { network: env.network }
    });
    
    log({
      op: 'list-pools',
      t_start: Date.now(),
      t_end: Date.now(),
      ms: 0,
      status: response.status
    });
    
    return response.data;
  });
}

async function getPoolById(poolId: string): Promise<Pool> {
  return await timedOperation('get-pool', async () => {
    const response = await http.get(`/pools/${poolId}`);
    
    log({
      op: 'get-pool',
      t_start: Date.now(),
      t_end: Date.now(),
      ms: 0,
      status: response.status
    });
    
    return response.data;
  });
}

async function addLiquidity(request: AddLiquidityRequest): Promise<LiquidityResponse> {
  return await timedOperation('add-liquidity', async () => {
    const response = await http.post('/pools/liquidity', request);
    const result = response.data;
    
    log({
      op: 'add-liquidity',
      t_start: Date.now(),
      t_end: Date.now(),
      ms: 0,
      status: response.status,
      txid: result.txid,
      amount: result.lpTokens,
      asset: 'LP_TOKENS'
    });
    
    return result;
  });
}

async function removeLiquidity(request: RemoveLiquidityRequest): Promise<LiquidityResponse> {
  return await timedOperation('remove-liquidity', async () => {
    const response = await http.delete('/pools/liquidity', { data: request });
    const result = response.data;
    
    log({
      op: 'remove-liquidity',
      t_start: Date.now(),
      t_end: Date.now(),
      ms: 0,
      status: response.status,
      txid: result.txid,
      amount: result.lpTokens,
      asset: 'LP_TOKENS'
    });
    
    return result;
  });
}

async function getWalletBalance(address: string, asset: string): Promise<string> {
  const response = await http.get(`/wallets/${address}/balances`);
  const balances = response.data;
  const balance = balances.find((b: any) => b.asset === asset);
  return balance ? balance.amount : '0';
}

async function poolsOperations() {
  console.log('🏊 Notus Labs DX Research - Liquidity Pools Operations');
  console.log('=====================================================');
  
  try {
    // Use wallet from previous operations
    const walletAddress = 'WALLET_A_ADDRESS'; // This should be set from previous script
    
    console.log(`\n1️⃣ Using Wallet: ${walletAddress}`);
    
    // List available pools
    console.log('\n2️⃣ Listing Available Pools...');
    const pools = await listPools();
    
    console.log(`📊 Found ${pools.length} pools:`);
    pools.forEach((pool, index) => {
      console.log(`  ${index + 1}. ${pool.tokenA}/${pool.tokenB}`);
      console.log(`     Pool ID: ${pool.id}`);
      console.log(`     TVL: $${pool.tvl}`);
      console.log(`     APR: ${pool.apr}%`);
      console.log(`     Fee: ${pool.fee}%`);
      console.log(`     Reserves: ${pool.reserveA} ${pool.tokenA} / ${pool.reserveB} ${pool.tokenB}`);
      console.log('');
    });
    
    if (pools.length === 0) {
      console.log('  No pools available');
      return;
    }
    
    // Select a pool for operations (use first pool or specified pool)
    const selectedPool = env.poolId ? 
      pools.find(p => p.id === env.poolId) || pools[0] : 
      pools[0];
    
    console.log(`\n3️⃣ Selected Pool: ${selectedPool.tokenA}/${selectedPool.tokenB}`);
    console.log(`Pool ID: ${selectedPool.id}`);
    
    // Get detailed pool info
    console.log('\n4️⃣ Getting Pool Details...');
    const poolDetails = await getPoolById(selectedPool.id);
    
    console.log('🏊 Pool Details:');
    console.log(`Token A: ${poolDetails.tokenA} (${poolDetails.reserveA})`);
    console.log(`Token B: ${poolDetails.tokenB} (${poolDetails.reserveB})`);
    console.log(`Total Supply: ${poolDetails.totalSupply} LP tokens`);
    console.log(`Fee: ${poolDetails.fee}%`);
    console.log(`APR: ${poolDetails.apr}%`);
    console.log(`TVL: $${poolDetails.tvl}`);
    
    // Check wallet balances for the pool tokens
    console.log('\n5️⃣ Checking Wallet Balances...');
    const balanceA = await getWalletBalance(walletAddress, poolDetails.tokenA);
    const balanceB = await getWalletBalance(walletAddress, poolDetails.tokenB);
    
    console.log(`Wallet ${poolDetails.tokenA}: ${balanceA}`);
    console.log(`Wallet ${poolDetails.tokenB}: ${balanceB}`);
    
    // Add liquidity (small amounts for testing)
    if (parseFloat(balanceA) > 0.1 && parseFloat(balanceB) > 0.1) {
      console.log('\n6️⃣ Adding Liquidity...');
      const liquidityAmountA = '0.1'; // Small amount
      const liquidityAmountB = '0.1'; // Small amount
      
      const addLiquidityRequest: AddLiquidityRequest = {
        wallet: walletAddress,
        poolId: selectedPool.id,
        tokenA: poolDetails.tokenA,
        tokenB: poolDetails.tokenB,
        amountA: liquidityAmountA,
        amountB: liquidityAmountB,
        slippageTolerance: '0.5',
        network: env.network
      };
      
      const addResult = await addLiquidity(addLiquidityRequest);
      
      console.log('✅ Liquidity Added:');
      console.log(`Transaction ID: ${addResult.txid}`);
      console.log(`LP Tokens Received: ${addResult.lpTokens}`);
      console.log(`Pool Share: ${addResult.share}%`);
      console.log(`Status: ${addResult.status}`);
      
      // Wait for transaction confirmation
      console.log('\n7️⃣ Waiting for Transaction Confirmation...');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Check LP token balance
      const lpTokenBalance = await getWalletBalance(walletAddress, `${poolDetails.tokenA}-${poolDetails.tokenB}-LP`);
      console.log(`LP Token Balance: ${lpTokenBalance}`);
      
      // Remove liquidity (partial)
      if (parseFloat(lpTokenBalance) > 0) {
        console.log('\n8️⃣ Removing Liquidity (Partial)...');
        const removeAmount = (parseFloat(lpTokenBalance) * 0.5).toString(); // Remove 50%
        
        const removeLiquidityRequest: RemoveLiquidityRequest = {
          wallet: walletAddress,
          poolId: selectedPool.id,
          lpTokens: removeAmount,
          slippageTolerance: '0.5',
          network: env.network
        };
        
        const removeResult = await removeLiquidity(removeLiquidityRequest);
        
        console.log('✅ Liquidity Removed:');
        console.log(`Transaction ID: ${removeResult.txid}`);
        console.log(`LP Tokens Burned: ${removeResult.lpTokens}`);
        console.log(`Pool Share: ${removeResult.share}%`);
        console.log(`Status: ${removeResult.status}`);
        
        // Wait for transaction confirmation
        console.log('\n9️⃣ Waiting for Transaction Confirmation...');
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Check final balances
        console.log('\n🔟 Checking Final Balances...');
        const finalBalanceA = await getWalletBalance(walletAddress, poolDetails.tokenA);
        const finalBalanceB = await getWalletBalance(walletAddress, poolDetails.tokenB);
        const finalLpBalance = await getWalletBalance(walletAddress, `${poolDetails.tokenA}-${poolDetails.tokenB}-LP`);
        
        console.log(`Final ${poolDetails.tokenA}: ${finalBalanceA}`);
        console.log(`Final ${poolDetails.tokenB}: ${finalBalanceB}`);
        console.log(`Final LP Tokens: ${finalLpBalance}`);
        
        // Calculate changes
        const deltaA = parseFloat(finalBalanceA) - parseFloat(balanceA);
        const deltaB = parseFloat(finalBalanceB) - parseFloat(balanceB);
        
        console.log(`\n📈 Balance Changes:`);
        console.log(`${poolDetails.tokenA} change: ${deltaA}`);
        console.log(`${poolDetails.tokenB} change: ${deltaB}`);
      } else {
        console.log('\n8️⃣ Skipping liquidity removal - insufficient LP tokens');
      }
    } else {
      console.log('\n6️⃣ Skipping liquidity operations - insufficient token balances');
    }
    
    // Save screenshot info
    console.log('\n📸 Screenshot Info:');
    console.log('File: assets/screenshots/pools-operations.png');
    console.log('Content: Pool details and liquidity operations');
    
    return {
      wallet: walletAddress,
      selectedPool: poolDetails,
      operations: {
        poolsListed: pools.length,
        liquidityAdded: parseFloat(balanceA) > 0.1 && parseFloat(balanceB) > 0.1,
        liquidityRemoved: parseFloat(balanceA) > 0.1 && parseFloat(balanceB) > 0.1
      }
    };
    
  } catch (error: any) {
    console.error('❌ Pools operations failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  poolsOperations();
}
