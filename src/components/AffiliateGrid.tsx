type Item = {
  id: string;
  name: string;
  desc: string;
  url: string;
};

export default function AffiliateGrid({
  items,
  openLabel,
}: {
  items: Item[];
  openLabel: string;
}) {
  if (items.length === 0) return null;
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map((it) => (
        <a
          key={it.id}
          href={it.url}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="card-glass group flex items-start justify-between gap-4 p-5 transition hover:border-gold-300/30"
        >
          <div>
            <div className="serif text-lg font-medium text-cream-50">{it.name}</div>
            <div className="mt-1 text-sm text-cream-100/65">{it.desc}</div>
          </div>
          <span className="self-start text-sm font-medium text-gold-300 transition group-hover:translate-x-0.5">
            {openLabel} →
          </span>
        </a>
      ))}
    </div>
  );
}
