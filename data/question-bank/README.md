# Boundary Notes 題庫／Question bank

用於自我理解與界限溝通的四語題庫，提供 JSON、CSV 與 TypeScript，可依 [MIT License](LICENSE) 使用、修改及再散布。

A multilingual question bank for self-reflection and communication about boundaries. Available as JSON, CSV, and TypeScript under the [MIT License](LICENSE).

## 選擇格式／Choose a format

- **JSON**：完整分類與細項，適合跨語言程式及資料處理。
- **CSV**：分類與細項各一份，適合試算表工具。以 UTF-8 匯入即可。
- **TypeScript**：具型別的資料模組；將語系目錄與根目錄的 [types.ts](types.ts) 一起複製到專案。

| 語系／Language | JSON | 分類／Categories | 細項／Details | TypeScript |
| --- | --- | --- | --- | --- |
| 繁體中文 | [JSON](zh-Hant/question-bank.json) | [CSV](zh-Hant/categories.csv) | [CSV](zh-Hant/details.csv) | [TS](zh-Hant/question-bank.ts) |
| 简体中文 | [JSON](zh-Hans/question-bank.json) | [CSV](zh-Hans/categories.csv) | [CSV](zh-Hans/details.csv) | [TS](zh-Hans/question-bank.ts) |
| English | [JSON](en/question-bank.json) | [CSV](en/categories.csv) | [CSV](en/details.csv) | [TS](en/question-bank.ts) |
| 日本語 | [JSON](ja/question-bank.json) | [CSV](ja/categories.csv) | [CSV](ja/details.csv) | [TS](ja/question-bank.ts) |

## 使用範例／Usage

TypeScript：

```ts
import { questionBank } from './data/question-bank/zh-Hant/question-bank';

const category = questionBank.categories[0];
const item = category.detailItems[0];
console.log(category.name, item.roles.leading.title, item.warning);
```

Python：

```python
import json

with open('data/question-bank/zh-Hant/question-bank.json', encoding='utf-8') as file:
    bank = json.load(file)
print(bank['categories'][0]['name'])
```

## 資料結構／Data structure

JSON 與 TypeScript 以 `categories` 保存分類，每個分類的 `detailItems` 保存細項。四語共享穩定 ID，可用於關聯翻譯或記錄。

| 欄位 | 用途 |
| --- | --- |
| `categoryId` / `detailId` | 分類／細項的穩定識別碼 |
| `name` / `originalName` | 該語系的分類名／繁體中文原始分類名 |
| `roles.leading` / `roles.following` | 主導側／配合側的題名與描述 |
| `roleLabels` | 該語系的正式方向名稱 |
| `sourceLabel` | 細項的原始標籤 |
| `warning` | 細項警示；JSON／TS 以 `null`、CSV 以空欄表示無警示 |
| `includeInCategoryRound` | 是否列入分類層題組 |
| `itemCount` | 分類的細項數 |
| `bankVersion` | 題庫內容版本 |
| `exportSchemaVersion` | 匯出格式版本，目前為 2 |
| `schemaVersion` | 原始題庫 schema 版本 |
| `source` | 題庫原始碼位置 |

方向名稱為「主導側／配合側」、「主导侧／配合侧」、「Leading／Following」、「リード側／フォロー側」。程式欄位統一使用 `leading`／`following`。

CSV 每個分類或細項一列，兩側題名與描述並排保存。`categoryOrder` 與 `detailOrder` 從 1 起算；細項順序在各分類內計算。JSON／TS 依陣列順序排列。

## 授權／License

使用或再散布時，請一併保留 [LICENSE](LICENSE) 中的著作權與 MIT 授權聲明。品牌及圖像的使用許可請見 [NOTICE.md](../../NOTICE.md)。

Retain the copyright and MIT license notice when reusing or redistributing the question bank. See [NOTICE.md](../../NOTICE.md) for branding and artwork permissions.

## 更新資料／Regenerate

於已安裝專案 dev dependencies 的 checkout，以 Node.js 22 以上版本執行：

```sh
node tools/question-bank/export.mjs
node tools/question-bank/export.mjs --check
node --test tools/question-bank/export.test.mjs
```
