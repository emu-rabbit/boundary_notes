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

建立或修改 UI、layout、CSS、視覺識別、responsive 行為、文案、資產或使用者互動時，還要讀取：

1. `.agents/skills/professional/ui_ux_standards.md`

當使用者要求 `add and commit all`、`commit all`、`全部提交`，或以其他方式要求提交目前所有變更時，讀取：

1. `.agents/workflows/add-commit-all.md`

## Project Direction

本 repository 的長期使命尚未定義。除非使用者明確提供，Agent 不得自行替本專案發明產品使命、受眾、架構、domain model 或品牌語氣。

在專案專屬 mission 文件建立前，Agent 應保護以下預設：

- 將 `AGENTS.md`、`.agents/*`、既有 repository 檔案與使用者最新明確指示視為 source of truth。
- 變更應低噪音、範圍精準、容易回退，且讓後續 Agent 容易理解。
- 優先選擇符合目前 repo 狀態的簡單、可維護做法，不從 sibling project 匯入未確認假設。
- 不把 `emu-rabbit.github.io` 的靜態網站定位、個人檔案語氣、視覺方向或部署假設複製到本 repository。
- 不把 Freezer Space 的產品目標、關係脈絡、Flutter/Firebase 假設、私密空間規則、auth model 或 domain features 複製到本 repository，除非使用者明確要求。
- 若任務揭露可長期沿用的專案目標、限制、非目標或 workflow，需同步到最適合的 `.agents` 文件。若沒有合適文件，建立新的專案 mission 或 architecture 文件前要先詢問使用者。

## Scope Of Imported Skills

初始 `.agents` 文件參考同層 `emu-rabbit.github.io` repository，但只移植 project-agnostic 的價值與工作方式：

- `core/`：語言規範、全域行為規範、目標導向設計、決策追溯與文件同步。
- `decisions/`：高訊號、低噪音的決策歷史規則。
- `professional/`：不預設特定 stack 或 product domain 的一般開發與 UI/UX 標準。
- `workflows/add-commit-all.md`：依內容分類變更，再分組 stage 與 commit。

專案 mission、architecture、product experience、feature domains、visual identity 與 technology choices 都刻意保留給未來工作。

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
