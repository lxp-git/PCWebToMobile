// ==UserScript==
// @name         PCWebToMobile · 抖音
// @namespace    https://local1st.app/pcwebtomobile
// @version      0.2.7
// @description  用 CSS 把 douyin.com PC 网页收成手机能用的布局，不抓内容，保留网页版功能
// @author       PCWebToMobile
// @match        *://www.douyin.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  window.__PCWTM_CSS__ = "/* PCWebToMobile \u00b7 douyin\n * Applied under html.pcwtm (userscript) or @media (max-width: 920px) (Stylus).\n * Layout only \u2014 keep Douyin's own DOM, player, actions, and comments.\n *\n * Tokens once, under html.pcwtm: near-black video + quiet gray + Douyin's red.\n * Overlay chrome is thin; unused PC rails stay in the DOM (drawer reads them)\n * but are hidden with display / content-visibility, not JS loops.\n *\n * Selectors verified on the official PC shell (2026-08-20, logged-out):\n *   #root #douyin-header #douyin-header-menuCt\n *   #douyin-navigation / [data-e2e=\"douyin-navigation\"]\n *   #douyin-sidebar #douyin-sidebar-new #douyin-right-container\n *   Recommend swipe (/?recommend=1): #slidelist.recommend-slidelist #sliderVideo\n *     [data-e2e=\"feed-active-video\"|\"slideList\"|\"feed-video\"|\"feed-comment-icon\"]\n *     .page-recommend-container .sliderVideo .playerContainer .basePlayerContainer\n *     .xgplayer .positionBox #video-info-wrap\n *   Comments on feed: #videoSideCard (visible) #videoSideBar (often width 0)\n *     #relatedVideoCard #merge-all-comment-container [data-e2e=\"comment-list\"]\n *   /video/:id: [data-e2e=\"video-detail\"|\"player-container\"] .leftContainer\n *     Official like/comment/fav/share is often a SIBLING right column\n *     (#douyin-sidebar / video-detail > *), not inside .positionBox.\n *     Do not 100dvh-clip that sibling. Do not display:none a host unless\n *     the rail is confirmed absent from it. e2e names may differ from\n *     video-player-digg / feed-comment-icon.\n *   /jingxuan: .jingxuan-scroll-element .discover-video-card-item .discover-tab-bar\n * Hashed class names (e.g. .eRu21rp0) are avoided \u2014 they rotate.\n * JS may add html.pcwtm-recommend / pcwtm-jingxuan / pcwtm-video / pcwtm-modal.\n * JS marks the in-view aweme with .pcwtm-active-aweme after /video/:id slide.\n * After a slide, do not keep first-card selectors \u2014 classes move with the item.\n * JS adds html.pcwtm-comments only when a #videoSideCard / #videoSideBar official\n * width is > 0 (live: closed=0, open\u2248391). querySelectorAll \u2014 not getElementById \u2014\n * so a later card's panel is not skipped. :has(comment-list) stays true after\n * official close \u2014 do not use it as the open signal.\n * JS may mark the official close node with .pcwtm-host-close (host node only).\n * Recommend door is /?recommend=1&from_nav=1 (bare ?recommend=1 bounces to jingxuan).\n * Login wall (live 390/720/1280, 2026-08-20): do not only target the article.\n * Hosts that can be the two-column card: #login-panel-new, #douyin-login-new-id,\n * #douyin_login_comp_flat_panel, #douyin_login_comp_single_panel,\n * #douyin_login_landing_flat_container. Like/header this run had no\n * single_panel (phone is #douyin_login_comp_mobile_code) but other variants\n * use it and may omit the article. Hide QR. Official X only \u2014 no homemade close.\n */\n\nhtml.pcwtm {\n  --pcwtm-bg: #000;\n  --pcwtm-elevated: #161616;\n  --pcwtm-fg: #ececec;\n  --pcwtm-muted: #8a8a8a;\n  --pcwtm-accent: #fe2c55;\n  --pcwtm-border: rgba(236, 236, 236, 0.12);\n  --pcwtm-space: 8px;\n  --pcwtm-radius: 8px;\n  --pcwtm-bar: 48px;\n  --pcwtm-tap: 44px;\n  --pcwtm-sheet: min(52dvh, 420px);\n  --header-height: var(--pcwtm-bar);\n  color-scheme: dark;\n}\n\nhtml.pcwtm,\nhtml.pcwtm body {\n  min-width: 0 !important;\n  max-width: 100% !important;\n  width: 100% !important;\n  overflow-x: hidden !important;\n  background: var(--pcwtm-bg);\n}\n\n/* overflow-x:hidden + a 100vw player clips a sibling right-column rail\n * (\u8d5e/\u8bc4/\u85cf/\u4eab live there on /video/:id; arrows live inside the player).\n * Do not clip the document on detail \u2014 one overflow value, visible. */\nhtml.pcwtm.pcwtm-video,\nhtml.pcwtm.pcwtm-video body {\n  overflow: visible !important;\n}\n\nhtml.pcwtm body {\n  padding-left: env(safe-area-inset-left);\n  padding-right: env(safe-area-inset-right);\n}\n\nhtml.pcwtm.pcwtm-recommend body,\nhtml.pcwtm.pcwtm-modal body {\n  padding-left: 0;\n  padding-right: 0;\n}\n\n/* Shells that lock a desktop min-width (~580px+ was observed at 390 CSS px) */\nhtml.pcwtm #root,\nhtml.pcwtm #root > div,\nhtml.pcwtm #douyin-right-container,\nhtml.pcwtm #douyin-header,\nhtml.pcwtm #slidelist,\nhtml.pcwtm #sliderVideo,\nhtml.pcwtm .parent-route-container,\nhtml.pcwtm .route-scroll-container,\nhtml.pcwtm .page-recommend-container,\nhtml.pcwtm .playerContainer,\nhtml.pcwtm .basePlayerContainer,\nhtml.pcwtm .leftContainer,\nhtml.pcwtm [data-e2e=\"video-detail\"],\nhtml.pcwtm [data-e2e=\"slideList\"],\nhtml.pcwtm [data-e2e=\"player-container\"] {\n  min-width: 0 !important;\n  max-width: 100% !important;\n  width: 100% !important;\n  box-sizing: border-box !important;\n}\n\n/* ---------- Unused PC columns: hide in CSS, keep in DOM ---------- */\n\nhtml.pcwtm #douyin-navigation,\nhtml.pcwtm [data-e2e=\"douyin-navigation\"],\nhtml.pcwtm:not(.pcwtm-video) #douyin-sidebar:not(:has([data-e2e=\"video-player-digg\"])):not(:has([data-e2e=\"feed-comment-icon\"])):not(:has([data-e2e$=\"-digg\"])):not(:has([data-e2e*=\"comment-icon\"])),\nhtml.pcwtm:not(.pcwtm-video) #douyin-sidebar-new:not(:has([data-e2e=\"video-player-digg\"])):not(:has([data-e2e=\"feed-comment-icon\"])):not(:has([data-e2e$=\"-digg\"])):not(:has([data-e2e*=\"comment-icon\"])),\nhtml.pcwtm img#douyin-temp-sidebar {\n  display: none !important;\n  content-visibility: hidden;\n  contain: strict;\n}\n\n/* Recommend: overlay the sidebar only when it actually hosts the rail. */\nhtml.pcwtm:not(.pcwtm-video) #douyin-sidebar:has([data-e2e=\"video-player-digg\"]),\nhtml.pcwtm:not(.pcwtm-video) #douyin-sidebar:has([data-e2e=\"feed-comment-icon\"]),\nhtml.pcwtm:not(.pcwtm-video) #douyin-sidebar:has([data-e2e$=\"-digg\"]),\nhtml.pcwtm:not(.pcwtm-video) #douyin-sidebar:has([data-e2e*=\"comment-icon\"]),\nhtml.pcwtm:not(.pcwtm-video) #douyin-sidebar-new:has([data-e2e=\"video-player-digg\"]),\nhtml.pcwtm:not(.pcwtm-video) #douyin-sidebar-new:has([data-e2e=\"feed-comment-icon\"]),\nhtml.pcwtm:not(.pcwtm-video) #douyin-sidebar-new:has([data-e2e$=\"-digg\"]),\nhtml.pcwtm:not(.pcwtm-video) #douyin-sidebar-new:has([data-e2e*=\"comment-icon\"]) {\n  display: flex !important;\n  flex-direction: column !important;\n  content-visibility: visible !important;\n  contain: none !important;\n  position: fixed !important;\n  right: calc(var(--pcwtm-space) + env(safe-area-inset-right)) !important;\n  bottom: calc(var(--pcwtm-space) + env(safe-area-inset-bottom)) !important;\n  top: auto !important;\n  left: auto !important;\n  width: auto !important;\n  height: auto !important;\n  max-width: none !important;\n  background: transparent !important;\n  border: 0 !important;\n  box-shadow: none !important;\n  z-index: 40;\n  pointer-events: auto !important;\n  overflow: visible !important;\n}\n\n/* /video/:id: do not display:none #douyin-sidebar. Live detail often puts\n * the official rail in this sibling (e2e names may not be digg / comment-icon). */\nhtml.pcwtm.pcwtm-video #douyin-sidebar,\nhtml.pcwtm.pcwtm-video #douyin-sidebar-new {\n  display: flex !important;\n  flex-direction: column !important;\n  content-visibility: visible !important;\n  contain: none !important;\n  visibility: visible !important;\n  opacity: 1 !important;\n  pointer-events: auto !important;\n  position: fixed !important;\n  right: calc(var(--pcwtm-space) + env(safe-area-inset-right)) !important;\n  top: 50% !important;\n  bottom: auto !important;\n  left: auto !important;\n  transform: translateY(-50%) !important;\n  width: auto !important;\n  height: auto !important;\n  max-width: none !important;\n  max-height: 80dvh !important;\n  background: transparent !important;\n  border: 0 !important;\n  box-shadow: none !important;\n  z-index: 40;\n  overflow: visible !important;\n}\n\n/* ---------- Header (search stays; feed hides this for full-bleed) ---------- */\n\nhtml.pcwtm #douyin-header {\n  position: fixed !important;\n  top: env(safe-area-inset-top) !important;\n  left: 0 !important;\n  right: 0 !important;\n  height: var(--pcwtm-bar) !important;\n  min-height: var(--pcwtm-bar) !important;\n  max-height: var(--pcwtm-bar) !important;\n  margin: 0 !important;\n  padding: 0 56px 0 var(--pcwtm-space) !important;\n  z-index: 10050 !important;\n  display: flex !important;\n  align-items: center !important;\n  gap: var(--pcwtm-space) !important;\n  background: var(--pcwtm-elevated) !important;\n  border-bottom: 1px solid var(--pcwtm-border);\n  color: var(--pcwtm-fg);\n}\n\nhtml.pcwtm.pcwtm-recommend #douyin-header,\nhtml.pcwtm.pcwtm-modal #douyin-header,\nhtml.pcwtm.pcwtm-video #douyin-header,\nhtml.pcwtm.pcwtm-comments #douyin-header {\n  display: none !important;\n  content-visibility: hidden;\n}\n\nhtml.pcwtm.pcwtm-recommend.pcwtm-searching:not(.pcwtm-comments) #douyin-header,\nhtml.pcwtm.pcwtm-modal.pcwtm-searching:not(.pcwtm-comments) #douyin-header {\n  display: flex !important;\n  content-visibility: visible;\n}\n\nhtml.pcwtm #douyin-header > div,\nhtml.pcwtm #douyin-header > div[data-click=\"doubleClick\"] {\n  min-width: 0 !important;\n  max-width: 100% !important;\n  width: 100% !important;\n  flex: 1 1 auto !important;\n}\n\nhtml.pcwtm #douyin-header input[data-e2e=\"searchbar-input\"],\nhtml.pcwtm #douyin-header input[type=\"search\"],\nhtml.pcwtm #douyin-header input[type=\"text\"] {\n  font-size: 16px !important; /* iOS no-zoom */\n  min-width: 0 !important;\n}\n\nhtml.pcwtm #douyin-header-menuCt {\n  flex: 0 0 auto !important;\n  max-width: none !important;\n  overflow: visible !important;\n}\n\nhtml.pcwtm #douyin-header [data-e2e=\"notice-entry\"],\nhtml.pcwtm #douyin-header [data-e2e=\"im-entry\"],\nhtml.pcwtm #douyin-header [data-e2e=\"something-button\"] {\n  display: none !important;\n  content-visibility: hidden;\n}\n\nhtml.pcwtm #douyin-header [id^=\"douyin-header-menu\"] {\n  flex: 0 0 auto !important;\n}\n\n/* ---------- Overlay chrome ---------- */\n\nhtml.pcwtm #pcwtm-menu-btn {\n  box-sizing: border-box;\n  width: var(--pcwtm-tap);\n  height: var(--pcwtm-tap);\n  padding: 0;\n  margin: 0;\n  border: 0;\n  border-radius: 0;\n  background: transparent;\n  box-shadow: none;\n  color: var(--pcwtm-fg);\n  display: grid;\n  place-items: center;\n  cursor: pointer;\n  touch-action: manipulation;\n  -webkit-tap-highlight-color: transparent;\n}\n\nhtml.pcwtm #pcwtm-menu-btn.pcwtm-float {\n  position: fixed;\n  top: calc(var(--pcwtm-space) + env(safe-area-inset-top));\n  right: calc(var(--pcwtm-space) + env(safe-area-inset-right));\n  z-index: 10080;\n}\n\nhtml.pcwtm #pcwtm-menu-btn:active {\n  transform: scale(0.96);\n}\n\nhtml.pcwtm #pcwtm-mask {\n  position: fixed;\n  inset: 0;\n  z-index: 10060;\n  background: rgba(0, 0, 0, 0.46);\n  opacity: 0;\n  pointer-events: none;\n  transition: opacity 180ms ease;\n  contain: strict;\n  touch-action: manipulation;\n}\n\nhtml.pcwtm.pcwtm-open #pcwtm-mask {\n  opacity: 1;\n  pointer-events: auto;\n}\n\nhtml.pcwtm #pcwtm-drawer {\n  position: fixed;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  width: min(80vw, 320px);\n  z-index: 10070;\n  box-sizing: border-box;\n  background: var(--pcwtm-elevated);\n  color: var(--pcwtm-fg);\n  border-left: 1px solid var(--pcwtm-border);\n  border-radius: 24px 0 0 24px; /* inner 8 + padding 16 */\n  transform: translateX(105%);\n  transition: transform 200ms ease;\n  overflow-x: hidden;\n  overflow-y: auto;\n  overscroll-behavior: contain;\n  padding: calc(16px + env(safe-area-inset-top)) 16px calc(24px + env(safe-area-inset-bottom));\n  -webkit-overflow-scrolling: touch;\n  contain: layout paint style;\n  touch-action: manipulation;\n}\n\nhtml.pcwtm.pcwtm-open #pcwtm-drawer {\n  transform: translateX(0);\n}\n\nhtml.pcwtm #pcwtm-drawer a,\nhtml.pcwtm #pcwtm-drawer button {\n  display: flex;\n  align-items: center;\n  width: 100%;\n  box-sizing: border-box;\n  gap: var(--pcwtm-space);\n  margin: 0 0 var(--pcwtm-space);\n  padding: 12px 16px;\n  border: 0;\n  border-radius: var(--pcwtm-radius);\n  background: transparent;\n  color: var(--pcwtm-fg);\n  text-align: left;\n  text-decoration: none;\n  font: inherit;\n  font-size: 15px;\n  line-height: 1.2;\n  cursor: pointer;\n  touch-action: manipulation;\n  -webkit-tap-highlight-color: transparent;\n}\n\nhtml.pcwtm #pcwtm-drawer a:active,\nhtml.pcwtm #pcwtm-drawer button:active {\n  background: rgba(236, 236, 236, 0.06);\n}\n\nhtml.pcwtm #pcwtm-drawer a[aria-current=\"page\"] {\n  color: var(--pcwtm-accent);\n}\n\n/* Official door links only. Footer \u5907\u6848 / ad / legal stay in the host DOM. */\nhtml.pcwtm #pcwtm-drawer a[href*=\"beian\"],\nhtml.pcwtm #pcwtm-drawer a[href*=\"miit.gov.cn\"],\nhtml.pcwtm #pcwtm-drawer a[href*=\"gsxt.gov.cn\"],\nhtml.pcwtm #pcwtm-drawer a[href*=\"piyao.org.cn\"],\nhtml.pcwtm #pcwtm-drawer a[href*=\"12377.cn\"],\nhtml.pcwtm #pcwtm-drawer a[href*=\"oceanengine.com\"],\nhtml.pcwtm #pcwtm-drawer a[href*=\"agreements\"],\nhtml.pcwtm #pcwtm-drawer a[href*=\"recovery_account\"],\nhtml.pcwtm #pcwtm-drawer a[href*=\"aboutus\"],\nhtml.pcwtm #pcwtm-drawer a[href*=\"friend_links\"],\nhtml.pcwtm #pcwtm-drawer a[href*=\"htmlmap\"],\nhtml.pcwtm #pcwtm-drawer a[href*=\"jinritemai\"],\nhtml.pcwtm #pcwtm-drawer a[href*=\"microgame\"] {\n  display: none !important;\n}\n\n@media (prefers-reduced-motion: reduce) {\n  html.pcwtm #pcwtm-mask,\n  html.pcwtm #pcwtm-drawer,\n  html.pcwtm #pcwtm-menu-btn {\n    transition: none;\n  }\n\n  html.pcwtm #pcwtm-menu-btn:active {\n    transform: none;\n  }\n}\n\n/* ---------- Homepage recommend slider (/?recommend=1) ---------- */\n\nhtml.pcwtm #douyin-right-container {\n  margin: 0 !important;\n  padding: 0 !important;\n  padding-top: var(--pcwtm-bar) !important;\n  left: 0 !important;\n}\n\nhtml.pcwtm.pcwtm-recommend #douyin-right-container,\nhtml.pcwtm.pcwtm-modal #douyin-right-container,\nhtml.pcwtm.pcwtm-video #douyin-right-container {\n  padding-top: 0 !important;\n}\n\nhtml.pcwtm #slidelist,\nhtml.pcwtm #slidelist.recommend-slidelist,\nhtml.pcwtm [data-e2e=\"slideList\"] {\n  width: 100% !important;\n  height: calc(100dvh - var(--pcwtm-bar)) !important;\n  min-height: calc(100dvh - var(--pcwtm-bar)) !important;\n  margin: 0 !important;\n  padding: 0 !important;\n  padding-right: 0 !important;\n  left: 0 !important;\n}\n\nhtml.pcwtm.pcwtm-recommend #slidelist,\nhtml.pcwtm.pcwtm-recommend #slidelist.recommend-slidelist,\nhtml.pcwtm.pcwtm-recommend [data-e2e=\"slideList\"],\nhtml.pcwtm.pcwtm-modal #slidelist,\nhtml.pcwtm.pcwtm-modal #slidelist.recommend-slidelist,\nhtml.pcwtm.pcwtm-modal [data-e2e=\"slideList\"],\nhtml.pcwtm.pcwtm-video #slidelist,\nhtml.pcwtm.pcwtm-video #slidelist.recommend-slidelist,\nhtml.pcwtm.pcwtm-video [data-e2e=\"slideList\"] {\n  height: 100dvh !important;\n  min-height: 100dvh !important;\n}\n\nhtml.pcwtm #slidelist [data-e2e=\"feed-video\"]:not([data-e2e=\"feed-active-video\"]),\nhtml.pcwtm [data-e2e=\"slideList\"] [data-e2e=\"feed-video\"]:not([data-e2e=\"feed-active-video\"]) {\n  content-visibility: auto;\n  contain-intrinsic-size: auto 100dvh;\n}\n\nhtml.pcwtm #slidelist .page-recommend-container,\nhtml.pcwtm #sliderVideo,\nhtml.pcwtm [data-e2e=\"feed-active-video\"],\nhtml.pcwtm [data-e2e=\"feed-video\"],\nhtml.pcwtm .sliderVideo,\nhtml.pcwtm .slider-video {\n  width: 100% !important;\n  max-width: 100% !important;\n  height: 100% !important;\n  min-height: 0 !important;\n  margin: 0 !important;\n  left: 0 !important;\n  right: 0 !important;\n}\n\nhtml.pcwtm #sliderVideo .playerContainer,\nhtml.pcwtm [data-e2e=\"feed-active-video\"] .playerContainer,\nhtml.pcwtm [data-e2e=\"feed-video\"] .playerContainer,\nhtml.pcwtm .basePlayerContainer,\nhtml.pcwtm .xgplayer,\nhtml.pcwtm [data-e2e=\"player-container\"] {\n  position: relative !important;\n  width: 100% !important;\n  max-width: 100% !important;\n  height: 100% !important;\n  left: 0 !important;\n  overflow: visible !important;\n}\n\nhtml.pcwtm .xgplayer video,\nhtml.pcwtm .basePlayerContainer video {\n  width: 100% !important;\n  height: 100% !important;\n  max-width: 100% !important;\n  object-fit: contain;\n}\n\n/* Official like / comment / favorite: overlay on the video, not a PC side column.\n * Live 2026-08-20: .positionBox is absolute; immersive hide can zero it.\n * Bottom is space + safe-area \u2014 no 80px magic number. */\nhtml.pcwtm .basePlayerContainer .positionBox,\nhtml.pcwtm [data-e2e=\"feed-active-video\"] .positionBox,\nhtml.pcwtm [data-e2e=\"feed-video\"] .positionBox,\nhtml.pcwtm [data-e2e=\"video-detail\"] .positionBox,\nhtml.pcwtm.pcwtm-video .positionBox,\nhtml.pcwtm .pcwtm-active-aweme .positionBox,\nhtml.pcwtm [class*=\"hide-interaction-area\"].positionBox {\n  display: flex !important;\n  flex-direction: column !important;\n  align-items: center !important;\n  position: absolute !important;\n  right: calc(var(--pcwtm-space) + env(safe-area-inset-right)) !important;\n  bottom: calc(var(--pcwtm-space) + env(safe-area-inset-bottom)) !important;\n  left: auto !important;\n  top: auto !important;\n  width: auto !important;\n  height: auto !important;\n  min-width: var(--pcwtm-tap);\n  min-height: var(--pcwtm-tap);\n  transform: none !important;\n  z-index: 40;\n  visibility: visible !important;\n  opacity: 1 !important;\n  pointer-events: auto !important;\n  background: transparent !important;\n  box-shadow: none !important;\n  content-visibility: visible !important;\n}\n\n/* /video/:id: official rail may sit in a sibling column that 100dvh\n * layout pushed below the fold. fixed escapes that clip. */\nhtml.pcwtm.pcwtm-video .positionBox,\nhtml.pcwtm.pcwtm-video .pcwtm-active-aweme .positionBox {\n  position: fixed !important;\n}\n\nhtml.pcwtm [data-e2e=\"feed-comment-icon\"],\nhtml.pcwtm [data-e2e=\"video-player-digg\"],\nhtml.pcwtm [data-e2e=\"video-player-collect\"],\nhtml.pcwtm [data-e2e=\"video-player-share\"],\nhtml.pcwtm [data-e2e$=\"-digg\"],\nhtml.pcwtm [data-e2e*=\"comment-icon\"],\nhtml.pcwtm [data-e2e$=\"-collect\"],\nhtml.pcwtm [data-e2e$=\"-share\"],\nhtml.pcwtm [data-e2e*=\"collect\"],\nhtml.pcwtm [data-e2e*=\"share\"],\nhtml.pcwtm [data-e2e*=\"like\"] {\n  display: flex !important;\n  pointer-events: auto !important;\n  touch-action: manipulation;\n  min-width: var(--pcwtm-tap);\n  min-height: var(--pcwtm-tap);\n  visibility: visible !important;\n  opacity: 1 !important;\n  content-visibility: visible !important;\n}\n\n/* Official bottom chrome covers watch. Hide those nodes only.\n * Live after wall close (unskinned 1280, official bounce): .positionBox\n * is a child of .xgplayer / .basePlayerContainer, NOT of .xgplayer-controls\n * (inControls=false; controls has only video-player-auto-play).\n * Stay-on-/video/:id headless is error-page (no player). QA's detail rail\n * may still nest .positionBox under .xgplayer-controls. The old\n * .xgplayer-controls:not(:has(video-player-digg)):not(:has(feed-comment-icon))\n * { display:none } then kills the whole tree, including .positionBox,\n * when e2e names differ or icons are not mounted yet.\n * NEVER display:none the .xgplayer-controls host. */\nhtml.pcwtm .xgplayer-progress,\nhtml.pcwtm .xgplayer-pip,\nhtml.pcwtm .xgplayer-fullscreen,\nhtml.pcwtm .xgplayer-page-full-screen,\nhtml.pcwtm .xgplayer-cssfullscreen,\nhtml.pcwtm .xgplayer-volume,\nhtml.pcwtm .xgplayer-setting,\nhtml.pcwtm .xgplayer-setting-list,\nhtml.pcwtm .xgplayer-playbackrate,\nhtml.pcwtm .xgplayer-playback-rate,\nhtml.pcwtm .xgplayer-definition,\nhtml.pcwtm .xgplayer-quality,\nhtml.pcwtm .xgplayer-play,\nhtml.pcwtm .xgplayer-time,\nhtml.pcwtm [data-e2e=\"xgplayer-page-full-screen\"],\nhtml.pcwtm [data-e2e=\"video-player-auto-play\"],\nhtml.pcwtm [data-e2e=\"danmaku-container\"] {\n  display: none !important;\n  content-visibility: hidden;\n}\n\n/* Do NOT display:none [data-e2e=video-play-more] on /video/:id.\n * Live: after login close, arrows stay in .xgplayer-playswitch; the\n * official \u8d5e/\u8bc4/\u85cf/\u4eab cluster is often under video-play-more without\n * video-player-digg / feed-comment-icon, so the old :not(:has()) hid\n * the whole rail. Recommend may still hide a more-menu that has no\n * rail / positionBox. */\nhtml.pcwtm:not(.pcwtm-video) [data-e2e=\"video-play-more\"]:not(:has(.positionBox)):not(:has([data-e2e=\"video-player-digg\"])):not(:has([data-e2e=\"feed-comment-icon\"])):not(:has([data-e2e$=\"-digg\"])):not(:has([data-e2e*=\"comment-icon\"])):not(:has([data-e2e*=\"collect\"])):not(:has([data-e2e*=\"share\"])) {\n  display: none !important;\n  content-visibility: hidden;\n}\nhtml.pcwtm.pcwtm-video [data-e2e=\"video-play-more\"] {\n  display: flex !important;\n  flex-direction: column !important;\n  content-visibility: visible !important;\n  visibility: visible !important;\n  opacity: 1 !important;\n  pointer-events: auto !important;\n}\n\nhtml.pcwtm .xgplayer-controls,\nhtml.pcwtm xg-controls.xgplayer-controls,\nhtml.pcwtm .xgplayer-controls .positionBox {\n  display: flex !important;\n  content-visibility: visible !important;\n  visibility: visible !important;\n  opacity: 1 !important;\n  background: transparent !important;\n}\nhtml.pcwtm .xgplayer-controls {\n  pointer-events: none;\n}\nhtml.pcwtm .xgplayer-controls .positionBox,\nhtml.pcwtm .xgplayer-controls [data-e2e=\"video-player-digg\"],\nhtml.pcwtm .xgplayer-controls [data-e2e=\"feed-comment-icon\"],\nhtml.pcwtm .xgplayer-controls [data-e2e=\"video-player-collect\"],\nhtml.pcwtm .xgplayer-controls [data-e2e=\"video-player-share\"],\nhtml.pcwtm .xgplayer-controls [data-e2e$=\"-digg\"],\nhtml.pcwtm .xgplayer-controls [data-e2e*=\"comment-icon\"],\nhtml.pcwtm .xgplayer-controls [data-e2e$=\"-collect\"],\nhtml.pcwtm .xgplayer-controls [data-e2e$=\"-share\"] {\n  pointer-events: auto !important;\n  display: flex !important;\n  visibility: visible !important;\n  opacity: 1 !important;\n}\n\n/* After /video/:id slide, immersive hide can leave the new card's icon at 0\u00d70\n * if class flags stayed on the first item. Restore the in-view card only. */\nhtml.pcwtm .pcwtm-active-aweme .positionBox,\nhtml.pcwtm .pcwtm-active-aweme [class*=\"hide-interaction-area\"] .positionBox {\n  pointer-events: auto !important;\n  visibility: visible !important;\n  opacity: 1 !important;\n}\n\nhtml.pcwtm .pcwtm-active-aweme [data-e2e=\"feed-comment-icon\"] {\n  pointer-events: auto !important;\n  visibility: visible !important;\n  opacity: 1 !important;\n  width: 48px !important;\n  min-width: 44px !important;\n  min-height: 44px !important;\n  max-height: none !important;\n}\n\nhtml.pcwtm #video-info-wrap,\nhtml.pcwtm .video-info-detail,\nhtml.pcwtm [data-e2e=\"video-info\"] {\n  max-width: calc(100% - 72px) !important;\n  width: auto !important;\n  left: calc(var(--pcwtm-space) + env(safe-area-inset-left)) !important;\n  right: auto !important;\n  bottom: calc(16px + env(safe-area-inset-bottom)) !important;\n}\n\n/* Official up/down switchers: keep, tuck to the right edge */\nhtml.pcwtm [data-e2e=\"video-switch-next-arrow\"],\nhtml.pcwtm [data-e2e=\"video-switch-prev-arrow\"],\nhtml.pcwtm .xgplayer-playswitch {\n  right: calc(var(--pcwtm-space) + env(safe-area-inset-right)) !important;\n  left: auto !important;\n}\n\n/* Bottom sheet only while html.pcwtm-comments (official side width > 0).\n * Live 2026-08-20: after official X, #relatedVideoCard / comment-list stay\n * in the DOM at width 0. :has() would keep this block applied. */\nhtml.pcwtm.pcwtm-comments #videoSideCard.pcwtm-sheet-panel,\nhtml.pcwtm.pcwtm-comments #videoSideBar.pcwtm-sheet-panel,\nhtml.pcwtm.pcwtm-comments .pcwtm-sheet-panel {\n  position: fixed !important;\n  left: 0 !important;\n  right: 0 !important;\n  bottom: 0 !important;\n  top: auto !important;\n  width: 100% !important;\n  max-width: 100% !important;\n  height: var(--pcwtm-sheet) !important;\n  max-height: var(--pcwtm-sheet) !important;\n  background: var(--pcwtm-elevated) !important;\n  border-top: 1px solid var(--pcwtm-border);\n  border-radius: 16px 16px 0 0; /* inner 8 + pad 8 */\n  z-index: 10055 !important;\n  overflow: hidden !important;\n  overscroll-behavior: contain;\n  padding: 0 0 env(safe-area-inset-bottom);\n  box-sizing: border-box !important;\n  pointer-events: auto !important;\n}\n\n/* Rail stays above the shorter sheet. Do not pointer-events:none the box\n * (that swallowed icon / \u300c\u8bc4\u8bba \u24e7\u300d taps). Hide like/fav/share only. */\nhtml.pcwtm.pcwtm-comments .positionBox [data-e2e=\"video-player-digg\"],\nhtml.pcwtm.pcwtm-comments .positionBox [data-e2e=\"video-player-collect\"],\nhtml.pcwtm.pcwtm-comments .positionBox [data-e2e=\"video-player-share\"] {\n  visibility: hidden !important;\n}\n\nhtml.pcwtm.pcwtm-comments .positionBox {\n  bottom: calc(var(--pcwtm-sheet) + var(--pcwtm-space) + env(safe-area-inset-bottom)) !important;\n  z-index: 10035;\n  pointer-events: auto;\n}\n\nhtml.pcwtm.pcwtm-comments .positionBox [data-e2e=\"feed-comment-icon\"] {\n  visibility: visible !important;\n  pointer-events: auto !important;\n}\n\nhtml.pcwtm.pcwtm-comments .xgplayer-playswitch {\n  visibility: hidden !important;\n}\n\n/* Hamburger is not the comment close \u2014 park it top-left while the sheet is open */\nhtml.pcwtm.pcwtm-comments #pcwtm-menu-btn.pcwtm-float {\n  right: auto;\n  left: calc(8px + env(safe-area-inset-left));\n  top: calc(8px + env(safe-area-inset-top));\n  visibility: visible;\n  pointer-events: auto;\n}\n\n/* Official X only: 44\u00d744 on the host node. Center the glyph in the hit box.\n * No ::after overlay \u2014 that blocked the tab row. z-index above the tabs. */\nhtml.pcwtm .pcwtm-host-close {\n  box-sizing: border-box !important;\n  min-width: 44px !important;\n  min-height: 44px !important;\n  padding: 0 !important;\n  margin: 0 !important;\n  display: grid !important;\n  place-items: center !important;\n  pointer-events: auto !important;\n  touch-action: manipulation;\n  position: relative;\n  z-index: 6;\n  background: transparent !important;\n  border: 0 !important;\n  box-shadow: none !important;\n  -webkit-tap-highlight-color: transparent;\n}\n\nhtml.pcwtm .pcwtm-host-close svg {\n  width: 20px !important;\n  height: 20px !important;\n}\n\n/* Keep official comment list + official X only. Farm tabs\n * (\u8be6\u60c5 / Videos / AI\u6296\u97f3 / Related) stay in the DOM. */\nhtml.pcwtm.pcwtm-comments #videoSideCard [role=\"tablist\"],\nhtml.pcwtm.pcwtm-comments #videoSideBar [role=\"tablist\"],\nhtml.pcwtm.pcwtm-comments .pcwtm-sheet-panel [role=\"tablist\"],\nhtml.pcwtm.pcwtm-comments #videoSideCard .semi-tabs-bar,\nhtml.pcwtm.pcwtm-comments #videoSideBar .semi-tabs-bar,\nhtml.pcwtm.pcwtm-comments .pcwtm-sheet-panel .semi-tabs-bar,\nhtml.pcwtm.pcwtm-comments .pcwtm-sheet-tabs,\nhtml.pcwtm.pcwtm-comments #videoSideCard [role=\"tab\"],\nhtml.pcwtm.pcwtm-comments #videoSideBar [role=\"tab\"],\nhtml.pcwtm.pcwtm-comments .pcwtm-sheet-panel [role=\"tab\"],\nhtml.pcwtm.pcwtm-comments #videoSideCard .semi-tabs-tab,\nhtml.pcwtm.pcwtm-comments #videoSideBar .semi-tabs-tab,\nhtml.pcwtm.pcwtm-comments .pcwtm-sheet-panel .semi-tabs-tab {\n  display: none !important;\n  content-visibility: hidden;\n}\n\nhtml.pcwtm.pcwtm-comments .pcwtm-host-close {\n  display: grid !important;\n  content-visibility: visible;\n}\n\nhtml.pcwtm.pcwtm-comments #videoSideCard .semi-tabs,\nhtml.pcwtm.pcwtm-comments #videoSideBar .semi-tabs,\nhtml.pcwtm.pcwtm-comments .pcwtm-sheet-panel .semi-tabs,\nhtml.pcwtm.pcwtm-comments #relatedVideoCard {\n  background: var(--pcwtm-elevated) !important;\n}\n\nhtml.pcwtm.pcwtm-comments #relatedVideoCard,\nhtml.pcwtm.pcwtm-comments #merge-all-comment-container,\nhtml.pcwtm.pcwtm-comments .comment-mainContent[data-e2e=\"comment-list\"],\nhtml.pcwtm.pcwtm-comments [data-e2e=\"comment-list\"] {\n  width: 100% !important;\n  max-width: 100% !important;\n}\n\nhtml.pcwtm.pcwtm-comments #videoSideCard #merge-all-comment-container,\nhtml.pcwtm.pcwtm-comments #videoSideBar #merge-all-comment-container,\nhtml.pcwtm.pcwtm-comments .pcwtm-sheet-panel #merge-all-comment-container,\nhtml.pcwtm.pcwtm-comments #videoSideCard [data-e2e=\"comment-list\"],\nhtml.pcwtm.pcwtm-comments #videoSideBar [data-e2e=\"comment-list\"],\nhtml.pcwtm.pcwtm-comments .pcwtm-sheet-panel [data-e2e=\"comment-list\"] {\n  max-height: var(--pcwtm-sheet);\n  overflow-x: hidden;\n  overflow-y: auto;\n  overscroll-behavior: contain;\n  -webkit-overflow-scrolling: touch;\n  pointer-events: auto !important;\n}\n\nhtml.pcwtm [data-e2e=\"comment-item\"] {\n  max-width: 100% !important;\n}\n\n/* Leftover login overlays after official close. Do NOT apply while the\n * wall is open: live 390, the official X is a 37\u00d736 svg sibling of\n * #douyin_login_comp_flat_panel_title (title \"Log in to Douyin\"). The old\n * #login-panel-new *:not(#flat):not(#mobile) { pointer-events:none } beat\n * article * { auto } because :not(#id) adds ID specificity \u2014 X computed\n * pe:none; elementFromPoint at the X hit #captcha_container; click did\n * not dismiss. Never hide a wrapper that also holds the rail. */\nhtml.pcwtm [id^=\"login-full-panel-\"]:not(:has(#douyin_login_comp_mobile_code)):not(:has(#douyin_login_comp_single_panel)):not(:has(#douyin_login_comp_flat_panel_title)):not(:has(.positionBox)):not(:has(.xgplayer)):not(:has(.xgplayer-playswitch)):not(:has([data-e2e=\"video-switch-next-arrow\"])):not(:has([data-e2e=\"feed-comment-icon\"])):not(:has([data-e2e=\"video-player-digg\"])) {\n  pointer-events: none !important;\n}\nhtml.pcwtm #login-panel-new:not(:has(#douyin_login_comp_mobile_code)):not(:has(#douyin_login_comp_single_panel)):not(:has(#douyin_login_comp_flat_panel_title)):not(:has(.positionBox)):not(:has(.xgplayer)):not(:has(.xgplayer-playswitch)):not(:has([data-e2e=\"video-switch-next-arrow\"])):not(:has([data-e2e=\"feed-comment-icon\"])),\nhtml.pcwtm #douyin-login-new-id:not(:has(#douyin_login_comp_mobile_code)):not(:has(#douyin_login_comp_single_panel)):not(:has(#douyin_login_comp_flat_panel_title)):not(:has(.positionBox)):not(:has(.xgplayer)):not(:has(.xgplayer-playswitch)):not(:has([data-e2e=\"video-switch-next-arrow\"])):not(:has([data-e2e=\"feed-comment-icon\"])),\nhtml.pcwtm article#douyin_login_comp_flat_panel:not(:has(#douyin_login_comp_mobile_code)):not(:has(#douyin_login_comp_single_panel)):not(:has(#douyin_login_comp_flat_panel_title)):not(:has(.positionBox)):not(:has(.xgplayer)) {\n  pointer-events: none !important;\n  visibility: hidden !important;\n  width: auto !important;\n  max-width: none !important;\n}\n\n/* Live e2p at the\u300cDouyin\u300dtitle-end pixel AND at the official 37\u00d736\n * close svg center both hit #captcha_container (not the closer). The\n * shell often has a hidden iframe so :not(:has(iframe)) never applied.\n * Container does not receive hits. A real captcha iframe/canvas keeps\n * the UA default (auto) and still works through a none parent. Do not\n * force auto on the iframe \u2014 a full-bleed empty shell would sit on the X. */\nhtml.pcwtm #captcha_container {\n  pointer-events: none !important;\n}\n\n/* Official title-row closer \u2014 restore hits we previously swallowed. */\nhtml.pcwtm #douyin_login_comp_flat_panel_title ~ *,\nhtml.pcwtm #douyin_login_comp_flat_panel_title ~ * *,\nhtml.pcwtm article#douyin_login_comp_flat_panel,\nhtml.pcwtm article#douyin_login_comp_flat_panel *,\nhtml.pcwtm #login-panel-new #douyin_login_comp_flat_panel,\nhtml.pcwtm #login-panel-new #douyin_login_comp_flat_panel *,\nhtml.pcwtm #login-panel-new #douyin_login_comp_single_panel,\nhtml.pcwtm #login-panel-new #douyin_login_comp_single_panel *,\nhtml.pcwtm #login-panel-new #douyin_login_comp_mobile_code,\nhtml.pcwtm #login-panel-new #douyin_login_comp_mobile_code *,\nhtml.pcwtm #douyin-login-new-id #douyin_login_comp_flat_panel,\nhtml.pcwtm #douyin-login-new-id #douyin_login_comp_flat_panel *,\nhtml.pcwtm #douyin-login-new-id #douyin_login_comp_single_panel,\nhtml.pcwtm #douyin-login-new-id #douyin_login_comp_single_panel *,\nhtml.pcwtm #douyin-login-new-id #douyin_login_comp_mobile_code,\nhtml.pcwtm #douyin-login-new-id #douyin_login_comp_mobile_code * {\n  pointer-events: auto !important;\n}\n\n/* Live 390: title #douyin_login_comp_flat_panel_title is x=105..285,\n * official closer is the only sibling (DIV > 37\u00d736 svg at x=331..368).\n * QA taps the faint X at the title end. e2p there is the title DIV\n * (no button, no <a>, not a logo link). Svg-center e2p is path.\n * Expanding the sibling DIV's padding made title-end hit the wrapper;\n * a click on that padding did not dismiss \u2014 the handler is on the svg.\n * Extend the official svg's own box left. Title is not a control.\n * Must beat article * / #login-panel-new #flat * pe:auto above. */\nhtml.pcwtm #login-panel-new article#douyin_login_comp_flat_panel #douyin_login_comp_flat_panel_title,\nhtml.pcwtm #douyin-login-new-id article#douyin_login_comp_flat_panel #douyin_login_comp_flat_panel_title {\n  pointer-events: none !important;\n}\nhtml.pcwtm #login-panel-new article#douyin_login_comp_flat_panel #douyin_login_comp_flat_panel_title ~ * svg,\nhtml.pcwtm #douyin-login-new-id article#douyin_login_comp_flat_panel #douyin_login_comp_flat_panel_title ~ * svg {\n  box-sizing: content-box !important;\n  padding-left: 56px !important;\n  margin-left: -56px !important;\n  overflow: visible !important;\n  pointer-events: auto !important;\n}\n\nhtml.pcwtm [data-e2e=\"recommend-guide-mask\"],\nhtml.pcwtm #douyin-web-recommend-guide-mask {\n  pointer-events: none !important;\n}\n\nhtml.pcwtm.pcwtm-comments .pcwtm-sheet-panel [data-e2e=\"comment-item\"],\nhtml.pcwtm.pcwtm-comments .pcwtm-sheet-panel [data-e2e=\"video-comment-more\"] {\n  pointer-events: auto !important;\n  position: relative;\n  z-index: 1;\n}\n\n/* Official related-card login guide stays in the DOM after close.\n * pointer-events:none only \u2014 do not display:none (it may share an\n * ancestor with the like/comment rail). */\nhtml.pcwtm #related-video-card-login-guide,\nhtml.pcwtm .related-video-card-login-guide {\n  pointer-events: none !important;\n}\n\n/* ---------- Video detail /video/:id ---------- */\n\nhtml.pcwtm [data-e2e=\"video-detail\"] {\n  display: flex !important;\n  flex-direction: column !important;\n  align-items: stretch !important;\n  min-height: calc(100dvh - var(--pcwtm-bar)) !important;\n  padding: 0 !important;\n  margin: 0 !important;\n}\n\nhtml.pcwtm:not(.pcwtm-video) [data-e2e=\"video-detail\"] > * {\n  width: 100% !important;\n  max-width: 100% !important;\n  box-sizing: border-box !important;\n}\n\nhtml.pcwtm [data-e2e=\"video-detail\"] .leftContainer {\n  width: 100% !important;\n  max-width: 100% !important;\n  display: flex !important;\n  flex-direction: column !important;\n  padding: 0 !important;\n}\n\nhtml.pcwtm [data-e2e=\"video-detail\"] .leftContainer > [data-e2e=\"player-container\"] {\n  order: 1;\n}\n\nhtml.pcwtm [data-e2e=\"video-detail\"] .leftContainer > *:has([data-e2e=\"detail-video-info\"]) {\n  order: 2;\n}\n\nhtml.pcwtm [data-e2e=\"video-detail\"] .leftContainer > *:has([data-e2e=\"comment-list\"]) {\n  order: 3;\n}\n\nhtml.pcwtm [data-e2e=\"video-detail\"] .leftContainer > *:has([data-e2e=\"related-video\"]) {\n  order: 4;\n}\n\nhtml.pcwtm [data-e2e=\"video-detail\"] [data-e2e=\"player-container\"],\nhtml.pcwtm [data-e2e=\"video-detail\"] .video-detail-container,\nhtml.pcwtm [data-e2e=\"video-detail\"] .basePlayerContainer,\nhtml.pcwtm [data-e2e=\"video-detail\"] .xgplayer {\n  width: 100% !important;\n  max-width: 100% !important;\n  height: auto !important;\n  min-height: 56vw !important;\n  aspect-ratio: 9 / 16;\n  max-height: 70dvh !important;\n  background: var(--pcwtm-bg);\n}\n\n/* /video/:id: player fills the viewport, but overflow must stay visible.\n * Official rail is often a SIBLING right column \u2014 100dvh + overflow hidden\n * + width:100% on every child clips it off-screen. Overlay that sibling. */\nhtml.pcwtm.pcwtm-video [data-e2e=\"video-detail\"] {\n  display: block !important;\n  position: relative !important;\n  width: 100% !important;\n  height: 100dvh !important;\n  min-height: 100dvh !important;\n  overflow: visible !important;\n}\nhtml.pcwtm.pcwtm-video [data-e2e=\"video-detail\"] > .leftContainer,\nhtml.pcwtm.pcwtm-video [data-e2e=\"video-detail\"] > [data-e2e=\"player-container\"] {\n  position: absolute !important;\n  inset: 0 !important;\n  width: 100% !important;\n  max-width: 100% !important;\n  height: 100% !important;\n  overflow: visible !important;\n}\nhtml.pcwtm.pcwtm-video [data-e2e=\"video-detail\"] [data-e2e=\"player-container\"],\nhtml.pcwtm.pcwtm-video [data-e2e=\"video-detail\"] .video-detail-container,\nhtml.pcwtm.pcwtm-video [data-e2e=\"video-detail\"] .leftContainer,\nhtml.pcwtm.pcwtm-video [data-e2e=\"video-detail\"] .playerContainer,\nhtml.pcwtm.pcwtm-video [data-e2e=\"video-detail\"] .basePlayerContainer,\nhtml.pcwtm.pcwtm-video [data-e2e=\"video-detail\"] .xgplayer,\nhtml.pcwtm.pcwtm-video [data-e2e=\"video-detail\"] .xgplayer-container,\nhtml.pcwtm.pcwtm-video #basePlayerContainer,\nhtml.pcwtm.pcwtm-video #playerContainer,\nhtml.pcwtm.pcwtm-video #waterFallScrollList {\n  overflow: visible !important;\n}\nhtml.pcwtm.pcwtm-video [data-e2e=\"video-detail\"] [data-e2e=\"player-container\"],\nhtml.pcwtm.pcwtm-video [data-e2e=\"video-detail\"] .video-detail-container,\nhtml.pcwtm.pcwtm-video [data-e2e=\"video-detail\"] .leftContainer,\nhtml.pcwtm.pcwtm-video [data-e2e=\"video-detail\"] .playerContainer,\nhtml.pcwtm.pcwtm-video [data-e2e=\"video-detail\"] .basePlayerContainer,\nhtml.pcwtm.pcwtm-video [data-e2e=\"video-detail\"] .xgplayer,\nhtml.pcwtm.pcwtm-video [data-e2e=\"video-detail\"] .xgplayer-container,\nhtml.pcwtm.pcwtm-video #basePlayerContainer {\n  width: 100% !important;\n  max-width: 100vw !important;\n  height: 100dvh !important;\n  min-height: 100dvh !important;\n  max-height: none !important;\n  aspect-ratio: auto !important;\n  border-radius: 0 !important;\n  background: var(--pcwtm-bg) !important;\n}\n\n/* Overlay official action hosts that sit beside the player, not inside it.\n * Do not require video-player-digg / feed-comment-icon \u2014 /video/:id often\n * uses other *digg* / *collect* / *share* e2e, or .positionBox.\n * Do not :has(*comment*) \u2014 that matches the comments column. */\nhtml.pcwtm.pcwtm-video [data-e2e=\"video-detail\"] > *:has(.positionBox),\nhtml.pcwtm.pcwtm-video [data-e2e=\"video-detail\"] > *:has([data-e2e*=\"digg\"]),\nhtml.pcwtm.pcwtm-video [data-e2e=\"video-detail\"] > *:has([data-e2e*=\"collect\"]),\nhtml.pcwtm.pcwtm-video [data-e2e=\"video-detail\"] > *:has([data-e2e*=\"share\"]),\nhtml.pcwtm.pcwtm-video [data-e2e=\"video-detail\"] > *:has([data-e2e$=\"-digg\"]),\nhtml.pcwtm.pcwtm-video [data-e2e=\"video-detail\"] > *:has([data-e2e*=\"comment-icon\"]),\nhtml.pcwtm.pcwtm-video [data-e2e=\"video-detail\"] > *:has([data-e2e=\"video-player-digg\"]),\nhtml.pcwtm.pcwtm-video [data-e2e=\"video-detail\"] > *:has([data-e2e=\"feed-comment-icon\"]),\nhtml.pcwtm.pcwtm-video [data-e2e=\"video-detail\"] > *:has([data-e2e=\"video-player-collect\"]),\nhtml.pcwtm.pcwtm-video [data-e2e=\"video-detail\"] > *:has([data-e2e=\"video-player-share\"]),\nhtml.pcwtm.pcwtm-video .leftContainer ~ *:has(.positionBox),\nhtml.pcwtm.pcwtm-video .leftContainer ~ *:has([data-e2e*=\"digg\"]),\nhtml.pcwtm.pcwtm-video .leftContainer ~ *:has([data-e2e*=\"collect\"]),\nhtml.pcwtm.pcwtm-video .leftContainer ~ *:has([data-e2e*=\"share\"]),\nhtml.pcwtm.pcwtm-video .leftContainer ~ *:has([data-e2e$=\"-digg\"]),\nhtml.pcwtm.pcwtm-video .leftContainer ~ *:has([data-e2e*=\"comment-icon\"]),\nhtml.pcwtm.pcwtm-video #playerContainer ~ *:has(.positionBox),\nhtml.pcwtm.pcwtm-video #playerContainer ~ *:has([data-e2e*=\"digg\"]),\nhtml.pcwtm.pcwtm-video #playerContainer ~ *:has([data-e2e$=\"-digg\"]),\nhtml.pcwtm.pcwtm-video #playerContainer ~ *:has([data-e2e*=\"comment-icon\"]),\nhtml.pcwtm.pcwtm-video #basePlayerContainer ~ *:has(.positionBox),\nhtml.pcwtm.pcwtm-video #basePlayerContainer ~ *:has([data-e2e*=\"digg\"]),\nhtml.pcwtm.pcwtm-video #basePlayerContainer ~ *:has([data-e2e$=\"-digg\"]),\nhtml.pcwtm.pcwtm-video #basePlayerContainer ~ *:has([data-e2e*=\"comment-icon\"]) {\n  position: fixed !important;\n  right: calc(var(--pcwtm-space) + env(safe-area-inset-right)) !important;\n  top: 50% !important;\n  bottom: auto !important;\n  left: auto !important;\n  transform: translateY(-50%) !important;\n  width: auto !important;\n  max-width: none !important;\n  height: auto !important;\n  max-height: 80dvh !important;\n  z-index: 40 !important;\n  overflow: visible !important;\n  pointer-events: auto !important;\n  background: transparent !important;\n  visibility: visible !important;\n  opacity: 1 !important;\n}\nhtml.pcwtm.pcwtm-video [data-e2e=\"video-detail\"] video,\nhtml.pcwtm.pcwtm-video .xgplayer video,\nhtml.pcwtm.pcwtm-video .basePlayerContainer video {\n  width: 100% !important;\n  height: 100% !important;\n  object-fit: cover !important;\n  border-radius: 0 !important;\n}\n\nhtml.pcwtm [data-e2e=\"video-detail\"]:not(.pcwtm-active-aweme):has(~ [data-e2e=\"video-detail\"]),\nhtml.pcwtm [data-e2e=\"video-detail\"] ~ [data-e2e=\"video-detail\"]:not(.pcwtm-active-aweme) {\n  content-visibility: auto;\n  contain-intrinsic-size: auto 100dvh;\n}\n\nhtml.pcwtm [data-e2e=\"video-detail\"].pcwtm-active-aweme {\n  content-visibility: visible;\n}\n\nhtml.pcwtm [data-e2e=\"video-detail\"]:not(.pcwtm-active-aweme):not(:has(.pcwtm-active-aweme)) [data-e2e=\"comment-list\"],\nhtml.pcwtm [data-e2e=\"video-detail\"]:not(.pcwtm-active-aweme):not(:has(.pcwtm-active-aweme)) #comment-input-container {\n  content-visibility: hidden;\n}\n\nhtml.pcwtm:not(:has(.pcwtm-active-aweme)) [data-e2e=\"video-detail\"] .leftContainer > div:has(.comment-mainContent[data-e2e=\"comment-list\"]),\nhtml.pcwtm:not(:has(.pcwtm-active-aweme)) [data-e2e=\"video-detail\"] .leftContainer > div > div:has(.comment-mainContent[data-e2e=\"comment-list\"]),\nhtml.pcwtm:not(:has(.pcwtm-active-aweme)) [data-e2e=\"video-detail\"] #comment-input-container,\nhtml.pcwtm:not(:has(.pcwtm-active-aweme)) [data-e2e=\"video-detail\"] [data-e2e=\"comment-list\"],\nhtml.pcwtm [data-e2e=\"video-detail\"].pcwtm-active-aweme .leftContainer > div:has(.comment-mainContent[data-e2e=\"comment-list\"]),\nhtml.pcwtm [data-e2e=\"video-detail\"].pcwtm-active-aweme .leftContainer > div > div:has(.comment-mainContent[data-e2e=\"comment-list\"]),\nhtml.pcwtm [data-e2e=\"video-detail\"].pcwtm-active-aweme #comment-input-container,\nhtml.pcwtm [data-e2e=\"video-detail\"].pcwtm-active-aweme [data-e2e=\"comment-list\"],\nhtml.pcwtm .pcwtm-active-aweme [data-e2e=\"video-detail\"] .leftContainer > div:has(.comment-mainContent[data-e2e=\"comment-list\"]),\nhtml.pcwtm .pcwtm-active-aweme [data-e2e=\"video-detail\"] #comment-input-container,\nhtml.pcwtm .pcwtm-active-aweme [data-e2e=\"video-detail\"] [data-e2e=\"comment-list\"] {\n  position: relative !important;\n  width: 100% !important;\n  max-width: 100% !important;\n  height: auto !important;\n  min-height: 40vh !important;\n  left: auto !important;\n  right: auto !important;\n  top: auto !important;\n  bottom: auto !important;\n}\n\nhtml.pcwtm [data-e2e=\"aweme-relate\"],\nhtml.pcwtm [data-e2e=\"related-video\"] {\n  width: 100% !important;\n  max-width: 100% !important;\n}\n\nhtml.pcwtm [data-e2e=\"comment-input\"],\nhtml.pcwtm textarea,\nhtml.pcwtm input[placeholder*=\"\u8bc4\u8bba\"] {\n  font-size: 16px !important;\n}\n\n/* ---------- \u7cbe\u9009 / jingxuan grid \u2192 single column ---------- */\n\nhtml.pcwtm .discover-tab-container,\nhtml.pcwtm .discover-tab-bar {\n  width: 100% !important;\n  max-width: 100% !important;\n  min-width: 0 !important;\n}\n\nhtml.pcwtm .discover-tab-bar {\n  display: flex !important;\n  flex-wrap: nowrap !important;\n  overflow-x: auto !important;\n  -webkit-overflow-scrolling: touch;\n  scrollbar-width: none;\n  touch-action: pan-x;\n}\n\nhtml.pcwtm .discover-tab-bar::-webkit-scrollbar {\n  display: none;\n}\n\nhtml.pcwtm .jingxuanFeedList,\nhtml.pcwtm .jingxuan-scroll-element {\n  display: flex !important;\n  flex-direction: column !important;\n  gap: var(--pcwtm-space) !important;\n  width: 100% !important;\n  max-width: 100% !important;\n  min-width: 0 !important;\n  padding: var(--pcwtm-space) var(--pcwtm-space) 72px !important;\n  box-sizing: border-box !important;\n  overflow-x: hidden !important;\n}\n\n/* Live grid is `.jingxuan-scroll-element > div` with hardcoded 314px 314px */\nhtml.pcwtm .jingxuan-scroll-element > div {\n  display: grid !important;\n  grid-template-columns: minmax(0, 1fr) !important;\n  width: 100% !important;\n  max-width: 100% !important;\n  min-width: 0 !important;\n  gap: var(--pcwtm-space) !important;\n}\n\nhtml.pcwtm .discover-video-card-item,\nhtml.pcwtm .discover-video-card-img,\nhtml.pcwtm .waterfall-videoCardContainer,\nhtml.pcwtm .jingxuanVideoCard {\n  width: 100% !important;\n  max-width: 100% !important;\n}\n\nhtml.pcwtm #douyin-right-container ul[data-e2e=\"scroll-list\"],\nhtml.pcwtm #search-result-container ul[data-e2e=\"scroll-list\"] {\n  display: flex !important;\n  flex-direction: column !important;\n  gap: var(--pcwtm-space) !important;\n  width: 100% !important;\n  padding: var(--pcwtm-space) var(--pcwtm-space) 72px !important;\n  box-sizing: border-box !important;\n}\n\nhtml.pcwtm #douyin-right-container ul[data-e2e=\"scroll-list\"] > li,\nhtml.pcwtm #search-result-container ul[data-e2e=\"scroll-list\"] > li,\nhtml.pcwtm .search-result-card {\n  width: 100% !important;\n  max-width: 100% !important;\n}\n\n/* modal_id overlay player (jingxuan tap \u2192 swipe) */\nhtml.pcwtm.pcwtm-modal #slidelist,\nhtml.pcwtm [class*=\"isCssFullScreen\"] #slidelist,\nhtml.pcwtm #slidelist[class*=\"isCssFullScreen\"] {\n  height: 100dvh !important;\n}\n\n/* ---------- Hide download / get-app chrome, keep login ---------- */\n\nhtml.pcwtm a[href*=\"apps.apple.com\"],\nhtml.pcwtm a[href*=\"itunes.apple.com\"],\nhtml.pcwtm a[href*=\"play.google.com\"],\nhtml.pcwtm a[href*=\"app.adjust.com\"],\nhtml.pcwtm [class*=\"get_app\"],\nhtml.pcwtm [class*=\"get-app\"],\nhtml.pcwtm [class*=\"getApp\"],\nhtml.pcwtm [class*=\"GetApp\"],\nhtml.pcwtm [class*=\"download-app\"],\nhtml.pcwtm [class*=\"DownloadApp\"],\nhtml.pcwtm [class*=\"open-in-app\"],\nhtml.pcwtm [class*=\"OpenInApp\"],\nhtml.pcwtm .pcwtm-hide-promo,\nhtml.pcwtm #videoSideCard [class*=\"everyone-search\"],\nhtml.pcwtm #videoSideBar [class*=\"everyone-search\"],\nhtml.pcwtm .pcwtm-sheet-panel [class*=\"everyone-search\"],\nhtml.pcwtm #videoSideCard [class*=\"EveryoneSearch\"],\nhtml.pcwtm #videoSideBar [class*=\"EveryoneSearch\"],\nhtml.pcwtm .pcwtm-sheet-panel [class*=\"EveryoneSearch\"] {\n  display: none !important;\n  content-visibility: hidden;\n}\n\n/* Stretch width only WHILE the official form/title is in the tree.\n * Never set display \u2014 official close is display:none or empty children.\n * Do not 100vw a leftover wrapper that no longer has a login form. */\nhtml.pcwtm #login-panel-new:has(#douyin_login_comp_mobile_code),\nhtml.pcwtm #login-panel-new:has(#douyin_login_comp_single_panel),\nhtml.pcwtm #login-panel-new:has(#douyin_login_comp_flat_panel_title),\nhtml.pcwtm #douyin-login-new-id:has(#douyin_login_comp_mobile_code),\nhtml.pcwtm #douyin-login-new-id:has(#douyin_login_comp_single_panel),\nhtml.pcwtm #douyin-login-new-id:has(#douyin_login_comp_flat_panel_title),\nhtml.pcwtm article#douyin_login_comp_flat_panel:has(#douyin_login_comp_mobile_code),\nhtml.pcwtm article#douyin_login_comp_flat_panel:has(#douyin_login_comp_single_panel),\nhtml.pcwtm article#douyin_login_comp_flat_panel:has(#douyin_login_comp_flat_panel_title) {\n  box-sizing: border-box !important;\n  width: 100vw !important;\n  max-width: 100vw !important;\n  min-width: 0 !important;\n}\n\n/* Landing is already official flex. Stack the 253px phone column by\n * width only \u2014 do not set display on the three hosts above. */\nhtml.pcwtm #douyin_login_landing_flat_container,\nhtml.pcwtm #douyin_login_comp_single_panel {\n  box-sizing: border-box !important;\n  width: 100% !important;\n  max-width: 100% !important;\n  min-width: 0 !important;\n  flex-direction: column !important;\n}\n\nhtml.pcwtm #login-panel-new > *,\nhtml.pcwtm #douyin-login-new-id > *,\nhtml.pcwtm article#douyin_login_comp_flat_panel > *,\nhtml.pcwtm #douyin_login_landing_flat_container > *,\nhtml.pcwtm #douyin_login_comp_single_panel > * {\n  box-sizing: border-box !important;\n  width: 100% !important;\n  max-width: 100% !important;\n  min-width: 0 !important;\n}\n\n/* QR nodes only. After close, leftover scan/guide ids stay in the DOM;\n * :has(scan) on a parent must not display:none a wrapper that also\n * holds .positionBox / like / comment. */\nhtml.pcwtm #douyin_login_comp_scan_code,\nhtml.pcwtm #animate_qrcode_container,\nhtml.pcwtm #default_scan_code_guide {\n  display: none !important;\n}\nhtml.pcwtm #login-panel-new > *:has(#douyin_login_comp_scan_code):not(:has(#douyin_login_comp_mobile_code)):not(:has(#douyin_login_comp_single_panel)):not(:has(.positionBox)):not(:has([data-e2e=\"feed-comment-icon\"])):not(:has([data-e2e=\"video-player-digg\"])),\nhtml.pcwtm #douyin-login-new-id > *:has(#douyin_login_comp_scan_code):not(:has(#douyin_login_comp_mobile_code)):not(:has(#douyin_login_comp_single_panel)):not(:has(.positionBox)):not(:has([data-e2e=\"feed-comment-icon\"])):not(:has([data-e2e=\"video-player-digg\"])),\nhtml.pcwtm #douyin_login_landing_flat_container > *:has(#douyin_login_comp_scan_code):not(:has(#douyin_login_comp_mobile_code)):not(:has(#douyin_login_comp_single_panel)):not(:has(.positionBox)):not(:has([data-e2e=\"feed-comment-icon\"])) {\n  pointer-events: none !important;\n}\n\nhtml.pcwtm #login-panel-new *:has(#douyin_login_comp_mobile_code),\nhtml.pcwtm #login-panel-new *:has(#douyin_login_comp_single_panel),\nhtml.pcwtm #douyin-login-new-id *:has(#douyin_login_comp_mobile_code),\nhtml.pcwtm #douyin-login-new-id *:has(#douyin_login_comp_single_panel),\nhtml.pcwtm #douyin_login_comp_flat_panel *:has(#douyin_login_comp_mobile_code),\nhtml.pcwtm #douyin_login_comp_flat_panel *:has(#douyin_login_comp_single_panel),\nhtml.pcwtm #douyin_login_landing_flat_container *:has(#douyin_login_comp_mobile_code),\nhtml.pcwtm #douyin_login_landing_flat_container *:has(#douyin_login_comp_single_panel),\nhtml.pcwtm #douyin_login_comp_single_panel *:has(#douyin_login_comp_mobile_code) {\n  width: 100% !important;\n  max-width: 100% !important;\n  min-width: 0 !important;\n}\n\nhtml.pcwtm #login-panel-new #douyin_login_comp_mobile_code,\nhtml.pcwtm #douyin-login-new-id #douyin_login_comp_mobile_code,\nhtml.pcwtm #douyin_login_comp_flat_panel #douyin_login_comp_mobile_code,\nhtml.pcwtm #douyin_login_landing_flat_container #douyin_login_comp_mobile_code,\nhtml.pcwtm #douyin_login_comp_single_panel #douyin_login_comp_mobile_code,\nhtml.pcwtm #login-panel-new #douyin_login_comp_single_panel,\nhtml.pcwtm #douyin-login-new-id #douyin_login_comp_single_panel,\nhtml.pcwtm #douyin_login_comp_flat_panel #douyin_login_comp_single_panel,\nhtml.pcwtm #login-panel-new #douyin_login_comp_normal_input_id,\nhtml.pcwtm #douyin-login-new-id #douyin_login_comp_normal_input_id,\nhtml.pcwtm #login-panel-new #douyin_login_comp_button_input_id,\nhtml.pcwtm #douyin-login-new-id #douyin_login_comp_button_input_id,\nhtml.pcwtm #login-panel-new #douyin_login_comp_btn_id,\nhtml.pcwtm #douyin-login-new-id #douyin_login_comp_btn_id {\n  width: 100% !important;\n  max-width: 100% !important;\n  min-width: 0 !important;\n  left: auto !important;\n  right: auto !important;\n}\n\nhtml.pcwtm [role=\"dialog\"],\nhtml.pcwtm .semi-modal,\nhtml.pcwtm #login-pannel,\nhtml.pcwtm [data-e2e=\"recommend-guide-mask\"],\nhtml.pcwtm #douyin-web-recommend-guide-mask {\n  max-width: 100vw !important;\n  min-width: 0 !important;\n}\n\nhtml.pcwtm #recommend-note,\nhtml.pcwtm a[href*=\"beian.miit.gov.cn\"],\nhtml.pcwtm a[href*=\"beian.gov.cn\"] {\n  display: none !important;\n  content-visibility: hidden;\n}\n\n/* ---------- Search / profile: global min-width only ---------- */\n\nhtml.pcwtm #search-content-area,\nhtml.pcwtm #search-content-area > div,\nhtml.pcwtm #search-result-container {\n  width: 100% !important;\n  max-width: 100% !important;\n  min-width: 0 !important;\n}\n\n/* WAF / logged-out challenge shell: just unlock width */\nhtml.pcwtm body:has(script[src*=\"waf-jschallenge\"]) {\n  min-width: 0 !important;\n}\n";

  // After first paint we do not observe documentElement with subtree:true.
  // Watch the smallest live roots (slidelist / sliderVideo / video-detail,
  // plus style/class on comment side panels). Coalesce with one rAF.
  // collectLinks runs only when the drawer opens (textContent, never innerText).

  var STYLE_ID = "pcwtm-douyin-css";
  var WIDTH_MAX = 920;
  var WATCH_MS = 2000;
  var PCWTM_KEY = "pcwtm";
  var ON_VIDEO_KEY = "pcwtm-on-video";
  var LAST_KIND_KEY = "pcwtm-last-kind";
  var RECOVER_N_KEY = "pcwtm-recover-n";
  var STAY_JX_KEY = "pcwtm-stay-jingxuan";
  var RECOMMEND_HREF = "https://www.douyin.com/?recommend=1&from_nav=1";

  // Official PC destinations we keep reachable if the live nav omitted them.
  // Shop is not listed here — only collected when the official nav has it.
  // 推荐 uses from_nav=1: bare ?recommend=1 often SPA-bounces to /jingxuan?modal_id=.
  var FALLBACK_LINKS = [
    { href: RECOMMEND_HREF, text: "推荐" },
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
  var historyPatched = false;
  var leaveBound = false;
  var navBound = false;
  var rawPushState = null;
  var detailTrapLive = false;
  var detailTrapFor = "";
  var detailTrapPushes = 0;
  var lastAwemeKey = "";
  var suppressSheetUntil = 0;
  var closingSheet = false;

  function store(key, value) {
    try {
      if (value == null) sessionStorage.removeItem(key);
      else sessionStorage.setItem(key, value);
    } catch (e) {}
  }

  function load(key) {
    try {
      return sessionStorage.getItem(key);
    } catch (e) {
      return null;
    }
  }

  /* First-load direct /video/:id: mark before apply / wantMobile / paint. */
  try {
    if ((location.pathname || "").indexOf("/video/") === 0) {
      sessionStorage.removeItem(STAY_JX_KEY);
      sessionStorage.setItem(ON_VIDEO_KEY, "1");
      sessionStorage.setItem(LAST_KIND_KEY, "video");
    }
  } catch (e0) {}

  function queryPcwtm() {
    try {
      return new URLSearchParams(location.search).get(PCWTM_KEY);
    } catch (e) {
      return null;
    }
  }

  function rememberPcwtm() {
    var q = queryPcwtm();
    if (q === "1" || q === "0") store(PCWTM_KEY, q);
    return q === "1" || q === "0" ? q : load(PCWTM_KEY);
  }

  function wantMobile() {
    var flag = rememberPcwtm();
    if (flag === "0") return false;
    if (flag === "1") return true;
    if (/Android|iPhone|iPod|Mobile|webOS/i.test(navigator.userAgent)) return true;
    if (window.innerWidth <= WIDTH_MAX) return true;
    if (navigator.maxTouchPoints > 0 && Math.min(screen.width, screen.height) <= WIDTH_MAX)
      return true;
    return false;
  }

  function isWwwDouyin(u) {
    return u && /(^|\.)douyin\.com$/.test(u.hostname) && u.hostname.indexOf("live.") !== 0;
  }

  function isRecommendLabel(text) {
    return /^(推荐|For You|Recommend)$/i.test((text || "").replace(/\s+/g, " ").trim());
  }

  function isRecommendUrl(u) {
    if (!u) return false;
    var path = u.pathname.replace(/\/+$/, "") || "/";
    return path === "/" && u.searchParams.get("recommend") === "1";
  }

  function isVideoPath(path) {
    return (path || location.pathname || "").indexOf("/video/") === 0;
  }

  /* 0.2.5 wrote ON_VIDEO_KEY only when location.pathname was already
   * /video/… (IIFE + apply-if-mobile). Cold open often hydrates from
   * / or /jingxuan first; the feed→detail SPA is the case that looked
   * like it “worked”. Treat any detail document as from-detail. */
  function isJingxuanGrid() {
    if (/精选电脑版/.test(document.title || "")) return true;
    return !!document.querySelector(
      ".jingxuan-scroll-element, .jingxuanFeedList, .discover-tab-bar, .discover-tab-container"
    );
  }

  function isDetailPage() {
    if (isVideoPath()) return true;
    if (isJingxuanGrid()) return false;
    try {
      return !!document.querySelector('[data-e2e="video-detail"]');
    } catch (e) {
      return false;
    }
  }

  /* Live SSR: logo / 精选 are //www.douyin.com/jingxuan, not history.back().
   * Official 返回 on /video/:id uses the same kind of leave (href or
   * location = jingxuan / / / jingxuan.douyin.com / app protocol). */
  function isDumpDest(href) {
    if (!href) return false;
    var raw = String(href);
    if (/^(snssdk|aweme|douyin)[0-9]*:/i.test(raw)) return true;
    if (/xdg-open|openapp|download_app/i.test(raw)) return true;
    try {
      var u = new URL(raw, location.href);
      if (/jingxuan\.douyin\.com$/i.test(u.hostname)) return true;
      if (!isWwwDouyin(u) && u.hostname.indexOf("douyin.com") === -1) return false;
      var p = u.pathname.replace(/\/+$/, "") || "/";
      if (p.indexOf("/jingxuan") === 0) return true;
      if (p === "/" && u.searchParams.get("recommend") !== "1") return true;
      return false;
    } catch (e) {
      return /jingxuan/i.test(raw);
    }
  }

  function shouldHijackLeave(href) {
    if (load(STAY_JX_KEY) === "1") return false;
    if (!wantMobile() && rememberPcwtm() !== "1") return false;
    if (!isDetailPage() && !cameFromVideo()) return false;
    return isDumpDest(href);
  }

  function isOfficialSwitch(el) {
    return !!(
      el &&
      el.closest &&
      el.closest(
        "[data-e2e='video-switch-next-arrow'], [data-e2e='video-switch-prev-arrow'], .xgplayer-playswitch"
      )
    );
  }

  function retargetOfficialVideoBack() {
    if (!isVideoPath() || !wantMobile()) return;
    var nodes = document.querySelectorAll("a[href], [data-e2e='video-detail'] a");
    var i;
    for (i = 0; i < nodes.length; i++) {
      var a = nodes[i];
      if (!a.href || !isDumpDest(a.href)) continue;
      if (a.closest && a.closest("#pcwtm-drawer")) continue;
      if (isOfficialSwitch(a)) continue;
      var lab = labelOf(a);
      if (/^(精选|推荐|For You|Topick)$/i.test(lab)) continue;
      if (a.getAttribute("data-pcwtm-videoback") === "1") continue;
      a.setAttribute("data-pcwtm-videoback", "1");
      a.setAttribute("href", recommendHref());
    }
  }

  function isJingxuanDesktopLanding() {
    if (isVideoPath()) return false;
    try {
      if (isRecommendUrl(new URL(location.href))) return false;
    } catch (e) {}
    var path = location.pathname || "/";
    var search = location.search || "";
    if (path.indexOf("/jingxuan") === 0) return true;
    if (/(?:\?|&)modal_id=/.test(search)) return true;
    if ((path === "/" || path === "") && !/(?:\?|&)recommend=1/.test(search)) return true;
    if (isJingxuanGrid()) return true;
    return false;
  }

  function keepPcwtm(u) {
    var flag = rememberPcwtm();
    if ((flag === "1" || flag === "0") && isWwwDouyin(u)) {
      u.searchParams.set(PCWTM_KEY, flag);
    }
  }

  function stabilizeRecommend(u) {
    if (isRecommendUrl(u) && u.searchParams.get("from_nav") !== "1") {
      u.searchParams.set("from_nav", "1");
    }
  }

  function mutateHref(href, mutator) {
    if (href == null || href === "") return href;
    try {
      var u = new URL(href, location.href);
      mutator(u);
      if (/^https?:\/\//i.test(String(href))) return u.href;
      return u.pathname + u.search + u.hash;
    } catch (e) {
      return href;
    }
  }

  function decorateHref(href) {
    return mutateHref(href, function (u) {
      keepPcwtm(u);
    });
  }

  function recommendHref() {
    return mutateHref(RECOMMEND_HREF, function (u) {
      keepPcwtm(u);
      stabilizeRecommend(u);
    });
  }

  function samePlace(href) {
    try {
      var u = new URL(href, location.href);
      return u.pathname === location.pathname && u.search === location.search;
    } catch (e) {
      return false;
    }
  }

  function goRecommend(replace) {
    var href = recommendHref();
    closeDrawer();
    if (samePlace(href)) return;
    if (replace) location.replace(href);
    else location.assign(href);
  }

  /* Any /video/:id load (cold open included) counts as from-detail.
   * Write at document-start, on detail DOM, and again on pagehide so
   * browser Back to the previous /jingxuan entry can recycle. */
  function persistVideoMark() {
    if (!isDetailPage()) return;
    try {
      window.__pcwtmFromDetail = true;
    } catch (e) {}
    store(STAY_JX_KEY, null);
    store(ON_VIDEO_KEY, "1");
    store(LAST_KIND_KEY, "video");
    store(RECOVER_N_KEY, null);
  }

  function rememberVideoPage() {
    persistVideoMark();
    if (isVideoPath()) return;
    try {
      if (isRecommendUrl(new URL(location.href))) {
        store(LAST_KIND_KEY, "recommend");
        return;
      }
    } catch (e) {}
  }

  function clearVideoMark() {
    try {
      window.__pcwtmFromDetail = false;
    } catch (e) {}
    store(ON_VIDEO_KEY, null);
    store(RECOVER_N_KEY, null);
    if (load(LAST_KIND_KEY) === "video") store(LAST_KIND_KEY, "recommend");
  }

  function allowJingxuanNav() {
    try {
      window.__pcwtmFromDetail = false;
    } catch (e) {}
    store(ON_VIDEO_KEY, null);
    store(RECOVER_N_KEY, null);
    store(LAST_KIND_KEY, "jingxuan");
    store(STAY_JX_KEY, "1");
    detailTrapLive = false;
    detailTrapFor = "";
  }

  function referrerWasVideo() {
    try {
      if (!document.referrer) return false;
      var u = new URL(document.referrer);
      if (!isWwwDouyin(u) && String(u.hostname).indexOf("douyin.com") === -1) return false;
      return isVideoPath(u.pathname);
    } catch (e) {
      return false;
    }
  }

  function cameFromVideo() {
    if (load(STAY_JX_KEY) === "1") return false;
    try {
      if (window.__pcwtmFromDetail) return true;
    } catch (e) {}
    if (load(ON_VIDEO_KEY) === "1") return true;
    if (load(LAST_KIND_KEY) === "video") return true;
    return referrerWasVideo();
  }

  function recommendFeedReady() {
    try {
      if (!isRecommendUrl(new URL(location.href))) return false;
    } catch (e) {
      return false;
    }
    return !!document.getElementById("slidelist");
  }

  function recoverVideoBack() {
    if (load(STAY_JX_KEY) === "1") return false;
    if (!wantMobile() && rememberPcwtm() !== "1") return false;
    if (isDetailPage()) {
      persistVideoMark();
      return false;
    }
    if (recommendFeedReady()) {
      clearVideoMark();
      return false;
    }
    try {
      if (isRecommendUrl(new URL(location.href))) return false;
    } catch (e) {}
    if (!cameFromVideo()) return false;
    if (!isJingxuanDesktopLanding()) return false;
    var n = parseInt(load(RECOVER_N_KEY) || "0", 10);
    if (n >= 2) return false;
    store(RECOVER_N_KEY, String(n + 1));
    goRecommend(true);
    return true;
  }

  function rewriteLanding() {
    try {
      var flag = rememberPcwtm();
      var u = new URL(location.href);
      var before = u.href;
      if (flag === "1" || flag === "0") u.searchParams.set(PCWTM_KEY, flag);
      if (u.href !== before) location.replace(u.pathname + u.search + u.hash);
    } catch (e) {}
  }

  function armDetailBackTrap() {
    if (load(STAY_JX_KEY) === "1") return;
    if (!wantMobile() && rememberPcwtm() !== "1") return;
    if (!isVideoPath()) return;
    if (!rawPushState) return;
    if (detailTrapFor !== location.pathname) {
      detailTrapFor = "";
      detailTrapPushes = 0;
      detailTrapLive = false;
    }
    if (history.state && history.state.pcwtmFromDetail) {
      detailTrapLive = true;
      detailTrapFor = location.pathname;
      return;
    }
    if (detailTrapPushes >= 2) return;
    try {
      rawPushState.call(history, { pcwtmFromDetail: location.pathname }, "", location.href);
      detailTrapLive = true;
      detailTrapFor = location.pathname;
      detailTrapPushes += 1;
    } catch (e) {}
  }

  function patchHistory() {
    if (historyPatched) return;
    historyPatched = true;
    var push = history.pushState;
    var replace = history.replaceState;
    rawPushState = push;
    history.pushState = function (state, title, url) {
      if (url != null && shouldHijackLeave(url)) url = recommendHref();
      var ret = push.call(this, state, title, url == null ? url : decorateHref(url));
      setTimeout(recoverVideoBack, 0);
      setTimeout(recoverVideoBack, 300);
      if (isVideoPath()) setTimeout(armDetailBackTrap, 0);
      onNavigate();
      return ret;
    };
    history.replaceState = function (state, title, url) {
      if (url != null && shouldHijackLeave(url)) url = recommendHref();
      var ret = replace.call(this, state, title, url == null ? url : decorateHref(url));
      setTimeout(recoverVideoBack, 0);
      setTimeout(recoverVideoBack, 300);
      if (isVideoPath() && !(history.state && history.state.pcwtmFromDetail)) {
        detailTrapLive = false;
        setTimeout(armDetailBackTrap, 0);
      }
      onNavigate();
      return ret;
    };
    try {
      var assign = window.location.assign.bind(window.location);
      var locReplace = window.location.replace.bind(window.location);
      window.location.assign = function (url) {
        assign(shouldHijackLeave(url) ? recommendHref() : url);
      };
      window.location.replace = function (url) {
        locReplace(shouldHijackLeave(url) ? recommendHref() : url);
      };
    } catch (e) {}
    try {
      var desc = Object.getOwnPropertyDescriptor(Location.prototype, "href");
      if (desc && desc.set) {
        Object.defineProperty(window.location, "href", {
          configurable: true,
          get: function () {
            return desc.get.call(window.location);
          },
          set: function (url) {
            desc.set.call(window.location, shouldHijackLeave(url) ? recommendHref() : url);
          },
        });
      }
    } catch (e2) {}
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
    var modal = /(?:\?|&)modal_id=/.test(search) || /[?&#]modal_id=/.test(location.href);
    var recommend =
      (path === "/" && /(?:\?|&)recommend=1/.test(search)) || !!document.getElementById("slidelist");
    var jingxuan = path.indexOf("/jingxuan") === 0 && !modal;
    var video = path.indexOf("/video/") === 0;
    var root = document.documentElement;
    root.classList.toggle("pcwtm-recommend", recommend);
    root.classList.toggle("pcwtm-jingxuan", jingxuan);
    root.classList.toggle("pcwtm-video", video);
    root.classList.toggle("pcwtm-modal", modal);
    if (video || isDetailPage()) rememberVideoPage();
    markActiveAweme();
  }

  function syncMode() {
    var on = wantMobile();
    document.documentElement.classList.toggle("pcwtm", on);
    if (on) {
      applyViewport();
      applyStyle();
      syncPage();
    } else {
      document.documentElement.classList.remove("pcwtm-open", "pcwtm-searching", "pcwtm-comments");
    }
    return on;
  }

  var HOST_CLOSE_CLASS = "pcwtm-host-close";

  function visibleArea(el) {
    if (!el || !el.getBoundingClientRect) return 0;
    var r = el.getBoundingClientRect();
    var vh = window.innerHeight || 0;
    var vw = window.innerWidth || 0;
    var h = Math.min(r.bottom, vh) - Math.max(r.top, 0);
    var w = Math.min(r.right, vw) - Math.max(r.left, 0);
    if (h <= 0 || w <= 0) return 0;
    return h * w;
  }

  function pickMostVisible(nodes) {
    var best = null;
    var bestA = 0;
    var i;
    for (i = 0; i < nodes.length; i++) {
      var area = visibleArea(nodes[i]);
      if (area > bestA) {
        bestA = area;
        best = nodes[i];
      }
    }
    return bestA > 6400 ? best : null;
  }

  function videoDigits(el) {
    if (!el) return "";
    var cm = String(el.className || "").match(/video_(\d+)/);
    return cm ? cm[1] : "";
  }

  function pathAwemeId() {
    var path = location.pathname || "";
    var m = path.match(/\/video\/(\d+)/);
    if (m) return m[1];
    try {
      var mid = new URLSearchParams(location.search).get("modal_id");
      if (mid && /^\d+$/.test(mid)) return mid;
    } catch (e) {}
    return "";
  }

  /* Live: many cards reuse id=sliderVideo. That id is the card, not a
   * wrapper, unless it actually contains another aweme card. */
  function isSlideWrapper(el) {
    if (!el || el.nodeType !== 1) return false;
    if (el.id === "slidelist") return true;
    if ((el.getAttribute("data-e2e") || "") === "slideList") return true;
    if (el.id === "sliderVideo") {
      return !!el.querySelector(
        "[data-e2e='feed-video'], [data-e2e='feed-active-video'], [data-e2e='video-detail']"
      );
    }
    return false;
  }

  function isAwemeCard(el) {
    if (!el || isSlideWrapper(el)) return false;
    var e2e = el.getAttribute("data-e2e") || "";
    return e2e === "feed-active-video" || e2e === "feed-video" || e2e === "video-detail";
  }

  function playingBonus(el) {
    if (!el || !el.querySelector) return 0;
    var v = el.querySelector("video");
    return v && !v.paused && v.readyState >= 2 ? 1000000 : 0;
  }

  function idFromScope(scope) {
    var id = videoDigits(scope);
    if (id) return id;
    if (!scope || !scope.querySelectorAll) return "";
    var nodes = scope.querySelectorAll("[class*='video_']");
    var i;
    var best = "";
    var bestScore = -1;
    for (i = 0; i < nodes.length; i++) {
      var nid = videoDigits(nodes[i]);
      if (!nid) continue;
      var score = visibleArea(nodes[i]) + playingBonus(nodes[i]);
      if (score > bestScore) {
        bestScore = score;
        best = nid;
      }
    }
    return best;
  }

  /* After /video/:id slide, #sliderVideo / first video-detail keep the old
   * attrs. Use the in-view slidelist child (the new card), not the wrapper. */
  function slideCards() {
    var out = [];
    var seen = [];
    function add(el) {
      if (!el || isSlideWrapper(el)) return;
      if (seen.indexOf(el) !== -1) return;
      seen.push(el);
      out.push(el);
    }
    var lists = document.querySelectorAll("#slidelist, [data-e2e='slideList']");
    var i;
    var L;
    for (L = 0; L < lists.length; L++) {
      if (!lists[L].children) continue;
      for (i = 0; i < lists[L].children.length; i++) add(lists[L].children[i]);
    }
    var feeds = document.querySelectorAll(
      "[id='sliderVideo'], [data-e2e='feed-video'], [data-e2e='feed-active-video'], [data-e2e='video-detail']"
    );
    for (i = 0; i < feeds.length; i++) add(feeds[i]);
    return out;
  }

  /* Official feed-active-video / video_* often stay on the first card.
   * Score the painted item: viewport, playing video, path id, center hit. */
  function cardFromPoint() {
    var x = Math.floor((window.innerWidth || 0) / 2);
    var y = Math.floor((window.innerHeight || 0) * 0.42);
    var hit = document.elementFromPoint(x, y);
    if (!hit || !hit.closest) return null;
    if (hit.closest("#videoSideCard, #videoSideBar, .pcwtm-sheet-panel, #pcwtm-drawer, #pcwtm-menu-btn"))
      return null;
    var card = hit.closest(
      "[data-e2e='feed-active-video'], [data-e2e='feed-video'], [data-e2e='video-detail']"
    );
    return card && !isSlideWrapper(card) ? card : null;
  }

  function pickActiveCard(nodes) {
    var pathId = pathAwemeId();
    var pointed = cardFromPoint();
    var best = null;
    var bestScore = 0;
    var i;
    var vh = window.innerHeight || 0;
    var mid = vh / 2;
    for (i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (!el || isSlideWrapper(el)) continue;
      var area = visibleArea(el);
      if (area <= 0) continue;
      var score = area;
      var id = idFromScope(el);
      if (id && pathId && id === pathId) score += 2000000;
      score += playingBonus(el);
      if (
        pointed &&
        (el === pointed || (el.contains && el.contains(pointed)) || (pointed.contains && pointed.contains(el)))
      ) {
        score += 3000000;
      }
      try {
        var op = parseFloat(window.getComputedStyle(el).opacity);
        if (!isNaN(op)) score += op * 8000;
      } catch (e1) {}
      var r = el.getBoundingClientRect();
      score -= Math.min(Math.abs((r.top + r.bottom) / 2 - mid), vh);
      if (score > bestScore) {
        bestScore = score;
        best = el;
      }
    }
    return bestScore > 6400 || (best && playingBonus(best)) ? best : null;
  }

  function asCard(el) {
    if (!el || el === document.body) return el;
    if (isAwemeCard(el)) return el;
    if (el.closest) {
      var host = el.closest(
        "[data-e2e='feed-active-video'], [data-e2e='feed-video'], [data-e2e='video-detail']"
      );
      if (host && !isSlideWrapper(host) && visibleArea(host) > 0) return host;
    }
    if (el.querySelectorAll) {
      var inner = pickActiveCard(
        el.querySelectorAll("[data-e2e='feed-active-video'], [data-e2e='feed-video'], [data-e2e='video-detail']")
      );
      if (inner) return inner;
    }
    return isSlideWrapper(el) ? null : el;
  }

  function activeVideoRoot() {
    var best = asCard(pickActiveCard(slideCards()));
    if (best) return best;
    best = asCard(pickActiveCard(document.querySelectorAll("[data-e2e='video-detail']")));
    if (best) return best;
    var pointed = asCard(cardFromPoint());
    if (pointed) return pointed;
    best = asCard(pickActiveCard(document.querySelectorAll("[id='sliderVideo']")));
    if (best) return best;
    return document.querySelector("[data-e2e='video-detail']") || document.body;
  }

  function currentAwemeId() {
    return idFromScope(activeVideoRoot()) || pathAwemeId();
  }

  function awemeKey() {
    var scope = activeVideoRoot();
    var tag = "";
    if (scope && scope.getAttribute) tag = scope.getAttribute("data-e2e") || scope.id || "";
    return currentAwemeId() + "@" + tag;
  }

  function markActiveAweme() {
    var scope = activeVideoRoot();
    var prev = document.querySelectorAll(".pcwtm-active-aweme");
    var i;
    var swapped = false;
    for (i = 0; i < prev.length; i++) {
      if (prev[i] !== scope) prev[i].classList.remove("pcwtm-active-aweme");
    }
    if (scope && scope.classList && scope !== document.body) {
      scope.classList.add("pcwtm-active-aweme");
    }
    var key = awemeKey();
    if (key !== lastAwemeKey) {
      lastAwemeKey = key;
      swapped = true;
      suppressSheetUntil = Date.now() + 700;
      document.documentElement.classList.remove("pcwtm-comments");
      var leftover = document.querySelectorAll("." + HOST_CLOSE_CLASS + ", .pcwtm-sheet-panel");
      for (i = 0; i < leftover.length; i++) {
        leftover[i].classList.remove(HOST_CLOSE_CLASS, "pcwtm-sheet-panel");
        if (leftover[i].style) leftover[i].style.transform = "";
      }
      dismissOfficialPanels();
      suppressSheetUntil = Date.now() + 700;
    }
    return swapped;
  }

  function dismissOfficialPanels() {
    closingSheet = true;
    try {
      var panels = commentSidePanels();
      var i;
      for (i = 0; i < panels.length; i++) {
        var panel = panels[i];
        if ((panel.offsetWidth || 0) <= 48) continue;
        var closer = findOfficialClose(panel);
        if (closer) closer.click();
        if ((panel.offsetWidth || 0) <= 48) continue;
        var owner = panelOwner(panel) || panel;
        var icon =
          (owner.querySelector && owner.querySelector("[data-e2e='feed-comment-icon']")) ||
          document.querySelector("[data-e2e='feed-comment-icon']");
        if (icon) icon.click();
      }
    } finally {
      closingSheet = false;
    }
  }

  function commentSidePanels() {
    return document.querySelectorAll("#videoSideCard, #videoSideBar");
  }

  function panelOwner(el) {
    if (!el || !el.closest) return null;
    return el.closest(
      "[data-e2e='feed-active-video'], [data-e2e='feed-video'], [data-e2e='video-detail'], #sliderVideo"
    );
  }

  /* Live: official close sets #videoSideCard/#videoSideBar width to 0 but
   * leaves #relatedVideoCard and [data-e2e=comment-list] in the DOM.
   * Peek without our sheet class so offsetWidth is the host's, not ours.
   * After /video/:id SPA swap, getElementById still hits the first card —
   * walk every id twin and keep the one for the in-view aweme. */
  function officialCommentPanel() {
    var root = document.documentElement;
    var held = root.classList.contains("pcwtm-comments");
    if (held) root.classList.remove("pcwtm-comments");
    if (Date.now() < suppressSheetUntil) {
      if (held) root.classList.add("pcwtm-comments");
      return null;
    }
    var scope = activeVideoRoot();
    var panels = commentSidePanels();
    var best = null;
    var bestW = 0;
    var i;
    for (i = 0; i < panels.length; i++) {
      var el = panels[i];
      if (!el || !el.isConnected) continue;
      var w = el.offsetWidth || 0;
      if (w <= 48) continue;
      var owner = panelOwner(el);
      if (owner && scope && owner !== scope && visibleArea(owner) < 6400) continue;
      if (w > bestW) {
        bestW = w;
        best = el;
      }
    }
    if (held) root.classList.add("pcwtm-comments");
    return best;
  }

  function findOfficialClose(panel) {
    if (!panel) return null;
    /* Live 2026-08-20: official X has no aria-label / data-e2e. Geometry first. */
    var rect = panel.getBoundingClientRect();
    var nodes = panel.querySelectorAll("button, [role='button'], svg");
    var best = null;
    var bestRight = -1;
    var i;
    for (i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      var r = node.getBoundingClientRect();
      if (r.width < 1 || r.height < 1 || r.width > 48 || r.height > 48) continue;
      if (r.top < rect.top - 8 || r.top > rect.top + 64) continue;
      if (r.right < rect.right - 80) continue;
      var text = (node.textContent || "").replace(/\s+/g, "");
      if (text && /详情|评论|视频|合集|Comments|Videos|Albums|音乐/.test(text)) continue;
      var hit = node;
      if (node.tagName === "svg") {
        hit = node.closest("button, [role='button'], a") || node.parentElement;
      }
      if (!hit || !panel.contains(hit)) continue;
      if (r.right > bestRight) {
        bestRight = r.right;
        best = hit;
      }
    }
    return best;
  }

  function findActiveCommentIcon() {
    var scope = activeVideoRoot();
    var icons = document.querySelectorAll("[data-e2e='feed-comment-icon']");
    var best = null;
    var bestA = 0;
    var scoped = null;
    var scopedA = -1;
    var i;
    for (i = 0; i < icons.length; i++) {
      var icon = icons[i];
      var area = visibleArea(icon);
      if (area > bestA) {
        bestA = area;
        best = icon;
      }
      if (scope && scope.contains && scope.contains(icon) && area >= scopedA) {
        scopedA = area;
        scoped = icon;
      }
    }
    /* After slide the first icon can still be the largest leftover.
     * Prefer the icon on the in-view card even if immersive hide made it 0×0. */
    return scoped || best || null;
  }

  function findRailCommentChip() {
    var icon = findActiveCommentIcon();
    if (!icon) return null;
    var rail = icon.parentElement && icon.parentElement.parentElement;
    if (!rail) rail = icon.closest && icon.closest(".positionBox");
    if (!rail) rail = document.body;
    var nodes = rail.querySelectorAll("button, [role='button'], div, span");
    var i;
    for (i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (icon.contains(el) || el.contains(icon)) continue;
      var t = (el.textContent || "").replace(/\s+/g, "");
      if (!/^评论/.test(t) || t.length > 8) continue;
      if (el.children && el.children.length > 4) continue;
      return el;
    }
    return null;
  }

  function markOfficialClose(panel) {
    var close = findOfficialClose(panel);
    var chip = findRailCommentChip();
    var marked = document.querySelectorAll("." + HOST_CLOSE_CLASS);
    var i;
    for (i = 0; i < marked.length; i++) {
      if (marked[i] !== close && marked[i] !== chip) marked[i].classList.remove(HOST_CLOSE_CLASS);
    }
    if (close) close.classList.add(HOST_CLOSE_CLASS);
    if (chip) chip.classList.add(HOST_CLOSE_CLASS);
    return close;
  }

  function bindCommentSheet() {
    if (document.documentElement.getAttribute("data-pcwtm-cmt") === "1") return;
    document.documentElement.setAttribute("data-pcwtm-cmt", "1");
    document.addEventListener(
      "click",
      function (e) {
        var t = e.target;
        if (!t || !t.closest) return;
        if (isLoginWallNode(t)) return;
        if (
          !t.closest(
            "#videoSideCard, #videoSideBar, #relatedVideoCard, #merge-all-comment-container, [data-e2e='feed-comment-icon'], [data-e2e='comment-list'], [data-e2e='video-detail'], [data-e2e='feed-video'], [data-e2e='feed-active-video'], .pcwtm-active-aweme, #sliderVideo, .xgplayer, .positionBox"
          )
        )
          return;
        if (!closingSheet && t.closest("[data-e2e='feed-comment-icon']")) suppressSheetUntil = 0;
        setTimeout(syncCommentSheet, 50);
        setTimeout(syncCommentSheet, 250);
        setTimeout(syncCommentSheet, 600);
      },
      true
    );
  }

  function sheetChromeNodes(panel) {
    var root = panel.querySelector("#relatedVideoCard") || panel;
    try {
      return root.querySelectorAll(":scope > *, :scope > * > *, :scope > * > * > *");
    } catch (e) {
      return root.children;
    }
  }

  function markSheetTabs(panel) {
    var nodes = sheetChromeNodes(panel);
    var best = null;
    var bestLen = 1e6;
    var i;
    for (i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (el.getAttribute && el.getAttribute("data-e2e") === "comment-list") continue;
      var t = (el.textContent || "").replace(/\s+/g, " ").trim();
      if (!/详情/.test(t)) continue;
      if (!/(Comments|评论|Videos)/.test(t)) continue;
      if (t.length > 72) continue;
      if (t.length < bestLen) {
        bestLen = t.length;
        best = el;
      }
    }
    var prev = panel.querySelector(".pcwtm-sheet-tabs");
    if (prev && prev !== best) prev.classList.remove("pcwtm-sheet-tabs");
    if (best) best.classList.add("pcwtm-sheet-tabs");
  }

  function hideSheetPromos(panel) {
    var nodes = sheetChromeNodes(panel);
    var i;
    for (i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (el.id === "merge-all-comment-container") continue;
      if (el.getAttribute && el.getAttribute("data-e2e") === "comment-list") continue;
      if (el.querySelector && el.querySelector("[data-e2e='comment-list']")) continue;
      if (el.children && el.children.length > 6) continue;
      var t = (el.textContent || "").replace(/\s+/g, " ").trim();
      if (!t || t.length > 16) continue;
      if (!/大家都在搜|猜你想搜|相关搜索|热门搜索/.test(t)) continue;
      var box = el.closest("a") || el.parentElement || el;
      if (!box || box === panel) continue;
      if (box.id === "relatedVideoCard" || box.id === "videoSideCard" || box.id === "videoSideBar")
        continue;
      box.classList.add("pcwtm-hide-promo");
    }
  }

  function placeSheet(panel) {
    if (!panel || !panel.style) return;
    panel.style.transform = "";
    var r = panel.getBoundingClientRect();
    var vh = window.innerHeight || 0;
    var dy = vh - r.height - r.top;
    if (r.height > 40 && Math.abs(dy) > 16) {
      panel.style.transform = "translateY(" + dy + "px)";
    }
  }

  function clearSheetInline(el) {
    if (el && el.style) el.style.transform = "";
  }

  function syncCommentSheet() {
    markActiveAweme();
    var panel = officialCommentPanel();
    document.documentElement.classList.toggle("pcwtm-comments", !!panel);
    var marked = document.querySelectorAll("." + HOST_CLOSE_CLASS + ", .pcwtm-sheet-panel");
    var i;
    for (i = 0; i < marked.length; i++) {
      if (marked[i] !== panel) {
        marked[i].classList.remove(HOST_CLOSE_CLASS, "pcwtm-sheet-panel");
        clearSheetInline(marked[i]);
      }
    }
    if (!panel) return;
    panel.classList.add("pcwtm-sheet-panel");
    placeSheet(panel);
    markOfficialClose(panel);
    markSheetTabs(panel);
    hideSheetPromos(panel);
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
      if (isRecommendUrl(u)) return "recommend";
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
      if (isRecommendLabel(text) || destKey(href) === "recommend") href = recommendHref();
      else href = decorateHref(href);
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
      bindCommentSheet();
      syncCommentSheet();
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
        var a = e.target && e.target.closest ? e.target.closest("a") : null;
        if (!a || !a.href) return;
        if (isRecommendLabel(a.textContent) || destKey(a.href) === "recommend") {
          e.preventDefault();
          clearVideoMark();
          store(STAY_JX_KEY, null);
          goRecommend();
          return;
        }
        allowJingxuanNav();
        closeDrawer();
      });
      document.body.appendChild(drawer);
    }

    bindFeedSwipe();
    bindCommentSheet();
    syncCommentSheet();
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
          e.target.closest(
            "#videoSideCard, #videoSideBar, #relatedVideoCard, #merge-all-comment-container, [data-e2e='comment-list']"
          )
        )
          return;
        var sel =
          dy < 0
            ? '[data-e2e="video-switch-next-arrow"]'
            : '[data-e2e="video-switch-prev-arrow"]';
        var arrow = officialSwitchArrow(sel);
        if (arrow) arrow.click();
      },
      { passive: true }
    );
  }

  function officialSwitchArrow(sel) {
    var scope = activeVideoRoot();
    var arrow = scope && scope.querySelector ? scope.querySelector(sel) : null;
    if (arrow && visibleArea(arrow) > 0) return arrow;
    var all = document.querySelectorAll(sel);
    var i;
    for (i = 0; i < all.length; i++) {
      if (visibleArea(all[i]) > 0) return all[i];
    }
    return all[0] || null;
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
    persistVideoMark();
    if (recoverVideoBack()) return;
    var on = syncMode();
    if (on) {
      ensureChrome();
      startWatch();
      if (markActiveAweme()) {
        setTimeout(syncCommentSheet, 50);
        setTimeout(syncCommentSheet, 250);
        setTimeout(syncCommentSheet, 600);
      }
      syncCommentSheet();
      rememberVideoPage();
      retargetOfficialVideoBack();
      armDetailBackTrap();
    } else {
      stopWatch();
    }
  }

  function watchRoot(el, opts) {
    if (!el || observedRoots.indexOf(el) !== -1) return;
    var obs = new MutationObserver(schedule);
    obs.observe(el, opts || { childList: true });
    rootObservers.push(obs);
    observedRoots.push(el);
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
    /* Small-root subtree only — never documentElement. Slide updates class /
     * data-e2e / video_* on nested cards, which childList-only misses. */
    var slideSubtree = {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "style", "data-e2e"],
    };
    watchRoot(document.getElementById("slidelist"), slideSubtree);
    watchRoot(document.querySelector("[data-e2e='slideList']"), slideSubtree);
    var sliders = document.querySelectorAll(
      "[id='sliderVideo'], [data-e2e='feed-active-video'], [data-e2e='feed-video']"
    );
    for (i = 0; i < sliders.length && i < 8; i++) {
      watchRoot(sliders[i], slideSubtree);
    }
    watchRoot(document.getElementById("douyin-header"), { childList: true });
    watchRoot(document.getElementById("douyin-right-container"), { childList: true });
    var sides = commentSidePanels();
    for (i = 0; i < sides.length; i++) {
      watchRoot(sides[i], {
        childList: true,
        attributes: true,
        attributeFilter: ["style", "class"],
      });
    }
    var locals = document.querySelectorAll(
      "[data-e2e='video-detail'], .leftContainer, .route-scroll-container, .parent-route-container"
    );
    for (i = 0; i < locals.length && i < 8; i++) {
      var loc = locals[i];
      watchRoot(
        loc,
        (loc.getAttribute("data-e2e") || "") === "video-detail"
          ? slideSubtree
          : { childList: true }
      );
    }
    bindDetailScroll();
    bindSlideSettle();
    bindMediaSettle();
  }

  function bindDetailScroll() {
    var roots = document.querySelectorAll(
      ".route-scroll-container, .parent-route-container, #slidelist, [data-e2e='slideList']"
    );
    var i;
    for (i = 0; i < roots.length; i++) {
      if (roots[i].getAttribute("data-pcwtm-scroll") === "1") continue;
      roots[i].setAttribute("data-pcwtm-scroll", "1");
      roots[i].addEventListener("scroll", schedule, { passive: true });
    }
  }

  function bindSlideSettle() {
    var lists = document.querySelectorAll("#slidelist, [data-e2e='slideList']");
    var i;
    for (i = 0; i < lists.length; i++) {
      if (lists[i].getAttribute("data-pcwtm-settle") === "1") continue;
      lists[i].setAttribute("data-pcwtm-settle", "1");
      lists[i].addEventListener("transitionend", schedule, { passive: true });
    }
  }

  function bindMediaSettle() {
    var vids = document.querySelectorAll("video");
    var i;
    for (i = 0; i < vids.length && i < 8; i++) {
      if (vids[i].getAttribute("data-pcwtm-play") === "1") continue;
      vids[i].setAttribute("data-pcwtm-play", "1");
      vids[i].addEventListener("play", schedule, true);
    }
  }

  function onNavigate() {
    schedule();
    setTimeout(schedule, 400);
  }

  function onPopState(e) {
    persistVideoMark();
    if (load(STAY_JX_KEY) !== "1" && detailTrapLive && isVideoPath()) {
      var st = e && e.state;
      if (!st || !st.pcwtmFromDetail) {
        detailTrapLive = false;
        goRecommend(true);
        return;
      }
    }
    setTimeout(function () {
      if (!recoverVideoBack()) onNavigate();
    }, 0);
    setTimeout(recoverVideoBack, 80);
    setTimeout(recoverVideoBack, 300);
  }

  function bindTraverseIntercept() {
    if (navBound) return;
    if (!window.navigation || typeof window.navigation.addEventListener !== "function") return;
    navBound = true;
    window.navigation.addEventListener("navigate", function (e) {
      if (load(STAY_JX_KEY) === "1") return;
      if (!wantMobile() && rememberPcwtm() !== "1") return;
      if (e.navigationType !== "traverse") return;
      var dest = "";
      try {
        dest = e.destination && e.destination.url;
      } catch (err) {
        return;
      }
      if (!dest) return;
      if (!isDetailPage() && !cameFromVideo()) return;
      if (!isDumpDest(dest)) return;
      persistVideoMark();
      if (!e.canIntercept) {
        setTimeout(recoverVideoBack, 0);
        return;
      }
      try {
        e.intercept({
          handler: function () {
            location.replace(recommendHref());
          },
        });
      } catch (err2) {
        setTimeout(recoverVideoBack, 0);
      }
    });
  }

  function bindLeaveHooks() {
    if (leaveBound) return;
    leaveBound = true;
    persistVideoMark();
    window.addEventListener("pagehide", persistVideoMark);
    window.addEventListener("beforeunload", persistVideoMark);
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "hidden") persistVideoMark();
    });
    window.addEventListener("popstate", onPopState);
    window.addEventListener("pageshow", function () {
      persistVideoMark();
      if (recoverVideoBack()) return;
      schedule();
    });
    bindTraverseIntercept();
  }

  function isLoginWallNode(el) {
    return !!(
      el &&
      el.closest &&
      el.closest(
        "#login-panel-new, #douyin-login-new-id, #douyin_login_comp_flat_panel, #douyin_login_comp_single_panel, #douyin_login_landing_flat_container, #douyin_login_comp_mobile_code, [id^='login-full-panel-']"
      )
    );
  }

  function onSameOriginClick(e) {
    var t = e.target;
    /* Login wall: do not capture. Official closer must receive the click.
     * Live e2p at the「Douyin」title-end X: title DIV or closer svg/path,
     * not a logo <a>. Agreement / jingxuan links under the same card
     * still hit shouldHijackLeave if we fall through. */
    if (isLoginWallNode(t)) return;
    if (wantMobile() && isVideoPath() && t && t.closest) {
      var back = t.closest("a, button, [role='button']");
      if (back && !back.closest("#pcwtm-drawer") && !isOfficialSwitch(back) && !isLoginWallNode(back)) {
        var backLabel = labelOf(back);
        var href = back.href || back.getAttribute("href") || "";
        if (
          /^(返回|Back)$/i.test(backLabel) ||
          back.getAttribute("data-pcwtm-videoback") === "1" ||
          (href && isDumpDest(href) && !/^(精选|推荐|For You|Topick)$/i.test(backLabel))
        ) {
          e.preventDefault();
          e.stopPropagation();
          goRecommend();
          return;
        }
      }
    }
    var a = t && t.closest ? t.closest("a") : null;
    if (!a || !a.href) return;
    try {
      if (a.closest && a.closest("#pcwtm-drawer")) {
        if (isRecommendLabel(labelOf(a)) || destKey(a.href) === "recommend") {
          e.preventDefault();
          clearVideoMark();
          store(STAY_JX_KEY, null);
          goRecommend();
          return;
        }
        allowJingxuanNav();
        onNavigate();
        return;
      }
      if (shouldHijackLeave(a.href)) {
        if (isOfficialSwitch(a)) {
          onNavigate();
          return;
        }
        e.preventDefault();
        e.stopPropagation();
        goRecommend();
        return;
      }
      var u = new URL(a.href, location.href);
      if (u.origin !== location.origin) return;
      if (!wantMobile()) {
        onNavigate();
        return;
      }
      if (isRecommendLabel(labelOf(a)) || destKey(a.href) === "recommend") {
        e.preventDefault();
        clearVideoMark();
        store(STAY_JX_KEY, null);
        goRecommend();
        return;
      }
    } catch (err) {
      return;
    }
    onNavigate();
  }

  function startWatch() {
    connectSmallRoots();
    if (watching) return;
    watching = true;
    document.addEventListener("click", onSameOriginClick, true);
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
    document.removeEventListener("click", onSameOriginClick, true);
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = 0;
    }
  }

  bindLeaveHooks();
  rememberVideoPage();
  patchHistory();
  rewriteLanding();
  apply();
  sameTab();
  document.addEventListener("DOMContentLoaded", function () {
    persistVideoMark();
    if (recoverVideoBack()) return;
    schedule();
  });
  window.addEventListener("resize", schedule);
  window.addEventListener("orientationchange", function () {
    setTimeout(schedule, 250);
  });
})();
