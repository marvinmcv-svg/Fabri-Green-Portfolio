#!/usr/bin/env python3
"""Bisect: strip sections from SSR HTML (JS disabled) to find which one expands
the mobile layout viewport to 559px."""
import re
from playwright.sync_api import sync_playwright

SECTIONS = ["top", "about", "athletics", "community", "work",
            "independence", "highlights", "gallery", "contact"]

def get_iw(b, strip_ids=None, strip_extra=None):
    ctx = b.new_context(viewport={"width": 390, "height": 844}, is_mobile=True,
                        has_touch=True, java_script_enabled=False)
    page = ctx.new_page()

    def handle(route):
        resp = route.fetch()
        ct = resp.headers.get("content-type", "")
        if "text/html" in ct:
            body = resp.text()
            for sid in (strip_ids or []):
                body = re.sub(rf'<section id="{sid}".*?</section>', "", body, flags=re.S)
            for pat in (strip_extra or []):
                body = re.sub(pat, "", body, flags=re.S)
            route.fulfill(status=resp.status, headers=resp.headers, body=body)
        else:
            route.fulfill(response=resp)

    page.route("**/", handle)
    page.goto("http://localhost:3000/", wait_until="load")
    page.wait_for_timeout(1200)
    iw = page.evaluate("0") if False else None
    # JS is disabled: get innerWidth via screenshot-free trick -> use layout via
    # elementFromPoint? Simplest: re-enable JS in a second pass. Instead, measure
    # with JS enabled context but strip <script> tags from HTML too (kills React hydration).
    ctx.close()
    return iw

def measure(b, strip_ids=None, strip_scripts=False, strip_extra=None):
    """JS enabled (for evaluate) but scripts stripped from HTML => static page."""
    ctx = b.new_context(viewport={"width": 390, "height": 844}, is_mobile=True, has_touch=True)
    page = ctx.new_page()

    def handle(route):
        resp = route.fetch()
        ct = resp.headers.get("content-type", "")
        if "text/html" in ct:
            body = resp.text()
            for sid in (strip_ids or []):
                body = re.sub(rf'<section id="{sid}".*?</section>', "", body, flags=re.S)
            if strip_scripts:
                body = re.sub(r"<script.*?</script>", "", body, flags=re.S)
            for pat in (strip_extra or []):
                body = re.sub(pat, "", body, flags=re.S)
            route.fulfill(status=resp.status, headers=resp.headers, body=body)
        else:
            route.fulfill(response=resp)

    page.route("**/", handle)
    page.goto("http://localhost:3000/", wait_until="load")
    page.wait_for_timeout(1000)
    iw = page.evaluate("innerWidth")
    ctx.close()
    return iw

with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    base = measure(b, strip_scripts=True)
    print(f"BASELINE (scripts stripped, all sections): {base}")

    if base != 390:
        for sid in SECTIONS:
            iw = measure(b, strip_ids=[sid], strip_scripts=True)
            marker = "  <<< CULPRIT" if iw == 390 else ""
            print(f"strip #{sid:<13} -> innerWidth={iw}{marker}")
    b.close()
