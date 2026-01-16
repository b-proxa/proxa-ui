const Anthropic = require('@anthropic-ai/sdk');

let anthropic = null;
if (process.env.ANTHROPIC_API_KEY) {
  anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  });
}

module.exports = async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check for API key
  if (!anthropic) {
    return res.status(500).json({ error: 'AI not configured. ANTHROPIC_API_KEY not set.' });
  }

  const { prompt, context, messages = [] } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const systemPrompt = buildSystemPrompt(context);

    // Build conversation messages
    const conversationMessages = messages.map(m => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.content
    }));

    // Add current prompt as last user message
    conversationMessages.push({ role: 'user', content: prompt });

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: systemPrompt,
      messages: conversationMessages
    });

    res.json({
      success: true,
      suggestion: response.content[0].text
    });
  } catch (error) {
    console.error('AI generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

function buildSystemPrompt(context) {
  if (!context) {
    return 'You are an AI assistant. Respond concisely and helpfully.';
  }

  const parts = [
    `You are an AI assistant helping with data management in a business application.`,
    ``,
    `Field type: ${context.fieldType || 'text'}`,
    `Field name: ${context.fieldName || 'Content'}`,
    `Tone: ${context.tone || 'professional'}`
  ];

  // Add preset instructions if provided
  if (context.presetInstructions) {
    parts.push('');
    parts.push('IMPORTANT formatting requirements:');
    parts.push(context.presetInstructions);
  }

  // Add custom instructions if provided
  if (context.customInstructions) {
    parts.push('');
    parts.push('Additional instructions:');
    parts.push(context.customInstructions);
  }

  // Add attachment data
  parts.push('');
  if (context.attachment) {
    parts.push(`Available reference data:\n--- ${context.attachment.name} ---\n${context.attachment.content}`);
  }

  // Add current table data if available (for description/title generation)
  if (context.currentTableData) {
    parts.push('');
    parts.push('Current data table:');
    const { labels, series } = context.currentTableData;
    // Format as a readable table
    parts.push(`Columns: ${labels.join(', ')}`);
    series.forEach(s => {
      parts.push(`${s.name}: ${s.data.map(d => d.toLocaleString()).join(', ')}`);
    });
  }

  // Add current content if any
  if (context.currentContent) {
    parts.push('');
    parts.push(`Current content:\n${JSON.stringify(context.currentContent, null, 2)}`);
  }

  parts.push('');
  parts.push('Respond with ONLY the data/content requested, formatted appropriately for the field type. Do not include explanations unless asked.');

  return parts.join('\n');
}
