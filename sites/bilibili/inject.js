(function () {
  "use strict";

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
