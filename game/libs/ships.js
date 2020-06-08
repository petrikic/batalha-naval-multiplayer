module.exports = () => {
    const portaAvioes = require('../models/PortaAvioes');
    const navioTanque = require('../models/NavioTanque');
    const contraTorpedos = require('../models/ContraTorpedos');
    const submarino = require('../models/Submarino');
    const createShip = [];
    const ships = [];

    createShip.push(portaAvioes);
    createShip.push(navioTanque);
    createShip.push(contraTorpedos);
    createShip.push(submarino);

    for (let i = 0; i < createShip.length; i++) {
        for (let j = 0; j < i + 1; j++) {
            ships.push(createShip[i]());
        }
    }
    return ships;
}