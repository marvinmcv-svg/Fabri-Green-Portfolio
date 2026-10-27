#!/usr/bin/env python3
"""Fine-grained diagnosis: does the scroll after menu-link tap ever start?
Compare: hero anchor via tap, menu link via tap, hash-only nav on mobile."""
from playwright.sync_api import sync_playwright

SAMPLE = """new Promise(resolve => {
  const samples = [];
  const t0 = performance.now();
  const iv = setInterval(() => {
    samples.push(Math.round(scrollY));
    if (performance.now() - t0 > 2500) { clearInterval(iv); resolve(samples); }
  }, 100);
})"""


def run(b, label, fn):
    ctx = b.new_context(viewport={"width": 390, "height": 844}, is_mobile=True, has_touch=True)
    page = ctx.new_page()
    page.goto("http://localhost:3000", wait_until="load")
    page.wait_for_timeout(1800)
    fn(page)
    samples = page.evaluate(SAMPLE)
    print(f"{label:44s} samples={samples[:26]}")
    ctx.close()


with sync_playwright() as p:
    b = p.chromium.launch(headless=True)

    run(b, "hero anchor '#athletics' via tap()", lambda pg: (
        pg.locator("#top a[href='#athletics']").first.tap()))

    def menu_tap(pg):
        pg.locator("button[aria-label='Open menu']").tap()
        pg.wait_for_timeout(700)
        pg.locator("header [class*='lg:hidden'] a[href='#athletics']").first.tap()
    run(b, "menu link '#athletics' via tap()", menu_tap)

    def menu_tap_contact(pg):
        pg.locator("button[aria-label='Open menu']").tap()
        pg.wait_for_timeout(700)
        pg.locator("header [class*='lg:hidden'] a[href='#contact']").last.tap()
    run(b, "menu link '#contact' via tap()", menu_tap_contact)

    def menu_click_again(pg):
        pg.locator("button[aria-label='Open menu']").tap()
        pg.wait_for_timeout(700)
        pg.locator("header [class*='lg:hidden'] a[href='#athletics']").first.tap()
        pg.wait_for_timeout(1200)
        # second attempt: open menu again and tap same link
        pg.locator("button[aria-label='Open menu']").tap()
        pg.wait_for_timeout(700)
        pg.locator("header [class*='lg:hidden'] a[href='#work']").first.tap()
    run(b, "menu twice (athletics then work)", menu_click_again)

    b.close()
