import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireAuth } from "@/lib/session";

export default async function HomePage() {
  const session = await requireAuth();
  const firstName = session.user.name.trim().split(/\s+/)[0] || session.user.name;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Olá, {firstName}</h1>
        <p className="text-muted-foreground">Este é o painel da sua equipe no MarcaAi.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Fundação no lugar</CardTitle>
          <CardDescription>
            Autenticação, contas, papéis e convites estão prontos. As telas de trabalho (contatos,
            funil, tarefas do dia) chegam nas próximas tarefas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="flex list-disc flex-col gap-1 pl-5 text-sm text-muted-foreground">
            <li>Página “Hoje” com quem chamar e por quê</li>
            <li>Contatos e funil de negócios</li>
            <li>Follow-up automático por etapa e alerta de negócios parados</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
