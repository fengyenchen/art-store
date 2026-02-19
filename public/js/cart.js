/**
 * ===========================
 * 購物車邏輯模組
 * ===========================
 * 
 * 功能：
 * - 新增商品至購物車
 * - 更新購物車 UI（項目列表、總價、數量徽章）
 * - 刪除購物車項目
 * 
 * 資料流：
 * addToCart() → 更新 cart 陣列 → updateCartUI() → 更新畫面
 */

/**
 * 將商品加入購物車
 * 
 * 商品資料會被包裝成物件並推入 cart 陣列
 * 每次加入後自動觸發 UI 更新
 * 
 * @param {string} summary - 商品完整描述 (格式：「作品名 - 版本 - 商品類型」)
 * @param {number} price - 商品價格
 * 
 * 範例：
 * addToCart('Void - Edition #08/48 - T-Shirt', 890)
 */
function addToCart(summary, price) {
    // 取得全域購物車陣列
    const cart = getCart();

    // 將商品資訊推入購物車
    cart.push({
        summary: summary,  // 商品描述
        price: price       // 商品價格
    });

    // 立即更新購物車 UI
    updateCartUI();

    // 可選：加入後自動打開購物車抽屜，提升使用者體驗
    // openCart();
}

/**
 * 更新購物車 UI
 * 
 * 更新內容：
 * 1. 導覽列購物車數量徽章
 * 2. 購物車抽屜內的商品列表
 * 3. 總價顯示
 * 
 * UI 邏輯：
 * - 若購物車為空：顯示「您的購物籃是空的」
 * - 若有商品：顯示商品列表 + 刪除按鈕
 */
function updateCartUI() {
    // DOM 元素參考
    const container = document.getElementById('cart-items');      // 購物車項目容器
    const totalDisplay = document.getElementById('total-price');  // 總價顯示區
    const cartCount = document.getElementById('cart-count');      // 數量徽章

    // 取得目前購物車內容
    const cart = getCart();

    // 更新導覽列的購物車數量徽章
    cartCount.innerText = `(${cart.length})`;

    // 情況一：購物車為空
    if (cart.length === 0) {
        container.innerHTML = '<p class="text-gray-400 text-center py-10 text-sm italic">您的購物籃是空的</p>';
        totalDisplay.innerText = '$0';
        return;
    }

    // 情況二：購物車有商品 - 渲染商品列表
    container.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <!-- 商品資訊區 -->
            <div>
                <!-- 商品完整描述 -->
                <p class="text-[10px] font-bold text-gray-900 leading-tight">
                    ${item.summary}
                </p>
                
                <!-- 商品價格 -->
                <p class="text-xs font-black text-yellow-600 mt-1">
                    $${item.price}
                </p>
            </div>
            
            <!-- 刪除按鈕：傳入當前項目的索引 -->
            <button onclick="removeItem(${index})" class="cart-remove-btn">✕</button>
        </div>
    `).join('');

    // 計算總價：使用 reduce() 累加所有商品價格
    const total = cart.reduce((sum, item) => sum + item.price, 0);

    // 更新總價顯示
    totalDisplay.innerText = `$${total}`;
}

/**
 * 從購物車移除指定項目
 * 
 * 使用 splice() 方法刪除陣列中的元素
 * 刪除後立即更新 UI
 * 
 * @param {number} index - 要刪除的商品在 cart 陣列中的索引
 */
function removeItem(index) {
    // 取得購物車陣列
    const cart = getCart();

    // 從陣列中移除指定索引的項目
    // splice(index, 1) 表示從 index 位置開始，刪除 1 個元素
    cart.splice(index, 1);

    // 刪除後更新 UI
    updateCartUI();
}
