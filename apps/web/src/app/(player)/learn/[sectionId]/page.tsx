import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { findSection, module01, nextSection } from '@nms/content';
import { SectionPlayer } from '@/components/SectionPlayer';

export function generateStaticParams() {
  return module01.sections.map((section) => ({ sectionId: section.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ sectionId: string }>;
}): Promise<Metadata> {
  const { sectionId } = await params;
  const section = findSection(sectionId);
  if (!section) return { title: 'Section not found' };
  return { title: `${section.number} ${section.title}`, description: section.hook };
}

export default async function RepPage({ params }: { params: Promise<{ sectionId: string }> }) {
  const { sectionId } = await params;
  const section = findSection(sectionId);
  if (!section) notFound();

  return <SectionPlayer section={section} nextSectionId={nextSection(section.id)?.id} />;
}
