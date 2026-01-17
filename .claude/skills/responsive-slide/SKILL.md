---
name: responsive-slide
description: Create responsive card/slide layouts with fixed headers and flexible content zones. Use when building presentation slides, dashboard cards, or any layout with fixed and flexible regions.
allowed-tools: Read, Edit, Write
---

# Responsive Slide/Card Layouts

Create presentation-style cards with zones that adapt to different aspect ratios while keeping headers fixed.

## The Problem

When changing aspect ratios (16:9 → 16:4), content zones need to:
- Keep headers/titles at FIXED size
- Have content areas SHRINK to fit remaining space
- Enable scrolling when content overflows
- Have charts/visualizations fill exact available space

## Key CSS Patterns

### 1. Grid Setup with Fixed + Flexible Rows

```css
.slide {
    display: grid;
    grid-template-columns: 35% 1fr;
    grid-template-rows: auto 1fr;  /* auto = fixed header, 1fr = flexible content */
    overflow: hidden;
}
```

### 2. The Critical `min-height: 0` Rule

By default, flex items won't shrink below their content's minimum size. This breaks responsive layouts.

```css
/* WRONG - content won't shrink */
.content-zone {
    display: flex;
    flex-direction: column;
}

/* CORRECT - content can shrink */
.content-zone {
    display: flex;
    flex-direction: column;
    min-height: 0;  /* CRITICAL */
    overflow: hidden;
}

.content-zone__inner {
    flex: 1;
    min-height: 0;  /* CRITICAL - on the flex item too */
    overflow-y: auto;
}
```

### 3. Absolute Positioning for Exact Fill

For charts or content that must fill exact available space:

```css
.viz-content {
    flex: 1;
    min-height: 0;
    position: relative;  /* Establish positioning context */
}

.chart-container {
    position: absolute;
    inset: 0;  /* Fill parent exactly - top:0, right:0, bottom:0, left:0 */
}
```

### 4. Prevent Header Shrinking

```css
.header {
    flex-shrink: 0;  /* Never shrink */
}
```

## Complete Slide Structure

```html
<div class="slide" style="aspect-ratio: 16/9;">
    <!-- Fixed header - spans full width -->
    <div class="slide__title">
        <span class="slide__section-header">Section</span>
        <h1>Title</h1>
    </div>

    <!-- Flexible description - scrolls if overflow -->
    <div class="slide__description">
        <div class="slide__description-content">
            <!-- Content here -->
        </div>
    </div>

    <!-- Flexible visualization - chart fills space -->
    <div class="slide__viz">
        <div class="slide__viz-header">
            <!-- Legend, units, etc -->
        </div>
        <div class="slide__viz-content">
            <div class="chart-container">
                <canvas id="chart"></canvas>
            </div>
        </div>
    </div>
</div>
```

## Complete CSS

```css
.slide {
    display: grid;
    grid-template-columns: var(--col-split, 35%) 1fr;
    grid-template-rows: auto 1fr;
    background: white;
    border-radius: 8px;
    overflow: hidden;
}

/* Title - FIXED height */
.slide__title {
    grid-column: 1 / -1;
    grid-row: 1;
    padding: 16px 20px;
    flex-shrink: 0;
}

/* Description - FLEXIBLE height */
.slide__description {
    grid-column: 1;
    grid-row: 2;
    display: flex;
    flex-direction: column;
    min-height: 0;      /* CRITICAL */
    overflow: hidden;
}

.slide__description-content {
    flex: 1;
    min-height: 0;      /* CRITICAL */
    overflow-y: auto;   /* Scroll when overflow */
    padding: 16px;
}

/* Visualization - FLEXIBLE height */
.slide__viz {
    grid-column: 2;
    grid-row: 2;
    display: flex;
    flex-direction: column;
    min-height: 0;      /* CRITICAL */
    overflow: hidden;
    padding: 12px;
}

.slide__viz-header {
    flex-shrink: 0;     /* Don't shrink */
    margin-bottom: 8px;
}

.slide__viz-content {
    flex: 1;
    min-height: 0;      /* CRITICAL */
    overflow: hidden;
    position: relative;
}

.chart-container {
    position: absolute;
    inset: 0;           /* Fill exactly */
}
```

## Chart.js Requirements

```javascript
new Chart(ctx, {
    type: 'line',
    data: chartData,
    options: {
        responsive: true,
        maintainAspectRatio: false,  // CRITICAL - allows chart to fill container height
    }
});

// After aspect ratio changes:
chart.resize();
```

## Aspect Ratio Variants

```css
/* Standard */
.slide { aspect-ratio: 16 / 9; }

/* Wide - header stays same, content zones shrink */
.slide--wide { aspect-ratio: 16 / 4; }

/* For wide format, optionally reduce text size */
.slide--wide .slide__description-content {
    font-size: 0.875rem;
}
```

## Debugging Checklist

If content doesn't shrink properly:

1. Check `min-height: 0` on ALL flex containers in the chain
2. Check `min-height: 0` on the flex ITEMS (children) too
3. Ensure parent has `overflow: hidden`
4. For charts: use `position: absolute; inset: 0` on container
5. For Chart.js: set `maintainAspectRatio: false`

## Common Mistakes

```css
/* WRONG - missing min-height: 0 */
.flex-container {
    display: flex;
    flex-direction: column;
}

/* WRONG - using height instead of flex */
.content {
    height: 100%;  /* Won't work reliably in flex context */
}

/* WRONG - missing overflow */
.scrollable {
    overflow-y: auto;  /* Won't work without min-height: 0 */
}
```

## Testing

1. Change aspect ratio from 16:9 to 16:4
2. Header should stay EXACTLY the same size
3. Description should shrink and show scrollbar if content overflows
4. Chart should resize to fill available space
5. X-axis labels should remain visible (not cut off)
