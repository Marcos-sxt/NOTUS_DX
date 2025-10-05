# Notus Labs DX Research

> **Developer Experience Research** - Integração Web3/Web2 com API Notus

Este repositório contém a implementação completa para a pesquisa de Developer Experience (DX) da NotusLabs, demonstrando integração com Smart Wallets, Swaps, Transfers
## 🎯 Objetivo

Demonstrar que um desenvolvedor Web2 consegue, em poucas horas, integrar a API Notus para:

- ✅ Criar/usar Smart Wallet
- ✅ Transfer entre wallets  
- ✅ Swap entre dois ativos
- ✅ Consultar Portfolio + History
- ✅ Pools: adicionar e remover liquidez

## 🚀 Quick Start

### 1. Instalação

```bash
# Clone o repositório
git clone <seu-repo>
cd notus-dx

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp env.example .env
# Edite o .env com suas credenciais
```

### 2. Configuração

Edite o arquivo `.env` com suas credenciais:

```env
NOTUS_BASE_URL=https://dashboard.notus.team/api
NOTUS_API_KEY=seu_api_key_aqui
NETWORK=testnet
ASSET_A=native
ASSET_B=USDC
```

### 3. Execução

```bash
# Health check
npm run dev

# Executar todos os testes
npm test

# Ou executar individualmente:
npm run wallet      # Criar wallet e obter balances
npm run transfer    # Transfer entre wallets
npm run swap        # Executar swap
npm run portfolio   # Consultar portfolio e history
npm run pools       # Operações com liquidity pools
```

## 📁 Estrutura do Projeto

```
notus-dx/
├── README.md                 # Este arquivo
├── package.json              # Dependências e scripts
├── tsconfig.json             # Configuração TypeScript
├── env.example               # Template de variáveis de ambiente
├── utils.ts                  # Utilitários (HTTP client, logger, retry)
├── scripts/                  # Scripts de teste
│   ├── 00_healthcheck.ts    # Verificação de conectividade
│   ├── 01_wallet.ts         # Operações de wallet
│   ├── 02_transfer.ts       # Transferências
│   ├── 03_swap.ts           # Swaps
│   ├── 04_portfolio.ts      # Portfolio e histórico
│   └── 05_pools.ts          # Liquidity pools
├── docs/                     # Documentação
│   ├── DAILY-BOARD.md       # Diário de bordo
│   └── FINAL-REPORT.md      # Relatório final
└── assets/                   # Evidências
    └── screenshots/          # Screenshots dos testes
```

## 🔧 Funcionalidades Implementadas

### Utils.ts
- **HTTP Client** com Axios, retry automático e backoff exponencial
- **Logger** estruturado com timing e status
- **Validação de ambiente** e configurações
- **Funções auxiliares** para sleep, safe print, etc.

### Scripts de Teste

#### 00_healthcheck.ts
- Verifica conectividade com a API
- Valida configurações de ambiente
- Testa endpoints básicos

#### 01_wallet.ts
- Cria/importa Smart Wallet
- Obtém endereço e chave pública
- Consulta balances iniciais

#### 02_transfer.ts
- Cria segunda wallet
- Executa transferência entre wallets
- Valida mudanças de saldo

#### 03_swap.ts
- Obtém cotação de swap
- Executa swap entre ativos
- Valida resultado e slippage

#### 04_portfolio.ts
- Consulta portfolio completo
- Obtém histórico de transações
- Exporta dados para CSV

#### 05_pools.ts
- Lista pools disponíveis
- Adiciona liquidez
- Remove liquidez (parcial)
- Verifica cotas e fees

## 📊 Logs e Telemetria

Todos os scripts geram logs estruturados com:

```
[operation] status ms=XXX status=200 txid=... amount=X asset=Y
```

**Campos logados:**
- `op`: Operação executada
- `ms`: Tempo em milissegundos
- `status`: Status HTTP
- `txid`: ID da transação (quando aplicável)
- `amount`: Valor da operação
- `asset`: Ativo envolvido
- `wallet`: Endereço da wallet

## 🐛 Tratamento de Erros

- **Retry automático** para 429 (rate limit) e 5xx (server errors)
- **Backoff exponencial** para evitar spam
- **Idempotência** com UUID para operações POST/PUT/DELETE
- **Logs detalhados** de erros para debugging

## 📝 Documentação

### Diário de Bordo
Preencha `docs/DAILY-BOARD.md` durante os testes com:
- Objetivos de cada sessão
- Tempo gasto
- Obstáculos encontrados
- Soluções aplicadas
- Evidências (screenshots)

### Relatório Final
Complete `docs/FINAL-REPORT.md` com:
- Cobertura de testes
- Observações de DX
- Sugestões objetivas
- Conclusões e recomendações

## 🎬 Demonstração

Para uma demonstração completa:

```bash
# 1. Verificar conectividade
npm run dev

# 2. Executar sequência completa
npm run wallet
npm run transfer  
npm run swap
npm run portfolio
npm run pools

# 3. Verificar logs e screenshots
ls -la assets/screenshots/
```

## 📸 Screenshots

Os scripts indicam quando capturar screenshots:
- `assets/screenshots/wallet-balances.png`
- `assets/screenshots/transfer-completed.png`
- `assets/screenshots/swap-executed.png`
- `assets/screenshots/portfolio-overview.png`
- `assets/screenshots/pools-operations.png`

## 🔗 Links Úteis

- **Discord Oficial:** https://discord.gg/7zmMuPcP
- **Formulário Pré-teste:** https://forms.gle/ugg7tEtAS8mFoizU8
- **Formulário Pós-teste:** https://forms.gle/CkQNkctn8yGRgPA26

## 📋 Checklist de Entrega

- [ ] Todos os scripts executando sem erro
- [ ] Logs claros e estruturados
- [ ] Screenshots capturados
- [ ] Diário de bordo preenchido
- [ ] Relatório final completo
- [ ] Post no LinkedIn
- [ ] Formulário pós-teste preenchido

## 🏆 Critérios de Sucesso

✅ **Scripts reprodutíveis** - rodar em 1 comando  
✅ **Logs claros** - tempo, request/response, IDs de tx  
✅ **README curto** - como executar  
✅ **Diário de bordo** - tentativa→erro→solução  
✅ **Relatório final** - insights de DX e sugestões  

---

**Notus Labs DX Research** - Elevando a ponte Web2 ↔ Web3 🚀
