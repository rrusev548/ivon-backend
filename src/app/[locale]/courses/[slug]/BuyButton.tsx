type Props = {
  label: string;
  href: string | null;
  comingSoonLabel: string;
};

export default function BuyButton({ label, href, comingSoonLabel }: Props) {
  if (!href) {
    return (
      <div className="flex flex-col items-end gap-2">
        <span className="btn-cta cursor-not-allowed opacity-60">{comingSoonLabel}</span>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-end gap-2">
      <a href={href} target="_blank" rel="noopener noreferrer" className="btn-cta">
        {label}
      </a>
    </div>
  );
}
