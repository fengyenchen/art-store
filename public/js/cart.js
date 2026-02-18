(() => {
    let cart = [];

    function addToCart(name, price) {
        cart.push({ name, price });
        updateCartUI();
    }

    function updateCartUI() {
        const container = document.getElementById('cart-items');
        if (!container) return;

        if (cart.length === 0) {
            container.innerHTML = '<p class="text-gray-400 text-center py-10 text-sm italic">您的購物籃是空的</p>';
            const totalPrice = document.getElementById('total-price');
            if (totalPrice) totalPrice.innerText = '$0';
            return;
        }

        container.innerHTML = cart
            .map(
                (item, index) => `
          <div class="flex justify-between items-center bg-gray-50 p-3 rounded-lg transition-all duration-200 hover:bg-gray-100">
            <span class="text-sm font-bold text-gray-900">${item.name}</span>
            <button onclick="removeItem(${index})" class="text-gray-300 hover:text-red-500 hover:scale-125 transition-all duration-200">✕</button>
          </div>
        `
            )
            .join('');

        const total = cart.reduce((sum, item) => sum + item.price, 0);
        const totalPrice = document.getElementById('total-price');
        if (totalPrice) totalPrice.innerText = `$${total}`;
    }

    function removeItem(index) {
        cart.splice(index, 1);
        updateCartUI();
    }

    function checkout() {
        if (cart.length === 0) return alert('請先選擇餐點！');
        alert(`訂單已送出！總金額：$${document.getElementById('total-price').innerText}`);
        cart = [];
        updateCartUI();
    }

    window.addToCart = addToCart;
    window.updateCartUI = updateCartUI;
    window.removeItem = removeItem;
    window.checkout = checkout;
})();
