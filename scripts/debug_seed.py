#!/usr/bin/env python3
"""Find the seed element: disable all overflow-x clipping via CSS rewrite, then
enumerate every element whose natural width exceeds the viewport."""
import re
from playwright.sync_api import sync_playwright

FIND_WIDE = """
() => {
  const vw = document.documentElement.clientWidth;
  const wide = [];
  document.querySelectorAll('body *').forEach(el => {
    const cs = getComputedStyle(el);
    if (cs.display === 'none') return;
    const r = el.getBoundingClientRect();
    // natural width via scrollWidth of self (content), plus rect width
    if (r.width > vw + 1) {
      wide.push({
        tag: el.tagName,
        cls: String(el.className).slice(0, 60),
        w: Math.round(r.width),
        right: Math.round(r.right),
        pos: cs.position,
        txt: (el.textContent || '').trim().slice(0, 30),
      });
    }
  });
  return {vw, iw: innerWidth, sw: document.documentElement.scrollWidth, wide: wide.slice(0, 30)};
}
"""

with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    ctx = b.new_context(viewport={"width": 390, "height": 844}, is_mobile=True, has_touch=True)
    page = ctx.new_page()

    # Intercept every CSS response and strip overflow clipping
    def handle(route):
        resp = route.fetch()
        if route.request.url.endswith(".css") or "css" in (resp.headers.get("content-type") or ""):
            body = resp.text().replace("overflow-x:hidden", "overflow-x:visible")
            route.fulfill(status=resp.status, headers=resp.headers, body=body)
        else:
            route.fulfill(response=resp)

    page.route("**/*", handle)
    page.goto("http://localhost:3000", wait_until="load")
    page.wait_for_timeout(2500)
    res = page.evaluate(FIND_WIDE)
    print(f"vw={res['vw']}  innerWidth={res['iw']}  scrollWidth={res['sw']}")
    for e in res["wide"]:
        print(f"  {e['tag']:7} w={e['w']:>5} right={e['right']:>5} pos={e['pos']:8} {e['cls'][:55]}")
        print(f"          text={e['txt']!r}")
    b.close()
