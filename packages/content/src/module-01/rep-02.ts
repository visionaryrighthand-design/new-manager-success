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
        "There's an uncomfortable truth that most organizations never talk about when they promote someone into management.\n\nThe very things that made you exceptional as an individual contributor — your speed, your technical expertise, your ability to get things done — those same qualities can work directly against you as a manager.\n\nNot because they're bad qualities. They're not. But the job has fundamentally changed, and the tools that worked in your old role don't fit the new one.",
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
      text: 'Task Leadership — you are measured by what YOU produce.',
      speech: "That's task leadership. And you were exceptional at it.",
    },
    {
      id: 'b4',
      type: 'overlay',
      text: 'People Leadership — you are measured by what your TEAM produces.',
      speech:
        "People leadership is a different game entirely. Your value is no longer in what you personally produce — it's in what you help your team produce. Your job is not to be the best at the work. Your job is to create the conditions where your team can do their best work.",
    },
    {
      id: 'b5',
      type: 'avatar',
      direction: 'full screen',
      speech:
        "That shift — from doing to enabling — is the single most important transition you will make as a manager.\n\nAnd here's what happens when new managers don't make it. They keep doing. They jump in when things get complicated. They solve problems their team should be solving. They take work back because it's just easier to do it themselves.\n\nWe call this the doer trap. And it creates three problems simultaneously.",
    },
    {
      id: 'b6',
      type: 'buildList',
      direction: 'avatar steps back, items build on screen',
      items: [
        'Problem 1: It creates a bottleneck — everything runs through you.',
        'Problem 2: It stunts your team’s growth — they learn by doing, not watching.',
        'Problem 3: It signals you don’t trust them — and a team that feels untrusted stops giving their best.',
      ],
    },
    { id: 'b7', type: 'hold', text: 'All three visible' },
    {
      id: 'b8',
      type: 'avatar',
      direction: 'full screen',
      speech: "So if great managers aren't doing the work — what are they doing?",
    },
    {
      id: 'b9',
      type: 'buildList',
      direction: 'avatar steps back, items build on screen',
      items: [
        'Building clarity — everyone knows what success looks like.',
        'Removing obstacles — clearing the path so their team can perform.',
        'Developing people — coaching, feedback, growth conversations.',
        'Making decisions — priorities, resources, when to step in and when to step back.',
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
        "Nobody is born knowing how to run a one-on-one meeting, deliver a hard performance conversation, or delegate effectively. These are things you learn. The managers who struggle aren't the ones who lack talent — they're the ones who were never given the tools.\n\nThat's what's changing right now.\n\nBefore your promotion, a great day meant you finished your work and hit your numbers. In your new role, a great day is one where your team made progress, your people felt clear and supported, and you created the conditions for them to succeed.\n\nWhen you start measuring your success by the success of your team — everything changes.\n\nThat's the shift. That's the job.",
    },
    {
      id: 'b14',
      type: 'avatar',
      direction: 'full screen, direct close',
      speech:
        'In our next section, we’re going to tackle something that trips up nearly every new manager — what happens to your relationships, your friendships, and your professional identity when you become the boss.',
    },
  ],

  curveballs: [
    {
      id: 'm1-r2-cb1',
      triggerAfterBeat: 'b7',
      skill: 'Resisting the doer trap under time pressure',
      scenario:
        'A client deliverable is due at 5pm. Your newest team member has been working on it for two days and it is about sixty percent of the quality you would produce. It is 2pm.',
      prompt: 'What do you do?',
      choices: [
        {
          id: 'a',
          text: 'Take it back and finish it yourself. The client deadline is real.',
          verdict: 'costly',
          response:
            'The deliverable ships and you have taught them that struggling gets the work removed. Do this three times and you own every hard task on the team permanently. This is the bottleneck forming in real time.',
        },
        {
          id: 'b',
          text: 'Sit with them for thirty minutes, name the two specific gaps, and let them close them.',
          verdict: 'best',
          response:
            'You protect the deadline and the development at once. Naming two specific gaps — not twelve — is what makes this fit in the time you actually have.',
        },
        {
          id: 'c',
          text: 'Send it as-is. They will learn from the client feedback.',
          verdict: 'costly',
          response:
            'Letting someone fail in front of a client is not coaching, it is abdication. Your job is to remove obstacles, and “I did not know what good looked like” is an obstacle you could have removed.',
        },
        {
          id: 'd',
          text: 'Ask the client for a one-day extension so they can finish it properly.',
          verdict: 'workable',
          response:
            'Sometimes right, often overused. Buying time is a real tool, but if it becomes your default the team never learns to work to a deadline. Ask yourself whether the extra day teaches anything the extra thirty minutes would not.',
        },
      ],
    },
  ],

  fieldNote: {
    id: 'm1-r2-fn1',
    topic: 'The doer trap',
    prompt:
      'Name one task you are still doing yourself that somebody on your team could be doing. What is actually stopping you from handing it over?',
    placeholder: 'Be honest about the second part — that is where the useful answer is.',
    suggestedMinChars: 80,
  },

  quiz: [
    {
      id: 'm1-r2-q1',
      kind: 'recall',
      source: '1.2',
      stem: 'What is the difference between task leadership and people leadership?',
      options: [
        {
          id: 'a',
          text: 'Task leadership is for junior staff; people leadership is for senior staff.',
          correct: false,
          feedback: 'It is not a seniority distinction. It is a measurement distinction.',
        },
        {
          id: 'b',
          text: 'In task leadership you are measured by what you produce; in people leadership you are measured by what your team produces.',
          correct: true,
          feedback:
            'That single change in what gets measured is the whole transition.',
        },
        {
          id: 'c',
          text: 'Task leadership is about processes; people leadership is about being liked.',
          correct: false,
          feedback:
            'Being liked is explicitly not the goal — section 1.3 takes that apart.',
        },
        {
          id: 'd',
          text: 'They are two names for the same thing.',
          correct: false,
          feedback: 'They are different jobs measured in different ways.',
        },
      ],
    },
    {
      id: 'm1-r2-q2',
      kind: 'recall',
      source: '1.2',
      stem: 'Which is NOT one of the three problems the doer trap creates?',
      options: [
        {
          id: 'a',
          text: 'It creates a bottleneck — everything runs through you.',
          correct: false,
          feedback: 'That is problem 1.',
        },
        {
          id: 'b',
          text: 'It stunts your team’s growth.',
          correct: false,
          feedback: 'That is problem 2.',
        },
        {
          id: 'c',
          text: 'It signals you don’t trust them.',
          correct: false,
          feedback: 'That is problem 3.',
        },
        {
          id: 'd',
          text: 'It makes the work take longer overall.',
          correct: true,
          feedback:
            'Correct — and note that in the short term the doer trap often makes work faster. That is exactly why it is a trap.',
        },
      ],
    },
    {
      id: 'm1-r2-q3',
      kind: 'scenario',
      source: '1.2',
      stem: 'You end a day having personally fixed three problems your team brought you. Every one is now resolved. How should you read that day?',
      options: [
        {
          id: 'a',
          text: 'A strong day. Three problems solved is three problems solved.',
          correct: false,
          feedback:
            'It felt like a strong day — that is the pull of the doer trap. Look at what your team learned from those three problems.',
        },
        {
          id: 'b',
          text: 'A warning sign. Three problems came to you rather than being solved by the people who own them.',
          correct: true,
          feedback:
            'The question is not whether the problems got solved. It is whether the next three will need you too.',
        },
        {
          id: 'c',
          text: 'Neutral. Problem-solving is a core manager responsibility.',
          correct: false,
          feedback:
            'Deciding is a core responsibility. Doing the fixing yourself, repeatedly, is the bottleneck.',
        },
        {
          id: 'd',
          text: 'A strong day, as long as you documented the fixes.',
          correct: false,
          feedback: 'Documentation helps, but it does not address who is doing the solving.',
        },
      ],
    },
  ],
};
