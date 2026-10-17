"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { acceptInviteAction, type AcceptInviteFormState } from "./actions";

/**
 * Formulário de aceite: define nome + senha e chama o Server Action (que faz o
 * claim atômico do convite e cria o usuário vinculado à conta).
 */
export function AcceptInviteForm({
  token,
  email,
  accountName,
  roleLabel,
}: {
  token: string;
  email: string;
  accountName: string;
  roleLabel: string;
}) {
  const [state, formAction, pending] = useActionState<AcceptInviteFormState, FormData>(
    acceptInviteAction,
    null,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Entrar em {accountName}</CardTitle>
        <CardDescription>
          Você foi convidado(a) como {roleLabel}. Crie sua senha para aceitar o convite.
        </CardDescription>
      </CardHeader>
      <form action={formAction} noValidate>
        <CardContent className="flex flex-col gap-4">
          <input type="hidden" name="token" value={token} />
          <div className="flex flex-col gap-2">
            <Label htmlFor="invite-email">Convite para</Label>
            <Input
              id="invite-email"
              value={email}
              readOnly
              tabIndex={-1}
              className="text-muted-foreground"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Seu nome</Label>
            <Input
              id="name"
              name="name"
              autoComplete="name"
              placeholder="Nome e sobrenome"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="Mínimo de 8 caracteres"
              required
            />
          </div>
          {state?.error && (
            <p role="alert" className="text-sm text-destructive">
              {state.error}
            </p>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Entrando…" : "Aceitar convite"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
