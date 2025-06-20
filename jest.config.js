/**
 * @type {import('jest').Config}
 */
const config = {
  // Automatically clear mock calls, instances, contexts and results before every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",

  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: "v8",

  // Prevent tests from printing messages through console.log/warn/error
  silent: false,

  // An array of glob patterns indicating which files should be covered by coverage
  collectCoverageFrom: [
    "src/**/*.{js,jsx,tsx}", // Removido 'ts' para não incluir arquivos .ts
    "!src/**/*.d.ts",
    "!src/**/*.test.{js,jsx,ts,tsx}",
    "!src/**/__tests__/**",
    "!src/app/layout.tsx",
    "!src/app/page.tsx",
    "!src/types/**", // Exclui toda a pasta types (geralmente só tem .ts)
  ],

  // Coverage thresholds - configurações iniciais mais flexíveis
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },

  // The test environment that will be used for testing
  testEnvironment: "jsdom",

  // A map from regular expressions to paths to transformers
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": ["babel-jest", { 
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        ['@babel/preset-react', { runtime: 'automatic' }],
        '@babel/preset-typescript'
      ]
    }],
  },

  // An array of regexp pattern strings that are matched against all source file paths before transformation
  transformIgnorePatterns: [
    "/node_modules/",
    "^.+\\.module\\.(css|sass|scss)$",
  ],

  // A map from regular expressions to module names or to arrays of module names that allow to stub out resources with a single module
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  // An array of directory names to be searched recursively up from the requiring module's location
  moduleDirectories: ["node_modules", "<rootDir>/"],

  // The paths to modules that run some code to configure or set up the testing environment before each test
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],

  // The glob patterns Jest uses to detect test files
  testMatch: [
    "**/__tests__/**/*.(js|jsx|tsx)",
    "**/*.(test|spec).(js|jsx|tsx)",
  ],

  // Explicitly ignore .ts files for testing (arquivos de tipo/interface)
  testPathIgnorePatterns: [
    "/node_modules/",
    "\\.ts$", // Ignora todos os arquivos .ts (tipos, interfaces, etc.)
    "\\.d\\.ts$", // Ignora arquivos de definição de tipos
  ],

  // The test environment options that allow to specify how environment is set up
  testEnvironmentOptions: {
    customExportConditions: [""],
  },
};

module.exports = config;
