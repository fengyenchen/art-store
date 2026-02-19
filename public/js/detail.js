/**
 * ===========================
 * 商品細節彈窗模組
 * ===========================
 * 職責：
 * 1) 建立/維護細節彈窗 DOM
 * 2) 管理目前選中商品狀態
 * 3) 依選擇重新渲染內容（文字、價格、圖片）
 */

// detailState：目前彈窗的唯一狀態來源（single source of truth）
let detailState = null;

/**
 * 建立細節彈窗（只建立一次）並綁定事件。
 *
 * - 若 DOM 已存在，直接返回，避免重複綁定事件。
 * - 點 overlay 可關閉。
 * - drawer 內部用事件委派處理：關閉、切換選項、加入購物車。
 */
function ensureProductDetailUI() {
    if (document.getElementById('product-detail-drawer')) {
        return;
    }

    const overlay = document.createElement('div');
    overlay.id = 'product-detail-overlay';
    overlay.className = 'product-detail-overlay hidden';

    const drawer = document.createElement('aside');
    drawer.id = 'product-detail-drawer';
    drawer.className = 'product-detail-drawer hidden';
    drawer.innerHTML = `
        <div class="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 class="text-lg font-black">商品細節</h3>
            <button type="button" class="cart-remove-btn text-xl js-close-detail" aria-label="關閉細節">✕</button>
        </div>
        <div id="product-detail-content" class="p-6 space-y-4 overflow-y-auto"></div>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(drawer);

    // 點外層遮罩關閉
    overlay.addEventListener('click', closeProductDetail);

    // 以事件委派集中處理 drawer 內所有點擊
    drawer.addEventListener('click', (event) => {
        const closeButton = event.target.closest('.js-close-detail');
        if (closeButton) {
            closeProductDetail();
            return;
        }

        const optionButton = event.target.closest('.js-detail-option');
        if (optionButton && detailState) {
            const nextIndex = Number(optionButton.dataset.optionIndex || 0);

            // 記錄目前選中索引，並同步回來源卡片（下次打開時可保留選項）
            detailState.selectedIndex = nextIndex;
            if (detailState.cardEl) {
                detailState.cardEl.dataset.selectedOptionIndex = String(nextIndex);
            }
            renderProductDetailContent();
            return;
        }

        const addButton = event.target.closest('.js-detail-add-btn');
        if (addButton && detailState) {
            // 以目前選中商品為主，若索引失效則退回第一項
            const selected = detailState.products[detailState.selectedIndex] || detailState.products[0];
            if (!selected) {
                return;
            }

            addToCart(selected.summary, Number(selected.price));
        }
    });
}

/**
 * 開啟細節彈窗並寫入狀態。
 *
 * @param {Object} detailPayload - 由 gallery 模組傳入的資料
 */
function openProductDetail(detailPayload) {
    ensureProductDetailUI();

    detailState = {
        title: detailPayload.title,
        subtitle: detailPayload.subtitle,
        image_url: detailPayload.image_url,
        description: detailPayload.description,
        products: detailPayload.products || [],
        selectedIndex: Number(detailPayload.selectedIndex ?? 0),
        cardEl: detailPayload.cardEl || null
    };

    renderProductDetailContent();

    const overlay = document.getElementById('product-detail-overlay');
    const drawer = document.getElementById('product-detail-drawer');

    overlay.classList.remove('hidden');
    drawer.classList.remove('hidden');
}

/**
 * 依 detailState 重新渲染彈窗內容。
 *
 * 重點：
 * - 使用 safeIndex 防止 selectedIndex 越界
 * - 使用 selected 作為本次畫面主資料
 * - activeImage 會優先用商品圖，再 fallback 到版本圖
 */
function renderProductDetailContent() {
    if (!detailState) {
        return;
    }

    const content = document.getElementById('product-detail-content');

    // 防越界：把 selectedIndex 限制在 0 ~ products.length-1
    const safeIndex = Math.max(0, Math.min(detailState.selectedIndex, detailState.products.length - 1));

    // 優先使用 safeIndex 對應商品，找不到才退第一筆
    const selected = detailState.products[safeIndex] || detailState.products[0];

    if (!selected) {
        content.innerHTML = `
            <p class="text-sm text-gray-500">目前沒有可選擇的商品。</p>
        `;
        return;
    }

    detailState.selectedIndex = safeIndex;

    // 先用 selected.image_url，再退回 detailState.image_url
    const activeImage = resolveDetailImage(selected.image_url, detailState.image_url);

    content.innerHTML = `
        <div class="product-detail-layout">
            <img src="${escapeDetailHtml(activeImage)}" alt="${escapeDetailHtml(detailState.title)} ${escapeDetailHtml(detailState.subtitle)}" class="product-detail-image w-full aspect-square object-cover rounded-2xl bg-gray-100">

            <div class="product-detail-main">
                <div>
                    <h4 class="text-xl font-black">${escapeDetailHtml(detailState.title)}</h4>
                    <p class="text-yellow-600 text-[10px] font-bold uppercase tracking-widest mt-1">${escapeDetailHtml(detailState.subtitle)}</p>
                    
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="font-bold text-gray-700">${escapeDetailHtml(selected.type)}</p>
                        </div>
                        <p class="text-2xl font-black text-gray-900">$${selected.price}</p>
                    </div>
                    
                    <p class="text-sm text-gray-500 mt-3 leading-relaxed">${escapeDetailHtml(detailState.description)}</p>
                </div>

                <div class="space-y-2">
                    ${detailState.products.map((product, index) => `
                        <button type="button"
                            class="product-detail-option js-detail-option ${index === detailState.selectedIndex ? 'is-selected' : ''}"
                            data-option-index="${index}">
                            <span class="font-medium text-gray-600">${escapeDetailHtml(product.type)}</span>
                            <span class="font-black text-gray-900">$${product.price}</span>
                        </button>
                    `).join('')}
                </div>

                <button type="button" class="product-detail-add-btn js-detail-add-btn">
                    + 加入購物車
                </button>
            </div>
        </div>
    `;
}

/**
 * 關閉彈窗（保留 DOM，僅切換 hidden class）
 */
function closeProductDetail() {
    const overlay = document.getElementById('product-detail-overlay');
    const drawer = document.getElementById('product-detail-drawer');

    if (!overlay || !drawer) {
        return;
    }

    overlay.classList.add('hidden');
    drawer.classList.add('hidden');
}

/**
 * 文字 escape：避免使用者資料直接插入 innerHTML 造成風險。
 *
 * @param {any} value
 * @returns {string}
 */
function escapeDetailHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

/**
 * 細節圖解析規則：
 * 1) 商品圖存在就用商品圖
 * 2) 商品圖為空則用版本圖
 *
 * @param {string} selectedImage
 * @param {string} fallbackImage
 * @returns {string}
 */
function resolveDetailImage(selectedImageUrl, fallbackImageUrl) {
    const primary = String(selectedImageUrl || '');
    const fallback = String(fallbackImageUrl || '');

    if (!primary) {
        return fallback;
    }

    return primary;
}