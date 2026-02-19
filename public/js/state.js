/**
 * ===========================
 * 全域狀態管理模組
 * ===========================
 * 
 * 功能：
 * - 維護購物車陣列 (cart)
 * - 提供狀態存取介面
 * 
 * 設計原則：
 * - 使用單一資料來源 (Single Source of Truth)
 * - 所有購物車操作都透過此模組進行
 */

// 購物車陣列：儲存使用者選購的商品
// 每個項目格式：{ summary: "作品-版本-商品類型", price: 數字 }
let cart = [];

/**
 * 取得目前購物車內容
 * @returns {Array} 購物車陣列
 */
function getCart() {
    return cart;
}

/**
 * 設定購物車內容（用於批次更新）
 * @param {Array} newCart - 新的購物車陣列
 */
function setCart(newCart) {
    cart = newCart;
}
