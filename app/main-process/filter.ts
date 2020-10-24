/* eslint-ignore */

const { ipcMain } = require('electron');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./mock.sqlite3');
const containerQuery =
`SELECT
    *
  FROM
    Containers
  `;

const logQuery =
`SELECT
    *
  FROM
    Logs
  `;

const containers = db.query(containerQuery);
console.log(containers);
// store info in database
// make queiries
// when an event to filter is fired from ipcRender, we will return an obj with the requested data from our db
// when the arg is recieved, should we check the recieved object first to see if any prop does not have a value?
// if there is a value, we should SELECT val FROM table WHERE val NOT NULL?
// could make a constuctor
ipcMain.on('filter', (event, arg) => {
  // the argument in this case should print out the req obj from client side

  event.returnValue([
    {
      container: '',
      image: '',
      status: '',
      stream: '',
      timestamp: {
        from: '',
        to: '',
      },
      hostIp: '',
      hostPort: '',
      logLevel: '',
    },
  ]);
});
// by default sort by timestamp
ipcMain.on('sort', (event, arg) => {
  console.log(arg);
  // event.reply();
  event.returnValue([
    {
      container: '',
      image: '',
      status: '',
      stream: '',
      timestamp: {
        from: '',
        to: '',
      },
      hostIp: '',
      hostPort: '',
      logLevel: '',
    },
  ]);
});
