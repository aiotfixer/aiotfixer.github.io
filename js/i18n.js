const i18nDict = {
    "zh-TW": {
        pageTitleIndex: "NTUT AIoTFixer | 北科智慧家電維修社",
        metaDescIndex: "北科智慧家電研究社 (NTUT AIoTFixer) 官方網站，提供社團最新活動公告、社群平台連結與相關資訊。",
        pageTitleRedirect: "跳轉中... - NTUT AIoTFixer",
        pageTitle404: "404 找不到網頁 - NTUT AIoTFixer",
        
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
        pageTitleIndex: "NTUT AIoTFixer Club",
        metaDescIndex: "Official website of NTUT AIoTFixer. Get the latest event announcements, social media links, and club information.",
        pageTitleRedirect: "Redirecting... - NTUT AIoTFixer",
        pageTitle404: "404 Not Found - NTUT AIoTFixer",
        
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

// 穩定性優化：安全讀寫 LocalStorage 的輔助函式
const storage = {
    get: (key) => {
        try { return localStorage.getItem(key); } 
        catch (e) { return null; }
    },
    set: (key, val) => {
        try { localStorage.setItem(key, val); } 
        catch (e) { /* 忽略無痕模式等安全性限制錯誤 */ }
    }
};

window.setLanguage = function(lang) {
    document.documentElement.lang = lang;
    storage.set("pref_lang", lang);
    
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (i18nDict[lang] && i18nDict[lang][key]) {
            el.textContent = i18nDict[lang][key];
        }
    });

    const loaderEl = document.getElementById('loader');
    if (loaderEl) {
        const errorTitleEl = document.getElementById('error-title');
        const isErrorVisible = errorTitleEl && errorTitleEl.style.display === 'block';
        document.title = isErrorVisible ? i18nDict[lang].pageTitle404 : i18nDict[lang].pageTitleRedirect;
    } else {
        document.title = i18nDict[lang].pageTitleIndex;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.setAttribute("content", i18nDict[lang].metaDescIndex);
        
        const ogTitle = document.querySelector('meta[property="og:title"]');
        const ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogTitle) ogTitle.setAttribute("content", i18nDict[lang].pageTitleIndex);
        if (ogDesc) ogDesc.setAttribute("content", i18nDict[lang].metaDescIndex);
    }
};

document.addEventListener("DOMContentLoaded", () => {
    const savedLang = storage.get("pref_lang");
    const browserLang = navigator.language.toLowerCase().includes("zh") ? "zh-TW" : "en";
    const currentLang = savedLang || browserLang;
    
    window.setLanguage(currentLang);

    const langBtn = document.getElementById("lang-toggle");
    if (langBtn) {
        langBtn.addEventListener("click", () => {
            const newLang = document.documentElement.lang === "zh-TW" ? "en" : "zh-TW";
            window.setLanguage(newLang);
        });
    }
});
