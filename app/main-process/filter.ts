/* eslint-disable */
import { ipcMain } from 'electron';
import { db } from './db.ts';
import Log from '../models/logModel';

//TODO: Figure out better way to instantiate database
console.log('DB: ', db);

ipcMain.on('filter', (event, arg) => {
  console.log('this is arg', arg);
  const filterOptions = arg;
  const filterProps = [];
  Object.keys(filterOptions).forEach((key) => {
    if (key === 'timestamp' && filterOptions[key].to) filterProps.push(key);
    else if (filterOptions[key].length !== 0 && key !== 'timestamp')
      filterProps.push(key);
  });
  // Need some sort of logic within this conditional in order to not throw Mongo ERROR
  if (filterProps.length === 0) {
    Log.find({})
      .sort({ timestamp: -1 })
      .limit(50)
      .exec((err, logs) => {
        if (err) console.log(err);
        else {
          event.reply(
            'reply-filter',
            logs.map((log) => {
              return {
                ...log,
                _id: log._id.toString(),
                _doc: { ...log._doc, _id: log._id.toString() },
              };
            })
          );
        }
      });
  } else {
    const query = {};
    const filterQuery = [];
    let searchFlag = false;
    for (let i = 0; i < filterProps.length; i++) {
      if (filterProps[i] === 'timestamp') {
        filterQuery.push({
          timestamp: {
            $gte: new Date(filterOptions.timestamp.from),
            $lte: new Date(filterOptions.timestamp.to),
          },
        });
        break;
      }
      if (filterProps[i] === 'private_port') {
        for (let j = 0; j < filterOptions.private_port.length; j++) {
          filterQuery.push({
            'ports.PrivatePort': parseInt(filterOptions.private_port[j]),
          });
        }
        break;
      }

      if (filterProps[i] === 'public_port') {
        for (let j = 0; j < filterOptions.public_port.length; j++) {
          filterQuery.push({
            'ports.PublicPort': parseInt(filterOptions.public_port[j]),
          });
        }
        break;
      }
      if (filterProps[i] === 'host_ip') {
        for (let j = 0; j < filterOptions.host_ip.length; j++) {
          filterQuery.push({ 'ports.IP': filterOptions.host_ip[j] });
        }
        break;
      }
      if (filterProps[i] === 'search') {
        searchFlag = true;
        break;
      }
      for (let j = 0; j < filterOptions[filterProps[i]].length; j++) {
        filterQuery.push({
          [filterProps[i]]: filterOptions[filterProps[i]][j],
        });
      }
    }

    if (filterQuery.length) query.$and = filterQuery;
    if (searchFlag) query.$text = { $search: filterOptions.search };

    Log.find(query)
      .sort({ timestamp: -1 })
      .limit(100)
      .exec((err, logs) => {
        if (err) {
          console.log('ERROR HYD', err);
        } else {
          event.reply(
            'reply-filter',
            logs.map((log) => {
              return {
                ...log,
                _id: log._id.toString(),
                _doc: { ...log._doc, _id: log._id.toString() },
              };
            })
          );
        }
      });
  }
});
