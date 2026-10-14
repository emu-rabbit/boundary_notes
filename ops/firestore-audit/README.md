# Firestore Audit

這個工具供已授權維運人員以唯讀方式檢查 Firestore 的成功分享紀錄，協助觀察上傳趨勢、資料完整性與需要人工檢視的異常訊號。

工具只查詢稽核所需的最小欄位，不讀取答案、備註或 Spotlight。這是工具的查詢範圍，不代表執行身分具有欄位層級的存取限制。

所有 Firestore 操作均為 read。工具使用 Google Cloud Firestore client 與 ADC，不包含 Service Account JSON key，也不使用 Firebase CLI 的登入憑證。

## 第一次準備

需要 Node.js 22 以上版本，並先安裝工具自己的 dependencies：

```powershell
npm --prefix ops/firestore-audit ci
```

先向專案管理員取得核准的 project ID、唯讀 Service Account 與必要授權；實際環境設定由私人維運管道提供。以下 PowerShell 範例的佔位符必須替換後才能執行：

```powershell
$auditProjectId = '<AUTHORIZED_PROJECT_ID>'
$auditServiceAccount = '<AUTHORIZED_READ_ONLY_SERVICE_ACCOUNT_EMAIL>'
$env:BOUNDARY_NOTES_AUDIT_PROJECT_ID = $auditProjectId

gcloud auth login
gcloud auth application-default login `
  --impersonate-service-account=$auditServiceAccount
```

Service Account 應只取得核准環境的必要唯讀權限；執行登入的 Google 帳號也必須獲准 impersonate 該身分。工具要求 `--project` 與私人設定的 `BOUNDARY_NOTES_AUDIT_PROJECT_ID` 相符；未設定或不符時會停止。這項檢查用來避免操作錯誤，真正的存取授權仍由 IAM 控制。

## 執行

從 repository root 執行：

```powershell
npm --prefix ops/firestore-audit run audit -- --project $auditProjectId
```

每次 audit 都會將報告自動寫入 `ops/firestore-audit/output/`，檔名使用 UTC
時間戳（例如 `2026-07-24T12_34_56.789Z`）；使用 `--json` 時會寫入 JSON 報告。
此目錄已加入 Git ignore。

輸出 JSON：

```powershell
npm --prefix ops/firestore-audit run audit -- --project $auditProjectId --json
```

預設不輸出原始暱稱；報告只使用當次執行內的代號呈現跨來源關聯。若確實需要在本機人工核對名稱，可明確開啟：

```powershell
npm --prefix ops/firestore-audit run audit -- `
  --project $auditProjectId `
  --include-profile-names
```

請勿把稽核報告、terminal output、資料截圖或本機憑證提交到 Git 或公開分享；代號化報告仍應視為內部維運資料。

撤銷本機 ADC：

```powershell
gcloud auth application-default revoke
```

## 判讀邊界

- 匿名來源訊號只是近似的防濫用資訊，不是帳號、裝置 ID 或真實身份。
- 相同網路下的不同使用者可能共用來源；同一使用者更換網路或瀏覽器也可能產生新來源。
- 暱稱可重複、修改或使用預設值，不能單獨當成使用者身份。跨來源的相同名稱只列為低可信度人工觀察訊號。
- 報告只能看到成功建立的分享。被 App Check、rate limit、schema validation 或其他錯誤擋下的請求，必須改查 Cloud Logging 與相關 metrics。
- 工具會掃描稽核所需的集合，但只下載必要欄位。Firestore 仍按讀取的 documents 計費；資料量明顯增加後，應再考慮時間索引、分段查詢或專用彙總資料。

報告中的啟發式旗標只表示需要人工檢視，不代表已確認濫用；它們也不是服務端的阻擋規則。
