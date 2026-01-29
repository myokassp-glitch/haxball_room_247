const HaxballJS = require("haxball.js").default;
const express = require('express');
const app = express();

// Servidor básico para Fly.io
app.get('/', (req, res) => res.send('Sala SAH Activa en Fly.io'));
app.listen(process.env.PORT || 3000);

const MI_TOKEN = "thr1.AAAAAGl6u1juwKRyBszvcQ.PENqXZoP6zk"; // Genera uno nuevo siempre
const ADMIN_AUTH = "5ix0yOu72gjslrVacLSe_dwbyrNd7f8zbU3zKlWC7kw";
const dclin = "https://discord.gg/Mw8e6ZcnWk";

HaxballJS({
  puppeteerArgs: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu'
  ]
  // Se eliminó executablePath para que Fly.io use su propio navegador
}).then((HBInit) => {
  const room = HBInit({
    roomName: "el culo de tu ñaña",
    public: false,
    maxPlayers: 30, // Límite de 12 jugadores
    token: MI_TOKEN,
    noPlayer: true,
  });

  room.onRoomLink = (link) => {
    console.log("Sala abierta en: " + link);
  };

room.setDefaultStadium("Big");

  function checkAdmins() {
    const admins = room.getPlayerList().filter(p => p.admin);
    if (admins.length === 0) {
      room.sendAnnouncement("⚠️ No hay admins en la room, escribe !ad para recibir admin.", null, 0xFF0000, "bold");
    }
  }

  room.onPlayerJoin = (player) => {
    if (player.auth === ADMIN_AUTH) {
      room.setPlayerAdmin(player.id, true);
      room.sendAnnouncement("⭐ Dueño de la sala ha ingresado.", player.id, 0x00FF00);
    }
    room.sendAnnouncement(`¡Hola ${player.name}! Bienvenido.`, player.id, 0xFFEE00);
    setTimeout(checkAdmins, 2000);
  };

  room.onPlayerLeave = (player) => {
    setTimeout(checkAdmins, 2000);
  };

  room.onPlayerChat = (player, message) => {
    if (message === "!ad") {
      const admins = room.getPlayerList().filter(p => p.admin);
      if (admins.length === 0) {
        room.setPlayerAdmin(player.id, true);
        room.sendAnnouncement(`${player.name} ha tomado el admin.`, null, 0x00FFFF);
      } else {
        room.sendChat("Ya hay un administrador en la sala.", player.id);
      }
      return false;
    }

    if (message.startsWith("!pass ") && player.admin) {
      const newPass = message.split(" ")[1];
      if (newPass) {
        room.setPassword(newPass);
        room.sendAnnouncement(`🔐 La contraseña ha sido cambiada a: ${newPass}`, null, 0xFFFF00);
      }
      return false;
    }
  };

  setInterval(() => {
    room.sendAnnouncement("📢 ¡Únete a nuestro Discord!: " + dclin, null, 0x7289DA, "bold");
  }, 300000);

  room.onTeamVictory = () => setTimeout(() => room.restartGame(), 3000);
});



