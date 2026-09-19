const i18nDict = {
    "zh-TW": {
        pageTitleIndex: "NTUT AIoTFixer | 北科智慧家電維修社",
        metaDescIndex: "北科智慧家電研究社 (NTUT AIoTFixer) 官方網站，提供社團最新活動公告、社群平台連結與相關資訊。",
        pageTitleRedirect: "跳轉中... - NTUT AIoTFixer", // 新增跳轉中標題
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
        pageTitleRedirect: "Redirecting... - NTUT AIoTFixer", // 新增跳轉中標題
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

window.setLanguage = function(lang) {
    document.documentElement.lang = lang;
    localStorage.setItem("pref_lang", lang);
    
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (i18nDict[lang] && i18nDict[lang][key]) {
            el.textContent = i18nDict[lang][key];
        }
    });

    // 動態替換網頁 Title 與 Meta
    const loaderEl = document.getElementById('loader');
    if (loaderEl) {
        // 在轉址頁/404頁：透過「錯誤標題是否顯示」來決定瀏覽器分頁要顯示什麼
        const errorTitleEl = document.getElementById('error-title');
        const isErrorVisible = errorTitleEl && errorTitleEl.style.display === 'block';
        
        // 若已經觸發錯誤則顯示 404，否則維持跳轉中的標題
        document.title = isErrorVisible ? i18nDict[lang].pageTitle404 : i18nDict[lang].pageTitleRedirect;
    } else {
        // 在首頁
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
    const savedLang = localStorage.getItem("pref_lang");
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