#!/usr/bin/env python3
"""Instrument scrollIntoView + track scroll attempts during menu link tap."""
from playwright.sync_api import sync_playwright

PATCH = """
() => {
  const orig = Element.prototype.scrollIntoView;
  window.__calls = [];
  window.__events = [];
  Element.prototype.scrollIntoView = function(...args) {
    window.__calls.push({id: this.id || this.tagName, behavior: args[0] && args[0].behavior, t: Math.round(performance.now())});
    try { return orig.apply(this, args); } catch (e) { window.__calls.push({error: String(e)}); }
  };
  const origST = window.scrollTo;
  window.scrollTo = function(...args) {
    window.__calls.push({type: 'window.scrollTo', args: JSON.stringify(args), t: Math.round(performance.now())});
    return origST.apply(this, args);
  };
  ['touchstart','touchend','click'].forEach(ev =>
    document.addEventListener(ev, () => window.__events.push({ev, t: Math.round(performance.now()), y: Math.round(scrollY)}), true));
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
    page.evaluate(PATCH)  # re-patch after re-render (menu mounted new nodes; patch survives on prototype)

    page.locator("header [class*='lg:hidden'] a[href='#athletics']").first.tap()
    page.wait_for_timeout(2500)

    out = page.evaluate("({calls: window.__calls, events: window.__events, y: Math.round(scrollY), hash: location.hash})")
    print("events:", out["events"][-8:])
    print("scroll calls:", out["calls"])
    print("final scrollY:", out["y"], " hash:", out["hash"])
    ctx.close()
    b.close()
