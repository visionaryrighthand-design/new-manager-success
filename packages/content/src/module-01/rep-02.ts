import type { Rep } from '../types.js';

/**
 * 1.2 — Why Being Great at Your Job Isn't Enough Anymore
 * Script status: APPROVED & LOCKED (April 2026). Beats are verbatim.
 */
export const rep02: Rep = {
  id: 'm1-r2',
  moduleNumber: 1,
  index: 2,
  number: '1.2',
  title: 'Why Being Great at Your Job Isn’t Enough Anymore',
  subtitle: 'The Doer Trap',
  durationMinutes: 7,
  spokenWordCount: 800,
  scriptStatus: 'approved-locked',
  hook: 'The skills that got you promoted are the ones now working against you.',
  keyIdea:
    'Your value as a manager is measured by your team’s output, not your own.',
  topics: ['doer trap', 'task vs people leadership', 'bottlenecks', 'what managers actually do'],

  beats: [
    {
      id: 'b1',
      type: 'avatar',
      direction: 'full screen, direct to camera',
      speech:
        "There's an uncomfortable truth that most organizations never talk about when they promote someone into management.\n\nThe very things that made you exceptional as an individual contributor (your speed, your technical expertise, your ability to get things done) those same qualities can work directly against you as a manager.\n\nNot because they're bad qualities. They're not. But the job has fundamentally changed, and the tools that worked in your old role don't fit the new one.",
    },
    {
      id: 'b2',
      type: 'avatar',
      direction: 'full screen',
      speech:
        'Think about what you were rewarded for before your promotion. You solved problems. You delivered results. You moved fast and produced high-quality work. Your value was your output.',
    },
    {
      id: 'b3',
      type: 'overlay',
      text: 'Task Leadership. You are measured by what YOU produce.',
      speech: "That's task leadership. And you were exceptional at it.",
    },
    {
      id: 'b4',
      type: 'overlay',
      text: 'People Leadership. You are measured by what your TEAM produces.',
      speech:
        "People leadership is a different game entirely. Your value is no longer in what you personally produce. It's in what you help your team produce. Your job is not to be the best at the work. Your job is to create the conditions where your team can do their best work.",
    },
    {
      id: 'b5',
      type: 'avatar',
      direction: 'full screen',
      speech:
        "That shift, from doing to enabling, is the single most important transition you will make as a manager.\n\nAnd here's what happens when new managers don't make it. They keep doing. They jump in when things get complicated. They solve problems their team should be solving. They take work back because it's just easier to do it themselves.\n\nWe call this the doer trap. And it creates three problems simultaneously.",
    },
    {
      id: 'b6',
      type: 'buildList',
      direction: 'avatar steps back, items build on screen',
      items: [
        'Problem 1: It creates a bottleneck, everything runs through you.',
        'Problem 2: It stunts your team’s growth. They learn by doing, not watching.',
        'Problem 3: It signals you don’t trust them, and a team that feels untrusted stops giving their best.',
      ],
    },
    { id: 'b7', type: 'hold', text: 'All three visible' },
    {
      id: 'b8',
      type: 'avatar',
      direction: 'full screen',
      speech: "So if great managers aren't doing the work, what are they doing?",
    },
    {
      id: 'b9',
      type: 'buildList',
      direction: 'avatar steps back, items build on screen',
      items: [
        'Building clarity, everyone knows what success looks like.',
        'Removing obstacles, clearing the path so their team can perform.',
        'Developing people, coaching, feedback, growth conversations.',
        'Making decisions, priorities, resources, when to step in and when to step back.',
      ],
    },
    { id: 'b10', type: 'hold', text: 'All four visible' },
    {
      id: 'b11',
      type: 'avatar',
      direction: 'full screen',
      speech:
        "None of those things show up in a task list. None of them produce something you can point to at the end of the day. But over time, they are what determine whether your team thrives or struggles.\n\nHere's what should give you confidence if you're feeling uncertain right now.\n\nGreat management is not a personality trait. It's not something you either have or you don't.",
    },
    { id: 'b12', type: 'moment', text: 'Management is a skill. And it can be learned.' },
    {
      id: 'b13',
      type: 'avatar',
      direction: 'full screen',
      speech:
        "Nobody is born knowing how to run a one-on-one meeting, deliver a hard performance conversation, or delegate effectively. These are things you learn. The managers who struggle aren't the ones who lack talent. They're the ones who were never given the tools.\n\nThat's what's changing right now.\n\nBefore your promotion, a great day meant you finished your work and hit your numbers. In your new role, a great day is one where your team made progress, your people felt clear and supported, and you created the conditions for them to succeed.\n\nWhen you start measuring your success by the success of your team, everything changes.\n\nThat's the shift. That's the job.",
    },
    {
      id: 'b14',
      type: 'avatar',
      direction: 'full screen, direct close',
      speech:
        'In our next section, we’re going to tackle something that trips up nearly every new manager, what happens to your relationships, your friendships, and your professional identity when you become the boss.',
    },
  ],



  quiz: [
    {
      id: 'm1-r2-q1',
      kind: 'recall',
      source: '1.2',
      stem: "What is the main difference between a “doer” and a “leader”?",
      options: [
        {
          id: 'a',
          text: "A leader works fewer hours",
          correct: false,
          feedback: "Rarely true, and never the distinction.",
        },
        {
          id: 'b',
          text: "A doer gives feedback",
          correct: false,
          feedback: "Anyone can give feedback. It is not what separates the two roles.",
        },
        {
          id: 'c',
          text: "A leader enables others to succeed",
          correct: true,
          feedback: "Yes. A doer produces the work; a leader produces the conditions for it.",
        },
        {
          id: 'd',
          text: "A doer delegates everything",
          correct: false,
          feedback: "Delegating is the leader’s tool, and doing it wholesale is its own failure.",
        },
      ],
    },
    {
      id: 'm1-r2-q2',
      kind: 'recall',
      source: '1.2',
      stem: "Why can being a top performer sometimes hurt a new manager?",
      options: [
        {
          id: 'a',
          text: "They’re not trusted by others",
          correct: false,
          feedback: "Their track record usually buys them trust at the start. What it does not buy is patience.",
        },
        {
          id: 'b',
          text: "They may not relate to team struggles",
          correct: true,
          feedback: "Yes. What came easily to you is invisible to you, which makes it hard to coach.",
        },
        {
          id: 'c',
          text: "They’re used to working alone",
          correct: false,
          feedback: "Often true, but the deeper problem is the empathy gap rather than the habit.",
        },
        {
          id: 'd',
          text: "They prefer big-picture thinking",
          correct: false,
          feedback: "Top performers usually skew to detail. Either way it is not the trap here.",
        },
      ],
    },
    {
      id: 'm1-r2-q3',
      kind: 'recall',
      source: '1.2',
      stem: "Which lens should a leader begin using?",
      options: [
        {
          id: 'a',
          text: "Task-only lens",
          correct: false,
          feedback: "That is the lens you already have. It is the one that stops working.",
        },
        {
          id: 'b',
          text: "Control lens",
          correct: false,
          feedback: "Control is what a manager reaches for when the people lens is missing.",
        },
        {
          id: 'c',
          text: "People lens",
          correct: true,
          feedback: "Yes. The work still matters; it now arrives through people.",
        },
        {
          id: 'd',
          text: "Financial lens",
          correct: false,
          feedback: "Useful later, and not the shift this section is about.",
        },
      ],
    },
    {
      id: 'm1-r2-q4',
      kind: 'recall',
      source: '1.2',
      stem: "A common temptation for new managers is to:",
      options: [
        {
          id: 'a',
          text: "Avoid team members",
          correct: false,
          feedback: "It happens under pressure, but it is not the reflex most people fall into.",
        },
        {
          id: 'b',
          text: "Revert to doing the work themselves",
          correct: true,
          feedback: "Yes. It is faster, it is familiar, and it quietly teaches the team not to grow.",
        },
        {
          id: 'c',
          text: "Spend all day in meetings",
          correct: false,
          feedback: "A real hazard, and usually a symptom rather than the temptation itself.",
        },
        {
          id: 'd',
          text: "Take extra time off",
          correct: false,
          feedback: "Almost nobody’s first instinct in a new management role.",
        },
      ],
    },
    {
      id: 'm1-r2-q5',
      kind: 'recall',
      source: '1.2',
      stem: "The best managers focus on:",
      options: [
        {
          id: 'a',
          text: "Micromanagement",
          correct: false,
          feedback: "The opposite. Micromanagement is what fills the gap when trust has not been built.",
        },
        {
          id: 'b',
          text: "Controlling every outcome",
          correct: false,
          feedback: "You cannot control outcomes you do not personally produce.",
        },
        {
          id: 'c',
          text: "Coaching, building trust, and setting goals",
          correct: true,
          feedback: "Yes. All three produce results through other people rather than around them.",
        },
        {
          id: 'd',
          text: "Handling customer service directly",
          correct: false,
          feedback: "That is doing the work again, with a different label on it.",
        },
      ],
    },
    {
      id: 'm1-r2-q6',
      kind: 'recall',
      source: '1.2',
      stem: "“Letting go” means:",
      options: [
        {
          id: 'a',
          text: "Avoiding conflict",
          correct: false,
          feedback: "Avoidance is not letting go. It is postponing.",
        },
        {
          id: 'b',
          text: "Giving up leadership authority",
          correct: false,
          feedback: "You keep the accountability. What you hand over is the execution.",
        },
        {
          id: 'c',
          text: "Enabling others to own outcomes",
          correct: true,
          feedback: "Yes. Ownership is the thing being transferred, not just the task.",
        },
        {
          id: 'd',
          text: "Ignoring details",
          correct: false,
          feedback: "Letting go of the doing is not the same as losing track of the work.",
        },
      ],
    },
    {
      id: 'm1-r2-q7',
      kind: 'recall',
      source: '1.1',
      stem: "From Section 1.1: What hasn’t changed when you become a manager?",
      options: [
        {
          id: 'a',
          text: "Your ability to delegate",
          correct: false,
          feedback: "Delegation is a new demand, not a constant.",
        },
        {
          id: 'b',
          text: "Your team dynamics",
          correct: false,
          feedback: "These change the day the title does.",
        },
        {
          id: 'c',
          text: "Your standards and example",
          correct: true,
          feedback: "Yes. What you model still sets the bar, exactly as it did before.",
        },
        {
          id: 'd',
          text: "The size of your workload",
          correct: false,
          feedback: "It changes, and usually in both directions at once.",
        },
      ],
    },
    {
      id: 'm1-r2-q8',
      kind: 'recall',
      source: '1.4',
      stem: "From Section 1.1: What is emotional contagion?",
      options: [
        {
          id: 'a',
          text: "Burnout",
          correct: false,
          feedback: "Related, and a consequence rather than a definition.",
        },
        {
          id: 'b',
          text: "Motivation by praise",
          correct: false,
          feedback: "Praise is a tool. Contagion is not about tools.",
        },
        {
          id: 'c',
          text: "How your energy affects the team",
          correct: true,
          feedback: "Yes. Your mood transmits, whether or not you intend it to.",
        },
        {
          id: 'd',
          text: "Stress contagion only",
          correct: false,
          feedback: "It runs both ways. Calm is as catching as stress.",
        },
      ],
    },
    {
      id: 'm1-r2-q9',
      kind: 'recall',
      source: '1.2',
      stem: "One of the biggest shifts in management is:",
      options: [
        {
          id: 'a',
          text: "Losing job security",
          correct: false,
          feedback: "Not a shift the role introduces.",
        },
        {
          id: 'b',
          text: "Owning team outcomes",
          correct: true,
          feedback: "Yes. You are accountable for results you no longer personally produce.",
        },
        {
          id: 'c',
          text: "Gaining more independence",
          correct: false,
          feedback: "The job is more interdependent, not less.",
        },
        {
          id: 'd',
          text: "Decreasing task load",
          correct: false,
          feedback: "The task load usually rises before it changes shape.",
        },
      ],
    },
    {
      id: 'm1-r2-q10',
      kind: 'scenario',
      source: '1.2',
      stem: "Why is it important for managers to shift from task-focused to people-focused thinking?",
      options: [
        {
          id: 'a',
          text: "It increases their own productivity",
          correct: false,
          feedback: "Your own productivity is no longer the number that matters.",
        },
        {
          id: 'b',
          text: "It helps build a capable, independent team",
          correct: true,
          feedback: "Yes. A team that can operate without you is the actual output of the job.",
        },
        {
          id: 'c',
          text: "It saves time in meetings",
          correct: false,
          feedback: "A side effect at best, and not the reason.",
        },
        {
          id: 'd',
          text: "It reduces the need for accountability",
          correct: false,
          feedback: "It raises it. You are now accountable for other people’s results.",
        },
      ],
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
  ],
};
