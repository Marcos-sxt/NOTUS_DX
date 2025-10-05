# Privy + Notus API Integration

Este projeto demonstra uma **integração real** entre **Privy** (autenticação Web3) e **Notus API** (Account Abstraction).

## 🚀 Funcionalidades

- **Autenticação real** via Privy (email, social, wallet)
- **Criação automática** de embedded wallets
- **Registro de smart wallets** na Notus API
- **Geração de cotações** de transfer
- **Execução de UserOperations** (simulada)

## 🛠️ Stack Técnico

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Privy React SDK** (Frontend)
- **Privy Server SDK** (Backend)
- **Notus API** (Account Abstraction)

## 🔧 Configuração

1. **Clone e instale:**
```bash
cd notus-privy-app
npm install
```

2. **Configure as variáveis de ambiente:**
```bash
cp .env.example .env.local
# Edite .env.local com suas credenciais
```

3. **Execute:**
```bash
npm run dev
```

## 📋 Variáveis de Ambiente

```env
# Privy Configuration
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
PRIVY_APP_SECRET=your_privy_app_secret

# Notus API Configuration
NEXT_PUBLIC_NOTUS_API_URL=https://api.notus.team/api/v1
NEXT_PUBLIC_NOTUS_API_KEY=your_notus_api_key

# Webhook Configuration
WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Network Configuration
NEXT_PUBLIC_NETWORK=testnet
```

## 🔗 Configuração de Webhooks

### 1. Configure o Webhook Secret
Adicione o `WEBHOOK_SECRET` no seu `.env.local`:
```env
WEBHOOK_SECRET=whsec_your_webhook_secret_from_notus_dashboard
```

### 2. Configure no Dashboard da Notus
1. Acesse [dashboard.notus.team](https://dashboard.notus.team)
2. Vá para a seção "Webhooks"
3. Clique "Create Webhook"
4. Configure:
   - **Webhook URL**: `https://seu-dominio.com/api/webhooks`
   - **Eventos**: Selecione os eventos desejados (Swap, Cross swap, etc.)

### 3. Eventos Suportados
- ✅ Swap completado
- ✅ Cross swap completado  
- ✅ Transfer de saque
- ✅ Transfer de depósito
- ✅ Adição de liquidez
- ✅ KYC completado
- ✅ On-ramp completado
- ✅ Off-ramp completado

### 4. Validação de Segurança
O endpoint implementa validação Svix para garantir a autenticidade dos webhooks:
- Verificação de assinatura HMAC SHA-256
- Validação de timestamp (prevenção de replay attacks)
- Headers obrigatórios: `svix-id`, `svix-timestamp`, `svix-signature`

## 🎯 Como Funciona

1. **Usuário faz login** via Privy (email, social, wallet)
2. **Privy cria embedded wallet** automaticamente
3. **App registra smart wallet** na Notus API
4. **Usuário gera cotação** de transfer
5. **App executa UserOperation** (simulado)

## 🔍 Diferenças dos Scripts

- **Scripts:** Testam API sem autenticação real
- **Este App:** Autenticação real + fluxo completo
- **Resultado:** Integração 100% funcional

## 📊 Status

- ✅ **Privy Authentication** - Funcionando
- ✅ **Embedded Wallets** - Funcionando  
- ✅ **Smart Wallet Registration** - Funcionando
- ✅ **Transfer Quotes** - Funcionando
- ⚠️ **UserOperation Execution** - Simulado (precisa de assinatura real)

## 🚀 Próximos Passos

- Implementar assinatura real do Privy
- Adicionar mais tipos de transação
- Implementar portfolio e histórico
- Adicionar testes automatizados