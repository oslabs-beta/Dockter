/* eslint-disable */
// const { ipcMain } = require('electron');
// const sqlite3 = require('sqlite3').verbose();
// const db = new sqlite3.Database('./mock.sqlite3');

// SELECT l._id, l.message, l.timestamp, l.log_level, l.stream, l.container_id, c.name as container_name, c.image as container_image, c.status as container_status, c.host_ip, c.host_port
// FROM logs l
// INNER JOIN containers c
// ON l.container_id = c.container_id;

import { timeStamp } from 'console';
import { ipcMain } from 'electron';
import { db } from './db.ts';

ipcMain.on('filter', (event, arg) => {
  console.log('arg: ', arg);
  const filterProps = [];
  // when we get arg from ipcRender process, loop thru and check to see if key val is not zero
  // if so push key into filterprops arr
  const argKeys = Object.keys(arg);

  argKeys.forEach((key) => {
    if (key === 'timestamp' && arg[key].from && arg[key].to) {
      filterProps.push(key);
    }
    if (arg[key].length !== 0 && key !== 'timestamp') filterProps.push(key);
  });

  console.log('filterProps: ', filterProps);
  // check to see if there is only one item in filterProps, and if there is, make a query with that item
  if (filterProps.length === 0) {
    db.all(
      `SELECT l._id, l.message, l.timestamp, l.log_level, l.stream, l.containerid, c.name as container_name, c.image as container_image, c.status as container_status, c.host_ip, c.host_port
        FROM logs l
        INNER JOIN containers c
        ON l.containerid = c.container_id`,
      (error, rows) => {
        event.reply('reply-filter', rows);
      }
    );
  }
  //TODO: Need to add more logic for instances in which an arrays value holds more than one prop
  if (filterProps.length === 1 && filterProps[0] !== 'timestamp') {
    const containerProps = ['name', 'image', 'status', 'host_ip', 'host_port'];
    let prefix = containerProps.includes(filterProps[0]) ? 'c.' : 'l.';
    let key = prefix + filterProps[0];
    let argKey = arg[filterProps[0]];

    // const singlePropObj = {};
    db.all(
      `SELECT l._id, l.message, l.timestamp, l.log_level, l.stream, l.containerid, c.name as container_name, c.image as container_image, c.status as container_status, c.host_ip, c.host_port
        FROM logs l
        INNER JOIN containers c
        ON l.containerid = c.container_id
        WHERE ${key} = ?`,
      [argKey[0]],
      (error, rows) => {
        if (error) console.log('ERROR', error);
        event.reply('reply-filter', rows);
      }
    );
  } else if (filterProps.length === 1 && filterProps[0] === 'timestamp') {
    let argKey = arg.timestamp;
    const fromTime = argKey.from;
    console.log('from: ', fromTime);
    const toTime = argKey.to;
    console.log('to: ', toTime);
    // const singlePropObj = {};
    db.all(
      `SELECT l._id, l.message, l.timestamp, datetime('now') as timetell, l.log_level, l.stream, l.containerid, c.name as container_name, c.image as container_image, c.status as container_status, c.host_ip, c.host_port
        FROM logs l
        INNER JOIN containers c
        ON l.containerid = c.container_id
        WHERE l.timestamp BETWEEN Datetime('2020-10-21T01:03') and Datetime('2020-10-23T13:02')`,
      // [fromTime, toTime],
      (error, rows) => {
        if (error) console.log('ERROR', error);
        event.reply('reply-filter', rows);
      }
    );
  } else if (filterProps.length > 1 && !filterProps.includes('timestamp')) {
    let query = `SELECT l._id, l.message, l.timestamp, l.log_level, l.stream, l.container_id, c.name as container_name, c.image as container_image, c.status as container_status, c.host_ip, c.host_port
       FROM logs l
       INNER JOIN containers c
       ON l.container_id = c.container_id`;
    let queryExtension = 'WHERE ';
    const params = [];

    filterProps.forEach((key, i) => {
      //TODO: need to check array at arg[key] if array has more than one property
      //needs logic for timestamp
      const containerProps = [
        'name',
        'image',
        'status',
        'host_ip',
        'host_port',
      ];
      let prefix = containerProps.includes(filterProps[i]) ? 'c.' : 'l.';
      if (i === 0) {
        params.push(key);
        params.push(arg[key]);
        queryExtension += `${prefix + key} = ?`;
      } else {
        params.push(key);
        params.push(arg[key]);
        queryExtension += `AND ${prefix + key} = ?`;
      }
    });

    db.all(query + queryExtension, params, (error, rows) => {
      if (error) console.log('ERROR', error);
      event.reply('reply-filter', rows);
    });
  }

  // else {
  //   let filterParams = '';

  //   let multiValueQuery = db.prepare(
  //     `SELECT l._id, l.message, l.timestamp, l.log_level, l.stream, l.container_id, c.name as container_name, c.image as container_image, c.status as container_status, c.host_ip, c.host_port
  //     FROM logs l
  //     INNER JOIN containers c
  //     ON l.container_id = c.container_id
  //     WHERE ?`
  //   );

  //   for (let i = 0; i < filterProps.length; i++) {
  //     if (i === 0) filterParams += `${filterProps[i]}=${arg.filterProps[0]}`;
  //     else filterParams += ` AND ${filterProps[i]}=${arg.filterProps[0]}`;
  //     multiPropObj[filterProps[i]] = multiValueQuery.run(filterParams);
  //   }

  //   multiValueQuery.run(filterParams);
  //   event.returnValue([multiPropObj]);
  // }
});
