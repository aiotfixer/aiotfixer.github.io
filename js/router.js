/**
 * 核心路由與轉址模組 (共用於 Hash 路由與 Path 路由)
 * @param {string} targetKey - 解析出的短網址代號
 * @param {function} showErrorUI - 顯示錯誤畫面的回呼函式
 */
window.processRedirect = function(targetKey, showErrorUI) {
    const GAS_URL = "https://script.google.com/macros/s/AKfycbyukWNTiEnbzMmr87n90VoXki4MPXw050wrB4lSNB08cWB9xdGqWoI3J8zbF9O1oQlk/exec";
    const DEFAULT_URL = "https://aiotfixer.github.io/";
    const CACHE_TTL = 3600000; // 1小時快取限制

    if (!targetKey || targetKey === "index.html" || targetKey === "404.html" || targetKey === "/") {
        window.location.replace(DEFAULT_URL);
        return; 
    } 

    const cacheKey = `url_cache_${targetKey}`;
    try {
        const cachedDataStr = sessionStorage.getItem(cacheKey);
        if (cachedDataStr) {
            const cachedData = JSON.parse(cachedDataStr);
            const now = new Date().getTime();
            if (cachedData.url && cachedData.timestamp && (now - cachedData.timestamp < CACHE_TTL)) {
                window.location.replace(cachedData.url); 
                return;
            } else {
                sessionStorage.removeItem(cacheKey); 
            }
        }
    } catch(e) {
        console.warn("Cache access error:", e);
    }

    const ua = encodeURIComponent(navigator.userAgent);
    const ref = encodeURIComponent(document.referrer || "");
    
    const fallback = setTimeout(() => {
        showErrorUI();
    }, 5000);

    fetch(`${GAS_URL}?key=${encodeURIComponent(targetKey)}&ua=${ua}&ref=${ref}`)
    .then(res => res.json())
    .then(result => {
        clearTimeout(fallback); 
        if (result.target && (result.target.startsWith("http://") || result.target.startsWith("https://"))) {
            try { 
                const cachePayload = { url: result.target, timestamp: new Date().getTime() };
                sessionStorage.setItem(cacheKey, JSON.stringify(cachePayload)); 
            } catch(e) {}
            window.location.replace(result.target); 
        } else {
            showErrorUI(); 
        }
    })
    .catch(err => {
        console.error("連線錯誤:", err);
        clearTimeout(fallback);
        showErrorUI(); 
    });
};