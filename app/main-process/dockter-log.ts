import { ipcMain } from 'electron';
import { db } from './db.ts';

const Docker = require('dockerode');

const docker = new Docker({socketPath: '/var/run/docker.sock'});
const io = require('socket.io-client');

const socket = io('http://localhost:8080');

// socket.emit('initializeLogger');

ipcMain.on('ready', (event, arg) => {
  docker.listContainers((err, containers) => {
    containers.forEach((container) => {
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
    ipcMain.on('shipLog', (event.returnValue = log));
  });
});
