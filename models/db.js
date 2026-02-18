const mysql = require('mysql2');
require('dotenv').config(); // 讀取 .env 檔案中的設定

// 建立連線池，提升點單系統在多人同時使用時的穩定性
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// 匯出 promise 版本，方便在 server.js 使用 async/await 語法
module.exports = pool.promise();