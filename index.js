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

    // ... (aquí el resto del código que te pasé antes)
});
