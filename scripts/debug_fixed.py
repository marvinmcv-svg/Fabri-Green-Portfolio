#!/usr/bin/env python3
"""Trace why the fixed header is 559px wide on a 390px viewport (containing-block bug)."""
from playwright.sync_api import sync_playwright

JS = """
() => {
  const header = document.querySelector('header');
  const info = { header: header.getBoundingClientRect().width, ancestors: [] };
  let el = header.parentElement;
  while (el && el !== document.documentElement) {
    const cs = getComputedStyle(el);
    info.ancestors.push({
      tag: el.tagName,
      cls: String(el.className).slice(0, 60),
      w: Math.round(el.getBoundingClientRect().width),
      transform: cs.transform !== 'none' ? cs.transform.slice(0, 40) : null,
      filter: cs.filter !== 'none' ? cs.filter : null,
      backdropFilter: cs.backdropFilter !== 'none' ? cs.backdropFilter : null,
      willChange: cs.willChange !== 'auto' ? cs.willChange : null,
      contain: cs.contain !== 'none' ? cs.contain : null,
      perspective: cs.perspective !== 'none' ? cs.perspective : null,
    });
    el = el.parentElement;
  }
  // any element with transform between body and header?
  info.mainW = document.querySelector('main') ? Math.round(document.querySelector('main').getBoundingClientRect().width) : null;
  return info;
}
"""

with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    ctx = b.new_context(viewport={"width": 390, "height": 844}, is_mobile=True, has_touch=True)
    page = ctx.new_page()
    page.goto("http://localhost:3000", wait_until="load")
    page.wait_for_timeout(2000)
    info = page.evaluate(JS)
    print(f"header width: {info['header']}  (viewport 390)   main width: {info['mainW']}")
    for a in info["ancestors"]:
        flags = {k: v for k, v in a.items() if v and k not in ("tag", "cls", "w")}
        print(f"  <{a['tag']}> w={a['w']}  {a['cls'][:50]}")
        if flags:
            print(f"      *** {flags}")
    b.close()
