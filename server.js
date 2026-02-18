const express = require('express');
const cors = require('cors');
const db = require('./models/db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

// 中間件設定
app.use(cors()); // 允許跨來源請求，讓前端網頁可以存取這個 API
app.use(express.json()); // 解析 JSON 格式的請求
app.use(express.static('public')); // 設定靜態檔案資料夾（放 index.html 用）

// 取得所有菜單品項的 API
app.get('/api/menu', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM menu');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: '資料庫查詢失敗' });
    }
});

// 啟動伺服器
app.listen(PORT, () => {
    console.log(`伺服器已啟動：http://localhost:${PORT}`);
});