// import { ipcMain } from 'electron';

const Database = require('better-sqlite3');
const path = require('path');
//on initialization, checks if this file exists, if not it will create it
const db = new Database(path.resolve(__dirname, '../../db/database.sqlite3'), {
  verbose: console.log,
});
//provides schema and creates table if table does not exist within the sqlite3 file
db.exec(
  `CREATE TABLE IF NOT EXISTS containers (
    _id SERIAL,
    container_id VARCHAR(255) UNIQUE PRIMARY KEY,
    name VARCHAR(255),
    image VARCHAR(255),
    status VARCHAR(255),
    host_ip VARCHAR(255),
    host_port VARCHAR(255)
  )`
);
db.exec(
  `CREATE TABLE IF NOT EXISTS logs (
    _id SERIAL PRIMARY KEY,
    container_id VARCHAR(255),
    message VARCHAR(255),
    timestamp VARCHAR(255),
    log_level VARCHAR(255),
    stream VARCHAR(255),
    FOREIGN KEY (container_id) REFERENCES containers (container_id)
  )`
);
// ipc main used to close app to keep it secure
// ipcMain.on('shutdown', (event, arg) => {
//   db.close((err) => {
//     if (err) {
//       return console.error(err.message);
//     }
//     console.log('Close the database connection.');
//   });
// })

export { db };
