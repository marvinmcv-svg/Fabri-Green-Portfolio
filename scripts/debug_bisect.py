#!/usr/bin/env python3
"""Bisect which element expands the mobile layout viewport to 559px."""
from playwright.sync_api import sync_playwright

HIDES = {
    "ghost-word": ".text-outline { display: none !important; }",
    "marquee": ".marquee-track { display: none !important; }",
    "glows": ".glow-volt, [class*='radial-gradient'] { display: none !important; }",
    "hero-h1": "h1 { display: none !important; }",
    "header": "header { display: none !important; }",
    "grain": ".grain::after { display: none !important; }",
    "toaster": "[data-sonner-toaster] { display: none !important; }",
}

def probe(page):
    return page.evaluate("({iw: innerWidth, cw: document.documentElement.clientWidth})")

with sync_playwright() as p:
    b = p.chromium.launch(headless=True)

    # --- A: JS disabled (pure CSS layout) ---
    ctx = b.new_context(viewport={"width": 390, "height": 844}, is_mobile=True, has_touch=True,
                        java_script_enabled=False)
    page = ctx.new_page()
    page.goto("http://localhost:3000", wait_until="load")
    page.wait_for_timeout(1500)
    print(f"JS-DISABLED:          {probe(page)}")
    ctx.close()

    # --- B: baseline + early commit measurement ---
    ctx = b.new_context(viewport={"width": 390, "height": 844}, is_mobile=True, has_touch=True)
    page = ctx.new_page()
    early = {"iw": None}
    page.on("commit", lambda: early.__setitem__("iw", None))
    page.goto("http://localhost:3000", wait_until="commit")
    try:
        page.wait_for_timeout(80)
        print(f"EARLY (commit+80ms):  {probe(page)}")
    except Exception as e:
        print(f"early probe failed: {e}")
    page.wait_for_timeout(2500)
    print(f"BASELINE (settled):   {probe(page)}")

    # --- C: hide suspects one at a time via addStyleTag + reload persistence ---
    for name, css in HIDES.items():
        p2 = ctx.new_page()
        p2.goto("http://localhost:3000", wait_until="load")
        p2.add_style_tag(content=css)
        p2.wait_for_timeout(300)
        r = probe(p2)
        # addStyleTag after load may be too late (viewport already expanded) — also try route-injected
        p2.close()
        print(f"HIDE {name:12s} (post-load): {r}")
    ctx.close()

    # --- D: route-level CSS injection (BEFORE page scripts run) ---
    ctx = b.new_context(viewport={"width": 390, "height": 844}, is_mobile=True, has_touch=True)
    for name, css in HIDES.items():
        page = ctx.new_page()
        page.route("**/*", lambda route: route.continue_())  # no-op to keep pipeline simple
        page.goto("http://localhost:3000", wait_until="commit")
        try:
            page.add_style_tag(content=css)
        except Exception:
            pass
        page.wait_for_timeout(2500)
        print(f"HIDE {name:12s} (commit-inject): {probe(page)}")
        page.close()
    ctx.close()
    b.close()
