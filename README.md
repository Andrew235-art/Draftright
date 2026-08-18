# Draftright

Draftright is a web app that turns a few structured facts into a polished, ready-to-send email draft. Pick a scenario (salary negotiation, resignation letter, cover letter, newsletter, etc.), fill in a short form, choose a tone, and get a properly formatted draft you can copy and send.

## Features

- **13 scenario templates** covering career, workplace, and marketing emails — salary negotiation, project updates, feedback requests, resignation letters, cover letters, promotional emails, newsletters, and more.
- **Structured input, not a blank page** — each scenario has its own form with the specific fields that draft needs, validated before it's sent for generation.
- **Tone control** — formal, friendly, direct, or humble.
- **Multilingual** — English, Spanish, and French, with the site language auto-detected from the browser and switchable at any time.
- **Light/dark theme**, persisted across sessions.
- **Editable output** with one-click copy to clipboard.

## Tech stack

- [Next.js 15](https://nextjs.org/) (App Router) + React 18 + TypeScript
- [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) (Radix primitives)
- [Genkit](https://genkit.dev/) + [Gemini](https://ai.google.dev/) for draft generation
- [react-hook-form](https://react-hook-form.com/) + [Zod](https://zod.dev/) for form state and validation
- Deployed on [Firebase App Hosting](https://firebase.google.com/docs/app-hosting)

## Getting started

### Prerequisites

- Node.js 20+
- A [Gemini API key](https://aistudio.google.com/apikey) — draft generation calls the Gemini API and will not work without one.

### Setup

```bash
npm install
cp .env.example .env.local
# then edit .env.local and set GEMINI_API_KEY
```

### Run locally

```bash
npm run dev
```

The app runs at [http://localhost:9002](http://localhost:9002).

### Other scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js dev server (port 9002) |
| `npm run build` | Production build |
| `npm start` | Run the production build |
| `npm run typecheck` | Type-check the project |
| `npm run lint` | Lint the project |
| `npm run genkit:dev` | Start the Genkit developer UI, for inspecting/debugging the draft-generation flow directly |

## Project structure

```
src/
  ai/
    genkit.ts               # Genkit + Gemini model configuration
    flows/
      generate-email-draft.ts   # The draft-generation flow and prompt
  app/
    [lang]/                 # Locale-scoped routes (en/es/fr)
      page.tsx               # Home page
      privacy/, terms-of-use/
    actions.ts               # Server action that validates input and invokes the flow
  components/
    draft-form.tsx           # Scenario selection -> form -> result, the core UI flow
    output-display.tsx       # Draft output + copy-to-clipboard
    how-it-works.tsx
    ui/                      # shadcn/ui components
  lib/
    scenarios.ts              # Scenario definitions: fields, Zod schemas, icons
  dictionaries/               # en.json / es.json / fr.json translation strings
  middleware.ts                # Locale detection and redirect
```

## Deployment

This project deploys to Firebase App Hosting. `apphosting.yaml` configures the backend, including wiring `GEMINI_API_KEY` from Firebase Secret Manager. Before deploying, create the secret once and grant the backend access to it:

```bash
firebase apphosting:secrets:set GEMINI_API_KEY
firebase apphosting:secrets:grantaccess GEMINI_API_KEY --backend=<your-backend-id>
```

## Known limitations

- No accounts or draft history — drafts are not saved and are lost on refresh.
- No rate limiting on draft generation yet — see open issues before relying on this in a public, high-traffic deployment.
- No automated test suite or CI pipeline yet.
