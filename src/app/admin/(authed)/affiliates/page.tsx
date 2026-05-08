import { prisma } from '@/lib/db';
import AffiliatesManager from './AffiliatesManager';

export default async function AdminAffiliatesPage() {
  const items = await prisma.affiliateLink.findMany({ orderBy: { sortOrder: 'asc' } });
  return (
    <div className="space-y-6">
      <h1 className="heading-lg">Affiliates</h1>
      <AffiliatesManager items={items} />
    </div>
  );
}
