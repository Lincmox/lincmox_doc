---
sidebar_position: 1
---

# Installation

## Install from Debian repository

### Step 1: Open node shell

![Open node shell](/img/docs/install-step1.png)

### Step 2: Add GPG public key

```bash
curl -fsSL https://repo.lincmox.ovh/public.key | gpg --dearmor -o /usr/share/keyrings/lincmox.gpg
```

### Step 3: Add Debian repository

```bash
echo "deb [signed-by=/usr/share/keyrings/lincmox.gpg] https://repo.lincmox.ovh trixie main" | tee /etc/apt/sources.list.d/lincmox.list
```

Lincmox repository is now visible in node APT repositories.

![APT repositories](/img/docs/install-step3.png)

### Step 4: Update package list

```bash
apt update
```

### Step 5: Install Lincmox

```bash
apt install lincmox-cli
```
