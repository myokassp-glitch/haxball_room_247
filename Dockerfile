# Usamos la imagen oficial de Puppeteer que ya trae Chrome y dependencias
FROM ghcr.io/puppeteer/puppeteer:latest

# Cambiamos a usuario root para poder instalar y configurar sin restricciones
USER root

WORKDIR /app

# Copiamos los archivos de configuración primero
COPY package*.json ./

# Instalamos las dependencias del bot
RUN npm install

# Copiamos el resto del código (index.js, etc.)
COPY . .

# Comando para iniciar el bot
CMD ["node", "index.js"]
