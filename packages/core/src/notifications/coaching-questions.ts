import { findSection } from '@nms/content';

/**
 * Level 3 conversation prompts.
 *
 * The spec asked for "suggested 1:1 questions for the contact to ask the
 * student, generated from (a) the student's own open-ended answers and (b) the
 * content/topic of each section."
 *
 * ── Why source (a) is gone ────────────────────────────────────────────────
 *
 * Field Notes were removed when the lesson became a video and a quiz. That
 * removes the privacy problem this module used to be built around — a boss
 * reading a learner's private written reflection — and it removes half the
 * generator's input with it.
 *
 * What is left is source (b), plus one thing the old design did not have: the
 * questions the learner got wrong. A contact who knows their manager missed
 * the question about taking work back off the team can ask about exactly that,
 * which is more useful than a generic topic prompt and still exposes nothing
 * the learner wrote in confidence. Quiz scores already reach Level 2 contacts,
 * so this introduces no new disclosure.
 *
 * ── Implementation ────────────────────────────────────────────────────────
 *
 * Deterministic templates. No model call: testable, free, instant, and it
 * cannot leak anything to a third-party API, which matters when the pilot
 * buyers are HR departments. `CoachingQuestionGenerator` is an interface so a
 * model-backed generator can replace it behind the same guarantees.
 * See docs/product/ROADMAP.md § Level 3 V2.
 */

export interface CoachingQuestion {
  /** The question the contact is invited to ask. */
  question: string;
  /** Why it is being suggested — shown in small type under the question. */
  rationale: string;
  /** Section this came from, e.g. '1.3'. */
  source: string;
  /** 'missed' if shaped by a question they got wrong, 'topic' if from the section alone. */
  basis: 'missed' | 'topic';
}

export interface CoachingQuestionGenerator {
  generate(input: {
    completedSectionIds: readonly string[];
    /** Quiz question ids the learner answered incorrectly, most recent first. */
    missedQuestionIds?: readonly string[];
    max?: number;
  }): CoachingQuestion[];
}

/**
 * Two questions per section, keyed by section number.
 *
 * Keyed by number rather than by a topic string because the topic string used
 * to live on the Field Note, and there is no longer a Field Note to hang it
 * on. The number is the one identifier every document in the project agrees
 * about.
 */
const SECTION_QUESTIONS: Record<string, string[]> = {
  '1.1': [
    'What part of the manager job has turned out to be nothing like you expected?',
    'What is something about your new role that nobody explained to you?',
  ],
  '1.2': [
    'What are you still doing yourself that someone on your team could be doing?',
    'When did you last take a task back off someone, and what happened after?',
  ],
  '1.3': [
    'Which working relationship has been hardest to renegotiate since the promotion?',
    'Where have you had to draw a line that you would not have had to draw a year ago?',
  ],
  '1.4': [
    'What does your team see in you on a bad day?',
    'What do you do to reset before a difficult conversation?',
  ],
  '1.5': [
    'What situation at work most reliably gets under your skin?',
    'Tell me about a time recently you paused instead of reacting. What did it change?',
  ],
  '1.6': [
    'Who on your team needs a different level of involvement from you than they did six months ago?',
    'Where are you giving someone autonomy they have not asked for?',
  ],
  '1.7': [
    'What standard have you set for the team that you are finding hardest to hold yourself to?',
    'What have you let slide recently that you would not accept from someone else?',
  ],
  '1.8': [
    'What is the one thing you decided to change, and has it actually happened yet?',
    'What would need to be true next month for you to say this course was worth the time?',
  ],
};

/** Fallback for a section with no bespoke questions written yet. */
function genericFor(title: string): string[] {
  return [
    `What came up for you in the section on ${title.toLowerCase()}?`,
    `Where is ${title.toLowerCase()} showing up in your week right now?`,
  ];
}

/**
 * Turns a missed quiz question into something a contact can actually ask.
 *
 * The stem is a test question and reads like one, so it is not repeated
 * verbatim. What is passed on is the subject and an invitation to talk about
 * it in the learner's own situation.
 */
function fromMissed(stem: string, sectionNumber: string, sectionTitle: string): CoachingQuestion {
  const subject = stem
    .replace(/^(what|which|why|how|who|when)\b/i, '')
    .replace(/\?$/, '')
    .replace(/^(is|are|does|do|of the following|best describes)\b/i, '')
    .trim();

  return {
    question: `In the ${sectionTitle.toLowerCase()} section, the question about ${lowerFirst(subject)} was the one that tripped you up. How does that play out on your team?`,
    rationale: `Section ${sectionNumber}. Answered incorrectly on the first attempt.`,
    source: sectionNumber,
    basis: 'missed',
  };
}

function lowerFirst(text: string): string {
  return text.length > 0 ? text[0]!.toLowerCase() + text.slice(1) : text;
}

export const templateGenerator: CoachingQuestionGenerator = {
  generate({ completedSectionIds, missedQuestionIds = [], max = 3 }) {
    const questions: CoachingQuestion[] = [];
    const seen = new Set<string>();

    const push = (q: CoachingQuestion) => {
      if (seen.has(q.question)) return;
      seen.add(q.question);
      questions.push(q);
    };

    // A question they got wrong is the sharpest prompt available, so those
    // come first and the topic prompts fill whatever room is left.
    const missed = new Set(missedQuestionIds);
    for (const sectionId of completedSectionIds) {
      const section = findSection(sectionId);
      if (!section) continue;
      for (const question of section.quiz) {
        if (!missed.has(question.id)) continue;
        push(fromMissed(question.stem, section.number, section.title));
        break; // At most one per section; a digest is not a report card.
      }
    }

    for (const sectionId of completedSectionIds) {
      const section = findSection(sectionId);
      if (!section) continue;
      const pool = SECTION_QUESTIONS[section.number] ?? genericFor(section.title);
      if (pool[0]) {
        push({
          question: pool[0],
          rationale: `Section ${section.number} — ${section.title}.`,
          source: section.number,
          basis: 'topic',
        });
      }
    }

    return questions.slice(0, max);
  },
};
