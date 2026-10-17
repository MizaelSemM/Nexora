"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

/** Encerra a sessão (navegador → /api/auth/sign-out) e volta para o login. */
export function SignOutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={pending}
      onClick={async () => {
        setPending(true);
        await authClient.signOut();
        router.push("/login");
        router.refresh();
      }}
    >
      {pending ? "Saindo…" : "Sair"}
    </Button>
  );
}
