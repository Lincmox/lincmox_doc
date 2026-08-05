---
sidebar_position: 1
---

# Introduction

**Lincmox** is an open-source project designed to bring full control of the status LEDs and front LED strip of the [**LincPlus LincStation N1**](https://www.lincplustech.com/fr-fr/products/lincstation-n1-network-attached-storage) when running [**Proxmox VE**](https://www.proxmox.com/en/products/proxmox-virtual-environment/overview).

When Proxmox is installed on the LincStation N1, the original LED management provided by the factory system is no longer available. Lincmox fills this gap by providing a dedicated **Python library and a set of tools** that allow you to monitor system state and control LED behavior directly from Proxmox.

This documentation covers:

* The architecture and goals of the Lincmox project
* Installation and configuration on Proxmox
* The LED control library and its API
* Commands available on command-line interface
* Daemon
* Graphical user interface

Lincmox aims to be **lightweight, reliable, and easy to integrate**, enabling users to restore meaningful visual feedback (status, activity, alerts) on their LincStation N1 while using Proxmox as a virtualization platform.

Whether you are a homelab enthusiast or a developer looking to extend LED control capabilities, this documentation will guide you through everything you need to get started.
