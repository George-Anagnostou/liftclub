module.exports = {
  clearMocks: true,
  coverageDirectory: "coverage",
  preset: "@shelf/jest-mongodb",
  setupFiles: ["<rootDir>/jestEnvVars.js"],
};
