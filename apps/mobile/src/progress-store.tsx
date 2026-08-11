import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  applyActivity,
  emptyProgress,
  recordQuizAttempt,
  type ActivityEvent,
  type LearnerProgress,
} from '@promoted/core';

/**
 * Learner progress, persisted on device.
 *
 * The app owns progress locally and treats the server as a sync target rather
 * than the source of truth. That is not a shortcut — a manager doing a Rep on
 * a factory floor, a hospital ward, or the Tube needs the streak to survive a
 * dead connection, and a streak that resets because of a failed request is
 * worse than no streak at all.
 *
 * All the actual rules live in @promoted/core, so device and server compute
 * identical results from the same events. This file is storage and React glue.
 */

const STORAGE_KEY = 'promoted.progress.v1';
/** Stand-in until real accounts exist. */
const LOCAL_ENROLLMENT_ID = 'local';

interface ProgressContextValue {
  progress: LearnerProgress;
  ready: boolean;
  track: (event: Omit<ActivityEvent, 'id' | 'enrollmentId' | 'at'> & { at?: Date }) => void;
  submitQuiz: (repId: string, answers: Array<{ questionId: string; optionId: string }>) => void;
  reset: () => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

/** Dates do not survive JSON. Revive them on the way back in. */
function reviveProgress(raw: string): LearnerProgress | null {
  try {
    const parsed = JSON.parse(raw) as LearnerProgress;
    const revive = (v: unknown) => (typeof v === 'string' ? new Date(v) : undefined);
    return {
      ...parsed,
      startedAt: new Date(parsed.startedAt as unknown as string),
      reps: Object.fromEntries(
        Object.entries(parsed.reps ?? {}).map(([id, rep]) => [
          id,
          {
            ...rep,
            openedAt: revive(rep.openedAt),
            completedAt: revive(rep.completedAt),
            fieldNoteSavedAt: revive(rep.fieldNoteSavedAt),
            attempts: (rep.attempts ?? []).map((a) => ({
              ...a,
              at: new Date(a.at as unknown as string),
            })),
          },
        ]),
      ),
    };
  } catch {
    // A corrupt blob must not brick the app. Start clean and move on — losing
    // a streak is bad, being unable to open the app is worse.
    return null;
  }
}

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<LearnerProgress>(() =>
    emptyProgress(LOCAL_ENROLLMENT_ID, new Date()),
  );
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (cancelled) return;
        const restored = raw ? reviveProgress(raw) : null;
        if (restored) setProgress(restored);
        setReady(true);
      })
      .catch(() => setReady(true));
    return () => {
      cancelled = true;
    };
  }, []);

  const persist = useCallback((next: LearnerProgress) => {
    setProgress(next);
    // Fire and forget: a failed write must never block the UI mid-Rep.
    void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
  }, []);

  const track = useCallback<ProgressContextValue['track']>(
    (partial) => {
      setProgress((current) => {
        const event: ActivityEvent = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          enrollmentId: LOCAL_ENROLLMENT_ID,
          at: partial.at ?? new Date(),
          ...partial,
        };
        const next = applyActivity(current, event);
        void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
        return next;
      });
    },
    [],
  );

  const submitQuiz = useCallback<ProgressContextValue['submitQuiz']>((repId, answers) => {
    setProgress((current) => {
      const { progress: next } = recordQuizAttempt(current, repId, answers, new Date());
      void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    persist(emptyProgress(LOCAL_ENROLLMENT_ID, new Date()));
  }, [persist]);

  const value = useMemo(
    () => ({ progress, ready, track, submitQuiz, reset }),
    [progress, ready, track, submitQuiz, reset],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used inside <ProgressProvider>');
  return ctx;
}
