# Boundary Notes 題庫／Question bank

可獨立下載使用的四語題庫，提供 JSON、CSV 與 TypeScript。資料不含使用者答案、圖片或網站服務設定。

Standalone question bank in four languages, available as JSON, CSV, and TypeScript. No user answers or artwork are included.

## 授權／License

本題庫依 [MIT License](LICENSE) 授權。使用、修改或再散布時，請保留著作權與授權聲明；單獨複製本資料夾時也請一併保留 `LICENSE`。
MIT applies to the published question bank, including translations. Retain the copyright and license notice when reusing or redistributing it.

**題庫的 MIT 授權不涵蓋品牌、守密兔或分類圖片；資料中的圖片引用也不構成圖像授權。** 完整範圍見 [NOTICE.md](../../NOTICE.md)。

## 下載格式

每個語系目錄提供相同格式：

| 語系 | JSON | 分類 CSV | 細項 CSV | TypeScript |
| --- | --- | --- | --- | --- |
| 繁體中文 | [JSON](zh-Hant/question-bank.json) | [分類](zh-Hant/categories.csv) | [細項](zh-Hant/details.csv) | [TS](zh-Hant/question-bank.ts) |
| 简体中文 | [JSON](zh-Hans/question-bank.json) | [分類](zh-Hans/categories.csv) | [細項](zh-Hans/details.csv) | [TS](zh-Hans/question-bank.ts) |
| English | [JSON](en/question-bank.json) | [Categories](en/categories.csv) | [Details](en/details.csv) | [TS](en/question-bank.ts) |
| 日本語 | [JSON](ja/question-bank.json) | [分類](ja/categories.csv) | [細項](ja/details.csv) | [TS](ja/question-bank.ts) |

JSON 保存完整分類階層；TS 提供相同資料與共用 [型別](types.ts)。複製 TS 時請保留 `types.ts` 及語系子目錄結構。TS 模組沒有 runtime dependencies。

```ts
import { questionBank } from './data/question-bank/zh-Hant/question-bank';

const firstCategory = questionBank.categories[0];
console.log(firstCategory.name, firstCategory.detailItems[0].roles.active.title);
```

非 TypeScript 專案可直接讀取 JSON：

```python
import json

with open('data/question-bank/zh-Hant/question-bank.json', encoding='utf-8') as file:
    bank = json.load(file)
print(bank['categories'][0]['name'])
```

## 欄位與方向

| 欄位 | 說明 |
| --- | --- |
| `exportSchemaVersion` | 本匯出格式的版本，與網站題庫 schema 分開管理 |
| `schemaVersion` / `bankVersion` | 原始題庫 schema 與內容版本 |
| `locale` | 此份資料的語系 |
| `source` | 原始 Google Sheet 來源資訊；`modifiedTime` 是來源時間，不是匯出時間 |
| `categoryId` / `detailId` | 穩定識別碼；不要用題名或列號建立關聯 |
| `categoryOrder` / `detailOrder` | CSV 的 1 起算順序；細項順序在各分類內計算，JSON／TS 依陣列順序 |
| `name` / `sourceSheetName` | 顯示分類名／原始來源分頁名稱 |
| `sourceLabel` | 該語系的細項來源標籤，可能與正式題名不同 |
| `roles.active` / `roles.passive` | 主導側／配合側（Leading／Following），包含各側題名與描述 |
| `warning` | 細項警示；JSON／TS 無警示時為 `null`，CSV 為空欄 |
| `includeInCategoryRound` | 是否參與分類層作答；`false` 不代表排除該分類的細項 |
| `itemCount` | 該分類的細項數，不含方向展開 |

分類 CSV 每個分類一列；細項 CSV 每個細項一列，並排提供 `activeTitle`、`activeDescription`、`passiveTitle`、`passiveDescription`。
四語共享相同 ID 與順序。CSV 使用 UTF-8、逗號分隔及標準雙引號 escaping；Excel 請使用「從文字／CSV」匯入並選 UTF-8。

題庫用於自我理解與界限溝通，不代表任何人當下的同意，也不是實踐指引。再利用時請保留方向與警示的語意。

## 維護與驗證

網站繼續使用 `src/features/question-bank/`；本資料夾是其衍生輸出，不是網站的新資料來源。請勿手動修改產生的檔案。
匯出會套用現有題名修正及翻譯。Google Sheet 並非唯一的內容版本紀錄，應以 repository 已發布題庫為匯出依據。

在已安裝專案 dev dependencies 的 checkout，以 Node.js 22 以上版本於根目錄執行：

```sh
node tools/question-bank/export.mjs
node tools/question-bank/export.mjs --check
node --test tools/question-bank/export.test.mjs
```

第一個命令更新資料，其餘命令驗證同步、格式與型別；不執行網站 build。更新題庫後請重新匯出並一併提交。
工具只讀取題庫資料宣告與翻譯模組，不載入網站的祕密檔案或圖片入口；來源結構不符時會停止。

目前 CI 的部署分類只將特定 runtime 路徑視為部署變更；本資料夾與 `tools/question-bank/` 不在其範圍，Markdown 亦被排除。
修改匯出工具時維持這些路徑，並以實際 workflow 核對；不要為方便而改動 `package.json` 或搬到 `scripts/`。
