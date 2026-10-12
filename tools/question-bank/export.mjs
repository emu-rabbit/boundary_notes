import assert from 'node:assert/strict';
import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import ts from 'typescript';

const root = fileURLToPath(new URL('../../', import.meta.url));
const sourceRoot = path.join(root, 'src/features/question-bank');
const outputRoot = path.join(root, 'data/question-bank');
export const locales = ['zh-Hant', 'zh-Hans', 'en', 'ja'];
const roleLabels = {
  'zh-Hant': { leading: '主導側', following: '配合側' },
  'zh-Hans': { leading: '主导侧', following: '配合侧' },
  en: { leading: 'Leading', following: 'Following' },
  ja: { leading: 'リード側', following: 'フォロー側' },
};

export function toPublicBank(bank, locale) {
  const publicRoles = (roles) => ({ leading: { ...roles.active }, following: { ...roles.passive } });
  return {
    ...bank,
    source: { kind: 'repository', url: 'https://github.com/emu-rabbit/boundary_notes/tree/main/src/features/question-bank' },
    exportSchemaVersion: 2,
    locale,
    license: 'MIT',
    roleLabels: roleLabels[locale],
    categories: bank.categories.map(({ sourceSheetName, ...category }) => ({
      ...category,
      originalName: sourceSheetName,
      roles: publicRoles(category.roles),
      detailItems: category.detailItems.map((detail) => ({ ...detail, roles: publicRoles(detail.roles) })),
    })),
  };
}

// Read only the data declarations; never load the website's secret-file barrel.
function dataSource(source, filename) {
  const names = new Set(['createDetailItems', 'category', 'categoryDetailItemSource',
    'categoryDetailItems', 'questionBank']);
  const ast = ts.createSourceFile(filename, source, ts.ScriptTarget.Latest, true);
  const selected = ast.statements.filter((statement) => {
    if (ts.isImportDeclaration(statement)) {
      return statement.moduleSpecifier.text === './detailTitles';
    }
    const name = ts.isFunctionDeclaration(statement) ? statement.name?.text
      : ts.isVariableStatement(statement) && statement.declarationList.declarations.length === 1
        ? statement.declarationList.declarations[0].name.getText(ast) : undefined;
    return names.delete(name);
  });
  assert.equal(names.size, 0, `Question bank structure changed: ${[...names].join(', ')}`);
  return selected.map((statement) => statement.getText(ast)).join('\n');
}

function loadSourceModules() {
  const cache = new Map();
  function load(filename) {
    if (!existsSync(filename)) filename = path.join(filename.replace(/\.ts$/, ''), 'index.ts');
    assert.ok(filename.startsWith(sourceRoot + path.sep), `Unexpected dependency: ${filename}`);
    if (cache.has(filename)) return cache.get(filename).exports;
    let source = readFileSync(filename, 'utf8');
    if (filename === path.join(sourceRoot, 'questionBank.ts')) source = dataSource(source, filename);
    const { outputText } = ts.transpileModule(source, {
      fileName: filename,
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    });
    const module = { exports: {} };
    cache.set(filename, module);
    const requireSource = (specifier) => {
      assert.ok(specifier.startsWith('.'), `Unexpected dependency: ${specifier}`);
      return load(path.resolve(path.dirname(filename), `${specifier}.ts`));
    };
    vm.runInNewContext('(function(module, exports, require) {\n' + outputText + '\n})', {},
      { filename })(module, module.exports, requireSource);
    return module.exports;
  }
  return { bank: load(path.join(sourceRoot, 'questionBank.ts')).questionBank,
    localize: load(path.join(sourceRoot, 'locales/index.ts')).localizeQuestionBank };
}

export function csv(rows) {
  return rows.map((row) => row.map((value) => {
    const text = value == null ? '' : String(value);
    return /[",\r\n]/.test(text) ? '"' + text.replaceAll('"', '""') + '"' : text;
  }).join(',')).join('\r\n') + '\r\n';
}

function validate(bank, reference) {
  assert.equal(bank.categories.length, reference.categories.length);
  const categoryIds = new Set();
  const detailIds = new Set();
  bank.categories.forEach((category, categoryIndex) => {
    const original = reference.categories[categoryIndex];
    assert.equal(category.categoryId, original.categoryId);
    assert.ok(!categoryIds.has(category.categoryId), `Duplicate category: ${category.categoryId}`);
    categoryIds.add(category.categoryId);
    assert.equal(category.detailItems.length, category.itemCount);
    assert.equal(category.includeInCategoryRound, original.includeInCategoryRound);
    assert.ok(category.name.trim());
    for (const role of ['active', 'passive']) assert.ok(category.roles[role].description.trim());
    category.detailItems.forEach((detail, detailIndex) => {
      assert.equal(detail.detailId, original.detailItems[detailIndex].detailId);
      assert.ok(!detailIds.has(detail.detailId), `Duplicate detail: ${detail.detailId}`);
      detailIds.add(detail.detailId);
      assert.ok(detail.sourceLabel.trim());
      assert.ok(detail.warning === null || typeof detail.warning === 'string');
      for (const role of ['active', 'passive']) {
        assert.ok(detail.roles[role].title.trim());
        assert.ok(detail.roles[role].description.trim());
      }
    });
  });
}

const types = `// Generated by tools/question-bank/export.mjs. MIT; see LICENSE.
export type Locale = 'zh-Hant' | 'zh-Hans' | 'en' | 'ja';
export type Role = 'leading' | 'following';
export interface DetailItem {
  detailId: string;
  sourceLabel: string;
  warning: string | null;
  roles: Record<Role, { title: string; description: string }>;
}
export interface Category {
  categoryId: string;
  name: string;
  originalName: string;
  includeInCategoryRound: boolean;
  itemCount: number;
  roles: Record<Role, { description: string }>;
  detailItems: readonly DetailItem[];
}
export interface QuestionBank {
  exportSchemaVersion: 2;
  schemaVersion: 1;
  bankVersion: string;
  locale: Locale;
  license: 'MIT';
  roleLabels: Record<Role, string>;
  source: { kind: 'repository'; url: string };
  categories: readonly Category[];
}
`;

export function buildFiles() {
  const { bank, localize } = loadSourceModules();
  const files = new Map([['LICENSE', readFileSync(path.join(root, 'LICENSE'), 'utf8').replaceAll('\r\n', '\n')],
    ['types.ts', types]]);
  for (const locale of locales) {
    const localized = localize(bank, locale);
    validate(localized, bank);
    const exported = toPublicBank(localized, locale);
    const json = JSON.stringify(exported, null, 2);
    files.set(`${locale}/question-bank.json`, json + '\n');
    files.set(`${locale}/question-bank.ts`,
      `// Generated by tools/question-bank/export.mjs. MIT; see ../LICENSE.\n` +
      `import type { QuestionBank } from '../types';\n\n` +
      `export const questionBank: QuestionBank = ${json};\n\nexport default questionBank;\n`);
    const common = ['exportSchemaVersion', 'schemaVersion', 'bankVersion', 'locale', 'leadingLabel', 'followingLabel'];
    const metadata = [2, bank.schemaVersion, bank.bankVersion, locale,
      exported.roleLabels.leading, exported.roleLabels.following];
    const categories = [[...common, 'categoryId', 'categoryOrder', 'name', 'originalName',
      'includeInCategoryRound', 'itemCount', 'leadingDescription', 'followingDescription']];
    const details = [[...common, 'categoryId', 'detailId', 'detailOrder', 'sourceLabel',
      'leadingTitle', 'leadingDescription', 'followingTitle', 'followingDescription', 'warning']];
    exported.categories.forEach((category, categoryIndex) => {
      categories.push([...metadata, category.categoryId, categoryIndex + 1, category.name,
        category.originalName, category.includeInCategoryRound, category.itemCount,
        category.roles.leading.description, category.roles.following.description]);
      category.detailItems.forEach((detail, detailIndex) => {
        details.push([...metadata, category.categoryId, detail.detailId, detailIndex + 1,
          detail.sourceLabel, detail.roles.leading.title, detail.roles.leading.description,
          detail.roles.following.title, detail.roles.following.description, detail.warning]);
      });
    });
    files.set(`${locale}/categories.csv`, csv(categories));
    files.set(`${locale}/details.csv`, csv(details));
  }
  return files;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  assert.ok(args.length === 0 || (args.length === 1 && args[0] === '--check'), 'Usage: node tools/question-bank/export.mjs [--check]');
  const check = args[0] === '--check';
  const files = buildFiles();
  for (const [relative, content] of files) {
    const filename = path.join(outputRoot, relative);
    if (check) {
      assert.ok(existsSync(filename), `Missing export: ${relative}`);
      assert.equal(readFileSync(filename, 'utf8'), content, `Stale export: ${relative}`);
    } else {
      mkdirSync(path.dirname(filename), { recursive: true });
      writeFileSync(filename, content, 'utf8');
    }
  }
  console.log(`${check ? 'Verified' : 'Exported'} ${files.size} files across ${locales.length} locales.`);
}
