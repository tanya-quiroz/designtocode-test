const buttonStyles = `
  .btn {
    background: var(--button-background);
    color: var(--button-text);
    border: none;
    border-radius: var(--button-radius);
    padding: var(--button-padding-y) var(--button-padding-x);
    font-size: var(--button-font-size);
    cursor: pointer;
    transition: background 0.15s ease;
  }
  .btn:hover { background: var(--button-background-hover); }
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
  btn.className = 'btn';
  btn.textContent = label;
  return btn;
};

export const Primary = {
  render: Template,
  args: { label: 'Primary Button' }
};
