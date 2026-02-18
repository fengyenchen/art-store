(() => {
    function showPage(pageId) {
        document.querySelectorAll('.page-section').forEach((sec) => sec.classList.add('hidden'));
        const target = document.getElementById(`page-${pageId}`);
        if (target) target.classList.remove('hidden');

        document.querySelectorAll('.nav-link').forEach((btn) => {
            btn.classList.remove('text-primary');
            btn.classList.add('text-gray-400');
        });

        const navBtn = document.getElementById(`nav-${pageId}`);
        if (navBtn) {
            navBtn.classList.remove('text-gray-400');
            navBtn.classList.add('text-primary');
        }
    }

    function toggleMobileMenu() {
        const menu = document.getElementById('mobile-menu');
        if (menu) menu.classList.toggle('hidden');
    }

    function handleMobileNav(pageId) {
        showPage(pageId);
        toggleMobileMenu();
    }

    window.showPage = showPage;
    window.toggleMobileMenu = toggleMobileMenu;
    window.handleMobileNav = handleMobileNav;
})();
