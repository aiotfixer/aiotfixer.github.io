document.addEventListener("DOMContentLoaded", () => {
    const yearElement = document.getElementById('year');
    if (yearElement) yearElement.textContent = new Date().getFullYear();

    const currentPath = window.location.pathname;
    const pathSegments = currentPath.split('/').filter(segment => segment.trim() !== '');
    const targetKey = pathSegments.length > 0 ? pathSegments[pathSegments.length - 1] : "";

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
});
