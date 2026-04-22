import { withThemeByDataAttribute } from '@storybook/addon-themes';
import '../build/variables.css';

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

export const decorators = [
  withThemeByDataAttribute({
    themes: { light: 'light', dark: 'dark' },
    defaultTheme: 'light',
    attributeName: 'data-theme'
  })
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
