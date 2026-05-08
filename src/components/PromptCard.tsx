'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function PromptCard({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  const t = useTranslations('tool');
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore — user can still select & copy manually
    }
  }

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-slate-900">{title}</h3>
        <button onClick={copy} className="btn-ghost text-xs">
          {copied ? t('copied') : t('copyPrompt')}
        </button>
      </div>
      <pre className="mt-3 whitespace-pre-wrap rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
        {content}
      </pre>
    </div>
  );
}
