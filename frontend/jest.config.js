module.exports = {
  moduleFileExtensions: ['js', 'jsx', 'json', 'vue'],
  transform: {
    '^.+\\.vue$': '@vue/vue3-jest',
    '^.+\\.(js|jsx)?$': 'babel-jest'
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  testEnvironment: 'jsdom',
  testMatch: [
    '<rootDir>/src/**/*.test.js'
  ],
  setupFiles: ['<rootDir>/src/setupTests.js'],
  transformIgnorePatterns: ['/node_modules/'],
  globals: {
    'vue-jest': {
      compilerOptions: {
        isCustomElement: (tag) => tag.startsWith('ion-')
      }
    }
  },
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons']
  }
} 