# Notus API - Documentação Completa

**Data de Compilação:** 2025-10-01  
**Fonte:** https://docs.notus.team/docs/guides  
**Versão da API:** v1

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Autenticação](#autenticação)
3. [Account Abstraction](#account-abstraction)
4. [Smart Wallets](#smart-wallets)
5. [Endpoints da API](#endpoints-da-api)
6. [DeFi Operations](#defi-operations)
7. [KYC & Ramp](#kyc--ramp)
8. [Analytics](#analytics)
9. [Webhooks](#webhooks)
10. [Exemplos de Código](#exemplos-de-código)

---

## 🎯 Visão Geral

A **Notus API** é uma plataforma poderosa e simplificada para construir aplicações com **account abstraction**, permitindo que desenvolvedores integrem recursos avançados de blockchain sem a complexidade técnica de smart contracts.

### Características Principais

**Account Abstraction**
- Smart Wallets & Authentication
- Generate and manage ERC-4337 smart wallets
- Enable social login with Google, Apple ID, and other providers
- Gasless & Transaction Abstraction
- Allow users to send gasless transactions without holding native tokens
- Execute batch operations for multiple transactions in a single operation

**DeFi**
- Perform swap and cross-chain swaps without the need for manual bridges
- Manage liquidity pools with automated yield generation
- Access comprehensive DeFi operations including staking and lending strategies

**KYC & Ramp**
- Complete KYC verification for regulatory compliance and fraud prevention
- Enable fiat deposits and withdrawals with local payment methods and automatic stablecoin settlements

**Analytics & Monitoring**
- Access comprehensive analytics with real-time insights into transaction volume, active users, and liquidity trends

**Webhooks & Automation**
- Receive real-time blockchain event notifications
- Set up automated workflows with webhook signatures for secure event handling

### Chains Suportadas
- Ethereum
- Optimism
- Arbitrum
- Polygon
- Binance Smart Chain
- Avalanche
- Base

---

## 🔐 Autenticação

### API Key
- **Header:** `X-Api-Key`
- **Formato:** JWT Token
- **Exemplo:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### Base URL
- **Produção:** `https://api.notus.team/api/v1`
- **Testnet:** `https://api.notus.team/api/v1` (mesmo endpoint)

---

## 🏗️ Account Abstraction

### ERC-4337 Implementation

A Notus implementa Account Abstraction seguindo o padrão ERC-4337, que permite:

#### Componentes Principais

**UserOperation**
- Objeto estruturado que representa a intenção do usuário
- Campos: sender address, call data, signature, gas fee logic, paymaster data

**EntryPoint**
- Contrato global que valida e executa UserOperations
- Garante validação adequada de assinatura e gas
- Integração segura com Paymasters

**Factory**
- Contrato que cria smart wallets deterministicamente usando CREATE2
- Permite pré-computar endereços de wallet antes do deploy
- Deploy eficiente sob demanda

**Paymaster**
- Permite pagamento de gas fees em ERC-20 tokens (USDC, BNB)
- Patrocínio completo pela aplicação
- Melhora onboarding e UX

**Bundler**
- Ator especializado off-chain
- Agrupa UserOperations em batches
- Submete batches para o EntryPoint
- Otimiza eficiência de gas

### Vantagens do Account Abstraction

**Flexibilidade**
- Multi-factor authentication
- Social recovery
- Post-quantum cryptography

**Simplicidade**
- Pagamento de gas em tokens como USDC
- Sem necessidade de token nativo

**Inovação**
- Múltiplas operações em uma única transação
- One-click DeFi actions
- In-app purchases

---

## 💼 Smart Wallets

### Tipos de Smart Wallets

#### Light Account
- **Factory Address:** `0x0000000000400CdFef5E2714E63d8040b700BC24`
- **Características:** Implementação leve e eficiente
- **Uso:** Ideal para aplicações que precisam de performance

#### Kernel Account
- **Características:** Implementação mais robusta
- **Uso:** Ideal para aplicações que precisam de recursos avançados

### Criação de Smart Wallets

#### Endpoint: POST `/wallets/register`

**Parâmetros:**
```json
{
  "externallyOwnedAccount": "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
  "factory": "0x0000000000400CdFef5E2714E63d8040b700BC24",
  "salt": "0"
}
```

**Resposta:**
```json
{
  "wallet": {
    "accountAbstraction": "0x01f08096482e98bf702fb023d9d4ff7cb1ffd3b3",
    "externallyOwnedAccount": "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"
  }
}
```

**Observações:**
- Smart wallet não é deployado imediatamente
- Deploy acontece na primeira transação onchain via UserOperation
- Endereço é deterministicamente calculado usando CREATE2

### Listagem de Wallets

#### Endpoint: GET `/wallets`

**Resposta:**
```json
{
  "wallets": []
}
```

---

## 🔄 Endpoints da API (Documentação Real)

### Wallets

#### GET `/wallets`
- **Descrição:** Lista todas as wallets registradas
- **Status:** ✅ Funcionando
- **Resposta:** `{ "wallets": [] }`

#### POST `/wallets/register`
- **Descrição:** Registra uma nova smart wallet
- **Status:** ✅ Funcionando
- **Parâmetros:** 
  ```json
  {
    "externallyOwnedAccount": "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    "factory": "0x0000000000400CdFef5E2714E63d8040b700BC24",
    "salt": "0"
  }
  ```
- **Resposta:** 
  ```json
  {
    "wallet": {
      "accountAbstraction": "0x01f08096482e98bf702fb023d9d4ff7cb1ffd3b3",
      "externallyOwnedAccount": "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"
    }
  }
  ```

#### GET `/wallets/{address}/history`
- **Descrição:** Histórico de transações da wallet
- **Status:** ✅ Funcionando (Testado)
- **Parâmetros Query:**
  - `take`: número de resultados (ex: 50)
  - `lastId`: ID da última transação para paginação
  - `type`: tipo de transação (SWAP, CROSS_SWAP, etc.)
  - `status`: status da transação (COMPLETED, FAILED, etc.)
  - `userOperationHash`: hash da UserOperation
  - `transactionHash`: hash da transação
  - `chains`: array de chain IDs
  - `chainInId`: chain de origem
  - `chainOutId`: chain de destino
  - `createdAtLatest`: data mais recente
  - `createdAtOldest`: data mais antiga
  - `metadataKey`: chave de metadados
  - `metadataValue`: valor de metadados
- **Resposta:**
  ```json
  {
    "nextLastId": null,
    "transactions": []
  }
  ```
- **Exemplo:** `GET /wallets/0x01f08096482e98bf702fb023d9d4ff7cb1ffd3b3/history?take=10&type=SWAP&status=COMPLETED`

#### GET `/wallets/{walletAddress}`
- **Descrição:** Obtém detalhes de uma smart wallet específica
- **Status:** ✅ Documentado
- **Parâmetros:** `walletAddress` - Endereço da smart wallet

### Transações

#### POST `/crypto/transfer`
- **Descrição:** Gera cotação para transferência de tokens
- **Status:** ✅ Documentado (Privy Integration)
- **Parâmetros:**
  ```json
  {
    "amount": "1",
    "chainId": 137,
    "gasFeePaymentMethod": "ADD_TO_AMOUNT",
    "payGasFeeToken": "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    "token": "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    "walletAddress": "0x01f08096482e98bf702fb023d9d4ff7cb1ffd3b3",
    "toAddress": "0x123...",
    "transactionFeePercent": 0
  }
  ```

#### POST `/crypto/execute-user-op`
- **Descrição:** Executa UserOperation após assinatura
- **Status:** ✅ Documentado (Privy Integration)
- **Parâmetros:**
  ```json
  {
    "quoteId": "quote_id_from_transfer",
    "signature": "signature_from_privy"
  }
  ```

#### GET `/transactions/{transactionHash}`
- **Descrição:** Obtém detalhes de uma transação específica
- **Status:** ✅ Documentado
- **Parâmetros:** `transactionHash` - Hash da transação

### Swaps (DeFi)

#### POST `/crypto/swap`
- **Descrição:** Gera cotação para swap de tokens
- **Status:** ✅ Documentado (Privy Integration)
- **Parâmetros:**
  ```json
  {
    "amount": "1",
    "chainId": 137,
    "gasFeePaymentMethod": "ADD_TO_AMOUNT",
    "payGasFeeToken": "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    "tokenIn": "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    "tokenOut": "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    "walletAddress": "0x01f08096482e98bf702fb023d9d4ff7cb1ffd3b3",
    "transactionFeePercent": 0
  }
  ```

#### POST `/crypto/cross-swap`
- **Descrição:** Gera cotação para cross-chain swap
- **Status:** ✅ Documentado (Privy Integration)
- **Parâmetros:**
  ```json
  {
    "amount": "1",
    "chainInId": 137,
    "chainOutId": 1,
    "gasFeePaymentMethod": "ADD_TO_AMOUNT",
    "payGasFeeToken": "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    "tokenIn": "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    "tokenOut": "0xA0b86a33E6441b8c4C8C0e4B8b8c4C8C0e4B8b8c4",
    "walletAddress": "0x01f08096482e98bf702fb023d9d4ff7cb1ffd3b3",
    "transactionFeePercent": 0
  }
  ```

#### Cross-Chain Swaps
- **Descrição:** Swaps entre diferentes blockchains
- **Status:** ✅ Documentado
- **Tokens Suportados:**
  - USDC Polygon: `0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359`
  - USDC Arbitrum: `0xaf88d065e77c8cc2239327c5edb3a432268e5831`
  - UNI Polygon: `0xb33eaad8d922b1083446dc23f610c2567fb5180f`

### Liquidity Pools

#### POST `/liquidity/create`
- **Descrição:** Cria uma posição de liquidez em um pool
- **Status:** ✅ Documentado
- **Parâmetros:**
  ```json
  {
    "walletAddress": "ENDEREÇO_DA_WALLET",
    "token0": "ENDEREÇO_DO_TOKEN0",
    "token1": "ENDEREÇO_DO_TOKEN1",
    "amount0": "QUANTIDADE_DO_TOKEN0",
    "amount1": "QUANTIDADE_DO_TOKEN1",
    "fee": 0.3,
    "minPrice": 0.98,
    "maxPrice": 1.02
  }
  ```

#### POST `/liquidity/change`
- **Descrição:** Altera uma posição de liquidez existente
- **Status:** ✅ Documentado
- **Parâmetros:**
  ```json
  {
    "positionId": "ID_DA_POSIÇÃO",
    "amount0": "NOVA_QUANTIDADE_DO_TOKEN0",
    "amount1": "NOVA_QUANTIDADE_DO_TOKEN1"
  }
  ```

#### POST `/liquidity/collect`
- **Descrição:** Coleta taxas acumuladas de uma posição de liquidez
- **Status:** ✅ Documentado
- **Parâmetros:**
  ```json
  {
    "positionId": "ID_DA_POSIÇÃO"
  }
  ```

### Webhooks

#### POST `/webhooks/register`
- **Descrição:** Registra um novo webhook para notificações em tempo real
- **Status:** ✅ Documentado
- **Parâmetros:**
  ```json
  {
    "url": "URL_DO_WEBHOOK",
    "events": ["transaction", "swap"]
  }
  ```

#### DELETE `/webhooks/{webhookId}`
- **Descrição:** Remove um webhook registrado
- **Status:** ✅ Documentado
- **Parâmetros:** `webhookId` - ID do webhook

### Authentication

#### POST `/auth/login`
- **Descrição:** Login usando provedores de identidade (Google, Apple ID)
- **Status:** ✅ Documentado
- **Parâmetros:**
  ```json
  {
    "provider": "google",
    "token": "TOKEN_DO_USUÁRIO"
  }
  ```

#### POST `/auth/logout`
- **Descrição:** Encerra a sessão do usuário autenticado
- **Status:** ✅ Documentado

#### MetaMask Integration
- **Descrição:** Integração com MetaMask para autenticação
- **Status:** ✅ Documentado
- **Funcionalidades:**
  - Conectar wallet existente
  - Registrar smart wallet (ERC-4337)
  - Assinar e executar ações onchain
  - Suporte a experiências sem gas com Paymasters

### KYC & Ramp

#### Documentos Aceitos
- **Brasileiros:**
  - RG (frente e verso)
  - CNH (frente e verso)
  - Passaporte (página principal com foto)
- **Internacionais:**
  - Passaporte (página principal com foto)
  - Carteira de Identidade Nacional (frente e verso quando aplicável)

#### Requisitos
- Documentos devem ser **legíveis**, **válidos** e **não expirados**
- Documentos danificados, ilegíveis ou obscurecidos podem resultar em rejeição

---

## 💱 DeFi Operations

### Swaps

#### Tipos de Swap
- **Single-chain swaps:** Dentro da mesma blockchain
- **Cross-chain swaps:** Entre diferentes blockchains
- **Multi-hop swaps:** Através de múltiplos pools

#### Providers de Swap
- Integração com múltiplos DEXs
- Melhor rota automaticamente selecionada
- Otimização de slippage e fees

### Liquidity Pools

#### Operações Suportadas
- **Add Liquidity:** Adicionar liquidez e receber LP tokens
- **Remove Liquidity:** Remover liquidez e receber tokens proporcionais
- **Staking:** Stake de LP tokens para rewards adicionais

#### Yield Generation
- Automated yield generation
- Compounding rewards
- Risk management tools

---

## 🆔 KYC & Ramp

### KYC Verification

#### Processo
1. **Document Upload:** Upload de documentos de identidade
2. **Face Verification:** Verificação facial via webcam
3. **Address Verification:** Verificação de endereço residencial
4. **Compliance Check:** Verificação de listas de sanções

#### Status de Verificação
- **Pending:** Aguardando verificação
- **Approved:** Aprovado
- **Rejected:** Rejeitado
- **Under Review:** Em análise

### Ramp Operations

#### Fiat Onboarding
- **Deposits:** Depósitos em fiat com métodos locais
- **Withdrawals:** Saques em fiat
- **Automatic Settlement:** Liquidação automática em stablecoins

#### Payment Methods
- Bank transfers
- Credit cards
- Digital wallets
- Local payment methods

---

## 📊 Analytics

### Métricas Disponíveis

#### Transaction Analytics
- Volume de transações
- Número de transações
- Average transaction value
- Transaction success rate

#### User Analytics
- Active users
- New user registrations
- User retention
- Geographic distribution

#### Liquidity Analytics
- Total Value Locked (TVL)
- Liquidity trends
- Pool performance
- Yield rates

### Real-time Insights
- Dashboard em tempo real
- Alertas automáticos
- Relatórios personalizados
- Export de dados

---

## 🔔 Webhooks

### Eventos Suportados

#### Transaction Events
- `transaction.created`
- `transaction.confirmed`
- `transaction.failed`
- `transaction.cancelled`

#### Wallet Events
- `wallet.created`
- `wallet.deployed`
- `wallet.balance_changed`

#### DeFi Events
- `swap.executed`
- `liquidity.added`
- `liquidity.removed`
- `pool.created`

### Configuração

#### Endpoint Setup
```json
{
  "url": "https://your-app.com/webhook",
  "events": ["transaction.confirmed", "wallet.created"],
  "secret": "your-webhook-secret"
}
```

#### Signature Verification
- HMAC-SHA256 signature
- Header: `X-Notus-Signature`
- Verificação obrigatória para segurança

---

## 💻 Exemplos de Código

### Criar Smart Wallet

```typescript
const response = await fetch('https://api.notus.team/api/v1/wallets/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Api-Key': 'YOUR_SECRET_KEY'
  },
  body: JSON.stringify({
    externallyOwnedAccount: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    factory: '0x0000000000400CdFef5E2714E63d8040b700BC24',
    salt: '0'
  })
});

const wallet = await response.json();
console.log('Smart Wallet:', wallet.wallet.accountAbstraction);
```

### Obter Quote de Swap

```typescript
const response = await fetch('https://api.notus.team/api/v1/swaps/quote?fromAsset=native&toAsset=USDC&amount=1.0&network=testnet', {
  headers: {
    'X-Api-Key': 'YOUR_SECRET_KEY'
  }
});

const quote = await response.json();
console.log('Rate:', quote.rate);
console.log('Slippage:', quote.slippage);
```

### Executar Swap

```typescript
const response = await fetch('https://api.notus.team/api/v1/swaps', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Api-Key': 'YOUR_SECRET_KEY'
  },
  body: JSON.stringify({
    wallet: '0x01f08096482e98bf702fb023d9d4ff7cb1ffd3b3',
    fromAsset: 'native',
    toAsset: 'USDC',
    amount: '1.0',
    slippageTolerance: '0.5',
    network: 'testnet'
  })
});

const swap = await response.json();
console.log('Transaction ID:', swap.txid);
```

### Adicionar Liquidez

```typescript
const response = await fetch('https://api.notus.team/api/v1/pools/liquidity', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Api-Key': 'YOUR_SECRET_KEY'
  },
  body: JSON.stringify({
    wallet: '0x01f08096482e98bf702fb023d9d4ff7cb1ffd3b3',
    poolId: 'pool-id',
    tokenA: 'native',
    tokenB: 'USDC',
    amountA: '1.0',
    amountB: '100.0',
    slippageTolerance: '0.5',
    network: 'testnet'
  })
});

const liquidity = await response.json();
console.log('LP Tokens:', liquidity.lpTokens);
```

---

## 🚨 Status dos Endpoints

### ✅ Funcionando (Testado)
- `GET /wallets` - Lista wallets
- `POST /wallets/register` - Cria smart wallet
- `GET /wallets/{address}/history` - Histórico de transações

### ✅ Documentado (A Testar)
- `GET /wallets/{walletAddress}` - Detalhes da wallet
- `POST /transactions/send` - Envia transação
- `GET /transactions/{transactionHash}` - Detalhes da transação
- `POST /swap/execute` - Executa swap
- `POST /cross-swap/execute` - Executa cross-chain swap
- `POST /liquidity/create` - Cria posição de liquidez
- `POST /liquidity/change` - Altera posição de liquidez
- `POST /liquidity/collect` - Coleta taxas
- `POST /auth/login` - Login com provedores
- `POST /auth/logout` - Logout
- `POST /webhooks/register` - Registra webhook
- `DELETE /webhooks/{webhookId}` - Remove webhook

### ❌ Não Funcionando (Testado)
- `GET /wallets/{address}/balances` - Balances específicos (404)
- `GET /portfolio` - Portfolio completo (404)
- `GET /portfolio/history` - Histórico de transações (404)

### 🔍 Descobertas Importantes
- **Wallet Registration:** Endpoint `/wallets/register` funciona perfeitamente
- **Error Handling:** Mensagens de erro claras (`WALLET_ALREADY_REGISTERED`)
- **Trace ID:** Suporte a trace IDs para debugging (`traceId: 'a014ec336c5740b295218428b6bf65dc'`)
- **Idempotency:** Sistema de chaves de idempotência funcionando
- **API Structure:** Base URL `/api/v1/` com endpoints bem estruturados
- **Documentation:** Documentação oficial disponível em docs.notus.team

---

## 📝 Notas de Implementação

### Headers Obrigatórios
```typescript
{
  'X-Api-Key': 'YOUR_SECRET_KEY',
  'Content-Type': 'application/json',
  'User-Agent': 'Your-App/1.0.0'
}
```

### Rate Limits
- **Requests per minute:** 100
- **Burst limit:** 20 requests
- **Retry policy:** Exponential backoff

### Error Handling
- **400:** Bad Request - Parâmetros inválidos
- **401:** Unauthorized - API key inválida
- **403:** Forbidden - Permissões insuficientes
- **404:** Not Found - Endpoint não existe
- **429:** Too Many Requests - Rate limit excedido
- **5xx:** Server Error - Erro interno do servidor

### Idempotency
- Use `x-idempotency-key` header para operações POST/PUT/DELETE
- UUID recomendado para chaves de idempotência
- Evita execução duplicada de transações

---

## 🔗 Links Úteis

- **Documentação Oficial:** https://docs.notus.team/docs/guides
- **API Reference:** https://docs.notus.team/docs/api-reference
- **Discord:** https://discord.gg/7zmMuPcP
- **Support:** support@notus.team

---

**Última Atualização:** 2025-10-01  
**Próxima Revisão:** Conforme descoberta de novos endpoints
