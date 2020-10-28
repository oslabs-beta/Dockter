/* eslint-disable */
import { ipcMain } from 'electron';
import { db } from './db.ts';

ipcMain.on('filter', (event, arg) => {
  console.log('arg: ', arg);
  const filterProps = [];
  // when we get arg from ipcRender process, loop thru and check to see if key val is not zero
  // if so push key into filterprops arr
  const argKeys = Object.keys(arg);

  argKeys.forEach((key) => {
    if (arg[key].length !== 0 && key !== 'timestamp') filterProps.push(key);
  });

  console.log('filterProps: ', filterProps);
  // check to see if there is only one item in filterProps, and if there is, make a query with that item
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
    //TODO: Need to add more logic for instances in which an arrays value holds more than one prop
    // if (filterProps.length === 1 && filterProps[0] !== 'timestamp') {
    //   const containerProps = ['name', 'image', 'status', 'host_ip', 'host_port'];
    //   let prefix = containerProps.includes(filterProps[0]) ? 'c.' : 'l.';
    //   let key = prefix + filterProps[0];
    //   let argKey = arg[filterProps[0]];

    //   // const singlePropObj = {};
    //   db.all(
    //     `SELECT l._id, l.message, l.timestamp, l.log_level, l.stream, l.container_id, c.name as container_name, c.image as container_image, c.status as container_status, c.host_ip, c.host_port
    //       FROM logs l
    //       INNER JOIN containers c
    //       ON l.container_id = c.container_id
    //       WHERE ${key} = ?`,
    //     [argKey[0]],
    //     (error, rows) => {
    //       if (error) console.log('ERROR', error);
    //       event.reply('reply-filter', rows);
    //     }
    //   );
    // } else if (filterProps.length > 1 && !filterProps.includes('timestamp')) {
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
        console.log('problem my guy: ', arg[filterProps[i]][j]);
        params.push(arg[filterProps[i]][j]);
      }
      queryExtension += ')';
      query += queryExtension;
      queryExtension = '';
    }
    console.log('query: ', query + queryExtension);
    console.log('chicken params: ', params);

    db.all(query, params, (error, rows) => {
      if (error) console.log('ERROR', error);
      event.reply('reply-filter', rows);
    });
  }

  // filterProps.forEach((key, i) => {
  //   //TODO: need to check array at arg[key] if array has more than one property
  //   //arg[key] =filterOptions[key]
  //   //needs logic for timestamp
  //   const containerProps = [
  //     'name',
  //     'image',
  //     'status',
  //     'host_ip',
  //     'host_port',
  //   ];
  //   let prefix = containerProps.includes(filterProps[i]) ? 'c.' : 'l.';
  //   if (i === 0) {
  //     // params.push(key);
  //     params.push(arg[key]);
  //     queryExtension += `${prefix + key} = ?`;
  //   } else {
  //     // params.push(key);
  //     params.push(arg[key]);
  //     queryExtension += ` AND ${prefix + key} = ?`;
  //   }
  // });
});
/*


filterProps = [containerid]
filterOptions = {
  ...filterOptions,
  containerid: ['1', '2'],
  stream: ['stdout', 'stderr']
}

query = 'select..... FROM ... WHERE '
'WHERE containerid IN (??) AND stream in (?, ?)'
queryExtension = ''

loop through filter props to check for which filterOptions key
  when iterating add AND logic for every change to filterProp focus
loop through containerid
EX:
  let queryExtension = `filterProps[0] IN (`'
  for (let i = 0; i = containerId.length; i++) {
    queryExtension += ` ?,`
  }
if (filterProps.length > 1 )
  queryExtension += `) AND `


for (loop through filterProps){
if (i: filterProps[i] > 0) queryExtension += AND

  for (j: loop through filterOptions[filterProps[i]]){
 if(j === 0)queryExtension += `filterProps[0] IN (`'

    queryExtension += ` ?,`
  }

query + query extension
}































*/
// SELECT l._id, l.message, l.timestamp, l.log_level, l.stream, l.container_id, c.name as container_name, c.image as container_image, c.status as container_status, c.host_ip, c.host_port
// FROM logs l
// INNER JOIN containers c
// ON l.container_id = c.container_id;

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
