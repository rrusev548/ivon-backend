import { prisma } from '@/lib/db';
import PopupForm from './PopupForm';

export default async function AdminPopupPage() {
  const cfg = await prisma.popupConfig.findUnique({ where: { id: 'singleton' } });
  return (
    <div className="space-y-6">
      <h1 className="heading-lg">Popup configuration</h1>
      <PopupForm
        initial={
          cfg ?? {
            enabled: false,
            titleBg: '',
            titleEn: '',
            titleDe: '',
            bodyBg: '',
            bodyEn: '',
            bodyDe: '',
            ctaLabelBg: '',
            ctaLabelEn: '',
            ctaLabelDe: '',
            ctaUrl: '/courses/level-1',
            delaySec: 18,
          }
        }
      />
    </div>
  );
}
