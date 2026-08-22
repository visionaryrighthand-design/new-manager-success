import type { Rep } from '../types.js';

/**
 * 1.1 — The Invisible Promotion
 * Script status: APPROVED & LOCKED (April 2026). Beats are verbatim.
 */
export const rep01: Rep = {
  id: 'm1-r1',
  moduleNumber: 1,
  index: 1,
  number: '1.1',
  title: 'The Invisible Promotion',
  durationMinutes: 7,
  spokenWordCount: 780,
  scriptStatus: 'approved-locked',
  hook: 'Nobody trained you for the job you just accepted.',
  keyIdea:
    'Most managers are promoted without preparation. That gap is real, and it is fixable.',
  topics: ['promotion transition', 'manager expectations', 'why new managers struggle'],
  videoUrl:
    'https://rhteswkgmndgijpllvjt.supabase.co/storage/v1/object/public/videos/Heygen%20vids%200822/M1.1_The%20Invisible%20Promotion.mp4',

  beats: [
    {
      id: 'b1',
      type: 'avatar',
      direction: 'full screen, direct to camera',
      speech:
        "Congratulations on your promotion.\n\nYou've worked hard for this. You've been performing at a high level, and someone noticed. That's real, and it matters.\n\nBut here's what most people don't tell you when they hand you that new title:\n\nThe job you just accepted? Nobody actually trained you for it.",
      // Signed URL against a private bucket. It works, but see the hosting
      // note in NARRATION_PRODUCTION.md — every learner has to read this file
      // anyway, so a public bucket is the simpler shape and drops the token.
      audioUrl:
        'https://rhteswkgmndgijpllvjt.supabase.co/storage/v1/object/sign/Audio/New%20Manager%20Success%20Module%201/m1-r1-b1.mp3?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wZTE3ZmRiMi02ZjYzLTQyOGUtODIxMS0wNjRiNTNhNzlkZDYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpby9OZXcgTWFuYWdlciBTdWNjZXNzIE1vZHVsZSAxL20xLXIxLWIxLm1wMyIsInNjb3BlIjoiZG93bmxvYWQiLCJpYXQiOjE3ODY0NzE5NTMsImV4cCI6MjEwMTgzMTk1M30.6tUwWxPTz00KeoP6HlU6lLPOYLtRjQ2fBotDGHwwAO8',
    },
    {
      // A reading card by decision, not by omission — see the note on
      // BeatType.reading. The copy is the locked script's, unchanged; only the
      // mode of delivery differs, so this is a production choice rather than a
      // ScriptDeviation. No footage is expected for it.
      id: 'b2',
      type: 'reading',
      text: 'The Invisible Promotion',
      speech:
        "Most promotions into management follow the same pattern. A talented employee does exceptional work. Leadership notices. They get promoted, usually because they're the best at what they do.\n\nAnd then they're handed a team, maybe a pay increase, and expected to figure out the rest. No roadmap. No instruction manual. No real preparation.\n\nThe title is visible. The new paycheck is visible. But the actual job description of “manager” (what it truly requires of you): that part is invisible. And you're expected to just... know.",
    },
    {
      id: 'b3',
      type: 'avatar',
      direction: 'full screen',
      speech:
        "Let's talk about what actually changed when you got promoted.\n\nBefore, your success depended almost entirely on you. Your effort, your skill, your output. You controlled it. If you worked harder or smarter, results improved. Simple equation.\n\nNow? Your success depends on a group of people: people with different strengths, different motivations, and different ideas about what a productive day looks like. You can't do the work for them. You have to lead them to do it well.\n\nThat's a fundamentally different challenge. And most new managers walk into it believing at least one of these three things.",
      audioUrl:
        'https://rhteswkgmndgijpllvjt.supabase.co/storage/v1/object/sign/Audio/New%20Manager%20Success%20Module%201/m1-r1-b3.mp3?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wZTE3ZmRiMi02ZjYzLTQyOGUtODIxMS0wNjRiNTNhNzlkZDYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpby9OZXcgTWFuYWdlciBTdWNjZXNzIE1vZHVsZSAxL20xLXIxLWIzLm1wMyIsInNjb3BlIjoiZG93bmxvYWQiLCJpYXQiOjE3ODY0NzIwMzYsImV4cCI6MjEwMTgzMjAzNn0.Yu46sSwH1S25fqulTPCGygOJpkchf8qDZRvYyzVcZFA',
    },
    {
      id: 'b4',
      type: 'buildList',
      direction: 'avatar steps back, items build on screen one by one',
      items: [
        'Myth #1: “I’ll just do what my old manager did.”',
        'Myth #2: “My team will respect me because of my track record.”',
        'Myth #3: “I can still do my old job and manage at the same time.”',
      ],
    },
    { id: 'b5', type: 'hold', text: 'All three visible' },
    {
      id: 'b6',
      type: 'avatar',
      direction: 'full screen',
      speech:
        "All three of those will get you in trouble.\n\nYour old manager's style was built for their context, not yours. Your track record impresses leadership, not necessarily your team. And trying to do both jobs at once usually means doing neither one well.\n\nHere's what happens when a manager steps in without the right preparation.",
      audioUrl:
        'https://rhteswkgmndgijpllvjt.supabase.co/storage/v1/object/sign/Audio/New%20Manager%20Success%20Module%201/m1-r1-b6.mp3?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wZTE3ZmRiMi02ZjYzLTQyOGUtODIxMS0wNjRiNTNhNzlkZDYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpby9OZXcgTWFuYWdlciBTdWNjZXNzIE1vZHVsZSAxL20xLXIxLWI2Lm1wMyIsInNjb3BlIjoiZG93bmxvYWQiLCJpYXQiOjE3ODY0NzIwNDksImV4cCI6MjEwMTgzMjA0OX0.GkexBiIs__7Qo2JptK0ngaoUvsmmrD0Eddu-e25rz0M',
    },
    {
      id: 'b7',
      type: 'buildList',
      direction: 'avatar steps back, items build on screen',
      items: [
        'Teams disengage.',
        'High performers start looking for the door.',
        'Productivity drops. Conflict increases.',
        'In a small business, every single one of these hits harder.',
      ],
    },
    { id: 'b8', type: 'hold', text: 'All four visible' },
    {
      id: 'b9',
      type: 'moment',
      text: 'Employees don’t quit companies. They quit managers.',
    },
    {
      id: 'b10',
      type: 'avatar',
      direction: 'full screen',
      speech:
        "That's a significant responsibility. But it's also a significant opportunity, because when you get this right, you can build something remarkable.\n\nHere's the reframe this entire program is built on.\n\nYou were promoted because you were great at your job. That's your starting point, not your finish line. The skills that made you an exceptional doer are different from the skills that will make you an exceptional manager.",
      audioUrl:
        'https://rhteswkgmndgijpllvjt.supabase.co/storage/v1/object/sign/Audio/New%20Manager%20Success%20Module%201/m1-r1-b10.mp3?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wZTE3ZmRiMi02ZjYzLTQyOGUtODIxMS0wNjRiNTNhNzlkZDYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpby9OZXcgTWFuYWdlciBTdWNjZXNzIE1vZHVsZSAxL20xLXIxLWIxMC5tcDMiLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzg2NDcxOTc1LCJleHAiOjIxMDE4MzE5NzV9.zji5bXZ8j2S4vYPx4-PF4MBFcljm6IOD8WAaWb8URro',
    },
    {
      id: 'b11',
      type: 'overlay',
      text: 'Those skills can be learned. That’s what this program is for.',
      speech:
        "You're not behind. You're not failing. You're at the beginning of a new game, and now you know the rules are different.",
      audioUrl:
        'https://rhteswkgmndgijpllvjt.supabase.co/storage/v1/object/sign/Audio/New%20Manager%20Success%20Module%201/m1-r1-b11.mp3?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wZTE3ZmRiMi02ZjYzLTQyOGUtODIxMS0wNjRiNTNhNzlkZDYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpby9OZXcgTWFuYWdlciBTdWNjZXNzIE1vZHVsZSAxL20xLXIxLWIxMS5tcDMiLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzg2NDcxOTk4LCJleHAiOjIxMDE4MzE5OTh9.hVnM1g2Oik5Y3LLojYZ9JbjhrvkZUjFh-pvDvGdsW1Y',
    },
    {
      id: 'b12',
      type: 'avatar',
      direction: 'full screen, direct close',
      speech:
        "In the next section, we're going to dig into exactly why high performers often struggle the most when they step into management, and what the shift from doing to leading actually looks like in practice.\n\nLet's keep going.",
      audioUrl:
        'https://rhteswkgmndgijpllvjt.supabase.co/storage/v1/object/sign/Audio/New%20Manager%20Success%20Module%201/m1-r1-b12.mp3?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wZTE3ZmRiMi02ZjYzLTQyOGUtODIxMS0wNjRiNTNhNzlkZDYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpby9OZXcgTWFuYWdlciBTdWNjZXNzIE1vZHVsZSAxL20xLXIxLWIxMi5tcDMiLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzg2NDcyMDE0LCJleHAiOjIxMDE4MzIwMTR9.mbt10H91vhjmGyYxCygr1O-gz-wQ2wglpElAVGpf1_U',
    },
  ],




  contentAdditions: [
    {
      ref: 'A5',
      kind: 'field-note',
      where: 'Field Note, conditional on the Curveball answer',
      what: 'Four alternative prompts, one per Curveball choice, replacing the default prompt for anyone who answered.',
      reason:
        'The Curveball cost nothing: you picked, you read why, you scrolled on. Bringing the choice back at the end is the only place in a Rep where a decision has a consequence, and it is the difference between a quiz about management and a rehearsal of it.',
      status: 'proposed',
    },
    {
      ref: 'A1',
      kind: 'gut-check',
      where: 'after b2',
      what: '"How much management training did you get before your first day?" Three options, no scoring.',
      reason:
        'Cards b1-b4 were four consecutive passive cards before the first Curveball. This also makes the learner state the premise of the Rep in their own terms before the script argues it.',
      status: 'proposed',
    },
    {
      ref: 'A2',
      kind: 'gut-check',
      where: 'after b9',
      what: '"Think of a manager you left, or nearly left. What tipped it?" Three options, no scoring.',
      reason:
        'The back half ran six passive cards. Landing this immediately after "Employees do not quit companies, they quit managers" turns the claim into the learner\u2019s own memory rather than an assertion.',
      status: 'proposed',
    },
  ],

  quiz: [
    {
      id: 'm1-r1-q1',
      kind: 'recall',
      source: '1.1',
      stem: "What is the “invisible promotion”?",
      options: [
        {
          id: 'a',
          text: "A secret internal promotion process",
          correct: false,
          feedback: "Nothing secret about it. What is hidden is the job description, not the process.",
        },
        {
          id: 'b',
          text: "A shift in responsibility without formal training",
          correct: true,
          feedback: "Yes. The title and the pay are visible. What the job actually requires of you is the part nobody spells out.",
        },
        {
          id: 'c',
          text: "A raise without a title",
          correct: false,
          feedback: "The money is the visible part. It is the expectations that go unstated.",
        },
        {
          id: 'd',
          text: "A temporary leadership assignment",
          correct: false,
          feedback: "The promotion is real and permanent. It is the preparation that is missing.",
        },
      ],
    },
    {
      id: 'm1-r1-q2',
      kind: 'recall',
      source: '1.1',
      stem: "What is a key mindset shift for new managers?",
      options: [
        {
          id: 'a',
          text: "Doing more of the same work",
          correct: false,
          feedback: "That is the doer trap. More of your old work is the one thing the new job does not need.",
        },
        {
          id: 'b',
          text: "Delegating all tasks immediately",
          correct: false,
          feedback: "Handing everything over on day one is disposal, not delegation.",
        },
        {
          id: 'c',
          text: "Managing performance through others",
          correct: true,
          feedback: "Yes. Your results now arrive through other people rather than from your own hands.",
        },
        {
          id: 'd',
          text: "Becoming friends with team members",
          correct: false,
          feedback: "The goal is to be trusted and respected. Friendship is not the mechanism.",
        },
      ],
    },
    {
      id: 'm1-r1-q3',
      kind: 'recall',
      source: '1.1',
      stem: "Which of the following does NOT typically change when you become a manager?",
      options: [
        {
          id: 'a',
          text: "Your personal work ethic",
          correct: true,
          feedback: "Correct. Your standards and your example come with you. Almost everything else about the job changes.",
        },
        {
          id: 'b',
          text: "The amount of responsibility",
          correct: false,
          feedback: "This changes immediately, and usually more than people expect.",
        },
        {
          id: 'c',
          text: "The way your success is measured",
          correct: false,
          feedback: "This changes completely: you are now measured by your team’s output.",
        },
        {
          id: 'd',
          text: "Your need to support others",
          correct: false,
          feedback: "This changes too. Supporting others goes from optional to the core of the role.",
        },
      ],
    },
    {
      id: 'm1-r1-q4',
      kind: 'recall',
      source: '1.1',
      stem: "What are you primarily responsible for as a manager?",
      options: [
        {
          id: 'a',
          text: "Completing your tasks efficiently",
          correct: false,
          feedback: "Still useful, no longer the point. Your task list is not what you are judged on now.",
        },
        {
          id: 'b',
          text: "Making sure others get results",
          correct: true,
          feedback: "Yes. That is the whole shift, and it is why the old skills stop being enough.",
        },
        {
          id: 'c',
          text: "Managing customer relationships directly",
          correct: false,
          feedback: "Part of some roles, but not what defines the job of managing.",
        },
        {
          id: 'd',
          text: "Reporting performance only",
          correct: false,
          feedback: "Reporting is a by-product. Producing the performance through others is the job.",
        },
      ],
    },
    {
      id: 'm1-r1-q5',
      kind: 'recall',
      source: '1.1',
      stem: "What can feel disorienting about becoming a new manager?",
      options: [
        {
          id: 'a',
          text: "Less autonomy",
          correct: false,
          feedback: "Most new managers get more latitude, not less. That is part of what makes it disorienting.",
        },
        {
          id: 'b',
          text: "Being excluded from team conversations",
          correct: false,
          feedback: "It happens, and it stings, but it is a symptom rather than the main disorientation.",
        },
        {
          id: 'c',
          text: "New expectations without clear instructions",
          correct: true,
          feedback: "Yes. High expectations arrive with no manual, which is exactly the invisible promotion.",
        },
        {
          id: 'd',
          text: "Traveling more",
          correct: false,
          feedback: "Role-specific, and not what makes the transition hard.",
        },
      ],
    },
    {
      id: 'm1-r1-q6',
      kind: 'recall',
      source: '1.1',
      stem: "What remains a key part of your effectiveness as a leader?",
      options: [
        {
          id: 'a',
          text: "Perfectionism",
          correct: false,
          feedback: "Perfectionism scales badly across a team. It was never the thing that made you effective.",
        },
        {
          id: 'b',
          text: "Independence",
          correct: false,
          feedback: "The job is now interdependent by definition.",
        },
        {
          id: 'c',
          text: "Reputation and example",
          correct: true,
          feedback: "Yes. What you model becomes the standard, and that carries over from your old role intact.",
        },
        {
          id: 'd',
          text: "Avoiding mistakes",
          correct: false,
          feedback: "A team that never sees a mistake handled well learns to hide their own.",
        },
      ],
    },
    {
      id: 'm1-r1-q7',
      kind: 'recall',
      source: '1.1',
      stem: "Which of the following best describes a successful transition into management?",
      options: [
        {
          id: 'a',
          text: "Taking on more individual tasks",
          correct: false,
          feedback: "That is moving in the wrong direction, however productive it feels.",
        },
        {
          id: 'b',
          text: "Focusing only on top performers",
          correct: false,
          feedback: "Your top performers need the least from you. It is the rest of the team that moves the number.",
        },
        {
          id: 'c',
          text: "Building a team that can execute",
          correct: true,
          feedback: "Yes. Success is a team that produces without you doing the producing.",
        },
        {
          id: 'd',
          text: "Keeping things the way they were",
          correct: false,
          feedback: "Nothing is the way it was. Behaving as though it is costs you the first few months.",
        },
      ],
    },
    {
      id: 'm1-r1-q8',
      kind: 'recall',
      source: '1.1',
      stem: "Your team begins looking to you for ________.",
      options: [
        {
          id: 'a',
          text: "Overtime approvals",
          correct: false,
          feedback: "Administrative, and the least of what they need from you.",
        },
        {
          id: 'b',
          text: "Social direction",
          correct: false,
          feedback: "You set the tone, but that is not what they come to you for.",
        },
        {
          id: 'c',
          text: "Answers, decisions, and direction",
          correct: true,
          feedback: "Yes, and often before you feel ready to give any of the three.",
        },
        {
          id: 'd',
          text: "Personal feedback",
          correct: false,
          feedback: "They need feedback from you, not for you.",
        },
      ],
    },
    {
      id: 'm1-r1-q9',
      kind: 'recall',
      source: '1.1',
      stem: "A challenge for many new managers is:",
      options: [
        {
          id: 'a',
          text: "Having too much time to think",
          correct: false,
          feedback: "Almost nobody reports this in their first ninety days.",
        },
        {
          id: 'b',
          text: "Getting a larger office",
          correct: false,
          feedback: "Not a challenge, and increasingly not a thing.",
        },
        {
          id: 'c',
          text: "Balancing old responsibilities with new ones",
          correct: true,
          feedback: "Yes. The old work rarely gets reassigned on schedule, and it is the easier work, which is what makes it tempting.",
        },
        {
          id: 'd',
          text: "Over-delegating",
          correct: false,
          feedback: "The far more common failure is delegating too little, too late.",
        },
      ],
    },
    {
      id: 'm1-r1-q10',
      kind: 'recall',
      source: '1.1',
      stem: "Which of the following would help reinforce the new manager mindset?",
      options: [
        {
          id: 'a',
          text: "Doing more technical work",
          correct: false,
          feedback: "Comfortable, and a retreat into the job you already had.",
        },
        {
          id: 'b',
          text: "Leading by example and coaching others",
          correct: true,
          feedback: "Yes. Both are the new job rather than the old one done harder.",
        },
        {
          id: 'c',
          text: "Avoiding conflict",
          correct: false,
          feedback: "Avoided conflict does not disappear. It compounds.",
        },
        {
          id: 'd',
          text: "Waiting for instructions",
          correct: false,
          feedback: "Nobody is coming with them. That is the premise of this whole section.",
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
