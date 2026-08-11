import { NextResponse } from 'next/server';
import { course, module01, estimateRepTotalSeconds } from '@nms/content';

/**
 * Course manifest for the mobile app.
 *
 * Deliberately light: titles, hooks, counts, and durations — not the beats.
 * The app fetches a single Rep's content on open (`/api/reps/[repId]`) so a
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
      reps: mod.reps.map((rep) => ({
        id: rep.id,
        number: rep.number,
        title: rep.title,
        subtitle: rep.subtitle ?? null,
        hook: rep.hook,
        keyIdea: rep.keyIdea,
        estimatedSeconds: estimateRepTotalSeconds(rep),
        counts: {
          beats: rep.beats.length,
          quiz: rep.quiz.length,
          curveballs: rep.curveballs.length,
        },
      })),
    })),
    roadmap: course.roadmap,
    passingScore: module01.passingScore,
  });
}
