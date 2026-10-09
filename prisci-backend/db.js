const mysql = require('mysql2');
<<<<<<< HEAD
=======

>>>>>>> 4196a602867e7104e779591907fb7cb3273e9f79
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',      
  password: '',      
  database: 'prisci_db' 
});

module.exports = db.promise();