module.exports = {
  clearMocks: true,
  displayName: '@automatons/typescript-parser',
  roots: [
    "<rootDir>/src"
  ],
  testMatch: [
    "**/?(*.)+(spec|test).+(ts|tsx|js)",
  ],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  }
};
