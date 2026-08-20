(function () {
  "use strict";

  // After first paint we do not observe document with subtree:true.
  // Watch #slidelist / #douyin-header (childList only), plus popstate,
  // same-origin clicks, and a 2s interval. Coalesce with one rAF.
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
    if (!isVideoPath() && !cameFromVideo()) return false;
    return isDumpDest(href);
  }

  function retargetOfficialVideoBack() {
    if (!isVideoPath() || !wantMobile()) return;
    var nodes = document.querySelectorAll("a[href], [data-e2e='video-detail'] a");
    var i;
    for (i = 0; i < nodes.length; i++) {
      var a = nodes[i];
      if (!a.href || !isDumpDest(a.href)) continue;
      if (a.closest && a.closest("#pcwtm-drawer")) continue;
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
    if (/精选电脑版/.test(document.title || "")) return true;
    if (
      document.querySelector(
        ".jingxuan-scroll-element, .jingxuanFeedList, .discover-tab-bar, .discover-tab-container"
      )
    )
      return true;
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

  /* Cold /video/:id + browser Back: write the mark at document-start and
   * again on pagehide. Recover must not wait for apply() / wantMobile(). */
  function persistVideoMark() {
    if (!isVideoPath()) return;
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
    store(ON_VIDEO_KEY, null);
    store(RECOVER_N_KEY, null);
    if (load(LAST_KIND_KEY) === "video") store(LAST_KIND_KEY, "recommend");
  }

  function allowJingxuanNav() {
    store(ON_VIDEO_KEY, null);
    store(RECOVER_N_KEY, null);
    store(LAST_KIND_KEY, "jingxuan");
    store(STAY_JX_KEY, "1");
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
    if (isVideoPath()) {
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

  function patchHistory() {
    if (historyPatched) return;
    historyPatched = true;
    var push = history.pushState;
    var replace = history.replaceState;
    history.pushState = function (state, title, url) {
      if (url != null && shouldHijackLeave(url)) url = recommendHref();
      var ret = push.call(this, state, title, url == null ? url : decorateHref(url));
      setTimeout(recoverVideoBack, 0);
      setTimeout(recoverVideoBack, 300);
      return ret;
    };
    history.replaceState = function (state, title, url) {
      if (url != null && shouldHijackLeave(url)) url = recommendHref();
      var ret = replace.call(this, state, title, url == null ? url : decorateHref(url));
      setTimeout(recoverVideoBack, 0);
      setTimeout(recoverVideoBack, 300);
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
    if (video) rememberVideoPage();
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

  /* Live: official close sets #videoSideCard/#videoSideBar width to 0 but
   * leaves #relatedVideoCard and [data-e2e=comment-list] in the DOM.
   * Peek without our sheet class so offsetWidth is the host's, not ours. */
  function officialCommentPanel() {
    var root = document.documentElement;
    var held = root.classList.contains("pcwtm-comments");
    if (held) root.classList.remove("pcwtm-comments");
    var card = document.getElementById("videoSideCard");
    var bar = document.getElementById("videoSideBar");
    var cw = card ? card.offsetWidth : 0;
    var bw = bar ? bar.offsetWidth : 0;
    var panel = null;
    if (cw >= bw && cw > 48) panel = card;
    else if (bw > 48) panel = bar;
    if (held) root.classList.add("pcwtm-comments");
    return panel;
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

  function findRailCommentChip() {
    var icon = document.querySelector("[data-e2e='feed-comment-icon']");
    if (!icon) return null;
    var scope = icon.parentElement && icon.parentElement.parentElement;
    if (!scope) scope = document.body;
    var nodes = scope.querySelectorAll("button, [role='button'], div, span");
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
        if (
          !t.closest(
            "#videoSideCard, #videoSideBar, [data-e2e='feed-comment-icon'], #sliderVideo, .xgplayer, .positionBox"
          )
        )
          return;
        setTimeout(syncCommentSheet, 50);
        setTimeout(syncCommentSheet, 250);
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

  function syncCommentSheet() {
    var panel = officialCommentPanel();
    document.documentElement.classList.toggle("pcwtm-comments", !!panel);
    if (!panel) {
      var leftover = document.querySelectorAll("." + HOST_CLOSE_CLASS + ", .pcwtm-sheet-panel");
      var i;
      for (i = 0; i < leftover.length; i++) {
        leftover[i].classList.remove(HOST_CLOSE_CLASS, "pcwtm-sheet-panel");
      }
      return;
    }
    ["videoSideCard", "videoSideBar"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.classList.toggle("pcwtm-sheet-panel", el === panel);
    });
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
    if (recoverVideoBack()) return;
    var on = syncMode();
    if (on) {
      ensureChrome();
      startWatch();
      syncCommentSheet();
      rememberVideoPage();
      retargetOfficialVideoBack();
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
    ["slidelist", "douyin-header", "videoSideCard", "videoSideBar"].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el || observedRoots.indexOf(el) !== -1) return;
      var obs = new MutationObserver(schedule);
      var opts = { childList: true };
      if (id === "videoSideCard" || id === "videoSideBar") {
        opts.attributes = true;
        opts.attributeFilter = ["style", "class"];
      }
      obs.observe(el, opts);
      rootObservers.push(obs);
      observedRoots.push(el);
    });
  }

  function onNavigate() {
    schedule();
    setTimeout(schedule, 400);
  }

  function onPopState() {
    persistVideoMark();
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
      if (!isVideoPath() && !cameFromVideo()) return;
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

  function onSameOriginClick(e) {
    var t = e.target;
    if (wantMobile() && isVideoPath() && t && t.closest) {
      var back = t.closest("a, button, [role='button']");
      if (back && !back.closest("#pcwtm-drawer")) {
        var backLabel = labelOf(back);
        var href = back.href || back.getAttribute("href") || "";
        if (
          /^(返回|Back|关闭)$/i.test(backLabel) ||
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
