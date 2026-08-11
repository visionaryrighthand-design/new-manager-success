import { NextResponse } from 'next/server';
import { categorize, validateEnrollment, type Enrollment } from '@nms/core';

/**
 * Enrollment intake.
 *
 * The MVP has no database: this validates against the same rules the UI uses
 * and echoes back what would be persisted, so the contract is fixed and the
 * mobile client can be built against it before storage exists. Wiring a store
 * behind this is a single-file change — see docs/product/MVP_SPEC.md § Storage.
 */
export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Body must be JSON.' }, { status: 400 });
  }

  const enrollments = normalize(payload);
  if (!enrollments) {
    return NextResponse.json(
      { error: 'Expected an enrollment object, or { enrollments: [...] }.' },
      { status: 400 },
    );
  }

  const results = enrollments.map((enrollment, index) => ({
    index,
    problems: validateEnrollment(enrollment),
  }));

  const invalid = results.filter((r) => r.problems.length > 0);
  if (invalid.length > 0) {
    return NextResponse.json({ error: 'Validation failed', results: invalid }, { status: 422 });
  }

  return NextResponse.json(
    {
      accepted: enrollments.length,
      enrollments: enrollments.map((e) => ({
        id: e.id,
        student: e.student,
        entry: e.entry,
        category: categorize(e),
        contacts: e.contacts.map((c) => ({ id: c.id, email: c.email, role: c.role, level: c.level })),
      })),
      persisted: false,
      note: 'Pilot build: validated but not stored. No email is sent yet.',
    },
    { status: 201 },
  );
}

/** Accepts a single enrollment or a batch, and revives Date fields from JSON. */
function normalize(payload: unknown): Enrollment[] | null {
  if (!payload || typeof payload !== 'object') return null;

  const raw = Array.isArray((payload as { enrollments?: unknown }).enrollments)
    ? ((payload as { enrollments: unknown[] }).enrollments)
    : [payload];

  const out: Enrollment[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') return null;
    const e = item as Partial<Enrollment> & { startedAt?: string | Date };
    if (!e.student || !e.entry) return null;
    out.push({
      id: e.id ?? crypto.randomUUID(),
      entry: e.entry,
      student: e.student,
      contacts: e.contacts ?? [],
      registeredBy: e.registeredBy,
      rosterId: e.rosterId,
      startedAt: e.startedAt ? new Date(e.startedAt) : new Date(),
    });
  }
  return out;
}
