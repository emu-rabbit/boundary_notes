# 題庫與秘密檔案核心系統規格

## 文件目的

本文件定義 Boundary Notes 的核心測驗系統：題庫來源、題目分層、作答流程、回答資料格式、本地保存、雲端分享、匯出與後續題庫更新方式。後續 Agent 在實作題庫、測驗流程、結果頁、本地檔案、Firestore 分享、題庫匯入或翻譯時，必須先讀取本文件。

本系統的目標不是把題目做成一次性固定表單，而是建立可長期維護的題庫與回答資料結構。題目未來會新增、修訂、警示補強或翻譯擴充；回答資料必須能在題庫版本變動後仍保留可解讀性。

## 來源資料

第一批正式題庫來源為 Google Drive 試算表：

- 標題：`BDSM boundary test items`
- 檔案 ID：`1shrEavMkoumIpe07vL3DXp0uj7tcHzqgPV6qzU6jvAE`
- 試算表 locale：`zh_TW`
- 目前觀察時間：2026-07-08

試算表結構：

- 第一個分頁為 `頂層分類項目`。
- `頂層分類項目` 欄位為：`名稱`、`主導側描述`、`配合側描述`、`項目數`。
- 其餘分頁各自對應一個分類，例如 `拍打類項目`、`穿刺/割類項目`、`其他`。
- 各分類分頁欄位為：`項目`、`主導側描述`、`配合側描述`、`警示`。
- 目前 runtime 題庫共有 `299 個` 細項；若展開主導側與配合側方向，共為 `598` 個方向性細項題目。此數量包含 2026-07-11 Google Sheet 的 294 個基礎細項，以及使用者於 2026-07-22 直接指定加入的 5 個細項；後續從 Sheet 同步時不得誤刪這 5 個 runtime 新增項目。

細項分頁的 `項目` 是共用的來源辨識與管理標籤。經逐項審核後，短而不會誤解方向的標籤可以成為兩側共用的正式題名，例如「用散鞭」；但不能把它機械式顯示出來。若標籤同時寫了兩個方向，或只描述其中一側的動作，必須為兩側另寫正確的短題名；原始 `項目` 仍保留為 `sourceLabel` metadata。

繁體中文文案以試算表為 source of truth。除標點符號、明確錯字或使用者明確要求外，Agent 不得擅自改寫繁體中文題目、描述、分類名稱或警示文案。

## 題庫模型

題庫應分成三層：

1. `QuestionBank`：整份題庫版本、來源、支援語系與分類集合。
2. `Category`：分類層問題，例如 `拍打類項目` 的主導側與配合側版本。
3. `DetailItem`：分類內細項，例如 `用手`、`用木拍`、`破皮流血的程度` 的主導側與配合側版本。

每個 `DetailItem` 必須為 `active` 與 `passive` 各保存一份使用者可見 `title` 與 `description`。`title` 是供掃讀的短名稱，`description` 才完整說明方向與互動；兩側的 `title` 可以相同，只要它是中性且不會誤解方向。若共用名稱同時表達兩個方向，或在某一側明顯描述錯誤的行為者，兩側必須使用各自正確的短題名。`sourceLabel` 只保留原始來源值，不得未經審核直接當成題名。

角色扮演分類中的 `active` / `passive` 只表示該情境當下的主導／配合位置，不得從角色名稱推導或固定成現實職位。例如老師／學生、上司／下屬等成對角色，兩側都使用中性的情境題名；方向說明維持「在該情境中擔任主導側／配合側」，不得把老師、學生、上司或下屬強行指派給其中一側。

方向模式：

- `active`：主導側項目。
- `passive`：配合側項目。

使用者建立新檔案時必須選擇出題範圍：

- `activeOnly`：僅顯示主導側項目。
- `passiveOnly`：僅顯示配合側項目。
- `all`：主導側與配合側皆顯示；分類與細項都會展開成兩倍方向性題目。

`其他` 分類沒有一致主題，不進入第一輪分類題組；但它必須在結果頁顯示為一個分類大按鈕，作為那些無法歸入其他分類的細項入口。不得要求使用者為整個 `其他` 分類填分類層答案，也不得因為它不參與第一輪分類作答就把它從結果頁移除。

結果頁中 `其他` 固定排序在所有分類最後。

## 穩定 ID

試算表目前以中文名稱與分頁承載內容，不在 Google Sheet 內新增穩定 machine ID 欄位。題庫匯入流程必須由 repo 內 ID map 管理每個分類與細項的穩定 ID，且後續更新不得因文案微調、題目排序調整或在中間插入新題而造成使用者舊檔案失去對應。

建議規則：

- `categoryId` 以第一次匯入時建立的穩定 slug 為準，例如 `impact_spanking`、`whipping`，不得包含流水號或排序資訊。
- `detailItemId` 以第一次匯入時建立的穩定 slug 為準，例如 `hand`、`wooden_paddle`，不得包含流水號或排序資訊。
- 方向性問題 ID 由 `categoryId`、`detailItemId` 與 `role` 組成，例如 `detail.impact_spanking.wooden_paddle.active`。
- 第一次匯入時產生並提交一份 ID 對照檔，例如 `src/data/questionBank/id-map.json`。
- 後續匯入時，若試算表列名被改動但可由人工確認為同一項，應更新對照檔而不是產生新 ID。
- 若匯入器無法判斷某列是新增、刪除或改名，必須中止並要求人工確認。
- 若 Google Sheet 題目順序改變，或使用者在中間插入新題，既有 ID 必須維持不變；只有真正新增的題目才產生新 ID。

## 題庫 JSON 形狀

實作時可調整欄位命名，但必須保留下列語意：

```json
{
  "schemaVersion": 2,
  "bankVersion": "2026-07-08",
  "source": {
    "kind": "google-sheet",
    "title": "BDSM boundary test items",
    "fileId": "1shrEavMkoumIpe07vL3DXp0uj7tcHzqgPV6qzU6jvAE",
    "modifiedTime": "2026-07-11T06:14:45.603Z"
  },
  "locales": ["zh-Hant", "zh-Hans", "ja", "en"],
  "categories": [
    {
      "categoryId": "impact_spanking",
      "sourceSheetName": "拍打類項目",
      "zhHantName": "拍打類項目",
      "roles": {
        "active": {
          "title": "拍打類項目(主導側)",
          "description": "對對方進行包含打屁股在內的拍打相關衝擊遊戲"
        },
        "passive": {
          "title": "拍打類項目(配合側)",
          "description": "接受包含打屁股在內的拍打相關衝擊遊戲"
        }
      },
      "detailItemIds": ["hand", "leather_paddle"],
      "categoryVisualAsset": "impact_spanking.webp"
    }
  ],
  "detailItems": [
    {
      "detailItemId": "leather_paddle",
      "categoryId": "impact_spanking",
      "sourceRowLabel": "用皮拍",
      "roles": {
        "active": {
          "title": "用皮拍",
          "description": "用皮拍拍打對方進行衝擊遊戲"
        },
        "passive": {
          "title": "用皮拍",
          "description": "被皮拍拍打進行衝擊遊戲"
        }
      },
      "warning": null
    }
  ]
}
```

多語系資料可放在同一 JSON 或拆成 locale chunk。繁體中文原文必須可追溯到 Google Sheet；簡體中文、日文與英文翻譯應貼合 BDSM 圈子的自然語境與知情同意語氣，不得只照字面翻譯，也不得把語氣翻得更露骨或更鼓勵實踐。

細項必須有不含繁中原文的穩定 `detailId`，並由此 ID 對應各 locale 的翻譯資料；不得以分類名稱、題名、列號或排序當作翻譯 object 的 key。原文修訂時應保留既有 `detailId`，只有確認為不同的新細項才建立新 ID。載入舊本機檔案供編輯或唯讀檢視時，runtime 必須依目前題庫補上缺少的題目，依檔案 scope 標為 `unanswered` 或 `filteredOut`，保留既有答案與 `updatedAt`，並在確實補題時更新檔案的 `questionBank` metadata；舊雲端快照維持不可寫入，但唯讀檢視可在記憶體中套用同一補題邏輯，讓閱讀者看見新題目。

## 回答選項

分類層題目詢問：

- 經驗程度：`none` 沒經驗、`little` 少量經驗、`some` 一些經驗、`extensive` 大量經驗、`veryExtensive` 非常熟悉、`unsure` 不確定、`seeDetails` 參考細項。
- 喜好程度：`hardNo` 絕對禁止、`reluctant` 勉強配合、`neutral` 無感覺、`like` 喜歡、`love` 超級喜歡、`unsure` 不確定、`seeDetails` 參考細項。
- 備註：自由填答文字，選填。

細項題目詢問：

- 經驗程度：`none` 沒經驗、`little` 少量經驗、`some` 一些經驗、`extensive` 大量經驗、`veryExtensive` 非常熟悉、`unsure` 不確定。
- 喜好程度：`hardNo` 絕對禁止、`reluctant` 勉強配合、`neutral` 無感覺、`like` 喜歡、`love` 超級喜歡、`unsure` 不確定。
- 備註：自由填答文字，選填。

`seeDetails` 只允許用於分類層，不允許用於細項層。它表示使用者希望閱讀者透過後續細項填答來理解差異，而非替整個分類選擇單一狀態。

分類層與細項層都必須同時填寫經驗程度與喜好程度才可前進；備註永遠選填。逐一答題流程不提供跳題，使用者若無法判斷，必須選擇 `unsure` 不確定。

## 回答狀態

回答資料必須明確區分：

- `unanswered`：題目符合本檔案出題範圍，但使用者尚未填答。
- `answered`：使用者已填答。
- `filteredOut`：題目不符合使用者建立檔案時選擇的出題範圍，例如 `activeOnly` 檔案中的配合側題目。

不得把 `filteredOut` 當成未填答，也不得在進度、排行榜或結果摘要中把它算進使用者應完成的題目。

## 備註輸入安全

備註是敏感且會被重新顯示的使用者輸入，必須在寫入、讀取與渲染三個階段都保守處理。

最低要求：

- 上限為 80 個 Unicode 字元；超過時阻擋儲存並提示使用者縮短。備註只是小提醒，不應成為大篇幅內容。
- 完全單行；拒絕或移除換行與控制字元。
- 禁止輸入連結或疑似連結，包括 `http://`、`https://`、`www.`、常見網域形態與 Markdown link。
- 不得用 `v-html` 或 innerHTML 顯示備註；必須以純文字渲染。
- 從 localStorage、匯入 JSON 或 Firestore 讀回時仍需重新驗證，不可信任既有資料。
- Firestore 上傳前必須再次驗證所有備註長度與禁用 pattern。

備註不得被送入 GA event，也不得出現在檔名、URL path、document title 或其他容易外洩的位置。

## 秘密檔案 JSON 形狀

秘密檔案 JSON 代表一本可攜帶的筆記本。它應保留最少但足夠讓本專案功能運作的資訊：`profileName`、題庫版本、出題範圍、各分類與各細項填答、spotlight，以及必要的建立/更新時間。除非有強烈功能必要，不應加入身份驗證、防刷、裝置綁定、本機 UI 游標或其他非筆記本內容。

本地保存、加密 JSON 檔案下載／上傳、跨裝置轉移與雲端分享使用同一份秘密檔案 JSON 作為核心資料形狀。下載時以內建於前端的共用 key 將核心 JSON 加密後包進版本化 JSON 封套，上傳時自動解密並通過正式 schema 驗證；這只用來增加檔案被直接閱讀的成本，不能宣稱為真正的機密保護或存取控制。雲端版本可額外包裝 server metadata 與防濫用欄位，但使用者作答內容本體應一致。私下轉傳下載檔不需要也不應嘗試證明是同一個人，因為本專案刻意維持無登入設計，也允許使用者把手機填到一半的筆記轉到電腦繼續填。

```json
{
  "schemaVersion": 1,
  "fileId": "local_01HY...",
  "createdAt": "2026-07-08T12:00:00.000Z",
  "updatedAt": "2026-07-08T12:30:00.000Z",
  "profileName": "兔子",
  "questionBank": {
    "bankVersion": "2026-07-08",
    "schemaVersion": 1
  },
  "scope": "activeOnly",
  "answers": {
    "category.impact_spanking.active": {
      "state": "answered",
      "experience": "some",
      "preference": "like",
      "note": ""
    },
    "detail.impact_spanking.leather_paddle.passive": {
      "state": "filteredOut"
    }
  },
  "spotlight": {
    "active": {
      "selectedQuestionIds": []
    },
    "passive": {
      "selectedQuestionIds": []
    }
  }
}
```

`spotlight.active` 與 `spotlight.passive` 是兩個完全分離的方向池，各自最多保存 5 個同方向 question IDs，不得把主導側項目寫入配合側池或反向混放。載入 schema v1 的單一 `selectedQuestionIds` 舊格式時，runtime 必須依 question ID 的 `.active`／`.passive` 尾碼拆分成兩池，升級為 schema v2，並由本地 repository 立即重新保存遷移後資料。

`answers` 必須能容納分類層與細項層。當題庫新增問題時，舊檔案載入後應以目前 scope 自動補上 `unanswered` 或 `filteredOut` 狀態，不應修改使用者已回答的舊答案。

本機 UI 可以在 localStorage 中另存目前進行到哪一題、最近開啟的分類或列表排序等暫態資訊，但這些不屬於秘密檔案 JSON 本體，也不應出現在下載檔案的明文內容或雲端檔案中。

若題庫更新時刪除項目，舊檔案中的舊答案資料仍應保留在 JSON 中，但目前題庫閱覽畫面預設隱藏該題；匯入題庫時只要偵測到刪除項目，Agent 必須停止並請使用者二次確認，不可靜默移除題目。

若題庫更新時新增或修改警示，舊檔案閱覽時使用目前題庫最新版警示。

## 本地保存

本地秘密檔案使用 `localStorage`。它是可建立、可讀、可寫、可刪除的本機草稿與歷史檔案系統。

要求：

- 使用集中 storage service 或 composable，不得在各 view 零散直接操作 localStorage。
- 每回答一題都必須立即寫入 localStorage。
- `updatedAt` 只在使用者實際改變作答內容或 Spotlight 選擇時更新；僅開啟舊檔案進入編輯、重存相同答案，或因新版題庫補入未作答題目時，必須保留原本的最後編輯時間。
- 逐一答題流程中，使用者直接關閉網頁也必須能從主頁的「打開舊筆記」繼續。
- localStorage 不可用時，當前 session 仍應保留記憶體 fallback，並告知使用者離開後可能無法保存。
- 本地檔案列表應保存檔案摘要，例如 `fileId`、`profileName`、`scope`、`createdAt`、`updatedAt`、完成度與目前階段。
- 舊檔案頁分為「本地檔案」與「雲端檔案」兩個 viewer。只有其中一側有檔案時優先顯示該側；兩側都有或都沒有時優先顯示本地檔案。
- 本地檔案列表依 `updatedAt` 由新到舊排序，至少顯示 `profileName`、最後編輯時間、`scope` 與完成度；提供編輯、唯讀檢視、刪除及下載加密 JSON 檔案。唯讀檢視必須用瀏覽器原生 `_blank` 連結在新分頁或新視窗開啟，避免中斷目前管理位置。
- 本地匯入改為選擇並上傳先前從其他裝置下載的 JSON 檔案，不顯示 JSON 文字輸入區。系統必須自動解密版本化封套，再通過正式 schema／store／repository 邊界；為了既有使用者轉移，仍可讀取舊版未加密完整 JSON 檔案。同 `fileId` 覆蓋前必須比較新舊 `updatedAt` 並取得確認。匯入完成後預設在新分頁或新視窗開啟唯讀檢視。
- 本地檔案的唯讀檢視、編輯、下載與刪除都是常用核心操作，必須直接顯示在每份檔案的第一層，不收進「更多操作」dialog。下載使用只有圖示、但具可及名稱的按鈕；刪除也可只顯示 icon，兩者都必須保留清楚的 hover／focus 狀態。桌機與手機版須依掃讀與觸控需求分別安排，不得只縮放；手機卡片底部固定排列檢視、編輯與下載，刪除放在卡片右上角。手機頁首沿用設定頁的資訊節奏，依序呈現副標／標題、兔子、說明、主要內容，返回主頁放在內容最後；本地／雲端切換與匯入入口不得包成歸屬不清的單一面板。列表變長時由頁面自然垂直捲動，不建立互相競爭的第二層捲動容器。
- 刪除本地檔案只影響本機資料；不代表刪除任何已上傳的雲端分享版本。

建議 localStorage keys：

- `bdsm-boundary-test-secret-files:index`
- `bdsm-boundary-test-secret-files:file:{fileId}`

## 雲端分享與 Firestore

建立分享連結前，確認 dialog 必須清楚說明持有完整連結者可讀、雲端檔案長期保存且一般使用者目前無法自行修改或刪除，並提供以新分頁開啟的使用條款與隱私權政策。不得用預先勾選或模糊按鈕代替知情行為；使用者按下「了解並建立分享連結」（各語系等義文案）即表示已閱讀兩份法律文件，並明確同意上傳該份可能含有敏感內容的檔案，不另加 checkbox。

分享提示應中立說明完整連結可能被讀取與再次轉傳。使用者可以自行評估並決定要分享到哪些人、平台或空間；產品不得禁止公開張貼，也不得替使用者判定特定分享位置是否可信。

雲端只保存使用者明確確認要分享的秘密檔案版本。雲端資料是 create/read only：

- 允許：建立新的分享版本。
- 允許：依分享 ID 讀取既有版本。
- 不允許：編輯既有雲端版本。
- 不允許：刪除既有雲端版本。

使用者若在本地修改已分享檔案並再次上傳，必須建立新的雲端文件與新的分享 ID，不得覆寫原文件。

舊檔案頁的雲端 viewer 在 localStorage key `bdsm-boundary-test-cloud-shares:v2` 保存已驗證分享的顯示 metadata，至少包含 `shareId`、server `createdAt`、`profileName` 與 `scope`，但不保存完整、可編輯的雲端檔案。檔案列表與時光機選擇視窗只能讀取這份本機 metadata，不得為了渲染列表逐筆呼叫雲端；只有使用者進入 `preview?source=cloud&file={shareId}`，或在時光機明確確認兩份選擇後，才讀取 Firestore 唯讀版本。舊的 `bdsm-boundary-test-cloud-share-ids:v1` ID-only 索引可在本機遷移為 metadata 尚缺的相容項目，仍不得在列表背景補查雲端。雲端入口使用「連結檔案」與連結加號圖示；接受分享 URL 或 share ID，必須先確認遠端檔案可讀，再把讀回的顯示 metadata 連結到這台裝置。每個雲端檔案第一層另提供只有圖示、具可及名稱的分享按鈕，直接複製完整分享連結。從列表移除雲端項目只解除本機連結，不得刪除 Firestore 文件。成功上傳後也必須保存顯示 metadata，並主動以新分頁開啟雲端 preview；新分頁只能在雲端檔案成功建立後開啟，不得在上傳前預先開啟空白頁。若雲端已建立但 localStorage 寫入失敗，UI 必須如實告知使用者檔案已建立但未連結，並保留可開啟的分享網址。

作者提供的固定範例檔案可在每台裝置的雲端檔案列表顯示為特殊的「作者範例」，但它不是已連結 metadata，也不得在背景讀取 Firestore 或加入時光機選擇。使用者選擇不再顯示時，只在本機保存該偏好，不刪除或修改雲端檔案。

已分享版本是長期不可編輯、不可由一般使用者刪除、不可撤回且永不過期的分享快照。唯一例外是網站管理員因法律要求手動移除或批次處理資料；這不是一般使用者功能。

Firestore 建議集合：

- `sharedSecretFiles/{shareId}`：保存可分享的秘密檔案快照。
- `sharedSecretFileMetadata/{shareId}`：保存不對一般閱覽者回傳的匿名防濫用 metadata。
- `uploadRateLimits/{sourceHash}`：保存最近 24 小時的匿名來源上傳時間；以 `expiresAt` TTL 清理。
- `uploadGlobalRateLimits/project`：保存整個 project 最近 24 小時的成功上傳時間；以 `expiresAt` TTL 清理。

雲端文件應至少包含：

- `schemaVersion`
- `shareId`
- `createdAt`
- `questionBank.bankVersion`
- `profileName`
- `scope`
- `answers`
- `spotlight`
- `clientSummary`
- 私有 metadata 文件中的 `sourceFingerprintHash` 或等價匿名防護欄位

公開雲端文件可在秘密檔案 JSON 外層保存 `shareId`、server `createdAt` 與 `clientSummary`。`sourceFingerprintHash`、`sourceHash`、`userAgentHash`、App ID 與 payload size 等私有防濫用資料必須放在獨立 metadata 集合，不得出現在 direct read 可取得的公開文件。這些 server metadata 不是使用者私下轉傳 JSON 的必要內容。`profileName` 必須存在於秘密檔案 JSON 本體；閱覽雲端檔案時，結果頁與必要警語使用雲端檔案紀錄的 `profileName`。

匿名運作不代表完全無防護。建立分享只能經過強制 App Check 的 `createSharedSecretFile` callable；依 ID 讀取則由 browser Firestore Lite SDK 直接單筆 `get sharedSecretFiles/{shareId}`。Cloud Firestore 必須開啟 App Check enforcement，Security Rules 只能允許符合 `sf_` 加 144-bit random 格式的 document `get`，並拒絕 collection `list`、所有 client writes，以及 `sharedSecretFileMetadata`、`uploadRateLimits`、`uploadGlobalRateLimits` 等私有集合的全部 client access。分享 ID 是 bearer capability：任何取得有效連結且通過 App Check 的人都可讀取，這不是閱讀者身份驗證。同一匿名來源上傳限制為 60 分鐘內最多 5 次、24 小時內最多 10 次；整個 project 另限制 60 分鐘內最多 300 次、24 小時內最多 2000 次成功建立。兩組計數由 Firestore transaction 與 server timestamp 原子檢查並增加；不得把前端節流描述為後端防刷。browser 另記錄本機成功上傳 timestamps 與後端回傳的來源／全站冷卻時間，在呼叫 Function 前先攔下本機已知超額請求；24 小時窗口只顯示向上取整至整小時的約略時間，60 分鐘窗口只顯示向上取整至 10 分鐘的約略時間。成功上傳後，同一結果編輯頁對相同檔案、相同分享內容直接重用既有 share URL，不建立重複快照；這兩項前端措施皆可被繞過，後端限制仍是唯一權威。來源 IP 依 Cloud Run functions／Cloud Functions 的 managed header contract，取 `X-Forwarded-For` 第一個位址作為正常瀏覽器請求的 best-effort 來源，再以 HMAC source hash 執行 5／10 次限流；不得取代理鏈倒數第二段而把不同使用者合併到共同 Google proxy，也不得在正式 forwarded header 無效時退回共用 runtime socket address。第一個位址仍可能被能取得合法 App Check limited-use token 的進階自製 client 預填，因此不是不可偽造的身份或唯一防刷邊界；App Check 與 replay protection 提高濫用成本，全站 300／2000 次限制、`maxInstances`、payload cap 與 timeout 共同限制最終成本。若未來要求強 IP 限流，必須改由受控 External Application Load Balancer／Cloud Armor 覆寫可信來源 header，並封鎖直接呼叫 Function。create 另保留 512 KiB payload、最多 700 answers 等限制。原始 IP／user agent 不持久化；HMAC key 只存 Secret Manager。

## 新檔案與結果流程

新檔案先選擇 `activeOnly`、`passiveOnly` 或 `all` scope，完成 `其他` 以外的分類層後進入編輯結果頁，再由使用者自由選擇分類細項。每次有效回答即時寫回本地秘密檔案；細項入口依目前方向的作答進度決定直接顯示全部，或在部分作答時提供「僅顯示未作答／顯示全部」。

編輯結果與唯讀檢視是兩個獨立頁面與使用情境，但都讀取同一份 `SecretFile`：

- 編輯頁可更新答案、Spotlight 與本地檔案，並建立新的雲端分享版本。
- 唯讀頁不得修改答案或建立雲端分享，只呈現 schema 驗證後的本地或雲端資料。
- `all` scope 的主導側與配合側使用獨立 Spotlight pools 與方向狀態，不得交叉保存。
- 分類與細項進度只計算目前 runtime 中符合 scope 的適用題目，`filteredOut` 不進分母。
- `其他` 沒有分類層答案，固定作為細項入口；不得偽造分類層未作答或經驗／喜好值。
- JSON 匯入預設先進入唯讀模式；舊檔案列表分開提供檢視與編輯入口。

這一節只定義資料與模式邊界。劇情、分類卡、Spotlight editor、返回位置、警語、`hardNo` dialog、唯讀資訊架構、圖片、CTA 與 responsive 契約由 `.agents/specs/product_experience.md` 管理。

## 方向詞彙與翻譯

資料模型中的 `active` / `passive` 是穩定 machine value，不得因顯示詞變更而改名。使用者可見短標籤固定為：繁中「主導側／配合側」、簡中「主导侧／配合侧」、日文「リード側／フォロー側」、英文「Leading／Following」。

更新 Google Sheet 時，若繁中原文出現「擔任主動方／擔任被動方」或同義舊稱，必須在保留題意的前提下改為「擔任主導側／擔任配合側」；非繁中翻譯則分別使用「担任主导侧／担任配合侧」、「リード側を担う／フォロー側を担う」與「Take the leading role／Take the following role」。題庫每一個使用者可見字串都必須維護繁中、簡中、日文、英文版本；不得用 bulk translation 取代逐題依繁中原句、BDSM 社群語境與知情同意語氣所做的翻譯。短按鈕不得依賴人工換行，狹窄螢幕若換行時仍須保有一致的最小高度與內距。
- Spotlight 的資料限制、候選資格與方向分離由本文件前述 schema／consistency 規則保護；使用者可見 editor 與閱覽呈現由 `.agents/specs/product_experience.md` 管理。
- `hardNo` 與 `reluctant` 是穩定回答語意，不因 UI 呈現方式改名；`hardNo` 不自動觸發額外資料或保護流程。
- 閱覽警語的人物名稱取自 `profileName`，缺少名稱時使用「兔子」。完整文案與呈現 owner 為 `.agents/specs/product_experience.md`。

## 時光機比對

完整檔案只在使用者確認兩份選擇後讀取，並以 `SecretFile.updatedAt` 排出較早與較新；雲端 metadata 的上傳時間不得取代檔案最後編輯時間。

比較資料固定分為四種互斥作答變化：

1. `焦點喜好的變動`：Spotlight 加入、移出或順序改變。
2. `大分類本身的變動`：分類層經驗、喜好或備註改變，但不包含跨入／跨出 `hardNo`。
3. `絕對禁止的底線的變動`：分類或細項喜好跨入／跨出 `hardNo`。
4. `其他細項的變動`：其餘細項經驗、喜好或備註改變。

同一作答變化不得重複進入多區。Spotlight 位置與作答內容是不同語意，可以分別出現在焦點區與一個作答區。

同一題只有在兩份檔案中皆為 `answered`，且該方向同時存在於兩份 scope，才有比較資格。任一側為 `unanswered`、`filteredOut` 或缺少 question ID 時不比較；`unsure` 是完整作答值。計算 Spotlight 順位前，兩份清單都先排除不具比較資格的題目。

scope 新增或移除整個方向時不展開逐題差異，只產生一次該方向在先前或之後沒有作答紀錄的統一資料狀態。題名使用目前語系的現行題庫；無法辨識的歷史 ID 不直接外露。

區塊順序、preview 上限、分組、卡片、顏色、dialog、空狀態與 responsive layout 由 `.agents/specs/product_experience.md` 管理。

可直接匯入的 schema v2 時光機範例保留在 `examples/time-machine/`，用來驗證四區基本差異、跨大量分類的高密度差異、暱稱／scope 變化的整側提示與完全無作答差異；這些範例是人工檢視資產，不得在一般清理中刪除。

## 類別圖片

每個大分類都必須有一張以相關物品為主的圖片作為畫面渲染素材；這是第一版上架必備項，沒有圖不算完成。圖片方向：

- 卡通、溫和、道具式、非煽情。
- 以物品或抽象情境示意，例如拍打類可使用木拍、藤條等小物。
- 避免露骨身體呈現、性化姿勢、NSFW 構圖或鼓勵實踐感。
- 圖片 asset 應和題庫分類 ID 對應，例如 `categoryVisualAsset`。
- 圖片載入要符合 `.agents/skills/professional/technical_architecture.md` 的資源預熱策略，不一次阻塞初始載入。
- 題庫更新 workflow 遇到新增分類時，不必自動產生「缺圖片待辦」檔，但必須在回報中提醒使用者完成該分類圖片製作。

## 題庫更新工作流

每次使用者更新 Google Sheet 後，Agent 應依 `.agents/workflows/update-question-bank-from-google-sheet.md` 執行更新：

1. 讀取本文件、mission、domain skill、architecture 與 workflow。
2. 從 Google Drive 重新讀取 `BDSM boundary test items` metadata、分頁、表頭與資料。
3. 驗證試算表欄位符合預期。
4. 產生或更新題庫 JSON、ID 對照檔與翻譯資料。
5. 對比前一版題庫，列出新增、刪除、改名、警示變更與翻譯待辦。
6. 若 ID 對應不明確，或偵測到刪除項目，停止並要求人工確認。
7. 保留繁體中文原文，僅允許標點或明確錯字修正。
8. 非繁中翻譯由 Agent 產生後，release 前必須經人工審核。
9. 更新題庫版本與來源 metadata。
10. 執行可用的 schema validation、typecheck 或 build。

## 未來 Agent 行動

- 實作前先確認本文件仍符合 Google Sheet 的最新表頭與分頁。
- 不要把 299 個細項一次塞進初始作答流程；分類層先行是核心體驗要求。
- 不要把 `unanswered`、`filteredOut`、`unsure`、`seeDetails` 混成同一種狀態。
- 不要把喜好分數或 spotlight 解讀成同意、承諾或建議清單。
- 若需要修改 Firestore 權限、上傳限制或雲端資料結構，必須同步更新本文件與 technical architecture。
