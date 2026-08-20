(function () {
  "use strict";

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
        '#douyin-header input[data-e2e="searchbar-input"], #douyin-header input[type="search"], #douyin-header input[type="text"]'
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
        '#douyin-header input[data-e2e="searchbar-input"], #douyin-header input[type="search"], #douyin-header input[type="text"]'
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
