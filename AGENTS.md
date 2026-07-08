# Local Codex Notes

## Agent Skill Environment

本專案使用 `.agents` 底下的 Frozen Rabbit 共通 Agent skill 結構。每次任務都應先從核心技能開始讀取：

1. `.agents/skills/core/language_policy.md`
2. `.agents/skills/core/global_standards.md`
3. `.agents/skills/core/goal_oriented_design.md`
4. `.agents/skills/core/decision_traceability.md`
5. `.agents/skills/core/documentation_sync.md`

在規劃或編輯前，Agent 也必須搜尋決策歷史，確認是否有與任務相關的既有決策：

1. `.agents/decisions/decision_history.md`

撰寫、編輯或 review 程式碼時，還要讀取：

1. `.agents/skills/professional/development_standards.md`

建立或修改技術架構、Firebase、Firestore、GA、資料邊界、匿名識別、效能、資源預熱、前端框架或 UI component 策略時，還要讀取：

1. `.agents/skills/professional/technical_architecture.md`

建立或修改 UI、layout、CSS、視覺識別、responsive 行為、文案、資產或使用者互動時，還要讀取：

1. `.agents/skills/professional/ui_ux_standards.md`

生成、修改、評估或撰寫主角兔子相關圖片 prompt / brief 時，還要讀取：

1. `.agents/skills/visual/main_rabbit_image_generation.md`

本專案專屬、可 spawn 的 subagent 定義放在 `.agents/subagents/`。守密兔繪圖與審圖工作使用：

1. `.agents/subagents/secret-rabbit-artist.toml`

該 subagent 僅屬於本 repository，不應安裝或維護為全域 Codex skill。

當使用者要求 `add and commit all`、`commit all`、`全部提交`，或以其他方式要求提交目前所有變更時，讀取：

1. `.agents/workflows/add-commit-all.md`

## Project Direction

本 repository 的長期使命已建立於：

1. `.agents/mission/project_mission.md`

後續 Agent 在處理產品方向、功能規劃、UI/UX、文案、題庫、資料模型、分享流程或風險警示前，必須讀取該 mission 文件，並以其作為本專案的產品 source of truth。

目前已確認的核心方向：

- 專案名稱為「XX的祕密檔案」，`XX` 會根據使用者輸入名稱改變；使用者尚未填入暱稱時，預設名稱與畫面顯示應為「兔子的祕密檔案」。
- 本專案是用於教育、協助自我理解，以及協助人與人之間核對 BDSM（愉虐）互動項目界限的工具。
- 本專案不做社交、配對、鼓勵項目、鼓吹 BDSM 行為本身，或把使用者分類成 BDSM 屬性/角色標籤。
- 題庫以「互動項目」為導向，而不是以「個人屬性」為導向。
- 產品核心理念是知情同意；秘密檔案與分享連結只能支援溝通，不代表永久、即時或不可撤回的同意。
- 產品語氣應溫和、溫柔、有溫度，並以教育與工具為導向，避免露骨、高刺激慾望或 NSFW 呈現。
- 插畫兔子是主要互動角色，核心人物設定檔為 `.agents/assets/characters/main_rabbit_role.png`；相關生圖與延伸素材必須遵守 `.agents/skills/visual/main_rabbit_image_generation.md`，以可愛、隱晦、陪伴式呈現，不可露骨。
- 高風險或可能觸及法律風險的項目需特別警示，但不得提供操作教學或規避法律建議。

目前已確認的技術方向：

- 本專案是純網頁專案，使用 Vite、Vue、TypeScript 與 Tailwind 建構。
- 目前部署到 GitHub Pages，但未來可能改部署到其他免費靜態 host 並使用獨立 domain；路由、base path 與資源路徑不得綁死在 GitHub Pages 專案路徑。
- 目前只有前導劇情與主頁，但未來主頁將承載四個以上獨立頁面入口；route registry、view 結構與主頁入口設計應支援逐步擴充。
- 後端使用 Firebase；主要僅使用 Firestore 儲存使用者確定要分享的測驗結果。
- 不需要登入系統，整體設計應在匿名情境下運行。
- UI 要自己刻，不使用現成 Vue UI/UX library，避免模板感。
- 網頁應保持輕量，並為圖片與大型資源設計預熱機制，讓使用者流程維持順暢。
- Firestore 上傳需有防護機制；同一使用者或匿名識別來源基準為 60 分鐘內最多 5 次、1 天內最多 10 次。
- 匿名設計仍需保留足夠識別資料，用於後端顯示、偵測與處理疑似惡意使用者。
- 需要 Google Analytics 支援，作為後續研究、產品改進與推廣參考。

在 mission 文件之外，Agent 仍應保護以下預設：

- 將 `AGENTS.md`、`.agents/*`、既有 repository 檔案與使用者最新明確指示視為 source of truth。
- 變更應低噪音、範圍精準、容易回退，且讓後續 Agent 容易理解。
- 優先選擇符合目前 repo 狀態的簡單、可維護做法，不從 sibling project 匯入未確認假設。
- 不把 `emu-rabbit.github.io` 的靜態網站定位、個人檔案語氣、視覺方向或部署假設複製到本 repository。
- 不把 Freezer Space 的產品目標、關係脈絡、Flutter/Firebase Auth 假設、私密空間規則、membership model 或 domain features 複製到本 repository，除非使用者明確要求。
- 若任務揭露可長期沿用的專案目標、限制、非目標或 workflow，需同步到最適合的 `.agents` 文件。

## Scope Of Imported Skills

初始 `.agents` 文件參考同層 `emu-rabbit.github.io` repository，但只移植 project-agnostic 的價值與工作方式：

- `core/`：語言規範、全域行為規範、目標導向設計、決策追溯與文件同步。
- `decisions/`：高訊號、低噪音的決策歷史規則。
- `professional/`：不預設特定 stack 或 product domain 的一般開發與 UI/UX 標準。
- `workflows/add-commit-all.md`：依內容分類變更，再分組 stage 與 commit。

除已確認的 `.agents/skills/professional/technical_architecture.md` 技術方向外，更細的 feature specs、資料 schema、部署方式、正式品牌識別與 production Firebase 設定尚未確認；除非使用者明確提供，Agent 不得自行發明。

## Domain Skill

本專案含有大量 BDSM（愉虐）相關內容。處理題庫、知情同意、limits、safeword、高風險警示、分享語意或敏感文案時，必須讀取：

1. `.agents/skills/domain/bdsm_consent_background.md`

該 skill 文件是本專案的正式領域規範與產品風險邊界，不是臨時備忘，也不是實踐教學。後續 Agent 應直接依該 skill 內容執行，不需要再從決策歷史推導其正式性。若需要新增具體法律、醫療或高風險項目判斷，Agent 應另外查證可靠來源並保守撰寫。

## Core Questionnaire System

建立或修改題庫、問題庫 importer、分類層題目、細項題目、使用者回答 JSON、本地秘密檔案、Firestore 分享版本、結果頁資料語意、題庫翻譯或從 Google Sheet 更新題庫時，必須讀取：

1. `.agents/specs/question_bank_and_secret_file_system.md`

當使用者更新雲端硬碟中的 `BDSM boundary test items` 試算表並要求同步題庫時，必須依照：

1. `.agents/workflows/update-question-bank-from-google-sheet.md`

題庫繁體中文原文以 Google Sheet 為 source of truth；除了標點符號、明確錯字或使用者明確要求外，不得擅自改寫。雲端分享資料只能新建與讀取；本地檔案可建立、讀取、更新與刪除。

## Visual Character Skill

主角兔子的核心人物設定檔已歸檔於：

1. `.agents/assets/characters/main_rabbit_role.png`

生成、修改、評估或撰寫主角兔子相關圖片 prompt / brief 時，必須讀取：

1. `.agents/skills/visual/main_rabbit_image_generation.md`

該 skill 文件是主角兔子生圖、延伸姿勢、表情、UI mascot asset 與宣傳素材的正式視覺規範。後續 Agent 不得只依「可愛兔子」等泛稱自由發揮；必須以核心人物設定檔作為同一角色的最高優先級 reference。

## Language

使用者可見溝通與專案文件預設使用繁體中文；code identifiers、技術詞彙、commands、API names 與既定 project names 可保留英文。

## File Encoding

所有 `.agents`、Markdown、skill 與 workflow files 都應以 UTF-8 without BOM 儲存。Windows PowerShell 讀取中文 Markdown 時使用：

```powershell
Get-Content -Encoding UTF8 <path>
```

若輸出看起來是亂碼，先不要依賴該內容；用明確 UTF-8 encoding 重新讀取後再做決策。

## Windows Node/npm on this machine

這台機器使用 `nvm-windows`，但未來 Codex agents 不應在一般 workspace sandbox 中浪費時間嘗試透過 active nvm symlink 執行 npm。

2026-06-24 已驗證的目前狀態：

- `nvm-windows` 位於 `C:\Users\User\AppData\Local\nvm`。
- active nvm Node symlink 位於 `C:\nvm4w\nodejs`。
- `C:\nvm4w\nodejs` 包含 `node.exe`、`npm.cmd` 與 `npx.cmd`。
- Codex workspace-write sandbox 仍可能阻擋直接讀取/執行 `C:\nvm4w\nodejs`，所以不要把該處失敗視為 Node.js 或 npm 不存在的證據。
- Codex app 在 PATH 上提供可用 runtime：`C:\Users\User\AppData\Local\OpenAI\Codex\bin`。
- 目前已驗證的 Codex runtime：
  - `node --version`: `v24.14.0`
  - `npm --version`: `10.9.3`
  - `npx --version`: `10.9.3`
  - `npm config get cache`: `C:\tmp\codex-npm-cache`

目前 npm/npx workaround：

- `C:\Users\User\AppData\Local\OpenAI\Codex\bin\npm.cmd` 與 `npx.cmd` 存在。
- shims 會呼叫 Codex bundled `node.exe` 並執行：
  - `C:\tmp\codex-node\node_modules\npm\bin\npm-cli.js`
  - `C:\tmp\codex-node\node_modules\npm\bin\npx-cli.js`
- shims 必須設定 `npm_config_cache=C:\tmp\codex-npm-cache`。
- 不要把 npm cache 指到 `%CD%\.codex-npm-cache`；這會產生 repo-local tooling noise。

當 npm availability 本身有疑問時，使用以下驗證命令：

```powershell
Get-Command node
Get-Command npm
Get-Command npx
node --version
npm --version
npx --version
npm config get cache
```

不要把 `npm cache verify` 當成一般 sandbox 中的 routine first check。這台機器上它可能在寫入 `C:\tmp\codex-npm-cache\_cacache\_lastverified` 時因 `EPERM` 失敗。若真的需要 cache verification，直接用 Codex `require_escalated` permission 執行 `npm cache verify`，並說明 npm cache 位於 `C:\tmp`。

如果 `Get-Command npm` 失敗，但 `C:\Users\User\AppData\Local\OpenAI\Codex\bin\npm.cmd` 存在，先檢查 shell PATH，不要直接假設 npm 不存在。某些 Codex desktop shell 的 PATH 可能只有 `C:\Users\User\AppData\Local\OpenAI\Codex\bin\<session-id>`，沒有 parent `bin` directory。這種 shell 要先把 parent bin directory prepend 到 PATH：

```powershell
$pathValue = $env:Path
if (Test-Path Env:PATH) { Remove-Item Env:PATH }
$env:Path = "C:\Users\User\AppData\Local\OpenAI\Codex\bin;$pathValue"
Get-Command npm
npm config get cache
```

PowerShell 也可能在同時存在 `Path` 與 `PATH` environment variables 時失敗，錯誤類似 `An item with the same key has already been added` / `已經加入項目。字典中的索引鍵: 'Path' 加入的索引鍵: 'PATH'`。使用 `Start-Process` 前，先在目前 shell normalize duplicate key：

```powershell
$pathValue = $env:Path
if (Test-Path Env:PATH) { Remove-Item Env:PATH }
$env:Path = $pathValue
Start-Process -FilePath npm -ArgumentList @('run','dev') -WindowStyle Hidden
```

如果 npm shim 再次失效：

1. 檢查 `C:\Users\User\AppData\Local\OpenAI\Codex\bin\npm.cmd` 與 `npx.cmd` 是否仍存在。Codex app updates 可能覆寫這個目錄。
2. 檢查 `C:\tmp\codex-node\node_modules\npm\bin\npm-cli.js` 與 `npx-cli.js` 是否仍存在。`C:\tmp` cleanup 可能移除它們。
3. 若缺少，取得使用者同意後 recreate shim，並從 `C:\nvm4w\nodejs\node_modules\npm` copy npm，因為那些位置在一般 workspace sandbox 外。
4. 保持 shim cache target 為 `C:\tmp\codex-npm-cache`。
5. 避免先花時間在 Codex primary runtime 搜尋 npm；此環境曾暴露 `node.exe`，但 npm/corepack availability 依賴 local shim。

## Vite commands on this machine

在這台機器上，如果任務本來就需要 real build，例如 release/version workflows，Vite production build 不要先在一般 Codex workspace sandbox 中試一次。Managed sandbox 反覆在 Vite/esbuild resolve config 時阻擋存取，錯誤可能類似：

```text
Cannot read directory "../../..": Access is denied.
Could not resolve "...\vite.config.ts"
```

這些情況下，直接用 Codex `require_escalated` permission 執行真正的 build command，並說明 Vite/esbuild 需要 managed sandbox 會阻擋的 access。例如使用 `npm run build:dist` 搭配 `require_escalated`，而不是先無權限執行同一 command 再 retry。

Vite dev servers 不要為了繞過 sandbox writes 去 patch 個別 repo。Vite 可能需要在 `node_modules\.vite-temp` 底下建立或更新檔案。若直接啟動失敗並出現類似 `EPERM: operation not permitted, open ... node_modules\.vite-temp\...`，用 Codex `require_escalated` permission 重新執行 dev-server command，並說明 Vite 需要寫入 `node_modules` temp/dependency cache。

## PowerShell Git syntax notes

在 PowerShell 傳遞 Git stash refs 時，永遠 quote refs，例如 `'stash@{0}'`。未 quote 的 `stash@{0}` 可能被 PowerShell 解析，導致 Git 出現 `unknown switch 'e'` 之類錯誤。例如：

```powershell
git stash drop 'stash@{0}'
git stash show -p 'stash@{0}'
```
