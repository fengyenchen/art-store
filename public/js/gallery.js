/**
 * ===========================
 * 藝廊渲染模組
 * ===========================
 * 
 * 功能：
 * - 將作品資料動態生成 HTML 卡片
 * - 渲染至頁面的藝廊容器中
 * - 以事件委派處理「加入購物車 / 商品細節」點擊行為
 * 
 * 渲染規則：
 * - 每個 edition（版本）獨立顯示為一張卡片
 * - 卡片內包含圖片、標題、版本編號、描述、商品選項列
 * - 點擊整張卡片：開啟商品細節（預設使用第一個商品，或上次選擇）
 * - 點擊 + 旁邊按鈕：先設定目前選擇，再開啟該商品細節
 * - 點擊 +：直接加入購物車
 * - 使用多層 map() 巢狀處理：artworks > editions > products
 */

/**
 * 將作品資料渲染成藝廊卡片
 * 
 * 資料結構說明：
 * - 外層 map(art => ...): 處理每個作品系列
 * - 內層 map(ed => ...): 處理該系列的每個版本
 * - 最內層 map(item => ...): 處理該版本的每個商品選項
 * 
 * 點擊互動規則：
 * - `js-add-to-cart`：加入該列商品
 * - `js-open-detail`：記錄該列為目前選擇並開細節
 * - `js-art-card` 空白區域：開目前選擇，若無則用第一列
 * 
 * @param {Array} artworks - 從 API 取得的作品陣列
 */
function renderGallery(artworks) {
    // 取得頁面上的藝廊容器元素
    const container = document.getElementById('gallery-container');

    // 使用 map() 將資料轉換為 HTML 字串
    container.innerHTML = artworks.map(art =>
        // 處理每個作品的所有版本 (editions)
        art.editions.map(ed => {
            const coverImage = ed.image_url || (ed.products[0] && ed.products[0].image_url) || '';
            return `
            <div class="meals-card-container rounded-3xl group js-art-card">
                <!-- 作品圖片區：使用 aspect-square 保持 1:1 比例 -->
                <div class="aspect-square overflow-hidden bg-gray-100">
                    <img src="${coverImage}" 
                         class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                         alt="${art.title} - ${ed.subtitle}">
                </div>
                
                <!-- 作品資訊區 -->
                <div class="p-8">
                    <!-- 作品系列標題 -->
                    <h4 class="font-black text-xl mb-1">${art.title}</h4>
                    
                    <!-- 版本編號 (如 Edition #08/48) -->
                    <p class="text-yellow-600 text-[10px] font-bold uppercase tracking-widest mb-4">
                        ${ed.subtitle}
                    </p>
                    
                    <!-- 作品描述 -->
                    <p class="text-xs text-gray-400 mb-6 font-light leading-relaxed">
                        ${ed.description}
                    </p>
                    
                    <!-- 商品選項按鈕群 -->
                    <div class="space-y-2">
                        ${ed.products.map((item, index) => `
                            <div class="art-option-row"
                                data-option-index="${index}"
                                data-summary="${escapeHtml(item.summary)}"
                                data-price="${item.price}"
                                data-title="${escapeHtml(art.title)}"
                                data-subtitle="${escapeHtml(ed.subtitle)}"
                                data-type="${escapeHtml(item.type)}"
                                data-image-url="${escapeHtml(item.image_url || ed.image_url || '')}"
                                data-description="${escapeHtml(ed.description || art.description || '')}">
                                <button type="button" class="art-plus-btn js-add-to-cart" aria-label="加入購物車">+</button>
                                <button type="button" class="art-detail-trigger js-open-detail" aria-label="查看商品細節">
                                    <span class="font-medium text-gray-600">${item.type}</span>
                                    <span class="font-black text-gray-900">$${item.price}</span>
                                </button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        }).join('') // 將同一作品的多個版本合併成字串
    ).join(''); // 將所有作品合併成最終 HTML

    bindGalleryEvents(container);
}

function bindGalleryEvents(container) {
    if (container.dataset.eventsBound === 'true') {
        return;
    }

    container.addEventListener('click', handleGalleryClick);
    container.dataset.eventsBound = 'true';
}

function handleGalleryClick(event) {
    const addButton = event.target.closest('.js-add-to-cart');
    if (addButton) {
        const row = addButton.closest('.art-option-row');
        if (!row) return;

        addToCart(row.dataset.summary, Number(row.dataset.price));
        return;
    }

    const detailButton = event.target.closest('.js-open-detail');
    if (detailButton) {
        const row = detailButton.closest('.art-option-row');
        if (!row) return;

        const card = row.closest('.js-art-card');
        if (!card) {
            return;
        }

        const selectedIndex = Number(row.dataset.optionIndex || 0);
        card.dataset.selectedOptionIndex = String(selectedIndex);

        openProductDetail(getCardDetailPayload(card, selectedIndex));
        return;
    }

    const card = event.target.closest('.js-art-card');
    if (!card) {
        return;
    }

    const clickedInsideOptionRow = event.target.closest('.art-option-row');
    if (clickedInsideOptionRow) {
        return;
    }

    const selectedIndex = Number(card.dataset.selectedOptionIndex ?? 0);
    const optionRows = card.querySelectorAll('.art-option-row');
    const rowToOpen = optionRows[selectedIndex] || optionRows[0];
    if (!rowToOpen) {
        return;
    }

    const openIndex = Number(rowToOpen.dataset.optionIndex || 0);
    card.dataset.selectedOptionIndex = String(openIndex);
    openProductDetail(getCardDetailPayload(card, openIndex));
}

function getCardDetailPayload(card, selectedIndex) {
    const optionRows = Array.from(card.querySelectorAll('.art-option-row'));
    const firstRow = optionRows[0];
    if (!firstRow) {
        return {
            title: '',
            subtitle: '',
            image_url: '',
            description: '',
            products: [],
            selectedIndex: 0,
            cardEl: card
        };
    }

    return {
        title: firstRow.dataset.title,
        subtitle: firstRow.dataset.subtitle,
        image_url: firstRow.dataset.imageUrl,
        description: firstRow.dataset.description,
        products: optionRows.map((row) => ({
            summary: row.dataset.summary,
            price: Number(row.dataset.price),
            type: row.dataset.type,
            image_url: row.dataset.imageUrl || firstRow.dataset.imageUrl || ''
        })),
        selectedIndex,
        cardEl: card
    };
}

function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}
