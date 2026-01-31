# syntax = docker/dockerfile:1

ARG NODE_VERSION=22.11.0
FROM node:${NODE_VERSION}-slim AS base

LABEL fly_launch_runtime="Node.js"
WORKDIR /app
ENV NODE_ENV="production"

# --- INSTALACIÓN DE DEPENDENCIAS DE SISTEMA ---
# Necesarias para el navegador headless que usa haxball.js
RUN apt-get update -qq && \
    apt-get install -y --no-install-recommends \
    libnss3 \
    libatk-bridge2.0-0 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    libpangocairo-1.0-0 \
    ca-certificates \
    fonts-liberation \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libxshmfence1 \
    && rm -rf /var/lib/apt/lists/*

# --- STAGE DE CONSTRUCCIÓN ---
FROM base AS build

# Herramientas de compilación por si alguna dependencia lo requiere
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3

COPY package.json ./
# Forzamos la instalación limpia
RUN npm install

COPY . .

# --- STAGE FINAL ---
FROM base

COPY --from=build /app /app

# Exponer el puerto que usa Fly.io
EXPOSE 3000

# Comando para iniciar el bot
CMD [ "node", "index.js" ]
