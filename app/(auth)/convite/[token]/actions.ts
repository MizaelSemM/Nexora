"use server";

import { redirect } from "next/navigation";

import { acceptInviteSchema, firstIssueMessage } from "@/lib/schemas/auth";
import { AppError } from "@/server/errors";
import { acceptInvite } from "@/server/invites";

/** Estado do formulário de aceite (erro em pt-BR; `null` = inicial). */
export type AcceptInviteFormState = { error: string } | null;

export async function acceptInviteAction(
  _previous: AcceptInviteFormState,
  formData: FormData,
): Promise<AcceptInviteFormState> {
  const parsed = acceptInviteSchema.safeParse({
    token: formData.get("token"),
    name: formData.get("name"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: firstIssueMessage(parsed.error) };

  try {
    await acceptInvite(parsed.data);
  } catch (error) {
    if (error instanceof AppError) return { error: error.message };
    console.error("[convite] Erro inesperado no aceite:", error);
    return { error: "Não foi possível aceitar o convite agora. Tente novamente em instantes." };
  }

  // Sucesso: já logado (o Better Auth criou a sessão no cadastro).
  redirect("/");
}
