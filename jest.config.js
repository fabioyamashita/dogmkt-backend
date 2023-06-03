module.exports = {
  // testEnvironment: 'node', // This can conflict with jest-mongodb
  testMatch: ['**/*.test.js'],
  moduleFileExtensions: ['js', 'jsx'],
  setupFilesAfterEnv: [],
  preset: '@shelf/jest-mongodb',
  watchPathIgnorePatterns: ['globalConfig']
};