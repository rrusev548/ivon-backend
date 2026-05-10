type Props = {
  title: string;
  body: string;
};

export default function GuaranteeBadge({ title, body }: Props) {
  return (
    <div className="card-glass flex items-start gap-4 p-6">
      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-gold-300/40 bg-gold-300/10 text-gold-300">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 2 4 5v6c0 4.5 3.2 8.6 8 11 4.8-2.4 8-6.5 8-11V5l-8-3z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div>
        <div className="font-semibold text-cream-50">{title}</div>
        <p className="mt-1 text-sm text-cream-100/70">{body}</p>
      </div>
    </div>
  );
}
