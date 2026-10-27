#!/usr/bin/env python3
"""Deep-dive: header geometry at 390px with/without mobile emulation."""
from playwright.sync_api import sync_playwright

JS = """
() => {
  const h = document.querySelector('header');
  const cs = getComputedStyle(h);
  const nav = h.querySelector('nav');
  const navCS = getComputedStyle(nav);
  const ul = h.querySelector('ul'); // desktop links
  return {
    header: {
      rect: h.getBoundingClientRect().toJSON(),
      position: cs.position, left: cs.left, right: cs.right, width: cs.width,
      display: cs.display, transform: cs.transform,
      offsetParent: h.offsetParent ? h.offsetParent.tagName : null,
    },
    nav: {
      rect: nav.getBoundingClientRect().toJSON(),
      width: navCS.width, maxWidth: navCS.maxWidth, display: navCS.display,
      justify: navCS.justifyContent,
    },
    desktopUL: ul ? { display: getComputedStyle(ul).display,
                      rect: ul.getBoundingClientRect().toJSON(),
                      childCount: ul.children.length } : null,
    innerWidth: window.innerWidth,
    clientWidth: document.documentElement.clientWidth,
    visualViewport: window.visualViewport ? window.visualViewport.width : null,
    devicePixelRatio: window.devicePixelRatio,
  };
}
"""

with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    for label, is_mobile in [("MOBILE-EMULATION", True), ("REGULAR-CONTEXT", False)]:
        ctx = b.new_context(viewport={"width": 390, "height": 844}, is_mobile=is_mobile, has_touch=True)
        page = ctx.new_page()
        page.goto("http://localhost:3000", wait_until="load")
        page.wait_for_timeout(2000)
        r = page.evaluate(JS)
        print(f"\n===== {label} =====")
        print(f"innerWidth={r['innerWidth']}  clientWidth={r['clientWidth']}  "
              f"vv={r['visualViewport']}  dpr={r['devicePixelRatio']}")
        h = r["header"]
        print(f"header: pos={h['position']} left={h['left']} right={h['right']} "
              f"width={h['width']} transform={h['transform']} offsetParent={h['offsetParent']}")
        print(f"  rect: l={h['rect']['x']:.0f} r={h['rect']['x']+h['rect']['width']:.0f} w={h['rect']['width']:.0f}")
        n = r["nav"]
        print(f"nav: w={n['width']} maxW={n['maxWidth']} justify={n['justify']}")
        print(f"  rect: l={n['rect']['x']:.0f} r={n['rect']['x']+n['rect']['width']:.0f} w={n['rect']['width']:.0f}")
        u = r["desktopUL"]
        if u:
            print(f"desktop ul: display={u['display']} children={u['childCount']} "
                  f"rect_w={u['rect']['width']:.0f}")
        ctx.close()
    b.close()
