# Bramo AI — local YouTube automation website

Bramo AI is a browser-based website for turning one YouTube idea into a production package. This version is intentionally local-first: the website runs in your browser while Ollama and Piper run on your computer.

## Included

- Dashboard and production metrics
- New project flow
- Content planner and calendar
- Prompt library
- Channel profile settings
- Ollama script generation
- Ollama scene and visual-plan generation
- Piper local voiceover generation
- Responsive dark creator website
- Browser-local project persistence
- No pricing, billing, or subscription plan

## Start the local website

Requirements:

- Node.js 18 or newer
- Ollama installed and running
- Piper installed and available as `piper` in your PATH

Run:

```bash
npm install
ollama pull llama3.2
npm start
```

Open the website in your browser:

```text
http://localhost:3000
```

The backend serves the website and provides these local routes:

```text
GET  /api/health
POST /api/generate/script
POST /api/generate/plan
POST /api/generate/voiceover
```

## Configuration

Copy `.env.example` to `.env` to change the port, Ollama URL, Ollama model, or Piper command:

```bash
cp .env.example .env
```

If Ollama is unavailable, the website still loads, but generation controls will report that the local AI service is unavailable. If Piper is unavailable, script and planning features still work while voiceover reports the setup problem.

## Local-only scope

This release does not include public hosting, user accounts, cloud storage, billing, YouTube publishing, or a full video editor. Projects are saved in the browser's local storage. Those are separate upgrades for a later hosted release.
