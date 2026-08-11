import type { Metadata } from 'next';
import { EnrollFlow } from '@/components/EnrollFlow';

export const metadata: Metadata = {
  title: 'Enroll',
  description:
    'Register yourself, one person, or a whole team — and choose who follows their progress and how much they see.',
};

export default function EnrollPage() {
  return (
    <div className="pr-shell">
      <EnrollFlow />
    </div>
  );
}
