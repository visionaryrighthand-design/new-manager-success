'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { CoachKey } from '@nms/content';
import { CoachPicker } from '@/components/CoachPicker';
import { readCoach, saveCoach } from '@/lib/coach-store';

/**
 * The picker, as a route.
 *
 * Reached by a learner who has not chosen yet, usually redirected here from a
 * lesson with `?next=` pointing back at where they were going. Picking sends
 * them on rather than dumping them on a confirmation screen: the choice is
 * not the destination, it is a door.
 */
function CoachPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [current, setCurrent] = useState<CoachKey | null>(null);

  useEffect(() => setCurrent(readCoach()), []);

  const choose = useCallback(
    (coach: CoachKey) => {
      saveCoach(coach);
      const next = params.get('next');
      // Only ever an in-app path. An absolute URL here would be an open
      // redirect, and `?next=https://...` is the first thing anyone tries.
      const safe = next && next.startsWith('/') && !next.startsWith('//') ? next : '/learn';
      router.replace(safe);
    },
    [params, router],
  );

  return <CoachPicker current={current} onChoose={choose} />;
}

export default function Page() {
  // useSearchParams needs a suspense boundary to prerender.
  return (
    <Suspense fallback={null}>
      <CoachPage />
    </Suspense>
  );
}
