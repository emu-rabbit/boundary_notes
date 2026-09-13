---
description: 依每項修改的意圖、可回退邊界與變更性質建立原子化 commit；不得把互不相干的修改打包提交。描述部分必須使用繁體中文。
---

# Git 分類提交工作流 (Git Commit Workflow)

## 概述

本工作流用於處理使用者要求 `add and commit all`、`commit all`、`全部提交` 或類似指令時的提交流程。此要求不代表把所有變更壓成單一 commit；Agent 必須先辨識每項修改要解決的問題或要達成的結果，再以能獨立理解、審查與回退的單一意圖建立各個 commit。

變更性質（文件、功能、修正、重構、測試、工具設定等）是輔助判斷，不是唯一分組依據。兩個修改即使同屬 `Fix:` 或同在一個檔案，只要解決不同問題、可獨立回退，原則上就必須拆成不同 commit。

## 觸發條件

- 使用者要求 `add and commit all`、`commit all`、`全部提交`、`全部加進去並提交` 或等價指令時。
- 使用者要求提交目前所有變更，但沒有明確指定 commit 分組時。

## 核心規則

- **意圖優先分組**：每個 commit 必須對應一個明確的修改意圖，例如「修正儲存後的按鈕回饋」、「同步題庫匯入規格」或「移除已棄用路由」。先依意圖分組，再用變更性質決定 `Feat:`、`Fix:`、`Docs:` 等 header。
- **原子性標準**：同一組內容必須共同完成同一項意圖；拆開後任一 commit 不應留下明顯損壞、錯誤文件敘述或無法成立的中間狀態。若兩組彼此沒有這種必要依賴，就必須拆分。
- **拒絕一包到底**：不得因為使用者說 `all` 就直接 `git add .` 後建立單一籠統 commit。只有在所有變更確實共同完成同一個清楚意圖，且無法合理再拆時，才可以建立單一 commit。
- **保留使用者變更邊界**：若工作樹中存在看似無關或無法判斷來源的變更，必須先摘要並確認 scope，不可把它們偷偷混入 commit。
- **提交計畫先行**：在第一次暫存前，必須列出所有預定 commit：各組的修改意圖、涉及檔案或 hunks、變更性質與預計 commit message。不可只按檔案路徑或副檔名分組。
- **精準暫存**：每次 commit 前只暫存該意圖所需檔案或變更。優先使用精準路徑；同一檔案混有多個可獨立提交的意圖時，必須使用 hunk 級暫存或等效安全方式切分。若無法安全切分，需向使用者說明依賴或風險並詢問。
- **Pascal-case Header**：Commit message header 使用 Pascal-case，例如 `Feat:`、`Fix:`、`Docs:`、`Refactor:`、`Test:`、`Chore:`。
- **繁體中文描述**：Commit message 描述必須使用繁體中文，並遵守 `.agents/skills/core/operating_contract.md`。
- **精準摘要**：Commit message 必須反映該組變更的實際內容，避免 `update files`、`misc changes`、`全部更新` 等模糊描述。
- **提交前驗證**：每個 commit 前至少檢查 `git diff --cached --name-only`、`git diff --cached --stat` 與 `git diff --cached --check`。
- **提交後巡檢**：每次 commit 後重新執行 `git status --short`，確認剩餘變更是否符合下一組分類。

## 執行步驟

1. **讀取規範**：先讀取 `.agents/skills/core/operating_contract.md` 與本工作流。
2. **檢查工作樹**：執行 `git status --short`，列出所有 modified、deleted、untracked 檔案。
3. **分析變更內容**：用 `git diff --stat`、`git diff -- <path>` 或必要的檔案讀取，理解每個檔案與 hunk 的實際修改意圖、依賴與可回退範圍。
4. **建立提交計畫**：先列出預定 commit；每組都要寫明「意圖、性質、檔案或 hunks、預計 message」。以單一意圖為單位，而非以檔案、目錄或 `Feat`／`Fix` 標籤為單位。
5. **檢查原子性與邊界**：確認每組獨立提交後仍能成立；將可獨立回退或處理不同問題的內容拆開。只有為了同一意圖而不可分的程式碼、測試、文件或設定才可同組。
6. **逐組暫存**：針對第一組變更執行精準 `git add <path>`；同檔案的多項意圖使用 hunk 級暫存或等效安全方式切分。
7. **檢查已暫存內容**：執行 `git diff --cached --name-only`、`git diff --cached --stat`、`git diff --cached --check`，並重新閱讀 cached diff，確認它只實現提交計畫中的該項意圖。
8. **建立 commit**：使用符合規範的繁體中文 commit message 提交該組變更。
9. **重複處理**：每次 commit 後執行 `git status --short`，重新確認剩餘變更與下一組意圖相符；重複步驟 6 至 8，直到所有已確認 scope 內的變更都提交完成。
10. **最終確認**：執行 `git status --short`，向使用者回報每個 commit 的意圖、內容與 hash，以及是否仍有未提交變更。

## 分類範例

- `Docs:`：同一項文件意圖所需的 README、AGENTS、skills、architecture、mission、規格或說明文件。
- `Feat:`：同一項新增使用者可見功能、頁面區塊、互動或內容能力。
- `Fix:`：同一個錯誤、回歸、資料不一致或使用者可見問題的修正。
- `Refactor:`：同一個不預期改變行為的結構調整。
- `Test:`：驗證某一功能或修正所需的測試、驗證工具或測試資料。
- `Chore:`：同一項建置、依賴、工具設定、格式化或維護性調整。

## 注意事項

- `all` 代表處理所有已確認 scope 內的變更，不代表忽略分類或 commit 品質。
- 不要因為修改位於同一個檔案、同一個目錄或同一種 header，就假定它們應在同一個 commit。
- 反過來說，為同一意圖同步修改程式碼、測試與文件時，應在它們無法獨立成立的前提下放在同一個 commit，避免為了形式拆出無法使用的中間狀態。
- 若使用者明確要求單一 commit，但變更內容明顯跨多個性質，Agent 應先說明風險並確認是否仍要合併。
- 若分類過程發現目標衝突或 scope 不明，依 `.agents/skills/core/operating_contract.md` 停下來詢問使用者。
- 只有本次變更改變持久契約時，才依 `.agents/skills/core/documentation_governance.md` 更新 canonical 文件。
