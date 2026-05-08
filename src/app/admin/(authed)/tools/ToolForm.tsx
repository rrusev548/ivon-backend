'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export type ToolFormValues = {
  id?: string;
  slug: string;
  nameEn: string;
  nameBg: string;
  taglineEn: string;
  taglineBg: string;
  descriptionEn: string;
  descriptionBg: string;
  iconUrl: string;
  affiliateUrl: string;
  category: string;
  featured: boolean;
  sortOrder: number;
};

const empty: ToolFormValues = {
  slug: '',
  nameEn: '',
  nameBg: '',
  taglineEn: '',
  taglineBg: '',
  descriptionEn: '',
  descriptionBg: '',
  iconUrl: '',
  affiliateUrl: '',
  category: 'image',
  featured: false,
  sortOrder: 0,
};

export default function ToolForm({ initial }: { initial?: ToolFormValues }) {
  const router = useRouter();
  const [values, setValues] = useState<ToolFormValues>(initial ?? empty);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const isEdit = Boolean(initial?.id);

  function update<K extends keyof ToolFormValues>(key: K, val: ToolFormValues[K]) {
    setValues((v) => ({ ...v, [key]: val }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    const url = isEdit ? `/api/admin/tools/${initial!.id}` : '/api/admin/tools';
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
    router.push('/admin/tools');
    router.refresh();
  }

  async function onDelete() {
    if (!isEdit) return;
    if (!confirm('Delete this tool? Its prompts will also be deleted.')) return;
    const res = await fetch(`/api/admin/tools/${initial!.id}`, { method: 'DELETE' });
    if (!res.ok) {
      setError('Delete failed.');
      return;
    }
    router.push('/admin/tools');
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="card max-w-3xl space-y-5 p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Slug (URL)">
          <input className="input" required value={values.slug} onChange={(e) => update('slug', e.target.value)} placeholder="higgsfield" />
        </Field>
        <Field label="Category">
          <input className="input" value={values.category} onChange={(e) => update('category', e.target.value)} placeholder="image / video / text" />
        </Field>
        <Field label="Name (EN)">
          <input className="input" required value={values.nameEn} onChange={(e) => update('nameEn', e.target.value)} />
        </Field>
        <Field label="Name (BG)">
          <input className="input" required value={values.nameBg} onChange={(e) => update('nameBg', e.target.value)} />
        </Field>
        <Field label="Tagline (EN)">
          <input className="input" required value={values.taglineEn} onChange={(e) => update('taglineEn', e.target.value)} />
        </Field>
        <Field label="Tagline (BG)">
          <input className="input" required value={values.taglineBg} onChange={(e) => update('taglineBg', e.target.value)} />
        </Field>
      </div>
      <Field label="Description (EN)">
        <textarea className="input min-h-[120px]" required value={values.descriptionEn} onChange={(e) => update('descriptionEn', e.target.value)} />
      </Field>
      <Field label="Description (BG)">
        <textarea className="input min-h-[120px]" required value={values.descriptionBg} onChange={(e) => update('descriptionBg', e.target.value)} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Icon URL">
          <input className="input" value={values.iconUrl} onChange={(e) => update('iconUrl', e.target.value)} placeholder="https://..." />
        </Field>
        <Field label="Affiliate URL">
          <input className="input" required value={values.affiliateUrl} onChange={(e) => update('affiliateUrl', e.target.value)} placeholder="https://..." />
        </Field>
        <Field label="Sort order">
          <input className="input" type="number" value={values.sortOrder} onChange={(e) => update('sortOrder', Number(e.target.value))} />
        </Field>
        <label className="flex items-center gap-2 pt-7">
          <input type="checkbox" checked={values.featured} onChange={(e) => update('featured', e.target.checked)} />
          <span className="text-sm">Featured on homepage</span>
        </label>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center justify-between border-t border-slate-200 pt-4">
        <div className="flex gap-2">
          <button className="btn-primary" disabled={saving}>{saving ? '…' : 'Save'}</button>
          <Link href="/admin/tools" className="btn-ghost">Cancel</Link>
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
