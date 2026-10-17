import type { Section } from '../types.js';

/**
 * 1.7 — Leading by Example and Acting Like an Owner
 * Script status: APPROVED & LOCKED (April 2026). Beats are verbatim.
 *
 * "Servant Leadership" is retained as written. It is a descriptive concept in
 * general use (Greenleaf, 1970) with no live registration blocking descriptive
 * use in training content — logged under § Cleared in the IP punch list rather
 * than as a deviation.
 */
export const section07: Section = {
  id: 'm1-s7',
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

  /*
   * Apply: the real workplace task for this section.
   *
   * One task, not a menu. Nothing here is marked — the app cannot see whether
   * this actually happened — so it states the task precisely, says what doing
   * it well looks like, and comes back to ask.
   */
  apply: {
    id: 'm1-s7-apply',
    title: 'Stop tolerating one thing',
    task:
      'Name one standard your team has drifted on that you have been letting go. Model it yourself, visibly, this week — then address it with the team once, plainly.',
    lookFor: [
      'The standard named, and honest about how long it has been slipping',
      'One occasion your team saw you hold it yourself',
      'The conversation held once and clearly, not hinted at repeatedly',
    ],
    withinDays: 7,
    managerPrompt:
      'What standard have you set for the team that you are finding hardest to hold yourself to?',
  },

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



  /*
   * Section quiz, ten questions drawn from this section's script.
   *
   * NOT from the approved quiz document, which stops after 1.2. Every stem,
   * option and line of feedback below is ours, written against the beats.
   */
  quiz: [
    {
      id: 'm1-s7-q1',
      kind: 'recall',
      format: 'multiple_choice',
      source: '1.7',
      stem: 'What does the section say your team is really paying attention to?',
      options: [
        { id: 'a', text: 'What you say about standards and values', correct: false, feedback: 'The section says the speech, the poster and the talk all lose to behaviour.' },
        { id: 'b', text: 'What you do — and if your behaviour and your words disagree, they follow your behaviour', correct: true, feedback: 'Every single time, as the section puts it.' },
        { id: 'c', text: 'What senior leadership says about you', correct: false, feedback: 'The section is about what your own team observes directly.' },
        { id: 'd', text: 'How hard you work compared with them', correct: false, feedback: 'Effort is not the measure here. Alignment between words and actions is.' },
      ],
    },
    {
      id: 'm1-s7-q2',
      kind: 'recall',
      format: 'multiple_choice',
      source: '1.7',
      stem: 'According to the section, leading by example is NOT about which of these?',
      options: [
        { id: 'a', text: 'Being consistent', correct: false, feedback: 'Consistency is exactly what the section asks for.' },
        { id: 'b', text: 'Being perfect and never making mistakes', correct: true, feedback: 'The section says plainly that it is not about being perfect or always having the right answer.' },
        { id: 'c', text: 'Holding yourself to the same standards you hold your team', correct: false, feedback: 'That is part of the definition the section gives.' },
        { id: 'd', text: 'Being visible about it', correct: false, feedback: 'The section asks you to be visible, not just internally consistent.' },
      ],
    },
    {
      id: 'm1-s7-q3',
      kind: 'recall',
      format: 'multiple_choice',
      source: '1.7',
      stem: 'How does the section describe credibility?',
      options: [
        { id: 'a', text: 'Earned through alignment between what you say and what you do, and lost fast when they do not match', correct: true, feedback: 'The team notices the late arrival, the skipped process, the talk about transparency without the transparency.' },
        { id: 'b', text: 'Granted by the title you were given', correct: false, feedback: '1.1 and 1.3 both argue the opposite: the title does not carry it.' },
        { id: 'c', text: 'Built mainly through technical expertise', correct: false, feedback: 'That is the doer trap from 1.2.' },
        { id: 'd', text: 'Something you only lose through a major failure', correct: false, feedback: 'The section is specific that it goes fast, and gives small examples.' },
      ],
    },
    {
      id: 'm1-s7-q4',
      kind: 'recall',
      format: 'multiple_choice',
      source: '1.7',
      stem: 'What does "acting like an owner" mean in this section?',
      options: [
        { id: 'a', text: 'Having equity in the business', correct: false, feedback: 'The section rules this out in its first line on the subject.' },
        { id: 'b', text: 'Making every decision yourself', correct: false, feedback: 'Also ruled out explicitly.' },
        { id: 'c', text: 'Thinking beyond your immediate task, caring about outcomes, and treating the business’s time, money and people as if they were your own', correct: true, feedback: 'Outcomes rather than outputs, and resources treated with that kind of respect.' },
        { id: 'd', text: 'Working the longest hours on the team', correct: false, feedback: 'The section explicitly separates busy from effective.' },
      ],
    },
    {
      id: 'm1-s7-q5',
      kind: 'recall',
      format: 'multiple_choice',
      source: '1.7',
      stem: 'Which of these is NOT one of the four day-to-day behaviours of acting like an owner?',
      options: [
        { id: 'a', text: 'You see what needs doing and address it, without waiting to be told', correct: false, feedback: 'Listed first.' },
        { id: 'b', text: 'You think about impact, not just activity', correct: false, feedback: 'Listed. Busy is not the same as effective.' },
        { id: 'c', text: 'You make yourself available to the team at any hour', correct: true, feedback: 'The section does not ask for this. It asks you to protect the team’s time and energy, which is close to the opposite.' },
        { id: 'd', text: 'You take responsibility for outcomes, not just effort', correct: false, feedback: 'Listed last.' },
      ],
    },
    {
      id: 'm1-s7-q6',
      kind: 'recall',
      format: 'multiple_choice',
      source: '1.7',
      stem: 'How does the section summarise Servant Leadership?',
      options: [
        { id: 'a', text: 'Your job is to clear the path, not stand in it', correct: true, feedback: 'Remove the obstacles, give the team what they need, put their development and success at the centre.' },
        { id: 'b', text: 'Your job is to be served by the team now that you have been promoted', correct: false, feedback: 'The section raises that instinct and rejects it.' },
        { id: 'c', text: 'Your job is to make every decision so the team does not have to', correct: false, feedback: 'That is not what the section describes.' },
        { id: 'd', text: 'Your job is to keep the team comfortable', correct: false, feedback: 'Comfort is not the aim. 1.3 is explicit that being liked is not the goal.' },
      ],
    },
    {
      id: 'm1-s7-q7',
      kind: 'recall',
      format: 'multiple_choice',
      source: '1.7',
      stem: 'What does the section say about managers who spend their energy protecting their authority and hoarding information?',
      options: [
        { id: 'a', text: 'Their teams underperform', correct: true, feedback: 'And the managers who spend their energy enabling, developing and clearing the path get the results.' },
        { id: 'b', text: 'Their teams are more disciplined', correct: false, feedback: 'The section argues the opposite outcome.' },
        { id: 'c', text: 'They are more likely to be promoted again', correct: false, feedback: 'The section makes no claim about their careers, only about their teams.' },
        { id: 'd', text: 'They burn out faster than other managers', correct: false, feedback: 'Plausible, but not what the section says. It says their teams underperform.' },
      ],
    },
    {
      id: 'm1-s7-q8',
      kind: 'recall',
      format: 'multiple_choice',
      source: '1.7',
      stem: 'Complete the section’s line: "What you tolerate becomes ___."',
      options: [
        { id: 'a', text: 'the standard', correct: false, feedback: 'Close. What you *model* becomes the standard. What you tolerate becomes the norm.' },
        { id: 'b', text: 'the norm', correct: true, feedback: 'One of four: what you model becomes the standard, what you tolerate becomes the norm, what you reward you get more of, and what you ignore tells the team what does not matter.' },
        { id: 'c', text: 'the exception', correct: false, feedback: 'The section’s point is that it stops being an exception.' },
        { id: 'd', text: 'the culture you intended', correct: false, feedback: 'The section warns that culture forms whether you intended it or not.' },
      ],
    },
    {
      id: 'm1-s7-q9',
      kind: 'recall',
      format: 'multiple_choice',
      source: '1.7',
      stem: 'What does the section say about a new manager’s first ninety days?',
      options: [
        { id: 'a', text: 'They are a grace period in which mistakes do not count', correct: false, feedback: 'The section treats them as the opposite of a grace period.' },
        { id: 'b', text: 'They set patterns that are very hard to undo, and the culture you build or allow becomes the baseline', correct: true, feedback: 'Which is why the section asks you to do it deliberately rather than by default.' },
        { id: 'c', text: 'They matter less than the first year overall', correct: false, feedback: 'The section singles the early period out precisely because it is disproportionate.' },
        { id: 'd', text: 'They should be spent observing without changing anything', correct: false, feedback: 'The section asks for deliberate action, not a holding pattern.' },
      ],
    },
    {
      id: 'm1-s7-q10',
      kind: 'scenario',
      format: 'multiple_choice',
      source: '1.7',
      stem: 'You have told the team that meetings start on time. You arrive five minutes late to one. What does the section say happens?',
      options: [
        { id: 'a', text: 'Nothing, as long as you apologise', correct: false, feedback: 'The section does not offer an apology as the fix.' },
        { id: 'b', text: 'They notice — and your behaviour, not your instruction, becomes the standard', correct: true, feedback: 'Credibility is lost fast when what you say and what you do stop matching.' },
        { id: 'c', text: 'It only matters if it becomes a pattern', correct: false, feedback: 'The section gives this exact example as something noticed in the moment.' },
        { id: 'd', text: 'The team assumes you had a good reason', correct: false, feedback: 'The section says they notice, not that they excuse it.' },
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
