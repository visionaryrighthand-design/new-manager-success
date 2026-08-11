import type { Rep } from '../types.js';

/**
 * 1.4 — Your Energy Sets the Tone
 * Script status: APPROVED & LOCKED (April 2026). Beats are verbatim.
 */
export const rep04: Rep = {
  id: 'm1-r4',
  moduleNumber: 1,
  index: 4,
  number: '1.4',
  title: 'Your Energy Sets the Tone',
  durationMinutes: 7,
  spokenWordCount: 780,
  scriptStatus: 'approved-locked',
  hook: 'Before you say a word to your team, they have already read you.',
  keyIdea: 'Emotional contagion is real. What you project, your team absorbs.',
  topics: ['emotional contagion', 'self-awareness', 'presence', 'the pre-game routine'],

  beats: [
    {
      id: 'b1',
      type: 'avatar',
      direction: 'full screen, direct to camera',
      speech:
        "Before you ever say a word to your team, they've already read you.\n\nThe moment you walk through the door — or join the call — your team is picking up on signals. Your posture. Your expression. The pace of your words. Whether you seem distracted or present. Whether you seem tense or calm.\n\nAs a manager, you are always on. And whether you intend it or not, what you project gets absorbed by the people around you.",
    },
    { id: 'b2', type: 'overlay', text: 'Emotional Contagion' },
    {
      id: 'b3',
      type: 'avatar',
      direction: 'full screen',
      speech:
        "Emotional contagion is the phenomenon where one person's emotional state spreads to those around them — often without anyone realizing it's happening.\n\nYou've felt it before. You walk into a room and immediately sense the tension without anyone saying a word. Or you're around someone whose energy is calm and focused and you feel yourself settle.\n\nAs a manager, you are the most contagious person in the room. Your mood doesn't stay with you — it travels. Directly to your team.",
    },
    {
      id: 'b4',
      type: 'avatar',
      direction: 'full screen',
      speech:
        "Think about the manager who arrives stressed, distracted, and short with people. Maybe they're dealing with something real — a difficult conversation with their own boss, a bad morning, a problem they can't stop thinking about.\n\nBut here's what happens on the other side of that energy.",
    },
    {
      id: 'b5',
      type: 'buildList',
      direction: 'avatar steps back, items build on screen',
      items: [
        'Team members read the tension and become hesitant to bring up problems.',
        'Questions go unasked. Issues go unreported.',
        'Productivity drops as people try to stay out of the way.',
        'The mood of the whole team shifts — without a single word about what’s wrong.',
      ],
    },
    { id: 'b6', type: 'hold', text: 'All four visible' },
    {
      id: 'b7',
      type: 'avatar',
      direction: 'full screen',
      speech:
        "And here's the thing — none of that was intentional. The manager didn't plan to create that effect. But it happened anyway.\n\nThis is why self-awareness is not a soft skill for managers. It is a leadership responsibility.",
    },
    {
      id: 'b8',
      type: 'moment',
      text: 'You can’t manage others effectively until you can manage yourself first.',
    },
    {
      id: 'b9',
      type: 'avatar',
      direction: 'full screen',
      speech:
        "Now let's be clear about something. This is not about performing happiness you don't feel. It's not about being fake, pretending everything is great when it isn't, or putting on a show.\n\nYour team can see through that too — and inauthenticity erodes trust just as fast as negativity does.\n\nWhat this is about is being intentional. Taking a moment before you engage your team to check in with yourself, reset if you need to, and show up as a leader rather than as a reaction.\n\nHere's a simple pre-game routine that high-performing managers use.",
    },
    {
      id: 'b10',
      type: 'buildList',
      direction: 'avatar steps back, items build on screen',
      items: [
        'Pause before you walk in or join the call. Two minutes is enough.',
        'Name what you’re carrying. Stress, frustration, distraction — acknowledge it to yourself.',
        'Decide what you’re leaving at the door. Not suppressing it — just not bringing it into the room.',
        'Set your intention for the interaction. What does your team need from you right now?',
      ],
    },
    { id: 'b11', type: 'hold', text: 'All four visible' },
    {
      id: 'b12',
      type: 'avatar',
      direction: 'full screen',
      speech:
        "That routine takes less than two minutes. But it changes everything about how you show up.\n\nYour team is not responsible for your emotional state. You are. And the investment you make in managing your own energy pays dividends in team morale, trust, and performance every single day.\n\nThe best leaders are not the ones who never have a bad day. They're the ones whose team rarely knows they did.",
    },
    {
      id: 'b13',
      type: 'avatar',
      direction: 'full screen, direct close',
      speech:
        'In our next section, we’re going to go deeper on the skill that underpins everything we just talked about — Emotional Intelligence. What it actually is, why it matters more for managers than almost anyone else, and how to develop it deliberately.',
    },
  ],

  curveballs: [
    {
      id: 'm1-r4-cb1',
      triggerAfterBeat: 'b6',
      skill: 'Managing your own state before it becomes the team’s',
      scenario:
        'You just got off a call where your boss questioned your team’s numbers in front of two other managers. Your next meeting starts in four minutes. It is your team’s weekly stand-up.',
      prompt: 'What do you do with those four minutes?',
      choices: [
        {
          id: 'a',
          text: 'Walk in and tell the team exactly what was said. They deserve transparency.',
          verdict: 'workable',
          response:
            'Transparency matters and Module 2 builds on it. But raw transmission is not transparency — it is contagion with a justification. Process it first, then decide what the team actually needs to know and when.',
        },
        {
          id: 'b',
          text: 'Pause. Name what you are carrying, decide what stays outside the room, and set an intention for the stand-up.',
          verdict: 'best',
          response:
            'Two minutes, four steps. Note what you did not do: you did not pretend the call went well. Intentional is not the same as fake.',
        },
        {
          id: 'c',
          text: 'Push through. Being visibly stressed shows the team you are human.',
          verdict: 'costly',
          response:
            'The team will not read it as human, they will read it as danger — and questions go unasked. You are the most contagious person in the room whether you intend to be or not.',
        },
        {
          id: 'd',
          text: 'Cancel the stand-up and reschedule for tomorrow.',
          verdict: 'workable',
          response:
            'Occasionally the right call, and better than showing up hot. But if it becomes the pattern, your team learns that your bad days cost them their access to you.',
        },
      ],
    },
  ],

  fieldNote: {
    id: 'm1-r4-fn1',
    topic: 'Energy and presence',
    prompt:
      'Think about the last time you brought a bad mood into work. What did your team do differently that day?',
    placeholder: 'If you are not sure they noticed — that is worth writing down too.',
    suggestedMinChars: 70,
  },

  quiz: [
    {
      id: 'm1-r4-q1',
      kind: 'recall',
      source: '1.4',
      stem: 'What is emotional contagion?',
      options: [
        {
          id: 'a',
          text: 'Deliberately projecting confidence to motivate a team.',
          correct: false,
          feedback: 'That would be intentional. Contagion happens whether you intend it or not.',
        },
        {
          id: 'b',
          text: 'One person’s emotional state spreading to those around them, often without anyone realizing it.',
          correct: true,
          feedback: 'And as the manager, you are the most contagious person in the room.',
        },
        {
          id: 'c',
          text: 'A team adopting the values of its organization over time.',
          correct: false,
          feedback: 'That is culture. Contagion is faster and operates below awareness.',
        },
        {
          id: 'd',
          text: 'Burnout spreading through a department.',
          correct: false,
          feedback: 'A possible consequence, not the definition.',
        },
      ],
    },
    {
      id: 'm1-r4-q2',
      kind: 'recall',
      source: '1.4',
      stem: 'The pre-game routine is described as taking how long?',
      options: [
        { id: 'a', text: 'Less than two minutes.', correct: true, feedback: 'Pause, name it, decide what stays outside, set your intention.' },
        { id: 'b', text: 'About fifteen minutes.', correct: false, feedback: 'Too long to be usable on a real day — which is the point of keeping it short.' },
        { id: 'c', text: 'A full hour before the workday.', correct: false, feedback: 'Not the routine described here.' },
        { id: 'd', text: 'It varies by person and has no set length.', correct: false, feedback: 'The section gives a specific, short answer: two minutes is enough.' },
      ],
    },
    {
      id: 'm1-r4-q3',
      kind: 'scenario',
      source: '1.4',
      stem: 'A manager decides that from now on she will always appear upbeat in front of her team, regardless of how she feels. What is the problem?',
      options: [
        {
          id: 'a',
          text: 'Nothing — consistency of mood is exactly what the section recommends.',
          correct: false,
          feedback:
            'The section recommends being intentional, which is not the same as performing a mood you do not have.',
        },
        {
          id: 'b',
          text: 'Her team will see through it, and inauthenticity erodes trust as fast as negativity does.',
          correct: true,
          feedback:
            'The goal is not performed happiness. It is choosing what you bring into the room instead of defaulting to your reaction.',
        },
        {
          id: 'c',
          text: 'It will be exhausting to maintain.',
          correct: false,
          feedback: 'True, but the section names the trust cost specifically.',
        },
        {
          id: 'd',
          text: 'Her team will stop reading her signals altogether.',
          correct: false,
          feedback: 'They keep reading. They just start reading a mismatch.',
        },
      ],
    },
  ],
};
