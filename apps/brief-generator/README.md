# SD Standard Brief Generator

The primary Netlify site renders `apps/calculator/client/src/pages/BriefGenerator.tsx`.
The standalone Vite app renders `src/App.tsx`. Both use the same entry parser,
React state hook, brief selection engine, and translation catalog.

## Installation QR entry points

Both `/brief-generator` and `/brief-generator/` accept:

- `pillar=environment|society|culture|finance`
- `lang=es|en`

Parameters are validated independently. A missing or invalid pillar retains the
original values: environment 62, society 55, culture 48, finance 52. A missing or
invalid language uses English. Spanish uses Medioambiente, Sociedad, Cultura,
and Economía; the document language is `es-MX`.

A valid pillar starts at **90**, with **50** for each of the other three pillars.
These are independent priorities, not percentages of a total. URL parsing and
random initial selection happen together before the first React render.

The existing scoring formula ranks seeds whose primary pillar matches the
current highest slider. It uses supporting priorities to rank those seeds and
randomly selects among the best eight. The previous seed is excluded when
generating another brief if alternatives exist. Slider edits immediately affect
generation; the original URL does not lock or reset the priorities. Refreshing
starts a new random brief using the URL priorities.

`src/data/briefs.es.ts` translates all 43 seeds, including titles, project types,
descriptions, and tags. `src/lib/localization.ts` covers interface copy,
archetypes, warnings, and every criterion label used by the generator. Internal
pillar keys and criterion IDs remain unchanged. Criterion references still use
the standard's existing legacy-ID-first lookup and current display IDs.
The surrounding navigation and footer also appear in Spanish on Spanish
generator pages. English-only CMS announcements are omitted on those pages.

## Stable printed URLs

The production origin configured in this repository is `https://sdstandard.org`.
Encode the short URLs, so their destinations can change without reprinting:

| Printed QR URL | Destination |
| --- | --- |
| https://sdstandard.org/b/e | /brief-generator?pillar=environment&lang=es |
| https://sdstandard.org/b/s | /brief-generator?pillar=society&lang=es |
| https://sdstandard.org/b/c | /brief-generator?pillar=culture&lang=es |
| https://sdstandard.org/b/f | /brief-generator?pillar=finance&lang=es |

`apps/calculator/client/public/_redirects` is the existing Netlify redirect file.
The primary build copies it to `apps/calculator/dist/public/_redirects`, the
publish directory specified by `netlify.toml`. The eight explicit QR rules use
302 redirects, cover trailing slashes, and precede the SPA fallback. Existing
Knowledge Base aliases remain unchanged. The alternative `build:site` pipeline
also reuses these aliases in its generated redirect file.

## Validation

Run from the repository root:

```sh
npm run test:brief-generator -w apps/calculator
npm run check -w apps/calculator
npm run build -w apps/brief-generator
npm run lint -w apps/brief-generator
npm run build
npm run dev:app
```

Local validation on 2026-09-01:

- Six regression tests pass: parameters/defaults, varied pillar-specific output,
  no consecutive repeats, editable priorities, all 43 translations, criterion
  resolution, every warning branch, and exact redirect rules/ordering.
- Primary production build (including Knowledge Base), standalone production
  build, and calculator TypeScript check pass.
- Browser checks on localhost pass for all four full URLs, both slash variants,
  initial Spanish output, regeneration, and refresh. Missing/invalid parameters
  and explicit English also pass. Mobile testing at a 390px viewport confirms
  editable sliders, retained language, Spanish navigation, and no overflowing
  generator elements.
- The installed lint command fails before linting because ESLint cannot resolve
  the `zod-validation-error/v4` package export. No lint success is claimed.
- The built Netlify redirect file contains the expected rules, but **HTTP 302
  behavior is not verified on Netlify preview or live**. Vite/Express development
  servers do not implement Netlify redirects. No deployment was performed.

Before printing for a deployed installation, verify each short URL and slash
variant on a Netlify preview: status 302, exact Location with both parameters,
successful destination load/refresh, and unchanged Knowledge Base aliases.
