/** @type { import('@storybook/html-vite').StorybookConfig } */
const config = {
  stories: ['../stories/**/*.stories.@(js|mjs)'],
  framework: {
    name: '@storybook/html-vite',
    options: {}
  }
};

export default config;
