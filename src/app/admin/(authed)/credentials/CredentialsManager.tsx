'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Item = {
  id: string;
  valueBg: string;
  valueEn: string;
  valueDe: string;
  labelBg: string;
  labelEn: string;
  labelDe: string;
  sortOrder: number;
};

type Draft = Omit<Item, 'id'>;

const empty: Draft = {
  valueBg: '',
  valueEn: '',
  valueDe: '',
  labelBg: '',
  labelEn: '',
  labelDe: '',
  sortOrder: 0,
};

export default function CredentialsManager({ items }: { items: Item[] }) {
  const router = useRouter();
  const [draft, setDraft] = useState<Draft>(empty);
  const [editing, setEditing] = useState<string | null>(null);
  const [editData, setEditData] = useState<Draft>(empty);

  const create = async () => {
    const res = await fetch('/api/admin/credentials', {
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
    await fetch(`/api/admin/credentials/${editing}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editData),
    });
    setEditing(null);
    router.refresh();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete?')) return;
    await fetch(`/api/admin/credentials/${id}`, { method: 'DELETE' });
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
              <div className="flex items-center justify-between gap-4">
                <div>
                  <span className="serif text-2xl font-medium text-gold-300">{it.valueEn}</span>
                  <span className="ml-3 text-sm text-cream-100/65">{it.labelEn}</span>
                </div>
                <div className="flex gap-2">
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
        <h2 className="serif text-lg font-medium text-cream-50">Add credential</h2>
        <Form data={draft} setData={setDraft} />
        <button
          onClick={create}
          disabled={!draft.valueEn || !draft.labelEn}
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
          placeholder="Value BG (e.g. 10+)"
          value={data.valueBg}
          onChange={(e) => set('valueBg', e.target.value)}
        />
        <input
          className="input"
          placeholder="Value EN"
          value={data.valueEn}
          onChange={(e) => set('valueEn', e.target.value)}
        />
        <input
          className="input"
          placeholder="Value DE"
          value={data.valueDe}
          onChange={(e) => set('valueDe', e.target.value)}
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <input
          className="input"
          placeholder="Label BG"
          value={data.labelBg}
          onChange={(e) => set('labelBg', e.target.value)}
        />
        <input
          className="input"
          placeholder="Label EN"
          value={data.labelEn}
          onChange={(e) => set('labelEn', e.target.value)}
        />
        <input
          className="input"
          placeholder="Label DE"
          value={data.labelDe}
          onChange={(e) => set('labelDe', e.target.value)}
        />
      </div>
    </div>
  );
}
