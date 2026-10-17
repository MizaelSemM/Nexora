import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    setupFiles: ["./tests/setup.ts"],
    // Banco remoto (Supabase): cada query custa ~200ms; o padrão de 5s aperta.
    testTimeout: 30_000,
    hookTimeout: 30_000,
  },
});
