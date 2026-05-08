'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Item = {
  id: string;
  nameBg: string;
  nameEn: string;
  nameDe: string;
  descBg: string;
  descEn: string;
  descDe: string;
  url: string;
  sortOrder: number;
};

type Draft = Omit<Item, 'id'>;

const empty: Draft = {
  nameBg: '',
  nameEn: '',
  nameDe: '',
  descBg: '',
  descEn: '',
  descDe: '',
  url: '',
  sortOrder: 0,
};

export default function AffiliatesManager({ items }: { items: Item[] }) {
  const router = useRouter();
  const [draft, setDraft] = useState<Draft>(empty);
  const [editing, setEditing] = useState<string | null>(null);
  const [editData, setEditData] = useState<Draft>(empty);

  const create = async () => {
    const res = await fetch('/api/admin/affiliates', {
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
    setEditData({
      nameBg: it.nameBg,
      nameEn: it.nameEn,
      nameDe: it.nameDe,
      descBg: it.descBg,
      descEn: it.descEn,
      descDe: it.descDe,
      url: it.url,
      sortOrder: it.sortOrder,
    });
  };

  const saveEdit = async () => {
    if (!editing) return;
    const res = await fetch(`/api/admin/affiliates/${editing}`, {
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
    await fetch(`/api/admin/affiliates/${id}`, { method: 'DELETE' });
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
                  <div className="serif text-lg font-medium text-cream-50">{it.nameEn}</div>
                  <p className="mt-1 text-sm text-cream-100/65">{it.descEn}</p>
                  <a
                    href={it.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 block break-all text-xs text-gold-300/80 hover:underline"
                  >
                    {it.url}
                  </a>
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
        <h2 className="serif text-lg font-medium text-cream-50">Add affiliate</h2>
        <Form data={draft} setData={setDraft} />
        <button
          onClick={create}
          disabled={!draft.nameEn || !draft.url}
          className="btn-primary text-sm"
        >
          Add
        </button>
      </div>
    </>
  );
}

function Form({
  data,
  setData,
}: {
  data: Draft;
  setData: (d: Draft) => void;
}) {
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setData({ ...data, [k]: v });
  return (
    <div className="space-y-3">
      <input
        className="input"
        placeholder="URL (https://...)"
        value={data.url}
        onChange={(e) => set('url', e.target.value)}
      />
      <div className="grid gap-3 sm:grid-cols-3">
        <input
          className="input"
          placeholder="Name BG"
          value={data.nameBg}
          onChange={(e) => set('nameBg', e.target.value)}
        />
        <input
          className="input"
          placeholder="Name EN"
          value={data.nameEn}
          onChange={(e) => set('nameEn', e.target.value)}
        />
        <input
          className="input"
          placeholder="Name DE"
          value={data.nameDe}
          onChange={(e) => set('nameDe', e.target.value)}
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <textarea
          className="input min-h-[60px]"
          placeholder="Desc BG"
          value={data.descBg}
          onChange={(e) => set('descBg', e.target.value)}
        />
        <textarea
          className="input min-h-[60px]"
          placeholder="Desc EN"
          value={data.descEn}
          onChange={(e) => set('descEn', e.target.value)}
        />
        <textarea
          className="input min-h-[60px]"
          placeholder="Desc DE"
          value={data.descDe}
          onChange={(e) => set('descDe', e.target.value)}
        />
      </div>
    </div>
  );
}
