module.exports = {
  // Indicates that the root of your source code is `src`
  roots: ['<rootDir>/src'],

  // The test environment that will be used for testing
  testEnvironment: 'node',

  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: ['src/**/*.{js,mjs}'],

  // A list of paths to modules that run some code to configure or set up the testing framework before each test
  // setupFilesAfterEnv: ['<rootDir>/src/tests/setupTests.js'],

  // Use this transform for ES Modules
  transform: {},
  
  // A map from regular expressions to module names or to arrays of module names that allow to stub out resources with a single module
  // This helps Jest understand ES Modules
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },

  // An array of file extensions your modules use
  moduleFileExtensions: ['js', 'mjs', 'json', 'node'],

  // The glob patterns Jest uses to detect test files
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[tj]s?(x)',
    '**/src/tests/**/*.test.js',
  ],
};