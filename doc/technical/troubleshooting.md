# Troubleshooting

Common issues you may encounter when running Lincmox on a LincStation N1.

## `I2C bus not found`

The CLI/daemon probes `/dev/i2c-0` through `/dev/i2c-9` for a device acknowledging at
address `0x26`. If none responds, you get:

```
Error: failed to open device: lincstation: I2C bus not found
```

### 1. Check that I2C device nodes exist

```bash
ls /dev/i2c-*
```

If none exist, the I2C user-space API is missing. Load the kernel module and check again:

```bash
modprobe i2c-dev
```

### 2. Diagnose with i2cdetect

Install `i2c-tools` if needed, then scan each bus to find where the device lives:

```bash
apt install i2c-tools
i2cdetect -y 0
i2cdetect -y 1
# ...and so on
```

The LincStation controller appears at address `26`:

```
     0  1  2  3  4  5  6  7  8  9  a  b  c  d  e  f
20: -- -- -- -- -- -- 26 -- -- -- -- -- -- -- -- --
```

> **Note**: there may be several buses on the board; the controller can be on a non-obvious
> one (for example bus `4`).

### 3. Force the bus number

When you know which bus hosts the controller, force it explicitly:

```bash
lincmox --bus 4 led network on white
```

Combine with `--verbose` to confirm which bus is used:

```bash
lincmox --verbose --bus 4 led network on white
```

### 4. If auto-detection still fails

Auto-detection first performs a real `I2C_RDWR` write then falls back to an SMBus
send-byte (quick write) probe. If `i2cdetect` finds the device but Lincmox does not,
check that the `i2c-dev` module is loaded (`lsmod | grep i2c_dev`), and that you are
running the **latest** version of Lincmox, since bus detection has been improved over
time.

## `set slave address 0x26 on bus N: permission denied`

The user running Lincmox needs read/write access to the I2C device node:

```bash
ls -la /dev/i2c-4
```

Make sure the `lincmox` or `lincmoxd` process runs with `root` privileges, or that the
device node is readable/writable by the daemon user.

## The CLI seems unresponsive to direct commands

If the daemon is running, the CLI routes all commands through the Unix socket. If the
daemon is in simulation mode, your commands reach the mock bus — not the real LEDs.
Check which mode is active:

```bash
ls -la /run/lincmoxd.sock   # present = daemon mode
ps aux | grep lincmoxd      # is the daemon running? with which flags?
```

## LEDs work but the strip does not (or the opposite)

The individual LEDs and the LED strip use different register blocks. Try a full reset to
bring everything back to a known state:

```bash
lincmox reset full
```

Then re-apply your commands. If the problem persists, check the verbose output
(`--verbose`) to confirm which registers are written and that the controller ACKs them.