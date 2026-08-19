# PCWebToMobile

在中国大陆，甚至国际上，App是越做越大，iOS的tiktok居然有 958mb，但是大部分用的仅仅是它的几个小功能而已。特别我自己刷B站视频，在bilibili白色图标的版本下架后，我还是一直用这个旧版本，但是最近这个版本也是被彻底更新为国内版本了，没有了以前的简洁，加入了一堆毫无意义的功能。

所以我想，现在这些 App 的 mobile 版本几乎已经不太可用了，或者体验很差，所以我干脆做一个 简易浏览器或者插件，优先考虑插件或者油猴脚本等等，将 PC 端的网页版转换为移动版，让用户可以在移动设备上使用这些 App 的网页版功能。这里有个核心点就是：我不是去抓它的内容的，我本质上还是给它做一套css样式。只有在哪些非常顽固的网页里面才会考虑使用更强力的插件能力。

## 原则

- **CSS 改布局，不抓内容。** 页面还是官网自己的 DOM 和功能。
- 油猴 / 插件优先；只有 CSS 搞不定的顽固站才上更强的脚本。
- 桌面宽屏不改；窄屏或手机 UA 才启用。`?pcwtm=1` 强制开，`?pcwtm=0` 强制关。

## 站点

| 站点 | 状态 | 文件 |
| --- | --- | --- |
| 哔哩哔哩 `www.bilibili.com` | 首页 + 播放页可用的第一版 | `sites/bilibili/` |

### 哔哩哔哩 0.1.0

已经能用：

- 首页：去掉 1100px 锁宽，顶栏搜索 + 头像 + 菜单，分区横滑，双列推荐
- 播放页：播放器全宽 16:9，点赞投币收藏分享、评论、弹幕输入都还在
- 菜单抽屉里仍能进历史、动态、投稿、创作中心等 PC 功能
- 站内链接尽量同页打开，不新开标签

还没专门做：搜索结果页、空间、动态、直播、番剧播放页（脚本会挂上，但只有全局去 min-width）。

手机浏览器请开「桌面版网站」，否则 B 站可能直接跳 `m.bilibili.com`。

## 安装

1. 手机用 Kiwi / Firefox / Edge Canary 等能装扩展的浏览器；装 [Tampermonkey](https://www.tampermonkey.net/) 或 Violentmonkey。
2. 打开 `sites/bilibili/bilibili.user.js` 安装。
3. 访问 [https://www.bilibili.com/](https://www.bilibili.com/)，开桌面版。

改样式编 `sites/bilibili/bilibili.css`，改逻辑编 `sites/bilibili/inject.js`，然后：

```bash
python3 sites/bilibili/build.py
```

会重新生成可安装的 `bilibili.user.js`。

## 接着做

- 搜索页 / 空间 / 动态的布局
- 播放器全屏、分 P、番剧
- 真机装脚本走一遍刷首页 → 搜 → 看 → 评论
