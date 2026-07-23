# 決策追溯規範

## 文件角色

本文件只規範何時能把長期取捨寫入 `.agents/decisions/decision_history.md`。一般規則、current state、feature contract 與 workflow 分別由其 canonical 文件管理，不進 decision history。

## 任務開始時

用任務關鍵字搜尋 decision history。只有命中的相關紀錄需要完整閱讀；沒有相關命中時不必把整份歷史當成每次任務的固定上下文。

若使用者最新指示與既有 decision 衝突，指出衝突與影響。可以依使用者明確新方向更新 canonical 文件，但不得自行改寫歷史紀錄。

## Decision 候選守衛

一筆內容只有同時符合下列條件，才是 decision history 候選：

1. 曾有至少兩條被認真考慮的合理路徑。
2. 能清楚回答「為什麼選 A 而不選 B」。
3. mission、spec、skill、workflow、architecture 或 code 只寫現行規則仍不足以避免未來誤改。
4. 缺少取捨理由時，未來 Agent 很可能改回被排除的方向。
5. 影響會長期跨越產品、資料、部署、架構或工作流程。
6. 使用者已明確同意把這筆候選記錄進 decision history。

任何一項不符合，就更新適合的 canonical owner，或只保留在當次任務。

## 不屬於 decision history

- 單次 UI 微調、文案修正或 bug 修復。
- current routes、套件版本、檔案 owner 或部署完成狀態。
- 已能由 mission、spec、skill、workflow 或 architecture 清楚約束的規則。
- 聊天摘要、修訂過程、待辦、未確認想法或方便查閱的文件副本。
- 只有一條可行路徑、說不出被排除替代方案的內容。

## 記錄流程

1. 先更新承載現行真相的 canonical 文件。
2. 說明候選 decision、替代方案、選擇理由與未記錄的風險。
3. 明確詢問使用者是否同意記錄進 decision history。
4. 取得同意後，新增包含日期、狀態、觸發來源、決策、理由、排除方案、影響範圍與後續行動的紀錄。
5. 若新 decision 修訂舊紀錄，新增修訂 decision，並在舊紀錄標示 superseded；不刪除歷史。

未取得使用者同意時，不新增、修訂或補寫 decision history，也不需要在每次一般任務結尾固定聲明這件事。
