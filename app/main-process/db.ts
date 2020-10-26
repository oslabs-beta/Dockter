const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('.db/database.sqlite3', (err) => {
  if (err) {
    console.log(err.message);
  }
  console.log('Connected to SQLite DB');
});

db.serialize(() => {
  db.run(
    `CREATE TABLE containers (
      _id SERIAL PRIMARY KEY,
      container_id VARCHAR(255),
      name VARCHAR(255),
      image VARCHAR(255),
      status VARCHAR(255),
      host_ip VARCHAR(255),
      host_port VARCHAR(255),
    )`
  );
  db.run(
    `CREATE TABLE logs (
      _id SERIAL PRIMARY KEY,
      container_id VARCHAR(255),
      message VARCHAR(255),
      timestamp VARCHAR(255),
      log_level VARCHAR(255),
      stream VARCHAR(255),
      FOREIGN KEY (container_id) REFERENCES containers(container_id)
    )`
  );
})

db.close((err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Close the database connection.');
});

export { db };