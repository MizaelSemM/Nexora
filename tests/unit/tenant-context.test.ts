import { describe, expect, it } from "vitest";

import {
  getTenantContext,
  requireTenantContext,
  runWithTenant,
  TenantContextMissingError,
} from "@/lib/tenant-context";

describe("tenant-context", () => {
  it("lança quando não há contexto ativo", () => {
    expect(getTenantContext()).toBeUndefined();
    expect(() => requireTenantContext()).toThrow(TenantContextMissingError);
  });

  it("propaga o contexto por código assíncrono", async () => {
    await runWithTenant({ accountId: "acc-a", userId: "user-1" }, async () => {
      await new Promise((resolve) => setTimeout(resolve, 5));
      const context = requireTenantContext();
      expect(context.accountId).toBe("acc-a");
      expect(context.userId).toBe("user-1");
    });
  });

  it("não vaza entre contextos aninhados", () => {
    runWithTenant({ accountId: "acc-a" }, () => {
      expect(requireTenantContext().accountId).toBe("acc-a");
      runWithTenant({ accountId: "acc-b" }, () => {
        expect(requireTenantContext().accountId).toBe("acc-b");
      });
      expect(requireTenantContext().accountId).toBe("acc-a");
    });
  });
});
