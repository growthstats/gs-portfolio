import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

// The root config only collects tests under `src/`, and scripts are out of its scope.
export default defineConfig({
  root: fileURLToPath(new URL('../..', import.meta.url)),
  resolve: {
    alias: { '@': fileURLToPath(new URL('../../src', import.meta.url)) },
  },
  test: { include: ['scripts/i18n/**/*.test.ts'] },
})
