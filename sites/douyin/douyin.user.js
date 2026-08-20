// ==UserScript==
// @name         PCWebToMobile · 抖音
// @namespace    https://local1st.app/pcwebtomobile
// @version      0.2.0
// @description  用 CSS 把 douyin.com PC 网页收成手机能用的布局，不抓内容，保留网页版功能
// @author       PCWebToMobile
// @match        *://www.douyin.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  window.__PCWTM_CSS__ = "/* PCWebToMobile \u00b7 douyin\n * Applied under html.pcwtm (userscript) or @media (max-width: 920px) (Stylus).\n * Layout only \u2014 keep Douyin's own DOM, player, actions, and comments.\n *\n * Tokens once, under html.pcwtm: near-black video + quiet gray + Douyin's red.\n * Overlay chrome is thin; unused PC rails stay in the DOM (drawer reads them)\n * but are hidden with display / content-visibility, not JS loops.\n *\n * Selectors verified on the official PC shell (2026-08-20, logged-out):\n *   #root #douyin-header #douyin-header-menuCt\n *   #douyin-navigation / [data-e2e=\"douyin-navigation\"]\n *   #douyin-sidebar #douyin-sidebar-new #douyin-right-container\n *   Recommend swipe (/?recommend=1): #slidelist.recommend-slidelist #sliderVideo\n *     [data-e2e=\"feed-active-video\"|\"slideList\"|\"feed-video\"|\"feed-comment-icon\"]\n *     .page-recommend-container .sliderVideo .playerContainer .basePlayerContainer\n *     .xgplayer .positionBox #video-info-wrap\n *   Comments on feed: #videoSideCard (visible) #videoSideBar (often width 0)\n *     #relatedVideoCard #merge-all-comment-container [data-e2e=\"comment-list\"]\n *   /video/:id: [data-e2e=\"video-detail\"|\"player-container\"] .leftContainer\n *   /jingxuan: .jingxuan-scroll-element .discover-video-card-item .discover-tab-bar\n * Hashed class names (e.g. .eRu21rp0) are avoided \u2014 they rotate.\n * JS may add html.pcwtm-recommend / pcwtm-jingxuan / pcwtm-video / pcwtm-modal.\n */\n\nhtml.pcwtm {\n  --pcwtm-bg: #000;\n  --pcwtm-elevated: #161616;\n  --pcwtm-fg: #ececec;\n  --pcwtm-muted: #8a8a8a;\n  --pcwtm-accent: #fe2c55;\n  --pcwtm-border: rgba(236, 236, 236, 0.12);\n  --pcwtm-space: 8px;\n  --pcwtm-radius: 8px;\n  --pcwtm-bar: 48px;\n  --header-height: var(--pcwtm-bar);\n  color-scheme: dark;\n}\n\nhtml.pcwtm,\nhtml.pcwtm body {\n  min-width: 0 !important;\n  max-width: 100% !important;\n  width: 100% !important;\n  overflow-x: hidden !important;\n  background: var(--pcwtm-bg);\n}\n\nhtml.pcwtm body {\n  padding-left: env(safe-area-inset-left);\n  padding-right: env(safe-area-inset-right);\n}\n\nhtml.pcwtm.pcwtm-recommend body,\nhtml.pcwtm.pcwtm-modal body {\n  padding-left: 0;\n  padding-right: 0;\n}\n\n/* Shells that lock a desktop min-width (~580px+ was observed at 390 CSS px) */\nhtml.pcwtm #root,\nhtml.pcwtm #root > div,\nhtml.pcwtm #douyin-right-container,\nhtml.pcwtm #douyin-header,\nhtml.pcwtm #slidelist,\nhtml.pcwtm #sliderVideo,\nhtml.pcwtm .parent-route-container,\nhtml.pcwtm .route-scroll-container,\nhtml.pcwtm .page-recommend-container,\nhtml.pcwtm .playerContainer,\nhtml.pcwtm .basePlayerContainer,\nhtml.pcwtm .leftContainer,\nhtml.pcwtm [data-e2e=\"video-detail\"],\nhtml.pcwtm [data-e2e=\"slideList\"],\nhtml.pcwtm [data-e2e=\"player-container\"] {\n  min-width: 0 !important;\n  max-width: 100% !important;\n  width: 100% !important;\n  box-sizing: border-box !important;\n}\n\n/* ---------- Unused PC columns: hide in CSS, keep in DOM ---------- */\n\nhtml.pcwtm #douyin-navigation,\nhtml.pcwtm [data-e2e=\"douyin-navigation\"],\nhtml.pcwtm #douyin-sidebar,\nhtml.pcwtm #douyin-sidebar-new,\nhtml.pcwtm img#douyin-temp-sidebar {\n  display: none !important;\n  content-visibility: hidden;\n  contain: strict;\n}\n\n/* ---------- Header (search stays; feed hides this for full-bleed) ---------- */\n\nhtml.pcwtm #douyin-header {\n  position: fixed !important;\n  top: env(safe-area-inset-top) !important;\n  left: 0 !important;\n  right: 0 !important;\n  height: var(--pcwtm-bar) !important;\n  min-height: var(--pcwtm-bar) !important;\n  max-height: var(--pcwtm-bar) !important;\n  margin: 0 !important;\n  padding: 0 56px 0 var(--pcwtm-space) !important;\n  z-index: 10050 !important;\n  display: flex !important;\n  align-items: center !important;\n  gap: var(--pcwtm-space) !important;\n  background: var(--pcwtm-elevated) !important;\n  border-bottom: 1px solid var(--pcwtm-border);\n  color: var(--pcwtm-fg);\n}\n\nhtml.pcwtm.pcwtm-recommend #douyin-header,\nhtml.pcwtm.pcwtm-modal #douyin-header {\n  display: none !important;\n  content-visibility: hidden;\n}\n\nhtml.pcwtm.pcwtm-recommend.pcwtm-searching #douyin-header,\nhtml.pcwtm.pcwtm-modal.pcwtm-searching #douyin-header {\n  display: flex !important;\n  content-visibility: visible;\n}\n\nhtml.pcwtm #douyin-header > div,\nhtml.pcwtm #douyin-header > div[data-click=\"doubleClick\"] {\n  min-width: 0 !important;\n  max-width: 100% !important;\n  width: 100% !important;\n  flex: 1 1 auto !important;\n}\n\nhtml.pcwtm #douyin-header input[data-e2e=\"searchbar-input\"],\nhtml.pcwtm #douyin-header input[type=\"search\"],\nhtml.pcwtm #douyin-header input[type=\"text\"] {\n  font-size: 16px !important; /* iOS no-zoom */\n  min-width: 0 !important;\n}\n\nhtml.pcwtm #douyin-header-menuCt {\n  flex: 0 0 auto !important;\n  max-width: none !important;\n  overflow: visible !important;\n}\n\nhtml.pcwtm #douyin-header [data-e2e=\"notice-entry\"],\nhtml.pcwtm #douyin-header [data-e2e=\"im-entry\"],\nhtml.pcwtm #douyin-header [data-e2e=\"something-button\"] {\n  display: none !important;\n  content-visibility: hidden;\n}\n\nhtml.pcwtm #douyin-header [id^=\"douyin-header-menu\"] {\n  flex: 0 0 auto !important;\n}\n\n/* ---------- Overlay chrome ---------- */\n\nhtml.pcwtm #pcwtm-menu-btn {\n  box-sizing: border-box;\n  width: 44px;\n  height: 44px;\n  padding: 0;\n  margin: 0;\n  border: 1px solid var(--pcwtm-border);\n  border-radius: var(--pcwtm-radius);\n  background: var(--pcwtm-elevated);\n  color: var(--pcwtm-fg);\n  display: grid;\n  place-items: center;\n  cursor: pointer;\n  touch-action: manipulation;\n  -webkit-tap-highlight-color: transparent;\n}\n\nhtml.pcwtm #pcwtm-menu-btn.pcwtm-float {\n  position: fixed;\n  top: calc(var(--pcwtm-space) + env(safe-area-inset-top));\n  right: calc(var(--pcwtm-space) + env(safe-area-inset-right));\n  z-index: 10080;\n}\n\nhtml.pcwtm #pcwtm-menu-btn:active {\n  transform: scale(0.96);\n}\n\nhtml.pcwtm #pcwtm-mask {\n  position: fixed;\n  inset: 0;\n  z-index: 10060;\n  background: rgba(0, 0, 0, 0.46);\n  opacity: 0;\n  pointer-events: none;\n  transition: opacity 180ms ease;\n  contain: strict;\n  touch-action: manipulation;\n}\n\nhtml.pcwtm.pcwtm-open #pcwtm-mask {\n  opacity: 1;\n  pointer-events: auto;\n}\n\nhtml.pcwtm #pcwtm-drawer {\n  position: fixed;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  width: min(80vw, 320px);\n  z-index: 10070;\n  box-sizing: border-box;\n  background: var(--pcwtm-elevated);\n  color: var(--pcwtm-fg);\n  border-left: 1px solid var(--pcwtm-border);\n  border-radius: 24px 0 0 24px; /* inner 8 + padding 16 */\n  transform: translateX(105%);\n  transition: transform 200ms ease;\n  overflow-x: hidden;\n  overflow-y: auto;\n  overscroll-behavior: contain;\n  padding: calc(16px + env(safe-area-inset-top)) 16px calc(24px + env(safe-area-inset-bottom));\n  -webkit-overflow-scrolling: touch;\n  contain: layout paint style;\n  touch-action: manipulation;\n}\n\nhtml.pcwtm.pcwtm-open #pcwtm-drawer {\n  transform: translateX(0);\n}\n\nhtml.pcwtm #pcwtm-drawer a,\nhtml.pcwtm #pcwtm-drawer button {\n  display: flex;\n  align-items: center;\n  width: 100%;\n  box-sizing: border-box;\n  gap: var(--pcwtm-space);\n  margin: 0 0 var(--pcwtm-space);\n  padding: 12px 16px;\n  border: 0;\n  border-radius: var(--pcwtm-radius);\n  background: transparent;\n  color: var(--pcwtm-fg);\n  text-align: left;\n  text-decoration: none;\n  font: inherit;\n  font-size: 15px;\n  line-height: 1.2;\n  cursor: pointer;\n  touch-action: manipulation;\n  -webkit-tap-highlight-color: transparent;\n}\n\nhtml.pcwtm #pcwtm-drawer a:active,\nhtml.pcwtm #pcwtm-drawer button:active {\n  background: rgba(236, 236, 236, 0.06);\n}\n\nhtml.pcwtm #pcwtm-drawer a[aria-current=\"page\"] {\n  color: var(--pcwtm-accent);\n}\n\n@media (prefers-reduced-motion: reduce) {\n  html.pcwtm #pcwtm-mask,\n  html.pcwtm #pcwtm-drawer,\n  html.pcwtm #pcwtm-menu-btn {\n    transition: none;\n  }\n\n  html.pcwtm #pcwtm-menu-btn:active {\n    transform: none;\n  }\n}\n\n/* ---------- Homepage recommend slider (/?recommend=1) ---------- */\n\nhtml.pcwtm #douyin-right-container {\n  margin: 0 !important;\n  padding: 0 !important;\n  padding-top: var(--pcwtm-bar) !important;\n  left: 0 !important;\n}\n\nhtml.pcwtm.pcwtm-recommend #douyin-right-container,\nhtml.pcwtm.pcwtm-modal #douyin-right-container {\n  padding-top: 0 !important;\n}\n\nhtml.pcwtm #slidelist,\nhtml.pcwtm #slidelist.recommend-slidelist,\nhtml.pcwtm [data-e2e=\"slideList\"] {\n  width: 100% !important;\n  height: calc(100dvh - var(--pcwtm-bar)) !important;\n  min-height: calc(100dvh - var(--pcwtm-bar)) !important;\n  margin: 0 !important;\n  padding: 0 !important;\n  padding-right: 0 !important;\n  left: 0 !important;\n}\n\nhtml.pcwtm.pcwtm-recommend #slidelist,\nhtml.pcwtm.pcwtm-recommend #slidelist.recommend-slidelist,\nhtml.pcwtm.pcwtm-recommend [data-e2e=\"slideList\"],\nhtml.pcwtm.pcwtm-modal #slidelist,\nhtml.pcwtm.pcwtm-modal #slidelist.recommend-slidelist,\nhtml.pcwtm.pcwtm-modal [data-e2e=\"slideList\"] {\n  height: 100dvh !important;\n  min-height: 100dvh !important;\n}\n\nhtml.pcwtm #slidelist [data-e2e=\"feed-video\"]:not([data-e2e=\"feed-active-video\"]) {\n  content-visibility: auto;\n  contain-intrinsic-size: auto 100dvh;\n}\n\nhtml.pcwtm #slidelist .page-recommend-container,\nhtml.pcwtm #sliderVideo,\nhtml.pcwtm [data-e2e=\"feed-active-video\"],\nhtml.pcwtm [data-e2e=\"feed-video\"],\nhtml.pcwtm .sliderVideo,\nhtml.pcwtm .slider-video {\n  width: 100% !important;\n  max-width: 100% !important;\n  height: 100% !important;\n  min-height: 0 !important;\n  margin: 0 !important;\n  left: 0 !important;\n  right: 0 !important;\n}\n\nhtml.pcwtm #sliderVideo .playerContainer,\nhtml.pcwtm [data-e2e=\"feed-active-video\"] .playerContainer,\nhtml.pcwtm [data-e2e=\"feed-video\"] .playerContainer,\nhtml.pcwtm .basePlayerContainer,\nhtml.pcwtm .xgplayer,\nhtml.pcwtm [data-e2e=\"player-container\"] {\n  width: 100% !important;\n  max-width: 100% !important;\n  height: 100% !important;\n  left: 0 !important;\n}\n\nhtml.pcwtm .xgplayer video,\nhtml.pcwtm .basePlayerContainer video {\n  width: 100% !important;\n  height: 100% !important;\n  max-width: 100% !important;\n  object-fit: contain;\n}\n\n/* Official like / comment / favorite: keep host widgets, don't restyle as stickers */\nhtml.pcwtm .basePlayerContainer .positionBox,\nhtml.pcwtm [data-e2e=\"feed-active-video\"] .positionBox {\n  position: absolute !important;\n  right: calc(var(--pcwtm-space) + env(safe-area-inset-right)) !important;\n  bottom: calc(80px + env(safe-area-inset-bottom)) !important;\n  left: auto !important;\n  transform: none !important;\n  z-index: 5;\n  background: transparent !important;\n  box-shadow: none !important;\n}\n\nhtml.pcwtm [data-e2e=\"feed-comment-icon\"],\nhtml.pcwtm [data-e2e=\"video-player-digg\"],\nhtml.pcwtm [data-e2e=\"video-player-collect\"],\nhtml.pcwtm [data-e2e=\"video-player-share\"] {\n  pointer-events: auto;\n  touch-action: manipulation;\n}\n\nhtml.pcwtm #video-info-wrap,\nhtml.pcwtm .video-info-detail,\nhtml.pcwtm [data-e2e=\"video-info\"] {\n  max-width: calc(100% - 72px) !important;\n  width: auto !important;\n  left: calc(var(--pcwtm-space) + env(safe-area-inset-left)) !important;\n  right: auto !important;\n  bottom: calc(16px + env(safe-area-inset-bottom)) !important;\n}\n\n/* Official up/down switchers: keep, tuck to the right edge */\nhtml.pcwtm [data-e2e=\"video-switch-next-arrow\"],\nhtml.pcwtm [data-e2e=\"video-switch-prev-arrow\"],\nhtml.pcwtm .xgplayer-playswitch {\n  right: calc(var(--pcwtm-space) + env(safe-area-inset-right)) !important;\n  left: auto !important;\n}\n\n/* Comments / related card: bottom sheet only when the official panel is open */\nhtml.pcwtm #videoSideCard:has(#relatedVideoCard),\nhtml.pcwtm #videoSideCard:has(#merge-all-comment-container),\nhtml.pcwtm #videoSideCard:has([data-e2e=\"comment-list\"]),\nhtml.pcwtm #videoSideBar:has(#relatedVideoCard),\nhtml.pcwtm #videoSideBar:has(#merge-all-comment-container),\nhtml.pcwtm #videoSideBar:has([data-e2e=\"comment-list\"]) {\n  position: fixed !important;\n  left: 0 !important;\n  right: 0 !important;\n  bottom: 0 !important;\n  top: auto !important;\n  width: 100% !important;\n  max-width: 100% !important;\n  height: 72% !important;\n  max-height: 72dvh !important;\n  background: var(--pcwtm-elevated) !important;\n  border-top: 1px solid var(--pcwtm-border);\n  border-radius: 16px 16px 0 0; /* inner 8 + pad 8 */\n  z-index: 10040 !important;\n  overflow: hidden !important;\n  overscroll-behavior: contain;\n  contain: layout paint;\n  padding-bottom: env(safe-area-inset-bottom);\n}\n\nhtml.pcwtm:has(#videoSideCard:has([data-e2e=\"comment-list\"])) .positionBox,\nhtml.pcwtm:has(#videoSideCard:has([data-e2e=\"comment-list\"])) .xgplayer-playswitch,\nhtml.pcwtm:has(#videoSideBar:has([data-e2e=\"comment-list\"])) .positionBox,\nhtml.pcwtm:has(#videoSideBar:has([data-e2e=\"comment-list\"])) .xgplayer-playswitch {\n  visibility: hidden !important;\n}\n\nhtml.pcwtm #relatedVideoCard,\nhtml.pcwtm #merge-all-comment-container,\nhtml.pcwtm .comment-mainContent[data-e2e=\"comment-list\"],\nhtml.pcwtm [data-e2e=\"comment-list\"] {\n  width: 100% !important;\n  max-width: 100% !important;\n}\n\nhtml.pcwtm [data-e2e=\"comment-item\"] {\n  max-width: 100% !important;\n}\n\n/* ---------- Video detail /video/:id ---------- */\n\nhtml.pcwtm [data-e2e=\"video-detail\"] {\n  display: flex !important;\n  flex-direction: column !important;\n  align-items: stretch !important;\n  min-height: calc(100dvh - var(--pcwtm-bar)) !important;\n  padding: 0 !important;\n  margin: 0 !important;\n}\n\nhtml.pcwtm [data-e2e=\"video-detail\"] > * {\n  width: 100% !important;\n  max-width: 100% !important;\n  box-sizing: border-box !important;\n}\n\nhtml.pcwtm [data-e2e=\"video-detail\"] .leftContainer {\n  width: 100% !important;\n  max-width: 100% !important;\n  display: flex !important;\n  flex-direction: column !important;\n  padding: 0 !important;\n}\n\nhtml.pcwtm [data-e2e=\"video-detail\"] .leftContainer > [data-e2e=\"player-container\"] {\n  order: 1;\n}\n\nhtml.pcwtm [data-e2e=\"video-detail\"] .leftContainer > *:has([data-e2e=\"detail-video-info\"]) {\n  order: 2;\n}\n\nhtml.pcwtm [data-e2e=\"video-detail\"] .leftContainer > *:has([data-e2e=\"comment-list\"]) {\n  order: 3;\n}\n\nhtml.pcwtm [data-e2e=\"video-detail\"] .leftContainer > *:has([data-e2e=\"related-video\"]) {\n  order: 4;\n}\n\nhtml.pcwtm [data-e2e=\"video-detail\"] [data-e2e=\"player-container\"],\nhtml.pcwtm [data-e2e=\"video-detail\"] .video-detail-container,\nhtml.pcwtm [data-e2e=\"video-detail\"] .basePlayerContainer,\nhtml.pcwtm [data-e2e=\"video-detail\"] .xgplayer {\n  width: 100% !important;\n  max-width: 100% !important;\n  height: auto !important;\n  min-height: 56vw !important;\n  aspect-ratio: 9 / 16;\n  max-height: 70dvh !important;\n  background: var(--pcwtm-bg);\n}\n\nhtml.pcwtm [data-e2e=\"video-detail\"] .leftContainer > div:has(.comment-mainContent[data-e2e=\"comment-list\"]),\nhtml.pcwtm [data-e2e=\"video-detail\"] .leftContainer > div > div:has(.comment-mainContent[data-e2e=\"comment-list\"]),\nhtml.pcwtm [data-e2e=\"video-detail\"] #comment-input-container,\nhtml.pcwtm [data-e2e=\"video-detail\"] [data-e2e=\"comment-list\"] {\n  position: relative !important;\n  width: 100% !important;\n  max-width: 100% !important;\n  height: auto !important;\n  min-height: 40vh !important;\n  left: auto !important;\n  right: auto !important;\n  top: auto !important;\n  bottom: auto !important;\n}\n\nhtml.pcwtm [data-e2e=\"aweme-relate\"],\nhtml.pcwtm [data-e2e=\"related-video\"] {\n  width: 100% !important;\n  max-width: 100% !important;\n}\n\nhtml.pcwtm [data-e2e=\"comment-input\"],\nhtml.pcwtm textarea,\nhtml.pcwtm input[placeholder*=\"\u8bc4\u8bba\"] {\n  font-size: 16px !important;\n}\n\n/* ---------- \u7cbe\u9009 / jingxuan grid \u2192 single column ---------- */\n\nhtml.pcwtm .discover-tab-container,\nhtml.pcwtm .discover-tab-bar {\n  width: 100% !important;\n  max-width: 100% !important;\n  min-width: 0 !important;\n}\n\nhtml.pcwtm .discover-tab-bar {\n  display: flex !important;\n  flex-wrap: nowrap !important;\n  overflow-x: auto !important;\n  -webkit-overflow-scrolling: touch;\n  scrollbar-width: none;\n  touch-action: pan-x;\n}\n\nhtml.pcwtm .discover-tab-bar::-webkit-scrollbar {\n  display: none;\n}\n\nhtml.pcwtm .jingxuanFeedList,\nhtml.pcwtm .jingxuan-scroll-element {\n  display: flex !important;\n  flex-direction: column !important;\n  gap: var(--pcwtm-space) !important;\n  width: 100% !important;\n  max-width: 100% !important;\n  min-width: 0 !important;\n  padding: var(--pcwtm-space) var(--pcwtm-space) 72px !important;\n  box-sizing: border-box !important;\n  overflow-x: hidden !important;\n}\n\n/* Live grid is `.jingxuan-scroll-element > div` with hardcoded 314px 314px */\nhtml.pcwtm .jingxuan-scroll-element > div {\n  display: grid !important;\n  grid-template-columns: minmax(0, 1fr) !important;\n  width: 100% !important;\n  max-width: 100% !important;\n  min-width: 0 !important;\n  gap: var(--pcwtm-space) !important;\n}\n\nhtml.pcwtm .discover-video-card-item,\nhtml.pcwtm .discover-video-card-img,\nhtml.pcwtm .waterfall-videoCardContainer,\nhtml.pcwtm .jingxuanVideoCard {\n  width: 100% !important;\n  max-width: 100% !important;\n}\n\nhtml.pcwtm #douyin-right-container ul[data-e2e=\"scroll-list\"],\nhtml.pcwtm #search-result-container ul[data-e2e=\"scroll-list\"] {\n  display: flex !important;\n  flex-direction: column !important;\n  gap: var(--pcwtm-space) !important;\n  width: 100% !important;\n  padding: var(--pcwtm-space) var(--pcwtm-space) 72px !important;\n  box-sizing: border-box !important;\n}\n\nhtml.pcwtm #douyin-right-container ul[data-e2e=\"scroll-list\"] > li,\nhtml.pcwtm #search-result-container ul[data-e2e=\"scroll-list\"] > li,\nhtml.pcwtm .search-result-card {\n  width: 100% !important;\n  max-width: 100% !important;\n}\n\n/* modal_id overlay player (jingxuan tap \u2192 swipe) */\nhtml.pcwtm.pcwtm-modal #slidelist,\nhtml.pcwtm [class*=\"isCssFullScreen\"] #slidelist,\nhtml.pcwtm #slidelist[class*=\"isCssFullScreen\"] {\n  height: 100dvh !important;\n}\n\n/* ---------- Hide download / get-app chrome, keep login ---------- */\n\nhtml.pcwtm a[href*=\"apps.apple.com\"],\nhtml.pcwtm a[href*=\"itunes.apple.com\"],\nhtml.pcwtm [class*=\"get_app\"],\nhtml.pcwtm [class*=\"get-app\"] {\n  display: none !important;\n  content-visibility: hidden;\n}\n\nhtml.pcwtm [role=\"dialog\"],\nhtml.pcwtm .semi-modal,\nhtml.pcwtm #login-panel-new,\nhtml.pcwtm #login-pannel,\nhtml.pcwtm [data-e2e=\"recommend-guide-mask\"],\nhtml.pcwtm #douyin-web-recommend-guide-mask {\n  max-width: 100vw !important;\n}\n\n/* ---------- Search / profile: global min-width only ---------- */\n\nhtml.pcwtm #search-content-area,\nhtml.pcwtm #search-content-area > div,\nhtml.pcwtm #search-result-container {\n  width: 100% !important;\n  max-width: 100% !important;\n  min-width: 0 !important;\n}\n\n/* WAF / logged-out challenge shell: just unlock width */\nhtml.pcwtm body:has(script[src*=\"waf-jschallenge\"]) {\n  min-width: 0 !important;\n}\n";

  // After first paint we do not observe document with subtree:true.
  // Watch #slidelist / #douyin-header (childList only), plus popstate,
  // same-origin clicks, and a 2s interval. Coalesce with one rAF.
  // collectLinks runs only when the drawer opens (textContent, never innerText).

  var STYLE_ID = "pcwtm-douyin-css";
  var WIDTH_MAX = 920;
  var WATCH_MS = 2000;

  // Official PC destinations we keep reachable if the live nav omitted them.
  // Shop is not listed here — only collected when the official nav has it.
  var FALLBACK_LINKS = [
    { href: "https://www.douyin.com/?recommend=1", text: "推荐" },
    { href: "https://www.douyin.com/jingxuan", text: "精选" },
    { href: "https://www.douyin.com/follow", text: "关注" },
    { href: "https://live.douyin.com/", text: "直播" },
    { href: "https://www.douyin.com/user/self", text: "我的" },
  ];

  var watching = false;
  var scheduled = false;
  var intervalId = 0;
  var rootObservers = [];
  var observedRoots = [];

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
    } else {
      document.documentElement.classList.remove("pcwtm-open", "pcwtm-searching");
    }
    return on;
  }

  function closeDrawer() {
    document.documentElement.classList.remove("pcwtm-open");
  }

  function toggleDrawer() {
    if (document.documentElement.classList.contains("pcwtm-open")) {
      closeDrawer();
      return;
    }
    renderDrawer();
    document.documentElement.classList.add("pcwtm-open");
  }

  function destKey(href) {
    try {
      var u = new URL(href, location.href);
      var host = u.hostname;
      var p = u.pathname.replace(/\/+$/, "") || "/";
      if (u.searchParams.get("recommend") === "1") return "recommend";
      if (host.indexOf("live.") === 0 || p === "/live") return "live";
      if (p === "/follow") return "follow";
      if (p === "/jingxuan") return "jingxuan";
      if (p.indexOf("/user") === 0) return "user";
      if (p.indexOf("/search") === 0 || p === "/aisearch") return "search";
      if (p.indexOf("/notice") === 0 || /\/im\b/.test(p)) return "messages";
      if (p.indexOf("/mall") === 0 || p.indexOf("/shop") === 0) return "shop";
      return host + p;
    } catch (e) {
      return href;
    }
  }

  function labelOf(el) {
    return (el.getAttribute("aria-label") || el.getAttribute("title") || el.textContent || "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function collectLinks() {
    var seenHref = Object.create(null);
    var seenDest = Object.create(null);
    var seenText = Object.create(null);
    var out = [];

    function add(href, text) {
      if (!href) return;
      text = (text || "").replace(/\s+/g, " ").trim();
      if (!text || text.length > 24) return;
      if (/下载|打开抖音|Get APP|\bApp\b/i.test(text)) return;
      try {
        href = new URL(href, location.href).href;
      } catch (e) {
        return;
      }
      if (text === "推荐") href = "https://www.douyin.com/?recommend=1";
      if (seenHref[href]) return;
      var key = destKey(href);
      if (seenDest[key] || seenText[text]) return;
      seenHref[href] = true;
      seenDest[key] = true;
      seenText[text] = true;
      out.push({ href: href, text: text });
    }

    document
      .querySelectorAll('[data-e2e="douyin-navigation"] a, #douyin-navigation a')
      .forEach(function (a) {
        add(a.href, labelOf(a));
      });
    document
      .querySelectorAll(
        '#douyin-header a, #douyin-header-menuCt a, [data-e2e="notice-entry"] a, [data-e2e="im-entry"] a'
      )
      .forEach(function (a) {
        add(a.href, labelOf(a));
      });
    FALLBACK_LINKS.forEach(function (x) {
      add(x.href, x.text);
    });
    return out;
  }

  function hostActions(links) {
    var have = Object.create(null);
    links.forEach(function (l) {
      have[l.text] = true;
    });
    var extras = [];
    if (
      !have["搜索"] &&
      document.querySelector(
        '#douyin-header input[data-e2e="searchbar-input"], #douyin-header input[type="search"]'
      )
    ) {
      extras.push({ text: "搜索", kind: "search" });
    }
    if (!have["消息"] && document.querySelector("[data-e2e='im-entry'], [data-e2e='notice-entry']")) {
      extras.push({ text: "消息", kind: "messages" });
    }
    return extras;
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/"/g, "&quot;");
  }

  function isCurrent(href) {
    try {
      return destKey(href) === destKey(location.href);
    } catch (e) {
      return false;
    }
  }

  function renderDrawer() {
    var drawer = document.getElementById("pcwtm-drawer");
    if (!drawer) return;
    var links = collectLinks();
    var html = "";
    links.forEach(function (l) {
      html +=
        '<a href="' +
        escapeHtml(l.href) +
        '"' +
        (isCurrent(l.href) ? ' aria-current="page"' : "") +
        ">" +
        escapeHtml(l.text) +
        "</a>";
    });
    hostActions(links).forEach(function (a) {
      html +=
        '<button type="button" data-pcwtm-act="' +
        escapeHtml(a.kind) +
        '">' +
        escapeHtml(a.text) +
        "</button>";
    });
    drawer.innerHTML = html;
  }

  function runHostAction(kind) {
    closeDrawer();
    if (kind === "search") {
      var input = document.querySelector(
        '#douyin-header input[data-e2e="searchbar-input"], #douyin-header input[type="search"]'
      );
      if (!input) return;
      document.documentElement.classList.add("pcwtm-searching");
      input.focus();
      input.addEventListener(
        "blur",
        function () {
          document.documentElement.classList.remove("pcwtm-searching");
        },
        { once: true }
      );
      return;
    }
    if (kind === "messages") {
      var el = document.querySelector("[data-e2e='im-entry'], [data-e2e='notice-entry']");
      if (el) el.click();
    }
  }

  function ensureChrome() {
    if (!document.body) return;
    if (!document.documentElement.classList.contains("pcwtm")) return;

    var btn = document.getElementById("pcwtm-menu-btn");
    var mask = document.getElementById("pcwtm-mask");
    var drawer = document.getElementById("pcwtm-drawer");
    if (btn && mask && drawer) {
      bindFeedSwipe();
      return;
    }

    if (!btn) {
      btn = document.createElement("button");
      btn.id = "pcwtm-menu-btn";
      btn.type = "button";
      btn.className = "pcwtm-float";
      btn.setAttribute("aria-label", "菜单");
      btn.innerHTML =
        '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        toggleDrawer();
      });
      document.body.appendChild(btn);
    }

    if (!mask) {
      mask = document.createElement("div");
      mask.id = "pcwtm-mask";
      mask.addEventListener("click", closeDrawer);
      document.body.appendChild(mask);
    }

    if (!drawer) {
      drawer = document.createElement("nav");
      drawer.id = "pcwtm-drawer";
      drawer.setAttribute("aria-label", "菜单");
      drawer.addEventListener("click", function (e) {
        var act = e.target && e.target.closest ? e.target.closest("[data-pcwtm-act]") : null;
        if (act) {
          e.preventDefault();
          runHostAction(act.getAttribute("data-pcwtm-act"));
          return;
        }
        if (e.target && e.target.closest && e.target.closest("a")) closeDrawer();
      });
      document.body.appendChild(drawer);
    }

    bindFeedSwipe();
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

  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(function () {
      scheduled = false;
      apply();
    });
  }

  function apply() {
    var on = syncMode();
    if (on) {
      ensureChrome();
      startWatch();
    } else {
      stopWatch();
    }
  }

  function connectSmallRoots() {
    var live = [];
    var nextObs = [];
    var i;
    for (i = 0; i < observedRoots.length; i++) {
      if (observedRoots[i].isConnected) {
        live.push(observedRoots[i]);
        nextObs.push(rootObservers[i]);
      } else {
        rootObservers[i].disconnect();
      }
    }
    observedRoots = live;
    rootObservers = nextObs;
    ["slidelist", "douyin-header"].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el || observedRoots.indexOf(el) !== -1) return;
      var obs = new MutationObserver(schedule);
      obs.observe(el, { childList: true });
      rootObservers.push(obs);
      observedRoots.push(el);
    });
  }

  function onNavigate() {
    schedule();
    setTimeout(schedule, 400);
  }

  function onSameOriginClick(e) {
    var a = e.target && e.target.closest ? e.target.closest("a") : null;
    if (!a || !a.href) return;
    try {
      if (new URL(a.href, location.href).origin !== location.origin) return;
    } catch (err) {
      return;
    }
    onNavigate();
  }

  function startWatch() {
    connectSmallRoots();
    if (watching) return;
    watching = true;
    window.addEventListener("popstate", onNavigate);
    document.addEventListener("click", onSameOriginClick);
    intervalId = setInterval(function () {
      connectSmallRoots();
      schedule();
    }, WATCH_MS);
  }

  function stopWatch() {
    rootObservers.forEach(function (o) {
      o.disconnect();
    });
    rootObservers = [];
    observedRoots = [];
    if (!watching) return;
    watching = false;
    window.removeEventListener("popstate", onNavigate);
    document.removeEventListener("click", onSameOriginClick);
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = 0;
    }
  }

  apply();
  sameTab();
  document.addEventListener("DOMContentLoaded", schedule);
  window.addEventListener("resize", schedule);
  window.addEventListener("orientationchange", function () {
    setTimeout(schedule, 250);
  });
})();
