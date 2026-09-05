# Simulation mode

Lincmox can run entirely without hardware, using a **mock I2C backend**. This is
invaluable for testing, development and demos.

## Enabling simulation

### CLI

```bash
lincmox --simulate led power on white
lincmox --simulate strip color 255 0 0
lincmox --simulate status
```

### Via the development environment variable

Setting `LINCMOX_ENV=dev` also makes **both** the CLI and the daemon enable simulation,
matching the historical development workflow:

```bash
export LINCMOX_ENV=dev
lincmox led power on white
lincmoxd
```

### Daemon

```bash
lincmoxd --simulate
# or
LINCMOX_ENV=dev lincmoxd
```

## What the mock backend does

The mock bus keeps the register map **in memory** and persists it to
`/tmp/lincstation_mock_registers.json`, so you can inspect the state written by commands
and even share it between runs.

Commands behave identically to real hardware — the same validation applies (LED names,
colors, animations, brightness range `0-255`, loop numbers `1-2`).

## Example session

```bash
$ lincmox --simulate led power on white     # no output, success
$ lincmox --simulate led sata 1 blink on    # no output, success
$ lincmox --simulate strip loop 2 color 0 0 255  # no output, success
```

## Using simulation with the CLI in daemon mode

If `lincmoxd` is running with `--simulate`, the CLI detects the Unix socket and proxies
to the daemon as usual — no need to pass `--simulate` to every CLI command for it to
reach the mock bus.