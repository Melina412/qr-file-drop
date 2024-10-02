import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['**/*.test.ts'],
    setupFiles: ['./tests/integration/db.setup.ts'],
  },
});
