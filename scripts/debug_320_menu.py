#!/usr/bin/env python3
"""Debug: (1) which section seeds the 374px overflow at 320px;
(2) why mobile menu link click doesn't scroll at 390px."""
import re
from playwright.sync_api import sync_playwright

SECTIONS = ["top", "about", "athletics", "community", "work", "independence",
            "highlights", "gallery", "contact"]


def bisect(b):
    print("\n--- 1. Section bisect at 320x568 (scripts stripped) ---")

    def measure(strip_ids):
        ctx = b.new_context(viewport={"width": 320, "height": 568}, is_mobile=True, has_touch=True)
        page = ctx.new_page()

        def handle(route):
            resp = route.fetch()
            ct = resp.headers.get("content-type", "")
            if "text/html" in ct:
                body = resp.text()
                body = re.sub(r"<script.*?</script>", "", body, flags=re.S)
                for sid in strip_ids:
                    body = re.sub(rf'<section id="{sid}".*?</section>', "", body, flags=re.S)
                route.fulfill(status=resp.status, headers=resp.headers, body=body)
            else:
                route.fulfill(response=resp)

        page.route("**/", handle)
        page.goto("http://localhost:3000/", wait_until="load")
        page.wait_for_timeout(900)
        iw = page.evaluate("innerWidth")
        ctx.close()
        return iw

    base = measure([])
    print(f"baseline innerWidth={base}")
    if base == 320:
        print("no overflow at 320 — nothing to bisect")
        return
    for sid in SECTIONS:
        iw = measure([sid])
        mark = "  <<< CULPRIT" if iw == 320 else ""
        print(f"strip #{sid:<13} -> {iw}{mark}")


def menu_debug(b):
    print("\n--- 2. Mobile menu link scroll trace at 390x844 ---")
    ctx = b.new_context(viewport={"width": 390, "height": 844}, is_mobile=True, has_touch=True)
    page = ctx.new_page()
    page.goto("http://localhost:3000", wait_until="load")
    page.wait_for_timeout(2000)
    page.locator("button[aria-label='Open menu']").click()
    page.wait_for_timeout(700)
    link = page.locator("header [class*='lg:hidden'] a[href='#athletics']")
    print(f"link count={link.count()} visible={link.first.is_visible() if link.count() else None}")
    link.first.click()
    for i in range(10):
        page.wait_for_timeout(300)
        state = page.evaluate("({y: Math.round(scrollY), hash: location.hash})")
        print(f"  t+{(i+1)*300}ms: {state}")
    ctx.close()


with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    bisect(b)
    menu_debug(b)
    b.close()
