# BestFit Application Studio

This project has been upgraded from static HTML to a Next.js app with an API route.

## Run Locally

On this machine, use the bundled Codex Node runtime:

```bash
cd /Users/charlieee/Documents/找工/jobfit-mvp
/Users/charlieee/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node node_modules/next/dist/bin/next dev --port 3000
```

Open:

```text
http://localhost:3000
```

## API Route

The first backend endpoint is:

```text
POST /api/job-focus
```

Example body:

```json
{
  "url": "https://example.com/careers/finance-analyst"
}
```

The route tries to fetch the job page, clean the HTML into text, and infer focus skills. If the job board blocks server-side fetching or requires login, it returns a link-based fallback message.

## Current Important Files

- `app/page.jsx`: Next.js page shell.
- `app/api/job-focus/route.js`: backend job-link analysis API.
- `public/legacy-app.js`: current front-end interaction logic.
- `styles.css`: global UI and resume template styling.

## Next Product Step

Replace the rules-based focus extraction in `/api/job-focus` with an AI extraction step after the page text is fetched.
