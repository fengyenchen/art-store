(() => {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            if (window.fetchMenu) window.fetchMenu();
        });
        return;
    }

    if (window.fetchMenu) window.fetchMenu();
})();
