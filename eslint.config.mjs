import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import eslintConfigPrettier from "eslint-config-prettier/flat";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  eslintConfigPrettier,
  // Regra do projeto (004): SQL cru não passa pelo isolamento de conta.
  {
    rules: {
      "no-restricted-properties": [
        "error",
        {
          property: "$queryRaw",
          message:
            "SQL cru bloqueado (004): use `tenantDb()` — o client que injeta o filtro de conta. Se for inevitável, crie um wrapper revisado em lib/ e desative a regra pontualmente com justificativa.",
        },
        {
          property: "$queryRawUnsafe",
          message: "SQL cru bloqueado (004) — ver a regra de $queryRaw.",
        },
        {
          property: "$executeRaw",
          message: "SQL cru bloqueado (004) — ver a regra de $queryRaw.",
        },
        {
          property: "$executeRawUnsafe",
          message: "SQL cru bloqueado (004) — ver a regra de $queryRaw.",
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Artefatos locais
    "coverage/**",
    "test-results/**",
    "playwright-report/**",
    // Código gerado (Prisma Client)
    "lib/generated/**",
  ]),
]);

export default eslintConfig;
