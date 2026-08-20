(function () {
  "use strict";

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
