# bdsm_boundary_test 決策歷史

## 文件目的

本文件只記錄 `bdsm_boundary_test` 中極少數會影響未來工作、且後續 Agent 必須理解「當時有兩條路，為什麼選了其中一條而不選另一條」的重要決策。

它不是聊天紀錄、待辦清單、主文件摘要或修訂流水帳。若規則能直接寫在 `AGENTS.md`、skill、workflow、architecture、mission 或 README 中並清楚約束 Agent，就不應額外寫入本文件。

後續 Agent 在規劃或執行任務前，必須依 `.agents/skills/core/decision_traceability.md` 搜尋本文件，確認是否已有相關決策。

## 使用規則

- Agent 不得自行新增決策歷史；新增前必須先依 `.agents/skills/core/decision_traceability.md` 通過所有守衛。
- 即使內容通過守衛，也必須先詢問使用者；只有使用者明確回答該項目可以被記錄進本文件，才可新增。
- 新決策放在「決策紀錄」最上方，方便後續 Agent 先看到最新脈絡。
- 每筆決策必須有穩定 ID，格式建議為 `D-YYYY-MM-DD-序號`。
- 若新決策覆蓋舊決策，不要刪除舊紀錄；應新增一筆修訂決策，並在舊紀錄的狀態或備註中標示已被哪一筆決策修訂。
- 若只是任務待辦、一次性修正、一般規則同步、文件調整過程、主文件已能承載的方向或尚未確認的討論，不應寫入本文件。
- 每筆決策都必須說明保留理由與被排除的替代方案；若說不出「為什麼選 A 而不選 B」，就不應新增。
- 不得以「第一版確認」、「方便後續查閱」、「避免忘記」或「這件事很重要」作為新增理由；這些內容應優先進入主文件。

## 決策紀錄

### D-2026-07-13-01：採用 Boundary Notes 作為穩定品牌層

- 日期：2026-07-13
- 狀態：已確認（網域已購買，DNS 與 host 綁定待設定）
- 觸發來源：使用者確認已購買 `boundarynotes.com`，並要求同步正式網域與既有品牌決策。
- 決策內容：產品採用 **Boundary Notes** 作為穩定品牌名稱，正式網域為 `https://boundarynotes.com`，並維持無連字號的網域標籤。各語系產品標題與使用者名稱維持動態，例如英文預設為「Bunny's Secret File」、命名後為「{暱稱}'s Secret File」；瀏覽器標題、SEO 標題與社群 metadata 使用「產品標題 | Boundary Notes」格式。
- 選擇理由：品牌層可以在產品標題、語系與使用者暱稱變動時保持穩定；`Boundary Notes` 直接呼應整理界限與溝通的核心目的，又不把 BDSM 關鍵字放進公開網域，能降低敏感資訊暴露與產品被誤解為情色或配對服務的風險。無連字號版本較容易口頭傳遞、輸入與記憶。
- 排除替代方案：不以「Bunny's Secret File」作為主要網域，避免把預設角色與單一語系產品標題固定成品牌；不採用 `boundary-notes` 作為主網域，避免連字號造成輸入與口頭辨識成本；不採用包含 `bdsm`、`consent-score`、`compatibility` 或 `role` 的名稱，避免敏感暴露、評分暗示、配對定位或角色標籤誤解。
- 影響範圍：產品使命與 README 中的品牌及正式 URL、app shell 動態標題、唯讀預覽頁標題、靜態 HTML 初始標題，以及未來 SEO、社群 metadata、favicon 或其他品牌資產。
- 後續 Agent 行動：保留「Boundary Notes」與各語系動態產品標題的分層；新增公開標題時優先使用「產品標題 | Boundary Notes」，不要將 `boundarynotes` 或固定角色名硬編進使用者檔案名稱。
