# PCWebToMobile

别人许愿一个 PC 网站，做成手机 UI 的油猴脚本。你自己用浏览器装上，用的还是官网页面和功能，只是窄屏时换一套布局。

不是自动转换器，也不是 App。CSS 改布局，不抓内容。

## 许愿

打开 → [许愿](https://github.com/lxp-git/PCWebToMobile/issues/new?template=wish.yml)

填 PC 网址，和你真正会用的功能（首页、搜索、播放、评论…）。提交后会开始做脚本，做完在这条 Issue 里回安装方式。

## 已有脚本

| 站点 | 状态 | 下载 |
| --- | --- | --- |
| 哔哩哔哩 `www.bilibili.com` | 首页 + 播放页可用 | [下载页](sites/bilibili/) · [bilibili.user.js](sites/bilibili/bilibili.user.js) |
| 抖音 `www.douyin.com` | 首页上下滑 + 视频详情/评论 · 0.2.8 | [下载页](sites/douyin/) · [douyin.user.js](sites/douyin/douyin.user.js) |

### 怎么用（iOS Alook）

1. 打开上表的下载页，点「下载脚本」。
2. 把脚本全文复制到 [Alook](https://apps.apple.com/app/alook%E6%B5%8F%E8%A7%88%E5%99%A8/id1407852470) → 脚本，启用。
3. 用 Alook 打开对应网站的 **桌面版**（不要进 `m.*`）。

之后就是 PC 站的功能，手机的 UI。

`?pcwtm=1` 强制开，`?pcwtm=0` 强制关。宽屏桌面默认不改。

其它能装油猴的浏览器（Kiwi / Firefox / Edge Canary + Tampermonkey / Violentmonkey）也可以直接装 `.user.js`。

### 哔哩哔哩 0.1.0

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

### 抖音 0.2.8

已经能用：

- 推荐页入口是 `/?recommend=1&from_nav=1`（菜单「推荐 / For You」带上 `pcwtm`）。官网可能会改掉 `from_nav`，脚本只保证 `pcwtm` 还在
- 未登录登录墙：收掉左侧二维码列，把 `article#douyin_login_comp_flat_panel` 锁在视口宽里，官网关闭 X 留在屏内。没有另做关闭按钮
- 推荐竖滑：视频铺满屏，顶栏收掉，只留一层薄菜单；点赞/评论/收藏/分享仍是官网自己的控件
- 推荐流官方评论层：开/关仍是官网自己的；底栏不再 `overflow:hidden` 把官方侧栏的滚势夹死，列表能用手指/滚轮滚完。关层后竖滑还在。没有另造评论 UI
- 直接打开 `/video/:id` 后浏览器返回（以及官网「返回」）会落到精选电脑版。脚本在离开详情时记下，下一页若是 `/`、`/jingxuan` 或精选网格，就 `replace` 到 `/?recommend=1&from_nav=1`（带 `pcwtm`）。菜单里点「精选」仍去精选
- `/video/:id` 详情流滑到下一条时，评论开/关跟着当前条，不再钉死第一条的 `#videoSideCard` / `comment-list` / `feed-comment-icon`
- 未登录打开 `/` 现在常先落到精选：网格收成单列（精选本身不承诺）；要上下滑请点菜单里的「推荐」
- 抽屉打开才扫一遍导航链接（`textContent`），不再对 `document` 做 subtree MutationObserver，也不在每帧跑 `innerText`

搜索 / 直播 / 主页 / 电商 / 消息没有专门布局。已装过旧版的需要把脚本删掉再重新粘贴一遍。

改样式编 `sites/douyin/douyin.css`，改逻辑编 `sites/douyin/inject.js`，然后：

```bash
python3 sites/douyin/build.py
```

会重新生成可安装的 `douyin.user.js`。

## 原则

- **CSS 改布局，不抓内容。** 页面还是官网自己的 DOM 和功能。
- 油猴 / 插件优先；只有 CSS 搞不定的顽固站才上更强的脚本。
- 桌面宽屏不改；窄屏或手机 UA 才启用。
