const express = require('express');
const cors = require('cors');
const db = require('./models/db'); // 確保此檔案已配置連線池
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // 託管靜態資源

/**
 * 獲取所有藝術作品及其版本與週邊品項
 * 整合四表查詢：artworks -> editions -> items -> variants
 */
app.get('/api/artworks', async (req, res) => {
    try {
        const query = `
            SELECT 
                a.id AS artwork_id, a.title, a.base_description,
                e.id AS edition_id, e.subtitle, e.image_url, e.specific_description,
                i.id AS item_id, i.final_price, i.item_summary, i.stock, i.image_url AS item_image_url,
                v.product_type
            FROM artworks a
            LEFT JOIN editions e ON a.id = e.artwork_id
            LEFT JOIN items i ON e.id = i.edition_id
            LEFT JOIN variants v ON i.variant_id = v.id
            ORDER BY a.id, e.id;
        `;

        const [rows] = await db.query(query);

        // 資料聚合邏輯：將平坦的資料表結果轉換為巢狀 JSON 物件
        const artworks = rows.reduce((acc, row) => {
            // 1. 處理作品系列 (Artwork)
            let art = acc.find(a => a.id === row.artwork_id);
            if (!art) {
                art = {
                    id: row.artwork_id,
                    title: row.title,
                    description: row.base_description,
                    editions: []
                };
                acc.push(art);
            }

            // 2. 處理特定版本 (Edition / Subtitle)
            if (row.edition_id) {
                let ed = art.editions.find(e => e.id === row.edition_id);
                if (!ed) {
                    ed = {
                        id: row.edition_id,
                        subtitle: row.subtitle,
                        image_url: row.image_url,
                        description: row.specific_description,
                        products: []
                    };
                    art.editions.push(ed);
                }

                // 3. 處理具體商品品項 (Item)
                if (row.item_id) {
                    ed.products.push({
                        id: row.item_id,
                        summary: row.item_summary, // 直接使用資料庫自動生成的摘要
                        type: row.product_type,
                        price: row.final_price,
                        stock: row.stock,
                        image_url: row.item_image_url || row.image_url || ''
                    });
                }
            }
            return acc;
        }, []);

        res.json(artworks);
    } catch (err) {
        console.error('API Error:', err);
        res.status(500).json({ error: '無法獲取作品資料庫內容' });
    }
});

// 設定監聽埠口
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`伺服器運行中: http://localhost:${PORT}`);
});