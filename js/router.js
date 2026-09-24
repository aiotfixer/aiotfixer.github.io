/**
 * 核心路由與轉址模組 (共用於 Hash 路由與 Path 路由)
 * @param {string} targetKey - 解析出的短網址代號
 * @param {function} showErrorUI - 顯示錯誤畫面的回呼函式
 */
window.processRedirect = function(targetKey, showErrorUI) {
    const GAS_URL = "https://script.google.com/macros/s/AKfycbyukWNTiEnbzMmr87n90VoXki4MPXw050wrB4lSNB08cWB9xdGqWoI3J8zbF9O1oQlk/exec";
    const DEFAULT_URL = "https://aiotfixer.github.io/";
    const CACHE_TTL = 180000; // 3 分鐘快取限制

    // 1. 空值或內部檔案防護
    if (!targetKey || targetKey === "index.html" || targetKey === "404.html" || targetKey === "/") {
        window.location.replace(DEFAULT_URL);
        return; 
    } 

    // 2. XSS 與惡意請求防護：前端正則驗證 (白名單機制)
    // 僅允許小寫英文字母、數字、底線與破折號，長度 1~50
    const safeTargetKey = targetKey.toLowerCase();
    const keyRegex = /^[a-z0-9_-]{1,50}$/;
    
    if (!keyRegex.test(safeTargetKey)) {
        console.warn("Invalid URL parameters detected.");
        showErrorUI(); // 若輸入包含 <script> 或特殊符號，直接拋出 404，不向後端發送請求
        return;
    }

    // 3. 檢查快取 (SessionStorage + TTL)
    const cacheKey = `url_cache_${safeTargetKey}`;
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

    // 4. 準備發送 GAS 請求 (經過編碼的參數)
    const ua = encodeURIComponent(navigator.userAgent);
    const ref = encodeURIComponent(document.referrer || "");
    const encodedKey = encodeURIComponent(safeTargetKey);
    
    // 5秒逾時備用機制
    const fallback = setTimeout(() => {
        showErrorUI();
    }, 5000);

    // 5. 執行連線與跳轉
    fetch(`${GAS_URL}?key=${encodedKey}&ua=${ua}&ref=${ref}`)
    .then(res => res.json())
    .then(result => {
        clearTimeout(fallback); 
        // 防禦 Open Redirect，確保回傳的是合法外部連結
        if (result.target && (result.target.startsWith("http://") || result.target.startsWith("https://"))) {
            // 寫入帶有時間戳記的快取
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
