import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['**/*.test.ts'],
    setupFiles: ['./tests/db.setup.ts', './tests/remote/integration/mocking.setup.ts'],
    silent: false,
  },
});
