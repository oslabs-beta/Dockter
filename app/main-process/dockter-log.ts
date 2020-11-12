import { ipcMain, webContents } from 'electron';
import stream from 'stream';
import path from 'path';
import Docker from 'dockerode';
import Log from '../models/logModel';
import Container from '../models/containerModel';
import {
  applicationStartTime,
  applicationStartTimeUnix,
  pastLogCollectionComplete,
} from './hidden-dockter-log';

// Connects dockerode to this path to open up communication with docker api
const scktPath =
  process.platform === 'win32'
    ? '//./pipe/docker_engine'
    : '/var/run/docker.sock';
const docker = new Docker({ socketPath: scktPath });

async function collectLiveLogs() {
  // getAllWebContents gives us all the open windows within electron
  const content = webContents.getAllWebContents().reduce((window, curr) => {
    const appWindow = `file:\/\/${path.resolve(__dirname, '../app')}`;
    const reg = new RegExp(appWindow, 'g');
    return curr.getURL().match(reg) ? curr : window;
  });

  const containers = await docker.listContainers({ all: true });
  containers.forEach(async (container) => {
    try {
      const { Id, Image, Status, Names, Ports } = container;

      // Remove logs where timestamp >= timeSinceLastLog to avoid duplication
      await Log.deleteMany({
        container_id: Id,
        timestamp: { $gte: applicationStartTime },
      });

      const c = docker.getContainer(container.Id);

      // Initiate following logs for container
      const log = await c.logs({
        follow: true,
        stdout: true,
        stderr: true,
        timestamps: true,
        since: applicationStartTimeUnix,
      });

      if (log) {
        const stdout = new stream.PassThrough();
        const stderr = new stream.PassThrough();

        c.modem.demuxStream(log, stdout, stderr);
        stdout.on('data', async (chunk) => {
          const chunkString = chunk.toString();
          const newLog = {
            message: chunkString.slice(30),
            container_id: Id,
            container_name: Names[0],
            container_image: Image,
            timestamp: new Date(chunkString.slice(0, 30)),
            stream: 'stdout',
            status: Status,
            ports: Ports,
          };

          const newLogToSend = await Log.findOneAndUpdate(
            newLog,
            { $set: newLog },
            { upsert: true, new: true }
          );

          // Container should only update if hidden-log collector has finished collecting past logs
          if (pastLogCollectionComplete[Id]) {
            await Container.findOneAndUpdate(
              { container_id: Id },
              { $set: { last_log: new Date(chunkString.slice(0, 30)) } },
              { upsert: true, new: true }
            );
          }
          content.send('newLog', {
            ...newLogToSend,
            _id: newLogToSend._id.toString(),
            _doc: {
              ...newLogToSend._doc,
              _id: newLogToSend._doc._id.toString(),
            },
          });
        });

        stderr.on('data', async (chunk) => {
          const chunkString = chunk.toString();
          const newLog = {
            message: chunkString.slice(30),
            container_id: Id,
            container_name: Names[0],
            container_image: Image,
            timestamp: new Date(chunkString.slice(0, 30)),
            stream: 'stderr',
            status: Status,
            ports: Ports,
          };

          const newLogToSend = await Log.findOneAndUpdate(
            newLog,
            { $set: newLog },
            { upsert: true, new: true }
          );

          // Container should only update if hidden-log collector has finished collecting past logs
          if (pastLogCollectionComplete[Id]) {
            await Container.findOneAndUpdate(
              { container_id: Id },
              { $set: { last_log: new Date(chunkString.slice(0, 30)) } },
              { upsert: true, new: true }
            );
          }

          content.send('newLog', {
            ...newLogToSend,
            _id: newLogToSend._id.toString(),
            _doc: {
              ...newLogToSend._doc,
              _id: newLogToSend._doc._id.toString(),
            },
          });
        });
      }
    } catch (err) {
      console.log(err);
    }
  });
}

export default collectLiveLogs;
