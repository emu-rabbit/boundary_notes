import type { LocaleMessages } from './types';
import { secretKeeperNames } from './terminology';

export const zhHantLegal = {
  contactLabel: '聯絡方式',
  documentsLabel: '法律文件',
  languageLabel: '閱讀語言',
  operatorLabel: '服務提供者與個人資料管理者',
  operatorName: '絵夢羽さ沂',
  privacyLink: '隱私權政策',
  termsLink: '使用條款',
  terms: {
    controllingLanguage: '本條款提供多語譯本；如各版本有歧義，以繁體中文版本為準。',
    eyebrow: '使用規範',
    intro: `使用這項服務前，請先了解${secretKeeperNames['zh-Hant']}能陪你做什麼，以及哪些事仍需要由你和對方在當下確認。`,
    lastUpdated: '2026 年 7 月 15 日',
    lastUpdatedLabel: '最後更新',
    title: '使用條款',
    sections: [
      {
        title: '一、條款適用與服務提供者',
        paragraphs: [
          '本服務「XX的祕密檔案」（未設定稱呼時顯示為「兔子的祕密檔案」，以下稱「本站」）由絵夢羽さ沂提供。你開始使用本站，即表示同意在使用範圍內遵守本條款。',
          '當你按下「了解並建立分享連結」，即表示你已閱讀並同意本條款與隱私權政策，也明確同意將該份可能含有敏感內容的檔案上傳為雲端分享版本。',
        ],
      },
      {
        title: '二、本站的用途與內容提醒',
        paragraphs: [
          '本站是一項協助自我理解、教育與 BDSM（愉虐）互動界限溝通的工具。內容可能提及性、身體、權力交換與高風險互動項目；請依自己的狀態決定是否繼續閱讀。',
          '本站不從事社交或配對，不鼓勵任何特定行為，也不把使用者分類成固定的屬性或角色。本站不提供醫療、法律、心理治療或 BDSM 操作建議，亦不能取代合格專業人員的意見。',
        ],
      },
      {
        title: '三、年齡與使用能力',
        paragraphs: [
          '本站不設定一般性的最低使用年齡；但你必須具備依所在地法律理解並同意本條款的能力。若依法需要法定代理人同意，應先取得該同意。',
          '不得利用本站建立、保存或分享任何涉及未成年人的性內容、剝削內容或其他違法內容。',
        ],
      },
      {
        title: '四、知情同意與使用者責任',
        paragraphs: [
          '祕密檔案、測驗結果與分享連結都只是溝通起點，不是同意書、契約或承諾，也不代表任何人對未來或當下行為作出永久、即時或不可撤回的同意。',
          '任何互動都仍應在當下確認參與者的意願、能力、界限與撤回；即使檔案內容顯示「可以」或「有興趣」，任何人仍可隨時拒絕或改變心意。你須自行判斷如何使用本站資訊並為自己的行為負責。',
        ],
      },
      {
        title: '五、禁止行為',
        paragraphs: ['你不得利用本站從事下列行為：'],
        items: [
          '違反適用法律，或侵害他人的隱私、人格、智慧財產或其他權利。',
          '冒用他人身分、未經同意填寫或散布他人的敏感資訊。',
          '建立或散布涉及未成年人的性內容、剝削內容或其他有害內容。',
          '騷擾、威脅、強迫、誘騙他人，或將檔案當作迫使他人同意的依據。',
          '干擾服務、惡意大量請求、繞過存取或防濫用措施，或嘗試取得未授權資料。',
        ],
      },
      {
        title: '六、你的內容與雲端分享',
        paragraphs: [
          '你保有自己填寫內容原有的權利。為了建立、保存、讀取及傳遞你主動選擇的雲端分享版本，你授權本站在提供該功能所必要的範圍內處理該內容；此授權不代表本站取得內容所有權。',
          '雲端分享連結屬於持有連結即可讀取的方式。你可以自行評估並決定分享的對象、平台或空間，也應理解連結可能被再次轉傳。雲端檔案建立後目前不能由一般使用者自行修改或刪除；如需依法行使權利，請依隱私權政策所列方式聯絡。',
        ],
      },
      {
        title: '七、第三方服務與連結',
        paragraphs: [
          '本站使用 Google Firebase、Google Analytics（僅在你同意後）、Google Fonts 與應用程式防護服務，並可能連結至 GitHub 或其他外部網站。第三方服務依其各自條款與政策運作，本站不控制外部網站的內容或可用性。',
        ],
      },
      {
        title: '八、服務可用性與免責',
        paragraphs: [
          '本站按現況提供。我們會以合理方式維護服務與資料安全，但不保證服務永不中斷、完全沒有錯誤、本機資料永不遺失，或雲端分享連結永遠可用。請自行保留重要內容的副本。',
          '在適用法律允許的最大範圍內，本站不對因使用、無法使用、資料遺失、連結外流或依賴本站內容所生的間接、附帶或衍生損害負責；依法不得排除或限制的責任不受影響。',
        ],
      },
      {
        title: '九、暫停、變更與終止',
        paragraphs: [
          '為維護安全、修正問題、遵守法律或處理違規，我們得調整、暫停或停止全部或部分服務，並得限制明顯濫用來源的存取。條款若有重大變更，會更新本頁日期並以適當方式提示。',
        ],
      },
      {
        title: '十、準據法與管轄',
        paragraphs: [
          '本條款以中華民國（臺灣）法律為準據法。因本站所生爭議，雙方應先善意協商；如需訴訟，以臺灣臺北地方法院為第一審管轄法院，但不得排除消費者保護法或其他強制規定所保障的管轄與權利。',
        ],
      },
    ],
  },
  privacy: {
    controllingLanguage: '本政策提供多語譯本；如各版本有歧義，以繁體中文版本為準。',
    eyebrow: '資料與隱私',
    intro: `這份政策說明哪些資料只留在你的裝置、何時會送上雲端，以及${secretKeeperNames['zh-Hant']}如何盡量少收資料。`,
    lastUpdated: '2026 年 7 月 15 日',
    lastUpdatedLabel: '最後更新',
    title: '隱私權政策',
    sections: [
      {
        title: '一、管理者與適用範圍',
        paragraphs: [
          '絵夢羽さ沂是本站的服務提供者與個人資料管理者。本政策適用於「XX的祕密檔案」網站所處理的資料；你經由外部連結前往的網站，則依其各自的隱私政策處理。',
        ],
      },
      {
        title: '二、我們處理的資料',
        paragraphs: ['依你使用的功能，本站可能處理下列資料：'],
        items: [
          '本機資料：語言、稱呼、作答內容、備註、本機祕密檔案、雲端分享的顯示紀錄、分析同意選擇與本機上傳防護紀錄。',
          '雲端分享內容：你主動建立分享連結時上傳的雲端檔案，可能包含 BDSM 互動項目的經驗、興趣、界限與備註。',
          '必要的防濫用紀錄：匿名應用程式識別、建立時間、資料大小，以及來源 IP、瀏覽器指紋與 user-agent 經金鑰雜湊後的值。本站不在這份長期紀錄中保存原始 IP、原始指紋或完整 user-agent。',
          '短期頻率限制資料：為限制大量請求而建立的計數與時間資料，通常在約 48 小時後到期。',
          '匿名使用分析：僅在你同意後，記錄一般頁面、語言與低風險功能事件；不包含稱呼、作答、備註、檔案或分享識別碼、搜尋參數。',
        ],
      },
      {
        title: '三、處理目的',
        paragraphs: ['我們只在提供與保護本站所需的範圍內處理資料，包括：'],
        items: [
          '在你的裝置上保存偏好與祕密檔案。',
          '依你的選擇建立並讀取雲端分享版本。',
          '防止濫用、維護資安、調查異常並保護服務。',
          '在取得同意後，以彙整或去識別化的使用情況改善網站。',
          '回覆你的問題、依法處理權利請求或履行法定義務。',
        ],
      },
      {
        title: '四、只留在本機的資料',
        paragraphs: [
          '一般作答與祕密檔案預設保存在你的瀏覽器本機儲存空間，不會因單純填寫而自動送上雲端。清除瀏覽器資料、更換裝置、使用私人瀏覽，或瀏覽器與裝置故障，都可能使本機資料消失。',
          '只有在你主動建立雲端分享連結時，該份檔案與必要的防濫用資料才會傳送到雲端。',
        ],
      },
      {
        title: '五、雲端分享與可見範圍',
        paragraphs: [
          '雲端分享使用不可猜測的連結識別碼；任何取得完整連結的人都可能讀取檔案。你可以自行評估並決定要把連結分享到哪些人、平台或空間，也應理解連結可能被再次轉傳。雲端檔案建立後是唯讀版本，目前沒有一般使用者自行修改或刪除的功能。',
          '我們不會出售你的內容，也不會把祕密檔案用於廣告個人化或建立 BDSM 身分標籤。',
        ],
      },
      {
        title: '六、匿名使用分析與你的選擇',
        paragraphs: [
          'Google Analytics 只會在你選擇同意後啟用。你可以在設定中隨時停止；停止後不再傳送新的分析事件，但不會回溯刪除先前已依法處理的彙整資料。本站不啟用廣告個人化訊號。',
          'Google Analytics 可能使用第一方 cookie 與裝置、瀏覽器及站內活動資訊。IP 位址可能在傳輸與判定概略地區時被處理，但 Google Analytics 表示不會記錄或保存個別 IP 位址。',
        ],
      },
      {
        title: '七、第三方服務與境外處理',
        paragraphs: [
          '本站使用 Google Firebase（託管、資料庫、雲端函式及應用程式防護）、Google Analytics 與 Google Fonts。資料可能由 Google 及其受託服務商在臺灣以外的全球基礎設施處理，並受其安全措施與資料處理條款約束。',
          '雲端函式與防護服務可能在請求過程中暫時處理 IP 位址、裝置或應用程式訊號，以提供服務、判定頻率與阻擋濫用。',
        ],
      },
      {
        title: '八、保存期間',
        paragraphs: [
          '本機資料保存到你在功能內刪除、清除瀏覽器儲存空間，或裝置環境移除為止。雲端檔案與私有防濫用雜湊紀錄目前採長期保存，以維持連結與處理濫用；除非依法應刪除、服務停止，或我們另行公告保存政策。',
          '短期頻率限制資料通常約 48 小時後自動到期。Google Analytics 使用者層級與事件層級資料依本站設定及 Google 提供的控制保存，最長不超過 14 個月；彙整報表可能不受相同期間限制。客服往來依處理問題與法律需要保存。',
        ],
      },
      {
        title: '九、安全措施',
        paragraphs: [
          '我們採取與資料敏感度相稱的合理措施，例如傳輸加密、存取規則、應用程式驗證、頻率限制、最少資料事件及來源訊號的金鑰雜湊。不過，任何網路或儲存方式都無法保證絕對安全。',
        ],
      },
      {
        title: '十、你的權利',
        paragraphs: [
          '依適用法律，你可以請求查詢或閱覽、取得複本、補充或更正、停止蒐集處理或利用，以及刪除你的個人資料。這些權利不因使用本站而被放棄；我們可能先要求足以確認請求與資料關聯的資訊。',
          '如要行使權利或詢問隱私事項，請使用本頁所列電子郵件聯絡。若依法需保留資料、無法可靠辨識特定雲端檔案，或請求會影響他人權利，我們會說明可處理的範圍。',
        ],
      },
      {
        title: '十一、未成年人與敏感內容',
        paragraphs: [
          '本站不以未成年人為特定對象，也不允許上傳涉及未成年人的性內容或剝削內容。若你認為本站上有此類內容，請立即聯絡我們；我們會依法律與安全需要處理。',
        ],
      },
      {
        title: '十二、政策更新',
        paragraphs: [
          '服務、供應商或法律要求改變時，我們可能更新本政策。重大變更會以適當方式提示，並在頁首標示新的更新日期；需要重新取得同意時，我們會先詢問。',
        ],
      },
    ],
  },
} satisfies LocaleMessages['legal'];

export const zhHansLegal = {
  contactLabel: '联系方式', documentsLabel: '法律文件', languageLabel: '阅读语言', operatorLabel: '服务提供者与个人资料管理者', operatorName: '絵夢羽さ沂', privacyLink: '隐私权政策', termsLink: '使用条款',
  terms: {
    controllingLanguage: '本条款提供多语言译本；如各版本有歧义，以繁体中文版本为准。', eyebrow: '使用规范', intro: `使用这项服务前，请先了解${secretKeeperNames['zh-Hans']}能陪你做什么，以及哪些事仍需要由你和对方在当下确认。`, lastUpdated: '2026 年 7 月 15 日', lastUpdatedLabel: '最后更新', title: '使用条款',
    sections: [
      { title: '一、条款适用与服务提供者', paragraphs: ['本服务“XX的秘密档案”（未设置称呼时显示为“兔子的秘密档案”，以下称“本站”）由絵夢羽さ沂提供。你开始使用本站，即表示同意在使用范围内遵守本条款。', '当你按下“了解并建立分享链接”，即表示你已阅读并同意本条款与隐私权政策，也明确同意将该份可能含有敏感内容的档案上传为云端分享版本。'] },
      { title: '二、本站的用途与内容提醒', paragraphs: ['本站是一项协助自我理解、教育与 BDSM（愉虐）互动界限沟通的工具。内容可能提及性、身体、权力交换与高风险互动项目；请依自己的状态决定是否继续阅读。', '本站不从事社交或配对，不鼓励任何特定行为，也不把使用者分类成固定的属性或角色。本站不提供医疗、法律、心理治疗或 BDSM 操作建议，也不能取代合格专业人员的意见。'] },
      { title: '三、年龄与使用能力', paragraphs: ['本站不设置一般性的最低使用年龄；但你必须具备依所在地法律理解并同意本条款的能力。若依法需要法定代理人同意，应先取得该同意。', '不得利用本站建立、保存或分享任何涉及未成年人的性内容、剥削内容或其他违法内容。'] },
      { title: '四、知情同意与使用者责任', paragraphs: ['秘密档案、测验结果与分享链接都只是沟通起点，不是同意书、契约或承诺，也不代表任何人对未来或当下行为作出永久、即时或不可撤回的同意。', '任何互动都仍应在当下确认参与者的意愿、能力、界限与撤回；即使档案内容显示“可以”或“有兴趣”，任何人仍可随时拒绝或改变心意。你须自行判断如何使用本站信息并为自己的行为负责。'] },
      { title: '五、禁止行为', paragraphs: ['你不得利用本站从事下列行为：'], items: ['违反适用法律，或侵害他人的隐私、人格、知识产权或其他权利。', '冒用他人身份、未经同意填写或散布他人的敏感信息。', '建立或散布涉及未成年人的性内容、剥削内容或其他有害内容。', '骚扰、威胁、强迫、诱骗他人，或将档案当作迫使他人同意的依据。', '干扰服务、恶意大量请求、绕过访问或防滥用措施，或尝试取得未授权数据。'] },
      { title: '六、你的内容与云端分享', paragraphs: ['你保有自己填写内容原有的权利。为了建立、保存、读取及传递你主动选择的云端分享版本，你授权本站在提供该功能所必要的范围内处理该内容；此授权不代表本站取得内容所有权。', '云端分享链接属于持有链接即可读取的方式。你可以自行评估并决定分享的对象、平台或空间，也应理解链接可能被再次转发。云端文件建立后目前不能由一般使用者自行修改或删除；如需依法行使权利，请依隐私权政策所列方式联系。'] },
      { title: '七、第三方服务与链接', paragraphs: ['本站使用 Google Firebase、Google Analytics（仅在你同意后）、Google Fonts 与应用程序防护服务，并可能链接至 GitHub 或其他外部网站。第三方服务依其各自条款与政策运作，本站不控制外部网站的内容或可用性。'] },
      { title: '八、服务可用性与免责声明', paragraphs: ['本站按现状提供。我们会以合理方式维护服务与数据安全，但不保证服务永不中断、完全没有错误、本机数据永不丢失，或云端分享链接永远可用。请自行保留重要内容的副本。', '在适用法律允许的最大范围内，本站不对因使用、无法使用、数据丢失、链接外泄或依赖本站内容所生的间接、附带或衍生损害负责；依法不得排除或限制的责任不受影响。'] },
      { title: '九、暂停、变更与终止', paragraphs: ['为维护安全、修正问题、遵守法律或处理违规，我们可调整、暂停或停止全部或部分服务，也可限制明显滥用来源的访问。条款若有重大变更，会更新本页日期并以适当方式提示。'] },
      { title: '十、准据法与管辖', paragraphs: ['本条款以中华民国（台湾）法律为准据法。因本站所生争议，双方应先善意协商；如需诉讼，以台湾台北地方法院为第一审管辖法院，但不得排除消费者保护法或其他强制规定所保障的管辖与权利。'] },
    ],
  },
  privacy: {
    controllingLanguage: '本政策提供多语言译本；如各版本有歧义，以繁体中文版本为准。', eyebrow: '数据与隐私', intro: `这份政策说明哪些数据只留在你的设备、何时会送上云端，以及${secretKeeperNames['zh-Hans']}如何尽量少收数据。`, lastUpdated: '2026 年 7 月 15 日', lastUpdatedLabel: '最后更新', title: '隐私权政策',
    sections: [
      { title: '一、管理者与适用范围', paragraphs: ['絵夢羽さ沂是本站的服务提供者与个人资料管理者。本政策适用于“XX的秘密档案”网站所处理的数据；你经由外部链接前往的网站，则依其各自的隐私政策处理。'] },
      { title: '二、我们处理的数据', paragraphs: ['依你使用的功能，本站可能处理下列数据：'], items: ['本机数据：语言、称呼、作答内容、备注、本机秘密档案、云端分享的显示记录、分析同意选择与本机上传防护记录。', '云端分享内容：你主动建立分享链接时上传的云端文件，可能包含 BDSM 互动项目的经验、兴趣、界限与备注。', '必要的防滥用记录：匿名应用程序识别、建立时间、数据大小，以及来源 IP、浏览器指纹与 user-agent 经密钥散列后的值。本站不在这份长期记录中保存原始 IP、原始指纹或完整 user-agent。', '短期频率限制数据：为限制大量请求而建立的计数与时间数据，通常在约 48 小时后到期。', '匿名使用分析：仅在你同意后，记录一般页面、语言与低风险功能事件；不包含称呼、作答、备注、档案或分享识别码、搜索参数。'] },
      { title: '三、处理目的', paragraphs: ['我们只在提供与保护本站所需的范围内处理数据，包括：'], items: ['在你的设备上保存偏好与秘密档案。', '依你的选择建立并读取云端分享版本。', '防止滥用、维护信息安全、调查异常并保护服务。', '在取得同意后，以汇总或去识别化的使用情况改善网站。', '回复你的问题、依法处理权利请求或履行法定义务。'] },
      { title: '四、只留在本机的数据', paragraphs: ['一般作答与秘密档案默认保存在你的浏览器本机存储空间，不会因单纯填写而自动送上云端。清除浏览器数据、更换设备、使用私人浏览，或浏览器与设备故障，都可能使本机数据消失。', '只有在你主动建立云端分享链接时，该份文件与必要的防滥用数据才会传送到云端。'] },
      { title: '五、云端分享与可见范围', paragraphs: ['云端分享使用不可猜测的链接识别码；任何取得完整链接的人都可能读取文件。你可以自行评估并决定要把链接分享到哪些人、平台或空间，也应理解链接可能被再次转发。云端文件建立后是只读版本，目前没有一般使用者自行修改或删除的功能。', '我们不会出售你的内容，也不会把秘密档案用于广告个性化或建立 BDSM 身份标签。'] },
      { title: '六、匿名使用分析与选择', paragraphs: ['Google Analytics 只会在你选择同意后启用。你可以在设置中随时停止；停止后不再传送新的分析事件，但不会追溯删除先前已依法处理的汇总数据。本站不启用广告个性化信号。', 'Google Analytics 可能使用第一方 cookie 与设备、浏览器及站内活动信息。IP 地址可能在传输与判定概略地区时被处理，但 Google Analytics 表示不会记录或保存个别 IP 地址。'] },
      { title: '七、第三方服务与境外处理', paragraphs: ['本站使用 Google Firebase（托管、数据库、云端函数及应用程序防护）、Google Analytics 与 Google Fonts。数据可能由 Google 及其受托服务商在台湾以外的全球基础设施处理，并受其安全措施与数据处理条款约束。', '云端函数与防护服务可能在请求过程中暂时处理 IP 地址、设备或应用程序信号，以提供服务、判定频率与阻挡滥用。'] },
      { title: '八、保存期间', paragraphs: ['本机数据保存到你在功能内删除、清除浏览器存储空间，或设备环境移除为止。云端文件与私有防滥用散列记录目前采用长期保存，以维持链接与处理滥用；除非依法应删除、服务停止，或我们另行公告保存政策。', '短期频率限制数据通常约 48 小时后自动到期。Google Analytics 使用者层级与事件层级数据依本站设置及 Google 提供的控制保存，最长不超过 14 个月；汇总报表可能不受相同期间限制。客服往来依处理问题与法律需要保存。'] },
      { title: '九、安全措施', paragraphs: ['我们采取与数据敏感度相称的合理措施，例如传输加密、访问规则、应用程序验证、频率限制、最少数据事件及来源信号的密钥散列。不过，任何网络或存储方式都无法保证绝对安全。'] },
      { title: '十、你的权利', paragraphs: ['依适用法律，你可以请求查询或阅览、取得副本、补充或更正、停止收集处理或利用，以及删除你的个人数据。这些权利不因使用本站而被放弃；我们可能先要求足以确认请求与数据关联的信息。', '如要行使权利或询问隐私事项，请使用本页所列电子邮件联系。若依法需保留数据、无法可靠辨识特定云端文件，或请求会影响他人权利，我们会说明可处理的范围。'] },
      { title: '十一、未成年人与敏感内容', paragraphs: ['本站不以未成年人为特定对象，也不允许上传涉及未成年人的性内容或剥削内容。若你认为本站上有此类内容，请立即联系我们；我们会依法律与安全需要处理。'] },
      { title: '十二、政策更新', paragraphs: ['服务、供应商或法律要求改变时，我们可能更新本政策。重大变更会以适当方式提示，并在页首标示新的更新日期；需要重新取得同意时，我们会先询问。'] },
    ],
  },
} satisfies LocaleMessages['legal'];

export const jaLegal = {
  contactLabel: 'お問い合わせ', documentsLabel: '法的文書', languageLabel: '表示言語', operatorLabel: 'サービス提供者・個人データ管理者', operatorName: '絵夢羽さ沂', privacyLink: 'プライバシーポリシー', termsLink: '利用規約',
  terms: {
    controllingLanguage: '本規約には翻訳版があります。内容に相違がある場合は繁体字中国語版を優先します。', eyebrow: '利用について', intro: `ご利用の前に、${secretKeeperNames.ja}ができることと、今この瞬間に当事者同士で確かめるべきことをご確認ください。`, lastUpdated: '2026年7月15日', lastUpdatedLabel: '最終更新', title: '利用規約',
    sections: [
      { title: '1. 適用範囲と提供者', paragraphs: ['本サービス「XXの秘密ファイル」（呼び名が未設定の場合は「うさぎの秘密ファイル」、以下「本サイト」）は絵夢羽さ沂が提供します。本サイトを利用することで、本規約を遵守することに同意したものとみなします。', '「確認して共有リンクを作成」を押すと、本規約とプライバシーポリシーを読み、同意し、機微な内容を含む可能性のあるファイルをクラウド共有版としてアップロードすることに明示的に同意したものとします。'] },
      { title: '2. 目的と内容に関する注意', paragraphs: ['本サイトは、自己理解、教育、BDSMに関する相互行為の境界線の対話を支援するツールです。性、身体、パワー・エクスチェンジ、高リスクな行為に触れる場合があります。ご自身の状態に合わせて閲覧を続けるか判断してください。', '本サイトは交流・マッチングを行わず、特定の行為を推奨せず、利用者を固定的な属性や役割に分類しません。医療、法律、心理療法、BDSMの実践方法に関する助言は提供せず、専門家の助言に代わるものではありません。'] },
      { title: '3. 年齢と同意能力', paragraphs: ['一般的な最低年齢は設けていませんが、居住地の法律に従い本規約を理解し同意できる能力が必要です。法定代理人の同意が必要な場合は、先に取得してください。', '未成年者に関する性的・搾取的その他違法な内容を作成、保存、共有することは禁止します。'] },
      { title: '4. インフォームド・コンセント', paragraphs: ['秘密ファイル、結果、共有リンクは対話のきっかけにすぎず、同意書、契約、約束ではありません。将来または現在の行為への永続的、即時的、撤回不能な同意を示すものでもありません。', 'あらゆる相互行為では、その時点で意思、能力、境界線、撤回を確認してください。ファイルに「可能」「関心あり」とあっても、誰でもいつでも断り、気持ちを変えられます。情報の利用とご自身の行為については、利用者が判断し責任を負います。'] },
      { title: '5. 禁止事項', paragraphs: ['次の行為を禁止します。'], items: ['法令違反、または他者のプライバシー、人格、知的財産その他の権利の侵害。', '他者へのなりすまし、同意なく他者の機微情報を入力・拡散すること。', '未成年者に関する性的、搾取的その他有害な内容の作成・拡散。', '嫌がらせ、脅迫、強要、欺罔、またはファイルを他者に同意を迫る根拠として使うこと。', 'サービス妨害、大量の不正なリクエスト、アクセス・不正利用防止策の回避、無権限データの取得。'] },
      { title: '6. 利用者の内容とクラウド共有', paragraphs: ['入力した内容に関する権利は利用者に帰属します。利用者が選択したクラウド共有版の作成、保存、表示、送信に必要な範囲で、本サイトにその内容を処理する権限を付与します。これは所有権の移転ではありません。', '完全な共有リンクを持つ人は内容を閲覧できます。共有する相手、プラットフォーム、場所はご自身で評価して決めることができますが、リンクがさらに共有される可能性も理解してください。作成後のクラウドファイルは、現在、一般利用者が変更・削除できません。法令上の権利を行使する場合はプライバシーポリシー記載の方法でご連絡ください。'] },
      { title: '7. 第三者サービス', paragraphs: ['本サイトは Google Firebase、同意後の Google Analytics、Google Fonts、アプリ保護サービスを使用し、GitHub等への外部リンクを含みます。第三者サービスは各自の規約・ポリシーに従い、本サイトは外部サイトの内容や可用性を管理しません。'] },
      { title: '8. 可用性と免責', paragraphs: ['本サイトは現状有姿で提供されます。合理的な保守と安全対策に努めますが、無停止・無エラー、本機データが失われないこと、共有リンクが永久に使えることは保証しません。重要な内容はご自身でも保管してください。', '適用法で許される最大限の範囲で、利用、利用不能、データ消失、リンク流出、内容への依存から生じる間接的・付随的・派生的損害について責任を負いません。法令上排除・制限できない責任には適用されません。'] },
      { title: '9. 変更・停止', paragraphs: ['安全維持、問題修正、法令遵守、違反対応のため、サービスの全部または一部を変更・停止し、明白な不正利用元からのアクセスを制限する場合があります。重要な規約変更時は更新日を変更し、適切な方法でお知らせします。'] },
      { title: '10. 準拠法と裁判管轄', paragraphs: ['本規約は中華民国（台湾）法に準拠します。紛争はまず誠実に協議し、訴訟が必要な場合は台湾台北地方裁判所を第一審の管轄裁判所とします。ただし、消費者保護法その他の強行規定による管轄・権利を排除しません。'] },
    ],
  },
  privacy: {
    controllingLanguage: '本ポリシーには翻訳版があります。内容に相違がある場合は繁体字中国語版を優先します。', eyebrow: 'データとプライバシー', intro: `端末にのみ残るデータ、クラウドへ送られるタイミング、そして${secretKeeperNames.ja}が収集を最小限にする方法を説明します。`, lastUpdated: '2026年7月15日', lastUpdatedLabel: '最終更新', title: 'プライバシーポリシー',
    sections: [
      { title: '1. 管理者と適用範囲', paragraphs: ['絵夢羽さ沂は本サイトのサービス提供者および個人データ管理者です。本ポリシーは「XXの秘密ファイル」サイトでの処理に適用され、外部リンク先には各サイトのポリシーが適用されます。'] },
      { title: '2. 処理するデータ', paragraphs: ['利用する機能に応じ、次のデータを処理する場合があります。'], items: ['端末内データ：言語、呼び名、回答、メモ、端末内の秘密ファイル、クラウド共有の表示記録、分析への同意選択、端末内のアップロード保護記録。', 'クラウド共有内容：自ら共有リンクを作成した際のクラウドファイル。BDSM項目に関する経験、関心、境界線、メモを含む場合があります。', '不正利用防止記録：匿名のアプリ識別子、作成時刻、データ量、送信元IP、ブラウザフィンガープリント、user-agentを秘密鍵でハッシュ化した値。長期記録には元のIP、元の指紋、完全なuser-agentを保存しません。', '短期レート制限データ：大量リクエストを制限する回数・時刻のデータで、通常約48時間で失効します。', '匿名利用分析：同意した場合のみ、一般的なページ、言語、低リスクな機能イベントを記録します。呼び名、回答、メモ、ファイル・共有ID、検索パラメータは含みません。'] },
      { title: '3. 利用目的', paragraphs: ['データはサービスの提供・保護に必要な範囲でのみ処理します。'], items: ['端末上で設定と秘密ファイルを保存するため。', '利用者の選択によりクラウド共有版を作成・表示するため。', '不正利用を防ぎ、セキュリティを維持し、異常を調査するため。', '同意後、集計・非識別化した利用状況でサイトを改善するため。', '問い合わせ、権利請求、法的義務に対応するため。'] },
      { title: '4. 端末にのみ残るデータ', paragraphs: ['通常の回答と秘密ファイルはブラウザのローカルストレージに保存され、入力しただけではクラウドへ送信されません。ブラウザデータの消去、端末変更、プライベートブラウジング、故障などで失われる場合があります。', '自らクラウド共有リンクを作成したときに限り、そのファイルと必要な不正利用防止データがクラウドへ送られます。'] },
      { title: '5. クラウド共有と閲覧範囲', paragraphs: ['共有には推測困難な識別子を使いますが、完全なリンクを得た人は閲覧できます。共有する相手、プラットフォーム、場所はご自身で評価して決めることができますが、リンクがさらに共有される可能性も理解してください。クラウドファイルは読み取り専用で、現在は一般利用者向けの変更・削除機能がありません。', '内容を販売せず、広告のパーソナライズやBDSMの属性ラベル作成には使用しません。'] },
      { title: '6. 匿名利用分析と選択', paragraphs: ['Google Analyticsは同意した場合のみ有効です。設定からいつでも停止でき、停止後は新たなイベントを送信しません。ただし、適法に処理済みの集計データを遡って削除するものではありません。広告パーソナライズ信号は有効にしません。', 'Google Analyticsはファーストパーティcookie、端末、ブラウザ、サイト内活動の情報を使う場合があります。IPアドレスは通信やおおまかな地域判定時に処理される場合がありますが、Google Analyticsは個別IPを記録・保存しないと説明しています。'] },
      { title: '7. 第三者サービスと国外処理', paragraphs: ['Google Firebase（ホスティング、データベース、クラウド関数、アプリ保護）、Google Analytics、Google Fontsを使用します。データはGoogleおよび委託先により、台湾国外を含む世界各地のインフラで処理される場合があります。', 'クラウド関数や保護サービスは、提供、頻度判定、不正利用防止のため、リクエスト中にIPアドレス、端末・アプリ信号を一時的に処理する場合があります。'] },
      { title: '8. 保存期間', paragraphs: ['端末内データは機能上で削除するか、ブラウザストレージまたは端末環境から消去されるまで残ります。クラウドファイルと非公開の不正利用防止ハッシュ記録は、リンク維持と不正利用対応のため現在は長期保存します。ただし、法令上削除が必要な場合、サービス終了、または別途保存方針を告知した場合を除きます。', '短期レート制限データは通常約48時間で失効します。Google Analyticsのユーザー・イベント単位データは設定とGoogleの管理機能に従い最長14か月で、集計レポートは同期間の対象外となる場合があります。問い合わせ記録は対応と法的必要性に応じて保存します。'] },
      { title: '9. 安全対策', paragraphs: ['暗号化通信、アクセスルール、アプリ検証、レート制限、最小限の分析イベント、送信元信号の秘密鍵ハッシュ化など、機微性に応じた合理的な対策を講じます。ただし、絶対的な安全を保証できるネットワーク・保存方法はありません。'] },
      { title: '10. 利用者の権利', paragraphs: ['適用法に従い、照会・閲覧、複製、追加・訂正、収集・処理・利用の停止、削除を請求できます。利用によってこれらを放棄することはありません。請求とデータの関係を確認するため必要な情報を求める場合があります。', '権利行使やプライバシーの問い合わせは本ページ記載のメールへご連絡ください。法令上保存が必要な場合、特定のクラウドファイルを確実に識別できない場合、他者の権利に影響する場合は、対応可能な範囲を説明します。'] },
      { title: '11. 未成年者と機微な内容', paragraphs: ['本サイトは未成年者を対象としておらず、未成年者に関する性的・搾取的内容のアップロードを認めません。そのような内容を見つけた場合は直ちにご連絡ください。法令と安全上の必要に応じて対応します。'] },
      { title: '12. 更新', paragraphs: ['サービス、提供事業者、法令要件の変更に応じて本ポリシーを更新する場合があります。重要な変更は適切に案内し、更新日を変更します。再同意が必要な場合は事前に確認します。'] },
    ],
  },
} satisfies LocaleMessages['legal'];

export const enLegal = {
  contactLabel: 'Contact', documentsLabel: 'Legal documents', languageLabel: 'Reading language', operatorLabel: 'Service provider and data controller', operatorName: '絵夢羽さ沂', privacyLink: 'Privacy Policy', termsLink: 'Terms of Use',
  terms: {
    controllingLanguage: 'Translations are provided for convenience. If versions differ, the Traditional Chinese version controls.', eyebrow: 'Using the service', intro: `Before you begin, please understand what the ${secretKeeperNames.en} can help with—and what you still need to confirm with another person in the moment.`, lastUpdated: 'July 15, 2026', lastUpdatedLabel: 'Last updated', title: 'Terms of Use',
    sections: [
      { title: '1. Scope and service provider', paragraphs: ['This service, “XX’s Secret File” (shown as “Rabbit’s Secret File” until a display name is set, the “Site”), is provided by 絵夢羽さ沂. By using the Site, you agree to follow these Terms within the scope of your use.', 'By selecting “Understand and create sharing link,” you confirm that you have read and agree to these Terms and the Privacy Policy, and expressly consent to uploading that file—which may contain sensitive content—as a cloud sharing copy.'] },
      { title: '2. Purpose and sensitive-content notice', paragraphs: ['The Site supports self-understanding, education, and communication about boundaries in BDSM interactions. It may refer to sexuality, bodies, power exchange, and higher-risk activities. Please decide whether to continue based on your own comfort and circumstances.', 'The Site is not a social or matchmaking service, does not promote particular activities, and does not assign fixed attributes or roles. It does not provide medical, legal, mental-health treatment, or BDSM practice advice and is not a substitute for qualified professional advice.'] },
      { title: '3. Age and legal capacity', paragraphs: ['The Site sets no general minimum age, but you must be legally able to understand and agree to these Terms under the law where you live. Obtain a guardian’s consent first where the law requires it.', 'You must not use the Site to create, keep, or share sexual, exploitative, or otherwise unlawful content involving a minor.'] },
      { title: '4. Informed consent and your responsibility', paragraphs: ['Secret files, results, and sharing links are conversation starters only. They are not consent forms, contracts, or promises, and they never establish permanent, immediate, or irrevocable consent to present or future conduct.', 'Every interaction still requires in-the-moment confirmation of willingness, capacity, boundaries, and withdrawal. Even if a file says “okay” or “interested,” anyone may refuse or change their mind at any time. You decide how to use the information and remain responsible for your conduct.'] },
      { title: '5. Prohibited conduct', paragraphs: ['You must not use the Site to:'], items: ['Break applicable law or infringe another person’s privacy, dignity, intellectual property, or other rights.', 'Impersonate another person or enter or distribute their sensitive information without permission.', 'Create or distribute sexual, exploitative, or otherwise harmful content involving a minor.', 'Harass, threaten, coerce, or deceive anyone, or use a file as grounds to pressure someone into consent.', 'Disrupt the service, make abusive requests, bypass access or anti-abuse controls, or seek unauthorized data.'] },
      { title: '6. Your content and cloud sharing', paragraphs: ['You retain the rights you already have in what you enter. You give the Site permission to process that content only as needed to create, store, display, and transmit the cloud sharing copy you choose. This does not transfer ownership to the Site.', 'Anyone with the complete sharing link may read the copy. You may assess and choose the people, platforms, or spaces where you share it, while understanding that the link may be shared again. Cloud files currently cannot be changed or deleted directly by an ordinary user. To exercise rights under applicable law, contact us as described in the Privacy Policy.'] },
      { title: '7. Third-party services and links', paragraphs: ['The Site uses Google Firebase, Google Analytics only after consent, Google Fonts, and application-protection services, and may link to GitHub or other sites. Third-party services operate under their own terms and policies; we do not control external content or availability.'] },
      { title: '8. Availability and disclaimers', paragraphs: ['The Site is provided as available. We use reasonable efforts to maintain it and protect data, but do not promise uninterrupted or error-free service, permanent local storage, or permanent availability of a cloud link. Keep your own copy of anything important.', 'To the fullest extent allowed by law, we are not liable for indirect, incidental, or consequential losses arising from use, inability to use, loss of data, disclosure of a link, or reliance on Site content. This does not limit liability that applicable law does not permit us to exclude.'] },
      { title: '9. Changes, suspension, and termination', paragraphs: ['We may change, suspend, or stop all or part of the service, or restrict clearly abusive sources, to maintain security, fix issues, comply with law, or address violations. Material changes to these Terms will be reflected in the date above and communicated appropriately.'] },
      { title: '10. Governing law and jurisdiction', paragraphs: ['These Terms are governed by the laws of the Republic of China (Taiwan). The parties should first try to resolve disputes in good faith. If litigation is necessary, the Taiwan Taipei District Court will be the court of first instance, without excluding jurisdiction or rights protected by consumer law or other mandatory rules.'] },
    ],
  },
  privacy: {
    controllingLanguage: 'Translations are provided for convenience. If versions differ, the Traditional Chinese version controls.', eyebrow: 'Data and privacy', intro: `This Policy explains what stays on your device, when information goes to the cloud, and how the ${secretKeeperNames.en} tries to collect as little as possible.`, lastUpdated: 'July 15, 2026', lastUpdatedLabel: 'Last updated', title: 'Privacy Policy',
    sections: [
      { title: '1. Controller and scope', paragraphs: ['絵夢羽さ沂 is the Site’s service provider and data controller. This Policy applies to data processed by “XX’s Secret File.” Sites reached through external links apply their own privacy policies.'] },
      { title: '2. Data we process', paragraphs: ['Depending on the features you use, the Site may process:'], items: ['On-device data: language, display name, answers, notes, local secret files, cloud-share display history, analytics choice, and local upload-protection records.', 'Cloud sharing content: the cloud file you actively upload to create a sharing link, which may include experience, interest, boundaries, and notes about BDSM interaction items.', 'Necessary anti-abuse records: an anonymous app identifier, creation time, payload size, and keyed hashes derived from the source IP, browser fingerprint, and user-agent. The long-term record does not store the raw IP, raw fingerprint, or complete user-agent.', 'Short-term rate-limit data: counts and timestamps used to limit abusive request volume, normally expiring after about 48 hours.', 'Anonymous usage analytics: only after consent, general pages, language, and low-risk feature events. These exclude display names, answers, notes, file or sharing IDs, and query parameters.'] },
      { title: '3. Why we process data', paragraphs: ['We process data only as needed to provide and protect the Site, including to:'], items: ['Keep preferences and secret files on your device.', 'Create and display a cloud sharing copy when you choose.', 'Prevent abuse, maintain security, investigate anomalies, and protect the service.', 'Improve the Site using aggregated or de-identified usage after consent.', 'Answer questions, handle lawful rights requests, and meet legal obligations.'] },
      { title: '4. Data that stays on your device', paragraphs: ['Ordinary answers and secret files are stored in your browser’s local storage by default and are not sent to the cloud merely because you fill them in. Clearing browser data, changing devices, private browsing, or browser or device failure may erase them.', 'The file and necessary anti-abuse data are sent to the cloud only when you actively create a cloud sharing link.'] },
      { title: '5. Cloud sharing and visibility', paragraphs: ['Cloud shares use hard-to-guess link identifiers, but anyone with the complete link may read the cloud file. You may assess and choose the people, platforms, or spaces where you share it, while understanding that the link may be shared again. A cloud file is read-only and currently has no ordinary-user edit or delete control.', 'We do not sell your content or use secret files for personalized advertising or BDSM identity labels.'] },
      { title: '6. Anonymous analytics and your choice', paragraphs: ['Google Analytics is enabled only after you opt in. You can stop it at any time in Settings; no new events are sent afterward, though this does not retroactively delete previously and lawfully processed aggregate data. We do not enable advertising personalization signals.', 'Google Analytics may use first-party cookies and device, browser, and on-site activity information. An IP address may be processed in transit and to estimate a broad region, but Google states that Analytics does not log or store individual IP addresses.'] },
      { title: '7. Providers and international processing', paragraphs: ['The Site uses Google Firebase (hosting, database, cloud functions, and app protection), Google Analytics, and Google Fonts. Google and its service providers may process data on global infrastructure outside Taiwan, subject to their data-processing terms and safeguards.', 'Cloud functions and protection services may temporarily process IP addresses and device or app signals during a request to provide the service, assess request frequency, and prevent abuse.'] },
      { title: '8. Retention', paragraphs: ['On-device data remains until you delete it through a feature, clear browser storage, or the device environment removes it. Cloud files and private anti-abuse hash records are currently retained long-term to keep links available and address abuse, unless deletion is required by law, the service ends, or we announce another retention policy.', 'Short-term rate-limit data normally expires after about 48 hours. Google Analytics user- and event-level data is retained under our setting and Google’s controls for no more than 14 months; aggregate reports may not follow the same period. Support correspondence is kept as needed to resolve the matter and meet legal requirements.'] },
      { title: '9. Security', paragraphs: ['We use reasonable measures proportionate to the sensitivity of the data, including encryption in transit, access rules, app verification, rate limiting, minimal analytics events, and keyed hashing of source signals. No network or storage method can guarantee absolute security.'] },
      { title: '10. Your rights', paragraphs: ['Subject to applicable law, you may request access or review, a copy, supplementation or correction, an end to collection, processing or use, and deletion of your personal data. Using the Site does not waive these rights. We may ask for enough information to verify the request and its connection to the data.', 'To exercise a right or ask a privacy question, email the address on this page. If data must be kept by law, a particular cloud file cannot be reliably identified, or a request would affect another person’s rights, we will explain what can be done.'] },
      { title: '11. Minors and sensitive content', paragraphs: ['The Site is not directed specifically to minors and does not permit sexual or exploitative content involving minors. If you believe such content is present, contact us immediately; we will respond as required for safety and by law.'] },
      { title: '12. Updates', paragraphs: ['We may update this Policy as the service, providers, or legal requirements change. Material changes will be communicated appropriately and reflected in the date above. We will ask again first where renewed consent is required.'] },
    ],
  },
} satisfies LocaleMessages['legal'];
