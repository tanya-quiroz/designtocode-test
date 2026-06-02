const buttonStyles = `
  .btn-primary {
    background: var(--button-primary-background);
    color: var(--button-primary-text);
    border: none;
    border-radius: var(--button-border-radius);
    padding: var(--spacing-sm) var(--spacing-md);
    font-size: var(--font-sizes-body);
    font-family: var(--font-families-body);
    cursor: pointer;
    transition: filter 0.15s ease;
  }
  .btn-primary:hover { filter: brightness(0.92); }
`;

function ensureStyles() {
  if (document.head.querySelector('style[data-btn-styles]')) return;
  const tag = document.createElement('style');
  tag.setAttribute('data-btn-styles', 'true');
  tag.textContent = buttonStyles;
  document.head.appendChild(tag);
}

export default {
  title: 'Components/Button',
  argTypes: {
    label: { control: 'text' }
  }
};

const Template = ({ label }) => {
  ensureStyles();
  const btn = document.createElement('button');
  btn.className = 'btn-primary';
  btn.textContent = label;
  return btn;
};

const DocumentationTemplate = () => {
  const container = document.createElement('div');
  container.style.maxWidth = '720px';
  container.style.padding = '16px';
  container.style.fontFamily = 'var(--font-families-body, system-ui, sans-serif)';
  container.style.color = 'var(--fg-default)';
  container.innerHTML = `
    <h2>Button Component Documentation</h2>
    <p>The button component is built with shared design tokens and supports Storybook theme previews for brand and light/dark mode variations.</p>
    <h3>Markup</h3>
    <pre style="background: var(--bg-muted); padding: 16px; border-radius: 12px; overflow-x:auto;">
<code>&lt;button class="btn-primary"&gt;Primary Button&lt;/button&gt;</code>
    </pre>
    <h3>Token-based styles</h3>
    <ul>
      <li><strong>background:</strong> var(--button-primary-background)</li>
      <li><strong>color:</strong> var(--button-primary-text)</li>
      <li><strong>border-radius:</strong> var(--button-border-radius)</li>
      <li><strong>padding:</strong> var(--spacing-sm) var(--spacing-md)</li>
    </ul>
    <p>Use the Storybook theme controls to preview the button across different brands and themes.</p>
  `;
  return container;
};

export const Primary = {
  render: Template,
  args: { label: 'Primary Button' }
};

export const Documentation = {
  render: DocumentationTemplate,
  name: 'Documentation',
  parameters: {
    docs: {
      storyDescription: 'Documentation for the button component and its token-based styling.'
    }
  }
};
