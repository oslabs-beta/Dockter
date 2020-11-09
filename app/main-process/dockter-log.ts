import { ipcMain, webContents } from 'electron';
import stream from 'stream';
import Docker from 'dockerode';
const mongoose = require('mongoose');
const Log = require('../models/logModel.ts');

// Connects dockerode to this path to open up communication with docker api
const scktPath =
  process.platform === 'win32'
    ? '//./pipe/docker_engine'
    : '/var/run/docker.sock';
const docker = new Docker({ socketPath: scktPath });

// Listens for 'ready' event to be sent from the front end (landingpage.tsx) and fires
ipcMain.on('ready', (event, arg) => {
  // getAllWebContents gives us all the open windows within electron
  // Since there is only 1, we grab it as the first element
  const content = webContents.getAllWebContents()[0];

  docker.listContainers({ all: true }, (err, containers) => {
    containers.forEach((container) => {
      const c = docker.getContainer(container.Id);
      c.logs(
        { follow: true, stdout: true, stderr: true, timestamps: true },
        (logError, log) => {
          // TODO: Better error handling
          if (logError) return console.log(logError);

          if (log) {
            const stdout = new stream.PassThrough();
            const stderr = new stream.PassThrough();

            c.modem.demuxStream(log, stdout, stderr);
            stdout.on('data', (chunk) => {
              const { Id, Image, Status, Names, Ports } = container;
              const chunkString = chunk.toString();
              const newLog = {
                message: chunkString.slice(35),
                container_id: Id,
                container_name: Names[0],
                container_image: Image,
                timestamp: chunkString.slice(0, 30),
                stream: 'stdout',
                status: Status,
                ports: Ports,
              };
              Log.findOneAndUpdate(
                newLog,
                newLog,
                { upsert: true, new: true },
                (err, log) => {
                  if (err) {
                    console.log('ERROR: ', err);
                  }
                }
              );
              content.send('newLog', newLog);
            });

            stderr.on('data', (chunk) => {
              const { Id, Image, Status, Names, Ports } = container;
              const chunkString = chunk.toString();
              const newLog = {
                message: chunkString.slice(35),
                container_id: Id,
                container_name: Names[0],
                container_image: Image,
                timestamp: chunkString.slice(0, 30),
                stream: 'stderr',
                status: Status,
                ports: Ports,
              };
              Log.findOneAndUpdate(
                newLog,
                newLog,
                { upsert: true, new: true },
                (err, log) => {
                  if (err) {
                    console.log('ERROR: ', err);
                  }
                }
              );
              content.send('newLog', newLog);
            });
          }
        }
      );
    });
  });
});
