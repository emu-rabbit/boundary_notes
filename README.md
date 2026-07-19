# Boundary Notes／兔子的祕密檔案

Boundary Notes 是協助使用者整理 BDSM 界線、準備知情同意對話與進行界線溝通的四語筆記本。它不做配對、契合度判定或角色分類；秘密檔案只支援溝通，不能取代任何一次當下的確認與同意。

正式站：<https://boundarynotes.com>

## 開發指令

```bash
npm install
npm run dev
npm test
npm run build
```

`npm run build` 會依序執行 typecheck、client build、SSR build 與 SEO prerender。輸出包含：

- `/en`、`/zh-hant`、`/zh-hans`、`/ja` 四語既有前導入口；不新增或插入 SEO 專用畫面。
- 各語系的 About、Terms、Privacy 原始 HTML、canonical、hreflang、Open Graph、Twitter card 與 JSON-LD。
- 私密／功能頁的本地化 `noindex` shell，不會把暱稱、作答、檔案 ID 或分享 query 寫入 social metadata。
- `sitemap.xml` 與 `robots.txt`。

只有正式 production build 應設定 `VITE_PUBLIC_INDEXING=true`。未設定、staging 與 PR preview 都會輸出全站 `noindex`；`robots.txt` 仍允許 crawler 讀取頁面，確保它能實際看見並遵守 `noindex`，且不會刊登 sitemap。

## 入口與語系路由

- 首次使用者進入 `/` 時以英文為無法辨識語系的 fallback，導向 `/en`。
- 語系 URL 永遠優先於 localStorage；切換語系會留在同一功能頁。
- 首次使用者直接進入根入口或任一語系入口時看到既有前導；已完成前導命名的使用者會在畫面顯示前前往該語系 Home。
- 首次進入任一頁面會先顯示敏感內容提醒；使用者確認後會以 localStorage 記錄七天。提醒跟隨目前可辨識的介面語系，URL 與 localStorage 都無法判定時使用繁體中文。
- About 的「重播前導」直接進入 `/{locale}/intro`，不會被回訪導向攔截。
- 雲端秘密檔案分享連結保留建立時語系的 `/{locale}/preview?...` URL。收件者已有 localStorage 語系時沿用既有設定且不靜默覆寫；沒有紀錄時才採用連結語系並保存。只有使用者親自切換語言時，才同步更新介面、URL 與 localStorage。
- 舊的無語系路徑會保留 query/hash 並導向已保存語系；沒有可辨識語系時使用英文。

SEO 分享卡由 `scripts/generate-seo-images.py` 產生，精確重用 `src/assets/story/rabbit-about.webp` 的既有兔子，不重新設計角色。
