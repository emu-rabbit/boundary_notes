# Boundary Notes 目前系統狀態

```yaml
status: snapshot
last_verified: 2026-07-23
verify_against:
  - package.json
  - src/app/routes.ts
  - src/app/router.ts
  - src/main.ts
  - src/features/
  - firebase.json
  - firestore.rules
  - .github/workflows/
```

## 文件角色

本文件記錄容易隨 code、config、部署或環境改變的 current-state 資訊。使用前必須重新檢查 `verify_against`；本文件不是取代 code/config 的永久 invariant。長期架構與資料邊界由 `.agents/skills/professional/technical_architecture.md` 管理。

## 技術棧

- Vite、Vue、TypeScript、Tailwind、Vue Router、Pinia、Zod。
- Firebase Hosting、Cloud Functions for Firebase、Cloud Firestore、App Check、Google Analytics。
- `package.json` 是套件版本與驗證指令的 owner。

## 路由、SEO 與 Hosting

- `src/app/routes.ts` 是 route id、locale-relative path、狀態與 lazy component 的 registry。
- `src/app/router.ts` 使用 `createWebHistory(import.meta.env.BASE_URL)`；正式、staging 與本機預設 base 是 `/`，`VITE_BASE_PATH` 保留可攜性。
- 公開語系前綴為 `/en`、`/zh-hant`、`/zh-hans`、`/ja`；顯式前導為 `/{locale}/intro`。
- 目前包含語系入口、Intro、Home、Create、Time Machine、Files、Preview、Settings、About、Version History、Terms、Privacy 與 404 等 route。精確清單以 `src/app/routes.ts` 為準。
- `npm run build` 建立 client build、短暫 SSR bundle 與 prerendered HTML。`scripts/prerender-seo.mjs`、`src/app/seo.ts` 與 tests 是 SEO 行為 owner。
- 只有四語入口、About、Terms、Privacy 可索引；其他功能 route 與秘密檔案 URL 為 `noindex`。秘密檔案 social metadata 使用通用 Boundary Notes 文案與語系品牌卡，不含暱稱、答案、share ID 或 query。
- `firebase.json` 對 hashed assets 使用 immutable cache、對 HTML 禁止快取，並管理 CSP、frame、MIME、referrer 與 device-permission headers。

## Deployment snapshot

- production project：`boundary-notes-prod`，Hosting live channel，正式網域 `https://boundarynotes.com`，`www` redirect 到 apex。
- staging project：`boundary-notes-staging`，使用自己的 Hosting、Firestore、Rules、IAM、quota 與 billing boundary。
- production live channel 已完成第一次部署驗證。staging／preview 是否啟用必須從 GitHub repository variables、environments 與目前 workflow 查證；不得只依本 snapshot。
- `main` 只通往 production live，`staging` 只通往 staging live；同 repository PR preview 只可使用 staging project，fork PR 只執行 test/build。
- GitHub Actions 使用 Workload Identity Federation 與短效 credentials，不保存 service-account JSON key；第三方 Actions 固定完整 commit SHA。
- `production` Environment 目前刻意不設 required reviewer。若實際 run 出現 approval state，依 `AGENTS.md` 停止並請使用者確認。
- Workflows 依 changed files 分開判斷 Hosting 與 backend targets；實際 allowlist 與 concurrency 以 `.github/workflows/` 為準。純 `.agents/**`、Markdown、tests 或 examples 不應取得 deployment credentials。

## App shell、CSS 與資產 owner

- `App.vue` 保留 app-shell 層級狀態，頁面由 `<RouterView>` 與 lazy route component 渲染。
- `body` 是唯一頁面級垂直捲動容器；route shell 與背景策略由 `src/styles/route-shell.css`、`responsive.css` 與相關 tests/browser evidence 驗證。
- `src/styles.css` 只保留 Tailwind 入口；自訂 CSS 由 `src/main.ts` 依 cascade contract 匯入。
- 目前 CSS owners 包含 `foundation`、`route-shell`、`story-stage`、`story-dialogue`、`time-machine`、`time-machine-dashboard`、`home-page`、`secondary-pages`、`legal-pages`、`file-manager`、`questionnaire`、`secret-file-preview`、`sponsor-dialog`、`content-warning`、`analytics-consent` 與 `responsive`。精確順序以 `src/main.ts` 為準，`responsive.css` 維持最後的跨頁 override 層。
- 新頁面先判斷既有 page family；大型獨立功能才新增 owner 清楚的 CSS 檔。
- 網頁字型與 locale stack 由 `src/styles/foundation.css` 與實際 HTML/font loading code 管理；遠端字型失敗時保留系統 CJK fallback。
- 分享圖固定 1200 × 1600 PNG，不使用 2× rasterization；layout 與 rendering owner 位於 share-image feature。

## 多語系

- `src/app/i18n.ts` 是 compatibility barrel；runtime、types 與 locale dictionaries 位於 `src/app/i18n/`。
- app locale codes：`zh-Hant`、`zh-Hans`、`ja`、`en`；URL segments：`zh-hant`、`zh-hans`、`ja`、`en`。
- 無法辨識來源語系時，公開標題、描述、圖片與入口使用英文 fallback。
- runtime locale localStorage key 目前是 `bdsm-boundary-test-locale`，屬於 legacy compatibility identifier。
- 題庫 locale data 位於 question-bank feature，不併入 app-shell dictionary。
- 正式角色名稱以 `src/app/i18n/terminology.ts` 與 tests 為 runtime owner。

## Secret File runtime

- `src/features/secret-file/domain/` 維持 framework-independent 的 scope、回答狀態、進度與題庫相容規則。
- `application/useSecretFileStore.ts` 使用 Pinia 管理 active session、檔案列表與 storage status。
- `validation/secretFileSchema.ts` 使用 Zod；localStorage、匯入與 Firestore read 都必須經正式 parser。未知 `schemaVersion` 明確拒絕，未來版本先新增 migration。
- `storage/browserSecretFileRepository.ts` 管理 legacy localStorage keys、最多 20 份本地檔案與 memory fallback。精確 key 與上限以 code/tests 為準，不得直接改名。
- 本地檔案支援 CRUD；雲端分享版本 create/read only。
- 下載檔目前使用前端共用 key 的 AES-GCM 版本化 JSON 封套，只提高直接閱讀成本，不構成真正機密保護；匯入仍需 schema validation，並保留舊未加密 JSON 相容性。
- 雲端檔案列表與時光機選擇先讀本機 metadata；只有進入雲端 preview、主動連結 share URL/ID，或時光機確認選擇後才 direct read Firestore。
- 作者範例是前端靜態 metadata，不屬於已連結雲端檔案、不進入時光機，解除連結只保存本機隱藏偏好。
- 時光機差異由兩份 `SecretFile` 與目前題庫衍生，不寫回 JSON、localStorage 或 Firestore。

## Cloud sharing 與防濫用 implementation

- `createSharedSecretFile` 部署在 `asia-east1`，使用 App Check limited-use token 與 replay protection；精確 runtime 設定以 Functions source 與 deployment config 為準。
- browser read 使用 Firestore Lite SDK 依完整 `shareId` 單筆 `get` `sharedSecretFiles/{shareId}`；不使用 realtime listener 或 offline persistence。
- `firestore.rules` 拒絕 collection list、client writes、私有 metadata 與 rate-limit collections。
- create function 重新執行 strict schema、scope／spotlight consistency、備註安全、答案數量與 payload cap。精確數值以 Functions code/tests 為準。
- share ID 使用 `sf_` 加 cryptographic random value；不提供列舉或全量查詢 API。
- 上傳節流由 Firestore transaction 原子執行；目前產品基準是來源 60 分鐘 5 次／24 小時 10 次、project 60 分鐘 300 次／24 小時 2000 次。
- 正常 managed request 的 `X-Forwarded-For` 第一個位址目前作為 best-effort client IP；它不是可信身份或不可偽造的安全邊界。不得套用 External Application Load Balancer 的倒數第二段假設。
- 無效 forwarded address 在正式請求中拒絕；只有 emulator／本機且沒有 forwarded header 時可使用 socket fallback。IPv6 先正規化為 `/64`。
- 原始 IP／user agent 不持久化；只保存依用途分離的 HMAC hash、App ID、payload size 與 server timestamp。HMAC key 位於 Secret Manager，rate-limit documents 使用 TTL。
- browser localStorage 節流、server cooldown cache 與同頁面內容去重只是 UX／成本緩衝，不取代後端 transaction、App Check 或 schema validation。
- create Function 使用 project-local share-writer service account；production 人工 audit 使用 `firestore-auditor@boundary-notes-prod.iam.gserviceaccount.com`、ADC impersonation 與 `roles/datastore.viewer`。版本控制工具位於 `ops/firestore-audit/`，不得讀取 answers、notes、Spotlight 或輸出完整匿名 signals。

## Analytics 與預熱

- Analytics integration 集中封裝；events 只描述流程狀態與互動結果，不送出題目內容、備註、完整分享 ID 或可識別敏感資料。
- route-level 預熱以目前流程下一步需要的兔子、分類圖片、route chunk 或字型為主，不在 app 初始載入無差別抓取所有資產。
- Firestore、GA、字型或預熱失敗時，本地核心流程仍需可用。

## 驗證基線

- `npm run test`：frontend Vitest。
- `npm run test:rules`：Firestore Emulator／Rules。
- `npm run test:functions`：Functions tests。
- `npm run test:all`：frontend、Rules、Functions。
- `npm run build`：typecheck、client build、SSR build、SEO prerender。

命令與版本使用前仍須重新檢查 `package.json`。Vite、npm、Git 或 sandbox 的本機 workaround 不在本文件保存。
