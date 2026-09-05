# Web UI

The `lincmoxd` daemon serves an embedded Web UI at the root of its HTTP server.

## Access

Once the daemon is installed and running (see [Getting started](getting-started.md)):

```
http://<your-lincstation-ip>:8080
```

## Current state

The embedded Web UI is **minimal and still in progress**. For now it:

- Displays the Lincmox logo and a short welcome message
- Links to the REST API and the CLI

The full control surface is already available through the [REST API](../technical/api.md)
and the [command line interface](interface.md), which are both complete:

```bash
# Controls that work today
lincmox led power on white
lincmox strip animation breath

# Or via HTTP
curl -X POST http://<host>:8080/api/v1/led/power/on \
     -H 'Content-Type: application/json' \
     -d '{"color": "white"}'
```

## Health check

The Web UI shares the server with the API, so a simple health check is:

```
http://<your-lincstation-ip>:8080/api/v1/status
```

See the [REST API reference](../technical/api.md) for all available endpoints.