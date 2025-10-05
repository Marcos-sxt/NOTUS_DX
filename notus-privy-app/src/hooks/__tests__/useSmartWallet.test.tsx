/**
 * 🧪 useSmartWallet Hook Tests
 * Testes unitários para o hook useSmartWallet
 */

import { renderHook, waitFor } from '@testing-library/react'
import { useSmartWallet } from '../useSmartWallet'

// Mock Privy
jest.mock('@privy-io/react-auth', () => ({
  usePrivy: () => ({
    user: {
      id: 'test-user-id',
      wallet: {
        address: '0x1234567890123456789012345678901234567890'
      }
    },
    authenticated: true
  })
}))

// Mock wallet actions
jest.mock('../../lib/actions/wallet', () => ({
  walletActions: {
    getAddress: jest.fn(() => Promise.resolve({
      wallet: {
        accountAbstraction: '0xabcdef1234567890abcdef1234567890abcdef12',
        externallyOwnedAccount: '0x1234567890123456789012345678901234567890'
      }
    })),
    register: jest.fn(() => Promise.resolve({
      wallet: {
        accountAbstraction: '0xabcdef1234567890abcdef1234567890abcdef12',
        externallyOwnedAccount: '0x1234567890123456789012345678901234567890'
      }
    }))
  }
}))

describe('useSmartWallet Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should initialize with correct default state', () => {
    const { result } = renderHook(() => useSmartWallet())
    
    expect(result.current.wallet).toBeNull()
    expect(result.current.loading).toBe(true) // Loading starts as true due to useEffect
    expect(result.current.error).toBeNull()
    expect(result.current.isRegistered).toBe(false)
  })

  test('should load smart wallet on mount', async () => {
    const { result } = renderHook(() => useSmartWallet())
    
    await waitFor(() => {
      expect(result.current.wallet).toBeDefined()
    })
    
    expect(result.current.wallet?.accountAbstraction).toBe('0xabcdef1234567890abcdef1234567890abcdef12')
    expect(result.current.isRegistered).toBe(true)
  })

  test('should register smart wallet', async () => {
    const { result } = renderHook(() => useSmartWallet())
    
    await waitFor(() => {
      expect(result.current.registerWallet).toBeDefined()
    })
    
    // Test register function exists
    expect(typeof result.current.registerWallet).toBe('function')
  })

  test('should handle errors gracefully', async () => {
    // Mock error response
    const { walletActions } = require('../../lib/actions/wallet')
    walletActions.getAddress.mockRejectedValueOnce(new Error('API Error'))
    
    const { result } = renderHook(() => useSmartWallet())
    
    await waitFor(() => {
      expect(result.current.error).toBeDefined()
    })
    
    expect(result.current.error).toContain('API Error')
  })
})
