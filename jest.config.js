module.exports = {
  clearMocks: true,
  projects: [
    "<rootDir>/packages/**/jest.config.js",
    "<rootDir>/examples/**/jest.config.js"
  ],
  collectCoverageFrom: [
    'src/**/*.(js|ts)',
    '!src/**/*.d.ts'
  ],
};
