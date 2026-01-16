# AI Blocks — MVP Specification

> Persistent, re-runnable prompts with human-in-the-loop review.

---

## Overview

AI Blocks let users describe what they want in plain English. The AI suggests content; users review and accept or reject before applying.

### Principles

1. **Persistent** - Prompts saved per field, can be re-run
2. **Context-aware** - Blocks know their field type and can reference uploaded files
3. **Human-in-the-loop** - Always review before applying
4. **Manual execution** - User clicks "Run" (no auto-execution)

---

## UX Flow

### Entry Point

Existing `[AI]` buttons next to field labels.

### Panel States

```
┌─────────────────────────────────────────────────┐
│  Prompt                                         │
│  ┌───────────────────────────────────────────┐  │
│  │ Using the Mountain Wilderness file,       │  │
│  │ extract Revenue, Costs, and Profit...     │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  Attachment: [Mountain_Wilderness.xlsx ▼]       │
│                                                 │
│  [Run]                          Prompt saved ✓  │
├ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┤
│  ⚡ Suggestion                                  │
│  ┌───────────────────────────────────────────┐  │
│  │ Year     Revenue      Costs      Profit   │  │
│  │ 2024   $4,065,642  $3,245,037   $820,605  │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  [Reject]                            [Accept]   │
└─────────────────────────────────────────────────┘
```

| State | Description |
|-------|-------------|
| **Editing** | Prompt textarea, attachment dropdown, Run button |
| **Running** | Spinner on Run button |
| **Review** | Suggestion shown, Accept/Reject visible |

---

## Data Model

### Prompt Storage (localStorage)

```javascript
// Key: 'aiBlocks'
{
  "record-123:data": {
    "prompt": "Extract Revenue, Costs, Profit...",
    "attachment": "Mountain_Wilderness.xlsx"
  }
}
```

### API Request

```javascript
{
  prompt: "User's prompt text",
  context: {
    fieldType: "data-table",
    fieldName: "Visualization Data",
    attachment: {
      name: "Mountain_Wilderness.xlsx",
      content: "... file content ..."
    }
  }
}
```

---

## Implementation

### Prerequisites

- `ANTHROPIC_API_KEY` environment variable
- Anthropic SDK installed (`@anthropic-ai/sdk`)

### Server Endpoint (Done)

`POST /api/ai/generate` — accepts prompt + context, returns suggestion.

### Frontend Tasks

1. **Wire up AI button** — Opens panel with prompt textarea
2. **Prompt persistence** — Save to localStorage on blur
3. **Attachment dropdown** — List uploaded files from record
4. **Run button** — POST to `/api/ai/generate`, show spinner
5. **Suggestion display** — Render AI response in panel
6. **Accept/Reject** — Apply content or dismiss

---

## MVP Effort

| Task | Effort |
|------|--------|
| Server endpoint | Done |
| Prompt textarea + persistence | ~5 min |
| Attachment dropdown | ~10 min |
| Run → API → display suggestion | ~15 min |
| Accept/Reject flow | ~10 min |
| Testing | ~5 min |
| **Total** | **~45 min** |

---

## Future (Post-MVP)

- Streaming responses
- Prompt templates
- Run history
- Multiple attachments
- Auto-run on file changes

---

*Last updated: January 2026*
