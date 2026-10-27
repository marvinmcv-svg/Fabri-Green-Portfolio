#!/usr/bin/env python3
"""Is the 559px layout viewport a site bug or a mobile-emulation artifact?"""
from playwright.sync_api import sync_playwright

SIMPLE = """<!DOCTYPE html>
<html><head><meta name="viewport" content="width=device-width, initial-scale=1">
<style>body{margin:0;font-family:sans-serif}</style></head>
<body><p>Hello world</p></body></html>"""

WIDE = """<!DOCTYPE html>
<html><head><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body><div style="width:559px;height:10px;background:red"></div></body></html>"""

with sync_playwright() as p:
    b = p.chromium.launch(headless=True)

    def probe(url, w=390, html=None):
        ctx = b.new_context(viewport={"width": w, "height": 844}, is_mobile=True, has_touch=True)
        page = ctx.new_page()
        if html:
            page.route("**/test.html", lambda r: r.fulfill(
                content_type="text/html", body=html))
            page.goto("http://localhost/test.html")
        else:
            page.goto(url, wait_until="load", timeout=20000)
        page.wait_for_timeout(800)
        r = page.evaluate("({iw: innerWidth, cw: document.documentElement.clientWidth})")
        ctx.close()
        return r

    print(f"about:blank  390: {probe('about:blank')}")
    print(f"example.com 390: {probe('https://example.com')}")
    print(f"simple html 390: {probe(None, html=SIMPLE)}")
    print(f"wide-559 html390: {probe(None, html=WIDE)}  <- should show iw=559 if shrink-to-fit")
    print(f"site         360: {probe('http://localhost:3000', w=360)}")
    print(f"site         414: {probe('http://localhost:3000', w=414)}")
    print(f"site         320: {probe('http://localhost:3000', w=320)}")
    b.close()
