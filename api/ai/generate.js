import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check for API key
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'AI not configured' });
  }

  const { prompt, context } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const systemPrompt = buildSystemPrompt(context);

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: systemPrompt,
      messages: [{ role: 'user', content: prompt }]
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
}

function buildSystemPrompt(context) {
  if (!context) {
    return 'You are an AI assistant. Respond concisely and helpfully.';
  }

  return `You are an AI assistant helping with data management in a business application.

Field type: ${context.fieldType || 'text'}
Field name: ${context.fieldName || 'Content'}

${context.attachment ?
  `Available reference data:\n--- ${context.attachment.name} ---\n${context.attachment.content}` :
  'No attachments provided.'}

${context.currentContent ?
  `Current content:\n${JSON.stringify(context.currentContent, null, 2)}` :
  'Field is currently empty.'}

Respond with ONLY the data/content requested, formatted appropriately for the field type. Do not include explanations unless asked.`;
}
