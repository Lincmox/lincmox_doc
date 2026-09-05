# Repositories

The Lincmox project is split into several independent repositories. Each one is a
separate Git repository, referenced by the Lincmox aggregator root.

| Repository | Description |
|---|---|
| `lincmox_go` | Main implementation — Go CLI, daemon, driver and Web UI |
| `lincmox_cli` | Legacy CLI implementation |
| `lincmox_driver` | Legacy Python I2C driver |
| `lincmox_doc` | This documentation site |
| `lincmox_repo` | APT package repository tooling |

## Hosting

The project is developed on a private Gitea instance and mirrored to GitHub:

- **Gitea**: `git@gitea.stela.ovh:222/Lincmox/` (git over SSH)
- **GitHub**: [Lincmox organization](https://github.com/Lincmox)

## Cloning the Go implementation

```bash
git clone https://gitea.stela.ovh/Lincmox/lincmox.git
# or over SSH
git clone ssh://git@gitea.stela.ovh:222/Lincmox/lincmox_go.git
```

## Project layout

The root repository aggregates the sub-projects as **git submodules**:

```
lincmox/                      # root aggregator
├── lincmox_go/               # Go implementation (CLI + daemon + driver)
├── lincmox_cli/              # legacy CLI
├── lincmox_doc/              # this documentation
├── lincmox_driver/           # legacy Python driver
└── lincmox_repo/             # APT repository
```

When a sub-project is updated, the root repository records the new commit SHA via a
`[CHORE]-Bump <project> to <sha>` commit.