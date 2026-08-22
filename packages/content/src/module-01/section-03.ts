import type { Section } from '../types.js';

/**
 * 1.3 — The Relationship Reset
 * Script status: APPROVED & LOCKED (April 2026). Beats are verbatim.
 */
export const section03: Section = {
  id: 'm1-s3',
  moduleNumber: 1,
  index: 3,
  number: '1.3',
  title: 'The Relationship Reset',
  durationMinutes: 7,
  spokenWordCount: 810,
  scriptStatus: 'approved-locked',
  hook: 'Your relationships changed the day you got the title. Whether you wanted them to or not.',
  keyIdea: 'The goal is not to be liked. It is to be trusted and respected.',
  topics: [
    'managing former peers',
    'approval seeking',
    'earning respect',
    'boundaries',
    'setting the tone early',
  ],

  beats: [
    {
      id: 'b1',
      type: 'avatar',
      direction: 'full screen, direct to camera',
      speech:
        "If there's one thing that catches new managers completely off guard. It's this.\n\nYour relationships just changed. Whether you wanted them to or not.\n\nThe colleagues you used to vent to. The friends you grabbed lunch with. The peers who felt like teammates. That dynamic has shifted, and how you navigate it will directly affect your ability to lead.",
    },
    { id: 'b2', type: 'overlay', text: 'The Relationship Reset' },
    {
      id: 'b3',
      type: 'avatar',
      direction: 'full screen',
      speech:
        "Let me be clear about something upfront. This doesn't mean you become cold, distant, or unapproachable. It doesn't mean you stop caring about the people on your team.\n\nWhat it does mean is that the nature of the relationship has changed. And pretending otherwise creates problems, for you, for them, and for the whole team.\n\nOne of the most common mistakes new managers make is trying to maintain the same peer-level friendships with their direct reports after the promotion. The motivation is completely understandable, you don't want things to feel awkward, you want people to like you. But here's the reality.\n\nWhen you're someone's manager, you will sometimes have to deliver feedback they don't want to hear. Make decisions that don't go their way. Hold people accountable. And those things are very hard to do well when you've blurred the line between manager and best friend.",
    },
    {
      id: 'b4',
      type: 'moment',
      text: 'The goal is not to be liked. The goal is to be trusted and respected.',
    },
    {
      id: 'b5',
      type: 'avatar',
      direction: 'full screen',
      speech:
        "And those are built very differently.\n\nApproval-seeking, making decisions based on what will make people like you rather than what's right for the team, is one of the most costly traps a new manager can fall into.",
    },
    {
      id: 'b6',
      type: 'buildList',
      direction: 'avatar steps back, items build on screen',
      items: [
        'Avoided hard conversations.',
        'Inconsistent standards, different rules for different people.',
        'Poor decisions made to keep the peace.',
        'A team that gradually loses confidence in your leadership.',
      ],
    },
    { id: 'b7', type: 'hold', text: 'All four visible' },
    {
      id: 'b8',
      type: 'avatar',
      direction: 'full screen',
      speech:
        "Over time, a team that senses you're managing relationships instead of managing outcomes will test those limits. Your strongest people will lose respect. And your struggling people will take full advantage of the gap.\n\nSo how do you earn respect instead of seeking approval? Here's what it actually looks like.",
    },
    {
      id: 'b9',
      type: 'buildList',
      direction: 'avatar steps back, items build on screen',
      items: [
        'Set clear expectations, and hold them consistently for everyone.',
        'Tell the truth, even when it’s uncomfortable.',
        'Treat everyone fairly. Favoritism is always visible, even when you think it isn’t.',
        'Follow through. Every single time.',
      ],
    },
    { id: 'b10', type: 'hold', text: 'All four visible' },
    {
      id: 'b11',
      type: 'avatar',
      direction: 'full screen',
      speech:
        "Respect is built in small, repeated moments. Every time you follow through on something you said you'd do, that's a deposit. Every time you don't, that's a withdrawal. The balance in that account is your credibility as a manager.\n\nNow here's the distinction that makes all of this manageable.",
    },
    { id: 'b12', type: 'overlay', text: 'Friendly ≠ Friendship. Approachable ≠ Peer.' },
    {
      id: 'b13',
      type: 'avatar',
      direction: 'full screen',
      speech:
        "You can be warm without being a confidant. You can be approachable without being a peer. You can genuinely care about your team's goals, challenges, and wellbeing, while still maintaining the professional clarity that makes you an effective leader.\n\nThe most respected managers aren't the ones who kept all their old friendships intact by pretending nothing changed. They're the ones who were honest about the shift and showed up for their team in the ways that actually matter.\n\nOne last thing, and this one is important.\n\nThe tone you set in the first few weeks as a manager is the tone that sticks.",
    },
    {
      id: 'b14',
      type: 'buildList',
      direction: 'avatar steps back, items build on screen',
      items: [
        'The standards you hold, or don’t hold.',
        'The conversations you have, or avoid.',
        'The line you draw, or blur.',
      ],
    },
    { id: 'b15', type: 'hold', text: 'All three visible' },
    {
      id: 'b16',
      type: 'avatar',
      direction: 'full screen, direct close',
      speech:
        "These early signals become the culture of your team. And culture is far easier to build intentionally from the start than to repair once the wrong patterns are already in place.\n\nYou don't have to be perfect. But you do have to be deliberate.\n\nIn our next section we're going to talk about something that connects directly to everything we just covered, your energy. How your presence, your mood, and the way you show up each day shapes your team's performance more than almost anything else you'll do as a manager.",
    },
  ],



  quiz: [
    {
      id: 'm1-s3-q1',
      kind: 'recall',
      source: '1.3',
      stem: 'What is the stated goal of the relationship reset?',
      options: [
        {
          id: 'a',
          text: 'To be liked by your team.',
          correct: false,
          feedback: 'Explicitly not the goal. Being liked and being trusted are built very differently.',
        },
        {
          id: 'b',
          text: 'To be trusted and respected.',
          correct: true,
          feedback: 'And those are built through consistency, honesty, and follow-through, not approval.',
        },
        {
          id: 'c',
          text: 'To become more distant so decisions are easier.',
          correct: false,
          feedback:
            'The section is explicit that this does not mean becoming cold, distant, or unapproachable.',
        },
        {
          id: 'd',
          text: 'To end your friendships at work.',
          correct: false,
          feedback: 'Friendly is not the same as friendship. Warmth stays; the nature of the relationship changes.',
        },
      ],
    },
    {
      id: 'm1-s3-q2',
      kind: 'recall',
      source: '1.3',
      stem: 'Approval-seeking tends to produce which pattern?',
      options: [
        {
          id: 'a',
          text: 'Higher standards, because you want to impress people.',
          correct: false,
          feedback: 'It produces the opposite, standards bend to keep the peace.',
        },
        {
          id: 'b',
          text: 'Avoided hard conversations and inconsistent standards.',
          correct: true,
          feedback:
            'And a team that senses you are managing relationships instead of outcomes will test those limits.',
        },
        {
          id: 'c',
          text: 'Faster decisions, because you avoid debate.',
          correct: false,
          feedback: 'Decisions get slower and worse, because they get made to keep the peace.',
        },
        {
          id: 'd',
          text: 'Stronger loyalty from your highest performers.',
          correct: false,
          feedback: 'Your strongest people are the first to lose respect when standards are uneven.',
        },
      ],
    },
    {
      id: 'm1-s3-q3',
      kind: 'scenario',
      source: '1.3',
      stem: 'You approve a late request from one team member because you know she has had a hard month. You would have said no to anyone else. What is the real cost?',
      options: [
        {
          id: 'a',
          text: 'There is none. Flexing for individual circumstances is good management.',
          correct: false,
          feedback:
            'Flexibility is real and section 1.6 covers it. This is not that. This is the same rule applied differently to different people.',
        },
        {
          id: 'b',
          text: 'The team now has evidence that the standard depends on who is asking.',
          correct: true,
          feedback:
            'Favoritism is always visible, even when you think it is not. The cost is not this decision. It is every decision after it.',
        },
        {
          id: 'c',
          text: 'She will expect the same answer next time.',
          correct: false,
          feedback: 'A smaller version of the problem. The bigger cost is what the rest of the team learns.',
        },
        {
          id: 'd',
          text: 'Your boss may disagree with the call.',
          correct: false,
          feedback: 'Possible, but the section is concerned with what your team observes.',
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
