import type { Rep } from '../types.js';

/**
 * 1.8 — Module 1 Review
 * Script status: APPROVED & LOCKED (April 2026), with one recorded deviation
 * (the section-6 recap line, following D6a).
 *
 * The three scenarios in the locked review script are rendered as Curveballs
 * rather than narration: the script already frames them as "think about what
 * you would do... then we'll walk through it together", which is exactly the
 * Curveball interaction. The script's own answer becomes the response on the
 * correct choice, verbatim.
 */
export const rep08: Rep = {
  id: 'm1-r8',
  moduleNumber: 1,
  index: 8,
  number: '1.8',
  title: 'Module 1 Review',
  durationMinutes: 11,
  spokenWordCount: 650,
  scriptStatus: 'approved-locked',
  hook: 'Seven sections. Three scenarios. Let’s see what stuck.',
  keyIdea:
    'The best managers don’t just watch and move on. They reflect, connect the dots, and make it stick.',
  topics: ['module 1 review', 'applying the mindset shift'],

  beats: [
    {
      id: 'b1',
      type: 'avatar',
      direction: 'full screen, direct to camera',
      speech:
        "You've just completed Module 1. Seven sections covering the most important mindset shifts a new manager needs to make before anything else.\n\nLet's take a few minutes to pull the key ideas together, because the best managers don't just watch and move on. They reflect, connect the dots, and make it stick.",
    },
    { id: 'b2', type: 'overlay', text: 'Module 1 Review, The Mindset Shift' },
    {
      id: 'b3',
      type: 'avatar',
      direction: 'full screen',
      speech: "Here's what you covered in this module.",
    },
    {
      id: 'b4',
      type: 'buildList',
      direction: 'avatar steps back, items build on screen',
      items: [
        'Section 1: The Invisible Promotion, most managers are promoted without preparation. That gap is real, and it’s fixable.',
        'Section 2: The Doer Trap, your value as a manager is measured by your team’s output, not your own.',
        'Section 3: The Relationship Reset, the goal is not to be liked. It’s to be trusted and respected.',
        'Section 4: Your Energy Sets the Tone, emotional contagion is real. What you project, your team absorbs.',
        'Section 5: Emotional Intelligence, self-awareness and self-regulation are the foundation of effective leadership.',
        'Section 6: Managing in the Moment, different people need different things. Flexibility is not inconsistency.',
        'Section 7: Leading by Example, your team will not do what you say. They will do what you do.',
      ],
    },
    { id: 'b5', type: 'hold', text: 'All seven visible' },
    {
      id: 'b6',
      type: 'avatar',
      direction: 'full screen',
      speech:
        "Now let's put some of these ideas to work with a few real-world scenarios. Think about what you would do in each situation, then we'll walk through it together.",
    },
    {
      id: 'b7',
      type: 'avatar',
      direction: 'full screen, direct close',
      speech:
        "Those are the moments that define what kind of manager you're becoming. Not the easy days, the ones that test what you've learned.\n\nYou've built the foundation in this module. The mindset, the emotional awareness, the frameworks for understanding your team. Everything that follows in this program builds on what you've started here.\n\nComplete your Module 1 quiz to lock in what you've learned, and then we'll see you in Module 2.",
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
      ref: 'D6f',
      severity: 'legal',
      original:
        'Section 6: Situational Leadership, different people need different things. Flexibility is not inconsistency.',
      shipped:
        'Section 6: Managing in the Moment, different people need different things. Flexibility is not inconsistency.',
      reason:
        'Recap line updated to match the retitled section 1.6 (see D6a). Consequential change only, no editorial decision beyond D6a.',
      needsSignoffFrom: 'Course owner + IP counsel',
    },
  ],



  quiz: [
    {
      id: 'm1-r8-q1',
      kind: 'scenario',
      source: '1.2',
      stem: 'Six months in, your team ships more than it did before your promotion but you have personally produced almost nothing. How should this be read?',
      options: [
        {
          id: 'a',
          text: 'A problem. Your own output has collapsed.',
          correct: false,
          feedback: 'Your output is no longer the measure. This is what the transition is supposed to look like.',
        },
        {
          id: 'b',
          text: 'The transition working. Your value is now measured by what your team produces.',
          correct: true,
          feedback:
            'When you start measuring your success by the success of your team, everything changes.',
        },
        {
          id: 'c',
          text: 'Neutral, it depends entirely on your industry.',
          correct: false,
          feedback: 'The shift from task leadership to people leadership holds across professions.',
        },
        {
          id: 'd',
          text: 'A risk, because leadership will not see your contribution.',
          correct: false,
          feedback:
            'A real career concern worth managing upward (Module 8), but not how the module asks you to read the outcome.',
        },
      ],
    },
    {
      id: 'm1-r8-q2',
      kind: 'scenario',
      source: '1.3',
      stem: 'Which pair of statements is consistent with Module 1?',
      options: [
        {
          id: 'a',
          text: 'Be liked by your team; treat everyone identically.',
          correct: false,
          feedback: 'Both are named as traps, approval-seeking, and inflexibility mistaken for fairness.',
        },
        {
          id: 'b',
          text: 'Be trusted and respected; adapt your style to the person and the task.',
          correct: true,
          feedback: 'Sections 1.3 and 1.6. Consistency of standards, flexibility of approach.',
        },
        {
          id: 'c',
          text: 'Be trusted and respected; treat everyone identically.',
          correct: false,
          feedback:
            'First half right. Managing everyone identically does not make you fair. It makes you inflexible.',
        },
        {
          id: 'd',
          text: 'Be liked by your team; adapt your style to the person and the task.',
          correct: false,
          feedback: 'Second half right, but the goal is never to be liked.',
        },
      ],
    },
    {
      id: 'm1-r8-q3',
      kind: 'scenario',
      source: '1.4',
      stem: 'Your team has stopped bringing you problems early. Which Module 1 idea most directly explains this?',
      options: [
        {
          id: 'a',
          text: 'The doer trap, they assume you will just fix it yourself.',
          correct: false,
          feedback:
            'Plausible and worth checking. But the doer trap usually produces more problems arriving, not fewer.',
        },
        {
          id: 'b',
          text: 'Emotional contagion. They are reading tension from you and staying out of the way.',
          correct: true,
          feedback:
            'Questions go unasked, issues go unreported, and nobody ever says a word about what is wrong.',
        },
        {
          id: 'c',
          text: 'The relationship reset. You have become too distant.',
          correct: false,
          feedback:
            'Possible, but the reset is about the nature of the relationship, not about approachability collapsing.',
        },
        {
          id: 'd',
          text: 'Readiness. They are all at Level 4 and do not need you.',
          correct: false,
          feedback: 'A Level 4 still reports problems. Silence is a different signal.',
        },
      ],
    },
    {
      id: 'm1-r8-q4',
      kind: 'scenario',
      source: '1.7',
      stem: 'Which of these does the most damage to a new manager’s credibility?',
      options: [
        {
          id: 'a',
          text: 'Admitting you do not know the answer to a technical question.',
          correct: false,
          feedback:
            'Costs far less than managers expect. Module 8 covers saying “I don’t know” without losing credibility.',
        },
        {
          id: 'b',
          text: 'Holding a standard for the team that you visibly do not hold for yourself.',
          correct: true,
          feedback:
            'Credibility is earned through alignment between what you say and what you do, and lost fast when they do not match.',
        },
        {
          id: 'c',
          text: 'Changing a decision after hearing new information.',
          correct: false,
          feedback: 'Usually builds credibility, provided you say what changed and why.',
        },
        {
          id: 'd',
          text: 'Being new to the role.',
          correct: false,
          feedback: 'Everyone starts somewhere. It is what you model from there that counts.',
        },
      ],
    },
    {
      id: 'm1-r8-q5',
      kind: 'recall',
      source: '1.1',
      stem: 'What is the reframe the whole program is built on?',
      options: [
        {
          id: 'a',
          text: 'You were promoted because you were great at your job. That is your starting point, not your finish line.',
          correct: true,
          feedback:
            'And the skills that made you an exceptional doer are different from the ones that will make you an exceptional manager. Those can be learned.',
        },
        {
          id: 'b',
          text: 'Management is a personality trait some people have and others do not.',
          correct: false,
          feedback: 'The exact opposite. Management is a skill, and it can be learned.',
        },
        {
          id: 'c',
          text: 'You should stop doing the work you were good at immediately.',
          correct: false,
          feedback: 'The shift is real but it is about where your value comes from, not a hard switch on day one.',
        },
        {
          id: 'd',
          text: 'Your first ninety days determine whether you will succeed.',
          correct: false,
          feedback:
            'The first ninety days set patterns that are hard to undo, true, but not the program’s core reframe.',
        },
      ],
    },
  ],
};
