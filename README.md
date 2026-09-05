# Lincmox Docs

Static documentation website for the **Lincmox** project, in a GitBook/Docusaurus-like
style, built with **vanilla HTML/CSS/JS** — no framework, no build step.

## Run the documentation locally

```bash
python3 -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000) in your browser.

## Project structure

```
├── index.html          # Single HTML shell (SPA)
├── config.json         # Site title, logo and navigation configuration
├── assets/
│   ├── app.js          # JS logic (routing, Markdown, search, TOC, theme)
│   ├── style.css       # Styles (light/dark, layout, Markdown, pagination)
│   ├── logo.png        # Site logo
│   └── img/            # Screenshots and figures used by the docs
├── doc/
│   ├── home.md         # Landing page (shown on #/)
│   ├── functional/     # Functional documentation (user guide)
│   └── technical/      # Technical documentation (reference)
```

The content lives entirely in **Markdown** files under `doc/`. The navigation is driven
by `config.json`. There is no build step: the `index.html` shell fetches the Markdown
files and renders them client-side with `marked.js`.

## Features

- **Landing page** at `#/` (served by `doc/home.md`)
- **Previous / Next** navigation buttons at the bottom of each page
- **Full-text search** over all pages
- **Light / Dark** theme toggle (persisted in `localStorage`)
- **Auto-generated table of contents**, syntax highlighting (`Prism.js`) and
  **Mermaid** diagram rendering

## Run with Docker

```bash
docker compose up -d
# or
docker build -t lincmox/docs:0.1.1 .
docker run -p 8080:80 lincmox/docs
```

Then open [http://localhost:8080](http://localhost:8080).

## Editing content

1. Edit or add a Markdown file under `doc/functional/` or `doc/technical/`.
2. If you added a new page, reference it in `config.json` under the matching
   `nav.functional` or `nav.technical` category.

### Writing rules

- All content is written in English.
- Link between pages with relative Markdown paths, e.g. `[CLI](interface.md)` —
  the viewer resolves them automatically. Absolute fallbacks `../technical/api.md`
  also work.
- Place images under `assets/img/` and reference them as `../assets/img/<name>`.
- Code blocks can be annotated with a language for syntax highlighting, and the
  `mermaid` language renders Mermaid diagrams.