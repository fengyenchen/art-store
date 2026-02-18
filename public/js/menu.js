(() => {
    async function fetchMenu() {
        try {
            const response = await fetch('http://localhost:3001/api/menu');
            const data = await response.json();
            renderMenu(data);
        } catch (error) {
            console.error('無法獲取菜單資料:', error);
            const container = document.getElementById('product-container');
            if (container) {
                container.innerHTML = '<p class="text-red-500">API 連線失敗，請檢查後端是否啟動於 3001</p>';
            }
        }
    }

    function renderMenu(items) {
        const container = document.getElementById('product-container');
        if (!container) return;

        container.innerHTML = items
            .map(
                (p) => `
          <div class="meals-card-container group fade-in">
            <a href="#" class="flex h-full flex-col">
              <div class="aspect-[4/3] overflow-hidden bg-gray-100">
                <img src="${p.image_url}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
              </div>
              <div class="p-8 flex flex-1 flex-col">
                <div class="flex justify-between items-start mb-2 gap-4">
                  <h4 class="font-bold text-gray-900 text-lg group-hover:text-primary">${p.name}</h4>
                  <span class="font-black text-gray-900">$${p.price}</span>
                </div>
                <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-4">${p.category}</span>
                <p class="text-xs text-gray-400 line-clamp-2 mb-6 font-light">${p.description || ''}</p>
                <button class="mt-auto btn-primary w-full py-2.5 text-xs" onclick="addToCart('${p.name}', ${p.price})">ADD TO ORDER</button>
              </div>
            </a>
          </div>
        `
            )
            .join('');
    }

    window.fetchMenu = fetchMenu;
    window.renderMenu = renderMenu;
})();
