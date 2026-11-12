import express from 'express';

const app = express();
app.use(express.json({ limit: '1mb' }));
const model = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-5';

async function generate(prompt, max_tokens) {
  if (!process.env.ANTHROPIC_API_KEY) throw Object.assign(new Error('Claude is not configured. Add ANTHROPIC_API_KEY in Vercel.'), { status: 503 });
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': process.env.ANTHROPIC_VERSION || '2023-06-01' },
    body: JSON.stringify({ model, max_tokens, messages: [{ role: 'user', content: prompt }] })
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw Object.assign(new Error(data?.error?.message || `Claude returned ${response.status}`), { status: response.status >= 500 ? 502 : response.status });
  const text = data.content?.filter(block => block.type === 'text').map(block => block.text).join('\n').trim();
  if (!text) throw new Error('Claude returned no text.');
  return text;
}

async function handle(req, res, kind) {
  try {
    const topic = typeof req.body?.topic === 'string' ? req.body.topic.trim() : '';
    if (!topic || topic.length > 500) return res.status(400).json({ error: 'Provide a topic between 1 and 500 characters.' });
    const prompt = kind === 'script'
      ? `Write a compelling faceless YouTube script about: ${topic}. Use a strong hook, three evidence-based sections, and a concise conclusion. Target 700-900 words. Return plain text with headings and no markdown tables.`
      : `Create a production plan for a faceless YouTube video about: ${topic}. Return exactly five numbered scenes. For each scene include duration, narration goal, visual prompt, and on-screen text.`;
    res.json({ [kind]: await generate(prompt, kind === 'script' ? 2200 : 1600), model, provider: 'Claude' });
  } catch (error) { res.status(error.status || 502).json({ error: error.message || 'Claude generation failed.' }); }
}

app.post('/api/generate/script', (req, res) => handle(req, res, 'script'));
app.post('/api/generate/plan', (req, res) => handle(req, res, 'plan'));
app.get('/api/health', (_req, res) => res.json({ provider: 'Claude', configured: Boolean(process.env.ANTHROPIC_API_KEY), model }));
export default app;
