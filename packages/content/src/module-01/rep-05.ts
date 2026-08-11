import type { Rep } from '../types.js';

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
export const rep05: Rep = {
  id: 'm1-r5',
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

  curveballs: [
    {
      id: 'm1-r5-cb1',
      triggerAfterBeat: 'b11',
      skill: 'Creating space between stimulus and response',
      scenario:
        'In a team meeting, someone you manage says: “Honestly, this new process is a waste of time and everyone knows it.” Six people are watching. You designed the process.',
      prompt: 'What is your first move?',
      choices: [
        {
          id: 'a',
          text: 'Defend the process on the spot. Letting it stand unchallenged undermines you.',
          verdict: 'costly',
          response:
            'This is reacting, not responding. You will win the exchange and lose the room, and you will never hear the actual objection, which might have been useful.',
        },
        {
          id: 'b',
          text: 'Ask them to walk you through where it breaks down, and take notes.',
          verdict: 'best',
          response:
            'Curiosity instead of frustration. You get the real information, the team sees that disagreement is survivable, and you have bought yourself time to think before deciding anything.',
        },
        {
          id: 'c',
          text: 'Say “Let’s take that offline” and move on.',
          verdict: 'workable',
          response:
            'A legitimate way to buy space, and better than reacting hot. But used reflexively it reads as shutting people down. If you say it, you must actually run the offline conversation.',
        },
        {
          id: 'd',
          text: 'Say nothing and speak to them privately afterwards about the tone.',
          verdict: 'costly',
          response:
            'The substance gets lost and the team reads your silence as the process being indefensible. Address the content in the room; address the delivery privately if it needs it.',
        },
      ],
    },
  ],

  gutChecks: [
    {
      id: 'm1-r5-gc1',
      triggerAfterBeat: 'b3',
      prompt:
        'Last time you were properly frustrated at work, how long between feeling it and showing it?',
      choices: [
        {
          id: 'a',
          text: 'No gap at all.',
          reaction:
            'Honest, and more common than people admit. That gap is the entire skill, and it is trainable, which is what the rest of this section is about.',
        },
        {
          id: 'b',
          text: 'A few seconds.',
          reaction:
            'A few seconds is more than most people have. That is not a small thing; it is the difference between a reaction and a decision.',
        },
        {
          id: 'c',
          text: 'Nobody could tell.',
          reaction:
            'Useful, as long as it is regulated and not just swallowed. There is a real difference between the two, and a team can feel which one it is.',
        },
      ],
    },
    {
      id: 'm1-r5-gc2',
      triggerAfterBeat: 'b6',
      prompt: 'Which of those four is hardest for you right now?',
      choices: [
        {
          id: 'a',
          text: 'Self-Awareness',
          reaction: 'Then start there. The other three are built on top of it.',
        },
        {
          id: 'b',
          text: 'Self-Regulation',
          reaction:
            'The most common answer from new managers, and the one the next card is about.',
        },
        {
          id: 'c',
          text: 'Empathy',
          reaction:
            'Worth knowing before you write yourself off: empathy is a skill, not a personality trait.',
        },
        {
          id: 'd',
          text: 'Social Skills',
          reaction:
            'The most visible of the four, and the one that improves fastest once the first three do.',
        },
      ],
    },
  ],

  fieldNote: {
    id: 'm1-r5-fn1',
    topic: 'Self-regulation and triggers',
    prompt:
      'What is your trigger? Name the specific situation at work that most reliably spikes your frustration.',
    placeholder: 'Be specific. “When people are late” is more useful than “disrespect”.',
    suggestedMinChars: 50,
    followUps: [
      {
        curveballId: 'm1-r5-cb1',
        choiceId: 'a',
        prompt:
          'Earlier you defended the process on the spot. Replay the ten seconds before you spoke. What were you actually protecting, the process or yourself?',
        placeholder: 'Nobody reads this. The honest answer is the useful one.',
      },
      {
        curveballId: 'm1-r5-cb1',
        choiceId: 'b',
        prompt:
          'Earlier you asked them to walk you through where it breaks down. That took self-regulation you already have. Where does that same calm disappear? Name the situation.',
        placeholder: 'You managed it once. What is different in the other case?',
      },
      {
        curveballId: 'm1-r5-cb1',
        choiceId: 'c',
        prompt:
          'Earlier you took it offline. Be honest about the intent: were you protecting the meeting, or buying yourself time to cool down? What happened to the point they raised?',
        placeholder: 'Both can be true. Say which was bigger.',
      },
      {
        curveballId: 'm1-r5-cb1',
        choiceId: 'd',
        prompt:
          'Earlier you said nothing and raised the tone privately afterwards. What did the rest of the room learn in that silence about whether it is safe to push back?',
        placeholder: 'Answer as one of them, not as you.',
      },
    ],
  },

  contentAdditions: [
    {
      ref: 'A6',
      kind: 'field-note',
      where: 'Field Note, conditional on the Curveball answer',
      what: 'Four alternative prompts, one per Curveball choice, replacing the default prompt for anyone who answered.',
      reason:
        'Same as A5 in Rep 1.1. In this Rep the pairing is tighter: the Curveball is about the gap between stimulus and response, and the follow-up asks the learner to examine the gap they just demonstrated.',
      status: 'proposed',
    },
    {
      ref: 'A3',
      kind: 'gut-check',
      where: 'after b3',
      what: '"How long between feeling frustration and showing it?" Three options, no scoring.',
      reason:
        'This Rep ran nine consecutive passive cards and 2m25 before its Curveball, the worst stretch in Module 1. Asking this before the four components are named gives the learner a personal reading to hold them against.',
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

  quiz: [
    {
      id: 'm1-r5-q1',
      kind: 'recall',
      source: '1.5',
      stem: 'Which component of Emotional Intelligence should a new manager focus on first, and why?',
      options: [
        {
          id: 'a',
          text: 'Empathy, because relationships come first.',
          correct: false,
          feedback: 'Empathy matters, but it is hard to access when you have not yet learned to pause.',
        },
        {
          id: 'b',
          text: 'Self-regulation, because it directly affects everything else.',
          correct: true,
          feedback: 'Pause before you react. Everything else in EI runs downstream of that.',
        },
        {
          id: 'c',
          text: 'Social skills, because managers spend their day communicating.',
          correct: false,
          feedback: 'Important, but not named as the first priority.',
        },
        {
          id: 'd',
          text: 'Self-awareness, because you cannot change what you cannot see.',
          correct: false,
          feedback:
            'A close and defensible answer, but the section names self-regulation specifically as the one to focus on first.',
        },
      ],
    },
    {
      id: 'm1-r5-q2',
      kind: 'recall',
      source: '1.5',
      stem: 'Empathy, as defined in this section, means:',
      options: [
        {
          id: 'a',
          text: 'Agreeing with your team member’s perspective.',
          correct: false,
          feedback: 'Explicitly not. Empathy is not agreement.',
        },
        {
          id: 'b',
          text: 'Softening hard decisions to spare people’s feelings.',
          correct: false,
          feedback: 'Also explicitly ruled out. Empathy does not change the feedback.',
        },
        {
          id: 'c',
          text: 'Understanding where someone is coming from before you respond to them.',
          correct: true,
          feedback:
            'It does not change the feedback. It changes the conversation, and the outcome.',
        },
        {
          id: 'd',
          text: 'Feeling the same emotion your team member is feeling.',
          correct: false,
          feedback: 'That is emotional mirroring. The working definition here is about understanding, then responding.',
        },
      ],
    },
    {
      id: 'm1-r5-q3',
      kind: 'scenario',
      source: '1.5',
      stem: 'An employee makes a costly mistake and you feel your frustration spike. Applying self-regulation, what happens next?',
      options: [
        {
          id: 'a',
          text: 'You suppress the frustration and act as if nothing happened.',
          correct: false,
          feedback:
            'Suppression is not regulation. Section 1.4 is clear that your team sees through the performance.',
        },
        {
          id: 'b',
          text: 'You name the emotion internally, create a few seconds of space, and choose a response based on what the situation needs.',
          correct: true,
          feedback: 'Naming it gives you power over it. Even a few seconds changes everything.',
        },
        {
          id: 'c',
          text: 'You address it immediately while the details are fresh, however you are feeling.',
          correct: false,
          feedback:
            'Speed is not the priority here. The same conversation an hour later, regulated, goes very differently.',
        },
        {
          id: 'd',
          text: 'You wait until your next scheduled one-on-one, whenever that is.',
          correct: false,
          feedback:
            'Creating space is a matter of seconds or hours, not weeks. Delay this long and the moment is gone.',
        },
      ],
    },
  ],
};
