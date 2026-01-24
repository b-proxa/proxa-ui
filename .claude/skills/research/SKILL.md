---
name: research
description: Generate competitive research and market analysis on a given topic
argument-hint: [topic]
---

# Research Skill

Generate comprehensive competitive research on the given topic using web search for current information.

## Process

1. **Web Search**: Search for current information about the topic including:
   - Key players/competitors
   - Recent news and developments
   - Market trends and statistics
   - Industry analysis

2. **Analyze & Synthesize**: Organize findings into structured sections

3. **Generate Report**: Output as a complete HTML file matching the Proxa Research Template

## Output Format

Generate a self-contained HTML file with these sections:

### Structure
```
- Header (topic name, date)
- Breaking News Alert (if significant recent news exists)
- Subject Overview (hero card with key stats)
- Key Competitors (2-column grid of competitor cards)
- Feature Comparison (table)
- Recent News (3-column grid, 3-6 items)
- Industry Trends (4-column grid)
- Key Takeaways (summary list)
```

### Template Reference

Use the Research Template at `_prototypes/research-template.html` as the HTML/CSS reference. Copy its complete `<style>` block and HTML structure, replacing the content with researched data.

## After Generation

1. Write the report to `_prototypes/research-[topic-slug].html`
2. Ask the user: "Research report generated. Would you like to save this report and add it to the sidebar?"
3. If yes:
   - Add entry to sidebar in `index.html` under Prototypes
   - Add PAGE_META entry
   - Commit and push to deploy

## Example

User: `/research electric vehicle charging networks`

Output: `_prototypes/research-ev-charging.html` with competitive analysis of ChargePoint, Electrify America, Tesla Supercharger, etc.
