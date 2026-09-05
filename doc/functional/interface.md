# Command line interface

The `lincmox` CLI is the main way to control the LincStation LEDs from a terminal.

## How the CLI works

`lincmox` runs in one of two modes:

- **Direct I2C access** — when the daemon is not running, the CLI talks to the hardware directly.
- **Daemon proxy** — when `lincmoxd` is running, the CLI transparently sends requests through
  the daemon's Unix socket (`/run/lincmoxd.sock`). No configuration needed.

This means you never have to think about which mode you are in.

## Global flags

| Flag | Description |
|---|---|
| `--simulate` | Use a mock I2C backend (no hardware required) |
| `--verbose` | Enable verbose I2C logging (auto-detected bus, registers, hex values) |
| `--bus <n>` | Force the I2C bus number instead of auto-detecting (`-1` by default) |

## LED control

LEDs available: `power`, `sata 1`, `sata 2`, `nvme 1..4` and `network`.

```bash
# Turn a LED on or off
lincmox led power on white
lincmox led power off red

# Blink a LED
lincmox led network blink on
lincmox led network blink off

# Numered LEDs
lincmox led sata 1 on white
lincmox led nvme 4 on orange
```

Available colors: `white`, `red`, `orange`.

## LED strip

```bash
# Animations: off, breath, loop
lincmox strip animation breath

# Brightness (0-255)
lincmox strip brightness 128

# Solid color (R G B)
lincmox strip color 255 0 0

# Loop colors (used by the "loop" animation)
lincmox strip loop 1 color 0 255 0
lincmox strip loop 2 color 0 0 255
```

## Reset

```bash
lincmox reset full    # reset all LEDs and strip
lincmox reset leds    # reset LEDs only
lincmox reset strip   # reset strip only
```

## Status

```bash
lincmox status
```

## Verbose I2C debugging

`--verbose` logs the auto-detected bus, the target register, the hex values and the
result of every I2C transfer. This is very useful to understand what Lincmox sends to
the controller:

```bash
lincmox --verbose led network on white
```

## Forcing the I2C bus

By default the CLI probes `/dev/i2c-0` through `/dev/i2c-9` for a device at address
`0x26`. If auto-detection fails — for example because another I2C device is present on
the bus — you can force the bus number:

```bash
lincmox --bus 4 led network on white
lincmoxd --bus 4
```

Combine with `--verbose` to confirm which bus was used. See the
[troubleshooting](../technical/troubleshooting.md) page for more.

## Interactive help

Every command exposes its own help:

```bash
lincmox -h
lincmox led -h
lincmox strip -h
```

See the full [CLI reference](../technical/cli.md) for an exhaustive list of commands
and options.