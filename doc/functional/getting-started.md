# Getting started

This guide gets you up and running with Lincmox in a few minutes.

## Prerequisites

- A **LincStation N1** with **Proxmox VE** installed (see the [hardware page](hardware.md))
- An account with `root` access (Proxmox node shell or SSH)
- The I2C device nodes available (`/dev/i2c-*`)

## Step 1 — Install Lincmox

Open the Proxmox node shell and install the CLI from the Lincmox APT repository:

```bash
curl -fsSL https://repo.lincmox.ovh/public.key | gpg --dearmor -o /usr/share/keyrings/lincmox.gpg
echo "deb [signed-by=/usr/share/keyrings/lincmox.gpg] https://repo.lincmox.ovh trixie main" \
    | tee /etc/apt/sources.list.d/lincmox.list
apt update

# Command line interface only
apt install lincmox

# Or the daemon (includes the CLI)
apt install lincmoxd
```

See the full [installation guide](../technical/installation.md) for details.

## Step 2 — Turn a LED on

```bash
lincmox led power on white
```

You should see the power LED light up in white. Available colors are `white`, `red`
and `orange`.

## Step 3 — Play with the LED strip

```bash
# Breath animation
lincmox strip animation breath

# Solid green color
lincmox strip color 0 255 0

# Brightness at 50%
lincmox strip brightness 128
```

## Step 4 — Start the daemon (optional)

To get the Web UI, the REST API and the automatic monitors, install and start the daemon:

```bash
systemctl enable --now lincmoxd
```

Once the daemon is running, every `lincmox` command is **automatically routed** through
it via the Unix socket — no configuration required. You can now open the Web UI at:

```
http://<your-lincstation-ip>:8080
```

## Step 5 — Test without hardware (optional)

Lincmox ships a **simulation mode** that uses a mock I2C backend, so you can try every
command without a LincStation:

```bash
lincmox --simulate led power on white
lincmox --simulate strip color 255 0 0

# Or set LINCMOX_ENV=dev — the daemon automatically enables simulation too
LINCMOX_ENV=dev lincmox led power on white
```

See [Simulation mode](../technical/simulation.md) for more.

## What's next?

- Discover all commands in the [Command line interface](interface.md) guide
- Explore the [automatic monitors](monitors.md)
- Browse the [CLI reference](../technical/cli.md) or the [REST API reference](../technical/api.md)