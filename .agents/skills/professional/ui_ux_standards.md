# UI/UX 與視覺原則

## 文件角色

本文件保存跨功能的 UI、文案、responsive、可及性與視覺原則。既有頁面和功能的具體構圖、數量與互動契約由 `.agents/specs/product_experience.md` 管理；主角兔子由 `.agents/skills/visual/main_rabbit_image_generation.md` 管理。

## 產品體驗 Invariants

- 介面服務自我理解、界限核對與知情同意，不暗示配對、交友、邀約、競賽、他人評分或角色分類。
- 秘密檔案與分享流程必須清楚表達它是溝通起點，不是同意書、契約、永久承諾或即時同意。
- 使用者可見內容不以教育者或教育服務自居，也不使用露骨、挑逗、獵奇、羞辱、道德評判或鼓勵嘗試的語氣。
- 警告、錯誤、保存與分享狀態必須如實呈現；不可用安撫性文案隱藏資料已建立、無法撤回、操作失敗或需要下一步的事實。

## 視覺 Default

- 使用暗色、溫和、私密筆記本的整體語彙；避免大面積亮色前景、模板化 dashboard、常見 SaaS landing 或單一紫藍漸層主導。
- 色彩、字體、間距、邊框、陰影、圖案與動效使用一致 tokens 與 owner。
- 裝飾必須服務身份、敘事、掃讀或動線；若只增加噪音就移除。
- UI 由專案自己的 component、layout 與 style system 實作。可使用無樣式 helper，但不讓外部 kit 決定視覺語言。
- 文字對比、行高、閱讀寬度、focus state 與操作目標不可為氣氛犧牲。

## Layout 與 responsive

- 手機與桌面同等優先；不把桌面被動縮小，也不把所有桌面資訊密度壓成手機式單欄。
- `body` 預設承擔頁面級垂直捲動。一般 route 不建立第二層競爭的垂直捲動容器。
- 不用外層 `overflow: hidden`、固定 `100vh/100dvh` 或 page-specific `max-height` 掩蓋 overflow。短高 viewport 必須能自然捲到底。
- 背景、黑幕、ambient overlay 與裝飾偽元素不參與內容高度，且不接收 pointer events。
- 固定格式元素使用 `aspect-ratio`、min/max、grid track 或等價約束，避免載入、hover 或文字長度造成 layout shift。
- 多語系與使用者輸入不以單一最長字串綁架所有畫面。CJK 與 Latin 依實際量測使用各自可讀下限，只為真正超出基準的內容擴充。
- 觸控目標與間距避免誤觸；桌機保留清楚層級與掃讀路徑。

## CSS ownership

- 新增或修改 CSS 前先確認 owner 與 import order，不以提高 specificity、重複 selector 或 animation override 掩蓋責任不清。
- base、state 與 responsive override 放在可預期的層級；共用規則沉澱到 token 或 page-family owner。
- 目前 owner、檔名與 cascade order 是 snapshot，以 `src/main.ts` 與 `.agents/skills/professional/current_system_state.md` 為準。

## 互動與回饋

- hover、transition、scroll、cursor 或 canvas 動效只用來強化理解，並支援 `prefers-reduced-motion`。
- 複製、下載、匯入、儲存等短暫且自包含的結果，優先在觸發控制內切換文字、icon 與狀態色，不插入會推動 layout 的 toast 或新段落。
- 需要閱讀、判斷或下一步的錯誤、rate limit、上傳結果、popup blocked 或資料狀態使用持久資訊面；不得硬套短暫回饋。
- 核心內容和操作在資源慢載入、網路或 API 失敗時提供合理 fallback。
- 使用者可見文案不暴露工程狀態名、檔名、資料 key 或內部分類。

## 多語系與文案

- 繁體中文是使用者原文與產品語氣的 source of truth；除明確錯字、標點或使用者要求外，不為重構、排版或翻譯改寫。
- 正式角色名稱以 `src/app/i18n/terminology.ts` 與 tests 為 runtime owner；翻譯不自行創造變體。
- 簡體中文、日文與英文保留繁中原意與溫度，但依語言習慣重組，避免字面硬翻。
- 非繁中語系優先使用短而自然的句子。翻譯長度影響 layout 時，先調整該語系或 responsive 約束，不修改繁中原文。
- 可變標題、分享圖與 feature-specific 語系契約讀取 `.agents/specs/product_experience.md`。

## 兔子與其他資產

- 守密兔是陪伴、提醒、整理與核對界限的角色，不是性感角色、BDSM 實踐者或測驗分類。
- 生成、修改、評估或撰寫兔子 prompt 前，讀取 visual skill 並實際檢視角色 reference。
- 圖片在不同 viewport 保留主體完整、正確尺寸屬性與穩定占位；資產預熱只服務近期流程。

## 驗證

- Agent 負責 build、資產路徑、DOM/CSS 結構、可及性屬性、圖片尺寸、lazy/fetch priority 與明顯 overflow/CLS 風險。
- 修改 route shell、背景、主要 layout 或 responsive CSS 時，驗證一般桌面、極端短高桌面與手機；檢查多餘拉條、可捲到底、背景連續與雙重捲動。
- 目標為不改畫面的 CSS refactor 時，比對 production CSS、asset URLs、computed metrics 與 browser surface；差異必須可解釋。
- 使用者明確表示自行進行實際視覺驗收時，停止替代性的主觀驗收，改交付 code review、機械測試與 build 證據。
- 使用者提供截圖或實際回饋後，以該 surface evidence 修正。

## 設計流程

1. 讀取 mission、此文件與相關 feature contract。
2. 確認使用者目標、資訊層級、主要操作、錯誤與 fallback。
3. 沿用既有 tokens、components、CSS owner 與語言 source。
4. 同時規劃 mobile 與 desktop 的內容順序。
5. 依風險驗證文字、圖片、focus、hover、reduced motion、overflow 與 CLS。
