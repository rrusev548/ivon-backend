import { prisma } from '@/lib/db';
import TestimonialsManager from './TestimonialsManager';

export default async function AdminTestimonialsPage() {
  const items = await prisma.testimonial.findMany({ orderBy: { sortOrder: 'asc' } });
  return (
    <div className="space-y-6">
      <h1 className="heading-lg">Testimonials</h1>
      <TestimonialsManager items={items} />
    </div>
  );
}
