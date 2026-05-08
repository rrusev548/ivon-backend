'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Course = {
  id?: string;
  slug: string;
  level: number;
  titleBg: string;
  titleEn: string;
  titleDe: string;
  shortDescBg: string;
  shortDescEn: string;
  shortDescDe: string;
  longDescBg: string;
  longDescEn: string;
  longDescDe: string;
  coverUrl: string | null;
  priceCents: number;
  currency: string;
  published: boolean;
  autoInvoice: boolean;
  sortOrder: number;
};

export default function CourseForm({ initial }: { initial?: Course }) {
  const router = useRouter();
  const [data, setData] = useState<Course>(
    initial ?? {
      slug: '',
      level: 1,
      titleBg: '',
      titleEn: '',
      titleDe: '',
      shortDescBg: '',
      shortDescEn: '',
      shortDescDe: '',
      longDescBg: '',
      longDescEn: '',
      longDescDe: '',
      coverUrl: null,
      priceCents: 19900,
      currency: 'EUR',
      published: true,
      autoInvoice: false,
      sortOrder: 0,
    },
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const url = initial ? `/api/admin/courses/${initial.id}` : '/api/admin/courses';
    const method = initial ? 'PATCH' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(JSON.stringify(j));
      setSaving(false);
      return;
    }
    router.push('/admin/courses');
    router.refresh();
  };

  const onDelete = async () => {
    if (!initial?.id) return;
    if (!confirm('Delete this course? This is irreversible.')) return;
    await fetch(`/api/admin/courses/${initial.id}`, { method: 'DELETE' });
    router.push('/admin/courses');
    router.refresh();
  };

  const set = <K extends keyof Course>(k: K, v: Course[K]) => setData({ ...data, [k]: v });

  return (
    <form onSubmit={onSave} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="label">Slug</label>
          <input
            className="input"
            value={data.slug}
            onChange={(e) => set('slug', e.target.value)}
            required
          />
        </div>
        <div>
          <label className="label">Level</label>
          <input
            className="input"
            type="number"
            min={1}
            value={data.level}
            onChange={(e) => set('level', Number(e.target.value))}
            required
          />
        </div>
        <div>
          <label className="label">Sort order</label>
          <input
            className="input"
            type="number"
            value={data.sortOrder}
            onChange={(e) => set('sortOrder', Number(e.target.value))}
          />
        </div>
      </div>

      {(['Bg', 'En', 'De'] as const).map((suf) => (
        <div key={suf} className="card-glass space-y-3 p-5">
          <div className="text-xs uppercase tracking-wider text-gold-300">
            {suf === 'Bg' ? 'Български' : suf === 'En' ? 'English' : 'Deutsch'}
          </div>
          <div>
            <label className="label">Title</label>
            <input
              className="input"
              value={data[`title${suf}`]}
              onChange={(e) => set(`title${suf}` as keyof Course, e.target.value as Course[keyof Course])}
              required
            />
          </div>
          <div>
            <label className="label">Short description</label>
            <textarea
              className="input min-h-[60px]"
              value={data[`shortDesc${suf}`]}
              onChange={(e) => set(`shortDesc${suf}` as keyof Course, e.target.value as Course[keyof Course])}
              required
            />
          </div>
          <div>
            <label className="label">Long description (markdown)</label>
            <textarea
              className="input min-h-[140px] font-mono text-xs"
              value={data[`longDesc${suf}`]}
              onChange={(e) => set(`longDesc${suf}` as keyof Course, e.target.value as Course[keyof Course])}
            />
          </div>
        </div>
      ))}

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="label">Price (cents)</label>
          <input
            className="input"
            type="number"
            value={data.priceCents}
            onChange={(e) => set('priceCents', Number(e.target.value))}
          />
        </div>
        <div>
          <label className="label">Currency</label>
          <input
            className="input"
            value={data.currency}
            onChange={(e) => set('currency', e.target.value)}
          />
        </div>
        <div>
          <label className="label">Cover URL</label>
          <input
            className="input"
            value={data.coverUrl ?? ''}
            onChange={(e) => set('coverUrl', e.target.value || null)}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="inline-flex items-center gap-2 text-sm text-cream-100/80">
          <input
            type="checkbox"
            checked={data.published}
            onChange={(e) => set('published', e.target.checked)}
          />
          Published
        </label>
        <label className="inline-flex items-center gap-2 text-sm text-cream-100/80">
          <input
            type="checkbox"
            checked={data.autoInvoice}
            onChange={(e) => set('autoInvoice', e.target.checked)}
          />
          Auto-invoice on purchase
        </label>
      </div>

      {error && <p className="text-sm text-red-300">{error}</p>}

      <div className="flex items-center justify-between gap-4 pt-4">
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? '…' : 'Save'}
        </button>
        {initial && (
          <button
            type="button"
            onClick={onDelete}
            className="text-sm text-red-300 hover:underline"
          >
            Delete course
          </button>
        )}
      </div>
    </form>
  );
}
