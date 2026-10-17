"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
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
import { firstIssueMessage, resetPasswordSchema } from "@/lib/schemas/auth";

/** Define a nova senha a partir do token do e-mail (navegador → /api/auth). */
export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const callbackError = searchParams.get("error");

  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);

  if (!token || callbackError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Link inválido ou expirado</CardTitle>
          <CardDescription>
            Este link de redefinição não é mais válido. Peça um novo e-mail de recuperação.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Link href="/esqueci-senha" className="text-sm underline underline-offset-4">
            Pedir novo link
          </Link>
        </CardFooter>
      </Card>
    );
  }

  if (done) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Senha redefinida</CardTitle>
          <CardDescription>
            Pronto! Sua senha foi alterada e as sessões antigas foram encerradas. Entre com a nova
            senha.
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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const parsed = resetPasswordSchema.safeParse({
      token,
      newPassword: formData.get("newPassword"),
      confirmPassword: formData.get("confirmPassword"),
    });
    if (!parsed.success) {
      setError(firstIssueMessage(parsed.error));
      return;
    }

    setPending(true);
    const { error: resetError } = await authClient.resetPassword({
      newPassword: parsed.data.newPassword,
      token: parsed.data.token,
    });
    setPending(false);

    if (resetError) {
      if (resetError.status === 429) {
        setError("Muitas tentativas seguidas. Aguarde alguns minutos e tente novamente.");
      } else if (resetError.status === 400) {
        // Token inválido/expirado/já usado (o Better Auth devolve 400).
        setError("Este link expirou ou já foi usado. Peça um novo e-mail de recuperação.");
      } else {
        setError("Não foi possível redefinir a senha agora. Tente novamente.");
      }
      return;
    }

    setDone(true);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Definir nova senha</CardTitle>
        <CardDescription>Escolha uma senha nova para a sua conta.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit} noValidate>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="newPassword">Nova senha</Label>
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              autoComplete="new-password"
              placeholder="Mínimo de 8 caracteres"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="confirmPassword">Repita a nova senha</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
            />
          </div>
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Salvando…" : "Salvar nova senha"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
