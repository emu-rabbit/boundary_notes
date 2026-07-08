# 題庫與秘密檔案核心系統規格

## 文件目的

本文件定義 `bdsm_boundary_test` 的核心測驗系統：題庫來源、題目分層、作答流程、回答資料格式、本地保存、雲端分享、匯出與後續題庫更新方式。後續 Agent 在實作題庫、測驗流程、結果頁、本地檔案、Firestore 分享、題庫匯入或翻譯時，必須先讀取本文件。

本系統的目標不是把題目做成一次性固定表單，而是建立可長期維護的題庫與回答資料結構。題目未來會新增、修訂、警示補強或翻譯擴充；回答資料必須能在題庫版本變動後仍保留可解讀性。

## 來源資料

第一批正式題庫來源為 Google Drive 試算表：

- 標題：`BDSM boundary test items`
- 檔案 ID：`1shrEavMkoumIpe07vL3DXp0uj7tcHzqgPV6qzU6jvAE`
- 試算表 locale：`zh_TW`
- 目前觀察時間：2026-07-08

試算表結構：

- 第一個分頁為 `頂層分類項目`。
- `頂層分類項目` 欄位為：`名稱`、`主動方描述`、`被動方描述`、`項目數`。
- 其餘分頁各自對應一個分類，例如 `拍打類項目`、`穿刺/割類項目`、`其他`。
- 各分類分頁欄位為：`項目`、`主動方描述`、`被動方描述`、`警示`。
- 目前第一批資料在 `頂層分類項目` 顯示總項目數為 `295 個`；若展開主動方與被動方方向，約為 `590` 個方向性細項題目。

繁體中文文案以試算表為 source of truth。除標點符號、明確錯字或使用者明確要求外，Agent 不得擅自改寫繁體中文題目、描述、分類名稱或警示文案。

## 題庫模型

題庫應分成三層：

1. `QuestionBank`：整份題庫版本、來源、支援語系與分類集合。
2. `Category`：分類層問題，例如 `拍打類項目` 的主動方與被動方版本。
3. `DetailItem`：分類內細項，例如 `用手`、`用木拍`、`破皮流血的程度` 的主動方與被動方版本。

方向模式：

- `active`：主動方項目。
- `passive`：被動方項目。

使用者建立新檔案時必須選擇出題範圍：

- `activeOnly`：僅顯示主動方項目。
- `passiveOnly`：僅顯示被動方項目。
- `all`：主動方與被動方皆顯示；分類與細項都會展開成兩倍方向性題目。

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
  "schemaVersion": 1,
  "bankVersion": "2026-07-08",
  "source": {
    "kind": "google-sheet",
    "title": "BDSM boundary test items",
    "fileId": "1shrEavMkoumIpe07vL3DXp0uj7tcHzqgPV6qzU6jvAE",
    "modifiedTime": "2026-07-08T10:56:35.996Z"
  },
  "locales": ["zh-Hant", "zh-Hans", "ja", "en"],
  "categories": [
    {
      "categoryId": "impact_spanking",
      "sourceSheetName": "拍打類項目",
      "zhHantName": "拍打類項目",
      "roles": {
        "active": {
          "title": "拍打類項目(主動方)",
          "description": "對對方進行包含打屁股在內的拍打相關衝擊遊戲"
        },
        "passive": {
          "title": "拍打類項目(被動方)",
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
          "prompt": "用皮拍拍打對方進行衝擊遊戲"
        },
        "passive": {
          "prompt": "被皮拍拍打進行衝擊遊戲"
        }
      },
      "warning": null
    }
  ]
}
```

多語系資料可放在同一 JSON 或拆成 locale chunk。繁體中文原文必須可追溯到 Google Sheet；簡體中文、日文與英文翻譯應貼合 BDSM 圈子的自然語境與知情同意語氣，不得只照字面翻譯，也不得把語氣翻得更露骨或更鼓勵實踐。

## 回答選項

分類層題目詢問：

- 經驗程度：`none` 沒經驗、`little` 少量經驗、`some` 一些經驗、`extensive` 大量經驗、`unsure` 不確定、`seeDetails` 請看細項。
- 喜好程度：`hardNo` 絕對禁止、`reluctant` 勉強配合、`neutral` 無感覺、`like` 喜歡、`love` 超級喜歡、`unsure` 不確定、`seeDetails` 請看細項。
- 備註：自由填答文字，選填。

細項題目詢問：

- 經驗程度：`none` 沒經驗、`little` 少量經驗、`some` 一些經驗、`extensive` 大量經驗、`unsure` 不確定。
- 喜好程度：`hardNo` 絕對禁止、`reluctant` 勉強配合、`neutral` 無感覺、`like` 喜歡、`love` 超級喜歡、`unsure` 不確定。
- 備註：自由填答文字，選填。

`seeDetails` 只允許用於分類層，不允許用於細項層。它表示使用者認為分類內差異太大，不應被迫替整個分類做單一答案。

分類層與細項層都必須同時填寫經驗程度與喜好程度才可前進；備註永遠選填。逐一答題流程不提供跳題，使用者若無法判斷，必須選擇 `unsure` 不確定。

## 回答狀態

回答資料必須明確區分：

- `unanswered`：題目符合本檔案出題範圍，但使用者尚未填答。
- `answered`：使用者已填答。
- `filteredOut`：題目不符合使用者建立檔案時選擇的出題範圍，例如 `activeOnly` 檔案中的被動方題目。

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

本地保存、複製 JSON、跨裝置轉移與雲端分享使用同一份秘密檔案 JSON 作為核心資料形狀。雲端版本可額外包裝 server metadata 與防濫用欄位，但使用者作答內容本體應一致。私下轉傳 JSON 不需要也不應嘗試證明是同一個人，因為本專案刻意維持無登入設計，也允許使用者把手機填到一半的筆記轉到電腦繼續填。

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
    "selectedQuestionIds": []
  }
}
```

`answers` 必須能容納分類層與細項層。當題庫新增問題時，舊檔案載入後應以目前 scope 自動補上 `unanswered` 或 `filteredOut` 狀態，不應修改使用者已回答的舊答案。

本機 UI 可以在 localStorage 中另存目前進行到哪一題、最近開啟的分類或列表排序等暫態資訊，但這些不屬於秘密檔案 JSON 本體，也不應出現在複製 JSON 或雲端分享快照中。

若題庫更新時刪除項目，舊檔案中的舊答案資料仍應保留在 JSON 中，但目前題庫閱覽畫面預設隱藏該題；匯入題庫時只要偵測到刪除項目，Agent 必須停止並請使用者二次確認，不可靜默移除題目。

若題庫更新時新增或修改警示，舊檔案閱覽時使用目前題庫最新版警示。

## 本地保存

本地秘密檔案使用 `localStorage`。它是可建立、可讀、可寫、可刪除的本機草稿與歷史檔案系統。

要求：

- 使用集中 storage service 或 composable，不得在各 view 零散直接操作 localStorage。
- 每回答一題都必須立即寫入 localStorage。
- 逐一答題流程中，使用者直接關閉網頁也必須能從主頁的「打開舊筆記」繼續。
- localStorage 不可用時，當前 session 仍應保留記憶體 fallback，並告知使用者離開後可能無法保存。
- 本地檔案列表應保存檔案摘要，例如 `fileId`、`profileName`、`scope`、`createdAt`、`updatedAt`、完成度與目前階段。
- 舊檔案區第一版只需要列表，不需要搜尋、篩選或排序進階功能。
- 刪除本地檔案只影響本機資料；不代表刪除任何已上傳的雲端分享版本。

建議 localStorage keys：

- `bdsm-boundary-test-secret-files:index`
- `bdsm-boundary-test-secret-files:file:{fileId}`

## 雲端分享與 Firestore

雲端只保存使用者明確確認要分享的秘密檔案版本。雲端資料是 create/read only：

- 允許：建立新的分享版本。
- 允許：依分享 ID 讀取既有版本。
- 不允許：編輯既有雲端版本。
- 不允許：刪除既有雲端版本。

使用者若在本地修改已分享檔案並再次上傳，必須建立新的雲端文件與新的分享 ID，不得覆寫原文件。

已分享版本是長期不可編輯、不可刪除、不可撤回且永不過期的分享快照。例外只限網站管理員因法律、服務規範、濫用或營運安全理由，手動移除或批次處理資料；這不是一般使用者功能。

Firestore 建議集合：

- `sharedSecretFiles/{shareId}`：保存可分享的秘密檔案快照。
- `uploadAttempts/{anonymousSourceHash}/buckets/{bucketId}` 或等價結構：保存匿名來源的上傳節流資料。

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
- `sourceFingerprintHash` 或等價匿名防護欄位

雲端文件可在秘密檔案 JSON 外層保存 `shareId`、server `createdAt`、`clientSummary`、`sourceFingerprintHash` 或等價匿名防護欄位；這些是雲端防濫用與讀取所需 metadata，不是使用者私下轉傳 JSON 的必要內容。`profileName` 必須存在於秘密檔案 JSON 本體；閱覽雲端檔案時，結果頁與必要警語使用雲端檔案紀錄的 `profileName`。

匿名運作不代表完全無防護。上傳限制基準為同一使用者或匿名識別來源 60 分鐘內最多 5 次、1 天內最多 10 次。若純 Firestore security rules 無法可靠實作嚴格節流，Agent 必須先向使用者回報限制並確認是否導入 Cloud Functions、App Check 或其他 Firebase 防護機制；不得假裝前端節流已等同後端防刷。架構設計時優先嘗試不碰 Cloud Functions 的方案，但如果安全取捨需要後端能力，Agent 必須主動詢問使用者決策。

## 新檔案流程

建立新檔案的流程：

1. 使用者點擊「創建新檔案」。
2. 劇情氛圍中，守密兔詢問出題範圍：主動方、被動方、皆顯示。
3. 守密兔公告本次會出現的分類個數與細項個數，並說明會先從分類開始。
4. 守密兔用溫柔語氣告知「太多了？沒關係」，說明每題都會即時存檔，使用者未來可以回到舊檔案區繼續，也可用 JSON 轉移至其他裝置。
5. 系統開始逐一詢問除了 `其他` 以外的分類層問題。
6. 完成分類層後進入主要結果頁。
7. 結果頁展示分類大按鈕、各分類填答結果與進度百分比；`all` scope 使用者必須能切換主動方與被動方分類畫面。
8. 使用者可自由選擇分類大按鈕，進入該分類內部細項逐一填答。
9. 使用者在結果頁可回到網頁主頁；劇情導覽或逐一答題狀態下不可提供直接回主頁的主要入口，也不提供「暫停」或「稍後繼續」按鈕，但必須顯示進度條，且每次填答即時保存。
10. 使用者若中途直接跳出，下次從舊檔案進入編輯並點擊分類大按鈕時，系統必須先詢問要「全部重新審題」或「只看未答題目」。

分類題畫面：

- 主標題格式如 `拍打類項目(主動方)`。
- 描述使用試算表對應方向描述，例如 `對對方進行包含打屁股在內的拍打相關衝擊遊戲`。
- 提供小按鈕開啟預覽視窗，列出該分類中的細項，協助使用者決策。

細項題畫面：

- 顯示細項方向性描述。
- 若 `warning` 有內容，顯示 `高風險項目：{warning}`。
- 警示內容保留試算表原文，不加入操作教學。

## 結果頁

結果頁有兩個模式：

- `edit` 編輯模式：分類大按鈕點入後進入逐一細項填答。
- `review` 閱覽模式：分類大按鈕點入後一次檢視該分類所有細項答案。

結果頁必要元素：

- 分類大按鈕，顯示分類層答案與細項完成度。
- 所有分類的進度百分比，都以目前已填答的細項數 / 當前 runtime 中該分類下符合 scope 的總細項數計算；不得把被篩除題目算入分母。
- 若分類層答案為 `seeDetails`，分類大按鈕顯示「請看細項」即可，不自動推算分類摘要。
- `其他` 也是分類大按鈕，固定排序最後，但只顯示細項完成度與入口狀態，不顯示分類層經驗/喜好答案。
- `all` scope 的結果頁必須讓主動方、被動方各自形成一套約 20 個分類畫面，並用切換器切換；不要在同一分類卡內強行並列主動/被動。
- 喜好排行榜：使用者完全手動選擇最多 5 個項目，顯示在結果頁作為 spotlight。可選候選僅限已作答項目，且必須來自該檔案目前最高喜好分數的那一群；未作答項目不可被選擇。排行榜是使用者自行整理偏好，不得呈現為社交排行或鼓勵嘗試清單。
- 閱覽模式必要警語：`這份測驗結果僅供參考，並無法完整的描述XXX的喜好或特質，也請勿用來替代任何必要的溝通。`

`XXX` 應依目前檔案的 `profileName` 顯示；若沒有名稱，使用「兔子」。若是閱覽雲端檔案，使用該雲端檔案紀錄的 `profileName`。

`hardNo` 絕對禁止不需要觸發額外保護流程，但 UI 可以用顏色、字重或其他視覺設計讓界線清楚可掃讀。`reluctant` 勉強配合的命名保留。

閱覽模式提供：

- 上傳至雲端：先告知使用者分享須知、資料敏感性、create-only 雲端版本與不可替代溝通，確認後才上傳 Firestore。
- 下載本地 HTML 檔結果頁：輸出本地可直接雙擊開啟的單檔 HTML，可使用 CDN 載入 CSS 或套件，但離線/本地開啟時必須能呈現與現有結果頁幾乎一致的閱覽結果。HTML 內嵌完整資料以供離線閱覽，但不包含編輯功能。
- 複製 JSON 資料字串：複製秘密檔案 JSON 本體，讓使用者可私下分享、備份或跨裝置轉移並繼續填答。它不包含雲端防濫用 metadata、登入/身份驗證資訊、裝置綁定資訊或本機 UI 暫態游標；匯入時仍需驗證 schema、版本、備註安全與題庫對應。

上傳前須知文案暫時留空；遇到實作該區時，Agent 必須詢問使用者，或先放入草稿文案並明確提醒使用者調整。

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
- 不要把 295 個細項一次塞進初始作答流程；分類層先行是核心體驗要求。
- 不要把 `unanswered`、`filteredOut`、`unsure`、`seeDetails` 混成同一種狀態。
- 不要把喜好分數或 spotlight 解讀成同意、承諾或建議清單。
- 若需要修改 Firestore 權限、上傳限制或雲端資料結構，必須同步更新本文件與 technical architecture。
