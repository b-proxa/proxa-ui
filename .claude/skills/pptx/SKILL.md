---
name: pptx
description: Create PowerPoint presentations (.pptx files). Use when user wants to generate slides, create presentations, or export content to PowerPoint format.
allowed-tools: Bash(python:*), Write, Read
---

# PPTX PowerPoint Creation

Create PowerPoint presentations using Python's python-pptx library.

## Prerequisites

```bash
pip install python-pptx
```

## Basic Usage

```python
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR

prs = Presentation()

# Add slide
slide_layout = prs.slide_layouts[1]  # Title and Content
slide = prs.slides.add_slide(slide_layout)

# Set title
title = slide.shapes.title
title.text = "Slide Title"

# Save
prs.save('output.pptx')
```

## Slide Layouts

```python
# Common layouts (index may vary by template)
prs.slide_layouts[0]  # Title Slide
prs.slide_layouts[1]  # Title and Content
prs.slide_layouts[5]  # Title Only
prs.slide_layouts[6]  # Blank
```

## Title Slide

```python
slide_layout = prs.slide_layouts[0]
slide = prs.slides.add_slide(slide_layout)
title = slide.shapes.title
subtitle = slide.placeholders[1]

title.text = "Presentation Title"
subtitle.text = "Subtitle or Date"
```

## Content Slide with Bullets

```python
slide_layout = prs.slide_layouts[1]
slide = prs.slides.add_slide(slide_layout)

title = slide.shapes.title
title.text = "Key Points"

body = slide.placeholders[1]
tf = body.text_frame
tf.text = "First bullet point"

p = tf.add_paragraph()
p.text = "Second bullet point"
p.level = 0

p = tf.add_paragraph()
p.text = "Sub-bullet"
p.level = 1
```

## Text Formatting

```python
from pptx.util import Pt
from pptx.dml.color import RGBColor

paragraph = text_frame.paragraphs[0]
run = paragraph.runs[0]
run.font.bold = True
run.font.size = Pt(24)
run.font.color.rgb = RGBColor(0x4a, 0x6f, 0xa5)
```

## Tables

```python
# Add table
rows, cols = 4, 3
left = Inches(1)
top = Inches(2)
width = Inches(8)
height = Inches(2)

table = slide.shapes.add_table(rows, cols, left, top, width, height).table

# Set column widths
table.columns[0].width = Inches(3)
table.columns[1].width = Inches(2.5)
table.columns[2].width = Inches(2.5)

# Fill cells
table.cell(0, 0).text = "Metric"
table.cell(0, 1).text = "Q4 2024"
table.cell(0, 2).text = "Q4 2023"
table.cell(1, 0).text = "Revenue"
table.cell(1, 1).text = "$1.4M"
table.cell(1, 2).text = "$1.25M"
```

## Shapes and Text Boxes

```python
from pptx.enum.shapes import MSO_SHAPE

# Add rectangle
left = Inches(1)
top = Inches(2)
width = Inches(3)
height = Inches(1)

shape = slide.shapes.add_shape(
    MSO_SHAPE.RECTANGLE, left, top, width, height
)
shape.text = "Box Text"

# Style shape
shape.fill.solid()
shape.fill.fore_color.rgb = RGBColor(0x4a, 0x6f, 0xa5)
shape.line.color.rgb = RGBColor(0x44, 0x40, 0x3c)
```

## Images

```python
slide.shapes.add_picture('chart.png', Inches(1), Inches(2), width=Inches(6))
```

## Output Location

Save files to the project's `references/files/presentations/` directory:

```python
prs.save("/Users/laurensmacbookair/proxa-ui/references/files/presentations/filename.pptx")
```

## Complete Example

```python
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor

prs = Presentation()

# Title Slide
slide = prs.slides.add_slide(prs.slide_layouts[0])
slide.shapes.title.text = "Q4 2024 Results"
slide.placeholders[1].text = "Financial Review"

# Key Metrics Slide
slide = prs.slides.add_slide(prs.slide_layouts[1])
slide.shapes.title.text = "Key Metrics"
body = slide.placeholders[1].text_frame
body.text = "Revenue: $1.4M (+12% YoY)"
body.add_paragraph().text = "Net Income: $500K (+25% YoY)"
body.add_paragraph().text = "Customer Growth: 15%"

# Table Slide
slide = prs.slides.add_slide(prs.slide_layouts[5])  # Title only
slide.shapes.title.text = "Financial Summary"

table = slide.shapes.add_table(4, 3, Inches(1), Inches(1.5), Inches(8), Inches(2.5)).table

data = [
    ["Metric", "Q4 2024", "Q4 2023"],
    ["Revenue", "$1,400,000", "$1,250,000"],
    ["Expenses", "$900,000", "$850,000"],
    ["Net Income", "$500,000", "$400,000"]
]

for row_idx, row_data in enumerate(data):
    for col_idx, value in enumerate(row_data):
        cell = table.cell(row_idx, col_idx)
        cell.text = value
        # Bold header row
        if row_idx == 0:
            cell.text_frame.paragraphs[0].runs[0].font.bold = True

prs.save('quarterly_results.pptx')
```
