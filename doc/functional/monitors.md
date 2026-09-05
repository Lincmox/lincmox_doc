# Automatic monitors

Monitors are background goroutines inside `lincmoxd` that drive LEDs automatically based
on system activity.

## How it works

| Monitor | Source | LED | Description |
|---|---|---|---|
| `network` | `/sys/class/net/<iface>/statistics/` | Network LED | Blinks when traffic exceeds a threshold |
| `disk` | `/sys/block/<dev>/stat` | SATA / NVMe LEDs | *Coming soon* |

## Priority and manual override

Manual commands from the **CLI** or the **API** take precedence over automatic monitors.

Once a LED is controlled manually, the override lasts for **30 seconds**, after which
monitors regain control automatically. This gives you a responsive way to signal an
issue or show a custom state without fighting the monitors.

## Managing monitors via the API

Monitors are managed through the REST API:

```bash
# List active monitors
curl --unix-socket /run/lincmoxd.sock http://lincmoxd/api/v1/monitors

# Enable the network monitor on eth0 (500 ms interval, 1024 bytes threshold)
curl --unix-socket /run/lincmoxd.sock \
     -X POST http://lincmoxd/api/v1/monitors/network/enable \
     -H 'Content-Type: application/json' \
     -d '{"iface": "eth0", "interval_ms": 500, "threshold_bytes": 1024}'

# Disable the network monitor
curl --unix-socket /run/lincmoxd.sock \
     -X POST http://lincmoxd/api/v1/monitors/network/disable
```

The same requests work over TCP on port `8080`:

```bash
curl -X POST http://<host>:8080/api/v1/monitors/network/enable \
     -H 'Content-Type: application/json' \
     -d '{"iface": "eth0"}'
```

All parameters are optional and use sensible defaults (`eth0`, 500 ms, 1024 bytes).

See the [REST API reference](../technical/api.md) for the exact request and response
formats.