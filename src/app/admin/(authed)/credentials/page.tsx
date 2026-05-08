import { prisma } from '@/lib/db';
import CredentialsManager from './CredentialsManager';

export default async function AdminCredentialsPage() {
  const items = await prisma.credential.findMany({ orderBy: { sortOrder: 'asc' } });
  return (
    <div className="space-y-6">
      <h1 className="heading-lg">Credentials</h1>
      <CredentialsManager items={items} />
    </div>
  );
}
