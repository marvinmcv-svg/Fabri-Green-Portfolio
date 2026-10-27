#!/usr/bin/env python3
"""Debug: (1) bisect INSIDE #community for the 374px seed at 320px;
(2) check which element scrolls (window vs body) after hash nav on mobile."""
import re
from playwright.sync_api import sync_playwright

OTHER = ["top", "about", "athletics", "work", "independence", "highlights", "gallery", "contact"]


def measure_community(b, label, mutations):
    ctx = b.new_context(viewport={"width": 320, "height": 568}, is_mobile=True, has_touch=True)
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
    page.wait_for_timeout(900)
    iw = page.evaluate("innerWidth")
    ctx.close()
    print(f"{label:48s} -> innerWidth={iw}")
    return iw


def scroll_debug(b):
    print("\n--- scroll container debug at 390 ---")
    ctx = b.new_context(viewport={"width": 390, "height": 844}, is_mobile=True, has_touch=True)
    page = ctx.new_page()
    page.goto("http://localhost:3000", wait_until="load")
    page.wait_for_timeout(2000)
    print("computed overflow:",
          page.evaluate("() => ({html: getComputedStyle(document.documentElement).overflow, body: getComputedStyle(document.body).overflow, bodyX: getComputedStyle(document.body).overflowX})"))
    print("scrollingElement:", page.evaluate("document.scrollingElement.tagName"))
    # A: plain hash nav via JS
    page.evaluate("location.hash = '#athletics'")
    page.wait_for_timeout(1500)
    print("after location.hash:", page.evaluate(
        "({win: Math.round(scrollY), docEl: Math.round(document.documentElement.scrollTop), body: Math.round(document.body.scrollTop), se: Math.round(document.scrollingElement.scrollTop)})"))
    page.evaluate("history.replaceState(null,'','#'); window.scrollTo(0,0)")
    page.wait_for_timeout(400)
    # B: click hero anchor (no menu involved)
    page.locator("#top a[href='#athletics']").first.click()
    page.wait_for_timeout(1500)
    print("after hero anchor click:", page.evaluate(
        "({win: Math.round(scrollY), body: Math.round(document.body.scrollTop)})"))
    page.evaluate("history.replaceState(null,'','#'); window.scrollTo(0,0)")
    page.wait_for_timeout(400)
    # C: menu link click
    page.locator("button[aria-label='Open menu']").click()
    page.wait_for_timeout(600)
    page.locator("header [class*='lg:hidden'] a[href='#athletics']").first.click()
    page.wait_for_timeout(1500)
    print("after menu link click:", page.evaluate(
        "({win: Math.round(scrollY), body: Math.round(document.body.scrollTop)})"))
    ctx.close()


with sync_playwright() as p:
    b = p.chromium.launch(headless=True)

    print("--- community inner bisect at 320 ---")
    measure_community(b, "community baseline", [])
    measure_community(b, "remove commitments ul", [
        (r"<ul class=\"mt-5 divide-y.*?</ul>", "")])
    measure_community(b, "remove impact card Reveal", [
        (r"<div class=\"flex h-full flex-col justify-between.*?</Reveal>", "")])
    measure_community(b, "remove photo grid (left col)", [
        (r'<div class="grid grid-cols-2 gap-4.*?</Reveal>\s*</div>', "")])
    measure_community(b, "remove ghost numeral 02", [
        (r'<span[^>]*text-outline[^>]*>\s*02\s*</span>', "")])
    measure_community(b, "commitments: no nowrap", [
        (r'whitespace-nowrap', "")])

    scroll_debug(b)
    b.close()
