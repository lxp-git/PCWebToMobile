# PCWebToMobile

别人许愿一个 PC 网站，做成手机 UI 的油猴脚本。你自己用浏览器装上，用的还是官网页面和功能，只是窄屏时换一套布局。

不是自动转换器，也不是 App。CSS 改布局，不抓内容。

## 许愿

打开 → [许愿](https://github.com/lxp-git/PCWebToMobile/issues/new?template=wish.yml)

填 PC 网址，和你真正会用的功能（首页、搜索、播放、评论…）。提交后会开始做脚本，做完在这条 Issue 里回安装方式。

## 已有脚本

| 站点 | 状态 | 安装 |
| --- | --- | --- |
| 哔哩哩哩 `www.bilibili.com` | 首页 + 播放页可用 | [bilibili.user.js](https://github.com/lxp-git/PCWebToMobile/raw/master/sites/bilibili/bilibili.user.js) |

### 怎么装

1. 手机用 Kiwi / Firefox / Edge Canary 等能装扩展的浏览器，装 [Tampermonkey](https://www.tampermonkey.net/) 或 Violentmonkey。
2. 打开上表里的 `.user.js`，按提示安装。
3. 访问对应网站时开「桌面版网站」，否则很多站会直接跳到 `m.*`，脚本挂不上。

`?pcwtm=1` 强制开，`?pcwtm=0` 强制关。宽屏桌面默认不改。

### 哔哩哩哩 0.1.0

已经能用：

- 首页：去掉 1100px 锁宽，顶栏搜索 + 头像 + 菜单，分区横滑，双列推荐
- 播放页：播放器全宽 16:9，点赞投币收藏分享、评论、弹幕输入都还在
- 菜单抽屉里仍能进历史、动态、投稿、创作中心等 PC 功能
- 站内链接尽量同页打开，不新开标签

还没专门做：搜索结果页、空间、动态、直播、番剧播放页（脚本会挂上，但只有全局去 min-width）。

改样式编 `sites/bilibili/bilibili.css`，改逻辑编 `sites/bilibili/inject.js`，然后：

```bash
python3 sites/bilibili/build.py
```

会重新生成可安装的 `bilibili.user.js`。

## 原则

- **CSS 改布局，不抓内容。** 页面还是官网自己的 DOM 和功能。
- 油猴 / 插件优先；只有 CSS 搞不定的顽固站才上更强的脚本。
- 桌面宽屏不改；窄屏或手机 UA 才启用。
