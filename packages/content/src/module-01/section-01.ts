import { trueFalseOptions } from '../types.js';
import type { Section } from '../types.js';

/**
 * 1.1 — The Invisible Promotion
 * Script status: APPROVED & LOCKED (April 2026). Beats are verbatim.
 */
export const section01: Section = {
  id: 'm1-s1',
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
  /*
   * PUBLISH PENDING — rev55 has not been uploaded.
   *
   * The rev55 cut (1080x1920, 30fps, H.264/AAC, 2:54, captions burned in) is
   * meant to live at `m1/s1/rev55.mp4` in the `videos` bucket, which would
   * make it:
   *
   *   https://rhteswkgmndgijpllvjt.supabase.co/storage/v1/object/public/videos/m1/s1/rev55.mp4
   *
   * It is not written in below, because nothing has been uploaded to that
   * path: the file never arrived in the repo, there are no Supabase
   * credentials in this environment, and the host is blocked by the network
   * policy. Pointing `videoUrl` at an object that does not exist would take
   * the lesson from "last cut" to "broken player", so the previous cut stays
   * live until the upload actually happens.
   *
   * To publish: upload the file, move the URL below into `videoUrlPrev`, and
   * put the rev55 URL in `videoUrl`. The lesson page is already built for a
   * 9:16 source.
   */
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
        'https://rhteswkgmndgijpllvjt.supabase.co/storage/v1/object/sign/Audio/New%20Manager%20Success%20Module%201/m1-s1-b1.mp3?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wZTE3ZmRiMi02ZjYzLTQyOGUtODIxMS0wNjRiNTNhNzlkZDYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpby9OZXcgTWFuYWdlciBTdWNjZXNzIE1vZHVsZSAxL20xLXIxLWIxLm1wMyIsInNjb3BlIjoiZG93bmxvYWQiLCJpYXQiOjE3ODY0NzE5NTMsImV4cCI6MjEwMTgzMTk1M30.6tUwWxPTz00KeoP6HlU6lLPOYLtRjQ2fBotDGHwwAO8',
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
        'https://rhteswkgmndgijpllvjt.supabase.co/storage/v1/object/sign/Audio/New%20Manager%20Success%20Module%201/m1-s1-b3.mp3?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wZTE3ZmRiMi02ZjYzLTQyOGUtODIxMS0wNjRiNTNhNzlkZDYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpby9OZXcgTWFuYWdlciBTdWNjZXNzIE1vZHVsZSAxL20xLXIxLWIzLm1wMyIsInNjb3BlIjoiZG93bmxvYWQiLCJpYXQiOjE3ODY0NzIwMzYsImV4cCI6MjEwMTgzMjAzNn0.Yu46sSwH1S25fqulTPCGygOJpkchf8qDZRvYyzVcZFA',
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
        'https://rhteswkgmndgijpllvjt.supabase.co/storage/v1/object/sign/Audio/New%20Manager%20Success%20Module%201/m1-s1-b6.mp3?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wZTE3ZmRiMi02ZjYzLTQyOGUtODIxMS0wNjRiNTNhNzlkZDYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpby9OZXcgTWFuYWdlciBTdWNjZXNzIE1vZHVsZSAxL20xLXIxLWI2Lm1wMyIsInNjb3BlIjoiZG93bmxvYWQiLCJpYXQiOjE3ODY0NzIwNDksImV4cCI6MjEwMTgzMjA0OX0.GkexBiIs__7Qo2JptK0ngaoUvsmmrD0Eddu-e25rz0M',
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
        'https://rhteswkgmndgijpllvjt.supabase.co/storage/v1/object/sign/Audio/New%20Manager%20Success%20Module%201/m1-s1-b10.mp3?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wZTE3ZmRiMi02ZjYzLTQyOGUtODIxMS0wNjRiNTNhNzlkZDYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpby9OZXcgTWFuYWdlciBTdWNjZXNzIE1vZHVsZSAxL20xLXIxLWIxMC5tcDMiLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzg2NDcxOTc1LCJleHAiOjIxMDE4MzE5NzV9.zji5bXZ8j2S4vYPx4-PF4MBFcljm6IOD8WAaWb8URro',
    },
    {
      id: 'b11',
      type: 'overlay',
      text: 'Those skills can be learned. That’s what this program is for.',
      speech:
        "You're not behind. You're not failing. You're at the beginning of a new game, and now you know the rules are different.",
      audioUrl:
        'https://rhteswkgmndgijpllvjt.supabase.co/storage/v1/object/sign/Audio/New%20Manager%20Success%20Module%201/m1-s1-b11.mp3?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wZTE3ZmRiMi02ZjYzLTQyOGUtODIxMS0wNjRiNTNhNzlkZDYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpby9OZXcgTWFuYWdlciBTdWNjZXNzIE1vZHVsZSAxL20xLXIxLWIxMS5tcDMiLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzg2NDcxOTk4LCJleHAiOjIxMDE4MzE5OTh9.hVnM1g2Oik5Y3LLojYZ9JbjhrvkZUjFh-pvDvGdsW1Y',
    },
    {
      id: 'b12',
      type: 'avatar',
      direction: 'full screen, direct close',
      speech:
        "In the next section, we're going to dig into exactly why high performers often struggle the most when they step into management, and what the shift from doing to leading actually looks like in practice.\n\nLet's keep going.",
      audioUrl:
        'https://rhteswkgmndgijpllvjt.supabase.co/storage/v1/object/sign/Audio/New%20Manager%20Success%20Module%201/m1-s1-b12.mp3?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wZTE3ZmRiMi02ZjYzLTQyOGUtODIxMS0wNjRiNTNhNzlkZDYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBdWRpby9OZXcgTWFuYWdlciBTdWNjZXNzIE1vZHVsZSAxL20xLXIxLWIxMi5tcDMiLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzg2NDcyMDE0LCJleHAiOjIxMDE4MzIwMTR9.mbt10H91vhjmGyYxCygr1O-gz-wQ2wglpElAVGpf1_U',
    },
  ],




  contentAdditions: [
    {
      ref: 'A5',
      kind: 'field-note',
      where: 'Field Note, conditional on the Curveball answer',
      what: 'Four alternative prompts, one per Curveball choice, replacing the default prompt for anyone who answered.',
      reason:
        'The Curveball cost nothing: you picked, you read why, you scrolled on. Bringing the choice back at the end is the only place in a Section where a decision has a consequence, and it is the difference between a quiz about management and a rehearsal of it.',
      status: 'proposed',
    },
    {
      ref: 'A1',
      kind: 'gut-check',
      where: 'after b2',
      what: '"How much management training did you get before your first day?" Three options, no scoring.',
      reason:
        'Cards b1-b4 were four consecutive passive cards before the first Curveball. This also makes the learner state the premise of the Section in their own terms before the script argues it.',
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

  /**
   * The final cut's spoken script, verbatim.
   *
   * Em dashes are kept here, against the D7 deviation that removed them from
   * on-screen copy, because this is a record of words that were said rather
   * than copy anyone is reading as prose. Changing it would make the
   * transcript disagree with the audio.
   */
  transcript: `Congratulations on your promotion.

You've worked hard for this. You've been performing at a high level, and someone noticed. That's real, and it matters.

But here's what most people don't tell you when they hand you that new title:

The job you just accepted? Nobody actually trained you for it.

Most promotions into management follow the same pattern. A talented employee does exceptional work. Leadership notices. They get promoted — usually because they're the best at what they do.

And then they're handed a team, maybe a pay increase, and expected to figure out the rest. No roadmap. No instruction manual. No real preparation.

The title is visible. The new paycheck is visible. But the actual job description of "manager" — what it truly requires of you — that part is invisible. And you're expected to just... know.

Let's talk about what actually changed when you got promoted.

Before, your success depended almost entirely on you. Your effort, your skill, your output. You controlled it. If you worked harder or smarter, results improved. Simple equation.

Now? Your success depends on a group of people — people with different strengths, different motivations, and different ideas about what a productive day looks like. You can't do the work for them. You have to lead them to do it well.

That's a fundamentally different challenge. And most new managers walk into it believing at least one of these three things.

Myth #1: "I'll just do what my old manager did." Myth #2: "My team will respect me because of my track record." Myth #3: "I can still do my old job and manage at the same time."

All three of those will get you in trouble.

Your old manager's style was built for their context — not yours. Your track record impresses leadership, not necessarily your team. And trying to do both jobs at once usually means doing neither one well.

Here's what happens when a manager steps in without the right preparation.

Teams disengage. High performers start looking for the door. Productivity drops. Conflict increases. In a small business — every single one of these hits harder.

That's a significant responsibility. But it's also a significant opportunity — because when you get this right, you can build something remarkable.

Here's the reframe this entire program is built on.

You were promoted because you were great at your job. That's your starting point — not your finish line. The skills that made you an exceptional doer are different from the skills that will make you an exceptional manager.

You're not behind. You're not failing. You're at the beginning of a new game — and now you know the rules are different.

In the next section, we're going to dig into exactly why high performers often struggle the most when they step into management — and what the shift from doing to leading actually looks like in practice.

Let's keep going.`,

  /*
   * Section quiz, from the locked quiz standard: 3 multiple choice then 2
   * true/false, in this order. Not shuffled — the order is part of the
   * standard, and the two true/false questions are written to land after the
   * recall questions have already walked through the material.
   *
   * Question and option text is verbatim. Option feedback is ours: the
   * standard asks for one sentence per option and specifies that it must not
   * reach past what the section says, so every line below paraphrases the
   * transcript or the full-screen moment at b9 and nothing else.
   *
   * Ids are the standard's own (q1-q5) rather than the m1-s1-qN form used by
   * the other sections, because the standard names them.
   */
  quiz: [
    {
      id: 'q1',
      kind: 'recall',
      format: 'multiple_choice',
      source: '1.1',
      stem: 'What is the "invisible promotion"?',
      options: [
        {
          id: 'a',
          text: 'A promotion with no pay increase',
          correct: false,
          feedback: 'The section calls the new paycheck visible. It is the job description that is not.',
        },
        {
          id: 'b',
          text: 'A promotion that comes with a new title but no training or preparation for management',
          correct: true,
          feedback:
            'The title is visible and the paycheck is visible. What the job actually requires of you is the part nobody hands over.',
        },
        {
          id: 'c',
          text: 'A promotion announced internally but not publicly',
          correct: false,
          feedback: 'What is invisible is the job description, not the announcement.',
        },
        {
          id: 'd',
          text: 'A promotion given to an employee without their prior knowledge',
          correct: false,
          feedback: 'The promotion itself is known. The training and preparation are what go missing.',
        },
      ],
    },
    {
      id: 'q2',
      kind: 'recall',
      format: 'multiple_choice',
      source: '1.1',
      stem: 'Which of the following is NOT one of the three myths discussed about new managers?',
      options: [
        {
          id: 'a',
          text: `"I'll just do what my old manager did."`,
          correct: false,
          feedback: `This is myth #1. Your old manager's style was built for their context, not yours.`,
        },
        {
          id: 'b',
          text: '"I need to read every management book before I start."',
          correct: true,
          feedback:
            'The three myths are the old manager’s style, the track record, and doing both jobs at once. Reading is not one of them.',
        },
        {
          id: 'c',
          text: '"My team will respect me because of my track record."',
          correct: false,
          feedback: 'This is myth #2. Your track record impresses leadership, not necessarily your team.',
        },
        {
          id: 'd',
          text: `"I can still do my old job and manage at the same time."`,
          correct: false,
          feedback: 'This is myth #3. Doing both jobs at once usually means doing neither one well.',
        },
      ],
    },
    {
      id: 'q3',
      kind: 'recall',
      format: 'multiple_choice',
      source: '1.1',
      stem: 'According to the section, what is the most common reason employees leave their jobs?',
      options: [
        {
          id: 'a',
          text: 'Better pay elsewhere',
          correct: false,
          feedback: 'The section puts the manager ahead of pay.',
        },
        {
          id: 'b',
          text: 'Lack of advancement opportunities',
          correct: false,
          feedback: 'The section puts the manager ahead of advancement.',
        },
        {
          id: 'c',
          text: 'Their manager',
          correct: true,
          feedback: 'The section’s line is that employees do not quit companies, they quit managers.',
        },
        {
          id: 'd',
          text: 'Poor work-life balance',
          correct: false,
          feedback: 'The section puts the manager ahead of workload and balance.',
        },
      ],
    },
    {
      id: 'q4',
      kind: 'recall',
      format: 'true_false',
      source: '1.1',
      stem: 'Your past performance as an individual contributor guarantees your team will respect you as their new manager.',
      options: trueFalseOptions(false, {
        whenTrue: 'Your track record impresses leadership, not necessarily your team.',
        whenFalse: 'Your track record impresses leadership, not necessarily your team.',
      }),
    },
    {
      id: 'q5',
      kind: 'recall',
      format: 'true_false',
      source: '1.1',
      stem: 'The skills that make someone a great individual contributor are different from the skills required to be a great manager.',
      options: trueFalseOptions(true, {
        whenTrue:
          'The skills that made you an exceptional doer are different from the skills that make you an exceptional manager.',
        whenFalse:
          'The skills that made you an exceptional doer are different from the skills that make you an exceptional manager.',
      }),
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
