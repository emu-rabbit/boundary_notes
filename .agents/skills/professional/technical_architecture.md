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
- **前端技術棧**：使用 Vite、Vue、TypeScript 與 Tailwind 建構。
- **部署可攜性**：目前部署到 GitHub Pages，但架構不得綁死在 GitHub Pages 或 `/bdsm_boundary_test/` 專案路徑。未來可能改部署到其他免費靜態網頁 host，並使用獨立 domain；base path、routing fallback 與靜態資源路徑都應可透過設定調整。
- **路由可擴充**：目前只有前導劇情與主頁，但主頁未來會承載四個以上獨立頁面入口。前端 routing、view 結構與入口 registry 應支援逐步新增頁面，不應把 mode、route、故事步驟與主頁內容混在單一元件中。
- **自刻 UI**：UI 應以本專案自己的 component、layout、style token 與互動語言實作，不使用現成 Vue UI/UX library，避免模板感與產品語氣偏移。
- **輕量優先**：網頁應保持足夠輕量；新增 dependency、圖片格式、動畫、字體或大型資源前，必須評估 bundle size、載入時機與使用者感知流暢度。
- **資源預熱**：圖片與較大型資源應有明確預熱策略，讓核心流程中的下一步素材能提前準備，但不得一次預載所有資源造成初始載入變慢。

## 部署與路由

- **現況**：GitHub Actions 會建置並部署到 GitHub Pages，GitHub Pages 需要 `404.html` fallback 支援直接重新整理或未知路徑回到 SPA。
- **未來 host**：若改到其他靜態 host 或獨立 domain，應優先透過 `VITE_BASE_PATH`、host fallback 設定或小型 deploy script 調整，不為單一 host 在核心 UI 元件內硬編 URL。
- **hash route 基準**：在沒有明確 host fallback 保證前，維持 hash route 作為可攜、低設定的 routing 基準；若未來 host 支援穩定 SPA fallback，再評估是否轉為 history route。
- **集中 route registry**：新增頁面入口時應優先更新集中 route registry，讓主頁入口、route 解析、placeholder 或正式 view 共用同一份定義。
- **前導劇情不是主頁本體**：前導劇情可以作為初次進入流程，但不應承擔主頁、測驗、檔案、分享與歷史頁的所有狀態。
- **route shell 高度策略**：`body` 應是唯一的頁面級垂直捲動容器；`app-shell` 與各 route section 使用 `min-height` 撐滿 viewport，但不得用 `height: 100vh/100dvh` 或 route-level `overflow: hidden/auto` 把內容裁掉或製造第二層拉條。內容高度足夠時不得出現多餘頁面拉條；內容在極端短高 viewport 超出時，應由文件自然長高並可捲到底。
- **背景層與內容層分離**：route 的背景、黑幕、ambient overlay、裝飾性偽元素應固定在 viewport 層或以不參與文件高度的方式呈現，並設定 `pointer-events: none`。背景層不得因負 inset、blur、scale、mask 或 absolute positioning 撐高文件，也不得在滾動到底部時露出與內容高度不同步的背景/黑幕斷層。
- **CSS ownership**：`src/styles.css` 只保留 Tailwind 入口；專案自訂 CSS 由 `src/main.ts` 在 Tailwind 後依序匯入 `src/styles/foundation.css`、`route-shell.css`、`story-stage.css`、`story-dialogue.css`、`home-page.css`、`secondary-pages.css`、`responsive.css`。此順序是 cascade contract：foundation 放 token/reset，route-shell 放 app shell、route 背景、viewport/overflow 策略，story-* 放前導劇情場景與對話，home/secondary pages 放各頁 base styles，responsive 必須最後匯入以承接 mobile/desktop overrides。
- **CSS 擴充規則**：新增頁面時，先判斷是否屬於既有 page family；小型頁面可放入 `secondary-pages.css`，大型或獨立功能頁應新增命名清楚的 CSS 檔並在 `responsive.css` 之前匯入。除非需要新的語意結構或可及性元素，修正高度、捲動、背景斷層、mobile/desktop layout 時應先檢查 `route-shell.css` 與 `responsive.css` 的共用策略，而不是在單一 view template 內加局部 workaround。不得用提高 specificity、重複 selector 或動畫 override 來掩蓋 ownership 不清；應把規則移到正確 owner 檔案。

## 前端多語系

- **自製輕量 i18n**：目前多語系集中於 `src/app/i18n.ts`，不導入大型 i18n dependency。新增使用者可見文案時，優先放入 typed locale dictionary，再由元件透過 `messages` 或衍生資料使用。
- **支援語系**：目前支援繁體中文、簡體中文、日文與英文；語系代碼為 `zh-Hant`、`zh-Hans`、`ja`、`en`。
- **語系持久化**：使用者選擇語系後寫入 localStorage key `bdsm-boundary-test-locale`；若 localStorage 不可用，當前 session 仍應正常切換。
- **路由與標題語系化**：route registry 只保存穩定 id、hash path 與狀態；label、summary 與「秘密檔案」標題片段由 locale dictionary 產生，不應在元件內硬編多語系文案。

## Firebase 與資料邊界

- **後端服務**：後端使用 Firebase；主要只使用 Firestore 儲存使用者確定要分享的測驗結果。
- **不上傳草稿**：使用者作答中的中間狀態、未確認分享的結果、純本地歷史或尚未完成的檔案，預設不應上傳 Firestore。
- **匿名運作**：不需要登入系統。不得導入 Firebase Auth、Google login、email login、membership gate 或使用者帳號概念，除非使用者之後明確改變方向。
- **分享前明示**：任何 Firestore 寫入都應發生在使用者明確理解並確認要產生分享資料之後。
- **版本不可覆寫**：若使用者更新或編輯已分享檔案，應以新建資料表示新版本，不直接覆寫舊資料；這點需與 `.agents/mission/project_mission.md` 的知情同意實作原則一致。
- **核心測驗資料規格**：題庫、分類層問題、細項問題、回答狀態、本地秘密檔案 JSON、Firestore create/read-only 分享版本與 Google Sheet 匯入流程，正式規格放在 `.agents/specs/question_bank_and_secret_file_system.md`。修改資料模型或題庫 importer 前必須先讀取該文件。
- **本地檔案可完整 CRUD**：使用者作答檔案在 localStorage 中可建立、讀取、更新與刪除；每題作答後必須即時保存，讓使用者關閉網頁後可從舊檔案繼續。
- **雲端分享 create/read only**：Firestore 中的分享版本只能新建與讀取，不可編輯、不可刪除、不可撤回且永不過期；本地修改後重新分享必須建立新版本與新分享 ID。例外只限網站管理員因法律、服務規範、濫用或營運安全理由手動移除或批次處理資料。
- **題庫版本相容**：題庫未來會新增或修訂，回答資料必須保留 `bankVersion`、穩定 question ID、`unanswered` 與 `filteredOut` 狀態，不得用題目順序或中文文案作為唯一資料鍵。
- **嚴格節流需後端能力**：同一匿名來源上傳限制基準仍是 60 分鐘 5 次、1 天 10 次。架構設計時優先嘗試不碰 Cloud Functions 的方案；若 Firestore security rules 無法可靠支撐嚴格計數與防刷，Agent 必須先回報安全取捨並詢問使用者是否導入 Cloud Functions、App Check 或其他 Firebase 防護機制，不得把前端節流描述為完整後端防護。

## 匿名識別與濫用防護

- **匿名但可防護**：雖然不設登入，本專案仍需要足夠的匿名識別資料，讓後端可以顯示、追蹤與偵測疑似惡意使用者或異常上傳行為。
- **最小必要資料**：匿名識別資料應以濫用防護、debug 與營運安全為目的，避免蒐集不必要的敏感個資。若需要儲存 IP、user agent、裝置指紋或衍生識別碼，必須先保守評估隱私風險與必要性。
- **上傳節流**：同一使用者或同一匿名識別來源的 Firestore 上傳限制基準為 60 分鐘內最多 5 次、1 天內最多 10 次。
- **前後端都要防護**：前端可以提供提示、冷卻時間與阻擋 UX，但真正的限制與記錄必須優先由 Firestore 資料結構與 security rules 支撐；不可只靠前端狀態防刷。若 Firestore 本身不足以支撐必要防護，需先向使用者確認是否擴大 Firebase 機制。
- **防護不等於登入**：濫用偵測與上傳限制不得被包裝成登入、帳號、會員或身份驗證流程。

## GA 與研究資料

- **需要 GA 支援**：本專案需要 Google Analytics 支援，作為後續研究、產品改進與推廣參考。
- **事件語意清楚**：GA event 應描述流程狀態與互動結果，例如測驗開始、題組完成、分享確認、分享頁檢閱等；避免記錄露骨題目內容、自由文字備註或可識別個人的敏感內容。
- **資料最小化**：Analytics 不應成為另類使用者資料庫。敏感作答內容、備註、分享連結完整 ID 或可回推個人的資料，不應直接送入 GA。
- **可維護封裝**：GA 應集中在清楚的 service 或 composable 中，讓事件命名、環境開關、測試 fallback 與隱私檢查容易維護。

## UI 與資產效能

- **自刻但不凌亂**：自刻 UI 不代表每個頁面都各寫各的；應建立可重用的基礎 component、style token、spacing、typography、focus state 與 responsive pattern。
- **CSS token 與 pattern 優先**：跨頁共用的色彩、字體、焦點、按鈕、route shell、背景層與 responsive pattern 應優先沉澱到 `src/styles/` 的對應 owner 檔案，不把同一視覺規則複製到多個 view。若需要調整單一視覺元素，先確認該元素的 owner 檔案與 mobile override，不在多處同步改十幾行。
- **避免模板感**：不得直接套用大型 Vue UI kit、dashboard template 或 landing page template。若使用 headless utility 或小型無樣式 helper，必須確認它不主導視覺語言。
- **預熱策略要可見於程式**：圖片、插畫、字體、路由 chunk 或大型資料應透過明確的 preload、prefetch、lazy loading、cache warmup 或 staged loading 策略處理。
- **核心流程優先**：預熱優先服務測驗流程、結果檢閱與分享頁的順暢感；非核心裝飾資源不得搶佔初始載入。
- **可退化**：資源預熱、GA、Firestore 或網路請求失敗時，核心測驗與本地檢閱流程仍應有合理 fallback。
- **viewport 驗證基準**：調整 route shell、背景、主要 layout 或 overflow 後，除了 build/typecheck，應至少用一般桌面、短高桌面、手機三類 viewport 驗證 `scrollHeight`/`clientHeight` 與視覺底部狀態；高度足夠的畫面不可有多餘拉條，短高畫面必須能捲到所有內容，背景與黑幕不可在滾動過程中斷層。

## 後續 Agent 行動

1. 進行技術或資料相關工作前，先檢查本文件是否與現有程式碼、Firebase 設定、README 或其他 architecture 文件一致。
2. 若新增正式資料 schema、Firestore rules、GA event taxonomy、題庫 importer 或 asset preload policy，優先更新本文件、`.agents/specs/question_bank_and_secret_file_system.md` 或未來正式 architecture/privacy 文件。
3. 若未來使用者明確改變技術方向，需優先同步更新本文件、`AGENTS.md` 與 `.agents/skills/professional/development_standards.md`；不得自行新增或修訂 `.agents/decisions/decision_history.md`，除非已依 `.agents/skills/core/decision_traceability.md` 通過守衛並取得使用者明確同意。
