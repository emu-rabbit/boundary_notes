# bdsm_boundary_test 決策歷史

## 文件目的

本文件記錄 `bdsm_boundary_test` 中會影響未來工作、且後續 Agent 需要理解「為什麼如此決定」的重要決策。

它不是聊天紀錄、待辦清單或修訂流水帳。若規則能直接寫在 `AGENTS.md`、skill、workflow、architecture、mission 或 README 中並清楚約束 Agent，通常不需要額外寫入本文件。

後續 Agent 在規劃或執行任務前，必須依 `.agents/skills/core/decision_traceability.md` 搜尋本文件，確認是否已有相關決策。

## 使用規則

- 新決策放在「決策紀錄」最上方，方便後續 Agent 先看到最新脈絡。
- 每筆決策必須有穩定 ID，格式建議為 `D-YYYY-MM-DD-序號`。
- 若新決策覆蓋舊決策，不要刪除舊紀錄；應新增一筆修訂決策，並在舊紀錄的狀態或備註中標示已被哪一筆決策修訂。
- 若只是任務待辦、一次性修正、一般規則同步、文件調整過程或尚未確認的討論，不應寫入本文件。
- 每筆決策都必須說明保留理由；若說不出後續 Agent 為何需要查閱它，就不應新增。

## 決策紀錄

### D-2026-06-24-001 - 先移植共通 Agent 行為並保留專案使命空位

- **日期**：2026-06-24
- **狀態**：已確認
- **觸發來源**：使用者要求參考同層 `emu-rabbit.github.io` 專案給 Agent 的基本指令，將適合本專案的共通行為與思考方式移植進來；同時說明本專案未來會有自己的使命，這部分先保留。
- **決策內容**：
  - 本 repo 先建立共通 `.agents` 行為規範、語言規範、目標導向設計、決策追溯、文件同步、開發/UI 基準與分類提交工作流。
  - 不建立 `mission/` 或 `architecture/` 專屬文件，避免在使用者尚未定義前替專案發明使命、架構或品牌方向。
  - 不移植 `emu-rabbit.github.io` 的靜態個人網站定位、視覺方向、部署假設、個人品牌語氣或既有決策。
  - 不移植 Freezer Space 的產品目標、關係脈絡、Flutter/Firebase 架構、登入權限或私密空間規則。
- **理由**：此 repo 的第一個可維護資產是 Agent 工作脈絡。先把共通行為與移植邊界寫清楚，可以讓後續 Agent 具備一致工作習慣，同時避免過早把其他專案的使命或架構套進來。
- **影響範圍**：
  - `AGENTS.md`
  - `.agents/skills/core/*`
  - `.agents/skills/professional/*`
  - `.agents/workflows/add-commit-all.md`
  - `.agents/decisions/decision_history.md`
- **後續 Agent 行動**：
  - 新任務開始前先讀取 `AGENTS.md` 與相關 `.agents` 文件。
  - 若任務涉及長期方向，先確認使用者是否要正式建立 mission 或 architecture 文件。
  - 不把 sibling repo 的產品使命或技術選型當成本 repo 的預設。
