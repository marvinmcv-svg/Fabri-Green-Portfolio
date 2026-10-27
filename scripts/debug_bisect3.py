#!/usr/bin/env python3
"""Binary search WITHIN #highlights SSR HTML for the element that expands the
mobile layout viewport to 559px."""
import re
from playwright.sync_api import sync_playwright

OTHER = ["top", "about", "athletics", "community", "work", "independence", "gallery", "contact"]


def measure(b, mutations):
    """mutations: list of (pattern, replacement) applied to the HTML."""
    ctx = b.new_context(viewport={"width": 390, "height": 844}, is_mobile=True, has_touch=True)
    page = ctx.new_page()

    def handle(route):
        resp = route.fetch()
        ct = resp.headers.get("content-type", "")
        if "text/html" in ct:
            body = resp.text()
            # always strip scripts (static SSR) + all sections except highlights
            body = re.sub(r"<script.*?</script>", "", body, flags=re.S)
            for sid in OTHER:
                body = re.sub(rf'<section id="{sid}".*?</section>', "", body, flags=re.S)
            for pat, repl in mutations:
                body = re.sub(pat, repl, body, flags=re.S)
            route.fulfill(status=resp.status, headers=resp.headers, body=body)
        else:
            route.fulfill(response=resp)

    page.route("**/", handle)
    page.goto("http://localhost:3000/", wait_until="load")
    page.wait_for_timeout(1000)
    iw = page.evaluate("innerWidth")
    ctx.close()
    return iw


TESTS = [
    ("highlights only (baseline)", []),
    ("remove <video> tag", [(r"<video.*?</video>|<video[^>]*/?>", "")]),
    ("remove playlist grid", [(r'<div class="grid flex-1.*?</div>\s*</div>\s*</div>\s*</div>', "")]),
    ("video preload=none", [(r'(<video[^>]*?)preload="metadata"', r'\1preload="none"')]),
    ("video without aspect-video", [(r'(<video[^>]*?)aspect-video ', r"\1")]),
    ("video without w-full", [(r'(<video[^>]*?)w-full ', r"\1")]),
    ("video fixed width w-[300px]", [(r'(<video[^>]*?)aspect-video w-full', r"\1w-[300px]")]),
]

with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    for label, muts in TESTS:
        iw = measure(b, muts)
        print(f"{label:32s} -> innerWidth={iw}")
    b.close()
