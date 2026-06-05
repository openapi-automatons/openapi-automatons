import {defineConfig} from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    clearMocks: true,
    include: ['src/**/*.{test,spec}.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.d.ts', 'src/**/__tests__/**', 'src/**/*.{test,spec}.ts', 'src/cli.ts'],
    },
  },
});
