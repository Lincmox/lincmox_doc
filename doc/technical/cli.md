# CLI reference

Complete reference of the `lincmox` command line interface.

![lincmox --help](../assets/img/cli-help.png)

## Global flags

Available on every command:

| Flag | Default | Description |
|---|---|---|
| `--bus <n>` | `-1` (auto-detect) | Force the I2C bus number to use |
| `--simulate` | `false` | Simulate hardware commands (no real I/O) |
| `--verbose` | `false` | Enable verbose I2C logging |
| `-h, --help` | — | Show help for the command |

## Commands overview

```
lincmox
├── led
│   ├── power     <on|off|blink> ...
│   ├── sata <1|2>   <on|off|blink> ...
│   ├── nvme <1..4>  <on|off|blink> ...
│   └── network   <on|off|blink> ...
├── strip
│   ├── animation <off|breath|loop>
│   ├── brightness <0-255>
│   ├── color <r> <g> <b>
│   └── loop <1|2> color <r> <g> <b>
├── reset <full|leds|strip>
└── status
```

## `lincmox led`

Control individual LEDs. Available LED families:

| Family | IDs |
|---|---|
| `power` | — |
| `sata` | `1`, `2` |
| `nvme` | `1`, `2`, `3`, `4` |
| `network` | — |

### `led power on <color>` / `led power off <color>`

```bash
lincmox led power on white
lincmox led power off red
```

### `led power blink <on|off>`

```bash
lincmox led power blink on
lincmox led power blink off
```

The same subcommands exist for `sata <1|2>`, `nvme <1..4>` and `network`:

```bash
lincmox led sata 1 on white
lincmox led sata 2 off red
lincmox led nvme 3 blink on
lincmox led network on white
lincmox led network blink on
```

**Colors**: `white`, `red`, `orange`.

## `lincmox strip`

Control the front LED strip.

### `strip animation <off|breath|loop>`

```bash
lincmox strip animation off
lincmox strip animation breath
lincmox strip animation loop
```

### `strip brightness <0-255>`

```bash
lincmox strip brightness 128
```

### `strip color <r> <g> <b>`

Each channel is in the range `0-255`:

```bash
lincmox strip color 255 0 0     # red
lincmox strip color 0 255 0     # green
lincmox strip color 0 0 255     # blue
```

### `strip loop <1|2> color <r> <g> <b>`

Sets the colors used by the `loop` animation:

```bash
lincmox strip loop 1 color 0 255 0
lincmox strip loop 2 color 0 0 255
```

## `lincmox reset`

| Argument | Scope |
|---|---|
| `full` | Reset both LEDs and strip |
| `leds` | Reset LEDs only |
| `strip` | Reset strip only |

```bash
lincmox reset full
```

## `lincmox status`

Display the current device status:

```bash
lincmox status
```

## Examples

```bash
# Turn the power LED on in white
lincmox led power on white

# Make the network LED blink
lincmox led network blink on

# Set a breathing animation, then a solid green
lincmox strip animation breath
lincmox strip color 0 255 0

# Everything with verbose I2C debugging on a forced bus
lincmox --verbose --bus 4 strip animation loop
```

See also the [functional CLI guide](../functional/interface.md) for everyday usage.