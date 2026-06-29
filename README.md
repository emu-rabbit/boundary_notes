# 兔子的祕密檔案

`bdsm_boundary_test` 是「XX的祕密檔案」的前端專案。產品定位是協助使用者整理 BDSM（愉虐）互動項目的興趣、經驗與界線，並以知情同意為核心支援溝通。

目前第一版落地內容是一個 Vite、Vue、TypeScript、Tailwind 的初始 app、前導劇情，以及可逐步擴充多個功能入口的主頁。

## 開發

```powershell
npm install
npm run dev
```

## 建置

```powershell
npm run build
```

`vite.config.ts` 預設使用 GitHub Pages 專案路徑 `/bdsm_boundary_test/`。本機開發指令 `npm run dev` 會以 `--base=/` 覆蓋，讓開發伺服器維持根路徑；若其他 host、預覽環境或獨立 domain 需要覆蓋路徑，可設定 `VITE_BASE_PATH`。

本機 Codex 環境若執行 Vite build 時遇到 sandbox access 問題，依 `AGENTS.md` 的 Windows/Vite 說明改用 Codex `require_escalated` 權限執行實際 build。

## 部署

本專案目前已設定 GitHub Actions 在推送到 `main` 分支時自動建置並部署到 GitHub Pages。部署 workflow 位於 `.github/workflows/deploy-pages.yml`。

GitHub Pages build 使用 `npm run build:pages`，讓 Vite 依 `vite.config.ts` 使用 `/bdsm_boundary_test/` 作為靜態資源路徑，並複製 `dist/index.html` 為 `dist/404.html` 作為 Pages fallback。

前端頁面切換使用集中 route registry 與 hash route，例如 `/bdsm_boundary_test/#/home`。不要在 Pages 環境用 `history.pushState` 導向 `/home` 這類實體子路徑，因為 GitHub Pages 會把它視為不存在的檔案。

未來若改部署到其他免費靜態 host 或獨立 domain，應優先調整 `VITE_BASE_PATH`、host fallback 或部署 script，不要把 URL 規則硬寫進 view component。

## 第三方資產

- 本專案自託管 `jf open-huninn / jf open 粉圓` 2.1 作為主要中文字體，來源為 justfont 的 open-source font project：https://github.com/justfont/open-huninn-font
- 字體以 SIL Open Font License 1.1 授權；授權文字保存在 `third-party-notices/jf-openhuninn-LICENSE.txt`，摘要記錄在 `NOTICE.md`。

## 產品邊界

- 本專案是教育、自我理解與界線核對工具，不是社交、配對或實踐建議產品。
- 秘密檔案與分享連結只支援溝通，不代表永久、即時或不可撤回的同意。
- 主角兔子是溫柔陪伴角色，不應被呈現為露骨、煽情或鼓勵行為的角色。
