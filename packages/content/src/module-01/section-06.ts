import type { Section } from '../types.js';

/**
 * 1.6 — Managing in the Moment
 * Script status: APPROVED & LOCKED (April 2026), with four recorded deviations.
 *
 * ⚠ This is the one Section in Module 1 that does not ship verbatim.
 *
 * The locked April script titles this section "Situational Leadership — One
 * Style Doesn't Fit All" and uses the term four times. Situational Leadership®
 * is a registered trademark of the Center for Leadership Studies, and the
 * four-style set Directing / Coaching / Supporting / Delegating is associated
 * with SLII® (Blanchard). This sits in exactly the same category as the two
 * trademark flags the August 2026 Expanded Module Outline already raises
 * (D4 Radical Candor®, D5 SBI) — and that outline has itself already retitled
 * this section "Managing in the Moment" and refers to "the Module 1.6 dial".
 *
 * What ships: the newer approved title, with the model named originally as
 * The Readiness Dial. Every substantive idea in the locked script is retained
 * unchanged. All four wording changes are recorded in `scriptDeviations` and
 * printed by `npm run report:ip -w @nms/content` for sign-off.
 */
export const section06: Section = {
  id: 'm1-s6',
  moduleNumber: 1,
  index: 6,
  number: '1.6',
  title: 'Managing in the Moment',
  subtitle: 'One style doesn’t fit all',
  durationMinutes: 7,
  spokenWordCount: 800,
  scriptStatus: 'approved-locked',
  hook: 'Managing everyone identically doesn’t make you fair. It makes you inflexible.',
  keyIdea:
    'Different people need different things, and the same person needs different things on different tasks. Flexibility is not inconsistency.',
  topics: ['readiness dial', 'adapting your style', 'task-specific readiness', 'autonomy vs direction'],

  beats: [
    {
      id: 'b1',
      type: 'avatar',
      direction: 'full screen, direct to camera',
      speech:
        "One of the most common mistakes new managers make, and it's a costly one, is treating everyone on their team exactly the same way.\n\nOn the surface, that sounds fair. Same rules, same approach, same style for everyone. But here's the problem.\n\nDifferent people need different things from their manager. And the same person can need different things from you depending on the task, the situation, or where they are in their development.\n\nManaging everyone identically doesn't make you fair. It makes you inflexible.",
    },
    { id: 'b2', type: 'overlay', text: 'The Readiness Dial' },
    {
      id: 'b3',
      type: 'avatar',
      direction: 'full screen',
      speech:
        "The Readiness Dial is built on one simple idea: the most effective leadership style depends on the person you're leading and the specific task at hand.\n\nThis isn't about playing favorites or being inconsistent. It's about being smart enough to recognize that a brand-new employee learning an unfamiliar process needs something completely different from a seasoned team member who's been doing the same job for three years.\n\nLet's break this down.\n\nEvery employee on your team sits somewhere on a readiness spectrum for any given task. Readiness is a combination of two things, their skill level and their confidence level for that specific task.",
    },
    {
      id: 'b4',
      type: 'buildList',
      direction: 'avatar steps back, items build on screen',
      items: [
        'Level 1: Unable and Unsure, new to the task, low skill, low confidence. Needs clear direction.',
        'Level 2: Unable but Willing, low skill but eager and motivated. Needs coaching and encouragement.',
        'Level 3: Able but Unsure, has the skill but lacks confidence. Needs support and reassurance.',
        'Level 4: Able and Confident, high skill, high confidence. Needs autonomy and trust.',
      ],
    },
    { id: 'b5', type: 'hold', text: 'All four visible' },
    {
      id: 'b6',
      type: 'avatar',
      direction: 'full screen',
      speech:
        "Now here's where it gets practical. Each readiness level calls for a different leadership response from you.",
    },
    {
      id: 'b7',
      type: 'buildList',
      direction: 'avatar steps back, items build on screen',
      items: [
        'For Level 1, Direct. Be specific, give clear instructions, check in frequently.',
        'For Level 2, Coach. Explain the why, involve them in problem-solving, celebrate progress.',
        'For Level 3, Support. Encourage, ask questions, step back and let them lead while staying close.',
        'For Level 4, Delegate. Hand it over. Set the goal and get out of the way.',
      ],
    },
    { id: 'b8', type: 'hold', text: 'All four visible' },
    {
      id: 'b9',
      type: 'avatar',
      direction: 'full screen',
      speech:
        "Here's the part that trips up most new managers. These levels are task-specific, not person-specific.\n\nYour strongest employee might be a Level 4 on the work they do every day. But put them on a new project in an unfamiliar area and they may drop to a Level 2. They still need your guidance, just in a different way than the newest person on your team.",
    },
    { id: 'b10', type: 'moment', text: 'Flexibility is not inconsistency. It’s intelligence.' },
    {
      id: 'b11',
      type: 'avatar',
      direction: 'full screen',
      speech:
        "Let me give you a real example.\n\nYou have two team members. Maria has been in her role for three years. She knows the process inside out. You give her goals and she runs. That's Level 4, you delegate and trust.\n\nThen you ask Maria to take on a brand new responsibility she's never done before. Suddenly she's asking more questions, second-guessing herself, needing more check-ins. She didn't get worse at her job. She just moved to a new task where she's a Level 2 right now. She needs your coaching, not your distance.\n\nManaging her the same way you did yesterday (high autonomy, minimal direction) would be the wrong call.",
    },
    {
      id: 'b12',
      type: 'avatar',
      direction: 'full screen',
      speech:
        'The Readiness Dial gives you a simple question to ask yourself before every interaction with a team member:',
    },
    {
      id: 'b13',
      type: 'overlay',
      text: 'For this task, where is this person on the readiness scale right now?',
      speech: "Answer that question and you'll know exactly how to show up for them.",
    },
    {
      id: 'b14',
      type: 'avatar',
      direction: 'full screen, direct close',
      speech:
        "In our final content section of Module 1, we're going to bring everything together, because all the mindset shifts we've talked about mean very little if they don't show up in how you actually behave every day.\n\nLeading by example. Acting like an owner. That's where we're headed next.",
    },
  ],

  scriptDeviations: [
    {
      ref: 'D7',
      original: 'Em dashes throughout the approved script, e.g. "your old manager\u2019s style was built for their context \u2014 not yours."',
      shipped: 'The same words with the dash replaced by a comma, colon, or full stop as the sentence requires.',
      reason:
        'The em dash now reads as a marker of machine-written copy, and this product is sold on a human having done the job. Punctuation only: not one word changed, so the recorded voiceover still matches every card.',
      severity: 'editorial',
      needsSignoffFrom: 'Course author',
    },
    {
      ref: 'D6a',
      severity: 'legal',
      original: 'SECTION 1.6: “Situational Leadership, One Style Doesn’t Fit All”',
      shipped: 'Section 1.6: “Managing in the Moment” (subtitle: “One style doesn’t fit all”)',
      reason:
        'Adopts the title already approved in the August 2026 Expanded Module Outline, which supersedes the April script header. Removes the registered mark from the section title while keeping the original subtitle line.',
      needsSignoffFrom: 'Course owner + IP counsel',
    },
    {
      ref: 'D6b',
      severity: 'legal',
      original: '[TEXT OVERLAY: “Situational Leadership”]',
      shipped: '[TEXT OVERLAY: “The Readiness Dial”]',
      reason:
        'On-screen text is the highest-exposure use of a mark. “The Readiness Dial” is an original name and matches the outline’s own reference to “the Module 1.6 dial” in section 3.2.',
      needsSignoffFrom: 'Course owner + IP counsel',
    },
    {
      ref: 'D6c',
      severity: 'legal',
      original:
        'Situational Leadership is a framework built on one simple idea: the most effective leadership style depends on the person you’re leading and the specific task at hand.',
      shipped:
        'The Readiness Dial is built on one simple idea: the most effective leadership style depends on the person you’re leading and the specific task at hand.',
      reason: 'Same substitution in narration. Idea unchanged.',
      needsSignoffFrom: 'Course owner + IP counsel',
    },
    {
      ref: 'D6d',
      severity: 'legal',
      original:
        'The Situational Leadership model gives you a simple question to ask yourself before every interaction with a team member:',
      shipped:
        'The Readiness Dial gives you a simple question to ask yourself before every interaction with a team member:',
      reason: 'Same substitution in narration. Idea unchanged.',
      needsSignoffFrom: 'Course owner + IP counsel',
    },
    {
      ref: 'D6e',
      severity: 'legal',
      original:
        'Four-level readiness ladder and the paired response verbs Direct / Coach / Support / Delegate (retained verbatim).',
      shipped: 'Retained verbatim, no change made. Flagged for review only.',
      reason:
        'NOT CHANGED, but counsel should look at it. The underlying idea that leadership style should vary with a person’s skill and confidence on a given task is not protectable. However, the specific four-style set Directing / Coaching / Supporting / Delegating is closely associated with SLII® (Blanchard), and the four-quadrant readiness ladder with Situational Leadership®. If counsel wants additional distance, the cheapest change is to rename the four responses (e.g. Show / Build / Back / Release) without touching the descriptions.',
      needsSignoffFrom: 'IP counsel, decision required before public launch',
    },
  ],



  quiz: [
    {
      id: 'm1-s6-q1',
      kind: 'recall',
      source: '1.6',
      stem: 'Readiness is made up of which two things?',
      options: [
        {
          id: 'a',
          text: 'Skill level and confidence level for that specific task.',
          correct: true,
          feedback: 'Both, and always for a specific task, not for the person in general.',
        },
        { id: 'b', text: 'Experience and seniority.', correct: false, feedback: 'Neither is what readiness measures.' },
        { id: 'c', text: 'Motivation and attitude.', correct: false, feedback: 'Motivation shows up inside the levels, but readiness is skill plus confidence.' },
        { id: 'd', text: 'Performance history and potential.', correct: false, feedback: 'Those are evaluation terms, not readiness.' },
      ],
    },
    {
      id: 'm1-s6-q2',
      kind: 'recall',
      source: '1.6',
      stem: 'What is the most common mistake managers make when applying the readiness levels?',
      options: [
        {
          id: 'a',
          text: 'Treating the levels as person-specific rather than task-specific.',
          correct: true,
          feedback:
            'Your Level 4 on their daily work can be a Level 2 the moment the task changes. The dial moves with the task.',
        },
        {
          id: 'b',
          text: 'Assuming everyone starts at Level 1.',
          correct: false,
          feedback: 'A smaller error, and not the one the section calls out.',
        },
        {
          id: 'c',
          text: 'Moving people through the levels too quickly.',
          correct: false,
          feedback: 'Not the named mistake.',
        },
        {
          id: 'd',
          text: 'Telling people what level they are at.',
          correct: false,
          feedback: 'Not addressed in this section.',
        },
      ],
    },
    {
      id: 'm1-s6-q3',
      kind: 'scenario',
      source: '1.6',
      stem: 'Someone on your team has the skill to run a project alone but keeps checking in for reassurance before every decision. Which level, and which response?',
      options: [
        {
          id: 'a',
          text: 'Level 1, Direct. Give specific instructions and check in frequently.',
          correct: false,
          feedback: 'They already have the skill. Directing them will confirm the doubt they already have.',
        },
        {
          id: 'b',
          text: 'Level 3, Support. Encourage, ask questions, step back and let them lead while staying close.',
          correct: true,
          feedback:
            'Able but unsure. The gap is confidence, not capability, so the answer is presence, not instruction.',
        },
        {
          id: 'c',
          text: 'Level 4, Delegate. Hand it over and get out of the way.',
          correct: false,
          feedback:
            'Skill says Level 4, confidence says otherwise. Full withdrawal at this point usually stalls the work.',
        },
        {
          id: 'd',
          text: 'Level 2, Coach. Explain the why and involve them in problem-solving.',
          correct: false,
          feedback:
            'Coaching addresses a skill gap. There isn’t one here, teaching them what they already know can read as condescension.',
        },
      ],
    },
  ],
};
