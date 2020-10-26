const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('.db/database.sqlite3', (err) => {
  if (err) {
    console.log(err.message);
  }
  console.log('Connected to SQLite DB');
});

export { db };