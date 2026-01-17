# Slide Component — Responsive Layout Specification

## Overview

The Slide component is a presentation-style card with three zones:
1. **Header** (Title zone) - Fixed height, spans full width
2. **Description** (Left zone) - Flexible height, scrollable content
3. **Visualization** (Right zone) - Flexible height, chart fills available space

## Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│  HEADER (fixed height, auto based on content)           │
│  Section Header + Title                                 │
├───────────────────────┬─────────────────────────────────┤
│                       │                                 │
│  DESCRIPTION          │  VISUALIZATION                  │
│  (flex: 1)            │  (flex: 1)                      │
│  overflow-y: auto     │  chart fills space              │
│                       │                                 │
└───────────────────────┴─────────────────────────────────┘
```

## Responsive Behavior

### What stays FIXED (same across all aspect ratios):
- Header padding: `var(--space-4) var(--space-5)`
- Header font sizes: section-header `text-xs`, title `text-xl`
- Description padding: `var(--space-4)`
- Visualization padding: `var(--space-3)`

### What FLEXES (adapts to available space):
- Description content area height (uses remaining space after header)
- Visualization content area height (uses remaining space after header)
- Chart canvas (fills its container)

### Scrolling:
- Description: `overflow-y: auto` when content exceeds available height
- Visualization: Chart scales to fit, no scroll

## CSS Implementation

### Grid Setup
```css
.slide {
    display: grid;
    grid-template-columns: var(--col-split, 35%) 1fr;
    grid-template-rows: auto 1fr;  /* Header auto, content fills rest */
    overflow: hidden;
}
```

### Header Zone
```css
.slide__title {
    grid-column: 1 / -1;  /* Span full width */
    grid-row: 1;
    padding: var(--space-4) var(--space-5);
}
```

### Description Zone
```css
.slide__description {
    grid-column: 1;
    grid-row: 2;
    display: flex;
    flex-direction: column;
    min-height: 0;  /* CRITICAL: allows flex child to shrink */
}

.slide__description-content {
    flex: 1;
    min-height: 0;  /* CRITICAL: allows overflow to work */
    padding: var(--space-4);
    overflow-y: auto;
}
```

### Visualization Zone
```css
.slide__viz {
    grid-column: 2;
    grid-row: 2;
    display: flex;
    flex-direction: column;
    min-height: 0;  /* CRITICAL */
    padding: var(--space-3);
}

.slide__viz-content {
    flex: 1;
    min-height: 0;  /* CRITICAL */
    position: relative;
}

.chart-container {
    position: absolute;
    inset: 0;  /* Fill parent exactly */
}
```

## Key CSS Rules for Responsive Flex Layouts

1. **`min-height: 0`** on flex containers and flex items
   - By default, flex items won't shrink below their content's minimum size
   - `min-height: 0` allows them to shrink to fit the container

2. **`position: absolute; inset: 0`** for chart container
   - Makes chart fill exact available space
   - Parent must have `position: relative`

3. **`overflow-y: auto`** for scrollable content
   - Only works when `min-height: 0` is set on the flex item

4. **`flex: 1`** for flexible content areas
   - Takes remaining space after fixed elements

## Aspect Ratios

| Ratio | Use Case | Notes |
|-------|----------|-------|
| 16:9  | Standard presentations | Default |
| 16:4  | Wide banners, dashboards | Header same, content areas shorter |
| 4:3   | Traditional slides | More vertical space |
| 1:1   | Social media, thumbnails | Square format |

## Chart.js Requirements

```javascript
{
    responsive: true,
    maintainAspectRatio: false,  // CRITICAL: allows chart to fill container height
}
```

Call `chart.resize()` after aspect ratio changes.

## Testing Checklist

- [ ] Header stays same size across all aspect ratios
- [ ] Description scrolls when content overflows
- [ ] Chart fills available space without overflow
- [ ] X-axis labels visible (not cut off)
- [ ] Switching aspect ratios updates layout smoothly

---

*Reference for Proxa Design System*
