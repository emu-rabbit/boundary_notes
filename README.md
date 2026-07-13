# 兔子的祕密檔案

`bdsm_boundary_test` 是「XX的祕密檔案」的前端專案。產品定位是協助使用者整理 BDSM（愉虐）互動項目的興趣、經驗與界線，並以知情同意為核心支援溝通。

穩定品牌名稱為 **Boundary Notes**，正式網域為 `https://boundarynotes.com`。網域已購買；DNS 與 host 綁定仍依部署進度設定。

目前第一版落地內容是一個 Vite、Vue、TypeScript、Tailwind、Vue Router 的初始 app、前導劇情、可逐步擴充多個功能入口的主頁，以及「關於這隻兔子」頁面。核心系統已建立 Pinia session 邊界、Zod runtime schema、localStorage repository 與 Vitest 測試基線；題庫資料、作答頁與雲端分享尚未實作。

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

目前測試覆蓋秘密檔案的 scope／回答狀態、題庫更新時的回答補齊、runtime schema 的備註安全限制，以及 localStorage 失敗時的 session-memory fallback。GitHub Pages workflow 會先執行這組測試，再進行建置。

`vite.config.ts` 預設使用 GitHub Pages 專案路徑 `/bdsm_boundary_test/`。本機開發指令 `npm run dev` 會以 `--base=/` 覆蓋，讓開發伺服器維持根路徑；若其他 host、預覽環境或獨立 domain 需要覆蓋路徑，可設定 `VITE_BASE_PATH`。

本機 Codex 環境若執行 Vite build 時遇到 sandbox access 問題，依 `AGENTS.md` 的 Windows/Vite 說明改用 Codex `require_escalated` 權限執行實際 build。

## 部署

本專案目前已設定 GitHub Actions 在推送到 `main` 分支時自動建置並部署到 GitHub Pages。部署 workflow 位於 `.github/workflows/deploy-pages.yml`。

GitHub Pages build 使用 `npm run build:pages`，讓 Vite 依 `vite.config.ts` 使用 `/bdsm_boundary_test/` 作為靜態資源路徑，並複製 `dist/index.html` 為 `dist/404.html` 作為 Pages fallback。

前端頁面切換使用 `src/app/routes.ts` 的集中 route registry，以及 `src/app/router.ts` 建立的 Vue Router hash history，例如 `/bdsm_boundary_test/#/home`。Route view 會依頁面 lazy-load；不要在 Pages 環境改用實體 `/home` 子路徑，因為 GitHub Pages 會把它視為不存在的檔案。

未來若改部署到其他免費靜態 host 或獨立 domain，應優先調整 `VITE_BASE_PATH`、host fallback 或部署 script，不要把 URL 規則硬寫進 view component。

## 第三方資產

- 繁體中文與英文主字體為 `Huninn / jf open 粉圓`，透過 Google Fonts 的 WOFF2 unicode-range 子集載入；本專案不再提交完整 TTF 字型檔。來源為 justfont 的 open-source font project：https://github.com/justfont/open-huninn-font
- 字體以 SIL Open Font License 1.1 授權；授權文字保存在 `third-party-notices/jf-openhuninn-LICENSE.txt`，摘要記錄在 `NOTICE.md`。Google Fonts、Noto Sans SC 與 Noto Sans JP 載入失敗時，頁面仍會退回各平台的系統 CJK 字型。

## 產品邊界

- 本專案是教育、自我理解與界線核對工具，不是社交、配對或實踐建議產品。
- 秘密檔案與分享連結只支援溝通，不代表永久、即時或不可撤回的同意。
- 主角兔子是溫柔陪伴角色，不應被呈現為露骨、煽情或鼓勵行為的角色。
