# Changelog

This page lists the notable changes for each release of Lincmox.

## v2.0.0 (2026-09-05)

> **Major release — full rewrite in Go.**

The entire Lincmox toolchain has been rewritten from Python to Go:

- **New `lincmox` CLI** (replaces the legacy Python `lincmox-cli`)
- **New `lincmoxd` daemon** with a built-in Web UI and REST API
- Substantially improved startup time and reduced memory footprint
- Single statically-linked binary packaging
- Automatic LED monitors with a 30-second manual override TTL
- Simulation mode for testing without physical hardware

### Breaking changes

- The legacy Python packages (`lincmox-cli`, `python3-lincmox-driver`) are replaced by
  the Go packages (`lincmox`, `lincmoxd`)
- The REST API exposed by `lincmoxd` has been redesigned (see the
  [REST API reference](api.md))
- Review the [upgrading](upgrading.md) guide before upgrading across a major version

## v1.0.0 (2025-12-25)

> **Python implementation (original release).**

The initial version of Lincmox, implemented in Python:

- **`lincmox-cli`** — the command-line interface to control the LincStation
- **`python3-lincmox-driver`** — the Python I2C driver for the LincStation hardware
- I2C protocol support for reading sensors and controlling the LED display and fans
- Manual control of the LincStation via CLI commands

> **Note**: This release is superseded by [v2.0.0](#v200), the Go rewrite. The Python
> packages remain available in the repository for backward compatibility.
