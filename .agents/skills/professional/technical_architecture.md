# 技術架構與資料邊界

## 文件角色

本文件保存 Boundary Notes 的長期 architecture invariants 與跨功能技術原則。會隨 code、config 或 deployment 改變的實作位置與狀態由 `.agents/skills/professional/current_system_state.md` 管理；題庫與秘密檔案 schema 由 `.agents/specs/question_bank_and_secret_file_system.md` 管理。

## 核心架構

- Boundary Notes 是純 web app，使用 Vite、Vue、TypeScript、Tailwind 與 Vue Router；不預設 native app、Electron、CMS 或長駐自建 server。
- route、base path、靜態資源與 backend config 不綁死在單一 host 子路徑。
- app shell、route view、domain、application、storage、validation 與 IO 維持清楚責任；不得把核心 domain rules 移入單一 Vue view。
- 新 dependency、framework、UI kit、字型或大型資產必須有足以抵銷 bundle、維護與供應鏈成本的理由。
- UI 使用本專案自己的 component、token 與視覺語言；不導入會主導產品外觀的大型 component kit。

## Production 與部署 Invariants

- production 使用 `boundary-notes-prod`，staging 使用 `boundary-notes-staging`；兩者分開 Hosting、Firestore、Security Rules、IAM、quota 與 billing blast radius。
- `main` 只可通往 production live；`staging` 與 PR preview 只可使用 staging project。不得因 Hosting preview channel 可用而共用 production backend。
- GitHub Actions 使用 Workload Identity Federation 與短效 credentials，不保存 service-account JSON key。production、staging live 與 preview 身分維持不同條件與最小權限。
- deployment 依實際 changed files 分開判斷 Hosting 與 backend targets，不因其中一側改變而順帶部署另一側。
- 純文件、tests、examples 與不進入 runtime 的 repository metadata 不得取得 deployment credentials。
- GitHub `production` Environment 目前刻意不設 required reviewer，但這不擴張 Agent 的 push 或 deploy 授權。實際狀態不符時依 `AGENTS.md` 停止。
- 不得在未經使用者明確要求時新增、移除、放寬或繞過 environment protection。

實際 workflow、allowlist、environment 與啟用狀態是 snapshot，使用前必須檢查 `.github/workflows/`、repository settings 與 live run。

## 路由、SEO 與隱私

- route 使用集中 registry 與 lazy view；`App.vue` 不重新承擔大型 route switch。
- 四語公開入口沿用既有前導體驗，不新增 SEO 專用 landing。
- 只有一般公開內容可索引；秘密檔案、個人化功能與內部流程 route 必須 `noindex`。
- 秘密檔案 URL 的 Open Graph／Twitter metadata 使用通用 Boundary Notes 文案與語系品牌卡，不包含暱稱、答案、share ID 或 query。
- Hosting security headers 與 CSP 採最小開放；接入新服務時只增加必要來源，不以 wildcard 取代評估。

精確 routes、prerender 與 current owner 位置由 `.agents/skills/professional/current_system_state.md` 路由到實際 code。

## Firebase 與資料邊界

- 不需要登入系統。不得導入 Firebase Auth、會員、email／Google login 或帳號模型，除非使用者明確改變產品方向。
- 草稿、未確認分享的答案、純本地歷史與未完成檔案預設不上傳。
- Firestore 寫入只發生在使用者理解保存與可見邊界並明確建立分享之後。
- 本地秘密檔案支援 CRUD；雲端分享版本只能 create/read。修改後重新分享建立新版本與新 share ID，不直接覆寫。
- 雲端分享版本長期不可由一般使用者編輯、刪除、撤回且不自動過期；只有網站管理員因法律要求處理資料。
- 分享快照與防濫用 metadata 分開保存。一般 viewer 不得讀取私有 metadata。
- 題庫與秘密檔案使用穩定 IDs、`bankVersion`、回答狀態與 schema migration；不以題目順序或中文文案作為唯一資料鍵。
- direct read 只允許持有完整高熵 share ID 的單筆 get；拒絕 collection list、所有 client writes 與私有 collections。

完整 schema、local/cloud 行為與相容性以 `.agents/specs/question_bank_and_secret_file_system.md` 為準。

## 分享建立與防濫用

- create path 在 server 重新執行 strict schema、scope consistency、備註安全、答案數量與 payload cap，不能信任 client summary。
- App Check、limited-use token、replay protection、server transaction rate limit、`maxInstances` 與 payload cap 共同構成防護；任何單一機制都不得宣稱能完全阻擋濫用。
- 目前產品限制基準為同一匿名來源 60 分鐘 5 次、24 小時 10 次；project 60 分鐘 300 次、24 小時 2000 次成功建立。若調整，必須同步 server tests、client UX 與成本評估。
- client-side rate limit、cooldown cache 與同頁面去重只是 UX／成本緩衝，不取代 server enforcement。
- 匿名來源 signal 是近似防濫用資訊，不是帳號、真實身份、人數或濫用證明。
- 原始 IP 與 user agent 不持久化；只保存最小、依用途分離的 HMAC 衍生 signal 與必要 server metadata。
- Function runtime、人工 audit 與 deployment service accounts 各自使用最小權限；audit 不得讀取答案、備註、Spotlight 或輸出完整匿名 signal。

精確 Functions、Rules、service account、header parsing 與 audit implementation 是 current state，修改前必須讀取 `.agents/skills/professional/current_system_state.md` 並驗證實際 code/config。

## Analytics 與效能

- Analytics 只記錄流程狀態與互動結果，不送出題目內容、自由文字備註、完整分享 ID 或可識別敏感資料。
- Analytics 集中封裝，支援環境開關、consent、測試 fallback 與事件命名維護。
- 預熱服務使用者下一步需要的核心流程，不在 app 啟動時無差別下載所有圖片、字型、route chunks 或裝飾。
- 字型、預熱、Analytics、Firestore 或網路失敗時，本地核心測驗與檢閱仍有合理 fallback。
- 分享圖片、字型與大型資產使用實際量測與裝置成本決定輸出，不以暴力提高 raster resolution 掩蓋 layout 問題。

## 修改架構時

1. 先驗證 current code/config owner，不從本文件推斷實作位置。
2. 判斷變更屬於 invariant、decision、default 或 snapshot。
3. 涉及資料或分享時同步檢查 domain spec、Rules、Functions、client validation 與 tests。
4. 只有長期 invariant 改變時更新本文件；實作位置或完成狀態改寫 `current_system_state.md`。
5. 若形成真正 A/B 長期取捨，依 `.agents/skills/core/decision_traceability.md` 提出候選，取得使用者同意後才記錄。
