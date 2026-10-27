#!/usr/bin/env python3
"""Corrected fix tests for the playlist grid mobile blowout."""
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
    print(f"{label:56s} -> innerWidth={iw}")
    return iw


with sync_playwright() as p:
    b = p.chromium.launch(headless=True)

    measure(b, "E: min-w-0 on ALL Reveal wrappers", [
        (r'<div style="opacity:0;transform:translateY\(28px\)"',
         '<div class="min-w-0" style="opacity:0;transform:translateY(28px)"'),
    ])
    measure(b, "F: overflow-hidden on ALL Reveal wrappers", [
        (r'<div style="opacity:0;transform:translateY\(28px\)"',
         '<div class="overflow-hidden" style="opacity:0;transform:translateY(28px)"'),
    ])
    measure(b, "G: min-w-0 on playlist column (flex flex-col gap-3)", [
        (r'<div class="flex flex-col gap-3">', '<div class="flex min-w-0 flex-col gap-3">'),
    ])
    measure(b, "I: overflow-hidden on button", [
        (r'(group flex w-full items-center gap-4)', r'group flex w-full overflow-hidden items-center gap-4'),
    ])
    measure(b, "J: captions wrap (no truncate) [confirms cause]", [
        (r'block truncate', 'block'),
    ])
    measure(b, "K: E + G combined", [
        (r'<div style="opacity:0;transform:translateY\(28px\)"',
         '<div class="min-w-0" style="opacity:0;transform:translateY(28px)"'),
        (r'<div class="flex flex-col gap-3">', '<div class="flex min-w-0 flex-col gap-3">'),
    ])
    b.close()
