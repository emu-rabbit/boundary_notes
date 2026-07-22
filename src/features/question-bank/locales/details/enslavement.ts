import type { LocalizedDetailCopy, TranslatedQuestionBankLocale } from '../types';

function detail(label: string, active: string, passive: string, warning: string | null = null): LocalizedDetailCopy {
  return { label, roles: { active: { description: active }, passive: { description: passive } }, warning };
}

export const enslavementDetails: Record<TranslatedQuestionBankLocale, Record<string, LocalizedDetailCopy>> = {
  "zh-Hans": {
    'detail-enslavement-bei8uo': detail("性奴", "让对方在双方同意的情境中扮演性奴角色", "在双方同意的情境中扮演性奴角色"),
    'detail-enslavement-1lnxc6o': detail("家事奴", "让对方在双方同意的情境中扮演家事奴角色", "在双方同意的情境中扮演家事奴角色"),
    'detail-enslavement-emvul7': detail("服侍奴", "让对方在双方同意的情境中扮演服侍奴角色", "在双方同意的情境中扮演服侍奴角色"),
    'detail-enslavement-5p38rr': detail("ATM奴", "让对方在双方同意的情境中扮演金钱供给或付款角色", "在双方同意的情境中扮演金钱供给或付款角色"),
    'detail-enslavement-ktgyn6': detail("司机奴", "让对方在双方同意的情境中扮演接送或驾驶服务角色", "在双方同意的情境中扮演接送或驾驶服务角色"),
    'detail-enslavement-8hpgnn': detail("疼痛奴／出气包", "让对方在双方同意的情境中扮演承受疼痛或出气包角色", "在双方同意的情境中扮演承受疼痛或出气包角色"),
    'detail-enslavement-p5y68w': detail("奴隶训练", "对对方进行奴隶角色相关训练", "接受奴隶角色相关训练"),
    'detail-enslavement-8sl7b1': detail("给予／拥有奴隶项圈", "给予对方奴隶项圈或象征", "接受对方给予的奴隶项圈或象征"),
    'detail-enslavement-wgiuuj': detail("私人空间牵绳牵引", "在私人空间用牵绳牵引对方", "在私人空间被对方用牵绳牵引"),
    'detail-enslavement-bdsmspaceleash': detail("BDSM 相关空间牵绳牵引", "在 BDSM 相关空间用牵绳牵引对方", "在 BDSM 相关空间被对方用牵绳牵引"),
    'detail-enslavement-1654r6x': detail("公开空间牵绳牵引", "在公开空间用牵绳牵引对方", "在公开空间被对方用牵绳牵引", "注意身份暴露、他人同意、公共场合界线与安全风险"),
    'detail-enslavement-w3wrxl': detail("关进奴隶笼", "将对方关进奴隶笼或限制在笼内", "被关进奴隶笼或限制在笼内", "注意姿势压迫、恐慌反应、通风与紧急释放方式"),
    'detail-enslavement-1d5ybf5': detail("短暂奴化", "让对方短暂进入奴化角色或状态", "短暂进入奴化角色或状态"),
    'detail-enslavement-tu6x63': detail("长期奴化", "让对方长期维持奴化角色或状态", "长期维持奴化角色或状态", "注意现实生活影响、身份界线、同意更新与退出方式"),
    'detail-enslavement-swx1g2': detail("永久奴化", "让对方进入永久奴化的关系设定", "进入永久奴化的关系设定", "注意长期心理影响、现实法律限制、同意更新与退出方式"),
  },
  "ja": {
    'detail-enslavement-bei8uo': detail("性奴隷役", "合意した場面で相手に性奴隷役を演じてもらう", "合意した場面で性奴隷役を演じる"),
    'detail-enslavement-1lnxc6o': detail("家事奴隷役", "合意した場面で相手に家事奴隷役を演じてもらう", "合意した場面で家事奴隷役を演じる"),
    'detail-enslavement-emvul7': detail("奉仕奴隷役", "合意した場面で相手に奉仕奴隷役を演じてもらう", "合意した場面で奉仕奴隷役を演じる"),
    'detail-enslavement-5p38rr': detail("ATM奴隷役", "合意した場面で相手に金銭の提供や支払いを担う役を演じてもらう", "合意した場面で金銭の提供や支払いを担う役を演じる"),
    'detail-enslavement-ktgyn6': detail("運転手奴隷役", "合意した場面で相手に送迎や運転を担う役を演じてもらう", "合意した場面で送迎や運転を担う役を演じる"),
    'detail-enslavement-8hpgnn': detail("痛みを受ける奴隷／はけ口役", "合意した場面で相手に痛みを受ける役やはけ口役を演じてもらう", "合意した場面で痛みを受ける役やはけ口役を演じる"),
    'detail-enslavement-p5y68w': detail("奴隷役のトレーニング", "相手に奴隷役に関するトレーニングを行う", "奴隷役に関するトレーニングを受ける"),
    'detail-enslavement-8sl7b1': detail("奴隷用首輪を与える／持つ", "相手に奴隷用の首輪や象徴を与える", "相手から奴隷用の首輪や象徴を受け取る"),
    'detail-enslavement-wgiuuj': detail("私的な場所でリードを付ける", "私的な場所でリードを付けて相手を導く", "私的な場所で相手にリードを付けられて導かれる"),
    'detail-enslavement-bdsmspaceleash': detail("BDSM 関連スペースでリードを付ける", "BDSM 関連スペースでリードを付けて相手を導く", "BDSM 関連スペースで相手にリードを付けられて導かれる"),
    'detail-enslavement-1654r6x': detail("公共の場でリードを付ける", "公共の場でリードを付けて相手を導く", "公共の場で相手にリードを付けられて導かれる", "身元の露出、周囲の人の同意、公共の場の境界、安全上のリスクに注意する"),
    'detail-enslavement-w3wrxl': detail("奴隷用ケージに入れる", "相手を奴隷用ケージに入れたり、ケージ内に制限したりする", "奴隷用ケージに入れられたり、ケージ内に制限されたりする", "姿勢による圧迫、パニック反応、換気、緊急時の解放方法に注意する"),
    'detail-enslavement-1d5ybf5': detail("短時間の奴隷化", "相手に短時間、奴隷役や奴隷状態に入ってもらう", "短時間、奴隷役や奴隷状態に入る"),
    'detail-enslavement-tu6x63': detail("長期の奴隷化", "相手に長期間、奴隷役や奴隷状態を維持してもらう", "長期間、奴隷役や奴隷状態を維持する", "現実生活への影響、アイデンティティの境界、同意の更新、退出方法に注意する"),
    'detail-enslavement-swx1g2': detail("恒久的な奴隷化", "相手と恒久的な奴隷関係という設定に入る", "恒久的な奴隷関係という設定に入る", "長期的な心理への影響、現実の法的制限、同意の更新、退出方法に注意する"),
  },
  "en": {
    'detail-enslavement-bei8uo': detail("Sex-slave role", "Have the other person take a sex-slave role in a consensual scene", "Take a sex-slave role in a consensual scene"),
    'detail-enslavement-1lnxc6o': detail("Domestic-slave role", "Have the other person take a domestic-slave role in a consensual scene", "Take a domestic-slave role in a consensual scene"),
    'detail-enslavement-emvul7': detail("Service-slave role", "Have the other person take a service-slave role in a consensual scene", "Take a service-slave role in a consensual scene"),
    'detail-enslavement-5p38rr': detail("ATM-slave role", "Have the other person take a consensual role providing money or making payments", "Take a consensual role providing money or making payments"),
    'detail-enslavement-ktgyn6': detail("Driver-slave role", "Have the other person take a consensual role providing transport or driving service", "Take a consensual role providing transport or driving service"),
    'detail-enslavement-8hpgnn': detail("Pain slave or outlet role", "Have the other person consensually take a role receiving pain or acting as an outlet", "Consensually take a role receiving pain or acting as an outlet"),
    'detail-enslavement-p5y68w': detail("Slave-role training", "Train the other person in a slave role", "Receive training related to a slave role"),
    'detail-enslavement-8sl7b1': detail("Giving or wearing a slave collar", "Give the other person a slave collar or symbol", "Receive a slave collar or symbol from the other person"),
    'detail-enslavement-wgiuuj': detail("Leading by leash in private", "Lead the other person by a leash in a private space", "Be led by the other person with a leash in a private space"),
    'detail-enslavement-bdsmspaceleash': detail("Leading by leash in a BDSM space", "Lead the other person by a leash in a BDSM-related space", "Be led by the other person with a leash in a BDSM-related space"),
    'detail-enslavement-1654r6x': detail("Leading by leash in public", "Lead the other person by a leash in a public space", "Be led by the other person with a leash in a public space", "Consider exposure of identity, other people’s consent, boundaries in public, and safety risks"),
    'detail-enslavement-w3wrxl': detail("Confinement in a slave cage", "Put the other person in a slave cage or confine them inside it", "Be put in a slave cage or confined inside it", "Watch for pressure from posture, panic responses, ventilation, and an emergency release method"),
    'detail-enslavement-1d5ybf5': detail("Short-term enslavement", "Have the other person enter a slave role or state briefly", "Enter a slave role or state briefly"),
    'detail-enslavement-tu6x63': detail("Long-term enslavement", "Have the other person remain in a slave role or state over a longer period", "Remain in a slave role or state over a longer period", "Consider effects on daily life, identity boundaries, renewed consent, and a way to leave"),
    'detail-enslavement-swx1g2': detail("Permanent enslavement", "Enter a relationship framed as permanent enslavement with the other person", "Enter a relationship framed as permanent enslavement", "Consider long-term psychological effects, real-world legal limits, renewed consent, and a way to leave"),
  },
};
