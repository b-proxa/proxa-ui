# Artifact-Ready Templates

Self-contained HTML templates that render properly as Claude artifacts. Each file includes all CSS embedded - no external dependencies.

## Templates

| Template | Description | Best For |
|----------|-------------|----------|
| `dashboard.html` | KPI metrics, charts, sidebar | Executive summaries, performance overviews |
| `report.html` | Document-style with sections | Quarterly reports, financial analysis |
| `presentation.html` | 16:9 slides with description + viz | Board decks, data presentations |
| `data-review.html` | Split view with tables | Data validation, detailed analysis |

## Usage

These templates are designed to be served as Claude artifacts. The backend team handles delivery via MCP or other mechanisms.

Each template includes:
- Embedded CSS (design tokens + components)
- Realistic example content
- Responsive layout
- ZONE markers for content areas

## Customization

To create a new page based on these templates:
1. Copy the template HTML
2. Modify content within ZONE sections
3. Update title and metadata
4. Save as new file

## Design System

These templates use the Proxa design system:
- **Colors**: Natural stone gray scale + accent blue
- **Typography**: System fonts, 4 size levels
- **Spacing**: 4px base unit (space-1 through space-8)
- **Components**: Cards, metric blocks, tables, badges
