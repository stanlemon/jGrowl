import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/*.test.mjs'],
    restoreMocks: true,
    clearMocks: true,
    coverage: {
      provider: 'v8',
      include: ['jquery.jgrowl.js'],
      reporter: ['text', 'html', 'lcov'],
      thresholds: { statements: 100, branches: 95, functions: 100, lines: 100 },
    },
  },
});
