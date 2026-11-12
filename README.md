# Bramo AI — YouTube automation website

Bramo AI is a browser-based website for turning one YouTube idea into a production package.

## Included

- Dashboard and production metrics
- New project flow
- Content planner and calendar
- Prompt library
- Channel profile settings
- Ollama script and scene-plan generation
- Piper local voiceover generation
- Responsive dark creator website
- Browser-local project persistence
- No pricing, billing, or subscription plan

## Run the website locally

Install the backend dependencies and start the website server:

```bash
npm install
npm start
```

Then open `http://localhost:3000` in your browser.

Copy `.env.example` to `.env` if you want to customize the local Ollama or Piper configuration. Ollama and Piper must be installed on the machine running the website backend.
