const HBInit = require("haxball.js");

HBInit({
    roomName: "NetWorkHax 2K26 | ROOM 1",
    maxPlayers: 30,
    noPlayer: true,
    public: false,
    token: "thr1.AAAAAGl9kXd35R0DMOpNkg.jooqZuWBS1M", // Debes obtenerlo en haxball.com/headlesstoken
    onRoomLink: (link) => console.log("Sala abierta en: " + link)
}).then((room) => {
    const OWNER_AUTH = "5ix0yOu72gjslrVacLSe_dwbyrNd7f8zbU3zKlWC7kw";

    room.onPlayerJoin = function(player) {
        if (player.auth === OWNER_AUTH) {
            room.setPlayerAdmin(player.id, true);
        }
    };
// --- Lógica del comando !ad ---
room.onPlayerChat = function(player, message) {
    if (message === "!ad") {
        // Verificar si ya hay algún admin en la sala
        var players = room.getPlayerList();
        var hasAdmin = players.some(p => p.admin === true);

        if (!hasAdmin) {
            room.setPlayerAdmin(player.id, true);
            room.sendChat("Ahora eres administrador, " + player.name);
        } else {
            room.sendChat("Ya hay un administrador en la sala. No puedes usar !ad ahora.");
        }
        return false; // No mostrar el comando en el chat
    }
};

// --- Mensaje automático cada 2 minutos (120,000 ms) ---
setInterval(function() {
    var players = room.getPlayerList();
    var hasAdmin = players.some(p => p.admin === true);

    // Solo manda el mensaje si NO hay admins y hay al menos alguien en la sala
    if (!hasAdmin && players.length > 0) {
        room.sendChat("Aviso: No hay administradores. Escribe !ad para tener admin.");
    }
}, 120000);
});

