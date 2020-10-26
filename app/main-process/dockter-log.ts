import { ipcMain } from 'electron';
import { db } from './db.ts';

const Docker = require('dockerode');

const docker = new Docker({socketPath: '/var/run/docker.sock'});
const io = require('socket.io-client');

const socket = io('http://localhost:8080');

// let db = new sqlite3.Database('.db/database.sqlite3', (err) => {
//   if (err) {
//     console.log(err.message);
//   }
//   console.log('Connected to SQLite DB');
// });

// socket.emit('initializeLogger');

ipcMain.on('ready', (event, arg) => {
  console.log('arg from ready event', arg);
  const containerList = docker.listContainers((err, containers) => {
    containers.forEach((container) => {
      // console.log('containerId: ', container.Id);
      // console.log('containerName: ', container.Names);
      if (container.Names[0] !== '/dockter-log')
        socket.emit('startLogCollection', container.Id);
    });
  });

  socket.on('newLog', (log) => {
    console.log('log: ', log);
    const { containerId, message, timestamp, logLevel, stream } = log;
    db.serialize(() => {
      db.run(
        `INSERT INTO logs (containerId, message, timestamp, logLevel, stream)
        VALUES (${containerId}, ${message}, ${timestamp}, ${logLevel}, ${stream})
        )`
      );
    });
  });
})