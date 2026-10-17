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

  /*
   * Shot and exported in two files. Listed in running order — part 1 (rev19)
   * then part 2 (rev25) — which is not the order they were handed over in,
   * and the revision numbers do not order them either, so the part number in
   * the filename is the authority.
   *
   * The lesson is still one lesson: both parts play, then the quiz follows.
   *
   * NOT VERIFIED FROM THE BUILD ENVIRONMENT: supabase.co is blocked by this
   * container's network policy, so neither URL has been fetched here.
   */
  videoParts: [
    {
      url: 'https://rhteswkgmndgijpllvjt.supabase.co/storage/v1/object/public/videos/module-1-3-the-relationship-reset-part-1-rev19-1080x1920-30fps.mp4',
      /*
       * Knowledge check between the two parts.
       *
       * Drawn from the opening of the script — the relationship shift, the
       * "not liked, but trusted and respected" line, and the approval-seeking
       * trap — because those land in the first half wherever exactly the cut
       * falls. Nothing here depends on material from the back half, so the
       * check stays answerable even if the split is not where it is assumed
       * to be. Worth re-reading against part 1 once it can be watched.
       *
       * Framed differently from the questions in the section quiz that cover
       * the same ground. Being asked the same thing twice in two ways is
       * retrieval practice; being asked the identical question twice is a
       * copy-paste.
       */
      check: [
        {
          id: 'm1-s3-c1',
          kind: 'recall',
          format: 'multiple_choice',
          source: '1.3',
          stem: 'What does the section say has changed, now that you hold the title?',
          options: [
            { id: 'a', text: 'The nature of your relationships with the people around you', correct: true, feedback: 'It changed whether you wanted it to or not, and how you navigate it affects your ability to lead.' },
            { id: 'b', text: 'Nothing, if you keep behaving the way you always have', correct: false, feedback: 'The section says pretending nothing changed is what creates the problems.' },
            { id: 'c', text: 'How much your colleagues like you', correct: false, feedback: 'Being liked is not the measure the section uses.' },
            { id: 'd', text: 'The quality of the work the team produces', correct: false, feedback: 'That is a consequence, not the thing the section says changed on day one.' },
          ],
        },
        {
          id: 'm1-s3-c2',
          kind: 'scenario',
          format: 'multiple_choice',
          source: '1.3',
          stem: 'A new manager keeps putting off critical feedback for a former peer because they do not want things to get awkward. What is this?',
          options: [
            { id: 'a', text: 'Good judgement about timing', correct: false, feedback: 'The section names avoided hard conversations as the first cost of the trap, not as judgement.' },
            { id: 'b', text: 'Approval-seeking', correct: true, feedback: 'Deciding by what keeps people comfortable rather than what is right for the team is exactly the trap the section describes.' },
            { id: 'c', text: 'Delegation', correct: false, feedback: 'Nothing is being handed to anyone. A conversation is being avoided.' },
            { id: 'd', text: 'Maintaining team morale', correct: false, feedback: 'The section argues the opposite: the team gradually loses confidence.' },
          ],
        },
        {
          id: 'm1-s3-c3',
          kind: 'recall',
          format: 'true_false',
          source: '1.3',
          stem: 'Resetting the relationship means becoming more distant and less approachable with your team.',
          options: [
            { id: 'true', text: 'True', correct: false, feedback: 'The section is explicit that this does not mean becoming cold, distant, or unapproachable.' },
            { id: 'false', text: 'False', correct: true, feedback: 'The section is explicit that this does not mean becoming cold, distant, or unapproachable. What changes is the nature of the relationship, not the warmth.' },
          ],
        },
      ],
    },
    {
      url: 'https://rhteswkgmndgijpllvjt.supabase.co/storage/v1/object/public/videos/module-1-3-the-relationship-reset-part-2-rev25-1080x1920-30fps.mp4',
    },
  ],
  topics: [
    'managing former peers',
    'approval seeking',
    'earning respect',
    'boundaries',
    'setting the tone early',
  ],

  /*
   * Apply: the real workplace task for this section.
   *
   * One task, not a menu. Nothing here is marked — the app cannot see whether
   * this actually happened — so it states the task precisely, says what doing
   * it well looks like, and comes back to ask.
   */
  apply: {
    id: 'm1-s3-apply',
    title: 'Have the conversation you have been working around',
    task:
      'Identify the one working relationship you have been managing around rather than managing. Say the thing you have been avoiding, and name out loud that the relationship has changed.',
    lookFor: [
      'The conversation actually happened, face to face or on a call',
      'You said the uncomfortable part rather than hinting at it',
      'You left with one clear expectation both of you agreed to',
    ],
    withinDays: 7,
    managerPrompt:
      'Which working relationship have you had to renegotiate since the promotion, and how did that conversation go?',
  },

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



  /*
   * Section quiz, ten questions drawn from this section's script.
   *
   * NOT from the approved quiz document, which stops after 1.2. Every stem,
   * option and line of feedback below is ours, written against the beats and
   * going no further than what the script actually says. Recorded as a
   * contentAddition with status 'proposed' so it reaches the author for
   * sign-off rather than quietly becoming canon.
   */
  quiz: [
    {
      id: 'm1-s3-q1',
      kind: 'recall',
      format: 'multiple_choice',
      source: '1.3',
      stem: 'According to the section, what changes the day you are promoted, whether you wanted it to or not?',
      options: [
        { id: 'a', text: 'Your workload', correct: false, feedback: 'The section is about relationships, not volume of work.' },
        { id: 'b', text: 'Your relationships with the people you used to work alongside', correct: true, feedback: 'The colleagues you vented to, the friends you had lunch with, the peers who felt like teammates: that dynamic has shifted.' },
        { id: 'c', text: 'Your technical skills', correct: false, feedback: 'Your skills are unchanged. What changed is the dynamic with the people around you.' },
        { id: 'd', text: 'Your working hours', correct: false, feedback: 'The section does not claim your hours change. It says your relationships do.' },
      ],
    },
    {
      id: 'm1-s3-q2',
      kind: 'recall',
      format: 'multiple_choice',
      source: '1.3',
      stem: 'The section says the goal is not to be liked. What is the goal?',
      options: [
        { id: 'a', text: 'To be obeyed', correct: false, feedback: 'Compliance is not what the section asks for. Trust and respect are.' },
        { id: 'b', text: 'To be feared', correct: false, feedback: 'The section explicitly says this does not mean becoming cold or distant.' },
        { id: 'c', text: 'To be trusted and respected', correct: true, feedback: 'And the section notes those two are built very differently from being liked.' },
        { id: 'd', text: 'To be left alone to do your own work', correct: false, feedback: 'That is the doer trap from 1.2, not the relationship reset.' },
      ],
    },
    {
      id: 'm1-s3-q3',
      kind: 'recall',
      format: 'multiple_choice',
      source: '1.3',
      stem: 'How does the section define approval-seeking?',
      options: [
        { id: 'a', text: 'Asking your manager to sign off on decisions', correct: false, feedback: 'Approval-seeking here is about your team, not your own manager.' },
        { id: 'b', text: 'Making decisions based on what will make people like you rather than what is right for the team', correct: true, feedback: 'The section calls it one of the most costly traps a new manager can fall into.' },
        { id: 'c', text: 'Running every decision past the whole team first', correct: false, feedback: 'Consulting the team is not the trap. Deciding by who it pleases is.' },
        { id: 'd', text: 'Avoiding decisions altogether', correct: false, feedback: 'Avoidance is a symptom the section lists, not the definition.' },
      ],
    },
    {
      id: 'm1-s3-q4',
      kind: 'recall',
      format: 'multiple_choice',
      source: '1.3',
      stem: 'Which of the following is NOT listed as a cost of approval-seeking?',
      options: [
        { id: 'a', text: 'Avoided hard conversations', correct: false, feedback: 'This is the first cost the section lists.' },
        { id: 'b', text: 'Inconsistent standards, different rules for different people', correct: false, feedback: 'This is listed. The section later notes favouritism is always visible.' },
        { id: 'c', text: 'Higher staff turnover in the first month', correct: true, feedback: 'The section does not claim this. The four costs are avoided conversations, inconsistent standards, decisions made to keep the peace, and a team losing confidence.' },
        { id: 'd', text: 'Poor decisions made to keep the peace', correct: false, feedback: 'This is listed.' },
      ],
    },
    {
      id: 'm1-s3-q5',
      kind: 'scenario',
      format: 'multiple_choice',
      source: '1.3',
      stem: 'A team senses their manager is managing relationships rather than outcomes. What does the section say happens?',
      options: [
        { id: 'a', text: 'The team becomes more loyal', correct: false, feedback: 'The section says the opposite: the limits get tested.' },
        { id: 'b', text: 'Strong performers lose respect and struggling performers take advantage of the gap', correct: true, feedback: 'Both ends of the team move, in opposite directions, and neither is good.' },
        { id: 'c', text: 'Nothing changes until the next review cycle', correct: false, feedback: 'The section describes it as happening over time, through tested limits.' },
        { id: 'd', text: 'The team manages itself', correct: false, feedback: 'The section describes a loss of confidence, not self-management.' },
      ],
    },
    {
      id: 'm1-s3-q6',
      kind: 'recall',
      format: 'multiple_choice',
      source: '1.3',
      stem: 'Which of these does the section give as a way to earn respect?',
      options: [
        { id: 'a', text: 'Set clear expectations and hold them consistently for everyone', correct: true, feedback: 'The first of the four the section lists, alongside telling the truth, treating everyone fairly, and following through.' },
        { id: 'b', text: 'Keep your standards flexible so people do not feel pressured', correct: false, feedback: 'Inconsistent standards are named as a cost of approval-seeking.' },
        { id: 'c', text: 'Give your strongest performers more latitude than the rest', correct: false, feedback: 'The section says favouritism is always visible, even when you think it is not.' },
        { id: 'd', text: 'Avoid uncomfortable truths until you have built rapport', correct: false, feedback: 'The section asks you to tell the truth even when it is uncomfortable.' },
      ],
    },
    {
      id: 'm1-s3-q7',
      kind: 'recall',
      format: 'multiple_choice',
      source: '1.3',
      stem: 'The section describes respect as an account with deposits and withdrawals. What makes a deposit?',
      options: [
        { id: 'a', text: 'Being liked by the team', correct: false, feedback: 'Being liked is explicitly not the goal.' },
        { id: 'b', text: 'Following through on something you said you would do', correct: true, feedback: 'And every time you do not, that is a withdrawal. The balance is your credibility.' },
        { id: 'c', text: 'Taking work off your team when they are busy', correct: false, feedback: 'That belongs to the doer trap in 1.2.' },
        { id: 'd', text: 'Defending the team to senior leadership', correct: false, feedback: 'The section does not mention this. It describes respect as built in small, repeated moments of follow-through.' },
      ],
    },
    {
      id: 'm1-s3-q8',
      kind: 'recall',
      format: 'multiple_choice',
      source: '1.3',
      stem: 'What does "Friendly ≠ Friendship, Approachable ≠ Peer" mean in practice?',
      options: [
        { id: 'a', text: 'You should keep your distance from the team', correct: false, feedback: 'The section is explicit that this does not mean becoming cold, distant, or unapproachable.' },
        { id: 'b', text: 'You can be warm and approachable without being a confidant or a peer', correct: true, feedback: 'You can care genuinely about your team while keeping the professional clarity that makes you effective.' },
        { id: 'c', text: 'Friendships at work are unprofessional', correct: false, feedback: 'The section does not condemn friendship. It says the nature of this relationship has changed.' },
        { id: 'd', text: 'You should only socialise with other managers', correct: false, feedback: 'The section makes no such claim.' },
      ],
    },
    {
      id: 'm1-s3-q9',
      kind: 'recall',
      format: 'multiple_choice',
      source: '1.3',
      stem: 'Why does the section say the first few weeks as a manager matter so much?',
      options: [
        { id: 'a', text: 'Because your own manager is watching most closely then', correct: false, feedback: 'The section is about the team, not about being observed.' },
        { id: 'b', text: 'Because the tone you set in those weeks is the tone that sticks and becomes the team culture', correct: true, feedback: 'The standards you hold, the conversations you have, the line you draw: those early signals become the culture.' },
        { id: 'c', text: 'Because probation periods end after a month', correct: false, feedback: 'The section says nothing about probation.' },
        { id: 'd', text: 'Because you have the most authority before people get used to you', correct: false, feedback: 'The point is about the durability of early signals, not a window of authority.' },
      ],
    },
    {
      id: 'm1-s3-q10',
      kind: 'recall',
      format: 'multiple_choice',
      source: '1.3',
      stem: 'What does the section say is required of you, if not perfection?',
      options: [
        { id: 'a', text: 'To be deliberate', correct: true, feedback: 'You do not have to be perfect, but you do have to be deliberate. Culture is easier to build intentionally than to repair.' },
        { id: 'b', text: 'To be consistent about nothing in particular', correct: false, feedback: 'Consistency matters, but the word the section uses is deliberate.' },
        { id: 'c', text: 'To be the hardest worker on the team', correct: false, feedback: 'Out-working the team is the doer trap from 1.2.' },
        { id: 'd', text: 'To be available at all times', correct: false, feedback: 'Approachable is not the same as always available, and the section does not ask for this.' },
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
