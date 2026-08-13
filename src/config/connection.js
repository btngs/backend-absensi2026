require('dotenv').config();
const mysql = require('mysql2/promise');

console.log({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
});

const conn = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.PORT),
    ssl: {
        rejectUnauthorized: false
    },
    connectTimeout: 20000,
    waitForConnections: true,
    connectionLimit: 50,
    queueLimit: 0
});

module.exports =  conn;