"use client";

import { useActionState, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatPhoneBR, maskPhoneInput } from "@/lib/phone";
import { CONTACT_ORIGINS, CONTACT_ORIGIN_LABELS, type ContactOrigin } from "@/lib/schemas/contact";
import { formatDateBR } from "@/lib/utils";

import { deleteContactAction, updateContactAction, type ContactActionState } from "../actions";

const selectClassName =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

export type PanelContact = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  companyText: string | null;
  origin: ContactOrigin | null;
  ownerId: string | null;
  ownerName: string | null;
  createdAt: Date;
};

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm">{value}</dd>
    </div>
  );
}

/** Dados do contato em modo leitura, com edição inline e exclusão lógica. */
export function ContactPanel({
  contact,
  owners,
  canAssignOwner,
}: {
  contact: PanelContact;
  owners: Array<{ id: string; name: string }>;
  canAssignOwner: boolean;
}) {
  const [editing, setEditing] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dados do contato</CardTitle>
        <CardDescription>
          {editing ? "Altere e salve — tudo é revalidado no servidor." : "Informações da ficha."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {editing ? (
          <EditContactForm
            contact={contact}
            owners={owners}
            canAssignOwner={canAssignOwner}
            onCancel={() => setEditing(false)}
          />
        ) : (
          <ContactView contact={contact} onEdit={() => setEditing(true)} />
        )}
      </CardContent>
    </Card>
  );
}

function ContactView({ contact, onEdit }: { contact: PanelContact; onEdit: () => void }) {
  const [confirming, setConfirming] = useState(false);
  const [state, formAction, pending] = useActionState<ContactActionState, FormData>(
    deleteContactAction,
    null,
  );

  return (
    <div className="flex flex-col gap-4">
      <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <DetailRow label="Telefone" value={formatPhoneBR(contact.phone)} />
        <DetailRow label="E-mail" value={contact.email ?? "—"} />
        <DetailRow label="Empresa" value={contact.companyText ?? "—"} />
        <DetailRow
          label="Origem"
          value={contact.origin ? CONTACT_ORIGIN_LABELS[contact.origin] : "—"}
        />
        <DetailRow label="Responsável" value={contact.ownerName ?? "Sem responsável"} />
        <DetailRow label="Criado em" value={formatDateBR(contact.createdAt)} />
      </dl>

      {state?.error && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" variant="outline" size="sm" onClick={onEdit}>
          Editar
        </Button>
        {!confirming && (
          <Button type="button" variant="destructive" size="sm" onClick={() => setConfirming(true)}>
            Excluir
          </Button>
        )}
      </div>

      {confirming && (
        <form
          action={formAction}
          className="flex flex-col gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3"
        >
          <input type="hidden" name="id" value={contact.id} />
          <p className="text-sm">
            Confirmar exclusão de <strong>{contact.name}</strong>?
          </p>
          <p className="text-xs text-muted-foreground">
            Negócios abertos saem do funil e as tarefas futuras são canceladas. Negócios
            ganhos/perdidos e tarefas concluídas ficam no histórico.
          </p>
          <div className="mt-1 flex flex-wrap gap-2">
            <Button type="submit" variant="destructive" size="sm" disabled={pending}>
              {pending ? "Excluindo…" : "Confirmar exclusão"}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={pending}
              onClick={() => setConfirming(false)}
            >
              Cancelar
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

function EditContactForm({
  contact,
  owners,
  canAssignOwner,
  onCancel,
}: {
  contact: PanelContact;
  owners: Array<{ id: string; name: string }>;
  canAssignOwner: boolean;
  onCancel: () => void;
}) {
  const [state, formAction, pending] = useActionState<ContactActionState, FormData>(
    updateContactAction,
    null,
  );
  const [phone, setPhone] = useState(maskPhoneInput(formatPhoneBR(contact.phone)));

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="id" value={contact.id} />

      <div className="flex flex-col gap-2">
        <Label htmlFor="contact-name">Nome</Label>
        <Input
          id="contact-name"
          name="name"
          defaultValue={contact.name}
          required
          maxLength={80}
          autoFocus
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="contact-phone">Telefone</Label>
        <Input
          id="contact-phone"
          name="phone"
          type="tel"
          inputMode="tel"
          value={phone}
          onChange={(event) => setPhone(maskPhoneInput(event.target.value))}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="contact-email">E-mail</Label>
        <Input id="contact-email" name="email" type="email" defaultValue={contact.email ?? ""} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="contact-company">Empresa</Label>
        <Input
          id="contact-company"
          name="companyText"
          defaultValue={contact.companyText ?? ""}
          maxLength={120}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="contact-origin">Origem</Label>
        <select
          id="contact-origin"
          name="origin"
          defaultValue={contact.origin ?? "OTHER"}
          className={selectClassName}
        >
          {CONTACT_ORIGINS.map((origin) => (
            <option key={origin} value={origin}>
              {CONTACT_ORIGIN_LABELS[origin]}
            </option>
          ))}
        </select>
      </div>

      {canAssignOwner && (
        <div className="flex flex-col gap-2">
          <Label htmlFor="contact-owner">Responsável</Label>
          <select
            id="contact-owner"
            name="ownerId"
            defaultValue={contact.ownerId ?? owners[0]?.id ?? ""}
            className={selectClassName}
          >
            {owners.map((owner) => (
              <option key={owner.id} value={owner.id}>
                {owner.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {state?.error && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? "Salvando…" : "Salvar alterações"}
        </Button>
        <Button type="button" variant="outline" size="sm" disabled={pending} onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
