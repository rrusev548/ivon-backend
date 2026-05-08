'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Item = {
  id: string;
  authorBg: string;
  authorEn: string;
  authorDe: string;
  roleBg: string | null;
  roleEn: string | null;
  roleDe: string | null;
  quoteBg: string;
  quoteEn: string;
  quoteDe: string;
  rating: number;
  sortOrder: number;
  published: boolean;
};

type Draft = Omit<Item, 'id'>;

const empty: Draft = {
  authorBg: '',
  authorEn: '',
  authorDe: '',
  roleBg: '',
  roleEn: '',
  roleDe: '',
  quoteBg: '',
  quoteEn: '',
  quoteDe: '',
  rating: 5,
  sortOrder: 0,
  published: true,
};

export default function TestimonialsManager({ items }: { items: Item[] }) {
  const router = useRouter();
  const [draft, setDraft] = useState<Draft>(empty);
  const [editing, setEditing] = useState<string | null>(null);
  const [editData, setEditData] = useState<Draft>(empty);

  const create = async () => {
    const res = await fetch('/api/admin/testimonials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...draft, sortOrder: items.length }),
    });
    if (res.ok) {
      setDraft(empty);
      router.refresh();
    }
  };

  const beginEdit = (it: Item) => {
    setEditing(it.id);
    setEditData({ ...it });
  };

  const saveEdit = async () => {
    if (!editing) return;
    const res = await fetch(`/api/admin/testimonials/${editing}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editData),
    });
    if (res.ok) {
      setEditing(null);
      router.refresh();
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete?')) return;
    await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' });
    router.refresh();
  };

  return (
    <>
      <div className="space-y-3">
        {items.map((it) => (
          <div key={it.id} className="card-glass p-5">
            {editing === it.id ? (
              <Form data={editData} setData={setEditData} />
            ) : (
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="serif text-lg font-medium text-cream-50">
                    {it.authorEn}
                    {it.roleEn && (
                      <span className="ml-2 text-sm text-cream-100/55">— {it.roleEn}</span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-cream-100/70">“{it.quoteEn}”</p>
                  {!it.published && (
                    <span className="mt-2 inline-block rounded-full bg-cream-100/10 px-2 py-0.5 text-xs text-cream-100/55">
                      Hidden
                    </span>
                  )}
                </div>
                <div className="flex shrink-0 gap-2">
                  <button onClick={() => beginEdit(it)} className="btn-ghost text-xs">
                    Edit
                  </button>
                  <button
                    onClick={() => remove(it.id)}
                    className="text-xs text-red-300 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
            {editing === it.id && (
              <div className="mt-4 flex gap-2">
                <button onClick={saveEdit} className="btn-primary text-sm">
                  Save
                </button>
                <button onClick={() => setEditing(null)} className="btn-ghost text-sm">
                  Cancel
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="card-glass mt-8 space-y-4 p-5">
        <h2 className="serif text-lg font-medium text-cream-50">Add testimonial</h2>
        <Form data={draft} setData={setDraft} />
        <button
          onClick={create}
          disabled={!draft.authorEn || !draft.quoteEn}
          className="btn-primary text-sm"
        >
          Add
        </button>
      </div>
    </>
  );
}

function Form({ data, setData }: { data: Draft; setData: (d: Draft) => void }) {
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setData({ ...data, [k]: v });
  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-3">
        <input
          className="input"
          placeholder="Author BG"
          value={data.authorBg}
          onChange={(e) => set('authorBg', e.target.value)}
        />
        <input
          className="input"
          placeholder="Author EN"
          value={data.authorEn}
          onChange={(e) => set('authorEn', e.target.value)}
        />
        <input
          className="input"
          placeholder="Author DE"
          value={data.authorDe}
          onChange={(e) => set('authorDe', e.target.value)}
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <input
          className="input"
          placeholder="Role BG (opt)"
          value={data.roleBg ?? ''}
          onChange={(e) => set('roleBg', e.target.value)}
        />
        <input
          className="input"
          placeholder="Role EN (opt)"
          value={data.roleEn ?? ''}
          onChange={(e) => set('roleEn', e.target.value)}
        />
        <input
          className="input"
          placeholder="Role DE (opt)"
          value={data.roleDe ?? ''}
          onChange={(e) => set('roleDe', e.target.value)}
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <textarea
          className="input min-h-[80px]"
          placeholder="Quote BG"
          value={data.quoteBg}
          onChange={(e) => set('quoteBg', e.target.value)}
        />
        <textarea
          className="input min-h-[80px]"
          placeholder="Quote EN"
          value={data.quoteEn}
          onChange={(e) => set('quoteEn', e.target.value)}
        />
        <textarea
          className="input min-h-[80px]"
          placeholder="Quote DE"
          value={data.quoteDe}
          onChange={(e) => set('quoteDe', e.target.value)}
        />
      </div>
      <label className="inline-flex items-center gap-2 text-sm text-cream-100/80">
        <input
          type="checkbox"
          checked={data.published}
          onChange={(e) => set('published', e.target.checked)}
        />
        Published
      </label>
    </div>
  );
}
