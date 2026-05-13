'use client';

import { useEffect, useState } from 'react';

type Course = { id: string; titleEn: string; slug: string };
type CodeRow = {
  id: string;
  code: string;
  courseSlug: string;
  courseTitle: string;
  usedAt: string | null;
  usedByEmail: string | null;
  createdAt: string;
};

export default function CodesClient({ courses }: { courses: Course[] }) {
  const [courseId, setCourseId] = useState(courses[0]?.id ?? '');
  const [count, setCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [lastBatch, setLastBatch] = useState<string[]>([]);
  const [codes, setCodes] = useState<CodeRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    const res = await fetch('/api/admin/codes');
    if (res.ok) {
      const data = (await res.json()) as { codes: CodeRow[] };
      setCodes(data.codes);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function onGenerate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setLastBatch([]);
    try {
      const res = await fetch('/api/admin/codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId, count }),
      });
      if (!res.ok) throw new Error('Failed');
      const data = (await res.json()) as { codes: string[] };
      setLastBatch(data.codes);
      await refresh();
    } catch {
      setError('Failed to generate codes.');
    } finally {
      setLoading(false);
    }
  }

  async function onDelete(id: string) {
    if (!confirm('Delete this code?')) return;
    const res = await fetch(`/api/admin/codes/${id}`, { method: 'DELETE' });
    if (res.ok) await refresh();
  }

  function copyAll() {
    if (lastBatch.length === 0) return;
    void navigator.clipboard.writeText(lastBatch.join('\n'));
  }

  return (
    <div className="space-y-8">
      <form onSubmit={onGenerate} className="card-glass space-y-4 p-6">
        <h2 className="serif text-xl font-medium text-cream-50">Generate</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_120px_auto]">
          <div>
            <label className="label" htmlFor="courseId">Course</label>
            <select
              id="courseId"
              className="input"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              required
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.titleEn} ({c.slug})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="count">Count</label>
            <input
              id="count"
              className="input"
              type="number"
              min={1}
              max={100}
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value || '1', 10))}
            />
          </div>
          <div className="flex items-end">
            <button type="submit" disabled={loading} className="btn-primary w-full sm:w-auto">
              {loading ? 'Generating…' : 'Generate'}
            </button>
          </div>
        </div>
        {error && <p className="text-sm text-red-300">{error}</p>}
        {lastBatch.length > 0 && (
          <div className="mt-2 rounded-lg border border-emerald-300/30 bg-emerald-400/5 p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-emerald-200">Just generated {lastBatch.length}:</span>
              <button
                type="button"
                onClick={copyAll}
                className="text-xs text-emerald-300 hover:underline"
              >
                Copy all
              </button>
            </div>
            <pre className="overflow-auto whitespace-pre-wrap break-all font-mono text-sm text-cream-100/90">
              {lastBatch.join('\n')}
            </pre>
          </div>
        )}
      </form>

      <div className="card-glass overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-ink-800/60 text-cream-100/65">
            <tr>
              <th className="px-4 py-3 text-left">Code</th>
              <th className="px-4 py-3 text-left">Course</th>
              <th className="px-4 py-3 text-left">Used by</th>
              <th className="px-4 py-3 text-left">Used at</th>
              <th className="px-4 py-3 text-left">Created</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {codes.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-cream-100/55">
                  No codes yet.
                </td>
              </tr>
            ) : (
              codes.map((c) => (
                <tr key={c.id} className="border-t border-cream-100/10">
                  <td className="px-4 py-3 font-mono text-xs text-cream-50">{c.code}</td>
                  <td className="px-4 py-3 text-cream-100/80">{c.courseSlug}</td>
                  <td className="px-4 py-3 text-cream-100/70">{c.usedByEmail ?? '—'}</td>
                  <td className="px-4 py-3 text-cream-100/70">
                    {c.usedAt ? new Date(c.usedAt).toLocaleString() : '—'}
                  </td>
                  <td className="px-4 py-3 text-cream-100/70">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {c.usedAt ? (
                      <span className="rounded-full bg-cream-100/10 px-2 py-0.5 text-xs text-cream-100/60">
                        Used
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onDelete(c.id)}
                        className="text-xs text-red-300 hover:underline"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
