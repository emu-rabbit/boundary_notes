# 技術架構與資料邊界規範 (Technical Architecture)

## 概述

本技能定義 `bdsm_boundary_test` 已確認的技術棧、後端資料邊界、匿名設計、資源效能策略、濫用防護與 analytics 基準。後續 Agent 在建立或修改架構、資料模型、Firebase、Firestore、GA、效能、資源載入、前端框架或 UI component 策略時，必須讀取本文件。

## 觸發條件

- 建立或修改 Vite、Vue、TypeScript、Tailwind、build、routing、state、asset pipeline 或 frontend architecture。
- 建立或修改 Firebase、Firestore、分享資料、匿名識別、上傳限制、濫用偵測或 security rules。
- 建立或修改 GA、analytics event、研究/推廣用資料紀錄或 consent/privacy 相關行為。
- 建立或修改圖片、大型資源、預載、預熱、lazy loading、快取或使用者感知效能。
- 評估是否導入 UI library、component library、backend service、登入系統或其他大型依賴。

## 核心技術方向

- **純網頁專案**：本專案是純 web app，不預設 native app、Electron、後端 server 或 CMS。
- **前端技術棧**：使用 Vite、Vue、TypeScript、Tailwind 與 Vue Router 建構。
- **部署可攜性**：正式站部署到 Firebase project `boundary-notes-prod` 的 Hosting live channel 並使用 `https://boundarynotes.com`，`www.boundarynotes.com` redirect 到 apex domain；staging 使用另一個 Firebase project `boundary-notes-staging` 的 Hosting live channel 與 Firebase 自產 URL。架構不得綁死在特定 host 或專案子路徑；base path、routing fallback 與靜態資源路徑都應可透過設定調整。
- **路由可擴充**：目前已有四語前導入口、顯式前導劇情、主頁、建立檔案、時光機前導劇情、檔案列表、編輯結果、獨立唯讀檢視、設定、關於、版本歷史、使用條款與隱私權政策等 route。前端 routing、view 結構與入口 registry 應持續支援逐步新增頁面，不應把 mode、route、故事步驟與主頁內容混在單一元件中。
- **自刻 UI**：UI 應以本專案自己的 component、layout、style token 與互動語言實作，不使用現成 Vue UI/UX library，避免模板感與產品語氣偏移。
- **輕量優先**：網頁應保持足夠輕量；新增 dependency、圖片格式、動畫、字體或大型資源前，必須評估 bundle size、載入時機與使用者感知流暢度。
- **資源預熱**：圖片與較大型資源應有明確預熱策略，讓核心流程中的下一步素材能提前準備，但不得一次預載所有資源造成初始載入變慢。

## 部署與路由

- **正式與 staging 完整隔離**：production 使用 `boundary-notes-prod`，staging 使用 `boundary-notes-staging`，分開 Firestore、Security Rules、IAM、quota 與帳單爆炸半徑。`main` push（包含 PR merge 後的 push）只部署 production live channel；`staging` push 部署 staging live channel；同 repository 的 PR 只部署到 staging project 的七天 preview channel，fork PR 只執行 test/build。不得因 Firebase Hosting 支援同 project preview channels 而把 staging backend 併回 production project。
- **分階段啟用部署**：production live channel 已完成第一次實際部署驗證；staging 與 preview 尚未建立完成時，repository variables `ENABLE_FIREBASE_STAGING` 與 `ENABLE_FIREBASE_PREVIEW` 維持未設定或非 `true`，對應 jobs 必須安全略過且不得要求尚未建立的 environments。只有在 staging project、獨立 deployers、WIF 與 GitHub environments 全部完成後，才可分別設為 `true`。
- **短效部署身分**：GitHub Actions 透過 Workload Identity Federation 取得短效 Google Cloud credentials，不保存 service-account JSON key。GitHub 的 `production` environment 使用 production project deployer，`staging` environment 使用 staging live deployer，`preview` environment 使用 staging project 的 PR preview deployer；三者分開 provider/event 條件與最小權限，避免 PR 身分取得 production 或 staging live 部署路徑。第三方 Actions 固定完整 commit SHA。
- **production 刻意不設 required reviewer**：GitHub `production` Environment 目前依使用者確認刻意不設 required reviewer；`main` push 通過 workflow 的 test／build 與既有部署條件後可直接部署。Agent 不得自行補上人工 gate，也不得因沒有人工 gate 就擴張未被要求的 push／deploy 權限。若未來 run 出現與本設定不一致的等待 review 狀態，應停止 progression 並請使用者確認 environment protection 是否已改變，不得自行 approve、reject 或 bypass。
- **依變更範圍拆分部署 target**：production 與 staging workflows 必須先比較該次 push／PR 的 changed files，再獨立決定 Hosting 與 backend jobs。`src/**`、`public/**`、`scripts/**`、前端入口與 Vite／TypeScript／Tailwind／PostCSS 設定、root `package.json`／`package-lock.json` 只觸發 Hosting 測試、建置與部署；`functions/**`、`firestore.rules`、`firestore.indexes.json` 只觸發 Functions／Firestore 測試、建置與部署。`firebase.json` 同時承載兩邊設定，因此修改它時兩個 target 都必須執行。兩邊各自使用獨立 artifact、validation、deploy job 與 concurrency group，不得因其中一邊變更就順帶部署另一邊。
- **純文件與非 runtime 變更不部署**：`.agents/**`、`AGENTS.md`、README／NOTICE 等純 Markdown、`.github/**`、tests、examples 與其他未列入部署 allowlist 的檔案，可以執行輕量 changed-file classification，但不得取得部署 credentials、建立 Hosting artifact、部署 Hosting 或部署 Functions／Firestore。若未來新增會進入 production runtime 的 source/config root，必須同步加入對應 workflow allowlist 與本段規範。
- **Firebase Hosting static-first fallback**：`npm run build` 先為可索引公開 route 產生實體 clean-URL HTML，並為各語系功能 route 產生本地化 `noindex` shell；`firebase.json` 再將其餘不存在的實體檔案 rewrite 到 `/index.html`，讓 history route 可直接開啟與重新整理。根目錄由 client 在畫面顯示前依保存語系與既有 profile 狀態導向語系入口或 Home；`404.html` 為 crawler 提供 noindex fallback，未知 app route 仍由 Vue Router catch-all 顯示 404 view。
- **Vue Router history 與語系 URL 基準**：`src/app/router.ts` 使用 `createWebHistory(import.meta.env.BASE_URL)`；正式、staging 與本機預設 base 都是 `/`，並由 `VITE_BASE_PATH` 保留未來 host 調整能力。正式 route 以 `/en`、`/zh-hant`、`/zh-hans`、`/ja` 作為語系前綴，前導劇情固定為 `/{locale}/intro`。URL 語系優先於 localStorage；舊無語系 path 會保留 query/hash 並導向已保存語系，無法辨識時使用英文。
- **搜尋入口與回訪入口**：`/{locale}` 的可索引原始 HTML 直接渲染既有前導第一幕，不得新增或插入 SEO 專用 landing。首次使用者從 root、語系入口或 Google 結果進站時都開始相同前導；已存在 profile name 的使用者只在初始進入 root 或語系入口時於畫面顯示前前往同語系 Home。顯式開啟 `/{locale}/intro` 不套用回訪攔截，確保 About 的重播前導與既有使用者預期流程可用。
- **build-time SEO prerender**：`npm run build` 在 Vite client build 後建立短暫 SSR bundle，再由 `scripts/prerender-seo.mjs` 輸出四語既有前導入口、About、Terms、Privacy 的完整原始 HTML、canonical、hreflang、Open Graph、Twitter card 與 JSON-LD。production workflow 只有正式 `main` push 設定 `VITE_PUBLIC_INDEXING=true`；staging、PR preview 與未明確設定的 build 全站 `noindex`。
- **索引與分享隱私邊界**：只有四語前導入口 `/{locale}`、About、Terms、Privacy 可索引；顯式 Intro、Home、Create、Files、Preview、Settings、規劃中頁面與 404 一律 `noindex`。雲端秘密檔案分享連結保留 `/{locale}/preview?...` 語系前綴；收件者已有 localStorage 語系時，介面沿用既有設定且不得因開啟不同語系連結而靜默覆寫，沒有紀錄時才採用連結語系並保存。只有使用者親自使用唯讀頁的語言選擇時，才同步更新介面、URL 與 localStorage。秘密檔案 URL 的 Open Graph/Twitter metadata 只能使用通用 Boundary Notes 文案與對應語系 1200×630 品牌卡，不得包含暱稱、作答、檔案 ID 或 query；crawler 無法讀取 localStorage，因此依 URL 語系提供卡片，無法辨識時使用英文。
- **Hosting 防護與快取**：`firebase.json` 對 Vite hashed assets 設定 immutable cache、對 `index.html` 禁止快取，並集中設定 CSP、frame、MIME sniffing、referrer 與敏感裝置權限標頭。未來接入 Firestore、Analytics 或其他外部連線時，必須同步以最小範圍更新 CSP `connect-src`，不得直接放寬成任意來源。
- **集中 route registry**：`src/app/routes.ts` 是 route id、path、狀態與 lazy route component 的單一 registry。新增頁面入口時應先更新這份 registry，讓主頁入口、route 解析、placeholder 或正式 view 共用同一份定義；不得重新在 `App.vue` 建立 route `v-if` switch。
- **route view lazy loading**：正式 route view 由 Vue Router 透過 dynamic import 載入。`App.vue` 只保留 app-shell 層級的稱呼、多語系、標題與 navigation context，再由 `<RouterView>` 渲染頁面；不得把所有 view 改回 eager import。
- **前導劇情不是主頁本體**：前導劇情可以作為初次進入流程，但不應承擔主頁、測驗、檔案、分享與歷史頁的所有狀態。
- **route shell 高度策略**：`body` 應是唯一的頁面級垂直捲動容器；`app-shell` 與各 route section 使用 `min-height` 撐滿 viewport，但不得用 `height: 100vh/100dvh` 或 route-level `overflow: hidden/auto` 把內容裁掉或製造第二層拉條。內容高度足夠時不得出現多餘頁面拉條；內容在極端短高 viewport 超出時，應由文件自然長高並可捲到底。
- **背景層與內容層分離**：route 的背景、黑幕、ambient overlay、裝飾性偽元素應固定在 viewport 層或以不參與文件高度的方式呈現，並設定 `pointer-events: none`。背景層不得因負 inset、blur、scale、mask 或 absolute positioning 撐高文件，也不得在滾動到底部時露出與內容高度不同步的背景/黑幕斷層。
- **CSS ownership**：`src/styles.css` 只保留 Tailwind 入口；專案自訂 CSS 由 `src/main.ts` 在 Tailwind 後依序匯入 `src/styles/foundation.css`、`route-shell.css`、`story-stage.css`、`story-dialogue.css`、`time-machine.css`、`time-machine-dashboard.css`、`home-page.css`、`secondary-pages.css`、`legal-pages.css`、`file-manager.css`、`questionnaire.css`、`secret-file-preview.css`、`analytics-consent.css`、`responsive.css`。此順序是 cascade contract：foundation 放 token/reset，route-shell 放 app shell、route 背景、viewport/overflow 策略，story-* 與 time-machine 放前導劇情場景、對話及時光機專屬狀態，time-machine-dashboard 管理劇情結束後的兩檔差異工作區與完整變動 dialog，home/secondary pages 放一般頁面 base styles，legal-pages 管理獨立法律文件，file-manager 管理本地／雲端檔案切換、列表、匯入與操作 dialog，questionnaire 放建立檔案、重複作答與結果編輯器，secret-file-preview 以結果編輯器為視覺母體管理獨立唯讀總覽、焦點排名、分類詳情與閱覽 dialog，responsive 必須最後匯入以承接跨頁 mobile/desktop overrides。
- **CSS 擴充規則**：新增頁面時，先判斷是否屬於既有 page family；小型頁面可放入 `secondary-pages.css`，大型或獨立功能頁應新增命名清楚的 CSS 檔並在 `responsive.css` 之前匯入。除非需要新的語意結構或可及性元素，修正高度、捲動、背景斷層、mobile/desktop layout 時應先檢查 `route-shell.css` 與 `responsive.css` 的共用策略，而不是在單一 view template 內加局部 workaround。不得用提高 specificity、重複 selector 或動畫 override 來掩蓋 ownership 不清；應把規則移到正確 owner 檔案。

## 前端多語系

- **自製輕量 i18n**：`src/app/i18n.ts` 只保留相容 barrel；runtime、types 與四語 dictionary 分別位於 `src/app/i18n/index.ts`、`types.ts` 與 `locales/*`，不導入大型 i18n dependency。新增一般使用者可見文案時，放入 typed locale dictionary，再由元件透過 `messages` 或衍生資料使用。
- **題庫語系資料分離**：題庫翻譯不得併入 app-shell locale dictionary。正式題庫與 `localizeQuestionBank` 位於 question-bank feature boundary，由建立檔案、編輯結果與唯讀檢視頁依目前語系取得本地化題庫；後續若資料量需要拆成 locale chunk，也必須維持相同邊界。
- **支援語系**：目前支援繁體中文、簡體中文、日文與英文；app 語系代碼為 `zh-Hant`、`zh-Hans`、`ja`、`en`，URL segment 分別為 `zh-hant`、`zh-hans`、`ja`、`en`。來源語系無法辨識時，公開標題、描述、圖片與入口一律使用英文。
- **語系持久化**：使用者選擇語系後寫入 localStorage key `bdsm-boundary-test-locale`；若 localStorage 不可用，當前 session 仍應正常切換。
- **唯讀檢視頁語系入口**：唯讀總覽必須直接提供繁中、簡中、日文與英文切換，並呼叫 app-shell 的 `setLocale`，不得另外建立只在該頁生效或不寫入 localStorage 的語系狀態。分類詳情不重複提供語系入口；使用者返回總覽後切換即可。
- **路由與標題語系化**：route registry 只保存穩定 id、locale-relative path 與狀態；label、summary 與「秘密檔案」標題片段由 locale dictionary 產生。SEO 文案由集中、完整型別化的四語 source 管理，不應散落在元件內。

## Firebase 與資料邊界

- **後端服務**：後端使用 Firebase；主要只使用 Firestore 儲存使用者確定要分享的測驗結果。
- **不上傳草稿**：使用者作答中的中間狀態、未確認分享的結果、純本地歷史或尚未完成的檔案，預設不應上傳 Firestore。
- **匿名運作**：不需要登入系統。不得導入 Firebase Auth、Google login、email login、membership gate 或使用者帳號概念，除非使用者之後明確改變方向。
- **分享前明示**：任何 Firestore 寫入都應發生在使用者明確理解並確認要產生分享資料之後。
- **版本不可覆寫**：若使用者更新或編輯已分享檔案，應以新建資料表示新版本，不直接覆寫舊資料；這點需與 `.agents/mission/project_mission.md` 的知情同意實作原則一致。
- **核心測驗資料規格**：題庫、分類層問題、細項問題、回答狀態、本地秘密檔案 JSON、Firestore create/read-only 分享版本與 Google Sheet 匯入流程，正式規格放在 `.agents/specs/question_bank_and_secret_file_system.md`。修改資料模型或題庫 importer 前必須先讀取該文件。
- **本地檔案可完整 CRUD**：使用者作答檔案在 localStorage 中可建立、讀取、更新與刪除；每題作答後必須即時保存，讓使用者關閉網頁後可從舊檔案繼續。
- **雲端分享 create/read only**：Firestore 中的分享版本只能新建與讀取，不可編輯、不可由一般使用者刪除或撤回且永不過期；本地修改後重新分享必須建立新版本與新分享 ID。唯一例外是網站管理員因法律要求手動移除或批次處理資料。
- **題庫版本相容**：題庫未來會新增或修訂，回答資料必須保留 `bankVersion`、穩定 question ID、`unanswered` 與 `filteredOut` 狀態，不得用題目順序或中文文案作為唯一資料鍵。
- **雲端建立經 callable、讀取走 Firestore Lite SDK**：`createSharedSecretFile` 固定部署在 `asia-east1` 並強制 App Check、limited-use token 與 replay protection；browser 只可透過 Firestore Lite SDK 依完整 `shareId` 單筆 `get` 公開 `sharedSecretFiles/{shareId}`，不為 read-only 分享載入 realtime listener 或 offline persistence。`firestore.rules` 必須拒絕 collection `list`、所有 client writes 與所有私有 metadata／rate-limit collections。Cloud Firestore 本身必須開啟 App Check enforcement；production 已由使用者於 2026-07-14 確認啟用，staging 在未來建立可執行環境時也必須個別啟用。這層防護不等於登入，也不能被描述成百分之百阻擋所有濫用。
- **上傳 server validation**：create function 必須在 server 重新執行 strict schema、scope／spotlight consistency、備註安全、最多 700 答案與 512 KiB payload 檢查。share ID 使用 `sf_` 加 144-bit cryptographic random value；不得提供列舉或查詢全部分享資料的 API。
- **後端原子節流**：同一匿名來源上傳限制為 60 分鐘 5 次、24 小時 10 次；整個 Firebase project 另限制 60 分鐘 300 次、24 小時 2000 次成功建立。來源與全站計數都在同一個 Firestore transaction 內檢查並增加，避免併發超量；全站超量時前端顯示「網站目前請求過多，請稍後再試」。`createSharedSecretFile` 依 Cloud Run functions／Cloud Functions 的 managed request-header contract，取 `X-Forwarded-For` 第一個位址作為正常瀏覽器請求的 best-effort client IP，後續位址視為代理鏈；不得套用一般 External Application Load Balancer 的倒數第二段假設，否則會把不同外部來源合併成同一個 Google proxy。第一個位址不是可信身份或不可偽造的安全邊界：進階呼叫端仍可能預填 header 並輪替來源；App Check、limited-use token 與 replay protection 只會提高此類自製請求的成本，不會使該位址變成可信。5／10 次來源限制因此屬於公平性與濫用摩擦；300／2000 次全站限制、`maxInstances`、payload cap 與 App Check 才共同構成成本邊界。若未來需要不可由呼叫端偽造的強 IP 限流，必須改由受控 External Application Load Balancer／Cloud Armor 覆寫可信 client-IP header，並封鎖繞過該入口直接呼叫 Function。正式請求若帶有無效 forwarded client address 應拒絕，不得退回共用的 runtime socket address；只有未帶 forwarded header 的本機／emulator 情境可使用 socket fallback。IPv6 來源先正規化為 `/64`，避免同網段 privacy address 輕易輪替；原始 IP／user agent 不持久化，只保存依用途分離的 HMAC hash，HMAC key 只存在 Secret Manager，rate-limit document 以 TTL 清理。
- **前端上傳成本緩衝**：browser 以 localStorage 記錄本機最近成功建立的 server timestamps，依相同 60 分鐘 5 次、24 小時 10 次滾動窗口，在取得 limited-use App Check token 與呼叫 callable 前先攔下本機已知會超額的請求；storage 不可用時退化為目前頁面的記憶體狀態。後端限流回應同時提供 `retryAfterSeconds` 與 `retryWindow`，browser 會快取來源／全站冷卻截止時間；24 小時窗口只以向上取整的整小時提示，60 分鐘窗口只以向上取整的 10 分鐘提示，不顯示精確重置時刻。這層可被清除 storage、換裝置或自製 client 繞過，只是 UX 與成本緩衝，不得取代後端 transaction。
- **同頁面重複檔案防護**：成功建立雲端檔案後，結果編輯頁只在目前 component 生命週期的記憶體中保留該檔案的分享內容 key 與既有 share URL。相同 `fileId`、名稱、題庫版本、scope、answers 與 spotlight 再次要求上傳時，不呼叫 Function，也不建立重複的雲端檔案，直接引導至既有雲端檔案；內容實際改變後才允許建立新版本。不得為此建立跨使用者的 server-side 內容查詢或把敏感作答 hash 寫入公開資料。
- **runtime 身分最小權限**：create Function 使用各 Firebase project 內的 `boundary-notes-share-writer@<project-id>.iam.gserviceaccount.com`。Functions source 以 Firebase 內建 `projectID` parameter 在 deploy time 組出完整 email，不使用只含尾端 `@` 的簡寫，避免 Firebase CLI 在綁定 Secret Manager IAM 時把簡寫當成無效 service account。writer 只取得 Firestore get/create/update、上傳 HMAC secret access 與 App Check token verifier；不得讓 Function 沿用具 Editor 權限的 default Compute service account。read 不再使用 Function runtime 或 reader service account，由 Firestore App Check enforcement 與 Security Rules 約束。
- **成本與攻擊面上限**：create 必須保留 `maxInstances`、timeout、request/payload cap 與必要的 disabled Firestore indexes；direct read 不建立 Function invocation，但仍須監看 Firestore read、App Check、reCAPTCHA Enterprise、budget alert、quota 與執行 metrics。Budget alert 不是硬上限。

## 匿名識別與濫用防護

- **匿名但可防護**：雖然不設登入，後端仍以 App Check 與 HMAC 衍生來源識別偵測疑似惡意使用或異常上傳；不得把它呈現為使用者帳號或真實身份。
- **最小必要資料**：公開分享快照與私有防濫用 metadata 分集合保存。原始 IP／user agent 不寫入 Firestore，只保存不可直接還原且依用途分離的 HMAC hash、App ID、payload size 與 server timestamp；不得把私有 metadata 回傳給一般閱覽者。
- **上傳節流**：同一使用者或同一匿名識別來源的 Firestore 上傳限制基準為 60 分鐘內最多 5 次、1 天內最多 10 次；整個 project 同時限制 60 分鐘內最多 300 次、1 天內最多 2000 次成功建立。
- **前後端都要防護**：前端預先節流與同頁面去重只是 UX／成本緩衝；create 的 schema validation、App Check、replay protection 與上傳節流都在 callable function／Firestore transaction 執行，不可信任 localStorage、client clock 或 client summary。direct read 的存取邊界由 Cloud Firestore App Check enforcement 與 Security Rules 執行，client 收到公開快照後仍必須以正式秘密檔案 schema 驗證，拒絕損壞或不相容資料。
- **防護不等於登入**：濫用偵測與上傳限制不得被包裝成登入、帳號、會員或身份驗證流程。

## GA 與研究資料

- **需要 GA 支援**：本專案需要 Google Analytics 支援，作為後續研究、產品改進與推廣參考。
- **事件語意清楚**：GA event 應描述流程狀態與互動結果，例如測驗開始、題組完成、分享確認、分享頁檢閱等；避免記錄露骨題目內容、自由文字備註或可識別個人的敏感內容。
- **資料最小化**：Analytics 不應成為另類使用者資料庫。敏感作答內容、備註、分享連結完整 ID 或可回推個人的資料，不應直接送入 GA。
- **可維護封裝**：GA 應集中在清楚的 service 或 composable 中，讓事件命名、環境開關、測試 fallback 與隱私檢查容易維護。

## UI 與資產效能

- **自刻但不凌亂**：自刻 UI 不代表每個頁面都各寫各的；應建立可重用的基礎 component、style token、spacing、typography、focus state 與 responsive pattern。
- **CSS token 與 pattern 優先**：跨頁共用的色彩、字體、焦點、按鈕、route shell、背景層與 responsive pattern 應優先沉澱到 `src/styles/` 的對應 owner 檔案，不把同一視覺規則複製到多個 view。若需要調整單一視覺元素，先確認該元素的 owner 檔案與 mobile override，不在多處同步改十幾行。
- **字型資源可退化且保留完整字元覆蓋**：`index.html` 在字型 stylesheet 前宣告 Google Fonts 與 fonts.gstatic.com 的 `preconnect`；Google Fonts 以 `display=swap` 提供 `Huninn / jf open 粉圓`、Noto Sans SC 與 Noto Sans JP 的 WOFF2 unicode-range 子集，避免把完整 TTF 打包進應用程式。`src/styles/foundation.css` 只維護 font token 與 locale stack。分享圖會依實際輸出字元抓取並內嵌所需的 Google Fonts WOFF2 分段，因此 Hosting CSP 的 `connect-src` 必須同時允許 `fonts.googleapis.com` 與 `fonts.gstatic.com`；這項連線權限不得擴張到 `script-src`。不得用固定文案清單做 glyph subset，避免使用者輸入未收錄字元時產生不一致 fallback；遠端字型載入失敗時必須保留系統 CJK fallback，不可讓核心流程因字型資源失敗而不可讀。
- **避免模板感**：不得直接套用大型 Vue UI kit、dashboard template 或 landing page template。若使用 headless utility 或小型無樣式 helper，必須確認它不主導視覺語言。
- **預熱策略要可見於程式**：圖片、插畫、字體、路由 chunk 或大型資料應透過明確的 preload、prefetch、lazy loading、cache warmup 或 staged loading 策略處理。
- **核心流程優先**：預熱優先服務測驗流程、結果檢閱與分享頁的順暢感；使用者進入前導劇情或主頁時應開始預熱所有兔子圖片，進入雲端檔案檢視時則應在等待 Firestore 回應前開始預熱所有分類圖片。雲端檔案與該頁分類圖片都載入完成後，才接續預熱前導劇情第一幕的兔子圖片，不在目前頁面素材完成前搶佔下載。這些 route-level 預熱不得阻塞畫面，也不得擴張成在 app 初始載入時無差別下載所有非核心裝飾資源。
- **可退化**：資源預熱、GA、Firestore 或網路請求失敗時，核心測驗與本地檢閱流程仍應有合理 fallback。
- **分享圖片輸出成本**：分享圖片固定輸出為 1200 × 1600 PNG，不使用 2× rasterization；排版品質應由實際字型量測、文字區塊約束與高品質 canvas smoothing 維持，不得以放大到 2400 × 3200 增加低速網路、行動裝置記憶體與生成時間負擔。
- **viewport 驗證基準**：調整 route shell、背景、主要 layout 或 overflow 後，除了 build/typecheck，應至少用一般桌面、短高桌面、手機三類 viewport 驗證 `scrollHeight`/`clientHeight` 與視覺底部狀態；高度足夠的畫面不可有多餘拉條，短高畫面必須能捲到所有內容，背景與黑幕不可在滾動過程中斷層。

## 後續 Agent 行動

### 核心系統基礎建設

- **state 邊界**：`src/features/secret-file/domain/` 維持 framework-independent 的 scope、回答狀態、回答更新、進度與題庫新增問題時的補齊規則；`application/useSecretFileStore.ts` 才以 Pinia 管理跨頁 active session、檔案列表與 storage status。`src/main.ts` 已安裝 Pinia，並在啟動時初始化 store；不得把核心規則移入 Vue view 或 store。
- **runtime schema 與 migration boundary**：Zod 為 `src/features/secret-file/validation/secretFileSchema.ts` 的唯一 runtime validation dependency。localStorage 讀回、JSON 匯入與未來的 Firestore 讀寫都必須先經 `parseSecretFile`；未知 `schemaVersion` 必須明確拒絕，未來版本應先新增 migration 再放行。
- **本地保存與 fallback**：`storage/browserSecretFileRepository.ts` 集中管理 `bdsm-boundary-test-secret-files:index` 與 `...:file:{fileId}`。讀寫資料都先驗證；browser storage 不可用或寫入失敗時保留當前 session 的記憶體副本，並透過 store 的 `storageStatus` 暴露狀態。不得自動刪除舊檔案。
- **localStorage 上限**：本機最多保存 20 份秘密檔案，由 `browserSecretFileRepository.ts` 的 `maxLocalSecretFiles` 集中管理；達到上限時阻擋新建，但仍允許更新既有檔案。
- **測試基線**：Vitest 已設定為 `npm run test`，Firestore Security Rules 與 direct reader 使用 `npm run test:rules` 搭配固定版本 Firebase CLI／Firestore Emulator 驗證，`npm run test:all` 會依序執行 frontend、Rules 與 Functions tests；Firebase production、PR preview 與 staging workflows 都會先測試再建置。優先覆蓋回答狀態、scope、進度、題庫補齊、validation、storage failure 與 Firestore get/list/write 邊界；新 migration、persistence 或 domain rules 必須一起新增對應測試。
- **目前功能邊界**：正式題庫、前導建立流程、時光機前導劇情與兩檔差異 dashboard、分類與細項作答、本地 CRUD、加密 JSON 檔案下載／上傳、編輯結果頁、獨立唯讀檢視頁與 Firestore create/read-only sharing 均已接入。下載檔使用前端內建共用 key 的 AES-GCM 版本化 JSON 封套，只增加直接閱讀成本，不構成真正的機密保護；上傳時自動解密後仍須通過正式 schema，並保留舊版未加密 JSON 檔案相容性。舊檔案頁的雲端列表與時光機選擇視窗只讀 localStorage 顯示 metadata，不在選擇階段請求雲端；只有使用者進入雲端唯讀檢視、主動匯入分享 URL／ID，或在時光機確認兩份檔案後，才依 share ID direct read Firestore 公開快照。檔案管理頁另可顯示固定的作者範例檔案；這是前端靜態 metadata，不屬於已連結雲端檔案、不加入時光機選擇，且解除連結只保存本機隱藏偏好。比對差異是由兩份既有 `SecretFile` 與目前本地化題庫衍生的前端純資料，不寫回 JSON、localStorage 或 Firestore。

1. 進行技術或資料相關工作前，先檢查本文件是否與現有程式碼、Firebase 設定、README 或其他 architecture 文件一致。
2. 若新增正式資料 schema、Firestore rules、GA event taxonomy、題庫 importer 或 asset preload policy，優先更新本文件、`.agents/specs/question_bank_and_secret_file_system.md` 或未來正式 architecture/privacy 文件。
3. 若未來使用者明確改變技術方向，需優先同步更新本文件、`AGENTS.md` 與 `.agents/skills/professional/development_standards.md`；不得自行新增或修訂 `.agents/decisions/decision_history.md`，除非已依 `.agents/skills/core/decision_traceability.md` 通過守衛並取得使用者明確同意。
