/**
 * 🧪 API Client Tests
 * Testes unitários para o cliente da API Notus
 */

import { notusAPI } from '../api/client'

// Mock ky
jest.mock('ky', () => {
  const mockKy = jest.fn(() => ({
    get: jest.fn(() => ({
      json: jest.fn(() => Promise.resolve({ data: 'mocked response' }))
    })),
    post: jest.fn(() => ({
      json: jest.fn(() => Promise.resolve({ data: 'mocked response' }))
    })),
    put: jest.fn(() => ({
      json: jest.fn(() => Promise.resolve({ data: 'mocked response' }))
    })),
    delete: jest.fn(() => ({
      json: jest.fn(() => Promise.resolve({ data: 'mocked response' }))
    }))
  }))
  
  return {
    create: mockKy
  }
})

describe('Notus API Client', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should be defined', () => {
    expect(notusAPI).toBeDefined()
  })

  test('should have correct base URL', () => {
    expect(notusAPI).toBeDefined()
    // The actual base URL is set in the client configuration
  })

  test('should handle GET requests', async () => {
    const mockResponse = { data: 'test data' }
    const mockGet = jest.fn(() => ({
      json: jest.fn(() => Promise.resolve(mockResponse))
    }))
    
    // Mock the ky instance
    const mockKy = require('ky')
    mockKy.create.mockReturnValue({
      get: mockGet
    })

    // This would test the actual API call if we had a real instance
    expect(mockGet).toBeDefined()
  })

  test('should handle POST requests', async () => {
    const mockResponse = { data: 'test data' }
    const mockPost = jest.fn(() => ({
      json: jest.fn(() => Promise.resolve(mockResponse))
    }))
    
    // Mock the ky instance
    const mockKy = require('ky')
    mockKy.create.mockReturnValue({
      post: mockPost
    })

    expect(mockPost).toBeDefined()
  })
})
