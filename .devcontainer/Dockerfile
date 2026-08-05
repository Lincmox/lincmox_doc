FROM mcr.microsoft.com/devcontainers/base:ubuntu

# 1. Installation des outils système nécessaires (Git, SSH, Node, NPM)
RUN apt-get update && apt-get install -y \
    curl \
    git \
    openssh-client \
    nodejs \
    npm \
    && rm -rf /var/lib/apt/lists/*

# 2. Configuration globale de NPM pour l'utilisateur 'vscode'
USER vscode
RUN mkdir -p /home/vscode/.npm-global && \
    npm config set prefix '/home/vscode/.npm-global'

# 3. Ajout du chemin des binaires globaux au PATH
ENV PATH="/home/vscode/.npm-global/bin:${PATH}"

# 4. Installation d'OpenCode avec le bon nom de paquet issu du repo de pilinux
RUN npm install -g opencode-ai

