const express = require('express');
const path = require('path');
const stream = require('stream');
const Docker = require('dockerode');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const influx = require('./db');

const PORT = 3000;

const docker = new Docker({ socketPath: '/var/run/docker.sock' });

const initalizeDB = async () => {
  try {
    await influx.createDatabase('dockter');

    const startLogCollection = async () => {
      try {
        const containers = await docker.listContainers({ all: true });

        containers.forEach(async (container) => {
          try {
            const { Id, Image, Status, Names, Ports } = container;

            if (!Names.some((name) => name.match(/^\/dockter/g))) {
              console.log(Names);
              const c = docker.getContainer(Id);

              const log = await c.logs({
                follow: true,
                stdout: true,
                stderr: true,
                timestamps: true,
              });

              if (log) {
                const stdout = new stream.PassThrough();
                const stderr = new stream.PassThrough();

                c.modem.demuxStream(log, stdout, stderr);

                stdout.on('data', async (chunk) => {
                  try {
                    const chunkString = chunk.toString();

                    // TODO: Look into continuous queries
                    influx.writePoints([
                      {
                        measurement: 'logs',
                        tags: {
                          stream: 'stdout',
                          container_name: Names[0],
                        },
                        fields: {
                          message: chunkString.slice(30),
                        },
                        timestamp: new Date(chunkString.slice(0, 30)),
                      },
                    ]);
                  } catch (e) {
                    console.log(e);
                  }
                });

                stderr.on('data', async (chunk) => {
                  try {
                    const chunkString = chunk.toString();

                    // TODO: Look into continuous queries
                    await influx.writePoints([
                      {
                        measurement: 'logs',
                        tags: {
                          stream: 'stderr',
                          container_name: Names[0],
                        },
                        fields: {
                          message: chunkString.slice(30),
                        },
                        timestamp: new Date(chunkString.slice(0, 30)),
                      },
                    ]);

                    const containerNames = [
                      '/test-influx',
                      '/docker_getting-started',
                    ];

                    const reg = new RegExp(containerNames.join('|'));

                    const queryResult = await influx.query(
                      `
                      select * from logs
                      where container_name =~ ${reg}
                      `
                    );

                    queryResult.forEach((row) => {
                      // console.log(
                      //   'query result should go here >>>>>>>>>>',
                      //   row
                      // );
                    });
                  } catch (e) {
                    console.log(e);
                  }
                });
              }
            }
          } catch (e) {
            console.log(e);
          }
        });
      } catch (e) {
        console.log(e);
      }
    };

    startLogCollection();
  } catch (e) {
    console.log('db initialization error:', e);
  }
};

initalizeDB();

// const startup = async () => {
//   try {
//     const containers = await docker.listContainers({ all: true });
//     const liveLogStreams = await containers.map(async (container) => {
//       const { Id, Image, Status, Names, Ports } = container;

//       // Remove logs where timestamp >= timeSinceLastLog to avoid duplication
//       // await Log.deleteMany({
//       //   container_id: Id,
//       //   timestamp: { $gte: applicationStartTime },
//       // });

//       const c = docker.getContainer(container.Id);

//       // Initiate following logs for container
//       const log = await c.logs({
//         follow: true,
//         stdout: true,
//         stderr: true,
//         timestamps: true,
//         since: applicationStartTimeUnix,
//       });

//       if (log) {
//         const stdout = new stream.PassThrough();
//         const stderr = new stream.PassThrough();

//         c.modem.demuxStream(log, stdout, stderr);
//         stdout.on('data', async (chunk) => {
//           const chunkString = chunk.toString();
//           const newLog = {
//             message: chunkString.slice(30),
//             container_id: Id,
//             container_name: Names[0],
//             container_image: Image,
//             timestamp: new Date(chunkString.slice(0, 30)),
//             stream: 'stdout',
//             status: Status,
//             ports: Ports,
//           };

//           // TODO: Change this to InfluxDB query
//           const newLogToSend = await Log.findOneAndUpdate(
//             newLog,
//             { $set: newLog },
//             { upsert: true, new: true }
//           );

//           // Container should only update if hidden-log collector has finished collecting past logs
//           // if (pastLogCollectionComplete[Id]) {
//           //   await Container.findOneAndUpdate(
//           //     { container_id: Id },
//           //     { $set: { last_log: new Date(chunkString.slice(0, 30)) } },
//           //     { upsert: true, new: true }
//           //   );
//           // }

//           // TODO: Chagne this to websockets
//           content.send('newLog', {
//             ...newLogToSend,
//             _id: newLogToSend._id.toString(),
//             _doc: {
//               ...newLogToSend._doc,
//               _id: newLogToSend._doc._id.toString(),
//             },
//           });
//         });

//         stderr.on('data', async (chunk) => {
//           const chunkString = chunk.toString();
//           const newLog = {
//             message: chunkString.slice(30),
//             container_id: Id,
//             container_name: Names[0],
//             container_image: Image,
//             timestamp: new Date(chunkString.slice(0, 30)),
//             stream: 'stderr',
//             status: Status,
//             ports: Ports,
//           };

//           // TODO: Change this to InfluxDB query
//           const newLogToSend = await Log.findOneAndUpdate(
//             newLog,
//             { $set: newLog },
//             { upsert: true, new: true }
//           );

//           // Container should only update if hidden-log collector has finished collecting past logs
//           // if (pastLogCollectionComplete[Id]) {
//           //   await Container.findOneAndUpdate(
//           //     { container_id: Id },
//           //     { $set: { last_log: new Date(chunkString.slice(0, 30)) } },
//           //     { upsert: true, new: true }
//           //   );
//           // }

//           // TODO: Change this to websockets
//           content.send('newLog', {
//             ...newLogToSend,
//             _id: newLogToSend._id.toString(),
//             _doc: {
//               ...newLogToSend._doc,
//               _id: newLogToSend._doc._id.toString(),
//             },
//           });
//         });

//         return [stdout, stderr];
//       }
//     });

//     const streams = await Promise.all(liveLogStreams);

//     // TODO: Change this to websockets
//     ipcMain.on('pauseLiveLogs', () => {
//       console.log('pause all streams');
//       streams.forEach(([stdout, stderr]) => {
//         stdout.pause();
//         stderr.pause();
//       });
//     });

//     // TODO: Change this to websockets
//     ipcMain.on('resumeLiveLogs', () => {
//       console.log('resume all streams');
//       streams.forEach(([stdout, stderr]) => {
//         stdout.resume();
//         stderr.resume();
//       });
//     });
//   } catch (e) {
//     console.log(`Error: ${e}`);
//   }
// };

app.use(express.static('public'));

if (process.env.NODE_ENV === 'production') {
  app.use('/dist', express.static(path.resolve(__dirname, '../dist')));
}

io.on('connection', (socket) => {
  socket.on('filter', async (activeFilters) => {
    // TODO: Remove
    console.log('active filters updated:', activeFilters);

    const {
      container_id,
      container_name,
      container_image,
      status,
      stream,
      timestamp,
      host_ip,
      host_port,
      search,
    } = activeFilters;

    const regex = {};

    regex.container_name = container_name.length
      ? new RegExp(container_name.map((criteria) => `^${criteria}$`).join('|'))
      : new RegExp('.');

    // Object.values(activeFilters).forEach(([criteria, filter]) => {
    //   // Generate a regex for each filter
    //   // If a filter criteria is empty, assume user wants all
    //   // TODO: make all filters an array
    //   regex[criteria] = filter.length
    //     ? new RegExp(filter.join('|'))
    //     : new RegExp('.');
    // });

    const queryResult = await influx.query(
      `
      select * from logs
      where container_name =~ ${regex.container_name}
      `
    );

    queryResult.forEach((row) => {
      console.log('query result ----------->', row);
    });
  });
});

http.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});
