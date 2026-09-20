document.addEventListener("DOMContentLoaded", () => {
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    const GAS_URL = "https://script.google.com/macros/s/AKfycbyukWNTiEnbzMmr87n90VoXki4MPXw050wrB4lSNB08cWB9xdGqWoI3J8zbF9O1oQlk/exec";
    const DEFAULT_URL = "https://aiotfixer.github.io/";
    
    // 快取存活時間設定 (TTL)：60000毫秒
    const CACHE_TTL = 60000; 

    const currentPath = window.location.pathname;
    const pathSegments = currentPath.split('/').filter(segment => segment.trim() !== '');
    const targetKey = pathSegments.length > 0 ? pathSegments[pathSegments.length - 1] : "";

    function showNotFoundError() {
        document.getElementById('loader').style.display = 'none';
        document.getElementById('error-title').style.display = 'block'; 
        
        const msgEl = document.getElementById('msg');
        msgEl.setAttribute("data-i18n", "notFoundText");
        
        const homeBtn = document.getElementById('home-btn');
        homeBtn.style.display = 'flex';
        homeBtn.focus();

        if (typeof window.setLanguage === "function") {
            const lang = document.documentElement.lang || "zh-TW";
            window.setLanguage(lang);
        }
    }

    if (!targetKey || targetKey === "index.html" || targetKey === "404.html") {
        window.location.replace(DEFAULT_URL);
        return; 
    } 

    // 效能優化：讀取快取並驗證時間是否過期
    const cacheKey = `url_cache_${targetKey}`;
    try {
        const cachedDataStr = sessionStorage.getItem(cacheKey);
        if (cachedDataStr) {
            const cachedData = JSON.parse(cachedDataStr);
            const now = new Date().getTime();
            
            // 檢查快取是否存在且尚未過期
            if (cachedData.url && cachedData.timestamp && (now - cachedData.timestamp < CACHE_TTL)) {
                console.log(`[Cache Hit] Redirecting to ${cachedData.url}`);
                window.location.replace(cachedData.url);
                return;
            } else {
                // 快取已過期，清除舊快取
                sessionStorage.removeItem(cacheKey);
            }
        }
    } catch(e) {
        // 解析失敗或存取被阻擋時，略過快取檢查
        console.warn("Cache access error:", e);
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
            // 寫入帶有時間戳記的快取
            try { 
                const cachePayload = {
                    url: result.target,
                    timestamp: new Date().getTime()
                };
                sessionStorage.setItem(cacheKey, JSON.stringify(cachePayload)); 
            } catch(e) {}
            
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
