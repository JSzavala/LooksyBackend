module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/__tests__/**/*.js', '**/*.test.js'],
  moduleDirectories: ['node_modules', 'src'],
  clearMocks: true,
  restoreMocks: true,
  testTimeout: 30000,

  verbose: true,
}
