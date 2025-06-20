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
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/*.test.{js,jsx,ts,tsx}",
    "!src/**/__tests__/**",
    "!src/app/layout.tsx",
    "!src/app/page.tsx",
  ],

  // Coverage thresholds - configurações iniciais mais flexíveis
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 40,
      lines: 50,
      statements: 50,
    },
  },

  // The test environment that will be used for testing
  testEnvironment: "jsdom",

  // A map from regular expressions to paths to transformers
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": ["babel-jest", { presets: ["next/babel"] }],
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

  // The test environment options that allow to specify how environment is set up
  testEnvironmentOptions: {
    customExportConditions: [""],
  },
};

module.exports = config;
