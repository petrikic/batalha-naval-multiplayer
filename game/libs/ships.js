module.exports = () => {
    const Ship = require('../models/Ship');
    const types = [];
    const ships = [];

    const setType = (type, len) => {
        const shipType = {}
        shipType.type = type;
        shipType.len = len;
        types.push(shipType);
    }

    setType('porta-avioes', 5);
    setType('navio-tanque', 4);
    setType('contra-torpedos', 3);
    setType('submarino', 2);

    for (let i = 0; i < types.length; i++) {
        for (let j = 0; j < i + 1; j++) {
            const ship = new Ship(types[i].type, types[i].len);
            ships.push(ship);
        }
    }

    ships.forEach(ship => {
        ship.destroyed = 0;
        ship.forEach(part => {
            part.ship = ship;
        });
    });
    return ships;
}