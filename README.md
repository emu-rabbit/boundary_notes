# 兔子的祕密檔案

`bdsm_boundary_test` 是「XX的祕密檔案」的前端專案。產品定位是協助使用者整理 BDSM（愉虐）互動項目的興趣、經驗與界線，並以知情同意為核心支援溝通。

目前第一版落地內容是一個 Vite、Vue、TypeScript、Tailwind 的初始 app，以及單頁全螢幕遊戲感的 landing page。

## 開發

```powershell
npm install
npm run dev
```

## 建置

```powershell
npm run build
```

本機 Codex 環境若執行 Vite build 時遇到 sandbox access 問題，依 `AGENTS.md` 的 Windows/Vite 說明改用 Codex `require_escalated` 權限執行實際 build。

## 第三方資產

- 本專案自託管 `jf open-huninn / jf open 粉圓` 2.1 作為主要中文字體，來源為 justfont 的 open-source font project：https://github.com/justfont/open-huninn-font
- 字體以 SIL Open Font License 1.1 授權；授權文字保存在 `third-party-notices/jf-openhuninn-LICENSE.txt`，摘要記錄在 `NOTICE.md`。

## 產品邊界

- 本專案是教育、自我理解與界線核對工具，不是社交、配對或實踐建議產品。
- 秘密檔案與分享連結只支援溝通，不代表永久、即時或不可撤回的同意。
- 主角兔子是溫柔陪伴角色，不應被呈現為露骨、煽情或鼓勵行為的角色。
