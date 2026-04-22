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

export const Primary = {
  render: Template,
  args: { label: 'Primary Button' }
};
