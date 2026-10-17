// Regressão estrutural (004; atualizada na 003): o schema não pode "escapar" do isolamento.
//
// Se alguém criar um novo model SEM account_id de tenant (e sem estar na
// allowlist de models globais) ou esquecer de cobri-lo em TENANT_MODELS /
// GLOBAL_MODELS, este teste quebra.
import { readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { GLOBAL_MODELS, TENANT_MODELS } from "@/lib/tenant-prisma";

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

  it("todo model tem accountId de tenant — exceto os globais da allowlist", () => {
    // A checagem é textual: o `AuthAccount` (credenciais do Better Auth) tem um
    // campo chamado `accountId`, mas ali ele é o id do PROVEDOR — por isso ele
    // está na allowlist de globais.
    const allowlist = GLOBAL_MODELS as readonly string[];
    const offenders = models
      .filter((model) => !allowlist.includes(model.name))
      .filter((model) => !/\baccountId\b/.test(model.body))
      .map((model) => model.name);

    expect(offenders).toEqual([]);
  });

  it("TENANT_MODELS + GLOBAL_MODELS particionam exatamente os models do schema", () => {
    const actual = models.map((model) => toClientName(model.name)).sort();
    const listed = [...TENANT_MODELS, ...GLOBAL_MODELS.map(toClientName)].sort();

    expect(listed).toEqual(actual);
  });

  it("as listas não se sobrepõem", () => {
    const globalClientNames = GLOBAL_MODELS.map(toClientName);
    const intersection = TENANT_MODELS.filter((model) => globalClientNames.includes(model));
    expect(intersection).toEqual([]);
  });
});
