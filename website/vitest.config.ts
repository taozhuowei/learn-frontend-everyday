import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@judge': path.resolve(__dirname, '../judge/src'),
    },
  },
  test: {
    include: [
      'test/unit/**/*.test.ts',
      'test/integration/**/*.test.ts',
      'test/problem-verifier/**/*.test.ts',
      '../judge/tests/**/*.test.ts',
    ],
    coverage: {
      provider: 'v8',
      include: ['../judge/src/**/*.ts', 'src/utils/**/*.ts', 'scripts/**/*.mjs'],
    },
    environment: 'node',
    globals: true,
  },
})
