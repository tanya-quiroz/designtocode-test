/** @type { import('@storybook/html-vite').StorybookConfig } */
const config = {
  stories: ['../stories/**/*.stories.@(js|mjs)'],
  addons: ['@storybook/addon-themes'],
  framework: {
    name: '@storybook/html-vite',
    options: {}
  },
  staticDirs: [{ from: '../build', to: '/token-build' }]
};

export default config;
