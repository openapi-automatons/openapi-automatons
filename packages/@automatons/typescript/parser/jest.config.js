module.exports = {
  clearMocks: true,
  displayName: '@automatons/typescript-parser',
  collectCoverageFrom: [
    'src/**/*.(js|ts)',
    '!src/**/*.d.ts'
  ],
  roots: [
    "<rootDir>/src"
  ],
  testMatch: [
    "**/?(*.)+(spec|test).+(ts|js)",
  ],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  }
};
