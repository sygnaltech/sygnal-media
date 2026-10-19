// Generate a reproducible metadata inventory without installing dependencies.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const lock = JSON.parse(fs.readFileSync(path.join(root, 'package-lock.json'), 'utf8'));
const escape = (value) => String(value).replace(/\|/g, '\\|').replace(/[\r\n]+/g, ' ');
const entries = Object.entries(lock.packages)
  .filter(([location]) => location)
  .sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0);
const counts = new Map();
for (const [, pkg] of entries) {
  const license = pkg.license || 'Not declared';
  counts.set(license, (counts.get(license) || 0) + 1);
}
const lines = [
  '# Dependency license inventory',
  '',
  'Generated from `package-lock.json` with `npm run licenses`. Do not edit by hand.',
  '',
  `Includes all ${entries.length} locked package locations, including development, transitive, optional, and platform-specific packages. A locked entry does not prove that a package is installed or shipped in a browser bundle.`,
  '',
  'License expressions are reproduced from lockfile metadata; they are not a legal determination or a substitute for upstream license texts, copyright notices, and bundled subcomponent notices. "Not declared" means the lockfile has no license field, not that use is unrestricted. See [third-party notices](THIRD_PARTY_NOTICES.md) for inspected exceptions and direct dependencies.',
  '',
  '## Declared license summary',
  '',
  '| License expression | Package locations |',
  '| --- | ---: |',
  ...[...counts].sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0)
    .map(([license, count]) => `| ${escape(license)} | ${count} |`),
  '',
  '## Locked packages',
  '',
  '| Package location | Version | Declared license |',
  '| --- | --- | --- |',
  ...entries.map(([location, pkg]) => `| ${escape(location)} | ${escape(pkg.version || 'Not declared')} | ${escape(pkg.license || 'Not declared')} |`),
  '',
];
fs.writeFileSync(path.join(root, 'DEPENDENCY_LICENSES.md'), lines.join('\n'));
console.log(`Wrote DEPENDENCY_LICENSES.md (${entries.length} package locations).`);
