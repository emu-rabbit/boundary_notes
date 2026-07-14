import type { LocaleMessages } from '../types';

export const jaMessages: LocaleMessages = {
  analyticsConsent: {
    accept: '匿名分析を許可',
    body: '同意すると、Google Analytics を使用して Boundary Notes の改善に役立てます。個人コンテンツは送信されず、トラッキングは設定からいつでも無効にできます。',
    decline: '今回は許可しない',
    googleDetails: 'Google によるデータの取り扱い',
    settingsActionDisable: '匿名分析を停止',
    settingsActionEnable: '匿名分析を許可',
    settingsBody: '匿名分析はページや機能の利用状況だけを記録し、呼び名、回答、メモ、ファイル ID、共有リンクは含みません。選択はいつでも変更できます。',
    settingsDisabled: '匿名分析は許可されていません',
    settingsEnabled: '匿名分析を許可しています',
    settingsTitle: '匿名の利用状況分析',
    title: '守秘うさぎに匿名の利用状況を記録させてもいいですか？',
  },
  about: {
    body: 'このうさぎは、いまの気持ち、境界線、伝えたいことを一冊のファイルに整えるお手伝いをします。これは対話の始まりで、誰かの代わりに決めるものではありません。',
    replayStory: '導入をもう一度',
    title: 'このうさぎについて',
  },
  assets: {
    homeRabbitAlt: '白いうさぎが手を振り、秘密ファイルのノートを抱えている。',
    settingsRabbitAlt: '白いうさぎが設定ボードを抱え、歯車の図柄がボードに入っている。',
  },
  brand: {
    restartStoryAria: (title) => `${title}：導入をもう一度始める`,
  },
  common: {
    backHome: 'ホームへ',
    planned: '準備中',
    ready: '使用可',
  },
  home: {
    copy: '今日もゆっくりで大丈夫。新しいファイルを作っても、前の続きからでも。自分の変化を見たり、この一部を誰かに渡したりしてもいい。',
    kicker: 'おかえり',
    navAria: '秘密ファイルの主な入口',
  },
  notFound: {
    action: 'ホームへ戻る',
    body: 'ここにはファイルがありません。URL が変わったか、余分な経路が含まれているようです。',
    kicker: '404｜ページが見つかりません',
    title: '守秘うさぎも探してみました',
  },
  routes: {
    story: {
      label: '導入',
      summary: 'うさぎと一緒に、秘密ファイルの最初のやりとりへ。',
    },
    home: {
      label: 'ホーム',
      summary: 'これからの主な流れをまとめた入口。',
    },
    create: {
      label: '新しいファイル',
      summary: '新しいテストを始め、経験、興味、メモを整理します。',
    },
    preview: {
      label: 'ファイルを見る',
      summary: '秘密ファイルの結果を読み取り専用で確認します。',
    },
    files: {
      label: '古いファイル',
      summary: '保存したファイルを見たり、リンクから読み込んだりします。',
    },
    timeMachine: {
      label: 'タイムマシン',
      summary: '複数のファイルを比べ、境界線や気持ちの変化を見ます。',
    },
    about: {
      label: 'このうさぎについて',
      summary: '境界線と対話の出発点をどう整えるかを知る。',
    },
    settings: {
      label: '設定',
      summary: '言語、好み、この端末のデータ設定を調整します。',
    },
  },
  settings: {
    body: 'この設定はこの端末だけに残ります。',
    languageLabel: '守秘うさぎが使う言語',
    profileFieldLabel: '呼び名',
    profileLabel: 'なんて呼べばいい？',
    profilePlaceholder: 'うさぎ',
    profileSaved: '保存しました',
    saveProfile: '呼び名を保存',
    title: '設定',
  },
  story: {
    languageQuestion: '......?',
    nameFieldLabel: '呼び名',
    speakerName: 'どこからか来たうさぎ',
    steps: {
      'self-question': {
        lines: ['やあ！どんな風に吹かれて来たんだろう。', 'でも……自分のこと、わかってる？'],
        choices: [
          { label: 'わかってる', next: 'self-yes' },
          { label: 'わからない', next: 'self-no' },
          { label: '少し曖昧', next: 'self-unsure' },
        ],
      },
      'self-yes': {
        message: 'それはよかった。きっとこの先もすんなり進めるね。',
        action: '（ちょっと誇らしい）',
      },
      'self-no': {
        message: 'なら、もう少し自分を見つけるところまで、そばにいるよ。',
        action: '本当に？',
      },
      'self-unsure': {
        message: 'それはいい知らせだよ。未知を探る時間って、時々いちばん魅力的だから。',
        action: '私もそう思う',
      },
      'other-question': {
        lines: ['ところで……その人は、あなたをわかってる？'],
        choices: [
          { label: 'わかってる', next: 'other-yes' },
          { label: 'わかってない', next: 'other-no' },
          { label: 'その人って誰？', next: 'other-who' },
        ],
      },
      'other-yes': {
        message: 'じゃあ、ちょっとしたゲームの機会だね。その人が何点取れるか見てみよう。',
        action: '楽しそう！',
      },
      'other-no': {
        message: '大丈夫。いま、最初の一歩を踏み出せる機会があるよ。',
        action: '何をすればいい？',
      },
      'other-who': {
        message: 'その人？次のデート相手かもしれないし、パートナーかもしれない。あなたを知ってほしい誰か、でもいい。',
        action: 'わかった',
      },
      name: {
        lines: ['なんて呼べばいい？'],
        action: 'ファイルに書く',
      },
      file: {
        body: [
          'ここでは、BDSM の各項目について、あなたの好みや受け入れやすさを丁寧に記録します。正解はありません。あなたはあなたのまま、欲望は欲望のままです。',
          '保存しても、心にいるその人へ渡しても、誰かとの話し合いに使ってもいい。いつかまた来てくれたら、その時の変化も聞かせてね。',
        ],
        action: 'OK',
      },
    },
  },
  title: {
    connector: 'の',
    defaultProfileName: 'うさぎ',
    objectLabel: '秘密ファイル',
  },
};
