#!/usr/bin/env python3
"""Embed douyin.css into the Tampermonkey userscript."""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
HEADER = """\
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

"""


def main() -> None:
    css = ROOT.joinpath("douyin.css").read_text(encoding="utf-8")
    inject = ROOT.joinpath("inject.js").read_text(encoding="utf-8")
    marker = '  "use strict";\n'
    if marker not in inject:
        raise SystemExit('inject.js missing "use strict"')
    body = inject.replace(
        marker,
        marker + "\n  window.__PCWTM_CSS__ = " + json.dumps(css) + ";\n",
        1,
    )
    ROOT.joinpath("douyin.user.js").write_text(HEADER + body, encoding="utf-8")
    print("wrote", ROOT.joinpath("douyin.user.js"))


if __name__ == "__main__":
    main()
