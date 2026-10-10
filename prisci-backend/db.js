const mysql = require('mysql2');
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',      
  password: '',      
  database: 'prisci_db' 
});

module.exports = db.promise();