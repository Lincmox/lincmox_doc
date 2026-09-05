# Lincmox Docs — Specification

## Goal

Provide a documentation site with a **GitBook-like presentation** for the Lincmox
project, without relying on any documentation framework.

## Constraints

- Minimum possible dependencies on third-party libraries or frameworks.
- The core of the documentation is made of **Markdown files** stored in a `doc` folder.
- The documentation is split into two halves: **functional** and **technical**.
- The website rendering is a **shell** that simply interprets the Markdown documents and
  displays them in an HTML page.

## Features

### Header

- The documentation name on the left, with a logo.
- A button to toggle between **light** and **dark** mode on the right.
- A search bar to the left of the light/dark mode button.

### Nav bar

- At the top, a toggle to switch between the functional and the technical documentation.
- Below, the navigation entries to browse the documentation pages, with the ability to
  group documents into categories and subcategories.

### Main content

- The Markdown document rendered as HTML, with a table of contents on the right.

### Footer

- A note that the documentation is generated with the help of AI.

## Format

The site is a static single-page application built with **vanilla HTML/CSS/JS**:

```
├── index.html          # Single HTML shell (SPA)
├── config.json         # Site title, logo and navigation configuration
├── assets/
│   ├── app.js          # JS logic (routing, Markdown, search, TOC, theme)
│   ├── style.css       # Styles (light/dark, layout, Markdown)
│   └── logo.png        # Site logo
└── doc/
    ├── functional/     # Functional documentation
    └── technical/      # Technical documentation
```

## Serving

The site is static and can be served by any web server:

- Local: `python3 -m http.server 8000`
- Production: the provided `Dockerfile` (nginx) and `docker-compose.yml`
- CI: `.gitea/workflows/docker.yml` builds and pushes the image on main and tags