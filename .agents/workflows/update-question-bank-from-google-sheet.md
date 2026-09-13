# 從 Google Sheet 更新題庫工作流

## 目的

當使用者更新 Google Drive 試算表 `BDSM boundary test items` 後，Agent 使用本工作流將雲端題庫同步到 repo 內的題庫資料、翻譯與型別。此工作流的重點是保護穩定 ID、保留繁體中文原文、產生可審查 diff，並避免題庫版本變動破壞舊秘密檔案。

## 觸發條件

- 使用者要求更新題庫、同步問題庫、重新匯入 Google Sheet 或類似任務。
- 使用者表示已在雲端硬碟更新 `BDSM boundary test items`。
- Agent 正在實作題庫 importer、schema、翻譯或題庫資料檔。

## 必讀文件

1. `AGENTS.md`
2. `.agents/mission/project_mission.md`
3. `.agents/skills/domain/bdsm_consent_background.md`
4. `.agents/skills/professional/technical_architecture.md`
5. `.agents/specs/question_bank_and_secret_file_system.md`
6. 本文件

若涉及 UI 呈現、圖片或翻譯，也讀取：

1. `.agents/skills/professional/ui_ux_standards.md`
2. `.agents/skills/visual/main_rabbit_image_generation.md`，僅在主角兔子圖片或 prompt 受影響時需要。

## 雲端來源

- Google Sheet title：`BDSM boundary test items`
- Google Sheet file ID：`1shrEavMkoumIpe07vL3DXp0uj7tcHzqgPV6qzU6jvAE`
- 讀取順序：metadata -> `頂層分類項目` -> 各分類分頁。

## 匯入步驟

1. 用 Google Drive connector 找到目標試算表，確認 title、file ID、modified time 與 spreadsheet URL。
2. 讀取 spreadsheet metadata，記錄所有 visible sheet title、sheetId、index、rowCount、columnCount。
3. 讀取 `頂層分類項目` 的表頭與有效資料列。
4. 驗證 `頂層分類項目` 表頭必須包含 `名稱`、`主導側描述`、`配合側描述`、`項目數`。
5. 逐一讀取分類分頁有效資料列。
6. 驗證分類分頁表頭必須包含 `項目`、`主導側描述`、`配合側描述`、`警示`。
7. 將空白列排除，保留所有非空資料列。
8. 將 `頂層分類項目` 的分類名稱與分頁名稱對齊；若有分類列找不到分頁，或有多餘分頁不在分類表中，停止並回報。
9. 檢查 `項目數` 與實際有效細項列數是否一致；若不一致，停止並回報差異。
10. 產生 structured question bank JSON 與型別需要的衍生資料；細項的共用 `項目` 保存為 `sourceLabel`。逐項判斷它是否能作為短、中性且不會誤解方向的共用 `title`；若可以，兩側可共用。若它同時寫了兩個方向，或只正確描述其中一側，則依 `主導側描述`、`配合側描述` 為兩側各寫一個方向正確的短 `title`；`description` 保留完整說明。

    - 角色扮演的成對角色是例外：`active` / `passive` 不預設對應老師／學生、上司／下屬等其中一個角色。此類項目使用兩側共用的中性情境題名，並保留試算表中刻意模糊的主導／配合描述。
11. 更新 `bankVersion` 與 source metadata。
12. 對照既有 ID map；新增列產生新 ID，已存在列沿用舊 ID。
13. 若列名、分類名或順序變更導致無法可靠對應舊 ID，停止並請使用者人工確認。
14. 若偵測到刪除項目，停止並請使用者二次確認；舊檔案中的舊答案資料應保留，但目前題庫閱覽畫面預設隱藏該題。
15. 逐題更新非繁中翻譯；翻譯應貼合 BDSM 圈子與知情同意語境、維持繁中原句的語義，不得字面硬翻、bulk translation 或改得更露骨，且 release 前必須經人工審核。
16. 產生或更新題庫變更摘要，至少列出新增、刪除、改名、警示變更與翻譯待確認項。
17. 若新增分類，回報中必須提醒使用者完成該分類圖片製作；workflow 不需要自動建立缺圖待辦檔。
18. 執行 schema validation、typecheck 或 build；若驗證受 Windows/Codex sandbox 影響，依 user-level Agent guidance 處理，並區分環境限制與真正程式錯誤。

## 內容保護規則

- 繁體中文題目、分類描述、細項描述與警示以 Google Sheet 為 source of truth。
- 細項的 `項目` 是來源辨識 metadata，也是逐項審核共用短題名的候選；不可機械式當成題名。所有語系都必須為主導側與配合側維護有效 `title`：中性且不會誤解方向時可共用；若原始標籤混合兩個方向或在一側方向錯誤，必須分別使用正確的短題名。
- 除標點符號、明確錯字或使用者明確要求外，不得擅自改寫繁體中文文案。
- 若繁中原文出現「主動方／被動方」或「擔任主動方／擔任被動方」，以「主導側／配合側」統一；簡中、日文、英文對應為「主导侧／配合侧」、「リード側／フォロー側」、「Leading／Following」。例如「在性交中擔任主導側」對應「在性交中担任主导侧」、「性交においてリード側を担う」、「Take the leading role during intercourse」。
- 高風險警示保留試算表原文；UI 只加固定前綴 `高風險項目：`。
- `其他` 不進入第一輪分類層作答，但結果頁仍必須顯示為分類大按鈕，作為其細項入口。
- `activeOnly`、`passiveOnly`、`all` scope 的 filtering 必須在資料層可判斷，不只靠 UI 隱藏。
- 題庫新增題目時，舊秘密檔案載入後應補出 `unanswered` 或 `filteredOut`，不可覆寫舊答案。
- 題庫警示新增或改動時，舊檔案閱覽使用目前題庫最新版警示。

## ID map 規則

本專案不在 Google Sheet 增加 `分類ID` 或 `項目ID` 欄；repo 內 ID map 是向後相容的核心資料。

- 不得因中文文案微調自動產生新 ID。
- 不得把刪除後又新增的不同項目套用舊 ID，除非使用者或人工 review 明確確認是同一題。
- 若只改順序，不應造成 ID 變動。
- ID 不得包含流水號、列號或排序資訊，因為使用者會調整題目順序或在中間插入新題。
- 若只補警示，不應造成 ID 變動。
- 若分類名稱改動但語意明確相同，應保留原 `categoryId` 並更新 source label。

## 匯入後檢查

收尾前至少檢查：

- 題庫總分類數。
- 扣除 `其他` 後的分類層作答題數。
- 細項有效列總數。
- 展開主被動後的細項方向性題數。
- 有警示的細項數量。
- 新增、刪除、改名與警示變更列表。
- 翻譯缺漏列表。
- schema validation / typecheck / build 結果。

## 產出回報

最終回覆應包含：

- 讀取的 Google Sheet title、file ID 與 modified time。
- 題庫總數變化。
- 是否有需要人工確認的 ID 或翻譯。
- 更新了哪些 repo 檔案。
- 執行了哪些驗證，或為何無法驗證。
