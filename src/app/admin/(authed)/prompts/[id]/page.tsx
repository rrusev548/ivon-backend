import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import PromptForm, { type PromptFormValues } from '../PromptForm';

export default async function EditPromptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [prompt, tools] = await Promise.all([
    prisma.prompt.findUnique({ where: { id } }),
    prisma.tool.findMany({
      select: { id: true, nameEn: true },
      orderBy: { nameEn: 'asc' },
    }),
  ]);
  if (!prompt) notFound();

  const initial: PromptFormValues = {
    id: prompt.id,
    toolId: prompt.toolId,
    titleEn: prompt.titleEn,
    titleBg: prompt.titleBg,
    contentEn: prompt.contentEn,
    contentBg: prompt.contentBg,
    sortOrder: prompt.sortOrder,
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit prompt</h1>
      <PromptForm tools={tools} initial={initial} />
    </div>
  );
}
