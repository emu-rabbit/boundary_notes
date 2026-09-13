# Boundary Notes 決策歷史

## 文件角色

本文件只保存 Boundary Notes 中需要保留「為什麼選 A 而不選 B」的長期取捨。一般規則、current state、feature contract、workflow 與聊天紀錄不在此重複。

新增、修訂與使用決策歷史的完整規則由 `.agents/skills/core/decision_traceability.md` 管理。

新紀錄放在最上方，使用穩定 ID `D-YYYY-MM-DD-序號`。修訂舊決策時新增 superseding decision 並標示舊紀錄，不刪除歷史。

## 決策紀錄

### D-2026-07-13-02：production 與 staging 使用獨立 Firebase projects

- 日期：2026-07-13
- 狀態：已確認
- 觸發來源：使用者在比較 Firebase 同 project staging／preview channel 與完全拆分 project 的風險後，明確決定第一階段即建立兩個不共用 backend 的 projects，並同意記錄本決策。
- 決策內容：production 使用 `boundary-notes-prod`，staging 使用 `boundary-notes-staging`。`main` 只部署 production live channel；`staging` 與 PR previews 只使用 staging project。兩者分開 Firestore、Security Rules、IAM、quota 與帳單爆炸半徑，不把 staging site 或 preview channel 接回 production backend。
- 選擇理由：Firebase Hosting 的同 project preview channel 主要隔離前端 release 與 URL，不會同時隔離 Firestore、Security Rules、IAM、project quota 與計費風險。對獨立開發者而言，production 被測試資料污染、staging 錯誤規則影響正式資料，或濫用流量集中到同一 project 的風險，高於多維護一個 Firebase project 的設定成本。
- 排除替代方案：不採用同一 Firebase project 內的多 Hosting sites 或 preview channels 同時承載 production 與 staging；雖然設定較少、共用 backend 較方便，但無法提供本專案要求的資料、權限、quota 與費用風險隔離。
- 影響範圍：Firebase Hosting、後續 Firestore 與 Security Rules、Google Cloud IAM／WIF、GitHub environments、quota／budget 監控、部署流程與事故處理。
- 後續 Agent 行動：不得把 staging 或 PR deployer 授權到 `boundary-notes-prod`；兩個 projects 必須使用獨立 service accounts、WIF 條件與監控。可分階段啟用 workflow，但不得為了省略設定而取消 project 隔離。

### D-2026-07-13-01：採用 Boundary Notes 作為穩定品牌層

- 日期：2026-07-13
- 狀態：已確認
- 觸發來源：使用者確認已購買 `boundarynotes.com`，並要求同步正式網域與既有品牌決策。
- 決策內容：產品採用 **Boundary Notes** 作為穩定品牌名稱，正式網域為 `https://boundarynotes.com`，並維持無連字號的網域標籤；`www.boundarynotes.com` redirect 到 apex domain。各語系產品標題與使用者名稱維持動態，例如英文預設為「Bunny's Secret File」、命名後為「{暱稱}'s Secret File」；瀏覽器標題、SEO 標題與社群 metadata 使用「產品標題 | Boundary Notes」格式。
- 選擇理由：品牌層可以在產品標題、語系與使用者暱稱變動時保持穩定；`Boundary Notes` 直接呼應整理界限與溝通的核心目的，又不把 BDSM 關鍵字放進公開網域，能降低敏感資訊暴露與產品被誤解為情色或配對服務的風險。無連字號版本較容易口頭傳遞、輸入與記憶。
- 排除替代方案：不以「Bunny's Secret File」作為主要網域，避免把預設角色與單一語系產品標題固定成品牌；不採用 `boundary-notes` 作為主網域，避免連字號造成輸入與口頭辨識成本；不採用包含 `bdsm`、`consent-score`、`compatibility` 或 `role` 的名稱，避免敏感暴露、評分暗示、配對定位或角色標籤誤解。
- 影響範圍：產品使命與 README 中的品牌及正式 URL、app shell 動態標題、唯讀預覽頁標題、靜態 HTML 初始標題，以及未來 SEO、社群 metadata、favicon 或其他品牌資產。
- 後續 Agent 行動：保留「Boundary Notes」與各語系動態產品標題的分層；新增公開標題時優先使用「產品標題 | Boundary Notes」，不要將 `boundarynotes` 或固定角色名硬編進使用者檔案名稱。
