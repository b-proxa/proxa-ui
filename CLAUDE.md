# Proxa Design System

A plain HTML/CSS/JS design system for data visualization and record management interfaces. No build step required — open any HTML file directly in a browser.

## Architecture

```
proxa-ui/
├── index.html              # Main app with 4 tabs: Style Guide, Record, Pages, Sandbox
├── css/
│   ├── proxa.css           # Main entry point (imports all)
│   ├── tokens.css          # Design tokens
│   ├── base.css            # Reset and foundations
│   ├── elements/           # Base styled HTML
│   ├── components/         # Reusable composed blocks
│   ├── patterns/           # Complex assembled units
│   └── utilities.css       # Helper classes
├── js/                     # JavaScript modules
├── patterns/               # Pattern HTML examples
│   └── record.html         # Record pattern demo
├── pages/                  # Full page views
│   └── dashboard.html      # Dashboard page
└── tests/                  # Visual component tests
    ├── index.html          # Test index
    ├── elements/           # Element tests
    └── components/         # Component tests
```

## Navigation

The main `index.html` has four tabs:

| Tab | Description |
|-----|-------------|
| **Style Guide** | Design tokens, elements, components, and pattern documentation |
| **Record** | Full record pattern view (embedded iframe) |
| **Pages** | Left sidebar listing all pages; clicking loads page in preview iframe |
| **Sandbox** | Empty playground for experimenting with components |

### Adding New Pages
1. Create HTML file in `pages/`
2. Add a `<a class="page-link" data-page="pages/your-page.html">` to the Pages sidebar in `index.html`

## Hierarchy

### 1. Tokens (`css/tokens.css`)
CSS custom properties for all design decisions. Everything references these.

- **Colors**: Gray scale (50-900), accent, semantic (success, warning, error), financial
- **Spacing**: 4px base unit (space-1 through space-8)
- **Typography**: Font families, sizes (xs-xl), line heights
- **Borders & Radius**: Standard border, radius sizes (sm, md, lg)
- **Shadows**: Elevation levels (sm, md, lg)
- **Transitions**: Animation timings (fast, base, slide)

### 2. Elements (`css/elements/`)
Base styled HTML elements. Small, single-purpose, no JavaScript required.

| Element | File | Description |
|---------|------|-------------|
| Buttons | `buttons.css` | `.btn`, `.btn--primary`, `.btn--sm`, `.btn-ai`, `.btn-add` |
| Inputs | `inputs.css` | `.input`, `.textarea`, `.select`, `.field`, `.field__label` |
| Badges | `badges.css` | `.badge`, `.badge--count`, `.badge--success/warning/error` |
| Tabs | `tabs.css` | `.tabs`, `.tab`, `.app-tabs`, `.app-tab` |
| Dropdown | `dropdown.css` | `.dropdown`, `.dropdown__menu`, `.dropdown__item` |
| Toast | `toast.css` | `.toast`, `.toast--success/error/warning` |
| Avatar | `avatar.css` | `.avatar`, `.status-dot` |
| Markdown | `markdown.css` | `.markdown` for rendered markdown content |

### 3. Components (`css/components/`)
Reusable composed blocks. May combine multiple elements.

| Component | File | Description |
|-----------|------|-------------|
| Cards | `cards.css` | `.card`, `.card__header`, `.card__body` |
| Modal | `modal.css` | `.modal-overlay`, `.modal`, `.modal__header/body/footer` |
| Data Table | `data-table.css` | `.data-table`, editable cells, color pickers, comment dots |
| File Item | `file-item.css` | `.file-item`, file type icons, actions |
| File Upload | `file-upload.css` | `.file-upload__dropzone`, drag-and-drop |
| Metric Card | `metric-card.css` | `.metric-card` with sparkline and change indicator |
| Hub Card | `hub-card.css` | `.hub-card` for dashboard shortcuts |
| AI Panel | `ai-panel.css` | `.ai-panel` for AI generation interface |
| Slide Panel | `slide-panel.css` | `.panel` sliding drawer from right |
| Comments | `comments.css` | `.comment`, `.comment-row`, `.comments-table` |

**Charts & Visualizations:**

| Component | File | Description |
|-----------|------|-------------|
| Charts | `charts.css` | `.chart-container`, `.chart-wrap`, `.legend-item`, view tabs |
| Sparkline | `sparkline.css` | `.sparkline` SVG inline trend lines |
| Waterfall | `waterfall.css` | `.waterfall` revenue-to-profit bridge |
| Variance Bars | `variance-bars.css` | `.variance-chart` YoY comparison |
| Metric Block | `metric-block.css` | Metric display blocks |

### Chart Types

The design system supports these visualization types:

1. **Line/Bar/Area Charts** (via Chart.js)
   - Use `.chart-container` for sizing
   - Use `.chart-wrap` for full wrapper with header
   - Use `.legend-item` + `.legend-color` for legends

2. **Sparklines** (SVG)
   - Use `.sparkline` class on SVG element
   - Sizes: default, `--sm`, `--lg`
   - Define gradients inline in SVG

3. **Waterfall Charts**
   - Use `.waterfall` container
   - Bar types: `--increase`, `--decrease`, `--total`
   - Includes `.chart-legend` footer

4. **Variance Bars**
   - Use `.variance-chart` container
   - Use `.variance-row` for each data row
   - Bar types: `--positive`, `--negative`

### 4. Patterns (`css/patterns/`)
Complex assembled units that combine multiple components. These are like "Collection Items" in a CMS.

| Pattern | File | Description |
|---------|------|-------------|
| Record | `record.css` | The core data primitive — slide view, data table, comments, AI generation, attachments |
| Header | `header.css` | App header, navigation, toolbar, section titles |

**The Record Pattern** is the central concept:
- **Slide View**: 16:9 presentation format with Title, Description, Visualization zones
- **Data Table**: Editable spreadsheet with series, colors, cell comments
- **Comments**: Thread of annotations linked to data cells
- **AI Generation**: Panels for AI-assisted content creation
- **Attachments**: Source files that feed the record

### 5. Pages (`pages/`)
Full views that compose patterns and components into complete interfaces.

| Page | File | Description |
|------|------|-------------|
| Dashboard | `dashboard.html` | Overview with hub cards, metrics, activity table, slide panels |

## Key Concepts

### The Record
A Record is a self-contained data visualization unit. Think of it like a slide in a presentation or a row in a CMS. Each Record has:

- **Title Zone**: Section header + main title
- **Description Zone**: Markdown content explaining the data
- **Visualization Zone**: Chart or table view of the data
- **Source Data**: The underlying numbers in an editable table
- **Comments**: Annotations on specific data points
- **Attachments**: Source files (Excel, CSV, PDF)

### Slide Layout
Records use a 16:9 slide layout with CSS Grid:
```css
.slide {
    aspect-ratio: 16 / 9;
    grid-template-columns: var(--col-split, 35%) 6px 1fr;
    grid-template-rows: auto 1fr;
}
```

View modes: `output` (chart), `table` (data grid), `notes` (comments)

### Financial Data Patterns
The system includes tokens for financial visualization:
- `--fin-favorable`: Green for positive variances
- `--fin-unfavorable`: Red for negative variances
- `--fin-neutral`: Gray for unchanged values

## JavaScript Modules

All JS uses ES6 modules. Import via:
```html
<script type="module">
    import { initDropdowns } from './js/dropdown.js';
    import { showToast } from './js/toast.js';
    // ...
</script>
```

| Module | Exports |
|--------|---------|
| `dropdown.js` | `initDropdowns()`, `openDropdown()`, `closeDropdown()` |
| `toast.js` | `showToast(message, options)`, `hideToast()` |
| `slide-panel.js` | `initPanels()`, `openPanel(id)`, `closePanel()` |
| `sparkline.js` | `drawSparkline()`, `createSVGSparkline()` |
| `waterfall.js` | `renderWaterfall()`, `formatValue()` |
| `variance-chart.js` | `renderVarianceChart()`, `calculateVariance()` |

## Usage

### Opening Files
Double-click any HTML file to open in browser. No server required.

### Adding a New Element
1. Create `css/elements/new-element.css`
2. Add `@import 'elements/new-element.css';` to `proxa.css`
3. Add example to `index.html` style guide

### Adding a New Component
1. Create `css/components/new-component.css`
2. Add `@import 'components/new-component.css';` to `proxa.css`
3. Add example to `index.html` style guide

### Creating a New Page
1. Create HTML file in `pages/`
2. Link to `../css/proxa.css`
3. Import needed JS modules

## External Dependencies

Loaded via CDN (no npm required):
- **Chart.js**: `https://cdn.jsdelivr.net/npm/chart.js` — For line/bar/area charts
- **Marked.js**: `https://cdn.jsdelivr.net/npm/marked/marked.min.js` — For markdown rendering

## Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--gray-50` | #fafaf8 | Lightest background |
| `--gray-100` | #f6f5f3 | Page background |
| `--gray-200` | #e7e5e4 | Borders, dividers |
| `--gray-500` | #78716c | Muted text |
| `--gray-800` | #292524 | Primary text |
| `--accent` | #4a6fa5 | Primary blue |
| `--success` | #6b8f71 | Green (positive) |
| `--warning` | #c9a227 | Yellow (caution) |
| `--error` | #b54848 | Red (negative) |

## Naming Conventions

- **BEM-ish**: `.block__element--modifier`
- **State classes**: `.active`, `.open`, `.loading`, `.editing`
- **Size modifiers**: `--sm`, `--lg`, `--xl`
- **Semantic modifiers**: `--primary`, `--success`, `--warning`, `--error`

## Visual Test System

A browser-based visual QA system for testing components in all states and edge cases. No build step or test framework required — just open HTML files.

### Structure

```
tests/
├── index.html                    # Test index with links to all tests
├── elements/                     # Element tests
│   ├── button.test.html
│   ├── badge.test.html
│   └── ...
├── components/                   # Component tests
│   ├── metric-card.test.html
│   ├── hub-card.test.html
│   ├── file-item.test.html
│   └── ...
└── patterns/                     # Pattern tests
    └── ...
```

### Test File Format

Each test file includes:

1. **Header**: Component name, description, source file path
2. **Variants**: All visual variants/modifiers
3. **States**: Default, hover, active, disabled, loading, etc.
4. **Edge Cases**: Long text, empty state, overflow, missing data
5. **Props Reference**: Table of all available classes/options

### Creating a New Test

1. Create `tests/{category}/{component}.test.html`
2. Import shared styles: `<link rel="stylesheet" href="../../css/proxa.css">`
3. Follow the standard test file structure
4. Add link to `tests/index.html`

### Naming Convention

```
tests/elements/button.test.html
tests/components/metric-card.test.html
tests/patterns/record.test.html
```

### Running Tests

Open `tests/index.html` in a browser to see the test index with links to all component tests. Click any test to view that component in all its states.
