import type { Rep } from '../types.js';

/**
 * 1.7 — Leading by Example and Acting Like an Owner
 * Script status: APPROVED & LOCKED (April 2026). Beats are verbatim.
 *
 * "Servant Leadership" is retained as written. It is a descriptive concept in
 * general use (Greenleaf, 1970) with no live registration blocking descriptive
 * use in training content — logged under § Cleared in the IP punch list rather
 * than as a deviation.
 */
export const rep07: Rep = {
  id: 'm1-r7',
  moduleNumber: 1,
  index: 7,
  number: '1.7',
  title: 'Leading by Example and Acting Like an Owner',
  durationMinutes: 7,
  spokenWordCount: 790,
  scriptStatus: 'approved-locked',
  hook: 'Your team is not listening to what you say nearly as much as they are watching what you do.',
  keyIdea: 'Your team will not do what you say. They will do what you do.',
  topics: ['leading by example', 'consistency', 'ownership', 'servant leadership', 'culture'],

  beats: [
    {
      id: 'b1',
      type: 'avatar',
      direction: 'full screen, direct to camera',
      speech:
        'Your team is not listening to what you say nearly as much as they are watching what you do.\n\nThis is one of the most important things to understand about leadership, and one of the most humbling.\n\nYou can give the best speech about accountability. You can put up a poster about team values. You can talk all day about the standards you expect.\n\nBut if your behavior doesn’t match your words, your team will follow your behavior. Every single time.',
    },
    { id: 'b2', type: 'moment', text: 'Your team will not do what you say. They will do what you do.' },
    {
      id: 'b3',
      type: 'avatar',
      direction: 'full screen',
      speech:
        "Leading by example is not about being perfect. It's not about never making mistakes or always having the right answer.\n\nIt's about being consistent. Showing up the same way on a tough Tuesday as you do on a great Friday. Holding yourself to the same standards you hold your team. And being visible about it.\n\nWhen you're running five minutes late to a meeting you've told your team to always be on time for, they notice. When you skip the process you told everyone to follow because you're in a hurry, they notice. When you talk about transparency but keep your team in the dark, they notice.\n\nCredibility is earned through alignment between what you say and what you do. And it is lost fast when those two things don't match.",
    },
    {
      id: 'b4',
      type: 'avatar',
      direction: 'full screen',
      speech:
        "Now let's talk about what it means to act like an owner, because this concept is especially powerful in a small business.",
    },
    {
      id: 'b5',
      type: 'overlay',
      text: 'Acting Like an Owner',
      speech:
        "Acting like an owner doesn't mean you have equity in the business or that you make every decision. It means you think beyond your immediate task. You care about outcomes, not just outputs. You treat the business's resources (time, money, people) with the same respect you'd give them if they were your own.\n\nHere's what that actually looks like day to day.",
    },
    {
      id: 'b6',
      type: 'buildList',
      direction: 'avatar steps back, items build on screen',
      items: [
        'You don’t wait to be told what needs to be done. You see it and you address it.',
        'You think about impact, not just activity. Busy is not the same as effective.',
        'You protect the team’s time and energy like they matter, because they do.',
        'You take responsibility for outcomes, not just effort.',
      ],
    },
    { id: 'b7', type: 'hold', text: 'All four visible' },
    {
      id: 'b8',
      type: 'avatar',
      direction: 'full screen',
      speech:
        "There's a concept in leadership called Servant Leadership, and it connects directly to everything we've been talking about.\n\nThe idea is simple. Your job as a manager is not to be served by your team. Your job is to serve your team. To remove the obstacles in their path. To give them what they need to do their best work. To put their development and success at the center of what you do.",
    },
    {
      id: 'b9',
      type: 'overlay',
      text: 'Servant Leadership, your job is to clear the path, not stand in it.',
    },
    {
      id: 'b10',
      type: 'avatar',
      direction: 'full screen',
      speech:
        "This might feel counterintuitive. You just got promoted, shouldn't the team be supporting you?\n\nHere's the reframe. The team supporting you means your team performs well. And your team performs well when you are genuinely invested in helping them succeed. That's how it compounds.\n\nThe managers who spend their energy protecting their authority, hoarding information, and making sure everyone knows who's in charge, their teams underperform. The managers who spend their energy enabling, developing, and clearing the path for their people: those teams are the ones that get results.",
    },
    {
      id: 'b11',
      type: 'avatar',
      direction: 'full screen',
      speech:
        "Let's close Module 1 with this.\n\nThe first ninety days you spend as a manager will set patterns that are very hard to undo. The culture you build, or allow, in those early weeks becomes the baseline your team operates from.",
    },
    {
      id: 'b12',
      type: 'buildList',
      direction: 'avatar steps back, items build on screen',
      items: [
        'What you model becomes the standard.',
        'What you tolerate becomes the norm.',
        'What you reward shapes the behavior you get more of.',
        'What you ignore tells your team what doesn’t actually matter.',
      ],
    },
    { id: 'b13', type: 'hold', text: 'All four visible' },
    {
      id: 'b14',
      type: 'avatar',
      direction: 'full screen, direct close',
      speech:
        'You are not just managing tasks or people. You are shaping a culture, whether you realize it or not.\n\nDo it deliberately. Do it consistently. And do it in a way that the people on your team will look back on and say. That’s the kind of manager I want to be someday.\n\nThat’s what this is all about.\n\nComing up next, your Module 1 review. We’re going to pull all seven sections together and make sure the key ideas are locked in before you move forward.',
    },
  ],



  quiz: [
    {
      id: 'm1-r7-q1',
      kind: 'recall',
      source: '1.7',
      stem: 'What does “acting like an owner” mean in this section?',
      options: [
        {
          id: 'a',
          text: 'Having equity in the business.',
          correct: false,
          feedback: 'Explicitly ruled out. It is not about ownership stake.',
        },
        {
          id: 'b',
          text: 'Making every decision yourself.',
          correct: false,
          feedback: 'Also explicitly ruled out.',
        },
        {
          id: 'c',
          text: 'Thinking beyond your immediate task and treating the business’s resources as if they were your own.',
          correct: true,
          feedback: 'Caring about outcomes, not just outputs. Impact, not activity.',
        },
        {
          id: 'd',
          text: 'Taking on more work than anyone else on the team.',
          correct: false,
          feedback: 'That is the doer trap wearing a different hat.',
        },
      ],
    },
    {
      id: 'm1-r7-q2',
      kind: 'recall',
      source: '1.7',
      stem: 'Complete the pattern: “What you model becomes the standard. What you tolerate becomes…”',
      options: [
        { id: 'a', text: '…the norm.', correct: true, feedback: 'And what you ignore tells your team what does not actually matter.' },
        { id: 'b', text: '…the exception.', correct: false, feedback: 'The opposite, tolerated behaviour becomes normal, not exceptional.' },
        { id: 'c', text: '…a problem for HR.', correct: false, feedback: 'Not the line, and not the point.' },
        { id: 'd', text: '…your reputation.', correct: false, feedback: 'Not the line from the section.' },
      ],
    },
    {
      id: 'm1-r7-q3',
      kind: 'scenario',
      source: '1.7',
      stem: 'A manager holds a strong all-hands about accountability, then misses two of his own deadlines that month without mentioning it. What does the team learn?',
      options: [
        {
          id: 'a',
          text: 'That accountability matters, because he said so clearly.',
          correct: false,
          feedback: 'They watched what he did. The speech is not the signal.',
        },
        {
          id: 'b',
          text: 'That the standard applies to them and not to him, and credibility is lost fast when words and behaviour do not match.',
          correct: true,
          feedback: 'Credibility is earned through alignment. Two missed deadlines outweigh one good speech.',
        },
        {
          id: 'c',
          text: 'Nothing much. Managers have more competing demands and the team knows it.',
          correct: false,
          feedback: 'They notice. The section is explicit about this, three times.',
        },
        {
          id: 'd',
          text: 'That deadlines are flexible for everyone.',
          correct: false,
          feedback: 'Closer, but the specific damage is the gap between his standard and his behaviour.',
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
