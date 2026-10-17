import Link from "next/link";

import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { findInviteForPublicPage } from "@/server/invites";

import { AcceptInviteForm } from "./accept-invite-form";

const STATUS_MESSAGE = {
  expired: "Este convite expirou (validade de 7 dias). Peça um novo ao administrador da equipe.",
  used: "Este convite já foi utilizado. Se a conta é sua, entre normalmente.",
  revoked: "Este convite foi cancelado. Peça um novo ao administrador da equipe.",
} as const;

/** Card do convite: resolve o token e mostra o formulário ou a explicação. */
export async function InviteCard({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const invite = await findInviteForPublicPage(token);

  if (!invite) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Convite não encontrado</CardTitle>
          <CardDescription>
            Confira o link com quem te convidou ou peça um convite novo.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Link href="/login" className="text-sm underline underline-offset-4">
            Ir para o login
          </Link>
        </CardFooter>
      </Card>
    );
  }

  if (invite.status !== "valid") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Convite indisponível</CardTitle>
          <CardDescription>{STATUS_MESSAGE[invite.status]}</CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-col gap-3">
          <Link href="/login" className="text-sm underline underline-offset-4">
            Ir para o login
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <AcceptInviteForm
      token={token}
      email={invite.email}
      accountName={invite.accountName}
      roleLabel={invite.role === "ADMIN" ? "Administrador(a)" : "Vendedor(a)"}
    />
  );
}
