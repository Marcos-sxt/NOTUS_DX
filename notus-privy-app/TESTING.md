# 🧪 **TESTING GUIDE - NOTUS DX RESEARCH**

## 📋 **Visão Geral dos Testes**

Este projeto implementa uma **suíte completa de testes automatizados** para validar todas as funcionalidades da Notus DX Research, incluindo:

- **🧪 Testes Unitários** - Componentes e hooks individuais
- **🔗 Testes de Integração** - Fluxos completos de funcionalidades
- **🌐 Testes de API** - Endpoints da Notus API
- **🎭 Testes E2E** - Experiência completa do usuário
- **🏗️ Testes de Build** - Validação da aplicação

---

## 🚀 **Execução Rápida**

### **Executar Todos os Testes**
```bash
# Instalar dependências
npm install

# Executar todos os testes
npm run test

# Executar com cobertura
npm run test:coverage

# Executar testes E2E
npm run test:e2e
```

### **Executar Testes Específicos**
```bash
# Apenas testes unitários
npm run test:unit

# Apenas testes de integração
npm run test:integration

# Apenas testes de API
npm run test:api

# Apenas testes E2E
npm run test:e2e
```

### **Automação Completa**
```bash
# Executar script de automação completo
node scripts/test-automation.js
```

---

## 🧪 **Tipos de Testes**

### **1. Testes Unitários**
**Localização**: `src/**/__tests__/*.test.tsx`

**Cobertura**:
- ✅ Hooks customizados (`useSmartWallet`, `usePortfolio`, etc.)
- ✅ Componentes React (`PortfolioSection`, `LiquiditySection`, etc.)
- ✅ Utilitários e helpers
- ✅ Lógica de negócio

**Exemplo**:
```typescript
// src/hooks/__tests__/useSmartWallet.test.tsx
test('should load smart wallet on mount', async () => {
  const { result } = renderHook(() => useSmartWallet())
  
  await waitFor(() => {
    expect(result.current.wallet).toBeDefined()
  })
})
```

### **2. Testes de Integração**
**Localização**: `src/__tests__/integration/*.test.ts`

**Cobertura**:
- ✅ Fluxos de autenticação completos
- ✅ Integração entre componentes
- ✅ Fluxos de DeFi (swap, liquidity, etc.)
- ✅ Navegação entre páginas

**Exemplo**:
```typescript
// src/__tests__/integration/auth.test.ts
test('should handle Privy login click', () => {
  render(<Home />)
  
  const privyButton = screen.getByText('Sign In with Privy')
  fireEvent.click(privyButton)
  
  expect(mockLogin).toHaveBeenCalled()
})
```

### **3. Testes de API**
**Localização**: `src/__tests__/api/*.test.ts`

**Cobertura**:
- ✅ Endpoints da Notus API
- ✅ Validação de requests/responses
- ✅ Tratamento de erros
- ✅ Headers e autenticação

**Exemplo**:
```typescript
// src/__tests__/api/notus-api.test.ts
test('should test wallet endpoints', async () => {
  const response = await fetch('/api/v1/wallets/0x123...')
  const data = await response.json()
  
  expect(response.ok).toBe(true)
  expect(data.wallet).toBeDefined()
})
```

### **4. Testes E2E (End-to-End)**
**Localização**: `src/__tests__/e2e/*.spec.ts`

**Cobertura**:
- ✅ Navegação completa da aplicação
- ✅ Fluxos de usuário reais
- ✅ Responsividade em diferentes dispositivos
- ✅ Interações com elementos da UI

**Exemplo**:
```typescript
// src/__tests__/e2e/homepage.spec.ts
test('should load homepage successfully', async ({ page }) => {
  await page.goto('/')
  
  await expect(page.getByText('Notus DX Research')).toBeVisible()
  await expect(page.getByText('Sign In with Privy')).toBeVisible()
})
```

---

## 🛠️ **Configuração dos Testes**

### **Jest (Unit & Integration)**
```javascript
// jest.config.js
module.exports = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
}
```

### **Playwright (E2E)**
```typescript
// playwright.config.ts
export default defineConfig({
  testDir: './src/__tests__/e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
})
```

---

## 📊 **Cobertura de Testes**

### **Métricas Atuais**
- **Linhas de Código**: 70%+ cobertura
- **Funções**: 70%+ cobertura
- **Branches**: 70%+ cobertura
- **Statements**: 70%+ cobertura

### **Relatórios de Cobertura**
```bash
# Gerar relatório de cobertura
npm run test:coverage

# Visualizar relatório
open coverage/lcov-report/index.html
```

---

## 🎯 **Cenários de Teste**

### **Autenticação**
- ✅ Login com Privy
- ✅ Login com Web3Auth
- ✅ Conexão com MetaMask
- ✅ Logout e desconexão
- ✅ Estados de loading e erro

### **Smart Wallets**
- ✅ Criação de smart wallets
- ✅ Carregamento de wallets existentes
- ✅ Registro de wallets
- ✅ Tratamento de erros

### **DeFi Funcionalidades**
- ✅ Consulta de portfolio
- ✅ Histórico de transações
- ✅ Liquidity pools
- ✅ Swaps e cross-chain swaps
- ✅ Geração de cotações

### **Infraestrutura**
- ✅ Webhooks
- ✅ Analytics
- ✅ KYC e Ramp
- ✅ Navegação entre páginas

---

## 🚨 **Tratamento de Erros**

### **Mocks e Stubs**
```typescript
// Mock de APIs externas
jest.mock('@privy-io/react-auth', () => ({
  usePrivy: () => ({
    user: mockUser,
    login: jest.fn(),
    logout: jest.fn(),
  })
}))

// Mock de fetch
global.fetch = jest.fn()
```

### **Testes de Erro**
```typescript
test('should handle API errors gracefully', async () => {
  global.fetch.mockRejectedValueOnce(new Error('API Error'))
  
  const { result } = renderHook(() => useSmartWallet())
  
  await waitFor(() => {
    expect(result.current.error).toBeDefined()
  })
})
```

---

## 📈 **CI/CD Integration**

### **GitHub Actions**
```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run test
      - run: npm run test:e2e
```

### **Pre-commit Hooks**
```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run test:unit && npm run lint"
    }
  }
}
```

---

## 🔧 **Troubleshooting**

### **Problemas Comuns**

**1. Testes falhando por timeout**
```bash
# Aumentar timeout
npm run test -- --testTimeout=10000
```

**2. Mocks não funcionando**
```typescript
// Verificar se o mock está no local correto
jest.mock('../../lib/actions/wallet')
```

**3. E2E tests falhando**
```bash
# Instalar browsers do Playwright
npx playwright install
```

**4. Coverage baixo**
```bash
# Verificar arquivos ignorados
# Ajustar collectCoverageFrom no jest.config.js
```

---

## 📚 **Recursos Adicionais**

### **Documentação**
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Testing Library Documentation](https://testing-library.com/docs/)

### **Ferramentas**
- **Jest**: Testes unitários e integração
- **Playwright**: Testes E2E
- **Testing Library**: Utilitários para testes React
- **MSW**: Mock Service Worker para APIs

---

## 🎉 **Conclusão**

Esta suíte de testes garante que a **Notus DX Research** está funcionando corretamente em todos os níveis:

- ✅ **Qualidade de Código** - Testes unitários robustos
- ✅ **Integração Perfeita** - Fluxos completos testados
- ✅ **Experiência do Usuário** - E2E tests abrangentes
- ✅ **Confiabilidade da API** - Testes de endpoints
- ✅ **Deploy Seguro** - Validação antes de produção

**Execute os testes regularmente para manter a qualidade e confiabilidade da aplicação!** 🚀
