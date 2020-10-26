/* eslint-disable */
// const { ipcMain } = require('electron');
// const sqlite3 = require('sqlite3').verbose();
// const db = new sqlite3.Database('./mock.sqlite3');

// SELECT l._id, l.message, l.timestamp, l.log_level, l.stream, l.container_id, c.name as container_name, c.image as container_image, c.status as container_status, c.host_ip, c.host_port
// FROM logs l
// INNER JOIN containers c
// ON l.container_id = c.container_id;

// TODO: import db instance

ipcMain.on('filter', (event, arg) => {
  const filterProps = [];
  // when we get arg from ipcRender process, loop thru and check to see if key val is not zero
  // if so push key into filterprops arr
  const argKeys = Object.keys(arg);

  argKeys.forEach((key) => {
    if (arg[key].length !== 0) filterProps.push(key);
  });

  // check to see if there is only one item in filterProps, and if there is, make a query with that item
  if (filterProps.length === 1) {
    let key = filterProps[0];
    let argKey = arg[key];
    const singlePropObj = {};

    let singleValueQuery = db.prepare(
      `SELECT l._id, l.message, l.timestamp, l.log_level, l.stream, l.container_id, c.name as container_name, c.image as container_image, c.status as container_status, c.host_ip, c.host_port
      FROM logs l
      INNER JOIN containers c
      ON l.container_id = c.container_id
      WHERE ? = ?`
    );

    singleValueQuery.run(key, argKey);
    singlePropObj[key] = singleValueQuery;
    event.returnValue([singlePropObj]);
  } else {
    let filterParams = '';
    const multiPropObj = {};

    let multiValueQuery = db.prepare(
      `SELECT l._id, l.message, l.timestamp, l.log_level, l.stream, l.container_id, c.name as container_name, c.image as container_image, c.status as container_status, c.host_ip, c.host_port
      FROM logs l
      INNER JOIN containers c
      ON l.container_id = c.container_id
      WHERE ?`
    );

    for (let i = 0; i < filterProps.length; i++) {
      if (i === 0) filterParams += `${filterProps[i]}=${arg.filterProps[0]}`;
      else filterParams += ` AND ${filterProps[i]}=${arg.filterProps[0]}`;
      multiPropObj[filterProps[i]] = multiValueQuery;
    }

    multiValueQuery.run(filterParams);
    event.returnValue([multiPropObj]);
  }

  // event.returnValue([
  //   {
  //     message:,
  //     timestamp:,
  //     stream:,
  //     container_id:,
  //     name:,
  //     image:,
  //     hostIp:,
  //     hostPort:,
  //     logLevel:,
  //   }
  // ])
