import { NextResponse } from 'next/server';
import { findSection, module01, nextSection } from '@nms/content';

/** Full content for one Section. Fetched by the app when a learner opens it. */
export const dynamic = 'force-static';

export function generateStaticParams() {
  return module01.sections.map((section) => ({ sectionId: section.id }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ sectionId: string }> },
) {
  const { sectionId } = await params;
  const section = findSection(sectionId);

  if (!section) {
    return NextResponse.json({ error: 'Section not found', sectionId }, { status: 404 });
  }

  return NextResponse.json({
    ...section,
    // Correct answers ship to the client. This is a training product, not an
    // exam board: the quiz exists to teach, retakes are unlimited, and every
    // option's feedback has to render the instant it is tapped — including
    // offline. Gating answers server-side would buy nothing and cost the
    // offline experience. The final certification exam is the surface where
    // that trade-off changes; see docs/product/MVP_SPEC.md § Assessment.
    nextSectionId: nextSection(section.id)?.id ?? null,
  });
}
