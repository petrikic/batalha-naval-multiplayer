
const sqlite = require('sqlite-sync');
sqlite.connect('./database/database.db3');


const SQL_CREATE = `CREATE TABLE IF NOT EXISTS Users(
                        username TEXT PRIMARY KEY,
                        password TEXT
                    );`;

sqlite.run(SQL_CREATE);

module.exports = sqlite;