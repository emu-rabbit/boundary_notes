# 文件庫治理規範

## 文件角色

本文件規範 Agent 如何新增、更新、拆分、移動與移除 Boundary Notes 的持久文件。目標是維持清楚的資訊架構與單一真相來源，不是要求每次任務都增加文件。

## 觸發條件

只有下列情況需要讀取並執行本規範：

- 任務明確要求建立、整理或更新文件。
- 程式、產品行為、資料、架構或 workflow 的持久契約已改變。
- 使用者確認新的長期目標、限制、非目標或取捨。
- 現有文件與實際 code/config、其他 canonical 文件或使用者最新指示衝突。

純問答、診斷、review、臨時探索或未改變持久契約的修正，不需要為了程序更新文件，也不必固定回報「無需更新」。

## 核心原則

### 單一 canonical owner

每一項持久真相只能有一個 canonical owner。其他文件可以：

- 說明何時應讀取該 owner。
- 提供一行摘要協助路由。
- 使用相對路徑連結。

其他文件不得複製完整規則、數值、步驟或長篇摘要。若同一真相已出現多份競爭版本，更新時必須選定 owner、保留完整版本，並將其他版本改為路由或移除。

### 文件分類與責任

| 類型 | Canonical responsibility | 不應承載 |
| --- | --- | --- |
| `AGENTS.md` | 入口、優先級、任務路由、安全摘要、驗證入口 | mission、feature、architecture 的完整副本 |
| `mission/` | 產品目的、使用者價值、非目標、長期語氣 | route、CSS selector、runtime implementation |
| `skills/core/` | Agent 的共通操作與文件治理 | 產品或 feature 規格 |
| `skills/professional/` | 跨功能的開發、UI、architecture 原則 | 單一頁面的完整 layout |
| `skills/domain/` | 無法只靠通用工程知識補完的領域判斷 | runtime schema 或部署步驟 |
| `specs/` | 功能行為、資料契約、相容性與 feature UX | Agent 共通工作方式 |
| `workflows/` | 有觸發條件、輸入、步驟、驗證與輸出的操作流程 | 產品使命或歷史取捨 |
| `decisions/` | 合理替代方案之間的長期取捨理由 | 一般規則、現況清單、聊天紀錄 |
| `subagents/` | 委派條件、必要來源、輸入輸出與 handoff contract | 已由 skill/spec 擁有的完整專業知識 |

本機 PATH、sandbox、npm shim、GUI 或平台 workaround 屬於 user/machine-level guidance，不應複製到 repository 文件。

### 規則層級

文件新增或修改規則時，應能判斷其層級：

- **Invariant**：沒有明確授權不得偏離的安全、production、隱私、資料或產品底線。
- **Decision**：曾在合理方案中選擇其一的長期取捨；理由由 decision history 保存。
- **Default**：目前偏好的設計或實作方向；有更好證據時可提出替代。
- **Snapshot**：會隨 code、config、版本或環境改變的現況；必須附驗證來源，必要時加 `last_verified`。

不得把 snapshot 用永久命令語氣複製到多份文件，也不得把一次 UI 修正自動升格為跨功能 invariant。

## 更新決策流程

更新文件前依序回答：

1. 這是持久真相，還是只屬於本次任務？
2. 能否由 code、schema、test、type system 或 config 直接保護？若可以，文件只保留目的與 owner。
3. 它屬於 invariant、decision、default 還是 snapshot？
4. 現有 canonical owner 是哪一份文件？
5. 寫入後是否會與其他文件重複、矛盾或跨越責任？
6. 哪些直接引用或摘要需要同步調整？

找不到 owner 時，先檢查是否應擴充現有文件分類。只有通過「新文件守衛」後才建立新檔。

## 更新操作

### 一般局部更新

1. 修改 canonical owner。
2. 用 `rg` 搜尋關鍵詞、舊名稱、數值、路徑與直接引用。
3. 檢查 owner 的第一層引用文件。
4. 移除競爭版本；需要保留導覽時改為短連結。
5. 檢查 code/config/tests 是否仍是實際 source of truth。
6. 執行文件驗證並回報真正改變的文件。

### 結構性更新

只有使用者明確要求文件治理、milestone audit，或局部修正無法消除責任衝突時，才進行全庫結構調整。結構性更新還必須：

- 先列出舊 owner、新 owner、移動內容與受影響引用。
- 保留有效產品與技術意圖，不因縮短文件而遺失已確認契約。
- 將被移動內容從舊 owner 移除，不保留兩份完整副本。
- 更新 `AGENTS.md` 路由。
- 搜尋失效路徑與孤兒文件。
- 不碰與本次治理無關的程式或使用者工作樹。

### 寫作格式

一條規則優先使用：

```text
規則：一句可執行的要求。
理由：只有不顯而易見或未來容易改回錯誤方向時保留。
Owner：code、config、test 或 canonical 文件。
驗證：能證明規則仍成立的最短方式。
例外：只有已確認且必要時列出。
```

避免在同一 bullet 塞入多個 layout、資料、文案與 fallback 決定。需要獨立查找、驗證或修改的契約應分成小節或表格。

## 新文件守衛

建立新文件前必須同時符合：

1. 有明確且獨立的 responsibility。
2. 內容會被一類可辨識任務重複使用。
3. 放入現有 owner 會破壞其責任邊界。
4. 不是聊天摘要、單次畫面修正、暫時狀態或未確認想法。
5. 已決定由 `AGENTS.md` 或哪一份 owner 路由到它。
6. 名稱能表達內容，不依賴模糊的 `notes`、`misc`、`new` 或日期。

若只是大文件需要改善可讀性，優先依責任拆分；不得為了縮短單檔而建立沒有獨立 owner 的碎片。

## 移除、取代與歷史

- 過期規則應直接修正或移除，不以「舊版如下」長期堆疊在 canonical 文件。
- 需要保留 A/B 取捨理由時使用 `.agents/decisions/decision_history.md`，不把舊規則留在主文件。
- 檔案被取代時，應更新所有引用後刪除；只有外部工具或尚未能同步的 consumer 需要過渡時才保留短 compatibility stub。
- 不得自行新增或改寫 decision history；依 `.agents/skills/core/decision_traceability.md` 取得使用者對該紀錄的明確同意。

## Snapshot metadata

容易漂移的 current-state 文件可在開頭加入：

```yaml
status: snapshot
last_verified: YYYY-MM-DD
verify_against:
  - path/to/code
  - path/to/config
```

日期只能表示最後驗證時間，不代表內容永久有效。修改 snapshot 前仍應重查 `verify_against`。

## 驗證清單

文件更新完成後至少檢查：

- `rg` 找不到被刪除或移動文件的失效引用。
- 同一規則沒有多份完整 owner。
- `AGENTS.md` 能把任務路由到新的 canonical owner。
- Markdown、TOML 與相對路徑可讀。
- UTF-8 without BOM。
- `git diff --check` 無 whitespace error。
- `git diff` 只包含本次文件治理範圍。

若文件描述 current behavior，還要用對應 code、config、tests 或 live surface 驗證；不能只做文件彼此的一致性檢查。
