module.exports = {
  branches: ['main'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    ["@semantic-release/changelog", {
      "changelogFile": "CHANGELOG.md",
    }],
    ['@semantic-release/exec', {
      "prepare": "rm package.json && cp dist/package.json ."
    }],
    ['@semantic-release/npm', {
      "pkgRoot": "dist"
    }],
    ["@semantic-release/git", {
      "assets": ["CHANGELOG.md", "package.json"],
    }],
    '@semantic-release/github'
  ],
};
