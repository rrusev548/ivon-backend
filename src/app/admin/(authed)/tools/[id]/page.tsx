import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import ToolForm, { type ToolFormValues } from '../ToolForm';

export default async function EditToolPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tool = await prisma.tool.findUnique({ where: { id } });
  if (!tool) notFound();

  const initial: ToolFormValues = {
    id: tool.id,
    slug: tool.slug,
    nameEn: tool.nameEn,
    nameBg: tool.nameBg,
    taglineEn: tool.taglineEn,
    taglineBg: tool.taglineBg,
    descriptionEn: tool.descriptionEn,
    descriptionBg: tool.descriptionBg,
    iconUrl: tool.iconUrl ?? '',
    affiliateUrl: tool.affiliateUrl,
    category: tool.category,
    featured: tool.featured,
    sortOrder: tool.sortOrder,
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit tool</h1>
      <ToolForm initial={initial} />
    </div>
  );
}
