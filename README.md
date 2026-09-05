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

## CI/CD — Docker deployment

The Docker image is built and pushed automatically by **Gitea Actions**
(`.gitea/workflows/docker.yml`). No build step is required for the site itself
(the Markdown content is rendered client-side), the pipeline only packages the
static site into an nginx image and publishes it.

### Workflow triggers

| Event | Image version tag | `latest` also pushed? |
|---|---|---|
| push on `develop` | `nightly` | no |
| tag push — **any tag** (e.g. `v2.0.0`, `1.2.3`, `2026.09`) | the tag name, without any `v` prefix stripping | yes |

> Tags are used verbatim as the image version. There is **no `v` prefix requirement**:
> `v2.0.0` → tag `v2.0.0`; `1.2.3` → tag `1.2.3`. Pushing a tag always also pushes a
> `latest` tag; pushing to `develop` only pushes `nightly`.

### What the workflow does

1. **Checkout** the repository.
2. **Calculate the image version** (`id: tag`): if the ref is a tag,
   `version=<tag name>` and `is_tag=true`; otherwise `version=nightly` and `is_tag=false`.
3. **Build the image name** (`id: image`): Gitea registry image is built from
   `${{ vars.REGISTRY_DOMAIN }}/${{ gitea.repository_owner }}/documentation`
   (lowercased), GHCR image is `ghcr.io/lincmox/documentation`.
4. **Assemble the tags** (`id: imagetags`):
   - tag push → `<image>:<tag>` + `:latest` on both registries.
   - develop push → only `<image>:nightly`.
5. **Set up QEMU + Docker Buildx** for multi-architecture builds.
6. **Login** to the Gitea Container Registry (actor + `ACCESS_TOKEN`) and to
   GitHub Container Registry (`GHCR_USERNAME` + `GHCR_TOKEN`).
7. **Build and push** with `docker/build-push-action@v6`, multi-platform
   (`linux/amd64`, `linux/arm64`), tags from step 4.

### Output

A multi-architecture image (`linux/amd64`, `linux/arm64`) is pushed to **two registries**:

| Registry | Image |
|---|---|
| Gitea Container Registry | `${{ vars.REGISTRY_DOMAIN }}/<owner>/documentation:<tag>` |
| GitHub Container Registry (GHCR) | `ghcr.io/lincmox/documentation:<tag>` |

Both pushes use the same tags (`nightly` on `develop`, `latest` + version on tag), so the
documentation can be pulled from either registry.

### Required variables & secrets

| Kind | Name | Purpose |
|---|---|---|
| Variable | `REGISTRY_DOMAIN` | Gitea registry domain used to compose the Gitea image name |
| Secret | `ACCESS_TOKEN` | Gitea access token for the Gitea registry login |
| Secret | `GHCR_USERNAME` | GitHub user/organization for `ghcr.io` |
| Secret | `GHCR_TOKEN` | GitHub token (write:packages) for `ghcr.io` |

### How the image is built (`Dockerfile`)

```dockerfile
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf     # SPA + caching + security headers
COPY index.html /usr/share/nginx/html/
COPY config.json /usr/share/nginx/html/
COPY assets/ /usr/share/nginx/html/assets/
COPY doc/ /usr/share/nginx/html/doc/
EXPOSE 80
```

The static site (HTML shell + assets + Markdown `doc/`) is served by nginx on port 80.

### Deploying the docs

```bash
# From GHCR
docker pull ghcr.io/lincmox/documentation:latest
docker run -p 8080:80 ghcr.io/lincmox/documentation

# Or from the Gitea registry
docker pull <REGISTRY_DOMAIN>/<owner>/documentation:latest
```

To deploy with the bundled compose file:

```bash
docker compose up -d
```

> Note: `docker-compose.yml` pins a local `lincmox/docs:0.1.1` build for development;
> for production it is generally replaced by pulling the `latest` image from a registry.

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