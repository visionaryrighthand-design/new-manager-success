import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { findSection, module01, nextSection } from '@nms/content';
import { SectionPlayer } from '@/components/SectionPlayer';
import { SectionLesson } from '@/components/SectionLesson';

/**
 * Sections published as a filmed lesson, which render the lesson page rather
 * than the card feed.
 *
 * A list rather than a flag on the content because it is temporary: the other
 * seven sections have no footage, and a feed of their script is a better
 * lesson than a page with an empty video frame at the top. When 1.2 is filmed
 * it joins this list; when all eight are, the list and the branch below both
 * come out and the feed player goes with them.
 */
const FILMED_SECTIONS = new Set(['m1-s1']);

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

  const nextSectionId = nextSection(section.id)?.id;
  if (FILMED_SECTIONS.has(section.id)) {
    return <SectionLesson section={section} nextSectionId={nextSectionId} />;
  }
  return <SectionPlayer section={section} nextSectionId={nextSectionId} />;
}
