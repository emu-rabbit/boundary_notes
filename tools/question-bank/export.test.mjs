import assert from 'node:assert/strict';
import { test } from 'node:test';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import { buildFiles, csv, locales } from './export.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const files = buildFiles();

// Independent CSV reader for checking quotes, embedded newlines and empty cells.
function parseCsv(text) {
  const rows = [];
  let row = [], field = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      if (quoted && text[i + 1] === '"') { field += '"'; i++; }
      else quoted = !quoted;
    } else if (!quoted && char === ',') { row.push(field); field = ''; }
    else if (!quoted && char === '\r' && text[i + 1] === '\n') {
      row.push(field); rows.push(row); row = []; field = ''; i++;
    } else field += char;
  }
  assert.equal(quoted, false);
  assert.equal(field, '');
  return rows;
}

test('CSV preserves commas, double quotes, multiline warnings, Unicode and null', () => {
  assert.deepEqual(parseCsv(csv([['兔子,日本語', 'say "yes"', 'one\r\ntwo', null]])),
    [['兔子,日本語', 'say "yes"', 'one\r\ntwo', '']]);
});

test('four-language CSV and standalone TS preserve every exported JSON field', () => {
  let referenceIds;
  for (const locale of locales) {
    const bank = JSON.parse(files.get(`${locale}/question-bank.json`));
    assert.equal(bank.locale, locale);
    const ids = bank.categories.flatMap((category) =>
      [category.categoryId, ...category.detailItems.map((detail) => detail.detailId)]);
    if (referenceIds) assert.deepEqual(ids, referenceIds);
    referenceIds = ids;
    const [categoryHeader, ...categories] = parseCsv(files.get(`${locale}/categories.csv`));
    const [detailHeader, ...details] = parseCsv(files.get(`${locale}/details.csv`));
    const toObject = (header, row) => Object.fromEntries(header.map((key, index) => [key, row[index]]));
    assert.equal(categories.length, bank.categories.length);
    let detailIndex = 0;
    bank.categories.forEach((category, categoryIndex) => {
      const row = toObject(categoryHeader, categories[categoryIndex]);
      assert.equal(row.categoryId, category.categoryId);
      assert.equal(row.categoryOrder, String(categoryIndex + 1));
      assert.equal(row.name, category.name);
      assert.equal(row.sourceSheetName, category.sourceSheetName);
      assert.equal(row.includeInCategoryRound, String(category.includeInCategoryRound));
      assert.equal(row.itemCount, String(category.detailItems.length));
      assert.equal(row.activeDescription, category.roles.active.description);
      assert.equal(row.passiveDescription, category.roles.passive.description);
      category.detailItems.forEach((detail, index) => {
        const row = toObject(detailHeader, details[detailIndex++]);
        assert.equal(row.locale, locale);
        assert.equal(row.bankVersion, bank.bankVersion);
        assert.equal(row.categoryId, category.categoryId);
        assert.equal(row.detailId, detail.detailId);
        assert.equal(row.detailOrder, String(index + 1));
        assert.equal(row.sourceLabel, detail.sourceLabel);
        assert.equal(row.warning, detail.warning ?? '');
        for (const role of ['active', 'passive']) {
          assert.equal(row[`${role}Title`], detail.roles[role].title);
          assert.equal(row[`${role}Description`], detail.roles[role].description);
        }
      });
    });
    assert.equal(details.length, detailIndex);
    const source = files.get(`${locale}/question-bank.ts`);
    const compiled = ts.transpileModule(source, {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    }).outputText;
    const module = { exports: {} };
    vm.runInNewContext('(function(module, exports) {\n' + compiled + '\n})', {})
      (module, module.exports);
    assert.deepEqual(JSON.parse(JSON.stringify(module.exports.questionBank)), bank);
  }
});

test('exports use direction-aware titles and preserve Other category details', () => {
  const bank = JSON.parse(files.get('zh-Hant/question-bank.json'));
  const biting = bank.categories.flatMap((category) => category.detailItems)
    .find((detail) => detail.detailId === 'detail-pain_stimulation-1jrzewy');
  assert.equal(biting.roles.active.title, '輕度咬人');
  assert.equal(biting.roles.passive.title, '輕度被咬');
  const other = bank.categories.find((category) => category.categoryId === 'other');
  assert.equal(other.includeInCategoryRound, false);
  assert.ok(other.detailItems.length > 0);
});

test('standalone TS modules typecheck without website or ambient project types', () => {
  const filenames = ['types.ts', ...locales.map((locale) => `${locale}/question-bank.ts`)]
    .map((file) => path.join(root, 'data/question-bank', file));
  const program = ts.createProgram(filenames, {
    noEmit: true, strict: true, types: [], target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext, moduleResolution: ts.ModuleResolutionKind.Bundler,
  });
  const diagnostics = ts.getPreEmitDiagnostics(program);
  assert.equal(diagnostics.length, 0, ts.formatDiagnosticsWithColorAndContext(diagnostics, {
    getCanonicalFileName: (file) => file, getCurrentDirectory: () => root,
    getNewLine: () => '\n',
  }));
});
