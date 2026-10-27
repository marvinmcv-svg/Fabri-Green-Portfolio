#!/usr/bin/env python3
"""Capture the stack trace of the mystery window.scrollTo(0,0) call."""
from playwright.sync_api import sync_playwright

PATCH = """
() => {
  const orig = Element.prototype.scrollIntoView;
  window.__stacks = [];
  window.scrollTo = function(...args) {
    window.__stacks.push({args: JSON.stringify(args), stack: new Error().stack.split('\\n').slice(1, 8).join(' | ')});
    return orig.apply(this, args);
  };
  Element.prototype.scrollIntoView = function(...args) {
    window.__stacks.push({into: this.id, stack: new Error().stack.split('\\n').slice(1, 8).join(' | ')});
    return orig.apply(this, args);
  };
}
"""

with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    ctx = b.new_context(viewport={"width": 390, "height": 844}, is_mobile=True, has_touch=True)
    page = ctx.new_page()
    page.goto("http://localhost:3000", wait_until="load")
    page.wait_for_timeout(2200)
    page.evaluate(PATCH)
    page.locator("button[aria-label='Open menu']").tap()
    page.wait_for_timeout(700)
    page.locator("header [class*='lg:hidden'] a[href='#athletics']").first.tap()
    page.wait_for_timeout(1500)
    stacks = page.evaluate("window.__stacks")
    for i, s in enumerate(stacks):
        print(f"--- call {i}: {s.get('args') or s.get('into')}")
        print(f"    {s['stack']}")
    print("final y:", page.evaluate("Math.round(scrollY)"))
    ctx.close()
    b.close()
