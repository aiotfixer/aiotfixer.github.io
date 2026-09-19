document.addEventListener("DOMContentLoaded", () => {
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    const GAS_URL = "https://script.google.com/macros/s/AKfycbyukWNTiEnbzMmr87n90VoXki4MPXw050wrB4lSNB08cWB9xdGqWoI3J8zbF9O1oQlk/exec";
    const DEFAULT_URL = "https://aiotfixer.github.io/";

    const currentPath = window.location.pathname;
    const targetKey = currentPath.replace(/^\/|\/$/g, '');

    function showNotFoundError() {
        const lang = document.documentElement.lang || "zh-TW";
        document.title = lang === "zh-TW" ? "404 找不到網頁 - NTUT AIoTFixer" : "404 Not Found - NTUT AIoTFixer";
        
        document.getElementById('loader').style.display = 'none';
        document.getElementById('error-title').style.display = 'block'; 
        
        const msgEl = document.getElementById('msg');
        msgEl.setAttribute("data-i18n", "notFoundText");
        if (typeof window.setLanguage === "function") {
            window.setLanguage(lang);
        }
        
        document.getElementById('home-btn').style.display = 'flex';
    }

    if (!targetKey || targetKey === "index.html" || targetKey === "404.html") {
        window.location.replace(DEFAULT_URL);
        return; 
    } 

    const ua = encodeURIComponent(navigator.userAgent);
    const ref = encodeURIComponent(document.referrer || "");
    
    const fallback = setTimeout(() => {
        showNotFoundError();
    }, 5000);

    fetch(`${GAS_URL}?key=${encodeURIComponent(targetKey)}&ua=${ua}&ref=${ref}`)
    .then(res => res.json())
    .then(result => {
        clearTimeout(fallback); 
        
        if (result.target && (result.target.startsWith("http://") || result.target.startsWith("https://"))) {
            window.location.replace(result.target); 
        } else {
            showNotFoundError(); 
        }
    })
    .catch(err => {
        console.error("連線錯誤:", err);
        clearTimeout(fallback);
        showNotFoundError(); 
    });
});