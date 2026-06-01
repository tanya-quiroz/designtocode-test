import { withThemeByDataAttribute } from '@storybook/addon-themes';

const themeBackgroundStyle = `
  html, body {
    background: var(--bg-default);
    color: var(--fg-default);
    font-family: var(--font-families-body, system-ui, sans-serif);
    transition: background 0.2s ease, color 0.2s ease;
  }
`;
if (typeof document !== 'undefined' && !document.head.querySelector('style[data-sb-theme-bg]')) {
  const tag = document.createElement('style');
  tag.setAttribute('data-sb-theme-bg', 'true');
  tag.textContent = themeBackgroundStyle;
  document.head.appendChild(tag);
}

const THEME_VALUES = {
  'Brand A · Light': 'brand-a:light',
  'Brand A · Dark':  'brand-a:dark',
  'Brand B · Light': 'brand-b:light',
  'Brand B · Dark':  'brand-b:dark',
};

// Reads the selected label from globals and sets data-brand + data-theme
const withBrandAndTheme = (storyFn, context) => {
  const label = context.globals?.theme || 'Brand A · Light';
  const combo = THEME_VALUES[label] || 'brand-a:light';
  const [brand, theme] = combo.split(':');
  document.documentElement.setAttribute('data-brand', brand);
  document.documentElement.setAttribute('data-theme', theme);
  return storyFn();
};

/** @type { import('@storybook/html').Preview } */
export default {
  decorators: [
    withThemeByDataAttribute({
      themes: {
        'Brand A · Light': 'brand-a:light',
        'Brand A · Dark':  'brand-a:dark',
        'Brand B · Light': 'brand-b:light',
        'Brand B · Dark':  'brand-b:dark',
      },
      defaultTheme: 'Brand A · Light',
      attributeName: 'data-combo'
    }),
    withBrandAndTheme
  ],
  parameters: {
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i }
    }
  }
};
