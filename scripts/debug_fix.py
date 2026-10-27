#!/usr/bin/env python3
"""Test minimal fixes for the playlist grid blowout (min-width:auto grid items
+ nowrap truncate content = 559px min-content on mobile)."""
import re
from playwright.sync_api import sync_playwright

OTHER = ["top", "about", "athletics", "community", "work", "independence", "gallery", "contact"]


def measure(b, label, mutations):
    ctx = b.new_context(viewport={"width": 390, "height": 844}, is_mobile=True, has_touch=True)
    page = ctx.new_page()

    def handle(route):
        resp = route.fetch()
        ct = resp.headers.get("content-type", "")
        if "text/html" in ct:
            body = resp.text()
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
    print(f"{label:52s} -> innerWidth={iw}")
    return iw


with sync_playwright() as p:
    b = p.chromium.launch(headless=True)

    # The playlist button SSR class string (from highlights.tsx):
    # 'group flex w-full items-center gap-4 rounded-2xl border p-3 text-left ...'
    # The inner text wrapper: 'min-w-0 flex-1'
    # The Reveal wrapper renders <div class="" style="opacity:0;transform:...">

    measure(b, "A: min-w-0 on playlist grid container", [
        (r'<div class="grid flex-1 gap-3', '<div class="grid min-w-0 flex-1 gap-3'),
    ])
    measure(b, "B: min-w-0 on button (flex container)", [
        (r'(group flex w-full items-center gap-4)', r'group flex w-full min-w-0 items-center gap-4'),
    ])
    measure(b, "C: min-w-0 on Reveal grid items (style= anchors)", [
        # Reveal wrappers inside the playlist have style="opacity:0;transform:translateY(8px)"
        (r'<div class="" style="opacity:0;transform:translateY\(8px\)">',
         '<div class="min-w-0" style="opacity:0;transform:translateY(8px)">'),
    ])
    measure(b, "D: B + C combined", [
        (r'(group flex w-full items-center gap-4)', r'group flex w-full min-w-0 items-center gap-4'),
        (r'<div class="" style="opacity:0;transform:translateY\(8px\)">',
         '<div class="min-w-0" style="opacity:0;transform:translateY(8px)">'),
    ])
    b.close()
