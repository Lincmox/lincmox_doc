# Welcome to Lincmox

**Lincmox** is an open-source project that brings full control of the status LEDs and front LED strip of the [**LincPlus LincStation N1**](https://www.lincplustech.com/fr-fr/products/lincstation-n1-network-attached-storage) when the machine runs [**Proxmox VE**](https://www.proxmox.com/en/products/proxmox-virtual-environment/overview).

## What is Lincmox?

When Proxmox VE is installed on a LincStation N1, the original LED management provided
by the factory system is no longer available. Lincmox fills this gap by providing a
**lightweight Go toolchain** that restores meaningful visual feedback directly from Proxmox:

- A **CLI** (`lincmox`) to control LEDs and the LED strip from the shell
- A **daemon** (`lincmoxd`) exposing a **REST API** and an embedded **Web UI**
- **Automatic monitors** that drive LEDs based on system activity

The hardware itself is driven over **I2C** using a proprietary controller located at
address `0x26` on the LincStation N1.

## Features

| Feature | Description |
|---|---|
| **LED control** | Power, SATA (×2), NVMe (×4) and network LEDs |
| **LED strip** | Animations, brightness, solid colors, loop colors |
| **REST API** | Full JSON API for scripts and third-party integrations |
| **Web UI** | Embedded control panel served by the daemon |
| **Monitors** | Background monitors that blink LEDs on network activity |
| **Simulation** | Run everything without hardware for testing and development |

## Why Lincmox?

Lincmox is designed to be **lightweight, reliable and easy to integrate**:

- Zero configuration between CLI and daemon — auto-discovery via a Unix socket
- Automatic I2C bus detection, with the ability to force a specific bus
- A single **Go binary per component** with no runtime dependencies
- Safe coexistence: when the daemon runs, the CLI routes through it transparently

## Documentation structure

- The **Functional** section covers usage: install, CLI commands, Web UI and monitors.
- The **Technical** section covers everything else: architecture, installation details,
  API reference, the I2C protocol and troubleshooting.

Continue with the [Getting started](getting-started.md) guide.