# 兔子的祕密檔案

`bdsm_boundary_test` 是「XX的祕密檔案」的前端專案。產品定位是協助使用者整理 BDSM（愉虐）互動項目的興趣、經驗與界線，並以知情同意為核心支援溝通。

穩定品牌名稱為 **Boundary Notes**，正式網域為 `https://boundarynotes.com`。網域已購買；DNS 與 host 綁定仍依部署進度設定。

目前前端以 Vite、Vue、TypeScript、Tailwind 與 Vue Router 建構，包含前導劇情、主頁、正式題庫與作答流程、本地檔案管理、結果編輯與唯讀檢視。核心系統已建立 Pinia session 邊界、Zod runtime schema、localStorage repository 與 Vitest 測試基線；Firestore 雲端分享仍是後續階段。

使用者在前導劇情填入的稱呼會儲存在瀏覽器 `localStorage` 的 `bdsm-boundary-test-profile-name`。根路徑載入時，若已有本機稱呼，會直接進入主頁並套用「{稱呼}的祕密檔案」；若沒有本機稱呼，才播放前導劇情。使用者也可以從「關於這隻兔子」重播前導劇情並重新命名。

核心測驗系統、題庫來源、秘密檔案 JSON、本地保存、雲端分享與 Google Sheet 更新流程的正式規格，位於 `.agents/specs/question_bank_and_secret_file_system.md` 與 `.agents/workflows/update-question-bank-from-google-sheet.md`。

## 開發

```powershell
npm install
npm run dev
```

## 建置

```powershell
npm run build
```

## 測試

```powershell
npm run test
```

目前測試覆蓋秘密檔案的 scope／回答狀態、題庫更新時的回答補齊、runtime schema 的備註安全限制，以及 localStorage 失敗時的 session-memory fallback。Firebase Hosting workflows 會先執行這組測試，再進行建置與部署。

`vite.config.ts` 預設使用根路徑 `/`，符合 Firebase Hosting、自訂網域與本機開發環境。若未來其他 host 需要不同 base path，可設定 `VITE_BASE_PATH`。

本機 Codex 環境若執行 Vite build 時遇到 sandbox access 問題，依 `AGENTS.md` 的 Windows/Vite 說明改用 Codex `require_escalated` 權限執行實際 build。

## 部署

本專案從第一階段就使用兩個完整分離的 Firebase projects，隔離 production 與 staging：

- production：`boundary-notes-prod`
- staging：`boundary-notes-staging`

- push `main`：test/build 成功後部署 production live channel；PR merge 會產生同一個 `main` push，不另外重複部署。
- 開啟或更新同 repository 的 PR：test/build 成功後部署到 staging Firebase project 的七天 preview channel，並更新 PR 裡的預覽連結。
- 外部 fork PR：只執行 test/build，不取得 Firebase 或 Google Cloud 部署身分。
- push `staging`：test/build 成功後部署 staging Firebase project 的 live channel，使用穩定的 Firebase 自產 URL。

目前採分階段啟用：先只驗證 production。Repository variables `ENABLE_FIREBASE_PREVIEW` 與 `ENABLE_FIREBASE_STAGING` 未設定或不等於 `true` 時，PR preview 與 staging jobs 會安全略過，不會嘗試存取尚未建立的 GitHub environments。完成各自的 project、deployer、WIF 與 environment 後，才分別將對應 repository variable 設為 `true`。

Workflows 位於 `.github/workflows/firebase-hosting-production.yml` 與 `.github/workflows/firebase-hosting-staging.yml`。兩者都透過 GitHub OIDC 與 Google Cloud Workload Identity Federation 取得短效 credentials，不使用長效 service-account JSON key。請在 GitHub 建立 `production`、`staging`、`preview` environments，並各自設定以下 environment variables：

- `FIREBASE_PROJECT_ID`
- `GCP_WORKLOAD_IDENTITY_PROVIDER`
- `GCP_SERVICE_ACCOUNT`

`production` environment 填入 production project 的 deployer，並限制只有 `main` 能部署；`staging` environment 填入 staging project 的 live deployer，限制只有 `staging` 能部署；`preview` environment 填入 staging project 的 PR preview deployer，只提供同 repository PR 使用。`staging` 與 `preview` 可以填入相同 staging project ID，但應使用不同 service account/provider，讓 preview 所需權限不會自動擴張到 staging live deployer。Workload Identity provider 本身仍須限制 repository 與 event/ref，不能只依賴 workflow 的 `if`。兩個 Firebase projects 不共用 Firestore、Security Rules、IAM、quota 或帳單邊界。

production live channel 已在 `https://boundary-notes-prod.web.app` 完成第一次實際部署驗證。下一步將 `boundarynotes.com` 綁定到 production Hosting，並讓 `www.boundarynotes.com` redirect 到 apex domain；完成 DNS 與憑證簽發後，再把 GitHub deployment URL 改成正式網域。

前端使用 Vue Router history route，例如 `/home`。`firebase.json` 會把不存在的實體檔案 rewrite 到 `/index.html`，讓直接開啟與重新整理 route 正常運作；Vue Router catch-all 會顯示四語 404 畫面。這個純靜態做法屬於 soft 404（HTTP 200），未來只有在明確需要真實 HTTP 404 時才引入 prerender 或 server-side handler。

Hosting 設定包含 immutable hashed-asset cache、禁止快取 app shell，以及 CSP、anti-framing、MIME sniffing、referrer 與裝置權限標頭。未來串接 Firestore 或 Analytics 時，必須同步精準更新 CSP，避免網路功能被擋，也不得為省事放寬成任意來源。

本機需要用 Firebase Hosting 規則預覽 production build 時，可執行：

```powershell
npm run build
npx --yes firebase-tools@15.23.0 emulators:start --only hosting
```

目前 Hosting 階段建議兩個 projects 都先維持 Spark plan，以免費額度形成成本硬邊界；若之後因 Firestore、Functions 或用量需要切到 Blaze，必須分別建立 project-scoped budget alerts、用量監控與對應的後端防濫用機制。Budget alert 只會通知，不會自動封頂。

## 第三方資產

- 繁體中文與英文主字體為 `Huninn / jf open 粉圓`，透過 Google Fonts 的 WOFF2 unicode-range 子集載入；本專案不再提交完整 TTF 字型檔。來源為 justfont 的 open-source font project：https://github.com/justfont/open-huninn-font
- 字體以 SIL Open Font License 1.1 授權；授權文字保存在 `third-party-notices/jf-openhuninn-LICENSE.txt`，摘要記錄在 `NOTICE.md`。Google Fonts、Noto Sans SC 與 Noto Sans JP 載入失敗時，頁面仍會退回各平台的系統 CJK 字型。

## 產品邊界

- 本專案是教育、自我理解與界線核對工具，不是社交、配對或實踐建議產品。
- 秘密檔案與分享連結只支援溝通，不代表永久、即時或不可撤回的同意。
- 主角兔子是溫柔陪伴角色，不應被呈現為露骨、煽情或鼓勵行為的角色。
