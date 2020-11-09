import { ipcMain, webContents } from 'electron';
const Docker = require('dockerode');

const docker = new Docker();

docker.listContainers().then((res) => {
  res.forEach((container) => {
    const c = docker.getContainer(container.Id);
    c.logs({ follow: true, stdout: true }, (err, log) => {
      if (err) return console.log(err);
      log.on('data', (chunk) => {
        console.log('a chunk', chunk.toString());
      });
    });
  });
});
