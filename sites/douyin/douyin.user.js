// ==UserScript==
// @name         PCWebToMobile · 抖音
// @namespace    https://local1st.app/pcwebtomobile
// @version      0.1.0
// @description  用 CSS 把 douyin.com PC 网页收成手机能用的布局，不抓内容，保留网页版功能
// @author       PCWebToMobile
// @match        *://www.douyin.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  window.__PCWTM_CSS__ = "/* PCWebToMobile \u00b7 douyin\n * Applied under html.pcwtm (userscript) or @media (max-width: 920px) (Stylus).\n * Layout only \u2014 keep Douyin's own colors, type, player, and comments.\n *\n * Selectors verified on the official PC shell (2026-08-20, logged-out):\n *   #root #douyin-header #douyin-header-menuCt\n *   #douyin-navigation / [data-e2e=\"douyin-navigation\"]\n *   #douyin-sidebar #douyin-sidebar-new #douyin-right-container\n *   Recommend swipe (/?recommend=1): #slidelist.recommend-slidelist #sliderVideo\n *     [data-e2e=\"feed-active-video\"|\"slideList\"|\"feed-video\"|\"feed-comment-icon\"]\n *     .page-recommend-container .sliderVideo .playerContainer .basePlayerContainer\n *     .xgplayer .positionBox #video-info-wrap\n *   Comments on feed: #videoSideCard (visible) #videoSideBar (often width 0)\n *     #relatedVideoCard #merge-all-comment-container [data-e2e=\"comment-list\"]\n *   /video/:id: [data-e2e=\"video-detail\"|\"player-container\"] .leftContainer\n *   /jingxuan: .jingxuan-scroll-element .discover-video-card-item .discover-tab-bar\n * Hashed class names (e.g. .eRu21rp0) are avoided \u2014 they rotate.\n * JS may add html.pcwtm-recommend / pcwtm-jingxuan / pcwtm-video / pcwtm-modal.\n */\n\nhtml.pcwtm {\n  --pcwtm-bar: 52px;\n  --pcwtm-pink: #fe2c55;\n  --pcwtm-text: #161823;\n  --pcwtm-muted: #8a8b91;\n  --pcwtm-bg: #000;\n  --pcwtm-gap: 8px;\n  --header-height: var(--pcwtm-bar);\n}\n\nhtml.pcwtm,\nhtml.pcwtm body {\n  min-width: 0 !important;\n  max-width: 100% !important;\n  width: 100% !important;\n  overflow-x: hidden !important;\n  background: var(--pcwtm-bg);\n}\n\nhtml.pcwtm body {\n  padding-left: env(safe-area-inset-left);\n  padding-right: env(safe-area-inset-right);\n}\n\n/* Shells that lock a desktop min-width (~580px+ was observed at 390 CSS px) */\nhtml.pcwtm #root,\nhtml.pcwtm #root > div,\nhtml.pcwtm #douyin-right-container,\nhtml.pcwtm #douyin-header,\nhtml.pcwtm #slidelist,\nhtml.pcwtm #sliderVideo,\nhtml.pcwtm .parent-route-container,\nhtml.pcwtm .route-scroll-container,\nhtml.pcwtm .page-recommend-container,\nhtml.pcwtm .playerContainer,\nhtml.pcwtm .basePlayerContainer,\nhtml.pcwtm .leftContainer,\nhtml.pcwtm [data-e2e=\"video-detail\"],\nhtml.pcwtm [data-e2e=\"slideList\"],\nhtml.pcwtm [data-e2e=\"player-container\"] {\n  min-width: 0 !important;\n  max-width: 100% !important;\n  width: 100% !important;\n  box-sizing: border-box !important;\n}\n\n/* ---------- Left nav \u2192 drawer ---------- */\n\nhtml.pcwtm #douyin-navigation,\nhtml.pcwtm [data-e2e=\"douyin-navigation\"],\nhtml.pcwtm #douyin-sidebar,\nhtml.pcwtm #douyin-sidebar-new {\n  display: none !important;\n}\n\n/* ---------- Header ---------- */\n\nhtml.pcwtm #douyin-header {\n  position: fixed !important;\n  top: 0 !important;\n  left: 0 !important;\n  right: 0 !important;\n  height: var(--pcwtm-bar) !important;\n  min-height: var(--pcwtm-bar) !important;\n  max-height: var(--pcwtm-bar) !important;\n  margin: 0 !important;\n  padding: 0 6px 0 8px !important;\n  z-index: 10050 !important;\n  display: flex !important;\n  align-items: center !important;\n  gap: 6px !important;\n  background: rgba(22, 24, 35, 0.88) !important;\n  backdrop-filter: blur(16px) saturate(1.2);\n  -webkit-backdrop-filter: blur(16px) saturate(1.2);\n}\n\nhtml.pcwtm #douyin-header > div,\nhtml.pcwtm #douyin-header > div[data-click=\"doubleClick\"] {\n  min-width: 0 !important;\n  max-width: 100% !important;\n  width: 100% !important;\n  flex: 1 1 auto !important;\n}\n\nhtml.pcwtm #douyin-header input[data-e2e=\"searchbar-input\"],\nhtml.pcwtm #douyin-header input[type=\"search\"],\nhtml.pcwtm #douyin-header input[type=\"text\"] {\n  font-size: 16px !important; /* iOS no-zoom */\n  min-width: 0 !important;\n}\n\nhtml.pcwtm #douyin-header-menuCt {\n  flex: 0 0 auto !important;\n  max-width: 42% !important;\n  overflow: hidden !important;\n}\n\nhtml.pcwtm #douyin-header [id^=\"douyin-header-menu\"] {\n  flex: 0 0 auto !important;\n}\n\nhtml.pcwtm #pcwtm-menu-btn {\n  flex: 0 0 40px;\n  width: 40px;\n  height: 40px;\n  border: 0;\n  padding: 0;\n  margin: 0;\n  background: transparent;\n  border-radius: 10px;\n  color: #fff;\n  display: grid;\n  place-items: center;\n  cursor: pointer;\n}\n\nhtml.pcwtm #pcwtm-menu-btn.pcwtm-float {\n  position: fixed;\n  top: calc(8px + env(safe-area-inset-top));\n  right: 8px;\n  z-index: 10080;\n  background: rgba(22, 24, 35, 0.72);\n}\n\nhtml.pcwtm #pcwtm-menu-btn:active {\n  background: rgba(255, 255, 255, 0.12);\n}\n\nhtml.pcwtm #pcwtm-mask {\n  display: none;\n  position: fixed;\n  inset: 0;\n  z-index: 10060;\n  background: rgba(0, 0, 0, 0.48);\n}\n\nhtml.pcwtm.pcwtm-open #pcwtm-mask {\n  display: block;\n}\n\nhtml.pcwtm #pcwtm-drawer {\n  position: fixed;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  width: min(82vw, 320px);\n  z-index: 10070;\n  background: #161823;\n  color: #fff;\n  box-shadow: -8px 0 32px rgba(0, 0, 0, 0.28);\n  transform: translateX(105%);\n  transition: transform 0.22s ease;\n  overflow-y: auto;\n  padding: calc(12px + env(safe-area-inset-top)) 8px 24px;\n  -webkit-overflow-scrolling: touch;\n}\n\nhtml.pcwtm.pcwtm-open #pcwtm-drawer {\n  transform: translateX(0);\n}\n\nhtml.pcwtm #pcwtm-drawer a {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 12px 14px;\n  border-radius: 10px;\n  color: #fff;\n  text-decoration: none;\n  font-size: 15px;\n  line-height: 1.2;\n}\n\nhtml.pcwtm #pcwtm-drawer a:active {\n  background: rgba(255, 255, 255, 0.08);\n}\n\nhtml.pcwtm #pcwtm-drawer .pcwtm-drawer-title {\n  padding: 8px 14px 14px;\n  font-size: 13px;\n  color: var(--pcwtm-muted);\n  letter-spacing: 0.08em;\n}\n\n/* ---------- Homepage recommend slider (/?recommend=1) ---------- */\n\nhtml.pcwtm #douyin-right-container {\n  margin: 0 !important;\n  padding: 0 !important;\n  padding-top: var(--pcwtm-bar) !important;\n  left: 0 !important;\n}\n\nhtml.pcwtm #slidelist,\nhtml.pcwtm #slidelist.recommend-slidelist,\nhtml.pcwtm [data-e2e=\"slideList\"] {\n  width: 100% !important;\n  height: calc(100dvh - var(--pcwtm-bar)) !important;\n  min-height: calc(100dvh - var(--pcwtm-bar)) !important;\n  margin: 0 !important;\n  padding: 0 !important;\n  padding-right: 0 !important;\n  left: 0 !important;\n}\n\nhtml.pcwtm #slidelist .page-recommend-container,\nhtml.pcwtm #sliderVideo,\nhtml.pcwtm [data-e2e=\"feed-active-video\"],\nhtml.pcwtm [data-e2e=\"feed-video\"],\nhtml.pcwtm .sliderVideo,\nhtml.pcwtm .slider-video {\n  width: 100% !important;\n  max-width: 100% !important;\n  height: 100% !important;\n  min-height: 0 !important;\n  margin: 0 !important;\n  left: 0 !important;\n  right: 0 !important;\n}\n\nhtml.pcwtm #sliderVideo .playerContainer,\nhtml.pcwtm [data-e2e=\"feed-active-video\"] .playerContainer,\nhtml.pcwtm [data-e2e=\"feed-video\"] .playerContainer,\nhtml.pcwtm .basePlayerContainer,\nhtml.pcwtm .xgplayer,\nhtml.pcwtm [data-e2e=\"player-container\"] {\n  width: 100% !important;\n  max-width: 100% !important;\n  height: 100% !important;\n  left: 0 !important;\n}\n\nhtml.pcwtm .xgplayer video,\nhtml.pcwtm .basePlayerContainer video {\n  width: 100% !important;\n  height: 100% !important;\n  max-width: 100% !important;\n  object-fit: contain;\n}\n\n/* Right action column stays over the player (was falling off-screen at 390px) */\nhtml.pcwtm .basePlayerContainer .positionBox,\nhtml.pcwtm [data-e2e=\"feed-active-video\"] .positionBox {\n  position: absolute !important;\n  right: 6px !important;\n  bottom: calc(88px + env(safe-area-inset-bottom)) !important;\n  left: auto !important;\n  transform: none !important;\n  z-index: 5;\n}\n\nhtml.pcwtm [data-e2e=\"feed-comment-icon\"],\nhtml.pcwtm [data-e2e=\"video-player-digg\"],\nhtml.pcwtm [data-e2e=\"video-player-collect\"],\nhtml.pcwtm [data-e2e=\"video-player-share\"] {\n  pointer-events: auto;\n}\n\nhtml.pcwtm #video-info-wrap,\nhtml.pcwtm .video-info-detail,\nhtml.pcwtm [data-e2e=\"video-info\"] {\n  max-width: calc(100% - 72px) !important;\n  width: auto !important;\n  left: 8px !important;\n  right: auto !important;\n  bottom: calc(16px + env(safe-area-inset-bottom)) !important;\n}\n\n/* Official up/down switchers: keep, tuck to the right edge */\nhtml.pcwtm [data-e2e=\"video-switch-next-arrow\"],\nhtml.pcwtm [data-e2e=\"video-switch-prev-arrow\"],\nhtml.pcwtm .xgplayer-playswitch {\n  right: 8px !important;\n  left: auto !important;\n}\n\n/* Comments / related card: bottom sheet only when the official panel is open */\nhtml.pcwtm #videoSideCard:has(#relatedVideoCard),\nhtml.pcwtm #videoSideCard:has(#merge-all-comment-container),\nhtml.pcwtm #videoSideCard:has([data-e2e=\"comment-list\"]),\nhtml.pcwtm #videoSideBar:has(#relatedVideoCard),\nhtml.pcwtm #videoSideBar:has(#merge-all-comment-container),\nhtml.pcwtm #videoSideBar:has([data-e2e=\"comment-list\"]) {\n  position: fixed !important;\n  left: 0 !important;\n  right: 0 !important;\n  bottom: 0 !important;\n  top: auto !important;\n  width: 100% !important;\n  max-width: 100% !important;\n  height: 72% !important;\n  max-height: 72dvh !important;\n  background: rgba(22, 24, 35, 0.96) !important;\n  z-index: 40 !important;\n  overflow: hidden !important;\n}\n\nhtml.pcwtm #relatedVideoCard,\nhtml.pcwtm #merge-all-comment-container,\nhtml.pcwtm .comment-mainContent[data-e2e=\"comment-list\"],\nhtml.pcwtm [data-e2e=\"comment-list\"] {\n  width: 100% !important;\n  max-width: 100% !important;\n}\n\nhtml.pcwtm [data-e2e=\"comment-item\"] {\n  max-width: 100% !important;\n}\n\n/* ---------- Video detail /video/:id ---------- */\n\nhtml.pcwtm [data-e2e=\"video-detail\"] {\n  display: flex !important;\n  flex-direction: column !important;\n  align-items: stretch !important;\n  min-height: calc(100dvh - var(--pcwtm-bar)) !important;\n}\n\nhtml.pcwtm [data-e2e=\"video-detail\"] > * {\n  width: 100% !important;\n  max-width: 100% !important;\n  box-sizing: border-box !important;\n}\n\nhtml.pcwtm [data-e2e=\"video-detail\"] .leftContainer {\n  width: 100% !important;\n  max-width: 100% !important;\n  display: flex !important;\n  flex-direction: column !important;\n  padding: 0 !important;\n}\n\nhtml.pcwtm [data-e2e=\"video-detail\"] [data-e2e=\"player-container\"],\nhtml.pcwtm [data-e2e=\"video-detail\"] .video-detail-container,\nhtml.pcwtm [data-e2e=\"video-detail\"] .basePlayerContainer,\nhtml.pcwtm [data-e2e=\"video-detail\"] .xgplayer {\n  width: 100% !important;\n  max-width: 100% !important;\n  height: auto !important;\n  min-height: 56vw !important;\n  aspect-ratio: 9 / 16;\n  max-height: 70dvh !important;\n  background: #000;\n}\n\nhtml.pcwtm [data-e2e=\"video-detail\"] .leftContainer > div:has(.comment-mainContent[data-e2e=\"comment-list\"]),\nhtml.pcwtm [data-e2e=\"video-detail\"] .leftContainer > div > div:has(.comment-mainContent[data-e2e=\"comment-list\"]),\nhtml.pcwtm [data-e2e=\"video-detail\"] #comment-input-container,\nhtml.pcwtm [data-e2e=\"video-detail\"] [data-e2e=\"comment-list\"] {\n  position: relative !important;\n  width: 100% !important;\n  max-width: 100% !important;\n  height: auto !important;\n  min-height: 40vh !important;\n  left: auto !important;\n  right: auto !important;\n  top: auto !important;\n  bottom: auto !important;\n}\n\nhtml.pcwtm [data-e2e=\"aweme-relate\"],\nhtml.pcwtm [data-e2e=\"related-video\"] {\n  width: 100% !important;\n  max-width: 100% !important;\n}\n\nhtml.pcwtm [data-e2e=\"comment-input\"],\nhtml.pcwtm textarea,\nhtml.pcwtm input[placeholder*=\"\u8bc4\u8bba\"] {\n  font-size: 16px !important;\n}\n\n/* ---------- \u7cbe\u9009 / jingxuan grid \u2192 single column ---------- */\n\nhtml.pcwtm .discover-tab-container,\nhtml.pcwtm .discover-tab-bar {\n  width: 100% !important;\n  max-width: 100% !important;\n  min-width: 0 !important;\n}\n\nhtml.pcwtm .discover-tab-bar {\n  display: flex !important;\n  flex-wrap: nowrap !important;\n  overflow-x: auto !important;\n  -webkit-overflow-scrolling: touch;\n  scrollbar-width: none;\n}\n\nhtml.pcwtm .discover-tab-bar::-webkit-scrollbar {\n  display: none;\n}\n\nhtml.pcwtm .jingxuan-scroll-element {\n  display: flex !important;\n  flex-direction: column !important;\n  gap: 10px !important;\n  width: 100% !important;\n  max-width: 100% !important;\n  padding: 8px var(--pcwtm-gap) 72px !important;\n  box-sizing: border-box !important;\n}\n\nhtml.pcwtm .discover-video-card-item,\nhtml.pcwtm .discover-video-card-img {\n  width: 100% !important;\n  max-width: 100% !important;\n}\n\nhtml.pcwtm #douyin-right-container ul[data-e2e=\"scroll-list\"],\nhtml.pcwtm #search-result-container ul[data-e2e=\"scroll-list\"] {\n  display: flex !important;\n  flex-direction: column !important;\n  gap: 10px !important;\n  width: 100% !important;\n  padding: 8px var(--pcwtm-gap) 72px !important;\n  box-sizing: border-box !important;\n}\n\nhtml.pcwtm #douyin-right-container ul[data-e2e=\"scroll-list\"] > li,\nhtml.pcwtm #search-result-container ul[data-e2e=\"scroll-list\"] > li,\nhtml.pcwtm .search-result-card {\n  width: 100% !important;\n  max-width: 100% !important;\n}\n\n/* modal_id overlay player (jingxuan tap \u2192 swipe) */\nhtml.pcwtm.pcwtm-modal #slidelist,\nhtml.pcwtm [class*=\"isCssFullScreen\"] #slidelist,\nhtml.pcwtm #slidelist[class*=\"isCssFullScreen\"] {\n  height: calc(100dvh - var(--pcwtm-bar)) !important;\n}\n\n/* ---------- Hide download / get-app chrome, keep login ---------- */\n\nhtml.pcwtm img#douyin-temp-sidebar,\nhtml.pcwtm a[href*=\"apps.apple.com\"],\nhtml.pcwtm a[href*=\"itunes.apple.com\"],\nhtml.pcwtm [class*=\"get_app\"],\nhtml.pcwtm [class*=\"get-app\"] {\n  display: none !important;\n}\n\nhtml.pcwtm [role=\"dialog\"],\nhtml.pcwtm .semi-modal,\nhtml.pcwtm #login-panel-new,\nhtml.pcwtm #login-pannel,\nhtml.pcwtm [data-e2e=\"recommend-guide-mask\"],\nhtml.pcwtm #douyin-web-recommend-guide-mask {\n  max-width: 100vw !important;\n}\n\n/* ---------- Search / profile: global min-width only ---------- */\n\nhtml.pcwtm #search-content-area,\nhtml.pcwtm #search-content-area > div,\nhtml.pcwtm #search-result-container {\n  width: 100% !important;\n  max-width: 100% !important;\n  min-width: 0 !important;\n}\n\n/* WAF / logged-out challenge shell: just unlock width */\nhtml.pcwtm body:has(script[src*=\"waf-jschallenge\"]) {\n  min-width: 0 !important;\n}\n";

  var STYLE_ID = "pcwtm-douyin-css";
  var WIDTH_MAX = 920;

  var FALLBACK_LINKS = [
    { href: "https://www.douyin.com/?recommend=1", text: "推荐" },
    { href: "https://www.douyin.com/jingxuan", text: "精选" },
    { href: "https://www.douyin.com/follow", text: "关注" },
    { href: "https://www.douyin.com/user/self", text: "我的" },
  ];

  function wantMobile() {
    try {
      var q = new URLSearchParams(location.search);
      if (q.get("pcwtm") === "0") return false;
      if (q.get("pcwtm") === "1") return true;
    } catch (e) {}
    if (/Android|iPhone|iPod|Mobile|webOS/i.test(navigator.userAgent)) return true;
    if (window.innerWidth <= WIDTH_MAX) return true;
    if (navigator.maxTouchPoints > 0 && Math.min(screen.width, screen.height) <= WIDTH_MAX)
      return true;
    return false;
  }

  function applyViewport() {
    var head = document.head || document.documentElement;
    var meta = document.querySelector('meta[name="viewport"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "viewport");
      head.appendChild(meta);
    }
    meta.setAttribute(
      "content",
      "width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover"
    );
  }

  function applyStyle() {
    var css = window.__PCWTM_CSS__;
    if (!css) return;
    var el = document.getElementById(STYLE_ID);
    if (!el) {
      el = document.createElement("style");
      el.id = STYLE_ID;
      (document.head || document.documentElement).appendChild(el);
    }
    if (el.textContent !== css) el.textContent = css;
  }

  function syncPage() {
    var path = location.pathname || "/";
    var search = location.search || "";
    var modal = /(?:\?|&)modal_id=/.test(search);
    var recommend =
      (path === "/" && /(?:\?|&)recommend=1/.test(search)) || !!document.getElementById("slidelist");
    var jingxuan = path.indexOf("/jingxuan") === 0 && !modal;
    var video = path.indexOf("/video/") === 0;
    var root = document.documentElement;
    root.classList.toggle("pcwtm-recommend", recommend);
    root.classList.toggle("pcwtm-jingxuan", jingxuan);
    root.classList.toggle("pcwtm-video", video);
    root.classList.toggle("pcwtm-modal", modal);
  }

  function syncMode() {
    var on = wantMobile();
    document.documentElement.classList.toggle("pcwtm", on);
    if (on) {
      applyViewport();
      applyStyle();
      syncPage();
    }
    return on;
  }

  function closeDrawer() {
    document.documentElement.classList.remove("pcwtm-open");
  }

  function toggleDrawer() {
    document.documentElement.classList.toggle("pcwtm-open");
  }

  function collectLinks() {
    var seen = Object.create(null);
    var out = [];
    function add(href, text) {
      if (!href) return;
      try {
        href = new URL(href, location.href).href;
      } catch (e) {
        return;
      }
      if (seen[href]) return;
      text = (text || "").replace(/\s+/g, " ").trim();
      if (!text || text.length > 24) return;
      if (/下载|打开抖音|Get APP|App/.test(text)) return;
      seen[href] = true;
      out.push({ href: href, text: text });
    }
    document
      .querySelectorAll(
        '[data-e2e="douyin-navigation"] a, #douyin-navigation a, #douyin-header a'
      )
      .forEach(function (a) {
        add(a.href, a.innerText || a.getAttribute("title") || a.getAttribute("aria-label"));
      });
    FALLBACK_LINKS.forEach(function (x) {
      add(x.href, x.text);
    });
    return out;
  }

  function ensureChrome() {
    if (!document.body) return;
    if (!document.documentElement.classList.contains("pcwtm")) return;

    var bar = document.getElementById("douyin-header");
    var existing = document.getElementById("pcwtm-menu-btn");
    if (!existing) {
      var btn = document.createElement("button");
      btn.id = "pcwtm-menu-btn";
      btn.type = "button";
      btn.setAttribute("aria-label", "菜单");
      btn.innerHTML =
        '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        renderDrawer();
        toggleDrawer();
      });
      if (bar) {
        bar.appendChild(btn);
      } else {
        btn.className = "pcwtm-float";
        document.body.appendChild(btn);
      }
    } else if (bar && existing.parentNode !== bar) {
      existing.classList.remove("pcwtm-float");
      bar.appendChild(existing);
    }

    if (!document.getElementById("pcwtm-mask")) {
      var mask = document.createElement("div");
      mask.id = "pcwtm-mask";
      mask.addEventListener("click", closeDrawer);
      document.body.appendChild(mask);
    }

    if (!document.getElementById("pcwtm-drawer")) {
      var drawer = document.createElement("nav");
      drawer.id = "pcwtm-drawer";
      drawer.setAttribute("aria-label", "站点菜单");
      document.body.appendChild(drawer);
    }

    bindFeedSwipe();
  }

  function renderDrawer() {
    var drawer = document.getElementById("pcwtm-drawer");
    if (!drawer) return;
    var links = collectLinks();
    drawer.innerHTML =
      '<div class="pcwtm-drawer-title">PC 网页功能</div>' +
      links
        .map(function (l) {
          return '<a href="' + l.href + '">' + l.text + "</a>";
        })
        .join("");
  }

  function bindFeedSwipe() {
    var list = document.getElementById("slidelist");
    if (!list || list.getAttribute("data-pcwtm-swipe") === "1") return;
    list.setAttribute("data-pcwtm-swipe", "1");
    var startY = 0;
    var startX = 0;
    list.addEventListener(
      "touchstart",
      function (e) {
        if (!e.touches || !e.touches[0]) return;
        startY = e.touches[0].clientY;
        startX = e.touches[0].clientX;
      },
      { passive: true }
    );
    list.addEventListener(
      "touchend",
      function (e) {
        if (!e.changedTouches || !e.changedTouches[0]) return;
        var dy = e.changedTouches[0].clientY - startY;
        var dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dy) < 60 || Math.abs(dy) < Math.abs(dx) * 1.4) return;
        if (
          e.target &&
          e.target.closest &&
          e.target.closest("#videoSideCard, #relatedVideoCard, [data-e2e='comment-list']")
        )
          return;
        var sel =
          dy < 0
            ? '[data-e2e="video-switch-next-arrow"]'
            : '[data-e2e="video-switch-prev-arrow"]';
        var arrow = document.querySelector(sel);
        if (arrow) arrow.click();
      },
      { passive: true }
    );
  }

  function sameTab() {
    document.addEventListener(
      "click",
      function (e) {
        var a = e.target && e.target.closest ? e.target.closest("a[target='_blank']") : null;
        if (!a) return;
        if (a.hostname.indexOf("douyin.com") === -1) return;
        a.setAttribute("target", "_self");
      },
      true
    );
  }

  var scheduled = false;
  function tick() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(function () {
      scheduled = false;
      if (!syncMode()) return;
      ensureChrome();
    });
  }

  syncMode();
  sameTab();

  document.addEventListener("DOMContentLoaded", tick);
  window.addEventListener("resize", syncMode);
  window.addEventListener("orientationchange", function () {
    setTimeout(syncMode, 250);
  });
  document.addEventListener("click", function (e) {
    if (e.target && e.target.closest && e.target.closest("#pcwtm-drawer a")) closeDrawer();
  });

  var obs = new MutationObserver(tick);
  obs.observe(document.documentElement, { childList: true, subtree: true });
  tick();
})();
