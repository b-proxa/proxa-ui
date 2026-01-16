# AI Blocks — Specification

> Contextual AI skills with human-in-the-loop review.

---

## Conceptual Model

AI Blocks are a **hybrid pattern** between simple prompts and autonomous agents:

| Level | Description |
|-------|-------------|
| **Prompt** | Text in → text out. Stateless, no context, no action. |
| **AI Block** | Context-aware, stateful (chat), can take action, scoped to a purpose. |
| **Agent** | Autonomous, multi-step, uses tools, decides what to do next. |

### What Makes AI Blocks Different

- **Context-aware**: Knows the field type, current data, attachments, related table values
- **Stateful**: Chat history enables multi-turn refinement
- **Action-capable**: Accept button commits output to the target field
- **Scoped**: Each block has a specific purpose (generate table data, write description, etc.)
- **Human-in-the-loop**: User approves before anything changes

### The Hybrid Advantage

AI Blocks aren't just a text box that calls an LLM. They're **scoped, contextual skills** that:
1. Understand what they're helping with (field context)
2. Can reference relevant data (attachments, current values)
3. Allow iterative refinement (inline chat)
4. Take targeted action (write to a specific field)
5. Stay under user control (approve/reject)

This pattern can be reused anywhere: form fields, content editors, code blocks, email drafts, report sections—anywhere you want AI assistance scoped to a specific output.

---

## Overview

AI Blocks let users describe what they want in plain English. The AI suggests content; users review and accept or reject before applying.

### Principles

1. **Persistent** - Prompts saved per field, can be re-run
2. **Context-aware** - Blocks know their field type and can reference uploaded files
3. **Human-in-the-loop** - Always review before applying
4. **Manual execution** - User clicks "Run" (no auto-execution)
5. **Conversational** - Inline chat for multi-turn refinement
6. **Reusable** - Save prompts to a library for future use

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

## Implemented Features

- ✅ Multi-turn chat within blocks
- ✅ Saved prompts library (localStorage)
- ✅ Context injection (table data, attachments, current values)
- ✅ Preset instructions (e.g., Financial Table formatting)

## Future

- Streaming responses
- Run history / version tracking
- Multiple attachments per prompt
- Cross-block context (reference output from another block)
- Prompt sharing across users

---

*Last updated: January 2026*
