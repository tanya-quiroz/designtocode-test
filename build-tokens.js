import StyleDictionary from 'style-dictionary';
import { register } from '@tokens-studio/sd-transforms';

register(StyleDictionary);

const sd = new StyleDictionary({
  source: [
    'designtocode-test/core.json',
    'designtocode-test/light.json',
    'designtocode-test/theme.json'
  ],
  preprocessors: ['tokens-studio'],
  platforms: {
    css: {
      transformGroup: 'tokens-studio',
      transforms: ['name/kebab'],
      buildPath: 'build/',
      files: [
        {
          destination: 'variables.css',
          format: 'css/variables'
        }
      ]
    }
  }
});

await sd.buildAllPlatforms();
console.log('✓ Tokens built → build/variables.css');
