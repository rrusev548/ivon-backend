'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Cfg = {
  enabled: boolean;
  titleBg: string;
  titleEn: string;
  titleDe: string;
  bodyBg: string;
  bodyEn: string;
  bodyDe: string;
  ctaLabelBg: string;
  ctaLabelEn: string;
  ctaLabelDe: string;
  ctaUrl: string;
  delaySec: number;
};

export default function PopupForm({ initial }: { initial: Cfg }) {
  const router = useRouter();
  const [data, setData] = useState<Cfg>(initial);
  const [saving, setSaving] = useState(false);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await fetch('/api/admin/popup', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    setSaving(false);
    router.refresh();
  };

  const set = <K extends keyof Cfg>(k: K, v: Cfg[K]) => setData({ ...data, [k]: v });

  return (
    <form onSubmit={onSave} className="space-y-5">
      <label className="inline-flex items-center gap-2 text-sm text-cream-100/80">
        <input type="checkbox" checked={data.enabled} onChange={(e) => set('enabled', e.target.checked)} />
        Enabled
      </label>

      {(['Bg', 'En', 'De'] as const).map((s) => (
        <div key={s} className="card-glass space-y-3 p-5">
          <div className="text-xs uppercase tracking-wider text-gold-300">
            {s === 'Bg' ? 'Български' : s === 'En' ? 'English' : 'Deutsch'}
          </div>
          <input
            className="input"
            placeholder="Title"
            value={data[`title${s}`]}
            onChange={(e) => set(`title${s}` as keyof Cfg, e.target.value as Cfg[keyof Cfg])}
          />
          <textarea
            className="input min-h-[60px]"
            placeholder="Body"
            value={data[`body${s}`]}
            onChange={(e) => set(`body${s}` as keyof Cfg, e.target.value as Cfg[keyof Cfg])}
          />
          <input
            className="input"
            placeholder="CTA label"
            value={data[`ctaLabel${s}`]}
            onChange={(e) => set(`ctaLabel${s}` as keyof Cfg, e.target.value as Cfg[keyof Cfg])}
          />
        </div>
      ))}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">CTA URL (relative or absolute)</label>
          <input
            className="input"
            value={data.ctaUrl}
            onChange={(e) => set('ctaUrl', e.target.value)}
          />
        </div>
        <div>
          <label className="label">Delay (seconds)</label>
          <input
            className="input"
            type="number"
            value={data.delaySec}
            onChange={(e) => set('delaySec', Number(e.target.value))}
          />
        </div>
      </div>

      <button type="submit" disabled={saving} className="btn-primary">
        {saving ? '…' : 'Save'}
      </button>
    </form>
  );
}
