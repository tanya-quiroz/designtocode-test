import StyleDictionary from 'style-dictionary';
import { register } from '@tokens-studio/sd-transforms';
import { readFile, writeFile } from 'node:fs/promises';

register(StyleDictionary);

async function buildTheme({ sources, destination, selector }) {
  const sd = new StyleDictionary({
    source: sources,
    preprocessors: ['tokens-studio'],
    expand: {
      typesMap: {
        typography: true,
        boxShadow: true,
        border: true
      }
    },
    platforms: {
      css: {
        transformGroup: 'tokens-studio',
        transforms: ['name/kebab'],
        buildPath: 'build/',
        files: [
          {
            destination,
            format: 'css/variables',
            options: { selector }
          }
        ]
      }
    }
  });
  await sd.buildAllPlatforms();
}

await buildTheme({
  sources: [
    'designtocode-test/core.json',
    'designtocode-test/light.json',
    'designtocode-test/theme.json'
  ],
  destination: 'light.css',
  selector: ':root, [data-theme="light"]'
});

await buildTheme({
  sources: [
    'designtocode-test/core.json',
    'designtocode-test/dark.json',
    'designtocode-test/theme.json'
  ],
  destination: 'dark.css',
  selector: '[data-theme="dark"]'
});

const light = await readFile('build/light.css', 'utf8');
const dark = await readFile('build/dark.css', 'utf8');
await writeFile('build/variables.css', `${light}\n${dark}`);

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

console.log(`✓ Tokens built → build/variables.css (light + dark)`);
console.log(`✓ Typography classes → build/typography.css (${typographyTokens.length} classes)`);
