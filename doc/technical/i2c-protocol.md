# I2C protocol & registers

This page documents the low-level I2C protocol used to talk to the LincStation
controller, useful for maintainers and for anyone extending Lincmox.

## Bus and device

| Property | Value |
|---|---|
| Interface | Linux I2C (SMBus ioctls) |
| Slave address | `0x26` |
| Bus selection | Auto-detected among `/dev/i2c-0` … `/dev/i2c-9`, or forced with `--bus <n>` |

## Access methods

Lincmox drives the controller with three Linux ioctls:

- `I2C_SLAVE` (`0x0703`) — set the slave address before any transaction
- `I2C_SMBUS` (`0x0720`) — single-byte register reads/writes (`I2C_SMBUS_BYTE_DATA`)
- `I2C_RDWR` (`0x0707`) — combined transactions during bus detection

Register access is a single-byte **SMBus write** of a register number followed by a
value byte, or a **read** of a given register.

## Bus auto-detection

`detectBus` scans every bus and:

1. sets the slave to `0x26` via `I2C_SLAVE`;
2. performs a real `I2C_RDWR` write of one byte — a START + address + data transaction
   that waits for the slave's ACK;
3. if that fails, falls back to a **SMBus send-byte (quick write)** probe, the same
   mechanism used by `i2cdetect`'s default mode. Some controllers only ACK a bare
   address byte with no data, so both probes are needed.

The first bus that ACKs wins. If no bus responds, `lincstation: I2C bus not found` is
returned. This "real transaction" approach avoids false positives from controllers that
ACK reads on an idle bus.

## LED registers

Individual LEDs use a shared pair of "on/off" registers together with a per-LED color
mask, plus a per-LED blink register.

### On / off registers

| Register | Meaning |
|---|---|
| `0xA0` | Power / SATA1 / SATA2 / Network LEDs on-state |
| `0xB0` | Power / SATA1 / SATA2 / Network LEDs off-state |
| `0xA1` | NVMe 1-4 LEDs on-state |
| `0xB1` | NVMe 1-4 LEDs off-state |

### Color masks

| Color | Power (0xA0/0xB0) | SATA1 (0xA0/0xB0) | SATA2 (0xA0/0xB0) | Network (0xA0/0xB0) |
|---|---|---|---|---|
| White | `0x01` | `0x04` | `0x10` | `0x40` |
| Red | `0x02` | `0x08` | `0x20` | `0x80` |
| Orange | `0x03` | `0x0C` | `0x30` | `0xC0` |

| Color | NVMe1 (0xA1/0xB1) | NVMe2 (0xA1/0xB1) | NVMe3 (0xA1/0xB1) | NVMe4 (0xA1/0xB1) |
|---|---|---|---|---|
| White | `0x01` | `0x04` | `0x10` | `0x40` |
| Red | `0x02` | `0x08` | `0x20` | `0x80` |
| Orange | `0x03` | `0x0C` | `0x30` | `0xC0` |

Turning a LED "on" writes the color mask to the on-state register; turning it "off"
writes to the off-state register.

### Blink registers

| LED | Register |
|---|---|
| Power | `0x50` |
| SATA 1 | `0x52` |
| SATA 2 | `0x54` |
| Network | `0x56` |
| NVMe 1 | `0x58` |
| NVMe 2 | `0x5A` |
| NVMe 3 | `0x5C` |
| NVMe 4 | `0x5E` |

Blink value: `0x01` = blink on, `0x00` = blink off.

## LED strip registers

| Register | Function |
|---|---|
| `0x90` | Animation mode (`0x00` off, `0x01` breath, `0x02` loop) |
| `0x91` | Brightness (`0x00`-`0xFF`) |
| `0x92` | Red channel (`0x00`-`0xFF`) |
| `0x93` | Green channel (`0x00`-`0xFF`) |
| `0x94` | Blue channel (`0x00`-`0xFF`) |
| `0x95` | Loop 1 red |
| `0x96` | Loop 1 green |
| `0x97` | Loop 1 blue |
| `0x98` | Loop 2 red |
| `0x99` | Loop 2 green |
| `0x9A` | Loop 2 blue |

## Example transactions

Set the power LED solid white (on):

```
SMBus write  register 0xA0  value 0x01
```

Turn the network LED off in red:

```
SMBus write  register 0xB0  value 0x80
```

Set the strip to a breathing animation at half brightness:

```
SMBus write  register 0x90  value 0x01
SMBus write  register 0x91  value 0x80
```

## Reverse engineering references

Lincmox's register map is indebted to community reverse engineering work:

- <https://github.com/tsew/lincstation_leds>
- <https://gist.github.com/aluevano/ca6431f4f15d8ea62df57e67df7d4c3d>
- <https://github.com/fazalmajid/lincstation_leds>