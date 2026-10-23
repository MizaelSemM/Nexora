import { describe, expect, it } from "vitest";

import {
  createLeadSchema,
  firstContactIssueMessage,
  updateContactSchema,
} from "@/lib/schemas/contact";

describe("createLeadSchema", () => {
  it("aceita só nome + telefone e trata o resto como opcional", () => {
    const parsed = createLeadSchema.safeParse({
      name: "  Carla Mendes  ",
      phone: " (11) 98765-4321 ",
      email: "",
      companyText: "",
      origin: "",
      ownerId: "",
    });

    expect(parsed.success).toBe(true);
    if (!parsed.success) return;
    expect(parsed.data).toEqual({
      name: "Carla Mendes",
      phone: "(11) 98765-4321",
      email: undefined,
      companyText: undefined,
      origin: undefined,
      ownerId: undefined,
    });
  });

  it("normaliza e-mail para minúsculas", () => {
    const parsed = createLeadSchema.safeParse({
      name: "Carla",
      phone: "11987654321",
      email: "  CARLA@EMPRESA.COM ",
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.email).toBe("carla@empresa.com");
  });

  it("rejeita nome curto, telefone vazio, e-mail e origem inválidos", () => {
    const shortName = createLeadSchema.safeParse({ name: "A", phone: "11987654321" });
    expect(shortName.success).toBe(false);
    if (!shortName.success) expect(firstContactIssueMessage(shortName.error)).toMatch(/mín\. 2/);

    const noPhone = createLeadSchema.safeParse({ name: "Carla", phone: "" });
    expect(noPhone.success).toBe(false);

    const badEmail = createLeadSchema.safeParse({
      name: "Carla",
      phone: "11987654321",
      email: "nao-e-email",
    });
    expect(badEmail.success).toBe(false);
    if (!badEmail.success) expect(badEmail.error.issues[0]?.message).toBe("E-mail inválido.");

    const badOrigin = createLeadSchema.safeParse({
      name: "Carla",
      phone: "11987654321",
      origin: "TIKTOK",
    });
    expect(badOrigin.success).toBe(false);
  });

  it("updateContactSchema segue as mesmas regras", () => {
    expect(updateContactSchema.safeParse({ name: "Carla", phone: "11987654321" }).success).toBe(
      true,
    );
    expect(updateContactSchema.safeParse({ name: "C", phone: "11987654321" }).success).toBe(false);
  });
});
