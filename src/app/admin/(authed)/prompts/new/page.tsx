import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import PromptForm from '../PromptForm';

export default async function NewPromptPage() {
  const tools = await prisma.tool.findMany({
    select: { id: true, nameEn: true },
    orderBy: { nameEn: 'asc' },
  });
  if (tools.length === 0) redirect('/admin/tools/new');

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">New prompt</h1>
      <PromptForm tools={tools} />
    </div>
  );
}
