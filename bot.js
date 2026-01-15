const HaxballJS = require("haxball.js");

// RECUERDA: Generar el token en https://www.haxball.com/headlesstoken
// En Koyeb, es mejor usar variables de entorno para el token
const MI_TOKEN = process.env.HAXBALL_TOKEN || "thr1.AAAAAGlW6vcw728_O71-KQ.NY_ka5XuLHE"; 
const ADMIN_AUTH = "nzeiy3F0jgqpNxSN4ED2Bsb5qIwt5ih_DdTATyjvksk";
const DISCORD_LINK = "https://discord.gg/Q6EQrQbb";

HaxballJS.then((HBInit) => {
  const room = HBInit({
    roomName: "SAH | Room 1",
    public: false, 
    password: "SAH2K26",
    maxPlayers: 12,
    token: MI_TOKEN,
    noPlayer: true,
    // --- CONFIGURACIÓN PARA KOYEB/LINUX ---
    puppeteerArgs: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu'
    ]
  });

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
    room.sendAnnouncement("📢 ¡Únete a nuestro Discord!: " + DISCORD_LINK, null, 0x7289DA, "bold");
  }, 300000);

  room.onTeamVictory = () => setTimeout(() => room.restartGame(), 3000);

  room.onRoomLink = (link) => {
    console.log("Sala abierta en: " + link);
  };
});