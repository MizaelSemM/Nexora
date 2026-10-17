import { describe, expect, it } from "vitest";

import { ownerScope } from "@/lib/access";
import { sanitizeRedirectPath } from "@/lib/safe-redirect";

describe("sanitizeRedirectPath (anti open redirect)", () => {
  it("permite caminho interno (com query)", () => {
    expect(sanitizeRedirectPath("/equipe?convite=1")).toBe("/equipe?convite=1");
  });

  it("bloqueia destino externo e protocol-relative", () => {
    expect(sanitizeRedirectPath("https://evil.com/phish")).toBe("/");
    expect(sanitizeRedirectPath("//evil.com")).toBe("/");
    expect(sanitizeRedirectPath("/\\evil.com")).toBe("/");
    expect(sanitizeRedirectPath("javascript:alert(1)")).toBe("/");
  });

  it("sem valor, cai no fallback", () => {
    expect(sanitizeRedirectPath(null)).toBe("/");
    expect(sanitizeRedirectPath(undefined)).toBe("/");
    expect(sanitizeRedirectPath("")).toBe("/");
  });
});

describe("ownerScope (recorte por papel)", () => {
  it("ADMIN vê tudo (sem filtro de responsável)", () => {
    expect(ownerScope({ id: "u1", role: "ADMIN" })).toEqual({});
  });

  it("SELLER só vê o próprio (filtro por ownerId)", () => {
    expect(ownerScope({ id: "u1", role: "SELLER" })).toEqual({ ownerId: "u1" });
  });
});
