"use client";

import { useActionState, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { createInviteAction, type InviteFormState } from "./actions";

/**
 * Cria convite com e-mail + papel. O resultado mostra a mensagem e o link
 * (para copiar e mandar direto quando o envio de e-mail não está configurado).
 */
export function InviteForm() {
  const [state, formAction, pending] = useActionState<InviteFormState, FormData>(
    createInviteAction,
    null,
  );
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    if (!state?.inviteUrl) return;
    try {
      await navigator.clipboard.writeText(state.inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-sm font-medium text-muted-foreground">Convidar pessoa</h2>
      <Card size="sm">
        <CardHeader>
          <CardTitle>Novo convite</CardTitle>
          <CardDescription>
            O convite vale 7 dias e só pode ser usado uma vez. Reenviar gera um link novo.
          </CardDescription>
        </CardHeader>
        <form action={formAction} noValidate>
          <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex flex-1 flex-col gap-2">
              <Label htmlFor="invite-email">E-mail</Label>
              <Input
                id="invite-email"
                name="email"
                type="email"
                placeholder="pessoa@empresa.com"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="invite-role">Papel</Label>
              <select
                id="invite-role"
                name="role"
                defaultValue="SELLER"
                className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
              >
                <option value="SELLER">Vendedor</option>
                <option value="ADMIN">Administrador</option>
              </select>
            </div>
            <Button type="submit" disabled={pending}>
              {pending ? "Criando…" : "Criar convite"}
            </Button>
          </CardContent>
        </form>
        {(state?.error || state?.message) && (
          <CardContent className="flex flex-col gap-2">
            {state?.error && (
              <p role="alert" className="text-sm text-destructive">
                {state.error}
              </p>
            )}
            {state?.message && (
              <div className="flex flex-col gap-2">
                <p className="text-sm text-muted-foreground">{state.message}</p>
                {state.inviteUrl && (
                  <div className="flex items-center gap-2">
                    <code className="min-w-0 flex-1 truncate rounded-lg bg-muted px-3 py-2 text-xs">
                      {state.inviteUrl}
                    </code>
                    <Button type="button" variant="outline" size="sm" onClick={copyLink}>
                      {copied ? "Copiado!" : "Copiar link"}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </section>
  );
}
