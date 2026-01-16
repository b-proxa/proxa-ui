---
name: docx
description: Create Word documents (.docx files). Use when user wants to generate a document, create reports, or export content to Word format.
allowed-tools: Bash(python:*), Write, Read
---

# DOCX Word Document Creation

Create Word documents using Python's python-docx library.

## Prerequisites

```bash
pip install python-docx
```

## Basic Usage

```python
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.style import WD_STYLE_TYPE

doc = Document()

# Add heading
doc.add_heading('Document Title', 0)

# Add paragraph
doc.add_paragraph('This is a paragraph of text.')

# Save
doc.save('output.docx')
```

## Headings

```python
doc.add_heading('Main Title', 0)      # Title
doc.add_heading('Chapter 1', 1)       # Heading 1
doc.add_heading('Section 1.1', 2)     # Heading 2
doc.add_heading('Subsection', 3)      # Heading 3
```

## Text Formatting

```python
# Bold, italic, underline
p = doc.add_paragraph()
p.add_run('Bold text').bold = True
p.add_run(' and ')
p.add_run('italic text').italic = True

# Font size and color
run = p.add_run('Colored text')
run.font.size = Pt(14)
run.font.color.rgb = RGBColor(0x4a, 0x6f, 0xa5)  # Accent blue

# Paragraph alignment
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
```

## Lists

```python
# Bullet list
doc.add_paragraph('First item', style='List Bullet')
doc.add_paragraph('Second item', style='List Bullet')

# Numbered list
doc.add_paragraph('Step one', style='List Number')
doc.add_paragraph('Step two', style='List Number')
```

## Tables

```python
# Create table
table = doc.add_table(rows=3, cols=4)
table.style = 'Table Grid'

# Header row
header_cells = table.rows[0].cells
header_cells[0].text = 'Name'
header_cells[1].text = 'Q1'
header_cells[2].text = 'Q2'
header_cells[3].text = 'Total'

# Data rows
row = table.rows[1].cells
row[0].text = 'Revenue'
row[1].text = '$1,000'
row[2].text = '$1,200'
row[3].text = '$2,200'

# Style header row
for cell in table.rows[0].cells:
    cell.paragraphs[0].runs[0].bold = True
```

## Page Breaks

```python
doc.add_page_break()
```

## Images

```python
doc.add_picture('image.png', width=Inches(4))
```

## Output Location

Save files to the project's `references/files/documents/` directory:

```python
doc.save("/Users/laurensmacbookair/proxa-ui/references/files/documents/filename.docx")
```

## Complete Example

```python
from docx import Document
from docx.shared import Inches, Pt
from docx.enum.text import WD_ALIGN_PARAGRAPH

doc = Document()

# Title
title = doc.add_heading('Quarterly Report', 0)
title.alignment = WD_ALIGN_PARAGRAPH.CENTER

# Subtitle
subtitle = doc.add_paragraph('Q4 2024 Financial Summary')
subtitle.alignment = WD_ALIGN_PARAGRAPH.CENTER

# Executive Summary
doc.add_heading('Executive Summary', 1)
doc.add_paragraph(
    'This report provides an overview of our financial performance '
    'for the fourth quarter of 2024.'
)

# Key Metrics
doc.add_heading('Key Metrics', 1)
doc.add_paragraph('Revenue: $1.4M', style='List Bullet')
doc.add_paragraph('Net Income: $500K', style='List Bullet')
doc.add_paragraph('Growth: 12% YoY', style='List Bullet')

# Table
doc.add_heading('Financial Summary', 1)
table = doc.add_table(rows=4, cols=3)
table.style = 'Table Grid'

data = [
    ['Metric', 'Q4 2024', 'Q4 2023'],
    ['Revenue', '$1,400,000', '$1,250,000'],
    ['Expenses', '$900,000', '$850,000'],
    ['Net Income', '$500,000', '$400,000']
]

for i, row_data in enumerate(data):
    row = table.rows[i].cells
    for j, cell_data in enumerate(row_data):
        row[j].text = cell_data
        if i == 0:  # Bold headers
            row[j].paragraphs[0].runs[0].bold = True

doc.save('quarterly_report.docx')
```
