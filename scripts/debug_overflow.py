#!/usr/bin/env python3
"""Diagnose mobile horizontal overflow: find elements wider than viewport."""
from playwright.sync_api import sync_playwright

JS = """
() => {
  const vw = document.documentElement.clientWidth;
  const out = [];
  const clippedBy = (el) => {
    let p = el.parentElement;
    while (p && p !== document.body && p !== document.documentElement) {
      const o = getComputedStyle(p);
      if (o.overflowX === 'hidden' || o.overflowX === 'clip') return p.tagName + '.' + String(p.className).slice(0,40);
      p = p.parentElement;
    }
    return null;
  };
  document.querySelectorAll('body *').forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) return;
    if (r.right > vw + 1 || r.left < -2) {
      out.push({
        tag: el.tagName,
        cls: String(el.className).slice(0, 70),
        left: Math.round(r.left), right: Math.round(r.right), w: Math.round(r.width),
        clipped: clippedBy(el),
        text: (el.textContent || '').trim().slice(0, 25),
        parentCls: el.parentElement ? String(el.parentElement.className).slice(0, 50) : '',
      });
    }
  });
  return {vw, sw: document.documentElement.scrollWidth, out: out.slice(0, 25)};
}
"""

with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    ctx = b.new_context(viewport={"width": 390, "height": 844}, is_mobile=True, has_touch=True)
    page = ctx.new_page()
    page.goto("http://localhost:3000", wait_until="load")
    page.wait_for_timeout(2500)
    res = page.evaluate(JS)
    print(f"viewport={res['vw']}  scrollWidth={res['sw']}  (overflow {res['sw']-res['vw']}px)")
    print(f"{'TAG':6} {'L':>5} {'R':>5} {'W':>5}  CLIPPED-BY / CLASS / TEXT")
    for e in res["out"]:
        print(f"{e['tag']:6} {e['left']:>5} {e['right']:>5} {e['w']:>5}  clip={e['clipped']}")
        print(f"        cls: {e['cls']}")
        print(f"        parent: {e['parentCls']}  text: {e['text']!r}")
    # also check if page can actually be scrolled horizontally
    scrollable = page.evaluate("""() => {
      window.scrollTo(50, 0);
      const x = window.scrollX;
      window.scrollTo(0, 0);
      return x;
    }""")
    print(f"\nactual horizontal scroll offset after scrollTo(50,0): {scrollable} "
          f"({'CAN SCROLL - REAL BUG' if scrollable > 0 else 'clipped, not user-scrollable'})")
    b.close()
