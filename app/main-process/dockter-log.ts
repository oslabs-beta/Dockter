import { ipcMain, webContents } from 'electron';
import { db } from './db.ts';

const Docker = require('dockerode');

const docker = new Docker({socketPath: '/var/run/docker.sock'});
const io = require('socket.io-client');

const socket = io('http://localhost:8080');

// socket.emit('initializeLogger');


ipcMain.on('ready', (event, arg) => {
  const content = webContents.getAllWebContents()[0];
  // console.log('content,', content);
  content.send('testmessage', 'hello from ipc main');

  docker.listContainers((err, containers) => {
    containers.forEach((container) => {
      if (container.Names[0] !== '/dockter-log')
        socket.emit('startLogCollection', container.Id);
    });
  });

  socket.on('newLog', (logGuy) => {
    console.log('log: ', logGuy);
    const { containerId, log, time, log_level, stream } = logGuy;
    db.serialize(() => {
      db.run(
        `INSERT INTO logs (container_id, message, timestamp, log_level, stream)
        VALUES ($1, $2, $3, $4, $5)`, [containerId, log, time, log_level, stream], (err) => {
          if (err) {
            console.log(err.message);
          }
          console.log('A row has been inserted corrrectly');
        }
      );
    });
    content.send('shipLog', logGuy);
  });
});
