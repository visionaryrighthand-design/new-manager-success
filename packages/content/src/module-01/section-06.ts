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

  /*
   * Apply: the real workplace task for this section.
   *
   * One task, not a menu. Nothing here is marked — the app cannot see whether
   * this actually happened — so it states the task precisely, says what doing
   * it well looks like, and comes back to ask.
   */
  apply: {
    id: 'm1-s6-apply',
    title: 'Put one person on the dial, for one task',
    task:
      'Pick one person and one piece of work they are doing now. Decide where they sit on the readiness dial for that task specifically, then deliberately use the matching style — Direct, Coach, Support or Delegate — for the next two weeks.',
    lookFor: [
      'The person and the task both named, because the level changes with the task',
      'The level you chose and the reason you chose it',
      'Whether the style fitted, and what you would change',
    ],
    withinDays: 10,
    managerPrompt:
      'Who on your team needs a different level of involvement from you than they did six months ago?',
  },

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



  /*
   * Section quiz, ten questions drawn from this section's script.
   *
   * NOT from the approved quiz document, which stops after 1.2. Every stem,
   * option and line of feedback below is ours, written against the beats.
   *
   * The model is named "The Readiness Dial" throughout, per deviation D6 —
   * see IP_PUNCH_LIST.md. No question here uses the trademarked name.
   */
  quiz: [
    {
      id: 'm1-s6-q1',
      kind: 'recall',
      format: 'multiple_choice',
      source: '1.6',
      stem: 'What does the section say about treating everyone on your team exactly the same way?',
      options: [
        { id: 'a', text: 'It is the fairest approach available to a manager', correct: false, feedback: 'The section says it sounds fair on the surface, then explains why it is not.' },
        { id: 'b', text: 'It does not make you fair — it makes you inflexible', correct: true, feedback: 'Different people need different things, and the same person needs different things on different tasks.' },
        { id: 'c', text: 'It works until the team grows past about ten people', correct: false, feedback: 'The section makes no argument about team size.' },
        { id: 'd', text: 'It is the only defensible approach for a new manager', correct: false, feedback: 'The section calls it a common and costly mistake.' },
      ],
    },
    {
      id: 'm1-s6-q2',
      kind: 'recall',
      format: 'multiple_choice',
      source: '1.6',
      stem: 'Readiness is made up of which two things?',
      options: [
        { id: 'a', text: 'Experience and seniority', correct: false, feedback: 'Years served is not what the section measures.' },
        { id: 'b', text: 'Skill level and confidence level, for that specific task', correct: true, feedback: 'Both, and always for a particular task rather than in general.' },
        { id: 'c', text: 'Attitude and availability', correct: false, feedback: 'Willingness appears at Level 2, but the two components are skill and confidence.' },
        { id: 'd', text: 'Performance and potential', correct: false, feedback: 'That is a different framework. This section uses skill and confidence.' },
      ],
    },
    {
      id: 'm1-s6-q3',
      kind: 'recall',
      format: 'multiple_choice',
      source: '1.6',
      stem: 'Someone is new to a task with low skill and low confidence. Which level, and what do they need?',
      options: [
        { id: 'a', text: 'Level 1 — clear direction', correct: true, feedback: 'Unable and Unsure. Be specific, give clear instructions, check in frequently.' },
        { id: 'b', text: 'Level 2 — coaching and encouragement', correct: false, feedback: 'Level 2 is low skill but eager and motivated. This person is also low on confidence.' },
        { id: 'c', text: 'Level 3 — support and reassurance', correct: false, feedback: 'Level 3 already has the skill and lacks only confidence.' },
        { id: 'd', text: 'Level 4 — autonomy and trust', correct: false, feedback: 'Level 4 is high skill and high confidence.' },
      ],
    },
    {
      id: 'm1-s6-q4',
      kind: 'recall',
      format: 'multiple_choice',
      source: '1.6',
      stem: 'Which response does the section pair with Level 3, Able but Unsure?',
      options: [
        { id: 'a', text: 'Direct — be specific and check in frequently', correct: false, feedback: 'Directing someone who already has the skill reads as micromanagement.' },
        { id: 'b', text: 'Coach — explain the why and involve them in problem-solving', correct: false, feedback: 'Coaching is the Level 2 response, where the skill is still being built.' },
        { id: 'c', text: 'Support — encourage, ask questions, step back and let them lead while staying close', correct: true, feedback: 'The skill is there. What is missing is confidence, so you stay close without taking over.' },
        { id: 'd', text: 'Delegate — set the goal and get out of the way', correct: false, feedback: 'Delegating to someone who is unsure leaves them stranded.' },
      ],
    },
    {
      id: 'm1-s6-q5',
      kind: 'recall',
      format: 'multiple_choice',
      source: '1.6',
      stem: 'What does the section say is the response for Level 4, Able and Confident?',
      options: [
        { id: 'a', text: 'Delegate — hand it over, set the goal and get out of the way', correct: true, feedback: 'High skill and high confidence need autonomy and trust.' },
        { id: 'b', text: 'Support — stay close in case they falter', correct: false, feedback: 'Staying close is the Level 3 response.' },
        { id: 'c', text: 'Direct — keep standards visible', correct: false, feedback: 'Directing a Level 4 removes the autonomy they have earned.' },
        { id: 'd', text: 'Step back entirely and stop meeting with them', correct: false, feedback: 'Delegating is handing over the work, not withdrawing from the relationship.' },
      ],
    },
    {
      id: 'm1-s6-q6',
      kind: 'recall',
      format: 'true_false',
      source: '1.6',
      stem: 'Readiness levels describe the person overall, so once someone reaches Level 4 they stay there.',
      options: [
        { id: 'true', text: 'True', correct: false, feedback: 'The section calls this the part that trips up most new managers. The levels are task-specific, not person-specific.' },
        { id: 'false', text: 'False', correct: true, feedback: 'Your strongest employee can be Level 4 on daily work and Level 2 on an unfamiliar project.' },
      ],
    },
    {
      id: 'm1-s6-q7',
      kind: 'scenario',
      format: 'multiple_choice',
      source: '1.6',
      stem: 'Maria has run her process confidently for three years. You give her a brand-new responsibility and she starts asking more questions and second-guessing herself. What has happened?',
      options: [
        { id: 'a', text: 'She has got worse at her job', correct: false, feedback: 'The section is explicit: she did not get worse.' },
        { id: 'b', text: 'She has moved to a new task where she is a Level 2 right now, and needs coaching rather than distance', correct: true, feedback: 'Same person, different task, different level. Managing her as you did yesterday would be the wrong call.' },
        { id: 'c', text: 'She needs to be left alone until her confidence returns', correct: false, feedback: 'The section says she needs your coaching, not your distance.' },
        { id: 'd', text: 'She was never really a Level 4', correct: false, feedback: 'She is still Level 4 on the work she does every day. The level belongs to the task.' },
      ],
    },
    {
      id: 'm1-s6-q8',
      kind: 'recall',
      format: 'multiple_choice',
      source: '1.6',
      stem: 'Complete the section’s line: "Flexibility is not inconsistency. It’s ___."',
      options: [
        { id: 'a', text: 'kindness', correct: false, feedback: 'The section is making a case about judgement, not warmth.' },
        { id: 'b', text: 'intelligence', correct: true, feedback: 'Adapting your style to the person and the task is the smart response, not a loss of standards.' },
        { id: 'c', text: 'fairness', correct: false, feedback: 'Close to the theme, but not the word. The section says managing everyone identically does not make you fair.' },
        { id: 'd', text: 'leadership', correct: false, feedback: 'Not the word the section uses here.' },
      ],
    },
    {
      id: 'm1-s6-q9',
      kind: 'recall',
      format: 'multiple_choice',
      source: '1.6',
      stem: 'What single question does the section say to ask yourself before every interaction with a team member?',
      options: [
        { id: 'a', text: 'What does this person need from me personally?', correct: false, feedback: 'Close, but the section ties the question to the task rather than to the person in general.' },
        { id: 'b', text: 'For this task, where is this person on the readiness scale right now?', correct: true, feedback: 'Answer that and you know how to show up for them.' },
        { id: 'c', text: 'Have I been consistent with everyone this week?', correct: false, feedback: 'Identical treatment is what the section argues against.' },
        { id: 'd', text: 'Is this person performing at the level I expect?', correct: false, feedback: 'The question is about readiness for the task, not a performance judgement.' },
      ],
    },
    {
      id: 'm1-s6-q10',
      kind: 'scenario',
      format: 'multiple_choice',
      source: '1.6',
      stem: 'A team member is low on skill for a task but genuinely eager and motivated. What does the section say they need?',
      options: [
        { id: 'a', text: 'Clear instructions and frequent check-ins', correct: false, feedback: 'That is the Level 1 response, for someone who is also low on confidence.' },
        { id: 'b', text: 'Coaching — explain the why, involve them in problem-solving, celebrate progress', correct: true, feedback: 'Level 2 is Unable but Willing. The motivation is there; the skill is what you are building.' },
        { id: 'c', text: 'Autonomy and trust', correct: false, feedback: 'Handing over a task they cannot yet do sets them up to fail.' },
        { id: 'd', text: 'Reassurance, because their confidence is the problem', correct: false, feedback: 'Their confidence is not the problem here — they are eager. The skill is.' },
      ],
    },
  ],
};
