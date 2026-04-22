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
console.log('✓ Tokens built → build/variables.css (light + dark)');
