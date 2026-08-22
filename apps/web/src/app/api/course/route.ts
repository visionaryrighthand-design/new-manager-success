import { NextResponse } from 'next/server';
import { course, module01, estimateSectionTotalSeconds } from '@nms/content';

/**
 * Course manifest for the mobile app.
 *
 * Deliberately light: titles, hooks, counts, and durations — not the beats.
 * The app fetches a single Section's content on open (`/api/sections/[sectionId]`) so a
 * cold start is not gated on downloading the whole module, and so content
 * edits land without an app-store release.
 */
export const dynamic = 'force-static';

export function GET() {
  return NextResponse.json({
    id: course.id,
    title: course.title,
    modules: course.modules.map((mod) => ({
      id: mod.id,
      number: mod.number,
      title: mod.title,
      subtitle: mod.subtitle,
      description: mod.description,
      status: mod.status,
      passingScore: mod.passingScore,
      sections: mod.sections.map((section) => ({
        id: section.id,
        number: section.number,
        title: section.title,
        subtitle: section.subtitle ?? null,
        hook: section.hook,
        keyIdea: section.keyIdea,
        estimatedSeconds: estimateSectionTotalSeconds(section),
        counts: {
          beats: section.beats.length,
          quiz: section.quiz.length,
          hasVideo: Boolean(section.videoUrl),
        },
      })),
    })),
    roadmap: course.roadmap,
    passingScore: module01.passingScore,
  });
}
