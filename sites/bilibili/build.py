#!/usr/bin/env python3
"""Embed bilibili.css into the Tampermonkey userscript."""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
HEADER = """\
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

"""


def main() -> None:
    css = ROOT.joinpath("bilibili.css").read_text(encoding="utf-8")
    inject = ROOT.joinpath("inject.js").read_text(encoding="utf-8")
    marker = '  "use strict";\n'
    if marker not in inject:
        raise SystemExit('inject.js missing "use strict"')
    body = inject.replace(
        marker,
        marker + "\n  window.__PCWTM_CSS__ = " + json.dumps(css) + ";\n",
        1,
    )
    ROOT.joinpath("bilibili.user.js").write_text(HEADER + body, encoding="utf-8")
    print("wrote", ROOT.joinpath("bilibili.user.js"))


if __name__ == "__main__":
    main()
