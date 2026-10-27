#!/usr/bin/env python3
"""Confirm mechanism: does instant scroll (reduced motion => scroll-behavior:auto)
survive the menu exit animation? Also test post-close programmatic scroll."""
from playwright.sync_api import sync_playwright

SAMPLE = """new Promise(resolve => {
  const samples = [];
  const t0 = performance.now();
  const iv = setInterval(() => {
    samples.push(Math.round(scrollY));
    if (performance.now() - t0 > 2000) { clearInterval(iv); resolve(samples); }
  }, 100);
})"""


def menu_tap(pg):
    pg.locator("button[aria-label='Open menu']").tap()
    pg.wait_for_timeout(700)
    pg.locator("header [class*='lg:hidden'] a[href='#athletics']").first.tap()


def run(b, label, reduced=False, variant="plain"):
    ctx = b.new_context(viewport={"width": 390, "height": 844}, is_mobile=True, has_touch=True,
                        reduced_motion="reduce" if reduced else "no-preference")
    page = ctx.new_page()
    if variant == "instant-after":
        # simulate: tap closes menu; we then scroll instantly after 350ms (exit anim done)
        page.goto("http://localhost:3000", wait_until="load")
        page.wait_for_timeout(1800)
        page.locator("button[aria-label='Open menu']").tap()
        page.wait_for_timeout(700)
        page.locator("header [class*='lg:hidden'] a[href='#athletics']").first.tap()
        page.wait_for_timeout(350)  # let exit animation finish
        page.evaluate("document.getElementById('athletics').scrollIntoView({behavior: 'instant'})")
    elif variant == "smooth-after":
        page.goto("http://localhost:3000", wait_until="load")
        page.wait_for_timeout(1800)
        page.locator("button[aria-label='Open menu']").tap()
        page.wait_for_timeout(700)
        page.locator("header [class*='lg:hidden'] a[href='#athletics']").first.tap()
        page.wait_for_timeout(100)  # mid exit animation
        page.evaluate("document.getElementById('athletics').scrollIntoView({behavior: 'smooth'})")
    else:
        page.goto("http://localhost:3000", wait_until="load")
        page.wait_for_timeout(1800)
        menu_tap(page)
    samples = page.evaluate(SAMPLE)
    print(f"{label:56s} final={samples[-1]} samples={samples[:15]}")
    ctx.close()


with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    run(b, "reduced-motion ON (instant scroll), menu tap", reduced=True)
    run(b, "normal, scrollIntoView instant AFTER exit (350ms)", variant="instant-after")
    run(b, "normal, scrollIntoView smooth DURING exit (100ms)", variant="smooth-after")
    b.close()
