document.addEventListener("DOMContentLoaded", () => {
    const yearElement = document.getElementById('year');
    if (yearElement) yearElement.textContent = new Date().getFullYear();

    const hash = window.location.hash;
    const targetKey = hash.replace(/^#\/?/, '').trim();

    if (targetKey) {
        const homeContent = document.getElementById('home-content');
        const routerContent = document.getElementById('router-content');
        if (homeContent) homeContent.style.display = 'none';
        if (routerContent) routerContent.style.display = 'flex';

        function showNotFoundError() {
            const loader = document.getElementById('loader');
            if (loader) loader.style.display = 'none';
            
            const errTitle = document.getElementById('error-title');
            if (errTitle) errTitle.style.display = 'block'; 
            
            const msgEl = document.getElementById('msg');
            if (msgEl) msgEl.setAttribute("data-i18n", "notFoundText");
            
            const homeBtn = document.getElementById('home-btn');
            if (homeBtn) {
                homeBtn.style.display = 'flex';
                homeBtn.focus();
            }

            if (typeof window.setLanguage === "function") {
                const lang = document.documentElement.lang || "zh-TW";
                window.setLanguage(lang);
            }
        }

        if (typeof window.processRedirect === "function") {
            window.processRedirect(targetKey, showNotFoundError);
        }
    }

    window.addEventListener("hashchange", () => {
        window.location.reload();
    });
});
