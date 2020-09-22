const Part = require('./Part');
class Ship {
    constructor(type, len) {
        this.ship = [];
        for(let i = 0; i < len; i++) {
            let typeId = `${type}-${i}`;
            this.ship[i] = new Part(typeId);
        }
        return this.ship;
    }
}

module.exports = Ship;