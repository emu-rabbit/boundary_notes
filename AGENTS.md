# Boundary Notes Agent Guide

## 文件角色

本文件是 Boundary Notes repository 的 Agent 入口與路由表，不重述 mission、architecture、feature spec 或 workflow 的完整內容。每一項持久真相應只有一個 canonical owner；其他文件只連結，不複製規則。

開始任何任務時先讀取：

1. `.agents/skills/core/operating_contract.md`
2. 依任務類型讀取下方路由表中的文件
3. 以任務關鍵字搜尋 `.agents/decisions/decision_history.md`

只有當任務會建立或修改持久文件時，才需要讀取 `.agents/skills/core/documentation_governance.md`。

## 規則優先級

Repository 文件使用四種規則層級：

1. **Invariant**：production、隱私、資料、知情同意與安全邊界；沒有使用者明確授權不得偏離。
2. **Decision**：曾在合理替代方案間做出長期取捨；可提出重審，不得默默推翻。
3. **Default**：目前偏好的設計或實作方式；有更好證據時可提出可逆替代方案。
4. **Snapshot**：版本、route、檔案 ownership、部署狀態或機器環境；使用前必須從現有 code、config 或 live surface 重新驗證。

若文件未標示層級，依其 canonical owner 與語意判斷；不因出現「必須／不得」就把 snapshot 當成永久 invariant。

## Canonical 文件路由

| 任務類型 | 必讀文件 |
| --- | --- |
| 任何程式碼、設定、測試或 code review | `.agents/skills/professional/development_standards.md` |
| 產品方向、公開定位、功能規劃、語氣 | `.agents/mission/project_mission.md` |
| UI、layout、CSS、responsive、文案、互動 | `.agents/skills/professional/ui_ux_standards.md`；涉及既有功能契約時再讀 `.agents/specs/product_experience.md` |
| 架構、Firebase、Firestore、GA、資料或部署 | `.agents/skills/professional/technical_architecture.md`；需要目前實作位置或狀態時再讀 `.agents/skills/professional/current_system_state.md` |
| BDSM、知情同意、limits、safeword、高風險或敏感文案 | `.agents/skills/domain/bdsm_consent_background.md` |
| 題庫、回答 JSON、本地秘密檔案、Firestore 分享資料 | `.agents/specs/question_bank_and_secret_file_system.md` |
| 從 Google Sheet 更新題庫 | `.agents/workflows/update-question-bank-from-google-sheet.md` |
| 主角兔子圖片、prompt、brief 或審圖 | `.agents/skills/visual/main_rabbit_image_generation.md` 與 `.agents/assets/characters/main_rabbit_role.png` |
| 可委派的守密兔繪圖工作 | `.agents/subagents/secret-rabbit-artist.toml` |
| `add and commit all`、`commit all`、`全部提交` | `.agents/workflows/add-commit-all.md` |
| 文件新增、重整、同步或刪除 | `.agents/skills/core/documentation_governance.md` |

## Repository Invariants

- Boundary Notes 是協助自我理解與核對 BDSM 互動項目界限的私密筆記本，不是社交、配對、角色分類、鼓勵實踐或教育服務。
- 秘密檔案與分享連結只支援溝通，不代表永久、即時或不可撤回的同意。
- production 與 staging 使用完整分離的 Firebase projects；不得共用 Firestore、Security Rules、IAM、quota 或帳單邊界。
- 一般程式修改、push 或 workflow 監看不等於 production 部署授權；不得自行新增、移除、放寬或繞過 environment protection。
- GitHub `production` Environment 目前刻意不設 required reviewer。若 live run 出現與此不一致的 approval state，停止 progression 並請使用者確認，不得自行 approve、reject 或 bypass。
- 題庫繁體中文原文以 Google Sheet `BDSM boundary test items` 為 source of truth；除明確錯字、標點或使用者要求外不得改寫。
- 雲端分享資料只能新建與讀取；本地檔案可建立、讀取、更新與刪除。

完整理由、行為與驗證方式仍以對應 canonical 文件、現有程式碼、設定與測試為準。

## Legacy Naming

| 名稱 | 狀態 |
| --- | --- |
| `Boundary Notes` | 現行穩定品牌 |
| `boundary_notes` | 現行 repository 名稱 |
| `bdsm_boundary_test` / `bdsm-boundary-test` | 歷史開發名稱；package、storage key 或相容性資料中可能刻意保留 |
| `XX的祕密檔案` | 產品命名公式；未命名時顯示「兔子的祕密檔案」，不是 placeholder |

不得為了表面一致而直接改動 package name、localStorage key、資料 schema 或舊檔相容識別；先追蹤實際讀寫路徑與 migration 需求。

## 語言與檔案

- 使用者可見溝通與 repository 文件預設使用繁體中文；code identifiers、commands、API names 與既定 project names 可保留英文。
- `.agents`、Markdown、skill 與 workflow 文件使用 UTF-8 without BOM。
- 搜尋優先使用 `rg`；手動修改優先使用 `apply_patch`。
- Windows/npm/Vite/Codex 的機器特例由 user-level Agent guidance 管理，不在本 repository 重複保存。

## 驗證入口

- 先從 `package.json`、CI workflow 與現有 scripts 確認真實命令。
- 文件重整至少執行：路徑／引用搜尋、`git diff --check`、UTF-8/BOM 檢查與 staged scope 檢查。
- 程式變更依風險執行 typecheck、相關 tests、build、Rules／Functions tests 或 browser verification。
- Sandbox、權限、網路與真正程式錯誤必須分開判斷，不得用修改程式來追逐環境錯誤。
