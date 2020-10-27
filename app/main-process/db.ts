import { ipcMain } from "electron";

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.resolve(__dirname, '../../db/database.sqlite3'), (err) => {
  if (err) {
    console.log(err.message);
  }
  console.log('Connected to SQLite DB');
});

db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS containers (
      _id SERIAL PRIMARY KEY,
      container_id VARCHAR(255),
      name VARCHAR(255),
      image VARCHAR(255),
      status VARCHAR(255),
      host_ip VARCHAR(255),
      host_port VARCHAR(255)
    )`
  );
  db.run(
    `CREATE TABLE IF NOT EXISTS logs (
      _id SERIAL PRIMARY KEY,
      container_id VARCHAR(255),
      message VARCHAR(255),
      timestamp VARCHAR(255),
      log_level VARCHAR(255),
      stream VARCHAR(255),
      FOREIGN KEY (container_id) REFERENCES containers(container_id)
    )`
  );
})

ipcMain.on('shutdown', (event, arg) => {
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Close the database connection.');
  });
})

export { db };