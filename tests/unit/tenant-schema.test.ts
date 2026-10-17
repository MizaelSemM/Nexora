// Regressão estrutural (004): o schema não pode "escapar" do isolamento.
//
// Se alguém criar um novo model SEM account_id (e sem estar na allowlist de
// models globais) ou esquecer de cobri-lo em TENANT_MODELS, este teste quebra.
import { readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { MODELS_WITHOUT_ACCOUNT_ID, TENANT_MODELS } from "@/lib/tenant-prisma";

const schema = readFileSync(path.join(process.cwd(), "prisma/schema.prisma"), "utf8");

function parseModels(source: string): { name: string; body: string }[] {
  return [...source.matchAll(/^model (\w+) \{([\s\S]*?)^\}/gm)].map((match) => ({
    name: match[1],
    body: match[2],
  }));
}

const models = parseModels(schema);
const toClientName = (pascal: string) => pascal.charAt(0).toLowerCase() + pascal.slice(1);

describe("regressão estrutural do schema (isolamento por conta)", () => {
  it("encontrou os models do schema", () => {
    expect(models.length).toBeGreaterThanOrEqual(12);
  });

  it("todo model tem accountId — exceto os globais da allowlist", () => {
    const allowlist = MODELS_WITHOUT_ACCOUNT_ID as readonly string[];
    const offenders = models
      .filter((model) => !allowlist.includes(model.name))
      .filter((model) => !/\baccountId\b/.test(model.body))
      .map((model) => model.name);

    expect(offenders).toEqual([]);
  });

  it("TENANT_MODELS cobre exatamente os models do schema", () => {
    const fromSchema = models.map((model) => toClientName(model.name)).sort();
    const fromExtension = [...TENANT_MODELS].sort();

    expect(fromExtension).toEqual(fromSchema);
  });
});
