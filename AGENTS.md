# Lincmox Docs — AGENTS

## Language

- In chat, respond in **French**.
- In project files, use **English** (including comments and the README).

## Git commits

- Never create a commit unless explicitly requested.
- Commit on the current branch; never switch branches.
- Commit messages must follow the prefix convention:
  - Feature → `[FEAT]-`
  - Fix → `[FIX]-`
  - Chore → `[CHORE]-`
  - Documentation → `[DOC]-`
  - For any other prefix, ask before committing.
- Commit messages must be written in English (body and subject).

## Documentation content

- All documentation pages (`doc/`) are written in English.
- The documentation is a static site: content in `doc/**/*.md`, navigation in
  `config.json`, no build step required.