import { ipcMain, webContents } from 'electron';
import stream from 'stream';
import Docker from 'dockerode';
import Log from '../models/logModel';
import Container from '../models/containerModel';

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
    containers.forEach(async (container) => {
      const doesExist = await Container.exists({ container_id: container.Id });

      if (!doesExist) {
        await Container.create({
          container_id: container.Id,
          last_log: new Date(0).toString(),
        });
      }

      const result = await Container.find({ container_id: container.Id });
      const timeSinceLastLog = result[0].last_log;

      const c = docker.getContainer(container.Id);
      const log = await c.logs({
        follow: true,
        stdout: true,
        stderr: true,
        timestamps: true,
        since: Date.parse(timeSinceLastLog),
      });

      if (log) {
        const stdout = new stream.PassThrough();
        const stderr = new stream.PassThrough();

        c.modem.demuxStream(log, stdout, stderr);
        stdout.on('data', async (chunk) => {
          const { Id, Image, Status, Names, Ports } = container;
          const chunkString = chunk.toString();
          const newLog = {
            message: chunkString.slice(30),
            container_id: Id,
            container_name: Names[0],
            container_image: Image,
            timestamp: chunkString.slice(0, 30),
            stream: 'stdout',
            status: Status,
            ports: Ports,
          };

          // console.log('-----------------------> new log:', chunk.toString());

          const newLogToSend = await Log.findOneAndUpdate(
            newLog,
            { $set: newLog },
            { upsert: true, new: true }
          );

          await Container.findOneAndUpdate(
            { container_id: Id },
            { $set: { last_log: chunkString.slice(0, 30) } },
            { upsert: true, new: true }
          );

          console.log('new log to send:', newLogToSend);
          content.send('newLog', newLogToSend);
        });

        stderr.on('data', async (chunk) => {
          const { Id, Image, Status, Names, Ports } = container;
          const chunkString = chunk.toString();
          const newLog = {
            message: chunkString.slice(30),
            container_id: Id,
            container_name: Names[0],
            container_image: Image,
            timestamp: chunkString.slice(0, 30),
            stream: 'stderr',
            status: Status,
            ports: Ports,
          };

          const newLogToSend = await Log.findOneAndUpdate(
            newLog,
            { $set: newLog },
            { upsert: true, new: true }
          );

          await Container.findOneAndUpdate(
            { container_id: Id },
            { $set: { last_log: chunkString.slice(0, 30) } },
            { upsert: true, new: true }
          );
            
          content.send('newLog', newLogToSend);
        });
      }
    });
  });
});
