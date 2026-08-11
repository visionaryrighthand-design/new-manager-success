import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { findRep, module01, nextRep } from '@nms/content';
import { RepPlayer } from '@/components/RepPlayer';

export function generateStaticParams() {
  return module01.reps.map((rep) => ({ repId: rep.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ repId: string }>;
}): Promise<Metadata> {
  const { repId } = await params;
  const rep = findRep(repId);
  if (!rep) return { title: 'Rep not found' };
  return { title: `${rep.number} ${rep.title}`, description: rep.hook };
}

export default async function RepPage({ params }: { params: Promise<{ repId: string }> }) {
  const { repId } = await params;
  const rep = findRep(repId);
  if (!rep) notFound();

  return <RepPlayer rep={rep} nextRepId={nextRep(rep.id)?.id} />;
}
