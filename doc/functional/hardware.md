# LincStation N1 hardware

![LincPlus LincStation N1](../assets/img/lincstation-n1.webp)

The **LincPlus LincStation N1** is a compact network-attached storage appliance. It is
the reference (and currently the only supported) hardware for Lincmox.

## LEDs

The LincStation N1 exposes the following LEDs, all managed by Lincmox:

| Family | Count | Names |
|---|---|---|
| Power | 1 | `power` |
| SATA | 2 | `sata 1`, `sata 2` |
| NVMe | 4 | `nvme 1` ... `nvme 4` |
| Network | 1 | `network` |

Each LED supports the colors `white`, `red` and `orange`, and can blink independently.

## Front LED strip

The front of the device also hosts an **LED strip** that can display:

- Animations: `off`, `breath`, `loop`
- Solid colors (RGB, 0-255 per channel)
- Two loop colors used by the `loop` animation

## I2C controller

The LEDs and the strip are driven by a proprietary **I2C controller**:

- **I2C address**: `0x26`
- **Host interface**: Linux I2C device nodes (`/dev/i2c-*`)
- **Host OS**: Proxmox VE (Debian Trixie, amd64)

Lincmox communicates with this controller through the SMBus/`I2C_RDWR` ioctls. For the
register-level details, see [I2C protocol & registers](../technical/i2c-protocol.md).

## More information

- [LincPlus website](https://www.lincplustech.com/)
- [Proxmox VE](https://www.proxmox.com/en/products/proxmox-virtual-environment/overview)