import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { findSection, module01, nextSection } from '@nms/content';
import { SectionLesson } from '@/components/SectionLesson';

/*
 * Every section renders the lesson feed.
 *
 * This used to branch: 1.1 got the lesson, the rest got the older beat-based
 * card player, because a lesson built around a video made a poor show of a
 * section with no video. That is handled inside the lesson now — an unfilmed
 * section presents its script in place of the film and the rest of the
 * lesson is identical — so the branch is gone and every section behaves the
 * same way.
 *
 * `SectionPlayer` is no longer routed to. It is left in the tree rather than
 * deleted because it is the only record of the beat-per-card design, and
 * restoring it is one import.
 */

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

export default async function SectionPage({ params }: { params: Promise<{ sectionId: string }> }) {
  const { sectionId } = await params;
  const section = findSection(sectionId);
  if (!section) notFound();

  return <SectionLesson section={section} nextSectionId={nextSection(section.id)?.id} />;
}
