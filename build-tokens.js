import StyleDictionary from 'style-dictionary';
import { register } from '@tokens-studio/sd-transforms';
import { readFile, writeFile } from 'node:fs/promises';

register(StyleDictionary);

const BUILDS = [
  {
    sources: ['designtocode-test/core.json', 'designtocode-test/brand-A/light.json', 'designtocode-test/theme.json'],
    destination: 'brand-a-light.css',
    selector: ':root, [data-brand="brand-a"][data-theme="light"]'
  },
  {
    sources: ['designtocode-test/core.json', 'designtocode-test/brand-A/dark.json', 'designtocode-test/theme.json'],
    destination: 'brand-a-dark.css',
    selector: '[data-brand="brand-a"][data-theme="dark"]'
  },
  {
    sources: ['designtocode-test/core.json', 'designtocode-test/brand-B/light.json', 'designtocode-test/theme.json'],
    destination: 'brand-b-light.css',
    selector: '[data-brand="brand-b"][data-theme="light"]'
  },
  {
    sources: ['designtocode-test/core.json', 'designtocode-test/brand-B/dark.json', 'designtocode-test/theme.json'],
    destination: 'brand-b-dark.css',
    selector: '[data-brand="brand-b"][data-theme="dark"]'
  }
];

async function buildTheme({ sources, destination, selector }) {
  const sd = new StyleDictionary({
    source: sources,
    preprocessors: ['tokens-studio'],
    expand: {
      typesMap: { typography: true, boxShadow: true, border: true }
    },
    platforms: {
      css: {
        transformGroup: 'tokens-studio',
        transforms: ['name/kebab'],
        buildPath: 'build/',
        files: [{ destination, format: 'css/variables', options: { selector } }]
      }
    }
  });
  await sd.buildAllPlatforms();
}

for (const build of BUILDS) {
  await buildTheme(build);
}

const chunks = await Promise.all(
  BUILDS.map(({ destination }) => readFile(`build/${destination}`, 'utf8'))
);
await writeFile('build/variables.css', chunks.join('\n'));

// Typography utility classes (shared — theme.json is brand-agnostic)
const toKebab = (s) =>
  s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/[\s_]+/g, '-').toLowerCase();

function collectTypographyTokens(node, path = []) {
  const found = [];
  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith('$') || value == null || typeof value !== 'object') continue;
    if (value.$type === 'typography' && value.$value) {
      found.push({ path: [...path, key], value: value.$value });
    } else {
      found.push(...collectTypographyTokens(value, [...path, key]));
    }
  }
  return found;
}

const theme = JSON.parse(await readFile('designtocode-test/theme.json', 'utf8'));
const typographyTokens = collectTypographyTokens(theme);

const cssPropMap = {
  fontFamily: 'font-family',
  fontWeight: 'font-weight',
  fontSize: 'font-size',
  lineHeight: 'line-height',
  letterSpacing: 'letter-spacing',
  paragraphSpacing: 'margin-bottom'
};

const classLines = ['/**', ' * Typography utility classes — auto-generated from theme.json', ' */', ''];
for (const { path, value } of typographyTokens) {
  const slug = path.map(toKebab).join('-');
  classLines.push(`.${slug} {`);
  for (const prop of Object.keys(value)) {
    const cssProp = cssPropMap[prop];
    if (!cssProp) continue;
    classLines.push(`  ${cssProp}: var(--${slug}-${toKebab(prop)});`);
  }
  classLines.push('}', '');
}
await writeFile('build/typography.css', classLines.join('\n'));

console.log(`✓ Tokens built → build/variables.css (4 themes: brand-a/b × light/dark)`);
console.log(`✓ Typography classes → build/typography.css (${typographyTokens.length} classes)`);
