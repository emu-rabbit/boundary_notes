import { describe, expect, it } from 'vitest';
import type { AnsweredSecretFileAnswer } from '../secret-file';
import { getQuestionnaireMessages, getResultsAnswerSummary } from './messages';

const messages = getQuestionnaireMessages('zh-Hant');

function answer(
  experience: AnsweredSecretFileAnswer['experience'],
  preference: AnsweredSecretFileAnswer['preference'],
): AnsweredSecretFileAnswer {
  return { experience, note: '', preference, state: 'answered' };
}

describe('getResultsAnswerSummary', () => {
  it('identifies preference-only see-details answers', () => {
    expect(getResultsAnswerSummary(messages, answer('some', 'seeDetails')))
      .toBe('經驗一些，喜好參考詳細');
  });

  it('identifies experience-only see-details answers', () => {
    expect(getResultsAnswerSummary(messages, answer('seeDetails', 'like')))
      .toBe('經驗參考詳細，喜歡');
  });

  it('collapses two see-details answers to one shared label', () => {
    expect(getResultsAnswerSummary(messages, answer('seeDetails', 'seeDetails')))
      .toBe('參考詳細');
  });
});
