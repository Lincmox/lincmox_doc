# REST API reference

Complete reference of the REST API exposed by the `lincmoxd` daemon (v2).

## Base URL

The API is served on two transports simultaneously:

- **Unix socket**: `http://lincmoxd` (via `/run/lincmoxd.sock`)
- **TCP**: `http://<host>:8080`

For curl over the Unix socket:

```bash
curl --unix-socket /run/lincmoxd.sock http://lincmoxd/api/v1/status
```

Over TCP:

```bash
curl http://<host>:8080/api/v1/status
```

All requests and responses are JSON (`Content-Type: application/json`).

## Endpoints overview

```
POST /api/v1/led/{family}/{id}/on        {"color": "..."}
POST /api/v1/led/{family}/{id}/off       {"color": "..."}
POST /api/v1/led/{family}/{id}/blink     {"blink": bool}
POST /api/v1/strip/animation             {"mode": "..."}
POST /api/v1/strip/brightness            {"value": int}
POST /api/v1/strip/color                 {"r": int, "g": int, "b": int}
POST /api/v1/strip/loop/{n}/color        {"r": int, "g": int, "b": int}
POST /api/v1/reset                       {"mode": "full|leds|strip"}
GET  /api/v1/state
GET  /api/v1/status
GET  /api/v1/monitors
POST /api/v1/monitors/network/enable     {"iface", "interval_ms", "threshold_bytes"}
POST /api/v1/monitors/network/disable
```

---

## LED control

### `POST /api/v1/led/power/on` — turn a LED on

Available families and IDs:

| Route | LED |
|---|---|
| `/api/v1/led/power/{action}` | Power LED |
| `/api/v1/led/sata/1/{action}` | SATA 1 LED |
| `/api/v1/led/sata/2/{action}` | SATA 2 LED |
| `/api/v1/led/nvme/1/{action}` | NVMe 1 LED |
| `/api/v1/led/nvme/2/{action}` | NVMe 2 LED |
| `/api/v1/led/nvme/3/{action}` | NVMe 3 LED |
| `/api/v1/led/nvme/4/{action}` | NVMe 4 LED |
| `/api/v1/led/network/{action}` | Network LED |

`{action}` is `on`, `off` or `blink`.

**Request** (`on`/`off`):

```json
{ "color": "white" }
```

Colors: `white`, `red`, `orange`.

**Request** (`blink`):

```json
{ "blink": true }
```

**Response**:

```json
{ "status": "ok" }
```

Example:

```bash
curl --unix-socket /run/lincmoxd.sock \
     -X POST http://lincmoxd/api/v1/led/network/on \
     -H 'Content-Type: application/json' \
     -d '{"color": "white"}'
```

> **Note**: `on`/`off` commands go through the LED controller, so they set a **30-second
> manual override** over automatic monitors. `blink` writes a one-shot blink state and
> does not set an override.

---

## Strip control

### `POST /api/v1/strip/animation`

```json
{ "mode": "breath" }
```

Valid modes: `off`, `breath`, `loop`.

### `POST /api/v1/strip/brightness`

```json
{ "value": 128 }
```

`value` must be in the range `0-255`.

### `POST /api/v1/strip/color`

```json
{ "r": 255, "g": 0, "b": 0 }
```

### `POST /api/v1/strip/loop/{n}/color` (`n` = `1` or `2`)

```json
{ "r": 0, "g": 255, "b": 0 }
```

---

## Reset

### `POST /api/v1/reset`

```json
{ "mode": "full" }
```

Valid modes: `full`, `leds`, `strip`.

---

## Status and State

### `GET /api/v1/state`

Returns the current state of all LEDs and the LED strip configuration.

```bash
curl --unix-socket /run/lincmoxd.sock http://lincmoxd/api/v1/state
```

```json
{
  "leds": {
    "network": {
      "color": "white",
      "state": "off"
    }
  },
  "strip": {
    "color": "#ff0000",
    "anim": "off",
    "brightness": 128,
    "loop1": "#00ff00",
    "loop2": "#0000ff"
  }
}
```

### `GET /api/v1/status`

Returns the daemon and device status:

```bash
curl --unix-socket /run/lincmoxd.sock http://lincmoxd/api/v1/status
```

```json
{
  "status": "ok",
  "device": "LincStation Device (I2C 0x26)",
  "monitors": {}
}
```

---

## Monitors

### `GET /api/v1/monitors`

Lists active monitors:

```json
{}
```

### `POST /api/v1/monitors/network/enable`

Starts the network activity monitor on the network LED.

**Request** (all fields optional):

```json
{ "iface": "eth0", "interval_ms": 500, "threshold_bytes": 1024 }
```

Defaults: interface `eth0`, interval `500 ms`, threshold `1024 bytes`.

**Response**:

```json
{ "status": "ok" }
```

### `POST /api/v1/monitors/network/disable`

Stops the network monitor:

```json
{ "status": "ok" }
```

---

## Error handling

On error the API returns a non-2xx status with a JSON body:

```json
{ "error": "message" }
```

| Status | Meaning |
|---|---|
| `400` | Malformed request (invalid JSON, unknown color/mode, invalid brightness) |
| `405` | Wrong HTTP method (GET on a POST route or vice-versa) |
| `500` | Internal I2C error while talking to the controller |

## Web UI

The same server also serves the embedded Web UI at `/`:

```
GET /
```

See the [Web UI guide](../functional/web-ui.md).