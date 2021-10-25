module.exports = {
  clearMocks: true,
  coverageDirectory: "coverage",
  preset: "@shelf/jest-mongodb",
  setupFiles: ["<rootDir>/jestEnvVars.js"],
  testEnvironment: "jsdom",
  moduleNameMapper: {
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  },
};
