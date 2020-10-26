import { db } from './db.ts';
// let db = new sqlite3.Database('.db/database.sqlite3', (err) => {
//   if (err) {
//     console.log(err.message);
//   }
//   console.log('Connected to SQLite DB');
// });

db.serialize(() => {
  db.run(
    `CREATE TABLE containers (
      _id SERIAL PRIMARY KEY,
      containerId VARCHAR(255),
      name VARCHAR(255),
      image VARCHAR(255),
      status VARCHAR(255),
      hostIp VARCHAR(255),
      hostPort VARCHAR(255),
    )`
  )
  db.run(
    `CREATE TABLE logs (
      _id SERIAL PRIMARY KEY,
      containerId FOREIGN KEY,
      message VARCHAR(255),
      timestamp VARCHAR(255),
      logLevel VARCHAR(255),
      stream VARCHAR(255),
    )`
  )
}

db.close((err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Close the database connection.');
})

