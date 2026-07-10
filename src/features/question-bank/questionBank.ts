import { isRoleIncludedInScope } from '../secret-file';
import type { QuestionRole, SecretFileScope } from '../secret-file';
import type {
  CategoryQuestion,
  CategoryQuestionsByScope,
  QuestionBank,
  QuestionBankCategory,
  QuestionBankCounts,
} from './types';

function category(
  categoryId: string,
  name: string,
  activeDescription: string,
  passiveDescription: string,
  itemCount: number,
  includeInCategoryRound = true,
): QuestionBankCategory {
  return {
    categoryId,
    includeInCategoryRound,
    itemCount,
    name,
    roles: {
      active: {
        description: activeDescription,
      },
      passive: {
        description: passiveDescription,
      },
    },
    sourceSheetName: name,
  };
}

export const questionBank: QuestionBank = {
  bankVersion: '2026-07-09',
  schemaVersion: 1,
  source: {
    fileId: '1shrEavMkoumIpe07vL3DXp0uj7tcHzqgPV6qzU6jvAE',
    kind: 'google-sheet',
    modifiedTime: '2026-07-09T07:33:31.469Z',
    title: 'BDSM boundary test items',
  },
  categories: [
    category('impact_spanking', '拍打類項目', '對對方進行包含打屁股在內的拍打相關衝擊遊戲', '接受包含打屁股在內的拍打相關衝擊遊戲', 24),
    category('whipping', '鞭打類項目', '對對方進行鞭打相關衝擊遊戲', '接受鞭打相關的衝擊遊戲', 15),
    category('bondage', '束縛類項目', '使用繩子或各種道具將對方拘束並限制行動的項目', '被繩子或各種道具拘束並限制行動的項目', 19),
    category('tickling', '搔癢類項目', '用手或各種道具，以造成對方癢感為目標的項目', '被對方用手或各種道具搔癢，以造成自身癢感為目標的項目', 16),
    category('pain_stimulation', '疼痛刺激類項目', '施予乳夾、滴蠟、電擊等疼痛刺激相關項目', '接受乳夾、滴蠟、電擊等疼痛刺激相關項目', 19),
    category('humiliation', '羞辱類項目', '用語言或行為貶低對方，或造成對方羞辱感的項目', '在語言或行為上被貶低，或感受到羞辱感的項目', 9),
    category('service', '服侍類項目', '接受各種服務，用以滿足自己生活所需或慾望', '提供各種服務，用以滿足對方生活所需或慾望', 11),
    category('discipline', '管教類項目', '限制或立下規範，以訓練並達成目標為主的項目', '接受限制或規範，並以訓練、改善或達成目標為主的項目', 12),
    category('sexual_interaction', '性愛類項目', '與性器官互動相關的項目', '與性器官互動相關的項目', 21),
    category('anal_interaction', '肛門類項目', '與肛門互動相關的項目', '與肛門互動相關的項目', 15),
    category('multi_party_interaction', '多方互動類項目', '如多人、或關係外第三人相關的項目', '如多人、或關係外第三人相關的項目', 11),
    category('enslavement', '奴化類項目', '讓對方扮演某種範圍內的奴隸的項目', '自己扮演某種範圍內奴隸的項目', 14),
    category('pet_play', '獸/寵物化類項目', '讓對方扮演獸/寵物相關的項目', '自己扮演獸或寵物相關的項目', 16),
    category('role_play', '角色扮演類項目', '引導對方進行情境扮演的項目', '自己進行情境扮演的項目', 14),
    category('objectification', '物化類項目', '在合意情境中，暫時把對方當作物品、家具或工具對待的項目', '在合意情境中，暫時被當作物品、家具或工具對待的項目', 11),
    category('exposure', '暴露類項目', '讓對方在各種情境下裸露身體的項目', '讓自己在各種情境下裸露身體的項目', 10),
    category('image_recording', '影像類項目', '拍攝、保存、傳送、公開或分享對方影像的項目', '自己被拍攝、保存、傳送、公開或分享影像的項目', 9),
    category('piercing_cutting', '穿刺/割類項目', '對對方或要求對方身體某處進行穿刺或刀割相關的項目', '在自己身體某處接受穿刺或刀割相關的項目', 11),
    category('excretion', '排泄類項目', '與排泄物相關的項目', '與排泄物相關的項目', 10),
    category('behavior_restriction', '行為限制類項目', '在合意下，限制對方的需求或偏好的項目', '在合意下，被限制自身需求或偏好的項目', 9),
    category('other', '其他', '如呼吸控制、催眠、玩弄食物等無法被分類的項目', '如呼吸控制、催眠、玩弄食物等無法被分類的項目', 19, false),
  ],
};

export function getCategoryQuestionId(categoryId: string, role: QuestionRole): string {
  return `category.${categoryId}.${role}`;
}

const categoryRoundCategories = questionBank.categories.filter(
  (entry) => entry.includeInCategoryRound,
);
const categoryRoundQuestions = (['active', 'passive'] as const).flatMap((role) =>
  categoryRoundCategories.map<CategoryQuestion>((entry) => ({
      category: entry,
      id: getCategoryQuestionId(entry.categoryId, role),
      level: 'category',
      role,
    })),
);

export const allCategoryQuestionDefinitions = categoryRoundQuestions.map(
  ({ id, level, role }) => ({ id, level, role }),
);

export const categoryQuestionsByScope: CategoryQuestionsByScope = {
  activeOnly: categoryRoundQuestions.filter((question) => question.role === 'active'),
  passiveOnly: categoryRoundQuestions.filter((question) => question.role === 'passive'),
  all: categoryRoundQuestions,
};

export function getCategoryQuestionsForScope(scope: SecretFileScope): readonly CategoryQuestion[] {
  return categoryQuestionsByScope[scope];
}

export function getQuestionBankCounts(scope: SecretFileScope): QuestionBankCounts {
  const directionCount = scope === 'all' ? 2 : 1;
  const detailItemCount = questionBank.categories.reduce(
    (total, entry) => total + entry.itemCount,
    0,
  );

  return {
    categoryCount: questionBank.categories.filter((entry) => entry.includeInCategoryRound).length * directionCount,
    detailQuestionCount: detailItemCount * directionCount,
  };
}

export function getResultCategories(role: QuestionRole): readonly QuestionBankCategory[] {
  return questionBank.categories.filter(() => isRoleIncludedInScope(role, 'all'));
}
