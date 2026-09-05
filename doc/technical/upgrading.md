# Upgrading

## In the Proxmox GUI

1. Log in with `root`
2. Refresh the package updates
3. Upgrade the packages

## In a terminal

### Step 1 — Update the package list

```bash
apt update
```

### Step 2 — Upgrade Lincmox

```bash
apt upgrade
```

Or upgrade only Lincmox packages:

```bash
apt install --only-upgrade lincmox lincmoxd
```

### Step 3 — Restart the daemon (if installed)

```bash
systemctl restart lincmoxd
```

## Release channels

Lincmox uses **Semantic Versioning** with release tags:

- `v2.x.x` — stable releases (main channel)
- `v2.x.x-rcN` — release candidates (testing channel)

> **Note**: Before upgrading across a major version, review the changelog shipped with
> the package (`/usr/share/doc/lincmox/changelog.gz`) for any breaking changes or
> configuration migration steps.