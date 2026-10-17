import { auth } from "@/lib/auth";
import { runWithSignupContext } from "@/lib/auth-signup-context";
import { prismaBase } from "@/lib/prisma";
import type { SignUpCompanyInput } from "@/lib/schemas/auth";
import { isAlreadyExistsError } from "@/server/auth-errors";
import { AppError } from "@/server/errors";

/**
 * Criação de empresa (RF-01): nova conta (tenant) + primeiro usuário ADMIN.
 *
 * Fluxo:
 *  1. e-mail não pode existir (checagem antecipada para não criar conta em vão);
 *  2. cria o `Account`;
 *  3. cria o usuário via Better Auth DENTRO do contexto de cadastro — o hook
 *     `user.create.before` (lib/auth.ts) injeta `accountId` + `role: ADMIN`;
 *  4. qualquer falha remove a conta recém-criada (rollback compensatório).
 *
 * O usuário já sai logado (o Better Auth cria sessão + cookie no cadastro).
 */
export async function signUpCompany(
  input: SignUpCompanyInput,
): Promise<{ accountId: string; userId: string }> {
  const existing = await prismaBase.user.findUnique({
    where: { email: input.email },
    select: { id: true },
  });
  if (existing) {
    throw new AppError(
      "EMAIL_TAKEN",
      "Este e-mail já está cadastrado. Entre com ele ou use outro endereço.",
    );
  }

  const account = await prismaBase.account.create({ data: { name: input.companyName } });

  try {
    const result = await runWithSignupContext({ accountId: account.id, role: "ADMIN" }, () =>
      auth.api.signUpEmail({
        body: { name: input.name, email: input.email, password: input.password },
      }),
    );
    return { accountId: account.id, userId: result.user.id };
  } catch (error) {
    await prismaBase.account.delete({ where: { id: account.id } }).catch((cleanupError) => {
      console.error("[signup] Falha ao remover a conta órfã:", cleanupError);
    });

    if (isAlreadyExistsError(error)) {
      throw new AppError(
        "EMAIL_TAKEN",
        "Este e-mail já está cadastrado. Entre com ele ou use outro endereço.",
      );
    }
    console.error("[signup] Erro inesperado no cadastro de empresa:", error);
    throw new AppError(
      "SIGNUP_FAILED",
      "Não foi possível criar a conta agora. Tente novamente em instantes.",
    );
  }
}
