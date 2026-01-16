---
name: xlsx
description: Create Excel spreadsheets (.xlsx files). Use when user wants to generate a spreadsheet, export data to Excel, or create XLSX files from tabular data.
allowed-tools: Bash(python:*), Write, Read
---

# XLSX Spreadsheet Creation

Create Excel files using Python's openpyxl library.

## Prerequisites

```bash
pip install openpyxl
```

## Basic Usage

```python
from openpyxl import Workbook
from openpyxl.styles import Font, Alignment, Border, Side, PatternFill
from openpyxl.utils.dataframe import dataframe_to_rows

wb = Workbook()
ws = wb.active
ws.title = "Sheet1"

# Add data
ws['A1'] = "Header 1"
ws['B1'] = "Header 2"
ws.append([value1, value2, value3])  # Add row

# Save
wb.save("output.xlsx")
```

## Styling

```python
# Bold headers
header_font = Font(bold=True)
ws['A1'].font = header_font

# Number formatting
ws['B2'].number_format = '#,##0.00'      # Numbers with commas
ws['C2'].number_format = '$#,##0.00'     # Currency
ws['D2'].number_format = '0.0%'          # Percentage

# Column width
ws.column_dimensions['A'].width = 20

# Alignment
ws['A1'].alignment = Alignment(horizontal='center')

# Background color
ws['A1'].fill = PatternFill(start_color="E7E5E4", fill_type="solid")

# Borders
thin_border = Border(
    left=Side(style='thin'),
    right=Side(style='thin'),
    top=Side(style='thin'),
    bottom=Side(style='thin')
)
ws['A1'].border = thin_border
```

## Multiple Sheets

```python
ws2 = wb.create_sheet("Summary")
ws3 = wb.create_sheet("Data", 0)  # Insert at position
```

## From Tabular Data

When user pastes tabular data (TSV, CSV, or space-separated):

```python
data = """
Name	Q1	Q2	Q3	Q4
Revenue	1000	1200	1100	1400
Expenses	800	850	820	900
"""

rows = [line.split('\t') for line in data.strip().split('\n')]
for row in rows:
    ws.append(row)
```

## Output Location

Save files to the project's `references/files/spreadsheets/` directory:

```python
wb.save("/Users/laurensmacbookair/proxa-ui/references/files/spreadsheets/filename.xlsx")
```

## Complete Example

```python
from openpyxl import Workbook
from openpyxl.styles import Font, Alignment, PatternFill, Border, Side

wb = Workbook()
ws = wb.active
ws.title = "Financial Data"

# Headers
headers = ["Category", "Q1", "Q2", "Q3", "Q4", "Total"]
ws.append(headers)

# Style headers
header_fill = PatternFill(start_color="E7E5E4", fill_type="solid")
header_font = Font(bold=True)
for col in range(1, len(headers) + 1):
    cell = ws.cell(row=1, column=col)
    cell.fill = header_fill
    cell.font = header_font
    cell.alignment = Alignment(horizontal='center')

# Data
data = [
    ["Revenue", 1000, 1200, 1100, 1400, "=SUM(B2:E2)"],
    ["Expenses", 800, 850, 820, 900, "=SUM(B3:E3)"],
    ["Net Income", "=B2-B3", "=C2-C3", "=D2-D3", "=E2-E3", "=SUM(B4:E4)"]
]
for row in data:
    ws.append(row)

# Format numbers
for row in range(2, 5):
    for col in range(2, 7):
        ws.cell(row=row, column=col).number_format = '#,##0'

# Column widths
ws.column_dimensions['A'].width = 15
for col in ['B', 'C', 'D', 'E', 'F']:
    ws.column_dimensions[col].width = 12

wb.save("financial_report.xlsx")
```
