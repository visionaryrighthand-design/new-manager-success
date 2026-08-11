import { NextResponse } from 'next/server';
import { findRep, module01, nextRep } from '@nms/content';

/** Full content for one Rep. Fetched by the app when a learner opens it. */
export const dynamic = 'force-static';

export function generateStaticParams() {
  return module01.reps.map((rep) => ({ repId: rep.id }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ repId: string }> },
) {
  const { repId } = await params;
  const rep = findRep(repId);

  if (!rep) {
    return NextResponse.json({ error: 'Rep not found', repId }, { status: 404 });
  }

  return NextResponse.json({
    ...rep,
    // Correct answers ship to the client. This is a training product, not an
    // exam board: the quiz exists to teach, retakes are unlimited, and every
    // option's feedback has to render the instant it is tapped — including
    // offline. Gating answers server-side would buy nothing and cost the
    // offline experience. The final certification exam is the surface where
    // that trade-off changes; see docs/product/MVP_SPEC.md § Assessment.
    nextRepId: nextRep(rep.id)?.id ?? null,
  });
}
