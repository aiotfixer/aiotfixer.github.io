document.addEventListener("DOMContentLoaded", () => {
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    const GAS_URL = "https://script.google.com/macros/s/AKfycbyukWNTiEnbzMmr87n90VoXki4MPXw050wrB4lSNB08cWB9xdGqWoI3J8zbF9O1oQlk/exec";
    const DEFAULT_URL = "https://aiotfixer.github.io/";

    // 解決子目錄路徑解析問題：永遠只取網址最後一段
    const currentPath = window.location.pathname;
    const pathSegments = currentPath.split('/').filter(segment => segment.trim() !== '');
    const targetKey = pathSegments.length > 0 ? pathSegments[pathSegments.length - 1] : "";

    function showNotFoundError() {
        document.getElementById('loader').style.display = 'none';
        document.getElementById('error-title').style.display = 'block'; 
        
        const msgEl = document.getElementById('msg');
        msgEl.setAttribute("data-i18n", "notFoundText");
        document.getElementById('home-btn').style.display = 'flex';

        // 呼叫 i18n 強制更新網頁標題 (此時 error-title 已顯示為 block，標題會自動切換為 404)
        if (typeof window.setLanguage === "function") {
            const lang = document.documentElement.lang || "zh-TW";
            window.setLanguage(lang);
        }
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