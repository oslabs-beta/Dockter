/* eslint-disable */
import { ipcMain } from 'electron';
import { db } from './db.ts';

ipcMain.on('filter', (event, arg) => {
  const filterProps = [];
  const argKeys = Object.keys(arg);

  argKeys.forEach((key) => {
    if (arg[key].length !== 0 && key !== 'timestamp') filterProps.push(key);
  });

  if (filterProps.length === 0) {
    db.all(
      `SELECT l._id, l.message, l.timestamp, l.log_level, l.stream, l.container_id, c.name as container_name, c.image as container_image, c.status as container_status, c.host_ip, c.host_port
        FROM logs l
        INNER JOIN containers c
        ON l.container_id = c.container_id`,
      (error, rows) => {
        if (error) console.log('ERROR', error);
        event.reply('reply-filter', rows);
      }
    );
  } else {
    let query = `SELECT l._id, l.message, l.timestamp, l.log_level, l.stream, l.container_id, c.name as container_name, c.image as container_image, c.status as container_status, c.host_ip, c.host_port
       FROM logs l
       INNER JOIN containers c
       ON l.container_id = c.container_id WHERE `;

    let queryExtension = '';
    const params = [];
    for (let i = 0; i < filterProps.length; i++) {
      if (i > 0) {
        queryExtension += ` AND `;
      }
      for (let j = 0; j < arg[filterProps[i]].length; j++) {
        const containerProps = [
          'name',
          'image',
          'status',
          'host_ip',
          'host_port',
        ];
        let prefix = containerProps.includes(filterProps[i]) ? 'c.' : 'l.';
        if (j === 0) queryExtension += `${prefix + filterProps[i]} IN (`;
        queryExtension += ' ?';
        if (arg[filterProps[i]][j + 1]) queryExtension += ',';
        params.push(arg[filterProps[i]][j]);
      }
      queryExtension += ')';
      query += queryExtension;
      queryExtension = '';
    }
    db.all(query, params, (error, rows) => {
      if (error) console.log('ERROR', error);
      event.reply('reply-filter', rows);
    });
  }
});

// TIMESTAMP LOGIC
// else if (filterProps.length === 1 && filterProps[0] === 'timestamp') {
//   let argKey = arg.timestamp;
//   const fromTime = argKey.from;
//   console.log('from: ', fromTime);
//   const toTime = argKey.to;
//   console.log('to: ', toTime);
//   // const singlePropObj = {};
//   db.all(
//     `SELECT l._id, l.message, l.timestamp, datetime('now') as timetell, l.log_level, l.stream, l.containerid, c.name as container_name, c.image as container_image, c.status as container_status, c.host_ip, c.host_port
//       FROM logs l
//       INNER JOIN containers c
//       ON l.containerid = c.container_id
//       WHERE l.timestamp BETWEEN Datetime('2020-10-21T01:03') and Datetime('2020-10-23T13:02')`,
//     // [fromTime, toTime],
//     (error, rows) => {
//       if (error) console.log('ERROR', error);
//       event.reply('reply-filter', rows);
//     }
//   );
