const i18nDict = {
    "zh-TW": {
        // --- 網頁 Meta 與標題 ---
        pageTitleIndex: "NTUT AIoTFixer | 北科智慧家電維修社",
        metaDescIndex: "北科智慧家電研究社 (NTUT AIoTFixer) 官方網站，提供社團最新活動公告、社群平台連結與相關資訊。",
        pageTitle404: "404 找不到網頁 - NTUT AIoTFixer",
        
        // --- 畫面文字元件 ---
        clubName: "北科智慧家電維修社",
        fb: "Facebook 粉絲專頁",
        ig: "Instagram 精彩日常",
        threads: "Threads 靈感筆記",
        apply: "活動報名",
        redirecting: "正在解析網址並跳轉...",
        notFoundText: "抱歉，找不到您請求的頁面或短網址。",
        backHome: "回到首頁",
        langToggle: "🌐 English"
    },
    "en": {
        // --- 網頁 Meta 與標題 ---
        pageTitleIndex: "NTUT AIoTFixer Club",
        metaDescIndex: "Official website of NTUT AIoTFixer. Get the latest event announcements, social media links, and club information.",
        pageTitle404: "404 Not Found - NTUT AIoTFixer",
        
        // --- 畫面文字元件 ---
        clubName: "NTUT AIoTFixer Club",
        fb: "Facebook Page",
        ig: "Instagram Life",
        threads: "Threads Notes",
        apply: "Event Registration",
        redirecting: "Resolving URL & redirecting...",
        notFoundText: "Sorry, the requested shortlink was not found.",
        backHome: "Back to Home",
        langToggle: "🌐 繁體中文"
    }
};

// 將切換函式掛載到 window，讓 404.js 也能呼叫
window.setLanguage = function(lang) {
    // 1. 更新 HTML 語系屬性 (對螢幕閱讀器極為重要)
    document.documentElement.lang = lang;
    
    // 2. 儲存使用者偏好設定
    localStorage.setItem("pref_lang", lang);
    
    // 3. 替換畫面上帶有 data-i18n 屬性的文字
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (i18nDict[lang] && i18nDict[lang][key]) {
            el.textContent = i18nDict[lang][key];
        }
    });

    // 4. 動態替換網頁 Title 與 Meta Description
    // 透過檢查網址路徑或畫面上的特定元素來判斷當前頁面
    const is404Page = window.location.pathname.includes("404") || document.getElementById('error-title') !== null;
    
    if (is404Page) {
        document.title = i18nDict[lang].pageTitle404;
    } else {
        document.title = i18nDict[lang].pageTitleIndex;
        
        // 替換 Meta Description (若存在)
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute("content", i18nDict[lang].metaDescIndex);
        }
        
        // 替換 Open Graph Title 與 Description (供社群分享預覽使用)
        const ogTitle = document.querySelector('meta[property="og:title"]');
        const ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogTitle) ogTitle.setAttribute("content", i18nDict[lang].pageTitleIndex);
        if (ogDesc) ogDesc.setAttribute("content", i18nDict[lang].metaDescIndex);
    }
};

document.addEventListener("DOMContentLoaded", () => {
    // 決定初始語言：優先讀取儲存紀錄，否則依據瀏覽器系統語言
    const savedLang = localStorage.getItem("pref_lang");
    const browserLang = navigator.language.toLowerCase().includes("zh") ? "zh-TW" : "en";
    const currentLang = savedLang || browserLang;
    
    // 執行初始化轉換
    window.setLanguage(currentLang);

    // 綁定右上角切換按鈕事件
    const langBtn = document.getElementById("lang-toggle");
    if (langBtn) {
        langBtn.addEventListener("click", () => {
            const newLang = document.documentElement.lang === "zh-TW" ? "en" : "zh-TW";
            window.setLanguage(newLang);
        });
    }
});