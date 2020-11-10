const mongoose = require('mongoose');

const url = 'mongodb://127.0.0.1:27017/dockter';

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .catch((err) => console.log(err));

const db = mongoose.connection;

db.once('open', () => {
  console.log('Database connected: ', url);
});

db.on('error', (err) => {
  console.error('connection error: ', url);
});

export { db };
