"use client";

import Link from "next/link";
import { useState } from "react";

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
import { authClient } from "@/lib/auth-client";
import { firstIssueMessage, requestPasswordResetSchema } from "@/lib/schemas/auth";

/**
 * Recuperação de senha — chama `authClient.requestPasswordReset` (navegador →
 * /api/auth, com rate limit). A resposta é sempre a mesma mensagem neutra,
 * exista ou não o e-mail (não revelamos cadastros).
 */
export function RequestResetForm() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const parsed = requestPasswordResetSchema.safeParse({ email: formData.get("email") });
    if (!parsed.success) {
      setError(firstIssueMessage(parsed.error));
      return;
    }

    setPending(true);
    const { error: requestError } = await authClient.requestPasswordReset({
      email: parsed.data.email,
      redirectTo: "/redefinir-senha",
    });
    setPending(false);

    if (requestError) {
      if (requestError.status === 429) {
        setError("Muitos pedidos seguidos. Aguarde alguns minutos e tente novamente.");
      } else {
        setError("Não foi possível enviar o e-mail agora. Tente novamente em instantes.");
      }
      return;
    }

    setSent(true);
  }

  if (sent) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Confira seu e-mail</CardTitle>
          <CardDescription>
            Se este e-mail estiver cadastrado, enviamos um link para redefinir a senha. O link é de
            uso único e expira em 1 hora.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Link href="/login" className="text-sm underline underline-offset-4">
            Voltar para o login
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recuperar senha</CardTitle>
        <CardDescription>
          Informe o e-mail da sua conta para receber o link de redefinição.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit} noValidate>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="voce@empresa.com"
              required
            />
          </div>
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Enviando…" : "Enviar link de recuperação"}
          </Button>
          <p className="text-sm text-muted-foreground">
            Lembrou a senha?{" "}
            <Link href="/login" className="underline underline-offset-4">
              Entrar
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
