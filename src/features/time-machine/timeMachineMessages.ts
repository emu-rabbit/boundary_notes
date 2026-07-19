import type { AppLocale } from '../../app/i18n';
import { secretKeeperNames } from '../../app/i18n/terminology';
import type { SecretFileScope } from '../secret-file';

export interface TimeMachineMessages {
  choices: {
    ready: string;
    departReady: string;
    confirmReady: string;
    confirmWrong: string;
    notReady: string;
    great: string;
    okay: string;
    notGood: string;
    proud: string;
    maybe: string;
    hug: string;
    preferNewName: string;
    oldNamePast: (name: string) => string;
    stoleFile: string;
    yes: string;
    commemorate: string;
    trash: string;
    giggle: string;
    confused: string;
    crying: string;
    exactly: string;
    shy: string;
    bothAttractive: string;
    overwhelmed: string;
    easy: string;
    doubleJoy: string;
    tellStory: string;
    hardToSay: string;
    greatAnswer: string;
    secretAnswer: string;
    stopLooking: (scope: string) => string;
    focusOn: (scope: string) => string;
    okayAnswer: string;
  };
  picker: {
    chooseFile: string;
    cloudFileFallback: string;
    cloudFiles: string;
    cloudSource: string;
    cloudUploadedAt: (date: string) => string;
    close: string;
    firstFile: string;
    loadFailed: string;
    loading: string;
    localFiles: string;
    localSource: string;
    localOnlyHint: string;
    needTwoFiles: string;
    secondFile: string;
    selectFileTitle: (position: string) => string;
    selectionRequired: string;
    updatedAt: (date: string) => string;
  };
  scopeLabel: (scope: SecretFileScope) => string;
  speakerName: string;
  story: {
    allToSingle: (newScope: string) => string;
    allToSingleFocus: string;
    allToSingleStop: string;
    conclusion: (gap: string) => string[];
    confirm: (olderDate: string, newerDate: string, gap: string) => string;
    differentProfile: string;
    focusReason: string;
    grandmother: string;
    namePast: string;
    nameTrash: string;
    newName: (name: string) => string;
    sameActive: string;
    sameAll: string;
    sameBad: string;
    sameGood: string;
    sameOkay: string;
    samePassive: string;
    sameProfile: (name: string, gap: string) => string;
    select: string;
    singleToAll: (oldScope: string) => string;
    singleToSingle: (oldScope: string, newScope: string) => string;
    storyPrivate: string;
    stole: string;
    systemArrested: string;
  };
  systemSpeakerName: string;
  timeGap: (days: number) => string;
}

const scopeLabels: Record<AppLocale, Record<SecretFileScope, string>> = {
  'zh-Hant': { activeOnly: '主導側', passiveOnly: '配合側', all: '雙側' },
  'zh-Hans': { activeOnly: '主导侧', passiveOnly: '配合侧', all: '双侧' },
  ja: { activeOnly: 'リード側', passiveOnly: 'フォロー側', all: '両側' },
  en: { activeOnly: 'the leading side', passiveOnly: 'the following side', all: 'both sides' },
};

const zhHant: TimeMachineMessages = {
  choices: {
    ready: '準備好了！',
    departReady: '準備好了',
    confirmReady: '沒錯！',
    confirmWrong: '拿錯了QQ',
    notReady: '還沒。',
    great: '很棒呢',
    okay: '還好',
    notGood: '不太好…',
    proud: '（自豪）',
    maybe: '也許吧',
    hug: '(,,ᴗ ᴗ,,) ⁾⁾',
    preferNewName: '我比較喜歡我取的新的名字',
    oldNamePast: (name) => `${name}是我的過去式了`,
    stoleFile: '其實我偷了別人的檔案',
    yes: '對吧！',
    commemorate: '我會好好紀念的',
    trash: '我會丟進垃圾桶的',
    giggle: '嘻嘻',
    confused: '？？？',
    crying: '(´;ω;`)',
    exactly: '沒錯！',
    shy: '（害羞）',
    bothAttractive: '因為都太吸引人了！',
    overwhelmed: '被淹沒了…',
    easy: '小事情而已',
    doubleJoy: '兩倍的承擔也是兩倍的快樂',
    tellStory: '好啊！',
    hardToSay: '（難以啟齒）',
    greatAnswer: '好耶。',
    secretAnswer: 'Ouo',
    stopLooking: (scope) => `我暫時不想看${scope}了`,
    focusOn: (scope) => `我決定更專注在${scope}這一側的紀錄`,
    okayAnswer: '好。',
  },
  picker: {
    chooseFile: '選擇檔案',
    cloudFileFallback: '已連結的雲端檔案',
    cloudFiles: '雲端檔案',
    cloudSource: '雲端',
    cloudUploadedAt: (date) => `上傳於 ${date}`,
    close: '關閉',
    firstFile: '第一份檔案',
    loadFailed: '無法讀取選擇的檔案，請重新選擇。',
    loading: '正在讀取檔案…',
    localFiles: '本地檔案',
    localSource: '本地',
    localOnlyHint: '可以從本裝置的本地或雲端檔案中選擇',
    needTwoFiles: '至少需要兩份本地或已連結的雲端檔案，才能在兩個時間點之間穿梭。',
    secondFile: '第二份檔案',
    selectFileTitle: (position) => `選擇${position}`,
    selectionRequired: '請先選擇兩份不同的檔案。',
    updatedAt: (date) => `最後編輯於 ${date}`,
  },
  scopeLabel: (scope) => scopeLabels['zh-Hant'][scope],
  speakerName: secretKeeperNames['zh-Hant'],
  story: {
    allToSingle: (newScope) => `噢，這兩份檔案真特別，你後來選擇只記錄下${newScope}了。`,
    allToSingleFocus: '原來如此，那我們就更專注地看著這一側吧！',
    allToSingleStop: '原來如此，我想肯定有一些原因的吧。',
    conclusion: () => [
      '這兩份檔案，都是當下最真實你的呈現。',
      '有些喜好，有些界線，可能流動也可能停留，這些都是自然無比的。這些沒有對錯，我們知道的是你依舊還是你，慾望仍然還是慾望。',
      '準備好的話，我們就出發吧。',
    ],
    confirm: (_olderDate, _newerDate, gap) => `恩.....這兩個檔案看來相距了${gap}呢，確定要把這兩份檔案放進時光機嗎？`,
    differentProfile: '喔？兩份檔案的名稱不一樣呢，這之間看來有些改變，是嗎？',
    focusReason: '原來如此，那我們就更專注地看著這一側吧！',
    grandmother: '我家阿嬤最愛聽故事了，關於那個頁面有她的email，你可以考慮寄信給她。',
    namePast: '那也許你可以把過去放在心中某一處，好好紀念著。',
    nameTrash: '真兇，但這魄力我喜歡w',
    newName: (name) => `${name}聽起來的確是很好的名字。`,
    sameActive: '來看看檔案方向吧，看來你還是更專注地看著主導那側的項目呢！',
    sameAll: '來看看檔案方向吧，看來在兩側來回嘗試，是你最想了解的自己。',
    sameBad: '噢，如果不介意的話，我可以抱抱你。',
    sameGood: '太好了，過得好比什麼都棒！',
    sameOkay: '平淡的日子，有時候也是一種幸福。',
    samePassive: '來看看檔案方向吧，看來你還是喜歡描述自己在配合那側的喜好和經驗呢！',
    sameProfile: (name, gap) => `${name}，這${gap}的日子，過得還好嗎？`,
    select: '今天想要在哪兩個檔案之間穿梭呢？',
    singleToAll: (oldScope) => `喔？作答範圍從${oldScope}變成了雙側都回答，怎麼樣，回答兩倍的問題，有沒有累壞呀？`,
    singleToSingle: (oldScope, newScope) => `喔？看起來，這兩份檔案角度非常的不一樣，從${oldScope}到${newScope}，你要說說這之間的故事嗎？`,
    storyPrivate: '不想說也沒關係，誰沒有幾個自己的小秘密呢。',
    stole: '（呼叫時空警察）',
    systemArrested: '你因為冒用身分，被時空警察逮捕了！',
  },
  systemSpeakerName: '系統提示',
  timeGap: (days) => days === 0 ? '不到一天' : `${days}天`,
};

const zhHans: TimeMachineMessages = {
  ...zhHant,
  choices: {
    ready: '准备好了！', departReady: '准备好了', confirmReady: '没错！', confirmWrong: '拿错了QQ', notReady: '还没。', great: '很棒呢', okay: '还好', notGood: '不太好…', proud: '（自豪）', maybe: '也许吧', hug: '(,,ᴗ ᴗ,,) ⁾⁾',
    preferNewName: '我比较喜欢我取的新名字', oldNamePast: (name) => `${name}已经是我的过去式了`, stoleFile: '其实我偷了别人的档案', yes: '对吧！', commemorate: '我会好好纪念的', trash: '我会丢进垃圾桶的', giggle: '嘻嘻', confused: '？？？', crying: '(´;ω;`)', exactly: '没错！', shy: '（害羞）', bothAttractive: '因为都太吸引人了！', overwhelmed: '被淹没了…', easy: '小事情而已', doubleJoy: '两倍的承担也是两倍的快乐', tellStory: '好啊！', hardToSay: '（难以启齿）', greatAnswer: '好耶。', secretAnswer: 'Ouo', stopLooking: (scope) => `我暂时不想看${scope}了`, focusOn: (scope) => `我决定更专注在${scope}这一侧的记录`, okayAnswer: '好。',
  },
  picker: {
    chooseFile: '选择档案', cloudFileFallback: '已链接的云端档案', cloudFiles: '云端档案', cloudSource: '云端', cloudUploadedAt: (date) => `上传于 ${date}`, close: '关闭', firstFile: '第一份档案', loadFailed: '无法读取选择的档案，请重新选择。', loading: '正在读取档案…', localFiles: '本地档案', localSource: '本地', localOnlyHint: '可以从本地档案，或这台设备已添加链接的云端档案中选择。', needTwoFiles: '至少需要两份本地或已链接的云端档案，才能在两个时间点之间穿梭。', secondFile: '第二份档案', selectFileTitle: (position) => `选择${position}`, selectionRequired: '请先选择两份不同的档案。', updatedAt: (date) => `最后编辑于 ${date}`,
  },
  scopeLabel: (scope) => scopeLabels['zh-Hans'][scope],
  speakerName: secretKeeperNames['zh-Hans'],
  story: {
    allToSingle: (newScope) => `噢，这两份档案真特别，你后来选择只记录${newScope}了。`, allToSingleFocus: '原来如此，那我们就更专注地看着这一侧吧！', allToSingleStop: '原来如此，我想肯定有一些原因吧。', conclusion: () => ['这两份档案，都是当下最真实的你。', '有些喜好，有些界限，可能流动也可能停留，这些都无比自然。这些没有对错，我们知道的是你依旧还是你，欲望仍然还是欲望。', '准备好的话，我们就出发吧。'], confirm: (_olderDate, _newerDate, gap) => `嗯.....这两个档案看来相距了${gap}呢，确定要把这两份档案放进时光机吗？`, differentProfile: '哦？两份档案的名称不一样呢，这之间看来有些改变，是吗？', focusReason: '原来如此，那我们就更专注地看着这一侧吧！', grandmother: '我家阿嬷最爱听故事了，关于页面里有她的 email，你可以考虑写信给她。', namePast: '那也许你可以把过去放在心中某一处，好好纪念着。', nameTrash: '真凶，但这魄力我喜欢w', newName: (name) => `${name}听起来的确是个很好的名字。`, sameActive: '来看看档案方向吧，看来你还是更专注地看着主导那侧的项目呢！', sameAll: '来看看档案方向吧，看来在两侧来回尝试，是你最想了解的自己。', sameBad: '噢，如果不介意的话，我可以抱抱你。', sameGood: '太好了，过得好比什么都棒！', sameOkay: '平淡的日子，有时候也是一种幸福。', samePassive: '来看看档案方向吧，看来你还是喜欢描述自己在配合那侧的喜好和经验呢！', sameProfile: (name, gap) => `${name}，这${gap}的日子，过得还好吗？`, select: '今天想要在哪两个档案之间穿梭呢？', singleToAll: (oldScope) => `哦？作答范围从${oldScope}变成了双侧都回答。怎么样，回答两倍的问题，有没有累坏呀？`, singleToSingle: (oldScope, newScope) => `哦？看起来，这两份档案的角度非常不一样。从${oldScope}到${newScope}，你要说说这之间的故事吗？`, storyPrivate: '不想说也没关系，谁没有几个自己的小秘密呢。', stole: '（呼叫时空警察）', systemArrested: '你因为冒用身份，被时空警察逮捕了！',
  },
  systemSpeakerName: '系统提示',
  timeGap: (days) => days === 0 ? '不到一天' : `${days}天`,
};

const ja: TimeMachineMessages = {
  ...zhHant,
  choices: {
    ready: '準備できた！', departReady: '準備できた', confirmReady: '間違いない！', confirmWrong: '取り違えたQQ', notReady: 'まだ。', great: 'すごくよかった', okay: 'まあまあ', notGood: 'あまりよくなかった…', proud: '（誇らしい）', maybe: 'そうかも', hug: '(,,ᴗ ᴗ,,) ⁾⁾', preferNewName: '自分でつけた新しい名前のほうが好き', oldNamePast: (name) => `${name}はもう過去の私`, stoleFile: '実は他の人のファイルを盗んだ', yes: 'でしょ！', commemorate: '大切に覚えておく', trash: 'ゴミ箱に入れる', giggle: 'ふふ', confused: '？？？', crying: '(´;ω;`)', exactly: 'その通り！', shy: '（照れる）', bothAttractive: 'どちらも魅力的すぎるから！', overwhelmed: '埋もれちゃった…', easy: 'これくらい平気', doubleJoy: '背負うものが二倍なら、楽しさも二倍', tellStory: 'いいよ！', hardToSay: '（言いづらい）', greatAnswer: 'わーい。', secretAnswer: 'Ouo', stopLooking: (scope) => `しばらく${scope}は見たくない`, focusOn: (scope) => `${scope}の記録にもっと集中することにした`, okayAnswer: 'うん。',
  },
  picker: {
    chooseFile: 'ファイルを選ぶ', cloudFileFallback: 'リンク済みクラウドファイル', cloudFiles: 'クラウドファイル', cloudSource: 'クラウド', cloudUploadedAt: (date) => `アップロード：${date}`, close: '閉じる', firstFile: '一つ目のファイル', loadFailed: '選んだファイルを読み込めませんでした。選び直してください。', loading: 'ファイルを読み込んでいます…', localFiles: 'ローカルファイル', localSource: 'ローカル', localOnlyHint: 'ローカルファイルと、この端末にリンク済みのクラウドファイルから選べます。', needTwoFiles: '二つの時点を行き来するには、ローカルまたはリンク済みクラウドファイルが二つ以上必要です。', secondFile: '二つ目のファイル', selectFileTitle: (position) => `${position}を選ぶ`, selectionRequired: '異なる二つのファイルを選んでください。', updatedAt: (date) => `最終編集：${date}`,
  },
  scopeLabel: (scope) => scopeLabels.ja[scope],
  speakerName: secretKeeperNames.ja,
  story: {
    allToSingle: (newScope) => `おや、この二つのファイルはちょっと特別だね。後から${newScope}だけを記録することにしたんだ。`, allToSingleFocus: 'なるほど。じゃあ、こちら側をもっとじっくり見ていこう！', allToSingleStop: 'なるほど。きっと、何か理由があるんだろうね。', conclusion: () => ['この二つのファイルは、どちらもその時のいちばん正直なあなた。', '好みも境界線も、動くこともあれば留まることもある。それはとても自然なこと。そこに正解も間違いもないよ。あなたはあなたのまま。欲望も欲望のまま。', '準備ができたら、出発しよう。'], confirm: (_olderDate, _newerDate, gap) => `うーん.....この二つのファイルは${gap}離れているみたい。時空機に入れても間違いない？`, differentProfile: 'おや？二つのファイルは名前が違うね。その間に、何か変化があったのかな？', focusReason: 'なるほど。じゃあ、こちら側をもっとじっくり見ていこう！', grandmother: 'うちのおばあちゃんはお話を聞くのが大好きなんだ。「このうさぎについて」のページにメールアドレスがあるから、送ってみてもいいよ。', namePast: 'それなら、過去を心のどこかにしまって、大切に覚えていてもいいかもしれないね。', nameTrash: '容赦ないね。でも、その勢いは好きだよw', newName: (name) => `${name}、たしかにいい名前だね。`, sameActive: 'ファイルの向きを見てみよう。今もリード側の項目をじっくり見ているんだね！', sameAll: 'ファイルの向きを見てみよう。両側を行き来しながら試すことが、いちばん知りたい自分なんだね。', sameBad: 'ああ、もしよければ、ぎゅっとしてもいいよ。', sameGood: 'よかった。元気に過ごせたことが何よりだよ！', sameOkay: '穏やかな日々も、ときには幸せのひとつだね。', samePassive: 'ファイルの向きを見てみよう。今もフォロー側の好みや経験を記すのが好きなんだね！', sameProfile: (name, gap) => `${name}、この${gap}の日々は、元気に過ごせた？`, select: '今日は、どの二つのファイルの間を行き来する？', singleToAll: (oldScope) => `おや？回答範囲が${oldScope}から両側へ変わったんだね。質問が二倍になって、疲れ果てなかった？`, singleToSingle: (oldScope, newScope) => `おや？この二つのファイルは見ている角度がずいぶん違うね。${oldScope}から${newScope}へ変わった間の話、聞かせてくれる？`, storyPrivate: '話したくなくても大丈夫。誰にだって、自分だけの小さな秘密があるから。', stole: '（時間警察を呼ぶ）', systemArrested: '他人になりすましたため、時間警察に逮捕されました！',
  },
  systemSpeakerName: 'システム通知',
  timeGap: (days) => days === 0 ? '一日足らず' : `${days}日`,
};

const en: TimeMachineMessages = {
  ...zhHant,
  choices: {
    ready: "I'm ready!", departReady: "I'm ready", confirmReady: "That's right!", confirmWrong: 'I grabbed the wrong files QQ', notReady: 'Not yet.', great: 'Wonderful', okay: 'It was okay', notGood: 'Not so well...', proud: '(Proud)', maybe: 'Maybe', hug: '(,,ᴗ ᴗ,,) ⁾⁾', preferNewName: 'I like the new name I chose better', oldNamePast: (name) => `${name} belongs to my past now`, stoleFile: "I actually stole someone else's file", yes: 'Right?', commemorate: "I'll remember it well", trash: "I'll throw it in the trash", giggle: 'Hehe', confused: '???', crying: '(´;ω;`)', exactly: 'Exactly!', shy: '(Shy)', bothAttractive: 'They are both too appealing!', overwhelmed: 'I was buried...', easy: 'It was nothing', doubleJoy: 'Twice the responsibility, twice the joy', tellStory: 'Sure!', hardToSay: '(Hard to say)', greatAnswer: 'Yay.', secretAnswer: 'Ouo', stopLooking: (scope) => `I don't want to look at ${scope} for now`, focusOn: (scope) => `I decided to focus more on records from ${scope}`, okayAnswer: 'Okay.',
  },
  picker: {
    chooseFile: 'Choose file', cloudFileFallback: 'Linked cloud file', cloudFiles: 'Cloud files', cloudSource: 'Cloud', cloudUploadedAt: (date) => `Uploaded ${date}`, close: 'Close', firstFile: 'First file', loadFailed: 'The selected files could not be read. Please choose them again.', loading: 'Loading files…', localFiles: 'Local files', localSource: 'Local', localOnlyHint: 'Choose from local files or cloud files linked on this device.', needTwoFiles: 'You need at least two local or linked cloud files to travel between two points in time.', secondFile: 'Second file', selectFileTitle: (position) => `Choose the ${position.toLowerCase()}`, selectionRequired: 'Choose two different files first.', updatedAt: (date) => `Last edited ${date}`,
  },
  scopeLabel: (scope) => scopeLabels.en[scope],
  speakerName: secretKeeperNames.en,
  story: {
    allToSingle: (newScope) => `Oh, these two files are unusual. Later, you chose to record only ${newScope}.`, allToSingleFocus: "I see. Then let's look more closely at this side!", allToSingleStop: 'I see. I imagine there must be a reason.', conclusion: () => ['Both files show the truest version of you in that moment.', 'Some interests and boundaries may move while others stay. All of that is completely natural. There is no right or wrong here. You are still you, and desire is still desire.', "When you're ready, let's go."], confirm: (_olderDate, _newerDate, gap) => `Hmm.....these two files seem to be ${gap} apart. Are you sure you want to put them into the time machine?`, differentProfile: 'Oh? The two files have different names. It looks like something changed between them, did it?', focusReason: "I see. Then let's look more closely at this side!", grandmother: 'My grandma loves stories. Her email is on the About page if you feel like writing to her.', namePast: 'Then perhaps you can keep the past somewhere in your heart and remember it well.', nameTrash: 'Ruthless. I like that resolve, though. w', newName: (name) => `${name} really does sound like a good name.`, sameActive: 'Let us look at the file direction. It seems you are still paying closer attention to the leading-side items!', sameAll: 'Let us look at the file direction. Moving between both sides seems to be the self you most want to understand.', sameBad: 'Oh. If you do not mind, I can give you a hug.', sameGood: 'That is wonderful. Being well is better than anything!', sameOkay: 'Quiet days can sometimes be a kind of happiness.', samePassive: 'Let us look at the file direction. It seems you still like describing your interests and experiences on the following side!', sameProfile: (name, gap) => `${name}, have these ${gap} treated you well?`, select: 'Which two files would you like to travel between today?', singleToAll: (oldScope) => `Oh? Your answer range changed from ${oldScope} to both sides. Did twice as many questions wear you out?`, singleToSingle: (oldScope, newScope) => `Oh? These files look from very different angles. Would you tell me the story of moving from ${oldScope} to ${newScope}?`, storyPrivate: 'You do not have to tell me. Everyone has a few little secrets of their own.', stole: '(Calls the time police)', systemArrested: 'You were arrested by the time police for impersonating someone!',
  },
  systemSpeakerName: 'System notice',
  timeGap: (days) => days === 0 ? 'less than a day' : `${days} ${days === 1 ? 'day' : 'days'}`,
};

const messagesByLocale: Record<AppLocale, TimeMachineMessages> = {
  'zh-Hant': zhHant,
  'zh-Hans': zhHans,
  ja,
  en,
};

export function getTimeMachineMessages(locale: AppLocale): TimeMachineMessages {
  return messagesByLocale[locale];
}

export function formatTimeMachineDate(locale: AppLocale, value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}
