'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export type PromptFormValues = {
  id?: string;
  toolId: string;
  titleEn: string;
  titleBg: string;
  contentEn: string;
  contentBg: string;
  sortOrder: number;
};

const empty = (toolId: string): PromptFormValues => ({
  toolId,
  titleEn: '',
  titleBg: '',
  contentEn: '',
  contentBg: '',
  sortOrder: 0,
});

type ToolOption = { id: string; nameEn: string };

export default function PromptForm({
  tools,
  initial,
}: {
  tools: ToolOption[];
  initial?: PromptFormValues;
}) {
  const router = useRouter();
  const [values, setValues] = useState<PromptFormValues>(
    initial ?? empty(tools[0]?.id ?? ''),
  );
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const isEdit = Boolean(initial?.id);

  function update<K extends keyof PromptFormValues>(key: K, val: PromptFormValues[K]) {
    setValues((v) => ({ ...v, [key]: val }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    const url = isEdit ? `/api/admin/prompts/${initial!.id}` : '/api/admin/prompts';
    const res = await fetch(url, {
      method: isEdit ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });
    setSaving(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? 'Save failed.');
      return;
    }
    router.push('/admin/prompts');
    router.refresh();
  }

  async function onDelete() {
    if (!isEdit) return;
    if (!confirm('Delete this prompt?')) return;
    const res = await fetch(`/api/admin/prompts/${initial!.id}`, { method: 'DELETE' });
    if (!res.ok) {
      setError('Delete failed.');
      return;
    }
    router.push('/admin/prompts');
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="card max-w-3xl space-y-5 p-6">
      <Field label="Tool">
        <select
          className="input"
          value={values.toolId}
          onChange={(e) => update('toolId', e.target.value)}
          required
        >
          {tools.map((t) => (
            <option key={t.id} value={t.id}>{t.nameEn}</option>
          ))}
        </select>
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Title (EN)">
          <input className="input" required value={values.titleEn} onChange={(e) => update('titleEn', e.target.value)} />
        </Field>
        <Field label="Title (BG)">
          <input className="input" required value={values.titleBg} onChange={(e) => update('titleBg', e.target.value)} />
        </Field>
      </div>
      <Field label="Prompt (EN)">
        <textarea className="input min-h-[140px] font-mono text-sm" required value={values.contentEn} onChange={(e) => update('contentEn', e.target.value)} />
      </Field>
      <Field label="Prompt (BG)">
        <textarea className="input min-h-[140px] font-mono text-sm" required value={values.contentBg} onChange={(e) => update('contentBg', e.target.value)} />
      </Field>
      <Field label="Sort order">
        <input className="input max-w-[160px]" type="number" value={values.sortOrder} onChange={(e) => update('sortOrder', Number(e.target.value))} />
      </Field>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center justify-between border-t border-slate-200 pt-4">
        <div className="flex gap-2">
          <button className="btn-primary" disabled={saving}>{saving ? '…' : 'Save'}</button>
          <Link href="/admin/prompts" className="btn-ghost">Cancel</Link>
        </div>
        {isEdit && (
          <button type="button" onClick={onDelete} className="text-sm text-red-600 hover:underline">
            Delete
          </button>
        )}
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
    </div>
  );
}
