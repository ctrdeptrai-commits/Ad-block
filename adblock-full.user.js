// ==UserScript==
// @name         AdBlock + Anti-App Redirect FULL MẠNH
// @namespace    https://github.com/
// @version      2.1
// @description  Chặn quảng cáo + chặn mở app Shopee/Lazada/Tiki cực mạnh
// @author       Grok
// @match        *://*/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    const adSelectors = [
        'div[id*="ad"]', 'div[class*="ad"]', '.ads', '.ad-', 'ins.adsbygoogle',
        '.banner-ads', '.sponsored', '[data-ad]', '.advertisement',
        '.shopee-ads', '.lazada-ads', '.popup', '.modal-ad',
        'iframe[src*="ads"]', 'iframe[src*="doubleclick"]', 'iframe[src*="google"]',
        '.fc-ab-root', '.ad-container', '[id*="google_ads"]'
    ];

    // Danh sách link hay redirect sang app
    const appRedirectPatterns = [
        /shopee\.vn.*sp_atk=/i,
        /lazada\.vn.*lp=app/i,
        /tiki\.vn.*open_app/i,
        /goto\.shopee/i,
        /app\.shopee/i
    ];

    function blockAds() {
        // Xóa quảng cáo
        adSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.style.display = 'none';
                if (Math.random() > 0.7) el.remove();
            });
        });

        // Chặn sponsored / quảng cáo trên Shopee, Facebook
        document.querySelectorAll('div, span, a').forEach(el => {
            const text = (el.textContent || '').toLowerCase();
            if (text.includes('quảng cáo') || text.includes('sponsored') || text.includes('được tài trợ')) {
                el.style.display = 'none';
            }
        });
    }

    function blockAppRedirect() {
        // Chặn link redirect sang app
        document.querySelectorAll('a[href]').forEach(link => {
            const href = link.href;
            if (appRedirectPatterns.some(pattern => pattern.test(href))) {
                // Thay link thành phiên bản web thuần
                link.href = href.replace(/sp_atk=[^&]+/i, '').replace(/&utm.*$/i, '');
                link.setAttribute('target', '_self');
                
                // Ngăn click mở app
                link.addEventListener('click', function(e) {
                    if (href.includes('shopee') || href.includes('lazada')) {
                        e.stopImmediatePropagation();
                    }
                }, true);
            }
        });
    }

    // Chạy ngay từ đầu
    blockAds();
    blockAppRedirect();

    // Chạy liên tục
    setInterval(() => {
        blockAds();
        blockAppRedirect();
    }, 600);

    // MutationObserver siêu mạnh
    const observer = new MutationObserver(() => {
        blockAds();
        blockAppRedirect();
    });
    observer.observe(document.documentElement, { 
        childList: true, 
        subtree: true 
    });

    // Chặn popup mới
    window.addEventListener('load', () => {
        setTimeout(() => {
            document.querySelectorAll('div[role="dialog"], .popup').forEach(p => p.remove());
        }, 1500);
    });

    console.log('%c✅ AdBlock FULL MẠNH đã kích hoạt!', 'color: lime; font-size: 14px');
})();
