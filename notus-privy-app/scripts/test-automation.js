#!/usr/bin/env node

/**
 * 🧪 Test Automation Script
 * Script para executar todos os testes automatizados
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('🚀 NOTUS DX RESEARCH - TEST AUTOMATION')
console.log('=====================================\n')

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function runCommand(command, description) {
  log(`\n${colors.blue}▶ ${description}${colors.reset}`)
  log(`Command: ${command}`)
  
  try {
    const output = execSync(command, { 
      encoding: 'utf8', 
      stdio: 'pipe',
      cwd: process.cwd()
    })
    
    log(`✅ ${description} - SUCCESS`, 'green')
    if (output.trim()) {
      console.log(output)
    }
    return true
  } catch (error) {
    log(`❌ ${description} - FAILED`, 'red')
    console.error(error.message)
    return false
  }
}

async function runTests() {
  const results = {
    unit: false,
    integration: false,
    e2e: false,
    api: false,
    build: false
  }

  // 1. Install dependencies
  log('\n📦 Installing dependencies...', 'blue')
  results.deps = runCommand('npm install', 'Install Dependencies')

  // 2. Run unit tests
  log('\n🧪 Running unit tests...', 'blue')
  results.unit = runCommand('npm run test:unit', 'Unit Tests')

  // 3. Run integration tests
  log('\n🔗 Running integration tests...', 'blue')
  results.integration = runCommand('npm run test:integration', 'Integration Tests')

  // 4. Run API tests
  log('\n🌐 Running API tests...', 'blue')
  results.api = runCommand('npm run test:api', 'API Tests')

  // 5. Build application
  log('\n🏗️ Building application...', 'blue')
  results.build = runCommand('npm run build', 'Build Application')

  // 6. Run E2E tests (if build succeeded)
  if (results.build) {
    log('\n🎭 Running E2E tests...', 'blue')
    results.e2e = runCommand('npm run test:e2e', 'E2E Tests')
  } else {
    log('\n⏭️ Skipping E2E tests (build failed)', 'yellow')
  }

  // 7. Generate test report
  generateTestReport(results)
}

function generateTestReport(results) {
  log('\n📊 TEST RESULTS SUMMARY', 'bold')
  log('========================', 'bold')

  const testTypes = [
    { key: 'deps', name: 'Dependencies', emoji: '📦' },
    { key: 'unit', name: 'Unit Tests', emoji: '🧪' },
    { key: 'integration', name: 'Integration Tests', emoji: '🔗' },
    { key: 'api', name: 'API Tests', emoji: '🌐' },
    { key: 'build', name: 'Build', emoji: '🏗️' },
    { key: 'e2e', name: 'E2E Tests', emoji: '🎭' }
  ]

  let passed = 0
  let total = 0

  testTypes.forEach(test => {
    const status = results[test.key]
    const statusText = status ? 'PASS' : 'FAIL'
    const color = status ? 'green' : 'red'
    
    log(`${test.emoji} ${test.name}: ${statusText}`, color)
    
    if (status) passed++
    total++
  })

  log('\n📈 OVERALL RESULTS', 'bold')
  log(`Passed: ${passed}/${total}`, passed === total ? 'green' : 'yellow')
  log(`Success Rate: ${Math.round((passed / total) * 100)}%`, passed === total ? 'green' : 'yellow')

  if (passed === total) {
    log('\n🎉 ALL TESTS PASSED!', 'green')
    log('The Notus DX Research implementation is working perfectly!', 'green')
  } else {
    log('\n⚠️ SOME TESTS FAILED', 'yellow')
    log('Please check the failed tests above and fix any issues.', 'yellow')
  }

  // Save results to file
  const reportData = {
    timestamp: new Date().toISOString(),
    results,
    summary: {
      passed,
      total,
      successRate: Math.round((passed / total) * 100)
    }
  }

  fs.writeFileSync(
    path.join(process.cwd(), 'test-results.json'),
    JSON.stringify(reportData, null, 2)
  )

  log('\n💾 Test results saved to test-results.json', 'blue')
}

// Run the tests
runTests().catch(error => {
  log(`\n💥 Test automation failed: ${error.message}`, 'red')
  process.exit(1)
})
