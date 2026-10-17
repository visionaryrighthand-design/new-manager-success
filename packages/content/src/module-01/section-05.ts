import type { Section } from '../types.js';

/**
 * 1.5 — Emotional Intelligence for New Managers
 * Script status: APPROVED & LOCKED (April 2026). Beats are verbatim.
 *
 * Note for the IP punch list: "Emotional Intelligence" is a descriptive term in
 * general use and is not treated as a flagged mark here. The four components
 * named are the widely published Goleman groupings, described in original
 * wording rather than quoted — no framework diagram or proprietary assessment
 * is reproduced. See docs/product/IP_PUNCH_LIST.md § Cleared.
 */
export const section05: Section = {
  id: 'm1-s5',
  moduleNumber: 1,
  index: 5,
  number: '1.5',
  title: 'Emotional Intelligence for New Managers',
  durationMinutes: 7,
  spokenWordCount: 790,
  scriptStatus: 'approved-locked',
  hook: 'The strongest predictor of management effectiveness is not IQ, expertise, or experience.',
  keyIdea:
    'Self-awareness and self-regulation are the foundation of effective leadership.',
  topics: ['emotional intelligence', 'self-regulation', 'empathy', 'triggers', 'react vs respond'],

  /*
   * Apply: the real workplace task for this section.
   *
   * One task, not a menu. Nothing here is marked — the app cannot see whether
   * this actually happened — so it states the task precisely, says what doing
   * it well looks like, and comes back to ask.
   */
  apply: {
    id: 'm1-s5-apply',
    title: 'Catch yourself once',
    task:
      'The next time something at work spikes your frustration, create the space before you answer. Name the emotion to yourself, then choose the response the situation needs rather than the one you feel. Write down what happened the same day.',
    lookFor: [
      'The trigger named — what specifically set it off',
      'The pause actually taken, before you responded rather than after',
      'What you did instead of your first instinct, and what it changed',
    ],
    withinDays: 7,
    managerPrompt:
      'Tell me about a time recently you paused instead of reacting. What did it change?',
  },

  /*
   * The rev78 cut, 1080x1920. Single file.
   *
   * The stored filename truncates the title to `...for-new-manage-`, so the
   * slug cannot be derived from the section title. Copied from storage.
   *
   * NOT VERIFIED FROM THE BUILD ENVIRONMENT: supabase.co is blocked by this
   * container's network policy, so this URL has never been fetched here.
   */
  videoUrl:
    'https://rhteswkgmndgijpllvjt.supabase.co/storage/v1/object/public/videos/module-1-5-emotional-intelligence-for-new-manage-rev78-1080x1920-30fps.mp4',

  beats: [
    {
      id: 'b1',
      type: 'avatar',
      direction: 'full screen, direct to camera',
      speech:
        "There is one skill that research consistently identifies as the strongest predictor of management effectiveness. It's not IQ. It's not technical expertise. It's not years of experience.\n\nIt's Emotional Intelligence.\n\nAnd before you dismiss that as corporate buzzword territory, stay with me. Because this one is going to change how you think about leadership.",
    },
    { id: 'b2', type: 'overlay', text: 'Emotional Intelligence (EI)' },
    {
      id: 'b3',
      type: 'avatar',
      direction: 'full screen',
      speech:
        'Emotional Intelligence is the ability to recognize, understand, and manage your own emotions, and to recognize and influence the emotions of the people around you.\n\nFor an individual contributor, this is a useful skill. For a manager, it is the skill. Because everything you do as a leader (giving feedback, building trust, handling conflict, motivating your team) runs through your ability to understand and navigate emotions. Yours and theirs.',
    },
    {
      id: 'b4',
      type: 'avatar',
      direction: 'full screen',
      speech: 'There are four components of Emotional Intelligence that matter most for new managers.',
    },
    {
      id: 'b5',
      type: 'buildList',
      direction: 'avatar steps back, items build on screen',
      items: [
        'Self-Awareness, knowing what you’re feeling and why, and how it affects your behavior.',
        'Self-Regulation, managing your emotions rather than letting them manage you.',
        'Empathy, understanding what others are feeling and seeing situations from their perspective.',
        'Social Skills, using emotional awareness to communicate, influence, and lead effectively.',
      ],
    },
    { id: 'b6', type: 'hold', text: 'All four visible' },
    {
      id: 'b7',
      type: 'avatar',
      direction: 'full screen',
      speech:
        "All four of these matter. But if you're a new manager, the one to focus on first is self-regulation, because it directly affects everything else.\n\nSelf-regulation is the ability to pause before you react. To respond thoughtfully rather than impulsively. To stay calm and intentional when the situation around you is not.\n\nThink about the moments that test this most as a manager. An employee makes a costly mistake. Someone pushes back on a decision in front of the team. You get a last-minute curveball from your boss right before an important meeting.\n\nIn every one of those moments, you have a choice. React or respond.",
    },
    {
      id: 'b8',
      type: 'moment',
      text: 'EI is not a soft skill. It is the skill that determines whether everything else works.',
    },
    {
      id: 'b9',
      type: 'avatar',
      direction: 'full screen',
      speech: "Here's what strong self-regulation looks like in practice.",
    },
    {
      id: 'b10',
      type: 'buildList',
      direction: 'avatar steps back, items build on screen',
      items: [
        'Create space between stimulus and response, even a few seconds changes everything.',
        'Recognize your triggers, know what situations tend to spike your frustration or anxiety.',
        'Name the emotion internally before reacting to it. Naming it gives you power over it.',
        'Choose your response based on what the situation needs, not what you feel in the moment.',
      ],
    },
    { id: 'b11', type: 'hold', text: 'All four visible' },
    {
      id: 'b12',
      type: 'avatar',
      direction: 'full screen',
      speech:
        "Now let's talk about empathy, because this one surprises a lot of new managers.\n\nEmpathy is not about agreeing with everyone or avoiding hard decisions to spare people's feelings. Empathy is about understanding where someone is coming from before you respond to them.\n\nWhen a team member is resistant to feedback, a manager without empathy gets frustrated. A manager with empathy gets curious. They ask, what's driving this reaction? What might this person be dealing with that I'm not seeing?\n\nThat curiosity doesn't change the feedback. But it changes the conversation. And it changes the outcome.",
    },
    {
      id: 'b13',
      type: 'avatar',
      direction: 'full screen',
      speech:
        "Here's what's important to understand about Emotional Intelligence.\n\nYou are not born with a fixed level of it. EI can be developed. It responds to practice, feedback, and intentional effort, just like any other skill.\n\nEvery difficult conversation you navigate thoughtfully. Every moment you choose to pause rather than react. Every time you try to understand before being understood. That's your EI growing.",
    },
    { id: 'b14', type: 'overlay', text: 'EI grows with every intentional choice you make.' },
    {
      id: 'b15',
      type: 'avatar',
      direction: 'full screen, direct close',
      speech:
        'In our next section, we’re going to introduce one of the most practical leadership frameworks you’ll use throughout your career, the idea that great managers don’t have one style. They have the right style for each person in each moment.',
      // See scriptDeviations D6 below.
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
      ref: 'D6',
      severity: 'legal',
      original:
        'In our next section, we’re going to introduce one of the most practical leadership frameworks you’ll use throughout your career, Situational Leadership. The idea that great managers don’t have one style. They have the right style for each person in each moment.',
      shipped:
        'In our next section, we’re going to introduce one of the most practical leadership frameworks you’ll use throughout your career, the idea that great managers don’t have one style. They have the right style for each person in each moment.',
      reason:
        'Removes the forward-reference to “Situational Leadership”, a registered trademark of the Center for Leadership Studies. Same punch-list category as D4 (Radical Candor®) and D5 (SBI). The substance of the sentence is unchanged. The Aug 2026 Expanded Module Outline already retitles 1.6 to “Managing in the Moment”, so this aligns the locked script with the newer approved outline.',
      needsSignoffFrom: 'Course owner + IP counsel',
    },
  ],




  contentAdditions: [
    {
      ref: 'A6',
      kind: 'field-note',
      where: 'Field Note, conditional on the Curveball answer',
      what: 'Four alternative prompts, one per Curveball choice, replacing the default prompt for anyone who answered.',
      reason:
        'Same as A5 in Section 1.1. In this Section the pairing is tighter: the Curveball is about the gap between stimulus and response, and the follow-up asks the learner to examine the gap they just demonstrated.',
      status: 'proposed',
    },
    {
      ref: 'A3',
      kind: 'gut-check',
      where: 'after b3',
      what: '"How long between feeling frustration and showing it?" Three options, no scoring.',
      reason:
        'This Section ran nine consecutive passive cards and 2m25 before its Curveball, the worst stretch in Module 1. Asking this before the four components are named gives the learner a personal reading to hold them against.',
      status: 'proposed',
    },
    {
      ref: 'A4',
      kind: 'gut-check',
      where: 'after b6',
      what: '"Which of the four is hardest for you right now?", one option per component.',
      reason:
        'Breaks the same run again, and makes b7 land as an answer rather than an assertion: the script says focus on self-regulation first, and this is the card where the learner has just said whether they agree.',
      status: 'proposed',
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
      id: 'm1-s5-q1',
      kind: 'recall',
      format: 'multiple_choice',
      source: '1.5',
      stem: 'What does the section say research identifies as the strongest predictor of management effectiveness?',
      options: [
        { id: 'a', text: 'IQ', correct: false, feedback: 'The section rules this out by name.' },
        { id: 'b', text: 'Technical expertise', correct: false, feedback: 'Ruled out by name, and 1.2 already covered why being the best doer does not carry over.' },
        { id: 'c', text: 'Emotional Intelligence', correct: true, feedback: 'Not IQ, not technical expertise, not years of experience.' },
        { id: 'd', text: 'Years of experience', correct: false, feedback: 'The section rules this out by name.' },
      ],
    },
    {
      id: 'm1-s5-q2',
      kind: 'recall',
      format: 'multiple_choice',
      source: '1.5',
      stem: 'How does the section define Emotional Intelligence?',
      options: [
        { id: 'a', text: 'Staying positive regardless of what happens', correct: false, feedback: 'That is closer to the performed happiness 1.4 warned against.' },
        { id: 'b', text: 'Recognising, understanding and managing your own emotions, and recognising and influencing those of the people around you', correct: true, feedback: 'Both halves matter: yours, and theirs.' },
        { id: 'c', text: 'Avoiding emotional conversations at work', correct: false, feedback: 'The section is about navigating emotions, not avoiding them.' },
        { id: 'd', text: 'Being liked by your team', correct: false, feedback: '1.3 is explicit that being liked is not the goal.' },
      ],
    },
    {
      id: 'm1-s5-q3',
      kind: 'recall',
      format: 'multiple_choice',
      source: '1.5',
      stem: 'Why does the section say EI matters more for a manager than for an individual contributor?',
      options: [
        { id: 'a', text: 'Because managers attend more meetings', correct: false, feedback: 'The section makes no such argument.' },
        { id: 'b', text: 'Because feedback, trust, conflict and motivation all run through your ability to navigate emotions', correct: true, feedback: 'For an individual contributor it is a useful skill. For a manager it is the skill.' },
        { id: 'c', text: 'Because managers are judged on likeability', correct: false, feedback: 'Likeability is not the measure this course uses.' },
        { id: 'd', text: 'Because managers have less technical work to do', correct: false, feedback: 'Workload is not the reason the section gives.' },
      ],
    },
    {
      id: 'm1-s5-q4',
      kind: 'recall',
      format: 'multiple_choice',
      source: '1.5',
      stem: 'Which of these is NOT one of the four components of EI the section lists?',
      options: [
        { id: 'a', text: 'Self-Awareness', correct: false, feedback: 'Listed first: knowing what you are feeling and why.' },
        { id: 'b', text: 'Self-Regulation', correct: false, feedback: 'Listed, and the one the section says to focus on first.' },
        { id: 'c', text: 'Resilience', correct: true, feedback: 'The four are Self-Awareness, Self-Regulation, Empathy and Social Skills. Resilience is not among them.' },
        { id: 'd', text: 'Empathy', correct: false, feedback: 'Listed: understanding what others feel and seeing their perspective.' },
      ],
    },
    {
      id: 'm1-s5-q5',
      kind: 'recall',
      format: 'multiple_choice',
      source: '1.5',
      stem: 'Which component does the section tell a new manager to focus on first, and why?',
      options: [
        { id: 'a', text: 'Empathy, because it builds trust fastest', correct: false, feedback: 'Empathy matters, but it is not the one the section puts first.' },
        { id: 'b', text: 'Self-Regulation, because it directly affects everything else', correct: true, feedback: 'The ability to pause before you react is what makes the other three usable.' },
        { id: 'c', text: 'Social Skills, because managers communicate constantly', correct: false, feedback: 'Listed as a component, but not the starting point.' },
        { id: 'd', text: 'Self-Awareness, because you cannot change what you cannot see', correct: false, feedback: 'A reasonable argument, but the section names self-regulation as the first focus.' },
      ],
    },
    {
      id: 'm1-s5-q6',
      kind: 'recall',
      format: 'multiple_choice',
      source: '1.5',
      stem: 'How does the section define self-regulation?',
      options: [
        { id: 'a', text: 'Never showing emotion at work', correct: false, feedback: 'The section asks you to manage emotions, not erase them.' },
        { id: 'b', text: 'Pausing before you react, and responding thoughtfully rather than impulsively', correct: true, feedback: 'Staying calm and intentional when the situation around you is not.' },
        { id: 'c', text: 'Keeping your workload under control', correct: false, feedback: 'Self-regulation here is emotional, not organisational.' },
        { id: 'd', text: 'Following a fixed process for every decision', correct: false, feedback: 'The section asks you to choose the response the situation needs, not to apply one process.' },
      ],
    },
    {
      id: 'm1-s5-q7',
      kind: 'recall',
      format: 'multiple_choice',
      source: '1.5',
      stem: 'The section says naming an emotion internally before reacting does what?',
      options: [
        { id: 'a', text: 'Gives you power over it', correct: true, feedback: 'One of the four practices, alongside creating space, knowing your triggers, and choosing your response.' },
        { id: 'b', text: 'Makes the feeling go away', correct: false, feedback: 'The section does not promise the feeling disappears, only that naming it changes your relationship to it.' },
        { id: 'c', text: 'Signals to your team that you are struggling', correct: false, feedback: 'The naming is internal, before you react.' },
        { id: 'd', text: 'Prevents you from making the decision at all', correct: false, feedback: 'The point is to choose your response, not to avoid responding.' },
      ],
    },
    {
      id: 'm1-s5-q8',
      kind: 'recall',
      format: 'multiple_choice',
      source: '1.5',
      stem: 'What does the section say empathy is NOT?',
      options: [
        { id: 'a', text: 'Understanding where someone is coming from', correct: false, feedback: 'That is exactly what the section says empathy is.' },
        { id: 'b', text: 'Agreeing with everyone, or avoiding hard decisions to spare feelings', correct: true, feedback: 'The section is explicit that empathy does not mean either of those.' },
        { id: 'c', text: 'Getting curious about what is driving a reaction', correct: false, feedback: 'That is the behaviour the section describes as empathy in practice.' },
        { id: 'd', text: 'Asking what someone might be dealing with that you cannot see', correct: false, feedback: 'That is the empathetic question the section models.' },
      ],
    },
    {
      id: 'm1-s5-q9',
      kind: 'scenario',
      format: 'multiple_choice',
      source: '1.5',
      stem: 'A team member is resistant to feedback. What does the section say separates a manager with empathy from one without?',
      options: [
        { id: 'a', text: 'The manager with empathy softens the feedback', correct: false, feedback: 'The section is explicit: the curiosity does not change the feedback.' },
        { id: 'b', text: 'The manager without empathy gets frustrated; the manager with empathy gets curious', correct: true, feedback: 'Same feedback, different conversation, different outcome.' },
        { id: 'c', text: 'The manager with empathy postpones the conversation', correct: false, feedback: 'Nothing in the section suggests delay.' },
        { id: 'd', text: 'The manager with empathy agrees with the pushback', correct: false, feedback: 'Empathy is not agreement. The section says so directly.' },
      ],
    },
    {
      id: 'm1-s5-q10',
      kind: 'recall',
      format: 'true_false',
      source: '1.5',
      stem: 'You are born with a fixed level of Emotional Intelligence that cannot meaningfully change.',
      options: [
        { id: 'true', text: 'True', correct: false, feedback: 'The section says the opposite: EI responds to practice, feedback and intentional effort, like any other skill.' },
        { id: 'false', text: 'False', correct: true, feedback: 'EI grows with every intentional choice — every pause instead of a reaction, every attempt to understand before being understood.' },
      ],
    },
  ],
};
