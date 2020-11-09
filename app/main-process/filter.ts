/* eslint-disable */
import { ipcMain } from 'electron';
import { db } from './db.ts';
const Log = require('../models/logModel');
const mongoose = require('mongoose');

console.log('THIS IS DB HYD', db);

ipcMain.on('filter', (event, arg) => {
  console.log('arg: ', arg);
  const filterProps = [];
  const argKeys = Object.keys(arg);
  argKeys.forEach((key) => {
    if (key === 'timestamp' && arg[key].to) filterProps.push(key);
    else if (arg[key].length !== 0 && key !== 'timestamp')
      filterProps.push(key);
    console.log('filterProps: ', filterProps);
  });
  // Need some sort of logic within this conditional in order to not throw Mongo ERROR
  if (filterProps.length === 0) {
    Log.find({}, (err, logs) => {
      if (err) {
        console.log('ERROR: ', err);
      } else {
        event.reply('reply-filter', logs);
      }
    });
  } else {
    const query = [];
    for (let i = 0; i < filterProps.length; i++) {
      if (filterProps[i] === 'timestamp') {
        query.push({
          timestamp: {
            $gte: new Date(arg.timestamp.from),
            $lte: new Date(arg.timestamp.to),
          },
        });
        break;
      }
      if (filterProps[i] === 'private_port') {
        for (let j = 0; j < arg.private_port.length; j++) {
          query.push({ ports.PrivatePort : arg.private_port[j] });
        }
        break;
      }

      if (filterProps[i] === 'public_port'){
        for (let j = 0; j < arg.public_port.length; j++) {
          query.push({ ports.PublicPort : arg.public_port[j] });
        }
        break;
      }
      if (filterProps[i] === 'host_ip'){
        for (let j = 0; j < arg.host_ip.length; j++) {
          query.push({ ports.IP : arg.host_ip[j] });
        }
        break;
      }
        for (let j = 0; j < arg[filterProps[i]].length; j++) {
          query.push({ [filterProps[i]]: arg[filterProps[i]][j] });
        }

    }
    console.log('QUERY HYD:', query);
    Log.find({ $or: query }, (err, logs) => {
      console.log('IM IN LOG.FIND');
      if (err) {
        console.log('ERROR HYD', err);
      } else {
        console.log('LOGGYGUY', logs);
        event.reply('reply-filter', logs);
      }
    });
  }
});
