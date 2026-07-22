import type { LocalizedDetailCopy, TranslatedQuestionBankLocale } from '../types';

function detail(label: string, active: string, passive: string, warning: string | null = null): LocalizedDetailCopy {
  return { label, roles: { active: { description: active }, passive: { description: passive } }, warning };
}

export const exposureDetails: Record<TranslatedQuestionBankLocale, Record<string, LocalizedDetailCopy>> = {
  "zh-Hans": {
    'detail-exposure-yrd6oh': detail("在对方面前暴露", "要求对方在自己面前暴露身体", "在对方面前暴露身体"),
    'detail-exposure-84q67p': detail("在朋友面前暴露", "要求对方在朋友面前暴露身体", "在朋友面前暴露身体"),
    'detail-exposure-1c953fq': detail("在陌生人面前暴露", "要求对方在陌生人面前暴露身体", "在陌生人面前暴露身体"),
    'detail-exposure-cf5jn6': detail("在私人空间暴露", "要求对方在私人空间暴露身体", "在私人空间暴露身体"),
    'detail-exposure-bdsmspace': detail("在 BDSM 相关空间暴露", "要求对方在 BDSM 相关空间暴露身体", "在 BDSM 相关空间暴露身体"),
    'detail-exposure-jg19zi': detail("在公共空间暴露", "要求对方在公共空间暴露身体", "在公共空间暴露身体", "注意非参与者的同意、法律风险、身份暴露与安全"),
    'detail-exposure-14ngx9f': detail("观看／被观看性爱过程", "观看他人的性爱过程", "让他人观看自己的性爱过程"),
    'detail-exposure-iztub': detail("上半身暴露", "要求对方暴露上半身", "暴露上半身给对方观看"),
    'detail-exposure-lc5lxg': detail("下半身暴露", "要求对方暴露下半身", "暴露下半身给对方观看"),
    'detail-exposure-rhnyao': detail("外出不穿内衣裤", "要求对方外出时不穿内衣裤", "外出时不穿内衣裤", "注意舒适度、卫生、身份暴露与公共场合风险"),
    'detail-exposure-1on1gyu': detail("在公共空间自慰", "要求对方在公共空间自慰", "在公共空间自慰", "注意非参与者的同意、法律风险、身份暴露与安全"),
  },
  "ja": {
    'detail-exposure-yrd6oh': detail("相手の前で露出する", "自分の前で身体を露出するよう相手に求める", "相手の前で身体を露出する"),
    'detail-exposure-84q67p': detail("友人の前で露出する", "友人の前で身体を露出するよう相手に求める", "友人の前で身体を露出する"),
    'detail-exposure-1c953fq': detail("見知らぬ人の前で露出する", "見知らぬ人の前で身体を露出するよう相手に求める", "見知らぬ人の前で身体を露出する"),
    'detail-exposure-cf5jn6': detail("私的な場所で露出する", "私的な場所で身体を露出するよう相手に求める", "私的な場所で身体を露出する"),
    'detail-exposure-bdsmspace': detail("BDSM 関連スペースで露出する", "BDSM 関連スペースで身体を露出するよう相手に求める", "BDSM 関連スペースで身体を露出する"),
    'detail-exposure-jg19zi': detail("公共の場で露出する", "公共の場で身体を露出するよう相手に求める", "公共の場で身体を露出する", "参加していない人の同意、法的リスク、身元の露出、安全に注意する"),
    'detail-exposure-14ngx9f': detail("性行為を見る／見られる", "他人の性行為を見る", "自分の性行為を他人に見せる"),
    'detail-exposure-iztub': detail("上半身を露出する", "上半身を露出するよう相手に求める", "上半身を露出して相手に見せる"),
    'detail-exposure-lc5lxg': detail("下半身を露出する", "下半身を露出するよう相手に求める", "下半身を露出して相手に見せる"),
    'detail-exposure-rhnyao': detail("下着を着けずに外出する", "下着を着けずに外出するよう相手に求める", "下着を着けずに外出する", "快適さ、衛生、身元の露出、公共の場でのリスクに注意する"),
    'detail-exposure-1on1gyu': detail("公共の場で自慰する", "公共の場で自慰するよう相手に求める", "公共の場で自慰する", "参加していない人の同意、法的リスク、身元の露出、安全に注意する"),
  },
  "en": {
    'detail-exposure-yrd6oh': detail("Exposure in front of the other person", "Require the other person to expose their body in front of you", "Expose your body in front of the other person"),
    'detail-exposure-84q67p': detail("Exposure in front of friends", "Require the other person to expose their body in front of friends", "Expose your body in front of friends"),
    'detail-exposure-1c953fq': detail("Exposure in front of strangers", "Require the other person to expose their body in front of strangers", "Expose your body in front of strangers"),
    'detail-exposure-cf5jn6': detail("Exposure in a private space", "Require the other person to expose their body in a private space", "Expose your body in a private space"),
    'detail-exposure-bdsmspace': detail("Exposure in a BDSM space", "Require the other person to expose their body in a BDSM-related space", "Expose your body in a BDSM-related space"),
    'detail-exposure-jg19zi': detail("Exposure in a public space", "Require the other person to expose their body in a public space", "Expose your body in a public space", "Consider the consent of non-participants, legal risk, exposure of identity, and safety"),
    'detail-exposure-14ngx9f': detail("Watching or being watched during sex", "Watch other people having sex", "Let other people watch you having sex"),
    'detail-exposure-iztub': detail("Upper-body exposure", "Require the other person to expose their upper body", "Expose your upper body for the other person to see"),
    'detail-exposure-lc5lxg': detail("Lower-body exposure", "Require the other person to expose their lower body", "Expose your lower body for the other person to see"),
    'detail-exposure-rhnyao': detail("Going out without underwear", "Require the other person to go out without underwear", "Go out without underwear", "Consider comfort, hygiene, exposure of identity, and risks in public"),
    'detail-exposure-1on1gyu': detail("Masturbating in public", "Require the other person to masturbate in a public space", "Masturbate in a public space", "Consider the consent of non-participants, legal risk, exposure of identity, and safety"),
  },
};
