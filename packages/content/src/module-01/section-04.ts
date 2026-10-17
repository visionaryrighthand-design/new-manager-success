import type { Section } from '../types.js';

/**
 * 1.4 — Your Energy Sets the Tone
 * Script status: APPROVED & LOCKED (April 2026). Beats are verbatim.
 */
export const section04: Section = {
  id: 'm1-s4',
  moduleNumber: 1,
  index: 4,
  number: '1.4',
  title: 'Your Energy Sets the Tone',
  durationMinutes: 7,
  spokenWordCount: 780,
  scriptStatus: 'approved-locked',
  hook: 'Before you say a word to your team, they have already read you.',
  keyIdea: 'Emotional contagion is real. What you project, your team absorbs.',

  /*
   * The rev34 cut, 1080x1920. Single file, so `videoUrl` rather than
   * `videoParts`.
   *
   * NOT VERIFIED FROM THE BUILD ENVIRONMENT: supabase.co is blocked by this
   * container's network policy, so this URL has never been fetched here.
   */
  videoUrl:
    'https://rhteswkgmndgijpllvjt.supabase.co/storage/v1/object/public/videos/module-1-4-your-energy-sets-the-tone-rev34-1080x1920-30fps.mp4',
  topics: ['emotional contagion', 'self-awareness', 'presence', 'the pre-game routine'],

  beats: [
    {
      id: 'b1',
      type: 'avatar',
      direction: 'full screen, direct to camera',
      speech:
        "Before you ever say a word to your team, they've already read you.\n\nThe moment you walk through the door, or join the call, your team is picking up on signals. Your posture. Your expression. The pace of your words. Whether you seem distracted or present. Whether you seem tense or calm.\n\nAs a manager, you are always on. And whether you intend it or not, what you project gets absorbed by the people around you.",
    },
    { id: 'b2', type: 'overlay', text: 'Emotional Contagion' },
    {
      id: 'b3',
      type: 'avatar',
      direction: 'full screen',
      speech:
        "Emotional contagion is the phenomenon where one person's emotional state spreads to those around them, often without anyone realizing it's happening.\n\nYou've felt it before. You walk into a room and immediately sense the tension without anyone saying a word. Or you're around someone whose energy is calm and focused and you feel yourself settle.\n\nAs a manager, you are the most contagious person in the room. Your mood doesn't stay with you, it travels. Directly to your team.",
    },
    {
      id: 'b4',
      type: 'avatar',
      direction: 'full screen',
      speech:
        "Think about the manager who arrives stressed, distracted, and short with people. Maybe they're dealing with something real, a difficult conversation with their own boss, a bad morning, a problem they can't stop thinking about.\n\nBut here's what happens on the other side of that energy.",
    },
    {
      id: 'b5',
      type: 'buildList',
      direction: 'avatar steps back, items build on screen',
      items: [
        'Team members read the tension and become hesitant to bring up problems.',
        'Questions go unasked. Issues go unreported.',
        'Productivity drops as people try to stay out of the way.',
        'The mood of the whole team shifts, without a single word about what’s wrong.',
      ],
    },
    { id: 'b6', type: 'hold', text: 'All four visible' },
    {
      id: 'b7',
      type: 'avatar',
      direction: 'full screen',
      speech:
        "And here's the thing, none of that was intentional. The manager didn't plan to create that effect. But it happened anyway.\n\nThis is why self-awareness is not a soft skill for managers. It is a leadership responsibility.",
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
        "Now let's be clear about something. This is not about performing happiness you don't feel. It's not about being fake, pretending everything is great when it isn't, or putting on a show.\n\nYour team can see through that too, and inauthenticity erodes trust just as fast as negativity does.\n\nWhat this is about is being intentional. Taking a moment before you engage your team to check in with yourself, reset if you need to, and show up as a leader rather than as a reaction.\n\nHere's a simple pre-game routine that high-performing managers use.",
    },
    {
      id: 'b10',
      type: 'buildList',
      direction: 'avatar steps back, items build on screen',
      items: [
        'Pause before you walk in or join the call. Two minutes is enough.',
        'Name what you’re carrying. Stress, frustration, distraction, acknowledge it to yourself.',
        'Decide what you’re leaving at the door. Not suppressing it, just not bringing it into the room.',
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
        'In our next section, we’re going to go deeper on the skill that underpins everything we just talked about, Emotional Intelligence. What it actually is, why it matters more for managers than almost anyone else, and how to develop it deliberately.',
    },
  ],



  /*
   * Section quiz, ten questions drawn from this section's script.
   *
   * NOT from the approved quiz document, which stops after 1.2. Every stem,
   * option and line of feedback below is ours, written against the beats and
   * going no further than what the script actually says.
   */
  quiz: [
    {
      id: 'm1-s4-q1',
      kind: 'recall',
      format: 'multiple_choice',
      source: '1.4',
      stem: 'According to the section, what has your team already done before you say a word?',
      options: [
        { id: 'a', text: 'Read you — your posture, expression, pace, whether you seem tense or calm', correct: true, feedback: 'The moment you walk in or join the call, the signals are already being picked up.' },
        { id: 'b', text: 'Decided what they think of your competence', correct: false, feedback: 'The section is about the energy they read, not a judgement on your ability.' },
        { id: 'c', text: 'Agreed among themselves how to respond to you', correct: false, feedback: 'The section describes something absorbed, not negotiated.' },
        { id: 'd', text: 'Nothing, until you speak', correct: false, feedback: 'The section opens by saying the opposite.' },
      ],
    },
    {
      id: 'm1-s4-q2',
      kind: 'recall',
      format: 'multiple_choice',
      source: '1.4',
      stem: 'What is emotional contagion?',
      options: [
        { id: 'a', text: 'A deliberate technique for motivating a team', correct: false, feedback: 'The section stresses it happens often without anyone realising.' },
        { id: 'b', text: 'When one person’s emotional state spreads to those around them, often unnoticed', correct: true, feedback: 'You walk into a room and sense the tension before anyone speaks. That is the effect.' },
        { id: 'c', text: 'The tendency of teams to copy a manager’s working hours', correct: false, feedback: 'The section is about emotional state, not schedules.' },
        { id: 'd', text: 'Burnout spreading through an overworked team', correct: false, feedback: 'Burnout is not what the section defines here.' },
      ],
    },
    {
      id: 'm1-s4-q3',
      kind: 'recall',
      format: 'multiple_choice',
      source: '1.4',
      stem: 'The section calls the manager "the most contagious person in the room." What does it mean by that?',
      options: [
        { id: 'a', text: 'Managers get ill more often because of the hours they keep', correct: false, feedback: 'The contagion in this section is emotional, not literal.' },
        { id: 'b', text: 'A manager’s mood does not stay with them — it travels directly to the team', correct: true, feedback: 'Which is why the section treats self-awareness as a leadership responsibility rather than a soft skill.' },
        { id: 'c', text: 'Managers are the first to hear bad news', correct: false, feedback: 'The section makes no claim about information flow here.' },
        { id: 'd', text: 'Teams copy whichever colleague is loudest', correct: false, feedback: 'The section is specifically about the manager’s effect, not the loudest voice.' },
      ],
    },
    {
      id: 'm1-s4-q4',
      kind: 'recall',
      format: 'multiple_choice',
      source: '1.4',
      stem: 'Which of these is NOT listed as an effect of a manager who arrives stressed, distracted and short with people?',
      options: [
        { id: 'a', text: 'People become hesitant to bring up problems', correct: false, feedback: 'This is listed first.' },
        { id: 'b', text: 'Questions go unasked and issues go unreported', correct: false, feedback: 'This is listed.' },
        { id: 'c', text: 'The team works longer hours to compensate', correct: true, feedback: 'The section does not claim this. It describes hesitancy, unreported issues, dropping productivity, and a shift in the whole team’s mood.' },
        { id: 'd', text: 'Productivity drops as people try to stay out of the way', correct: false, feedback: 'This is listed.' },
      ],
    },
    {
      id: 'm1-s4-q5',
      kind: 'recall',
      format: 'multiple_choice',
      source: '1.4',
      stem: 'What does the section emphasise about those effects?',
      options: [
        { id: 'a', text: 'They only happen to inexperienced managers', correct: false, feedback: 'The section makes no such exemption.' },
        { id: 'b', text: 'None of it was intentional — the manager did not plan it, and it happened anyway', correct: true, feedback: 'Which is exactly why intent is not enough and self-awareness is the responsibility.' },
        { id: 'c', text: 'They are unavoidable', correct: false, feedback: 'The section gives a routine for managing them, so they are not treated as fixed.' },
        { id: 'd', text: 'They can be fixed by explaining yourself afterwards', correct: false, feedback: 'The section does not offer explanation as the remedy. It offers preparation.' },
      ],
    },
    {
      id: 'm1-s4-q6',
      kind: 'recall',
      format: 'multiple_choice',
      source: '1.4',
      stem: 'Complete the section’s line: "You can’t manage others effectively until you can ___."',
      options: [
        { id: 'a', text: 'manage yourself first', correct: true, feedback: 'The full-screen moment of the section, and the reason self-awareness is framed as a responsibility.' },
        { id: 'b', text: 'win their trust first', correct: false, feedback: 'Trust is 1.3’s territory. This line is about self-management.' },
        { id: 'c', text: 'master the technical work first', correct: false, feedback: 'That is the doer trap from 1.2.' },
        { id: 'd', text: 'set clear expectations first', correct: false, feedback: 'Expectations come from 1.3. This line is about managing yourself.' },
      ],
    },
    {
      id: 'm1-s4-q7',
      kind: 'recall',
      format: 'multiple_choice',
      source: '1.4',
      stem: 'Is this section asking you to perform happiness you do not feel?',
      options: [
        { id: 'a', text: 'Yes — projecting positivity is the manager’s job', correct: false, feedback: 'The section explicitly rejects this.' },
        { id: 'b', text: 'No — it warns that inauthenticity erodes trust just as fast as negativity', correct: true, feedback: 'The team can see through a performance. The ask is to be intentional, not to be fake.' },
        { id: 'c', text: 'Yes, but only in front of senior leadership', correct: false, feedback: 'The section draws no such distinction.' },
        { id: 'd', text: 'No — it says you should share whatever you are feeling, openly', correct: false, feedback: 'The section asks you to decide what to leave at the door, not to broadcast it.' },
      ],
    },
    {
      id: 'm1-s4-q8',
      kind: 'recall',
      format: 'multiple_choice',
      source: '1.4',
      stem: 'What is the first step of the pre-game routine the section describes?',
      options: [
        { id: 'a', text: 'Set your intention for the interaction', correct: false, feedback: 'That is the last step, after you have paused, named it, and decided what to leave.' },
        { id: 'b', text: 'Pause before you walk in or join the call — two minutes is enough', correct: true, feedback: 'Then name what you are carrying, decide what to leave at the door, and set your intention.' },
        { id: 'c', text: 'Tell the team what kind of day you are having', correct: false, feedback: 'The routine is something you do before you engage, not a disclosure to the team.' },
        { id: 'd', text: 'Clear your inbox so you are not distracted', correct: false, feedback: 'The section does not mention this.' },
      ],
    },
    {
      id: 'm1-s4-q9',
      kind: 'scenario',
      format: 'multiple_choice',
      source: '1.4',
      stem: 'You have two minutes before a team call and you are carrying a difficult conversation with your own boss. What does the section suggest?',
      options: [
        { id: 'a', text: 'Suppress it entirely and never think about it again', correct: false, feedback: 'The section is explicit: not suppressing it, just not bringing it into the room.' },
        { id: 'b', text: 'Name what you are carrying, decide to leave it at the door, and set your intention for what the team needs', correct: true, feedback: 'Acknowledge it to yourself, then choose what you bring in. The whole routine takes under two minutes.' },
        { id: 'c', text: 'Open the call by explaining the mood you are in', correct: false, feedback: 'The section asks you to show up as a leader rather than as a reaction.' },
        { id: 'd', text: 'Cancel the call until you feel better', correct: false, feedback: 'The section offers a two-minute reset, not avoidance.' },
      ],
    },
    {
      id: 'm1-s4-q10',
      kind: 'recall',
      format: 'multiple_choice',
      source: '1.4',
      stem: 'How does the section describe the best leaders?',
      options: [
        { id: 'a', text: 'The ones who never have a bad day', correct: false, feedback: 'The section says explicitly that this is not it.' },
        { id: 'b', text: 'The ones whose team rarely knows they had one', correct: true, feedback: 'Your team is not responsible for your emotional state. You are.' },
        { id: 'c', text: 'The ones who share everything with their team', correct: false, feedback: 'The section asks for intentionality about what you bring into the room.' },
        { id: 'd', text: 'The ones who work the longest hours', correct: false, feedback: 'Effort is not the measure this section uses.' },
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
