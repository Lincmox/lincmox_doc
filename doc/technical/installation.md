# Installation

This guide covers installing Lincmox on a Proxmox VE node hosting a LincStation N1.

## Prerequisites

### Hardware

| Requirement | Value |
|---|---|
| Device | LincPlus LincStation N1 |
| I2C controller address | `0x26` |
| Host OS | Proxmox VE (Debian Trixie, amd64) |

### Software

- Proxmox VE node with `root` access
- Linux I2C device nodes available (`/dev/i2c-*`)

## Install from the Debian repository

### Step 1 — Open the node shell

Log into the Proxmox node, either via SSH or the node shell in the web interface:

![Open node shell](../assets/img/install-step1.png)

### Step 2 — Add the GPG public key

```bash
curl -fsSL https://repo.lincmox.ovh/public.key | gpg --dearmor -o /usr/share/keyrings/lincmox.gpg
```

### Step 3 — Add the Debian repository

```bash
echo "deb [signed-by=/usr/share/keyrings/lincmox.gpg] https://repo.lincmox.ovh trixie main" \
    | tee /etc/apt/sources.list.d/lincmox.list
```

The Lincmox repository is now visible in the node's APT repositories:

![APT repositories](../assets/img/install-step3.png)

### Step 4 — Update the package list

```bash
apt update
```

### Step 5 — Install

```bash
# CLI only
apt install lincmox

# Daemon (includes the CLI)
apt install lincmoxd
```

## Installing the daemon with systemd

When installed from the APT package, `lincmoxd` ships a systemd unit:

```bash
systemctl enable --now lincmoxd
```

Check its status:

```bash
systemctl status lincmoxd
```

## Build from source

Requires **Go 1.22+**.

```bash
git clone https://gitea.stela.ovh/Lincmox/lincmox.git
cd lincmox
go build -o bin/lincmox  ./cmd/lincmox
go build -o bin/lincmoxd ./cmd/lincmoxd
```

## Verify the installation

```bash
lincmox status
```

If you just installed the CLI and the daemon is not running, `lincmox status` opens the
I2C device directly. If the daemon is running, it proxies through the Unix socket.

### Test your first commands

```bash
lincmox led power on white
lincmox strip animation breath
```

### Test without hardware

```bash
lincmox --simulate led power on white
lincmoxd --simulate
```

See [Simulation mode](simulation.md) for more.

## What to do if the bus is not found

If you get `I2C bus not found`, the I2C device at address `0x26` was not detected on
any bus. See the [Troubleshooting](troubleshooting.md) page for diagnosis and fixes.