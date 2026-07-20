# Firestore Audit

這個工具以唯讀方式檢查 production Firestore 的成功分享紀錄，協助人工觀察總檔案數量、近期上傳量、匿名來源分布、接近既有限流的來源，以及公開檔案與私有 metadata 是否成對。

工具不會讀取 `answers`、`notes` 或 Spotlight，只會投影：

- `sharedSecretFiles.secretFile.profileName`
- `sharedSecretFileMetadata` 的 `appId`、`createdAt`、`payloadBytes`、`sourceHash`、`sourceFingerprintHash` 與 `userAgentHash`

所有 Firestore 操作均為 read。工具使用 Google Cloud Firestore client 與 ADC，不包含 Service Account JSON key，也不使用 Firebase CLI 的登入憑證。

## 第一次準備

需要 Node.js 22 以上版本，並先安裝工具自己的 dependencies：

```powershell
npm --prefix ops/firestore-audit ci
```

使用 ADC impersonation 登入預定的唯讀 Service Account：

```powershell
gcloud auth login
gcloud auth application-default login `
  --impersonate-service-account=firestore-auditor@boundary-notes-prod.iam.gserviceaccount.com
```

Service Account 預期只在 `boundary-notes-prod` 取得 `roles/datastore.viewer`。執行登入的 Google 帳號則需能 impersonate 該 Service Account。

## 執行

從 repository root 執行：

```powershell
npm --prefix ops/firestore-audit run audit -- --project boundary-notes-prod
```

輸出 JSON：

```powershell
npm --prefix ops/firestore-audit run audit -- --project boundary-notes-prod --json
```

預設不輸出原始 `profileName`；報告只以當次執行內的 `profile-N` 標籤呈現跨來源關聯。若確實需要在本機人工核對名稱，可明確開啟：

```powershell
npm --prefix ops/firestore-audit run audit -- `
  --project boundary-notes-prod `
  --include-profile-names
```

請勿把包含原始名稱的 terminal output、截圖或 JSON 報告提交到 Git。

撤銷本機 ADC：

```powershell
gcloud auth application-default revoke
```

## 判讀邊界

- `sourceHash` 是來源 IP 的 HMAC；`sourceFingerprintHash` 是來源 IP 與 User-Agent 的 HMAC。兩者都是 best-effort 匿名訊號，不是帳號、裝置 ID 或真實身份。
- 相同網路下的不同使用者可能共用來源；同一使用者更換網路或瀏覽器也可能產生新來源。
- `profileName` 可重複、修改或使用預設值，不能單獨當成使用者身份。跨來源的相同名稱只列為低可信度人工觀察訊號。
- 報告只能看到成功建立的分享。被 App Check、rate limit、schema validation 或其他錯誤擋下的請求，必須改查 Cloud Logging 與相關 metrics。
- 第一版會全量掃描兩個集合，但只下載必要欄位。Firestore 仍按讀取的 documents 計費；資料量明顯增加後，應再考慮時間索引、分段查詢或專用彙總資料。

目前啟發式旗標：

- 同一 `sourceHash` 最近一小時已有至少 4 次成功建立。
- 同一 `sourceHash` 最近 24 小時已有至少 8 次成功建立。
- 同一來源觀察到至少 3 個 profile names。
- 同一來源觀察到至少 3 個 source fingerprints。
- 公開分享與私有 metadata 未成對。
- metadata 缺少必要匿名欄位、時間或 App ID。

這些旗標只表示需要人工檢視，不代表已確認濫用。
