import { ipcMain } from 'electron';
import stream from 'stream';
import Docker from 'dockerode';
import Log from '../models/logModel';
import Container from '../models/containerModel';
import collectLiveLogs from './liveLogs';

// Purpose: Before application begins, this process collects logs that have been generated while the application was closed

// Connects dockerode to this path to open up communication with docker api
const scktPath =
  process.platform === 'win32'
    ? '//./pipe/docker_engine'
    : '/var/run/docker.sock';
const docker = new Docker({ socketPath: scktPath });

// Keeps track of whether a container has past logs that have to be collected
const pastLogCollectionComplete = {};

// Global app start time reference
const applicationStartTime = new Date();
const applicationStartTimeUnix = Math.floor(
  applicationStartTime.valueOf() / 1000
);

// Listens for 'ready' event to be sent from the front end (landingpage.tsx) and fires
ipcMain.on('ready', async (event, arg) => {
  const containers = await docker.listContainers({ all: true });
  await Promise.all(
    containers.map(async (container) => {
      const { Id, Image, Status, Names, Ports } = container;
      const doesExist = await Container.exists({ container_id: container.Id });

      // Create document for container if container does not exist
      if (!doesExist) {
        await Container.create({
          container_id: Id,
          last_log: new Date(0).toString(),
        });
      }

      // Add current container to pastLogCollectionComplete tracker
      // false: there are past logs to collect
      // true: there are no more past logs to collect
      pastLogCollectionComplete[Id] = false;

      const result = await Container.find({ container_id: container.Id });
      // Convert last_log into a js Date
      const timeSinceLastLog = new Date(result[0].last_log);
      // Degrade precision for Dockerode .logs method
      const timeSinceLastLogUnix = Math.floor(
        timeSinceLastLog.valueOf() / 1000
      );

      // Remove logs where timestamp >= timeSinceLastLog to avoid duplication
      await Log.deleteMany({
        container_id: Id,
        timestamp: { $gte: timeSinceLastLog },
      });

      const c = docker.getContainer(container.Id);

      // Initiate following logs for container
      const log = await c.logs({
        follow: true,
        stdout: true,
        stderr: true,
        timestamps: true,
        since: timeSinceLastLogUnix,
        until: applicationStartTimeUnix,
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

          // Edge case where log's timestamp === applicationStartTime
          const finishedCollectingPastLogs =
            new Date(chunkString.slice(0, 30)) >= applicationStartTime;

          if (!finishedCollectingPastLogs) {
            await Log.findOneAndUpdate(
              newLog,
              { $set: newLog },
              { upsert: true, new: true }
            );

            await Container.findOneAndUpdate(
              { container_id: Id },
              { $set: { last_log: new Date(chunkString.slice(0, 30)) } },
              { upsert: true, new: true }
            );
          } else {
            pastLogCollectionComplete[Id] = true;
          }
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

          // Edge case where log's timestamp === applicationStartTime
          const finishedCollectingPastLogs =
            new Date(chunkString.slice(0, 30)) >= applicationStartTime;

          if (!finishedCollectingPastLogs) {
            await Log.findOneAndUpdate(
              newLog,
              { $set: newLog },
              { upsert: true, new: true }
            );

            await Container.findOneAndUpdate(
              { container_id: Id },
              { $set: { last_log: new Date(chunkString.slice(0, 30)) } },
              { upsert: true, new: true }
            );
          } else {
            pastLogCollectionComplete[Id] = true;
          }
        });

        log.on('close', () => {
          console.log(
            `All caught up! No more logs to collection for container: ${Names}`
          );
          pastLogCollectionComplete[Id] = true;
        });
      }
    })
  );
  collectLiveLogs();
});

export {
  pastLogCollectionComplete,
  applicationStartTime,
  applicationStartTimeUnix,
};
