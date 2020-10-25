const sqlite3 = require('sqlite3').verbose();
const io = require('socket.io-client');
const socket = io('http://localhost:8080');

let db = new sqlite3.Database('.db/database.sqlite3', (err) => {
  if (err) {
    console.log(err.message);
  }
  console.log('Connected to SQLite DB');
});

socket.emit('initializeLogger');

socket.emit('startLogCollection');

socket.on('newLog', (log) => {
  const {containerId, message, timestamp, logLevel, stream} = log
  db.serialize(() => {
    db.run(
      `INSERT INTO logs (containerId, message, timestamp, logLevel, stream)
      VALUES (${containerId}, ${message}, ${timestamp}, ${logLevel}, ${stream})
      )`
    )
  })
})

