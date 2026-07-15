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

describe('cloud upload protection messages', () => {
  it('uses an intentionally approximate reset time in every locale', () => {
    expect(getQuestionnaireMessages('zh-Hant').results.uploadRateLimited('40 分鐘'))
      .toBe('已達目前的上傳次數上限，約40 分鐘後重置。');
    expect(getQuestionnaireMessages('zh-Hans').results.uploadRateLimited('40 分钟'))
      .toBe('已达到当前的上传次数上限，约40 分钟后重置。');
    expect(getQuestionnaireMessages('ja').results.uploadRateLimited('40分'))
      .toBe('現在のアップロード上限に達しました。約40分後にリセットされます。');
    expect(getQuestionnaireMessages('en').results.uploadRateLimited('40 minutes'))
      .toBe('The current upload limit will reset in about 40 minutes.');
  });
});
