import type { AppLocale } from '../../app/i18n';
import type { TimeMachineComparisonSectionId } from './timeMachineComparison';

export interface TimeMachineComparisonMessages {
  categoryOverall: string;
  close: string;
  compareAgain: string;
  earlier: string;
  emptyValue: string;
  experience: string;
  hardNoEntered: string;
  hardNoRemoved: string;
  lastEdited: string;
  later: string;
  noChanges: string;
  noChangesForRole: string;
  noEarlierRoleAnswers: (role: string) => string;
  noLaterRoleAnswers: (role: string) => string;
  note: string;
  originalProfileName: (name: string) => string;
  preference: string;
  scope: string;
  sections: Record<TimeMachineComparisonSectionId, string>;
  spotlightAdded: (newerRank: number) => string;
  spotlightMoved: (olderRank: number, newerRank: number) => string;
  spotlightRemoved: string;
  title: string;
  unknownQuestion: string;
  viewAll: (count: number) => string;
}

const messagesByLocale: Record<AppLocale, TimeMachineComparisonMessages> = {
  'zh-Hant': {
    categoryOverall: '分類整體',
    close: '關閉',
    compareAgain: '重新選擇檔案',
    earlier: '較早',
    emptyValue: '無',
    experience: '經驗',
    hardNoEntered: '新列為絕對禁止',
    hardNoRemoved: '已移出絕對禁止',
    lastEdited: '最後編輯',
    later: '較新',
    noChanges: '這兩份檔案沒有可共同比較的作答差異。',
    noChangesForRole: '目前方向沒有可共同比較的作答差異。',
    noEarlierRoleAnswers: (role) => `${role}在先前未有作答紀錄。`,
    noLaterRoleAnswers: (role) => `${role}在之後未有作答紀錄。`,
    note: '備註',
    originalProfileName: (name) => `原暱稱 ${name}`,
    preference: '喜好',
    scope: '範圍',
    sections: {
      spotlight: '焦點喜好的變動',
      category: '大分類本身的變動',
      hardNo: '絕對禁止的底線的變動',
      detail: '其他細項的變動',
    },
    spotlightAdded: (newerRank) => `加入焦點成為第 ${newerRank} 位`,
    spotlightMoved: (olderRank, newerRank) => `第 ${olderRank} 位 → 第 ${newerRank} 位`,
    spotlightRemoved: '移出焦點',
    title: '時光機比對',
    unknownQuestion: '目前題庫已無法辨識的舊項目',
    viewAll: (count) => `查看全部 ${count} 項`,
  },
  'zh-Hans': {
    categoryOverall: '分类整体',
    close: '关闭',
    compareAgain: '重新选择档案',
    earlier: '较早',
    emptyValue: '无',
    experience: '经验',
    hardNoEntered: '新列为绝对禁止',
    hardNoRemoved: '已移出绝对禁止',
    lastEdited: '最后编辑',
    later: '较新',
    noChanges: '这两份档案没有可共同比较的作答差异。',
    noChangesForRole: '目前方向没有可共同比较的作答差异。',
    noEarlierRoleAnswers: (role) => `${role}在先前没有作答记录。`,
    noLaterRoleAnswers: (role) => `${role}在之后没有作答记录。`,
    note: '备注',
    originalProfileName: (name) => `原昵称 ${name}`,
    preference: '喜好',
    scope: '范围',
    sections: {
      spotlight: '焦点喜好的变化',
      category: '大分类本身的变化',
      hardNo: '绝对禁止底线的变化',
      detail: '其他细项的变化',
    },
    spotlightAdded: (newerRank) => `加入焦点成为第 ${newerRank} 位`,
    spotlightMoved: (olderRank, newerRank) => `第 ${olderRank} 位 → 第 ${newerRank} 位`,
    spotlightRemoved: '移出焦点',
    title: '时光机比对',
    unknownQuestion: '目前题库已无法识别的旧项目',
    viewAll: (count) => `查看全部 ${count} 项`,
  },
  ja: {
    categoryOverall: 'カテゴリー全体',
    close: '閉じる',
    compareAgain: 'ファイルを選び直す',
    earlier: '以前',
    emptyValue: 'なし',
    experience: '経験',
    hardNoEntered: '新たに絶対不可になった項目',
    hardNoRemoved: '絶対不可から外れた項目',
    lastEdited: '最終編集',
    later: '現在',
    noChanges: '両方で回答済みの項目に、比較できる違いはありません。',
    noChangesForRole: '現在の方向には、両方で回答済みの項目に比較できる違いはありません。',
    noEarlierRoleAnswers: (role) => `${role}には以前の回答記録がありません。`,
    noLaterRoleAnswers: (role) => `${role}にはその後の回答記録がありません。`,
    note: 'メモ',
    originalProfileName: (name) => `以前のニックネーム ${name}`,
    preference: '好み',
    scope: '範囲',
    sections: {
      spotlight: '注目してほしい好みの変化',
      category: '大きなカテゴリーの変化',
      hardNo: '絶対に不可とする境界線の変化',
      detail: 'その他の細目の変化',
    },
    spotlightAdded: (newerRank) => `注目項目に加わり${newerRank}位へ`,
    spotlightMoved: (olderRank, newerRank) => `${olderRank}位 → ${newerRank}位`,
    spotlightRemoved: '注目項目から削除',
    title: 'タイムマシン比較',
    unknownQuestion: '現在の質問集では確認できない旧項目',
    viewAll: (count) => `全${count}件を見る`,
  },
  en: {
    categoryOverall: 'Category overall',
    close: 'Close',
    compareAgain: 'Choose different files',
    earlier: 'Earlier',
    emptyValue: 'None',
    experience: 'Experience',
    hardNoEntered: 'Now absolutely prohibited',
    hardNoRemoved: 'Removed from absolutely prohibited',
    lastEdited: 'Last edited',
    later: 'Later',
    noChanges: 'There are no differences among items answered in both files.',
    noChangesForRole: 'There are no differences among items answered in both files for this direction.',
    noEarlierRoleAnswers: (role) => `${role} has no answers in the earlier file.`,
    noLaterRoleAnswers: (role) => `${role} has no answers in the later file.`,
    note: 'Note',
    originalProfileName: (name) => `Previous nickname ${name}`,
    preference: 'Preference',
    scope: 'Scope',
    sections: {
      spotlight: 'Spotlight preference changes',
      category: 'Category-level changes',
      hardNo: 'Absolutely prohibited boundary changes',
      detail: 'Other item changes',
    },
    spotlightAdded: (newerRank) => `Added to spotlight at No. ${newerRank}`,
    spotlightMoved: (olderRank, newerRank) => `No. ${olderRank} → No. ${newerRank}`,
    spotlightRemoved: 'Removed from spotlight',
    title: 'Time machine comparison',
    unknownQuestion: 'Older item unavailable in the current question bank',
    viewAll: (count) => `View all ${count}`,
  },
};

export function getTimeMachineComparisonMessages(
  locale: AppLocale,
): TimeMachineComparisonMessages {
  return messagesByLocale[locale];
}
