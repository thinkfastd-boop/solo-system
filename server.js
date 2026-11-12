import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = Number(process.env.PORT || 3000);
const ollamaUrl = (process.env.OLLAMA_URL || 'http://127.0.0.1:11434').replace(/\/$/, '');
const ollamaModel = process.env.OLLAMA_MODEL || 'llama3.2';
const piperCommand = process.env.PIPER_COMMAND || 'piper';

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.static(__dirname));

function requireTopic(req, res) {
  const topic = typeof req.body?.topic === 'string' ? req.body.topic.trim() : '';
  if (!topic || topic.length > 500) {
    res.status(400).json({ error: 'Provide a topic between 1 and 500 characters.' });
    return null;
  }
  return topic;
}

async function ollamaGenerate(prompt) {
  const response = await fetch(`${ollamaUrl}/api/generate`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ model: ollamaModel, prompt, stream: false })
  });
  if (!response.ok) throw new Error(`Ollama returned ${response.status}`);
  const data = await response.json();
  if (!data.response) throw new Error('Ollama returned no text.');
  return data.response.trim();
}

app.post('/api/generate/script', async (req, res) => {
  const topic = requireTopic(req, res);
  if (!topic) return;
  try {
    const script = await ollamaGenerate(`Write a compelling faceless YouTube script about: ${topic}. Use a clear hook, three evidence-based sections, and a concise conclusion. Target 700-900 words. Return plain text with headings, no markdown tables.`);
    res.json({ script, model: ollamaModel });
  } catch (error) {
    res.status(502).json({ error: 'Could not reach Ollama. Start Ollama and confirm the selected model is installed.', detail: error.message });
  }
});

app.post('/api/generate/plan', async (req, res) => {
  const topic = requireTopic(req, res);
  if (!topic) return;
  try {
    const plan = await ollamaGenerate(`Create a production plan for a faceless YouTube video about: ${topic}. Return exactly five numbered scenes. For each scene include duration, narration goal, visual prompt, and on-screen text.`);
    res.json({ plan, model: ollamaModel });
  } catch (error) {
    res.status(502).json({ error: 'Could not reach Ollama. Start Ollama and confirm the selected model is installed.', detail: error.message });
  }
});

app.post('/api/generate/voiceover', (req, res) => {
  const text = typeof req.body?.text === 'string' ? req.body.text.trim() : '';
  if (!text || text.length > 20000) return res.status(400).json({ error: 'Provide text between 1 and 20,000 characters.' });
  const child = spawn(piperCommand, ['--output_file', '-'], { stdio: ['pipe', 'pipe', 'pipe'] });
  const chunks = [];
  let errorText = '';
  child.stdout.on('data', chunk => chunks.push(chunk));
  child.stderr.on('data', chunk => { errorText += chunk.toString(); });
  child.on('error', error => res.status(502).json({ error: 'Piper is not available. Install Piper and add it to your PATH.', detail: error.message }));
  child.on('close', code => {
    if (code !== 0) return res.status(502).json({ error: 'Piper could not generate audio.', detail: errorText.trim() });
    res.set('content-type', 'audio/wav').send(Buffer.concat(chunks));
  });
  child.stdin.end(text);
});

app.get('/api/health', async (_req, res) => {
  try {
    const response = await fetch(`${ollamaUrl}/api/tags`);
    res.json({ ollama: response.ok, model: ollamaModel, piper: piperCommand });
  } catch {
    res.json({ ollama: false, model: ollamaModel, piper: piperCommand });
  }
});

app.listen(port, () => console.log(`CreatorOS running at http://localhost:${port}`));
