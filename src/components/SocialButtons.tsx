type Variant = 'solid' | 'ghost';

const ig = 'https://instagram.com/';
const tk = 'https://tiktok.com/@';

const Instagram = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
  </svg>
);

const TikTok = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M14 4v9a3.5 3.5 0 1 1-3.5-3.5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <path
      d="M14 4c.5 2.5 2.3 4.3 5 4.5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

export default function SocialButtons({
  instagramHandle,
  tiktokHandle,
  variant = 'solid',
  igLabel = 'Instagram',
  tkLabel = 'TikTok',
}: {
  instagramHandle: string;
  tiktokHandle: string;
  variant?: Variant;
  igLabel?: string;
  tkLabel?: string;
}) {
  const igHref = instagramHandle.startsWith('http') ? instagramHandle : `${ig}${instagramHandle.replace(/^@/, '')}`;
  const tkHref = tiktokHandle.startsWith('http') ? tiktokHandle : `${tk}${tiktokHandle.replace(/^@/, '')}`;
  const cls = variant === 'solid' ? 'btn-primary' : 'btn-ghost';
  return (
    <div className="flex flex-wrap gap-3">
      <a href={igHref} target="_blank" rel="noopener noreferrer" className={`${cls} gap-2`}>
        <Instagram /> {igLabel}
      </a>
      <a href={tkHref} target="_blank" rel="noopener noreferrer" className={`${cls} gap-2`}>
        <TikTok /> {tkLabel}
      </a>
    </div>
  );
}
