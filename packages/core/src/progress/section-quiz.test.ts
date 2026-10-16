import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { module01 } from '@nms/content';
import {
  answerSubmitEvent,
  isCorrectOption,
  quizSubmitEvent,
  scoreSectionQuiz,
  sectionAttemptRow,
  sectionQuizXp,
  XP,
} from '../index.js';

const section = module01.sections.find((s) => s.id === 'm1-s1')!;
const AT = new Date('2026-10-16T12:00:00Z');

/** The correct option for every question, which is what a perfect run submits. */
function allCorrect() {
  return section.quiz.map((q) => ({
    questionId: q.id,
    optionId: q.options.find((o) => o.correct)!.id,
  }));
}

/** A wrong option for every question. */
function allWrong() {
  return section.quiz.map((q) => ({
    questionId: q.id,
    optionId: q.options.find((o) => !o.correct)!.id,
  }));
}

describe('section quiz scoring', () => {
  test('a perfect run is 100%', () => {
    const score = scoreSectionQuiz(section, allCorrect());
    assert.equal(score.scorePct, 100);
    assert.equal(score.correctCount, section.quiz.length);
  });

  test('every answer wrong is 0%', () => {
    assert.equal(scoreSectionQuiz(section, allWrong()).scorePct, 0);
  });

  test('an unanswered question counts against the score', () => {
    // Otherwise answering one question correctly and stopping scores 100%.
    const partial = allCorrect().slice(0, 1);
    const score = scoreSectionQuiz(section, partial);
    assert.equal(score.correctCount, 1);
    assert.equal(score.questionCount, section.quiz.length);
    assert.ok(score.scorePct < 100, `${score.scorePct}% for one of five answered`);
  });

  test('scores are whole percentages', () => {
    // Five questions divide into 20% steps; a stray float would reach the UI.
    for (let n = 0; n <= section.quiz.length; n++) {
      const { scorePct } = scoreSectionQuiz(section, allCorrect().slice(0, n));
      assert.equal(scorePct, Math.round(scorePct));
    }
  });

  test('an unknown option id is simply wrong, not a crash', () => {
    const score = scoreSectionQuiz(section, [{ questionId: 'q1', optionId: 'nope' }]);
    assert.equal(score.correctCount, 0);
  });
});

describe('section quizzes are ungated', () => {
  test('a failing score still awards the completion XP', () => {
    // No pass threshold: the 85% bar belongs to the module quiz. Scoring 0
    // and moving on is a supported outcome, not a blocked one.
    assert.equal(sectionQuizXp(false), XP.sectionCompleted);
  });

  test('XP is awarded once, not again on a retake', () => {
    assert.equal(sectionQuizXp(true), 0);
  });

  test('the attempt row carries no pass or fail verdict', () => {
    const row = sectionAttemptRow(section, 20, 1, AT);
    assert.equal('passed' in row, false);
  });
});

describe('recorded rows', () => {
  test('an attempt row is scoped to the section', () => {
    const row = sectionAttemptRow(section, 80, 3, AT);
    assert.deepEqual(row, {
      scope: 'section',
      module_id: 1,
      section_id: 'm1-s1',
      score_pct: 80,
      attempt_number: 3,
      at: AT.toISOString(),
    });
  });

  test('an answer event records which question and whether it was right', () => {
    const correctId = section.quiz[0]!.options.find((o) => o.correct)!.id;
    const row = answerSubmitEvent(section, section.quiz[0]!.id, correctId, AT);
    assert.equal(row.type, 'answer_submit');
    assert.equal(row.section_id, 'm1-s1');
    assert.equal(row.module_id, 1);
    assert.equal(row.question_id, section.quiz[0]!.id);
    assert.equal(row.correct, true);
  });

  test('a wrong answer is recorded as wrong rather than dropped', () => {
    const wrongId = section.quiz[0]!.options.find((o) => !o.correct)!.id;
    assert.equal(answerSubmitEvent(section, section.quiz[0]!.id, wrongId, AT).correct, false);
  });

  test('a submit event carries the score', () => {
    const row = quizSubmitEvent(section, 60, AT);
    assert.equal(row.type, 'quiz_submit');
    assert.equal(row.score_pct, 60);
    assert.equal(row.question_id, undefined);
  });
});

describe('option correctness', () => {
  test('agrees with the content for every option of every question', () => {
    for (const q of section.quiz) {
      for (const o of q.options) {
        assert.equal(isCorrectOption(section, q.id, o.id), o.correct, `${q.id}/${o.id}`);
      }
    }
  });

  test('an unknown question is not correct', () => {
    assert.equal(isCorrectOption(section, 'does-not-exist', 'a'), false);
  });
});
