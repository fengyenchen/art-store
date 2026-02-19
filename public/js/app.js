/**
 * ===========================
 * 應用程式初始化模組
 * ===========================
 * 
 * 功能：
 * - 當頁面載入完成後執行初始化邏輯
 * - 抓取作品資料並渲染藝廊
 * - 初始化購物車 UI
 * 
 * 執行順序：
 * 1. 頁面 DOM 載入完成
 * 2. 執行 init()
 * 3. fetchGallery() 抓取資料
 * 4. updateCartUI() 初始化購物車顯示
 * 
 * 模組載入順序要求：
 * 此檔案必須最後載入，確保其他模組的函式都已定義
 */

/**
 * 應用程式初始化函式
 * 
 * 會在頁面載入完成後自動執行
 * 負責觸發所有必要的初始化動作
 */
function init() {
    // 從後端 API 抓取作品資料並渲染至頁面
    fetchGallery();

    // 初始化購物車 UI（確保數量徽章顯示正確）
    updateCartUI();
}

// 當頁面載入完成後執行初始化
// DOMContentLoaded 確保 HTML 元素都已載入完成
document.addEventListener('DOMContentLoaded', init);
