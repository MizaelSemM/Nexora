"use server";

import { revalidatePath } from "next/cache";

import { createInviteSchema, firstIssueMessage } from "@/lib/schemas/auth";
import { withAdmin } from "@/lib/session";
import { AppError } from "@/server/errors";
import { createInvite, revokeInvite } from "@/server/invites";
import { deactivateUser, reactivateUser } from "@/server/team";

/** Estado do formulário de convite. */
export type InviteFormState = { error?: string; message?: string; inviteUrl?: string } | null;

/** Estado das ações de linha (desativar/reativar/cancelar convite). */
export type UserActionState = { error?: string } | null;

const GENERIC_ERROR = "Não foi possível concluir agora. Tente novamente em instantes.";

export async function createInviteAction(
  _previous: InviteFormState,
  formData: FormData,
): Promise<InviteFormState> {
  return withAdmin(async (session) => {
    const parsed = createInviteSchema.safeParse({
      email: formData.get("email"),
      role: formData.get("role"),
    });
    if (!parsed.success) return { error: firstIssueMessage(parsed.error) };

    try {
      const result = await createInvite({ createdById: session.user.id, ...parsed.data });
      revalidatePath("/equipe");
      return {
        message: result.emailDelivered
          ? `Convite enviado para ${parsed.data.email}.`
          : `Convite criado para ${parsed.data.email}. O envio de e-mail ainda não está configurado no servidor — copie o link e mande direto para a pessoa.`,
        inviteUrl: result.invite.url,
      };
    } catch (error) {
      if (error instanceof AppError) return { error: error.message };
      console.error("[equipe] Erro ao criar convite:", error);
      return { error: GENERIC_ERROR };
    }
  });
}

export async function revokeInviteAction(
  _previous: UserActionState,
  formData: FormData,
): Promise<UserActionState> {
  return withAdmin(async () => {
    const inviteId = String(formData.get("inviteId") ?? "");
    if (!inviteId) return { error: "Convite inválido." };

    try {
      await revokeInvite({ inviteId });
      revalidatePath("/equipe");
      return {};
    } catch (error) {
      if (error instanceof AppError) return { error: error.message };
      console.error("[equipe] Erro ao cancelar convite:", error);
      return { error: GENERIC_ERROR };
    }
  });
}

export async function deactivateUserAction(
  _previous: UserActionState,
  formData: FormData,
): Promise<UserActionState> {
  return withAdmin(async (session) => {
    const userId = String(formData.get("userId") ?? "");
    if (!userId) return { error: "Usuário inválido." };

    try {
      await deactivateUser({ actingUserId: session.user.id, targetUserId: userId });
      revalidatePath("/equipe");
      return {};
    } catch (error) {
      if (error instanceof AppError) return { error: error.message };
      console.error("[equipe] Erro ao desativar usuário:", error);
      return { error: GENERIC_ERROR };
    }
  });
}

export async function reactivateUserAction(
  _previous: UserActionState,
  formData: FormData,
): Promise<UserActionState> {
  return withAdmin(async () => {
    const userId = String(formData.get("userId") ?? "");
    if (!userId) return { error: "Usuário inválido." };

    try {
      await reactivateUser({ targetUserId: userId });
      revalidatePath("/equipe");
      return {};
    } catch (error) {
      if (error instanceof AppError) return { error: error.message };
      console.error("[equipe] Erro ao reativar usuário:", error);
      return { error: GENERIC_ERROR };
    }
  });
}
