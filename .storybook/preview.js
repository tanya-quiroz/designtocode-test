import { withThemeByDataAttribute } from '@storybook/addon-themes';
import '../build/variables.css';
import '../build/typography.css';

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

export const globalTypes = {
  brand: {
    name: 'Brand',
    defaultValue: 'brand-a',
    toolbar: {
      icon: 'component',
      items: [
        { value: 'brand-a', title: 'Brand A' },
        { value: 'brand-b', title: 'Brand B' }
      ],
      showName: true,
      dynamicTitle: true
    }
  }
};

const withBrand = (storyFn, context) => {
  const brand = context.globals.brand || 'brand-a';
  document.documentElement.setAttribute('data-brand', brand);
  return storyFn();
};

export const decorators = [
  withThemeByDataAttribute({
    themes: { Light: 'light', Dark: 'dark' },
    defaultTheme: 'Light',
    attributeName: 'data-theme'
  }),
  withBrand
];

/** @type { import('@storybook/html').Preview } */
const preview = {
  parameters: {
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i }
    }
  }
};

export default preview;
