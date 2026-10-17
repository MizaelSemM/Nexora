import { describe, expect, it } from "vitest";

import {
  acceptInviteSchema,
  createInviteSchema,
  firstIssueMessage,
  loginSchema,
  requestPasswordResetSchema,
  resetPasswordSchema,
  signUpCompanySchema,
} from "@/lib/schemas/auth";

describe("schemas de autenticação (003)", () => {
  it("normaliza e-mail (trim + minúsculas) e valida o formato", () => {
    const parsed = loginSchema.safeParse({ email: "  Maria@Empresa.COM  ", password: "12345678" });
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.email).toBe("maria@empresa.com");

    const invalid = requestPasswordResetSchema.safeParse({ email: "nao-e-email" });
    expect(invalid.success).toBe(false);
    if (!invalid.success) expect(firstIssueMessage(invalid.error)).toContain("válido");
  });

  it("cadastro exige senha de 8+ caracteres (mesmos limites do Better Auth)", () => {
    const result = signUpCompanySchema.safeParse({
      companyName: "Loja do Bairro",
      name: "Ana Souza",
      email: "ana@loja.com",
      password: "1234567",
    });
    expect(result.success).toBe(false);
    if (!result.success) expect(firstIssueMessage(result.error)).toContain("8 caracteres");
  });

  it("reset de senha exige confirmação igual", () => {
    const mismatch = resetPasswordSchema.safeParse({
      token: "um-token-qualquer",
      newPassword: "senha-nova-1",
      confirmPassword: "outra-senha",
    });
    expect(mismatch.success).toBe(false);
    if (!mismatch.success) expect(firstIssueMessage(mismatch.error)).toMatch(/não conferem/i);

    const ok = resetPasswordSchema.safeParse({
      token: "um-token-qualquer",
      newPassword: "senha-nova-1",
      confirmPassword: "senha-nova-1",
    });
    expect(ok.success).toBe(true);
  });

  it("convite: papel restrito a ADMIN/SELLER e e-mail normalizado", () => {
    const ok = createInviteSchema.safeParse({ email: " Vendedor@X.com ", role: "SELLER" });
    expect(ok.success).toBe(true);
    if (ok.success) expect(ok.data.email).toBe("vendedor@x.com");

    expect(createInviteSchema.safeParse({ email: "a@b.com", role: "OWNER" }).success).toBe(false);
  });

  it("aceite de convite exige token com tamanho mínimo", () => {
    const result = acceptInviteSchema.safeParse({
      token: "curto",
      name: "Ana Souza",
      password: "12345678",
    });
    expect(result.success).toBe(false);
  });
});
