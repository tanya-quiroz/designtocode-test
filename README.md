# Design-to-Code Token Pipeline

A proof of concept showing how design tokens can flow automatically from Figma all the way to a live Storybook — with no manual handoff between design and development.

---

## How it works

```
Figma + Tokens Studio  →  GitHub  →  Style Dictionary  →  Storybook (Netlify)
```

1. A designer updates tokens in **Figma** using the Tokens Studio plugin
2. Tokens Studio **pushes the JSON files** to this GitHub repo
3. A **GitHub Action** automatically runs Style Dictionary to build CSS
4. **Netlify** detects the new commit and redeploys Storybook with the updated tokens

No manual steps. No file exports. No copy-pasting values.

---

## Token structure

Tokens are organised in `designtocode-test/` following a three-tier architecture:

```
designtocode-test/
  core.json          # Primitive values: colors, spacing, typography scale
  brand-A/
    base.json        # Brand-A semantic tokens + component tokens
    light.json       # Brand-A light theme overrides
    dark.json        # Brand-A dark theme overrides
  brand-B/
    base.json        # Brand-B semantic tokens + component tokens
    light.json       # Brand-B light theme overrides
    dark.json        # Brand-B dark theme overrides
```

This supports **2 brands × 2 themes = 4 CSS outputs**:

| File | Selector |
|------|----------|
| `build/brand-a-light.css` | `:root, [data-brand="brand-a"][data-theme="light"]` |
| `build/brand-a-dark.css` | `[data-brand="brand-a"][data-theme="dark"]` |
| `build/brand-b-light.css` | `[data-brand="brand-b"][data-theme="light"]` |
| `build/brand-b-dark.css` | `[data-brand="brand-b"][data-theme="dark"]` |

---

## Stack

| Tool | Role |
|------|------|
| Figma + Tokens Studio | Design and token authoring |
| GitHub | Version control and automation trigger |
| Style Dictionary v4 | Token transformation and CSS output |
| `@tokens-studio/sd-transforms` | Tokens Studio format support |
| Storybook 8 | Component documentation and visual testing |
| Netlify | Hosting and automatic deployment |

---

## GitHub Action

The Action in `.github/workflows/build-tokens.yml` runs automatically when token JSON files change.

**On any branch:** builds tokens and validates there are no errors — catches broken token references before they reach main.

**On main only:** builds tokens and commits the CSS output back to the repo, triggering a Netlify redeploy.

```
Push token changes
      │
      ▼
Build and validate tokens  (all branches)
      │
      ▼ only on main
Commit built CSS to repo
      │
      ▼
Netlify auto-deploys Storybook
```

---

## Running locally

```bash
# Install dependencies
npm install

# Build tokens only
npm run build:tokens

# Start Storybook dev server (rebuilds tokens first)
npm run dev

# Build Storybook for production
npm run build:netlify
```

---

## Adding a new brand

1. Create a new folder under `designtocode-test/` — e.g. `brand-C/`
2. Add `base.json`, `light.json`, and `dark.json` following the same structure as brand-A
3. Add the new build configs in `build-tokens.js`
4. Push to GitHub — the Action handles the rest

---

## Why this matters

Traditional token workflows rely on manual exports, Slack messages, and copy-pasting values between tools. This pipeline makes tokens the single source of truth — a change in Figma becomes a CSS variable in production in minutes, automatically, with a full audit trail in Git.
