# CreatorOS — YouTube automation MVP

A local-first creator workspace for turning one video idea into a production package.

## Included

- Dashboard and production metrics
- New project flow
- Content planner and calendar
- Prompt library
- Channel profile settings
- Ollama, Piper, and ComfyUI connection placeholders
- Responsive dark creator interface
- Browser-local project persistence
- No pricing, billing, or subscription plan

## Run it

Open `index.html` in a browser, or run:

```bash
python3 -m http.server 3000
```

Then open `http://localhost:3000`.

## Next integration seam

The UI currently runs in demo mode. Add a backend adapter later with endpoints such as `POST /api/generate/ideas`, `POST /api/generate/script`, `POST /api/generate/scenes`, and `POST /api/generate/voiceover`. These can call Ollama locally for text generation and Piper locally for speech; ComfyUI can be connected for image generation.
