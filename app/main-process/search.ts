import { ipcMain } from 'electron';
import Log from '../models/logModel';

ipcMain.on('search', (event, arg) => {
  Log.find({ $text: { $search: arg } }, (err, searchCriteria) => {
    if (err) {
      console.log('ERROR: ', err);
    } else {
      event.reply('search-reply', searchCriteria);
    }
  });
});
