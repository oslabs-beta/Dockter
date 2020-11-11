import { ipcMain } from 'electron';
import Log from '../models/logModel';

ipcMain.on('scroll', (event, arg) => {
  const { filterOptions, nin } = arg;
  const filterProps = [];
  Object.keys(filterOptions).forEach((key) => {
    if (key === 'timestamp' && filterOptions[key].to) filterProps.push(key);
    else if (filterOptions[key].length !== 0 && key !== 'timestamp')
      filterProps.push(key);
  });
  if (!filterProps.length) {
    Log.find({ _id: { $nin: nin } })
      .sort({ timestamp: -1 })
      .limit(10)
      .exec((err, logs) => {
        if (err) console.log(err);
        else {
          const scrollReply = logs.map((log) => {
            return {
              ...log,
              _id: log._id.toString(),
              _doc: { ...log._doc, _id: log._id.toString() },
            };
          });

          event.reply('scroll-reply', scrollReply);
        }
      });
  } else {
    const query = [];
    for (let i = 0; i < filterProps.length; i++) {
      if (filterProps[i] === 'timestamp') {
        query.push({
          timestamp: {
            $gte: new Date(filterOptions.timestamp.from),
            $lte: new Date(filterOptions.timestamp.to),
          },
        });
        break;
      }
      if (filterProps[i] === 'private_port') {
        for (let j = 0; j < filterOptions.private_port.length; j++) {
          query.push({
            'ports.PrivatePort': parseInt(filterOptions.private_port[j]),
          });
        }
        break;
      }

      if (filterProps[i] === 'public_port') {
        for (let j = 0; j < filterOptions.public_port.length; j++) {
          query.push({
            'ports.PublicPort': parseInt(filterOptions.public_port[j]),
          });
        }
        break;
      }
      if (filterProps[i] === 'host_ip') {
        for (let j = 0; j < filterOptions.host_ip.length; j++) {
          query.push({ 'ports.IP': filterOptions.host_ip[j] });
        }
        break;
      }
      for (let j = 0; j < filterOptions[filterProps[i]].length; j++) {
        query.push({ [filterProps[i]]: filterOptions[filterProps[i]][j] });
      }
    }
    console.log('NOT IN', nin);
    Log.find({ $or: query, _id: { $nin: nin } })
      .sort({ timestamp: -1 })
      .limit(10)
      .exec((err, logs) => {
        if (err) {
          console.log('ERROR HYD', err);
        } else {
          event.reply(
            'scroll-reply',
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
