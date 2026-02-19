/**
 * ===========================
 * UI 控制模組
 * ===========================
 * 
 * 功能：
 * - 控制購物車抽屜的開啟與關閉
 * - 管理遮罩層的顯示狀態
 * 
 * 設計原則：
 * - 使用 CSS class 控制顯示/隱藏
 * - translate-x-full：將抽屜推出視窗外
 * - hidden：隱藏遮罩層
 */

/**
 * 開啟購物車抽屜
 * 
 * 動作：
 * 1. 顯示半透明黑色遮罩（點擊可關閉）
 * 2. 將購物車抽屜從右側滑入
 * 
 * 實作方式：
 * - 移除 'hidden' class → 遮罩顯示
 * - 移除 'translate-x-full' class → 抽屜滑入（從 translateX(100%) 變為 0）
 */
function openCart() {
    // 顯示遮罩層（半透明黑色背景）
    document.getElementById('cart-overlay').classList.remove('hidden');

    // 將購物車抽屜滑入畫面
    // translate-x-full 會將元素往右推 100%（完全移出視窗）
    // 移除此 class 後，元素會回到原位置（transition 提供動畫效果）
    const cartDrawer = document.getElementById('cart-drawer');
    cartDrawer.classList.remove('translate-x-full');
    cartDrawer.classList.remove('opacity-0');
}

/**
 * 關閉購物車抽屜
 * 
 * 動作：
 * 1. 隱藏遮罩層
 * 2. 將購物車抽屜滑出至右側隱藏
 * 
 * 觸發時機：
 * - 點擊遮罩層（onclick="closeCart()"）
 * - 點擊關閉按鈕（✕）
 */
function closeCart() {
    // 隱藏遮罩層
    document.getElementById('cart-overlay').classList.add('hidden');

    // 將購物車抽屜滑出畫面
    // 加上 translate-x-full 會將元素往右推 100%（完全移出視窗）
    const cartDrawer = document.getElementById('cart-drawer');
    cartDrawer.classList.add('translate-x-full');
    cartDrawer.classList.add('opacity-0');
}
