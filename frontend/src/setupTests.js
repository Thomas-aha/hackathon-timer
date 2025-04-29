import { vi } from 'vitest'
import '@testing-library/jest-dom'

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
  removeItem: vi.fn(),
  length: 0,
  key: vi.fn()
}

global.localStorage = localStorageMock

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }))
})

global.expect = expect
global.describe = describe
global.it = it
global.beforeAll = beforeAll
global.beforeEach = beforeEach
global.afterAll = afterAll
global.afterEach = afterEach