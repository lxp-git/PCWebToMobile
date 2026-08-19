// ==UserScript==
// @name         PCWebToMobile · 哔哩哔哩
// @namespace    https://local1st.app/pcwebtomobile
// @version      0.1.0
// @description  用 CSS 把 bilibili.com PC 网页收成手机能用的布局，不抓内容，保留网页版功能
// @author       PCWebToMobile
// @match        *://www.bilibili.com/*
// @match        *://search.bilibili.com/*
// @match        *://space.bilibili.com/*
// @match        *://t.bilibili.com/*
// @match        *://message.bilibili.com/*
// @match        *://live.bilibili.com/*
// @match        *://m.bilibili.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  window.__PCWTM_CSS__ = "/* PCWebToMobile \u00b7 bilibili\n * Applied under html.pcwtm (userscript) or @media (max-width: 920px) (Stylus).\n * Layout only \u2014 keep Bilibili's own colors, type, and controls.\n */\n\nhtml.pcwtm {\n  --pcwtm-bar: 52px;\n  --pcwtm-pink: #fb7299;\n  --pcwtm-text: #18191c;\n  --pcwtm-muted: #9499a0;\n  --pcwtm-bg: #f6f7f8;\n  --pcwtm-gap: 8px;\n}\n\nhtml.pcwtm,\nhtml.pcwtm body {\n  min-width: 0 !important;\n  max-width: 100% !important;\n  width: 100% !important;\n  overflow-x: hidden !important;\n  background: var(--pcwtm-bg);\n}\n\nhtml.pcwtm body {\n  padding-left: env(safe-area-inset-left);\n  padding-right: env(safe-area-inset-right);\n}\n\n/* Shells that hard-code 1080/1100 min-width */\nhtml.pcwtm #app,\nhtml.pcwtm .app-v1,\nhtml.pcwtm .bili-header,\nhtml.pcwtm .bili-header__bar,\nhtml.pcwtm .bili-header__banner,\nhtml.pcwtm .bili-header__channel,\nhtml.pcwtm .header-channel,\nhtml.pcwtm .header-channel-fixed,\nhtml.pcwtm .bili-feed4,\nhtml.pcwtm .bili-feed4-layout,\nhtml.pcwtm .feed2,\nhtml.pcwtm .recommended-container_floor-aside,\nhtml.pcwtm .container,\nhtml.pcwtm .video-container-v1,\nhtml.pcwtm .left-container,\nhtml.pcwtm .right-container,\nhtml.pcwtm .right-container-inner,\nhtml.pcwtm .main-container,\nhtml.pcwtm .plp-l,\nhtml.pcwtm .plp-r {\n  min-width: 0 !important;\n  max-width: 100% !important;\n  width: 100% !important;\n}\n\n/* ---------- Header ---------- */\n\nhtml.pcwtm .bili-header__bar,\nhtml.pcwtm .bili-header__bar.mini-header {\n  position: fixed !important;\n  top: 0 !important;\n  left: 0 !important;\n  right: 0 !important;\n  height: var(--pcwtm-bar) !important;\n  min-height: var(--pcwtm-bar) !important;\n  padding: 0 6px 0 8px !important;\n  margin: 0 !important;\n  display: flex !important;\n  align-items: center !important;\n  gap: 6px !important;\n  z-index: 10050 !important;\n  background: rgba(255, 255, 255, 0.94) !important;\n  backdrop-filter: blur(16px) saturate(1.2);\n  -webkit-backdrop-filter: blur(16px) saturate(1.2);\n  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.06) !important;\n  border-bottom: 0 !important;\n  transform: none !important;\n}\n\nhtml.pcwtm .bili-header.large-header {\n  min-height: 0 !important;\n}\n\nhtml.pcwtm .bili-header.fixed-header {\n  height: var(--pcwtm-bar) !important;\n  min-height: var(--pcwtm-bar) !important;\n}\n\nhtml.pcwtm .left-entry {\n  display: none !important;\n}\n\nhtml.pcwtm .right-entry {\n  display: flex !important;\n  flex: 0 0 auto !important;\n  width: auto !important;\n  margin: 0 !important;\n  gap: 0 !important;\n  align-items: center !important;\n}\n\nhtml.pcwtm .right-entry > :not(.header-avatar-wrap) {\n  display: none !important;\n}\n\nhtml.pcwtm .header-avatar-wrap,\nhtml.pcwtm .header-avatar-wrap--container,\nhtml.pcwtm .header-entry-mini {\n  width: 36px !important;\n  height: 36px !important;\n  margin: 0 !important;\n}\n\nhtml.pcwtm .bili-header .header-entry-avatar,\nhtml.pcwtm .bili-header .bili-avatar {\n  width: 32px !important;\n  height: 32px !important;\n}\n\nhtml.pcwtm .center-search-container,\nhtml.pcwtm .center-search-container.offset-center-search {\n  position: static !important;\n  flex: 1 1 auto !important;\n  width: auto !important;\n  max-width: none !important;\n  min-width: 0 !important;\n  margin: 0 !important;\n  transform: none !important;\n  left: auto !important;\n}\n\nhtml.pcwtm .center-search__bar,\nhtml.pcwtm #nav-searchform {\n  width: 100% !important;\n  max-width: none !important;\n  height: 36px !important;\n}\n\nhtml.pcwtm .nav-search-input {\n  font-size: 16px !important; /* iOS no-zoom */\n  height: 36px !important;\n}\n\nhtml.pcwtm .search-panel {\n  width: min(100vw - 16px, 420px) !important;\n  left: 8px !important;\n  right: 8px !important;\n  max-height: 70vh !important;\n}\n\nhtml.pcwtm #pcwtm-menu-btn {\n  flex: 0 0 40px;\n  width: 40px;\n  height: 40px;\n  border: 0;\n  padding: 0;\n  margin: 0;\n  background: transparent;\n  border-radius: 10px;\n  color: var(--pcwtm-text);\n  display: grid;\n  place-items: center;\n  cursor: pointer;\n}\n\nhtml.pcwtm #pcwtm-menu-btn:active {\n  background: rgba(0, 0, 0, 0.06);\n}\n\nhtml.pcwtm #pcwtm-mask {\n  display: none;\n  position: fixed;\n  inset: 0;\n  z-index: 10060;\n  background: rgba(0, 0, 0, 0.38);\n}\n\nhtml.pcwtm.pcwtm-open #pcwtm-mask {\n  display: block;\n}\n\nhtml.pcwtm #pcwtm-drawer {\n  position: fixed;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  width: min(82vw, 320px);\n  z-index: 10070;\n  background: #fff;\n  box-shadow: -8px 0 32px rgba(0, 0, 0, 0.12);\n  transform: translateX(105%);\n  transition: transform 0.22s ease;\n  overflow-y: auto;\n  padding: calc(12px + env(safe-area-inset-top)) 8px 24px;\n  -webkit-overflow-scrolling: touch;\n}\n\nhtml.pcwtm.pcwtm-open #pcwtm-drawer {\n  transform: translateX(0);\n}\n\nhtml.pcwtm #pcwtm-drawer a {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 12px 14px;\n  border-radius: 10px;\n  color: var(--pcwtm-text);\n  text-decoration: none;\n  font-size: 15px;\n  line-height: 1.2;\n}\n\nhtml.pcwtm #pcwtm-drawer a:active {\n  background: #f1f2f3;\n}\n\nhtml.pcwtm #pcwtm-drawer .pcwtm-drawer-title {\n  padding: 8px 14px 14px;\n  font-size: 13px;\n  color: var(--pcwtm-muted);\n  letter-spacing: 0.08em;\n}\n\n/* ---------- Homepage banner + channel ---------- */\n\nhtml.pcwtm .bili-header__banner {\n  height: 72px !important;\n  min-height: 72px !important;\n  min-width: 0 !important;\n  width: 100% !important;\n  margin-top: var(--pcwtm-bar) !important;\n  overflow: hidden !important;\n}\n\nhtml.pcwtm .bili-header__banner img,\nhtml.pcwtm .bili-header__banner .banner-img {\n  width: 100% !important;\n  height: 100% !important;\n  object-fit: cover !important;\n}\n\nhtml.pcwtm .header-banner__inner,\nhtml.pcwtm .animated-banner,\nhtml.pcwtm .taper-line {\n  display: none !important;\n}\n\nhtml.pcwtm .bili-header__channel {\n  display: flex !important;\n  flex-wrap: nowrap !important;\n  align-items: stretch !important;\n  gap: 4px !important;\n  width: 100% !important;\n  height: auto !important;\n  min-height: 0 !important;\n  padding: 8px 0 10px !important;\n  overflow-x: auto !important;\n  overflow-y: hidden !important;\n  -webkit-overflow-scrolling: touch;\n  scrollbar-width: none;\n}\n\nhtml.pcwtm .bili-header__channel::-webkit-scrollbar {\n  display: none;\n}\n\nhtml.pcwtm .channel-icons {\n  flex: 0 0 auto !important;\n  margin: 0 4px 0 8px !important;\n}\n\nhtml.pcwtm .icon-title {\n  color: var(--pcwtm-text) !important;\n}\n\nhtml.pcwtm .right-channel-container,\nhtml.pcwtm .channel-items__left,\nhtml.pcwtm .channel-items__right {\n  display: flex !important;\n  flex-wrap: nowrap !important;\n  flex: 0 0 auto !important;\n  width: max-content !important;\n  max-width: none !important;\n  min-width: 0 !important;\n  overflow: visible !important;\n  gap: 6px !important;\n}\n\nhtml.pcwtm .channel-link,\nhtml.pcwtm .channel-link__right,\nhtml.pcwtm .channel-entry-more__link {\n  display: inline-flex !important;\n  align-items: center !important;\n  justify-content: center !important;\n  flex: 0 0 auto !important;\n  width: auto !important;\n  min-width: 0 !important;\n  max-width: none !important;\n  height: 32px !important;\n  white-space: nowrap !important;\n  padding: 0 12px !important;\n  font-size: 13px !important;\n  color: var(--pcwtm-text) !important;\n  background: #f1f2f3 !important;\n  border-radius: 16px !important;\n}\n\nhtml.pcwtm .header-channel {\n  display: none !important;\n}\n\n/* ---------- Homepage feed ---------- */\n\nhtml.pcwtm .bili-feed4 {\n  margin-top: 0 !important;\n}\n\nhtml.pcwtm .bili-feed4-layout,\nhtml.pcwtm .feed2,\nhtml.pcwtm .recommended-container_floor-aside {\n  width: 100% !important;\n  margin: 0 !important;\n  padding: 0 0 72px !important;\n}\n\nhtml.pcwtm .container,\nhtml.pcwtm .container.is-version8 {\n  display: grid !important;\n  grid-template-columns: repeat(2, minmax(0, 1fr)) !important;\n  grid-template-rows: none !important;\n  grid-auto-rows: auto !important;\n  gap: 12px 8px !important;\n  width: 100% !important;\n  padding: 0 var(--pcwtm-gap) !important;\n  margin: 0 !important;\n}\n\nhtml.pcwtm .recommended-swipe {\n  grid-column: 1 / -1 !important;\n  width: 100% !important;\n  height: auto !important;\n  min-height: 0 !important;\n}\n\nhtml.pcwtm .recommended-swipe-core,\nhtml.pcwtm .recommended-swipe-shim {\n  width: 100% !important;\n  height: auto !important;\n  display: grid !important;\n  grid-template-columns: repeat(2, minmax(0, 1fr)) !important;\n  gap: 12px 8px !important;\n}\n\nhtml.pcwtm .feed-card,\nhtml.pcwtm .bili-video-card,\nhtml.pcwtm .bili-video-card__wrap {\n  width: 100% !important;\n  height: auto !important;\n  min-height: 0 !important;\n}\n\nhtml.pcwtm .bili-video-card__image,\nhtml.pcwtm .bili-video-card__image--wrap,\nhtml.pcwtm .bili-video-card__cover {\n  width: 100% !important;\n  border-radius: 8px !important;\n}\n\nhtml.pcwtm .bili-video-card__info {\n  padding: 6px 2px 0 !important;\n}\n\nhtml.pcwtm .bili-video-card__info--tit {\n  font-size: 13px !important;\n  line-height: 1.35 !important;\n}\n\nhtml.pcwtm .bili-video-card__info--right {\n  padding-left: 0 !important;\n}\n\nhtml.pcwtm .bili-video-card__info--icon-text {\n  display: none !important;\n}\n\nhtml.pcwtm .feed-roll-btn {\n  display: none !important;\n}\n\nhtml.pcwtm .palette-button-wrap {\n  right: 12px !important;\n  left: auto !important;\n  bottom: calc(16px + env(safe-area-inset-bottom)) !important;\n}\n\nhtml.pcwtm .download-client-trigger,\nhtml.pcwtm .vip-login-tip,\nhtml.pcwtm .bili-footer {\n  display: none !important;\n}\n\n/* ---------- Video page ---------- */\n\nhtml.pcwtm .video-container-v1 {\n  display: flex !important;\n  flex-direction: column !important;\n  align-items: stretch !important;\n  padding: 0 !important;\n  margin: 0 !important;\n  width: 100% !important;\n}\n\nhtml.pcwtm .left-container,\nhtml.pcwtm .left-container.scroll-sticky {\n  position: relative !important;\n  top: auto !important;\n  width: 100% !important;\n  padding: 0 !important;\n  display: flex !important;\n  flex-direction: column !important;\n}\n\nhtml.pcwtm .right-container,\nhtml.pcwtm .right-container-inner,\nhtml.pcwtm .right-container-inner.scroll-sticky {\n  position: relative !important;\n  top: auto !important;\n  width: 100% !important;\n  padding: 0 10px 24px !important;\n  box-sizing: border-box !important;\n  max-width: 100% !important;\n}\n\nhtml.pcwtm #playerWrap,\nhtml.pcwtm .player-wrap {\n  order: -1;\n  position: relative !important;\n  width: 100% !important;\n  height: auto !important;\n  aspect-ratio: unset !important;\n  background: #000;\n}\n\nhtml.pcwtm #bilibili-player {\n  position: relative !important;\n  inset: auto !important;\n  display: block !important;\n  width: 100% !important;\n  max-width: 100% !important;\n  height: auto !important;\n  aspect-ratio: 16 / 9 !important;\n}\n\nhtml.pcwtm .bpx-docker,\nhtml.pcwtm .bpx-player-container,\nhtml.pcwtm .bpx-player-primary-area,\nhtml.pcwtm .bpx-player-video-area {\n  width: 100% !important;\n  height: 100% !important;\n  max-width: 100% !important;\n}\n\nhtml.pcwtm .bpx-player-sending-bar {\n  display: flex !important;\n  align-items: center !important;\n  width: 100% !important;\n  max-width: 100% !important;\n  box-sizing: border-box !important;\n  padding: 6px 8px !important;\n  overflow: hidden !important;\n}\n\nhtml.pcwtm .bpx-player-dm-root {\n  flex: 1 1 auto !important;\n  min-width: 0 !important;\n}\n\nhtml.pcwtm .bpx-player-sending-bar a[href*=\"help.html\"] {\n  display: none !important;\n}\n\nhtml.pcwtm #viewbox_report,\nhtml.pcwtm .video-info-container {\n  width: 100% !important;\n  height: auto !important;\n  padding: 10px 12px 6px !important;\n}\n\nhtml.pcwtm .video-title {\n  width: 100% !important;\n  font-size: 16px !important;\n  line-height: 1.4 !important;\n  white-space: normal !important;\n  height: auto !important;\n}\n\nhtml.pcwtm .video-info-meta,\nhtml.pcwtm .video-info-detail-list {\n  flex-wrap: wrap !important;\n  row-gap: 4px !important;\n}\n\nhtml.pcwtm #arc_toolbar_report,\nhtml.pcwtm .video-toolbar-container {\n  width: 100% !important;\n  height: auto !important;\n  padding: 4px 4px 8px !important;\n  display: flex !important;\n  flex-direction: row !important;\n  flex-wrap: nowrap !important;\n  align-items: center !important;\n  gap: 4px !important;\n  box-sizing: border-box !important;\n  overflow-x: auto !important;\n}\n\nhtml.pcwtm .video-toolbar-left,\nhtml.pcwtm .video-toolbar-right,\nhtml.pcwtm .video-toolbar-left-main {\n  display: flex !important;\n  flex-wrap: nowrap !important;\n  width: auto !important;\n  flex: 1 1 auto !important;\n  justify-content: space-around !important;\n}\n\nhtml.pcwtm .video-toolbar-right {\n  flex: 0 0 auto !important;\n}\n\nhtml.pcwtm .video-tag-container {\n  width: 100% !important;\n  padding: 0 12px 8px !important;\n  overflow-x: auto !important;\n  flex-wrap: nowrap !important;\n}\n\nhtml.pcwtm #commentapp,\nhtml.pcwtm #comment,\nhtml.pcwtm .reply-wrap {\n  width: 100% !important;\n  padding: 0 8px !important;\n}\n\nhtml.pcwtm .up-panel-container,\nhtml.pcwtm .up-info-container {\n  width: 100% !important;\n  padding: 10px 0 !important;\n}\n\nhtml.pcwtm #danmukuBox {\n  display: none !important;\n}\n\nhtml.pcwtm .recommend-list-v1,\nhtml.pcwtm .rec-list,\nhtml.pcwtm .rcmd-tab {\n  width: 100% !important;\n}\n\nhtml.pcwtm .video-page-card-small {\n  width: 100% !important;\n}\n\nhtml.pcwtm .video-page-card-small .card-box {\n  display: flex !important;\n  gap: 10px !important;\n}\n\nhtml.pcwtm .video-page-card-small .pic-box {\n  flex: 0 0 42% !important;\n  width: 42% !important;\n}\n\nhtml.pcwtm .ad-report,\nhtml.pcwtm .video-card-ad-small,\nhtml.pcwtm .slide-ad-exp,\nhtml.pcwtm .fixed-sidenav-storage,\nhtml.pcwtm .banner-card {\n  display: none !important;\n}\n\n/* Bangumi / old two-pane player */\nhtml.pcwtm .main-container {\n  display: flex !important;\n  flex-direction: column !important;\n  width: 100% !important;\n}\n\nhtml.pcwtm .plp-l,\nhtml.pcwtm .plp-r {\n  width: 100% !important;\n  float: none !important;\n}\n\n/* Search */\nhtml.pcwtm .search-layout,\nhtml.pcwtm .search-content,\nhtml.pcwtm .search-page {\n  width: 100% !important;\n  min-width: 0 !important;\n  padding: 8px !important;\n  margin: 0 !important;\n}\n\n/* Space */\nhtml.pcwtm .space-app,\nhtml.pcwtm #app > .wrapper {\n  width: 100% !important;\n  min-width: 0 !important;\n}\n\n@media (max-width: 360px) {\n  html.pcwtm .container,\n  html.pcwtm .container.is-version8,\n  html.pcwtm .recommended-swipe-shim {\n    grid-template-columns: 1fr !important;\n  }\n}\n";

  var STYLE_ID = "pcwtm-bilibili-css";
  var WIDTH_MAX = 920;

  var FALLBACK_LINKS = [
    { href: "https://www.bilibili.com/", text: "首页" },
    { href: "https://t.bilibili.com/", text: "动态" },
    { href: "https://www.bilibili.com/v/popular/all", text: "热门" },
    { href: "https://www.bilibili.com/anime/", text: "番剧" },
    { href: "https://live.bilibili.com/", text: "直播" },
    { href: "https://www.bilibili.com/history", text: "历史" },
    { href: "https://message.bilibili.com/", text: "消息" },
    { href: "https://space.bilibili.com/", text: "我的" },
    { href: "https://member.bilibili.com/platform/upload/video/frame", text: "投稿" },
    { href: "https://member.bilibili.com/platform/home", text: "创作中心" },
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

  function syncMode() {
    var on = wantMobile();
    document.documentElement.classList.toggle("pcwtm", on);
    if (on) {
      applyViewport();
      applyStyle();
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
      if (/下载客户端/.test(text)) return;
      seen[href] = true;
      out.push({ href: href, text: text });
    }
    document
      .querySelectorAll(
        ".left-entry > li > a, .right-entry > li > a, .right-entry > .vip-wrap a, .channel-link, .channel-link__right, .channel-icons__item"
      )
      .forEach(function (a) {
        if (a.closest(".v-popover-content, .message-entry-popover")) return;
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

    var bar = document.querySelector(".bili-header__bar");
    if (bar && !document.getElementById("pcwtm-menu-btn")) {
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
      bar.appendChild(btn);
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

  function sameTab() {
    document.addEventListener(
      "click",
      function (e) {
        var a = e.target && e.target.closest ? e.target.closest("a[target='_blank']") : null;
        if (!a) return;
        if (a.hostname.indexOf("bilibili.com") === -1) return;
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
