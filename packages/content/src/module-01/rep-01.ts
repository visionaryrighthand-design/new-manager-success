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

  beats: [
    {
      id: 'b1',
      type: 'avatar',
      direction: 'full screen, direct to camera',
      speech:
        "Congratulations on your promotion.\n\nYou've worked hard for this. You've been performing at a high level, and someone noticed. That's real, and it matters.\n\nBut here's what most people don't tell you when they hand you that new title:\n\nThe job you just accepted? Nobody actually trained you for it.",
      // Rendered in Synthesia, hosted on Supabase public storage. The source
      // filename is the working title of the clip, not the beat id — the id
      // that matters is `m1-r1-b1` above, which is what the shot list tracks.
      videoUrl:
        'https://rhteswkgmndgijpllvjt.supabase.co/storage/v1/object/public/videos/New%20Manager%20Success/The%20Untold%20Truth%20About%20Your%20New%20Promotion.mp4',
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
        "Most promotions into management follow the same pattern. A talented employee does exceptional work. Leadership notices. They get promoted — usually because they're the best at what they do.\n\nAnd then they're handed a team, maybe a pay increase, and expected to figure out the rest. No roadmap. No instruction manual. No real preparation.\n\nThe title is visible. The new paycheck is visible. But the actual job description of “manager” — what it truly requires of you — that part is invisible. And you're expected to just... know.",
    },
    {
      id: 'b3',
      type: 'avatar',
      direction: 'full screen',
      speech:
        "Let's talk about what actually changed when you got promoted.\n\nBefore, your success depended almost entirely on you. Your effort, your skill, your output. You controlled it. If you worked harder or smarter, results improved. Simple equation.\n\nNow? Your success depends on a group of people — people with different strengths, different motivations, and different ideas about what a productive day looks like. You can't do the work for them. You have to lead them to do it well.\n\nThat's a fundamentally different challenge. And most new managers walk into it believing at least one of these three things.",
      videoUrl:
        'https://rhteswkgmndgijpllvjt.supabase.co/storage/v1/object/public/videos/New%20Manager%20Success/From%20Solo%20Star%20to%20Team%20Leader_%20Navigating%20Your%20First%20Promotion%20(1).mp4',
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
        "All three of those will get you in trouble.\n\nYour old manager's style was built for their context — not yours. Your track record impresses leadership, not necessarily your team. And trying to do both jobs at once usually means doing neither one well.\n\nHere's what happens when a manager steps in without the right preparation.",
      // Filename is b3's title — a Synthesia project duplicated rather than
      // renamed. Content confirmed correct by the author.
      videoUrl:
        'https://rhteswkgmndgijpllvjt.supabase.co/storage/v1/object/public/videos/New%20Manager%20Success/Copy%20of%20From%20Solo%20Star%20to%20Team%20Leader_%20Navigating%20Your%20First%20Promotion.mp4',
    },
    {
      id: 'b7',
      type: 'buildList',
      direction: 'avatar steps back, items build on screen',
      items: [
        'Teams disengage.',
        'High performers start looking for the door.',
        'Productivity drops. Conflict increases.',
        'In a small business — every single one of these hits harder.',
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
        "That's a significant responsibility. But it's also a significant opportunity — because when you get this right, you can build something remarkable.\n\nHere's the reframe this entire program is built on.\n\nYou were promoted because you were great at your job. That's your starting point — not your finish line. The skills that made you an exceptional doer are different from the skills that will make you an exceptional manager.",
      // b12 still carries this same URL, so cards 9 and 11 play one file.
      // Swap b12's when its own render is uploaded.
      videoUrl:
        'https://rhteswkgmndgijpllvjt.supabase.co/storage/v1/object/public/videos/New%20Manager%20Success/Copy%20of%20From%20Solo%20Star%20to%20Team%20Leader_%20Navigating%20Your%20First%20Promotion%20(1).mp4',
    },
    {
      id: 'b11',
      type: 'overlay',
      text: 'Those skills can be learned. That’s what this program is for.',
      speech:
        "You're not behind. You're not failing. You're at the beginning of a new game — and now you know the rules are different.",
      videoUrl:
        'https://rhteswkgmndgijpllvjt.supabase.co/storage/v1/object/public/videos/New%20Manager%20Success/Copy%20of%20From%20Solo%20Star%20to%20Team%20Leader_%20Navigating%20Your%20First%20Promotion%20(2).mp4',
    },
    {
      id: 'b12',
      type: 'avatar',
      direction: 'full screen, direct close',
      speech:
        "In the next section, we're going to dig into exactly why high performers often struggle the most when they step into management — and what the shift from doing to leading actually looks like in practice.\n\nLet's keep going.",
      // Same URL as b10 — see the note there.
      videoUrl:
        'https://rhteswkgmndgijpllvjt.supabase.co/storage/v1/object/public/videos/New%20Manager%20Success/Copy%20of%20From%20Solo%20Star%20to%20Team%20Leader_%20Navigating%20Your%20First%20Promotion%20(1).mp4',
    },
  ],

  curveballs: [
    {
      id: 'm1-r1-cb1',
      triggerAfterBeat: 'b5',
      skill: 'Separating your old job from your new one',
      scenario:
        'It is week two. Your old workload has not been reassigned yet, and your calendar now also has four one-on-ones on it. Something is going to slip this week.',
      prompt: 'What do you do first?',
      choices: [
        {
          id: 'a',
          text: 'Absorb it. Work late until the old work is finished, then start managing properly.',
          verdict: 'costly',
          response:
            'This is Myth #3 in action. It works for about three weeks, and the whole time your team is learning that you are unavailable. The old work is also the easier work — that is exactly why it is tempting.',
        },
        {
          id: 'b',
          text: 'Take the list of your old responsibilities to your boss and agree what moves, what gets dropped, and by when.',
          verdict: 'best',
          response:
            'The overlap is a real problem and it is not yours alone to solve. Naming it early, with a specific list, is a manager move. Waiting until something breaks is a doer move.',
        },
        {
          id: 'c',
          text: 'Push the one-on-ones to next month so you can clear the decks.',
          verdict: 'costly',
          response:
            'The tone you set in the first few weeks is the tone that sticks. Cancelling your first one-on-ones tells the team where they rank before you have said a word.',
        },
        {
          id: 'd',
          text: 'Hand the old work to your team and see how it goes.',
          verdict: 'workable',
          response:
            'Right instinct, incomplete execution. Handing work over without context, expectations, or a check-in point is not delegation — it is disposal. Module 3 takes this apart properly.',
        },
      ],
    },
  ],

  fieldNote: {
    id: 'm1-r1-fn1',
    topic: 'The invisible promotion',
    prompt:
      'What is one thing about your new role that nobody actually explained to you?',
    placeholder: 'Two or three sentences is plenty.',
    suggestedMinChars: 60,
  },

  quiz: [
    {
      id: 'm1-r1-q1',
      kind: 'recall',
      source: '1.1',
      stem: 'What makes the promotion into management “invisible”?',
      options: [
        {
          id: 'a',
          text: 'The pay increase is usually kept confidential.',
          correct: false,
          feedback: 'Not the point being made. The invisibility is about the job itself, not the compensation.',
        },
        {
          id: 'b',
          text: 'The title and the pay are visible, but what the job actually requires of you is never spelled out.',
          correct: true,
          feedback:
            'Exactly. The visible part is handed to you. The actual job description is the part you are expected to somehow already know.',
        },
        {
          id: 'c',
          text: 'Most new managers are not told they have been promoted until later.',
          correct: false,
          feedback: 'The promotion is announced. It is the requirements of the role that go unstated.',
        },
        {
          id: 'd',
          text: 'Managers work behind the scenes, so their contribution is harder to see.',
          correct: false,
          feedback:
            'True of the job over time, but not what “invisible promotion” refers to here.',
        },
      ],
    },
    {
      id: 'm1-r1-q2',
      kind: 'recall',
      source: '1.1',
      stem: 'Which of these is one of the three myths new managers commonly believe?',
      options: [
        {
          id: 'a',
          text: '“My team will respect me because of my track record.”',
          correct: true,
          feedback:
            'Your track record impresses the people who promoted you. Your team is watching something else entirely.',
        },
        {
          id: 'b',
          text: '“I should change everything in my first week.”',
          correct: false,
          feedback: 'A real risk, but not one of the three myths named in this section.',
        },
        {
          id: 'c',
          text: '“My team will tell me when something is wrong.”',
          correct: false,
          feedback: 'Comes up later in the course, but not one of the three myths here.',
        },
        {
          id: 'd',
          text: '“Management is mostly paperwork.”',
          correct: false,
          feedback: 'Not one of the three myths named in this section.',
        },
      ],
    },
    {
      id: 'm1-r1-q3',
      kind: 'scenario',
      source: '1.1',
      stem: 'A newly promoted manager says: “I’m going to run this team exactly the way my old boss ran it — she was great.” What is the risk?',
      options: [
        {
          id: 'a',
          text: 'None. Copying a manager who was effective is the safest starting point.',
          correct: false,
          feedback:
            'It feels safe, which is why it is myth #1. A style that worked elsewhere is not automatically portable.',
        },
        {
          id: 'b',
          text: 'Her style was built for her context, her team, and her strengths — not yours.',
          correct: true,
          feedback:
            'Borrow the principles. Do not clone the person. The context that made her style work is not the context you are in.',
        },
        {
          id: 'c',
          text: 'The team will notice the imitation and find it funny.',
          correct: false,
          feedback: 'Possibly, but the substantive problem is the mismatch of style to context.',
        },
        {
          id: 'd',
          text: 'It takes too long to learn someone else’s methods.',
          correct: false,
          feedback: 'Time is not the issue. Fit is.',
        },
      ],
    },
  ],
};
