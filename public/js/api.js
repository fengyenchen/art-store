/**
 * ===========================
 * API 資料抓取模組
 * ===========================
 * 
 * 功能：
 * - 從後端 API 抓取作品資料
 * - 處理資料抓取錯誤
 * - 觸發藝廊渲染
 * 
 * API 回傳資料結構：
 * artworks: [
 *   {
 *     title: "系列名稱",
 *     editions: [
 *       {
 *         subtitle: "版本編號",
 *         image: "圖片網址",
 *         description: "描述文字",
 *         products: [
 *           { type: "商品類型", price: 價格, summary: "完整描述" }
 *         ]
 *       }
 *     ]
 *   }
 * ]
 */

/**
 * 從後端 API 抓取作品資料並渲染至頁面
 * 
 * 流程：
 * 1. 發送 HTTP GET 請求至 /api/artworks
 * 2. 將回應的 JSON 資料解析
 * 3. 呼叫 renderGallery() 渲染至頁面
 * 4. 若發生錯誤，在 console 顯示錯誤訊息
 * 
 * @async
 * @throws {Error} 當 API 請求失敗時
 */
async function fetchGallery() {
    try {
        // 向本地後端 API 發送請求
        const response = await fetch('http://localhost:3001/api/artworks');

        // 將回應解析為 JSON 格式
        const artworks = await response.json();

        // 呼叫渲染函式，將資料顯示於頁面
        renderGallery(artworks);
    } catch (error) {
        // 若發生錯誤（如網路問題、伺服器未啟動），在 console 顯示
        console.error('❌ 作品資料抓取失敗:', error);

        // 可選：顯示使用者友善的錯誤訊息
        // alert('無法載入作品資料，請確認伺服器是否已啟動');
    }
}
