import { ipcMain, webContents } from 'electron';
// import { StrictMode } from 'react';
import { db } from './db.ts';

const Docker = require('dockerode');
// connects dockerode to this path to open up communication with dockcer api
const docker = new Docker({ socketPath: '/var/run/docker.sock' });
const io = require('socket.io-client');

// TODO: Make port dynamic in case 8080 is taken
// connects app to log shipper to the 8080 port
const socket = io('http://localhost:8080');

// socket.emit('initializeLogger');
// listens for 'ready' event to be sent from the front end (landingpage.tsx) and fires
ipcMain.on('ready', (event, arg) => {
  // allows us access all open windows within our electron app (in this case the browser window)
  // Access the current open browser
  const content = webContents.getAllWebContents()[0];

  docker.listContainers((err, containers) => {
    // loop through each container
    containers.forEach((container) => {
      // look for dockter log shipper within the container and exclude it
      // TODO: The check should be done through container id
      if (container.Names[0] !== '/dockter-log') {
        socket.emit('startLogCollection', container.Id);
      }
      const stmt = db.prepare(
        `INSERT OR IGNORE INTO containers (container_id, name, image, status, host_ip, host_port)
        VALUES (?, ?, ?, ?, ?, ?)`
      );
      stmt.run(
        container.Id,
        container.Names[0],
        container.Image,
        container.Status,
        container.NetworkSettings.Networks.bridge.IPAddress,
        container.Ports[0].PublicPort.toString().match(/^\d+/g)[0]
      );
    });
  });

  // Listening for new log entries from Dockter Log
  socket.on('newLog', (shippedLog) => {
    //TODO: Get most updated log shipper code
    //TODO: Investigate whether to handle logic for object structuring here or in Dockter Log Shipper
    // TODO: Rename 'containerId' to align throughout project
    const { containerId, log, time, stream } = shippedLog;

    // Store all properties for container whose id === 'containerId'
    const container = docker.getContainer(containerId);

    // Adds container name, image, and host port properties on to our container object
    container.inspect((err, object) => {
      let address = Object.keys(object.Config.ExposedPorts);
      shippedLog.container_name = object.Name;
      shippedLog.container_image = object.Config.Image;
      shippedLog.host_port =
        object.NetworkSettings.Ports[address[0]][0].HostPort;
      // TODO: message and logs hold duplicate values
      shippedLog.message = log;
      //TODO: Align column name and DB
      shippedLog.container_id = containerId;
      const stmt = db.prepare(
        `INSERT INTO logs (container_id, message, timestamp, stream)
        VALUES (?, ?, ?, ?)`
      );
      stmt.run(containerId, log, time, stream);
      // TODO: remove console.log
      console.log('shippedLog: ', shippedLog);
      content.send('shipLog', shippedLog);
    });
  });
});
