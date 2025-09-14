// jest.config.js
module.exports = {
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.js"],
  collectCoverageFrom: ["src/**/*.js", "!server.js", "!src/config/**"],
  setupFilesAfterEnv: ["<rootDir>/tests/setup/jest.setup.js"],
};
