/* eslint-disable */
import { log } from 'console';
import { ipcMain } from 'electron';
import { db } from './db.ts';
const Log = require('../models/logModel');
const mongoose = require('mongoose');

//TODO: Figure out better way to instantiate database
console.log('THIS IS DB HYD', db);

//array to handle no duplicate logs when scrolling
const nin = [];

ipcMain.on('filter', (event, arg) => {
  console.log('arg: ', arg);
  const filterProps = [];
  const argKeys = Object.keys(arg);
  argKeys.forEach((key) => {
    if (key === 'timestamp' && arg[key].to) filterProps.push(key);
    else if (arg[key].length !== 0 && key !== 'timestamp')
      filterProps.push(key);
  });
  // Need some sort of logic within this conditional in order to not throw Mongo ERROR
  if (filterProps.length === 0) {
    Log.find({})
      .sort({ timestamp: -1 })
      .limit(10)
      .exec((err, logs) => {
        if (err) console.log(err);
        else {
          // logs.forEach((log) => nin.push(log._id));
          console.log('LOGS LENGTH TOP OF FILTER', logs.length);
          event.reply(
            'reply-filter',
            logs.map((log) => {
              console.log('logs', logs.length);
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
          query.push({ 'ports.PrivatePort': parseInt(arg.private_port[j]) });
        }
        break;
      }

      if (filterProps[i] === 'public_port') {
        for (let j = 0; j < arg.public_port.length; j++) {
          query.push({ 'ports.PublicPort': parseInt(arg.public_port[j]) });
        }
        break;
      }
      if (filterProps[i] === 'host_ip') {
        for (let j = 0; j < arg.host_ip.length; j++) {
          query.push({ 'ports.IP': arg.host_ip[j] });
        }
        break;
      }
      for (let j = 0; j < arg[filterProps[i]].length; j++) {
        query.push({ [filterProps[i]]: arg[filterProps[i]][j] });
      }
    }

    Log.find({ $or: query }, (err, logs) => {
      if (err) {
        console.log('ERROR HYD', err);
      } else {
        //TODO: delete out console.log
        console.log('LOGGYGUY', logs);
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

ipcMain.on('scroll', (event, arg) => {
  //TODO: remove console log
  console.log('this is arg', arg);
  Log.find({ _id: { $nin: arg } })
    .sort({ timestamp: -1 })
    .limit(10)
    .exec((err, logs) => {
      if (err) console.log(err);
      else {
        console.log('LOGs LENGTH', logs.length);
        logs.forEach((log) => nin.push(log._id));
        const scrollReply = logs.map((log) => {
          return {
            ...log,
            _id: log._id.toString(),
            _doc: { ...log._doc, _id: log._id.toString() },
          };
        });
        console.log('SCROLL REPLY', scrollReply.length);

        event.reply('scroll-reply', scrollReply);
      }
    });
});
