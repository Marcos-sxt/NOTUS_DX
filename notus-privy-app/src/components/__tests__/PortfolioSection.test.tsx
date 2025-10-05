/**
 * 🧪 PortfolioSection Component Tests
 * Testes unitários para o componente PortfolioSection
 */

import { render, screen, waitFor } from '@testing-library/react'
import { PortfolioSection } from '../PortfolioSection'

// Mock usePortfolio hook
jest.mock('../../hooks/usePortfolio', () => ({
  usePortfolio: () => ({
    portfolio: {
      tokens: [
        {
          address: '0x1234567890123456789012345678901234567890',
          symbol: 'USDC',
          name: 'USD Coin',
          decimals: 6,
          balance: '1000.000000',
          balanceUSD: '1000.00'
        }
      ],
      totalValueUSD: '1000.00'
    },
    history: {
      transactions: [
        {
          id: 'tx-1',
          hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
          type: 'transfer',
          status: 'completed',
          amount: '100.000000',
          token: 'USDC',
          from: '0x1234567890123456789012345678901234567890',
          to: '0xabcdef1234567890abcdef1234567890abcdef12',
          timestamp: '2024-01-01T00:00:00Z',
          gasUsed: '21000',
          gasPrice: '20000000000'
        }
      ],
      total: 1
    },
    loading: false,
    error: null,
    loadPortfolio: jest.fn(),
    loadHistory: jest.fn(),
    refreshData: jest.fn()
  })
}))

describe('PortfolioSection Component', () => {
  const mockWalletAddress = '0x1234567890123456789012345678901234567890'

  test('should render portfolio information', async () => {
    render(<PortfolioSection walletAddress={mockWalletAddress} />)
    
    await waitFor(() => {
      expect(screen.getByText('Portfolio & Histórico')).toBeInTheDocument()
    })
    
    expect(screen.getAllByText((content, element) => {
      return element?.textContent === '$1000.00 USD'
    })).toHaveLength(2) // Should appear twice in the component
    expect(screen.getByText('Valor Total')).toBeInTheDocument()
  })

  test('should render token information', async () => {
    render(<PortfolioSection walletAddress={mockWalletAddress} />)
    
    await waitFor(() => {
      expect(screen.getByText('USDC')).toBeInTheDocument()
    })
    
    expect(screen.getByText('USD Coin')).toBeInTheDocument()
    expect(screen.getByText((content, element) => {
      return element?.textContent === '1000.000000 USDC'
    })).toBeInTheDocument()
    expect(screen.getAllByText((content, element) => {
      return element?.textContent === '$1000.00 USD'
    })).toHaveLength(2) // Should appear twice in the component
  })

  test('should render transaction history', async () => {
    render(<PortfolioSection walletAddress={mockWalletAddress} />)
    
    await waitFor(() => {
      expect(screen.getByText('📜 Histórico de Transações')).toBeInTheDocument()
    })
    
    expect(screen.getByText('Total: 1 transações')).toBeInTheDocument()
    expect(screen.getByText('transfer - completed')).toBeInTheDocument()
  })

  test('should render refresh button', async () => {
    render(<PortfolioSection walletAddress={mockWalletAddress} />)
    
    await waitFor(() => {
      expect(screen.getByText('Atualizar')).toBeInTheDocument()
    })
  })

  test('should not render when walletAddress is null', () => {
    const { container } = render(<PortfolioSection walletAddress={null} />)
    expect(container.firstChild).toBeNull()
  })

  test('should display loading state', () => {
    // Mock loading state
    const mockUsePortfolio = jest.fn(() => ({
      portfolio: null,
      history: null,
      loading: true,
      error: null,
      loadPortfolio: jest.fn(),
      loadHistory: jest.fn(),
      refreshData: jest.fn()
    }))
    
    // Temporarily replace the mock
    const originalMock = require('../../hooks/usePortfolio').usePortfolio
    require('../../hooks/usePortfolio').usePortfolio = mockUsePortfolio

    render(<PortfolioSection walletAddress={mockWalletAddress} />)
    
    expect(screen.getByText('Carregando dados...')).toBeInTheDocument()
    
    // Restore original mock
    require('../../hooks/usePortfolio').usePortfolio = originalMock
  })

  test('should display error state', () => {
    // Mock error state
    const mockUsePortfolio = jest.fn(() => ({
      portfolio: null,
      history: null,
      loading: false,
      error: 'API Error',
      loadPortfolio: jest.fn(),
      loadHistory: jest.fn(),
      refreshData: jest.fn()
    }))
    
    // Temporarily replace the mock
    const originalMock = require('../../hooks/usePortfolio').usePortfolio
    require('../../hooks/usePortfolio').usePortfolio = mockUsePortfolio

    render(<PortfolioSection walletAddress={mockWalletAddress} />)
    
    expect(screen.getByText('❌ Erro: API Error')).toBeInTheDocument()
    
    // Restore original mock
    require('../../hooks/usePortfolio').usePortfolio = originalMock
  })
})
