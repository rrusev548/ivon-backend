'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type R = {
  id: string;
  titleBg: string;
  titleEn: string;
  titleDe: string;
  fileUrl: string;
  sortOrder: number;
};

export default function ResourcesPanel({
  courseId,
  resources,
}: {
  courseId: string;
  resources: R[];
}) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState<{
    titleBg: string;
    titleEn: string;
    titleDe: string;
    fileUrl: string;
  }>({ titleBg: '', titleEn: '', titleDe: '', fileUrl: '' });

  const addResource = async () => {
    setAdding(true);
    const res = await fetch(`/api/admin/courses/${courseId}/resources`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...draft, sortOrder: resources.length }),
    });
    setAdding(false);
    if (!res.ok) return;
    setDraft({ titleBg: '', titleEn: '', titleDe: '', fileUrl: '' });
    router.refresh();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this resource?')) return;
    await fetch(`/api/admin/resources/${id}`, { method: 'DELETE' });
    router.refresh();
  };

  return (
    <section>
      <h2 className="serif text-xl font-medium text-cream-50">Resources (PDF / video)</h2>
      <div className="card-glass mt-4">
        {resources.length === 0 ? (
          <p className="p-5 text-sm text-cream-100/55">No resources yet.</p>
        ) : (
          <ul className="divide-y divide-cream-100/10">
            {resources.map((r) => (
              <li key={r.id} className="flex items-center justify-between p-4 text-sm">
                <div>
                  <div className="font-medium text-cream-50">{r.titleEn}</div>
                  <a
                    href={r.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="break-all text-xs text-cream-100/55 hover:text-gold-300"
                  >
                    {r.fileUrl}
                  </a>
                </div>
                <button
                  type="button"
                  onClick={() => remove(r.id)}
                  className="text-xs text-red-300 hover:underline"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="card-glass mt-4 space-y-3 p-5">
        <div className="text-xs uppercase tracking-wider text-gold-300">Add resource</div>
        <div className="grid gap-3 sm:grid-cols-3">
          <input
            className="input"
            placeholder="Title BG"
            value={draft.titleBg}
            onChange={(e) => setDraft({ ...draft, titleBg: e.target.value })}
          />
          <input
            className="input"
            placeholder="Title EN"
            value={draft.titleEn}
            onChange={(e) => setDraft({ ...draft, titleEn: e.target.value })}
          />
          <input
            className="input"
            placeholder="Title DE"
            value={draft.titleDe}
            onChange={(e) => setDraft({ ...draft, titleDe: e.target.value })}
          />
        </div>
        <input
          className="input"
          placeholder="File URL (https://...)"
          value={draft.fileUrl}
          onChange={(e) => setDraft({ ...draft, fileUrl: e.target.value })}
        />
        <button
          type="button"
          onClick={addResource}
          disabled={adding || !draft.titleBg || !draft.titleEn || !draft.titleDe || !draft.fileUrl}
          className="btn-primary text-sm"
        >
          {adding ? '…' : 'Add resource'}
        </button>
      </div>
    </section>
  );
}
