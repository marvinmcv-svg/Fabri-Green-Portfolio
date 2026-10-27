#!/usr/bin/env python3
"""
End-to-end Playwright screen test for Fabrizio Saunero's portfolio.
Covers: structure, CSS overrides/stacking, interactions, mobile optimization.
"""

import json
import os
import sys
import time
from playwright.sync_api import sync_playwright

BASE = "http://localhost:3000"
SHOT_DIR = "/home/z/my-project/scripts/e2e-shots"
os.makedirs(SHOT_DIR, exist_ok=True)

RESULTS = []  # (category, name, status, detail)
CONSOLE_ERRORS = []
FAILED_REQUESTS = []


def record(cat, name, ok, detail=""):
    RESULTS.append({"cat": cat, "name": name, "ok": bool(ok), "detail": str(detail)[:300]})
    flag = "PASS" if ok else "FAIL"
    print(f"  [{flag}] {cat} :: {name}" + (f"  -> {detail}" if (detail and not ok) else ""))


def attach_listeners(page):
    page.on("console", lambda m: CONSOLE_ERRORS.append(m.text) if m.type == "error" else None)
    page.on("pageerror", lambda e: CONSOLE_ERRORS.append(f"pageerror: {e}"))
    page.on("requestfailed", lambda r: FAILED_REQUESTS.append(f"{r.url} :: {r.failure}"))
    page.on("response", lambda r: FAILED_REQUESTS.append(f"{r.status} {r.url}")
            if r.status >= 400 and "favicon" not in r.url else None)


# ---------- shared JS snippets ----------

JS_NO_H_OVERFLOW = """
() => {
  const doc = document.documentElement;
  const sw = doc.scrollWidth, cw = doc.clientWidth;
  const offenders = [];
  if (sw > cw + 1) {
    const vw = cw;
    const inClipped = (el) => {
      let p = el.parentElement;
      while (p) {
        const o = getComputedStyle(p).overflowX;
        if (o === 'hidden' || o === 'clip' || o === 'auto' || o === 'scroll') return true;
        p = p.parentElement;
      }
      return false;
    };
    document.querySelectorAll('body *').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) return;
      if ((r.right > vw + 1 || r.left < -2) && !inClipped(el) && !el.closest('[aria-hidden="true"]')) {
        offenders.push(el.tagName + '.' + String(el.className).split(' ').slice(0,3).join('.') +
          ` [left=${Math.round(r.left)},right=${Math.round(r.right)}]` + ' txt:' + (el.textContent||'').trim().slice(0,30));
      }
    });
  }
  return {sw, cw, offenders: offenders.slice(0, 8)};
}
"""

JS_CLICK_INTERCEPTION = """
() => {
  const bad = [];
  const interactives = document.querySelectorAll('a[href], button:not([aria-hidden="true"])');
  interactives.forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return;
    // skip elements not currently in viewport
    if (r.bottom < 0 || r.top > innerHeight) return;
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const hit = document.elementFromPoint(cx, cy);
    if (!hit) return;
    let chain = hit, covered = true;
    while (chain) {
      if (chain === el) { covered = false; break; }
      chain = chain.parentElement;
    }
    if (covered) {
      bad.push({
        el: el.tagName + ':' + (el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 25),
        coveredBy: hit.tagName + '.' + String(hit.className).split(' ').slice(0, 2).join('.'),
      });
    }
  });
  return bad.slice(0, 10);
}
"""

JS_TAP_TARGETS = """
() => {
  const bad = [];
  document.querySelectorAll('a[href], button').forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return;
    if (r.bottom < 0 || r.top > innerHeight) return;
    if (r.width < 40 || r.height < 40) {
      bad.push({el: (el.getAttribute('aria-label') || el.textContent || el.tagName).trim().slice(0, 30),
                w: Math.round(r.width), h: Math.round(r.height)});
    }
  });
  return bad.slice(0, 12);
}
"""

JS_MIN_FONTS = """
() => {
  const bad = [];
  const walk = (el) => {
    for (const c of el.children) {
      if (c.children.length > 0) walk(c);
      const cs = getComputedStyle(c);
      if (cs.display === 'none' || cs.visibility === 'hidden') continue;
      const fs = parseFloat(cs.fontSize);
      const hasText = c.childNodes && [...c.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
      if (hasText && fs < 11) {
        bad.push({t: c.textContent.trim().slice(0, 25), fs});
      }
    }
  };
  walk(document.body);
  return bad.slice(0, 10);
}
"""

JS_MEDIA_FITS = """
() => {
  const bad = [];
  const vw = document.documentElement.clientWidth;
  document.querySelectorAll('img, video').forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.width === 0) return;
    if (r.right > vw + 1 || r.left < -1) {
      bad.push({tag: el.tagName, src: (el.currentSrc || el.src || '').split('/').pop()?.slice(0, 40),
                left: Math.round(r.left), right: Math.round(r.right), vw});
    }
  });
  return bad.slice(0, 8);
}
"""


def wait_scroll_settle(page, timeout=4000):
    """Wait for smooth scrolling to settle."""
    prev = page.evaluate("window.scrollY")
    deadline = time.time() + timeout / 1000
    while time.time() < deadline:
        page.wait_for_timeout(200)
        cur = page.evaluate("window.scrollY")
        if cur == prev:
            return cur
        prev = cur
    return page.evaluate("window.scrollY")


# =====================================================================
# 1. DESKTOP: STRUCTURE
# =====================================================================

def test_structure(page):
    print("\n=== 1. STRUCTURE (desktop 1920x1080) ===")
    page.goto(BASE, wait_until="load", timeout=30000)
    page.wait_for_timeout(2500)

    record("structure", "HTTP 200 + title", page.title().startswith("Fabrizio Saunero"),
           page.title())

    # viewport meta (via Playwright-parsed value)
    vp_meta = page.evaluate("""() => {
      const m = document.querySelector('meta[name=viewport]');
      return m ? m.content : null;
    }""")
    record("structure", "viewport meta responsive", vp_meta is not None and "width=device-width" in vp_meta, vp_meta)

    # lang attribute
    record("structure", "html lang=en", page.evaluate("document.documentElement.lang") == "en")

    # All sections present & in order
    order = ["top", "about", "athletics", "community", "work", "independence", "highlights", "gallery", "contact"]
    seq = page.evaluate(
        "[...document.querySelectorAll('section[id]')].map(s => s.id)")
    record("structure", "all 9 anchor sections present", all(s in seq for s in order), f"found={seq}")
    record("structure", "section order correct", seq == order, f"order={seq}")
    record("structure", "footer present", page.evaluate("!!document.querySelector('footer')"))
    record("structure", "nav[aria-label=Primary] present", page.evaluate(
        "!!document.querySelector('nav[aria-label=\\'Primary\\']')"))

    # Heading hierarchy
    headings = page.evaluate("""
      [...document.querySelectorAll('h1,h2,h3,h4')].map(h => ({tag: h.tagName, txt: h.textContent.trim().slice(0,50)}))
    """)
    h1_count = sum(1 for h in headings if h["tag"] == "H1")
    record("structure", "exactly one <h1>", h1_count == 1, f"h1_count={h1_count}")
    record("structure", "has <h2> sections", sum(1 for h in headings if h["tag"] == "H2") >= 6,
           f"h2={sum(1 for h in headings if h['tag']=='H2')}")
    # no skipped levels h1->h3
    skip = False
    for i in range(1, len(headings)):
        prev, cur = headings[i-1]["tag"], headings[i]["tag"]
        if (prev, cur) in (("H1", "H3"), ("H2", "H4")):
            skip = True
    record("structure", "no skipped heading levels", not skip,
           [f"{h['tag']}:{h['txt'][:20]}" for h in headings] if skip else "")

    record("structure", "single <main> landmark",
           page.evaluate("document.querySelectorAll('main').length === 1"))

    # trigger lazy-loaded below-fold images via instant scroll sweep, then check
    for frac in (0.2, 0.45, 0.7, 0.97):
        page.evaluate(f"window.scrollTo({{top: document.body.scrollHeight * {frac}, behavior: 'instant'}})")
        page.wait_for_timeout(700)
    page.evaluate("window.scrollTo({top: 0, behavior: 'instant'})")
    page.wait_for_timeout(1200)
    imgs = page.evaluate("""
      [...document.querySelectorAll('img')].map(i => ({
        ok: i.complete && i.naturalWidth > 0,
        src: (i.currentSrc || i.src).split('/').pop()?.slice(0, 50),
        alt: i.alt?.slice(0, 30)
      }))
    """)
    bad_imgs = [i for i in imgs if not i["ok"]]
    record("structure", f"all {len(imgs)} images load after lazy sweep", not bad_imgs, bad_imgs[:5])
    record("a11y", "all images have alt text", all(i["alt"] is not None for i in imgs),
           [i["src"] for i in imgs if i["alt"] is None][:5])

    # Videos: poster + preload + playsinline (mobile-safe attrs)
    vids = page.evaluate("""
      [...document.querySelectorAll('video')].map(v => ({
        poster: !!v.poster, playsInline: v.hasAttribute('playsinline'),
        muted: v.muted, loop: v.loop, src: (v.currentSrc || v.src || '').split('/').pop()?.slice(0, 40)
      }))
    """)
    record("structure", f"all {len(vids)} videos have poster", len(vids) > 0 and all(v["poster"] for v in vids),
           [v["src"] for v in vids if not v["poster"]])
    record("structure", "all videos playsInline (iOS autoplay-safe)", all(v["playsInline"] for v in vids))
    record("structure", "all videos muted+loop (autoplay-safe)", all(v["muted"] and v["loop"] for v in vids))

    # Fonts actually loaded
    fonts = page.evaluate("""async () => {
      await document.fonts.ready;
      return {
        anton: document.fonts.check('16px "Anton"'),
        inter: document.fonts.check('16px "Inter"'),
      };
    }""")
    record("structure", "display font Anton loaded", fonts["anton"])
    record("structure", "body font Inter loaded", fonts["inter"])

    # Main landmark + single main
    record("structure", "single <main> landmark",
           page.evaluate("document.querySelectorAll('main').length === 1"))

    # No horizontal overflow on desktop
    ov = page.evaluate(JS_NO_H_OVERFLOW)
    record("structure", "no horizontal overflow (desktop)", ov["sw"] <= ov["cw"] + 1,
           f"sw={ov['sw']} cw={ov['cw']} offenders={ov['offenders']}")


# =====================================================================
# 2. OVERRIDES / STACKING / LAYERING
# =====================================================================

def test_overrides(page):
    print("\n=== 2. OVERRIDES & STACKING (desktop) ===")
    page.goto(BASE, wait_until="load")
    page.wait_for_timeout(2000)

    # z-index layering: nav=50 < lightbox=100, and nav paints above content
    z = page.evaluate("""() => {
      const nav = document.querySelector('header');
      const lb = document.querySelector('[role=dialog]');
      return {
        navZ: nav ? getComputedStyle(nav).zIndex : null,
        lbZ: lb ? getComputedStyle(lb).zIndex : null,
      };
    }""")
    record("stacking", "nav fixed with z-50", z["navZ"] == "50", z)

    # nav must paint above hero content at top of page (elementFromPoint test on nav)
    covered = page.evaluate("""() => {
      const nav = document.querySelector('nav[aria-label=Primary]');
      const r = nav.getBoundingClientRect();
      const hit = document.elementFromPoint(r.left + 30, r.top + r.height / 2);
      return hit ? hit.closest('header') !== null : true;
    }""")
    record("stacking", "nav clickable (not covered by hero)", covered)

    # click-interception sweep of every visible interactive element
    page.evaluate("window.scrollTo(0, 0)")
    page.wait_for_timeout(400)
    bad = page.evaluate(JS_CLICK_INTERCEPTION)
    record("stacking", "no click interception on interactive els (viewport 1)", not bad, bad)

    # sweep again mid-page & at bottom (instant to avoid smooth-scroll races)
    page.evaluate("window.scrollTo({top: document.body.scrollHeight * 0.4, behavior: 'instant'})")
    page.wait_for_timeout(900)
    bad2 = page.evaluate(JS_CLICK_INTERCEPTION)
    record("stacking", "no click interception (40% scroll)", not bad2, bad2)
    page.evaluate("window.scrollTo({top: document.body.scrollHeight, behavior: 'instant'})")
    page.wait_for_timeout(900)
    bad3 = page.evaluate(JS_CLICK_INTERCEPTION)
    record("stacking", "no click interception (bottom)", not bad3, bad3)

    # Anchor links land sections below fixed nav (no hidden headings)
    nav_h = page.evaluate("""() => {
      const n = document.querySelector('nav[aria-label=Primary]');
      return n ? n.getBoundingClientRect().height : 64;
    }""")
    bad_anchors = []
    for sec in ["athletics", "community", "work", "independence", "highlights", "gallery", "contact"]:
        page.evaluate(f"document.getElementById('{sec}').scrollIntoView({{behavior: 'instant'}})")
        page.wait_for_timeout(150)
        top = page.evaluate(f"document.getElementById('{sec}').getBoundingClientRect().top")
        # content must start below nav (top >= -1). Section padding (py-24) gives breathing room.
        if top < -1:
            bad_anchors.append({"sec": sec, "top": round(top)})
    record("stacking", "anchors align to section tops (nothing clipped under nav)", not bad_anchors, bad_anchors)

    # heading visible below nav for each section (>= nav height)
    hidden_heads = []
    for sec in ["athletics", "community", "work", "independence", "highlights", "gallery"]:
        page.evaluate(f"document.getElementById('{sec}').scrollIntoView({{behavior: 'instant'}})")
        page.wait_for_timeout(120)
        top = page.evaluate(f"document.getElementById('{sec}').getBoundingClientRect().top")
        if top < nav_h - 96:  # py-24 = 96px top padding; heading would be under nav if top < navH-96
            hidden_heads.append({"sec": sec, "top": round(top), "navH": round(nav_h)})
    record("stacking", "section headings visible below fixed nav", not hidden_heads, hidden_heads)

    # lightbox must layer above nav (z-100 vs 50)
    page.evaluate("document.getElementById('gallery').scrollIntoView()")
    page.wait_for_timeout(600)
    page.locator("#gallery button[aria-label^='Open photo']").first.click()
    page.wait_for_timeout(500)
    lb_z = page.evaluate("""() => {
      const lb = document.querySelector('[role=dialog]');
      return lb ? getComputedStyle(lb).zIndex : null;
    }""")
    record("stacking", "lightbox z-index (100) above nav (50)", lb_z == "100", f"lightbox z={lb_z}")
    # lightbox actually on top
    on_top = page.evaluate("""() => {
      const lb = document.querySelector('[role=dialog]');
      const r = lb.getBoundingClientRect();
      const hit = document.elementFromPoint(r.left + r.width/2, r.top + 80);
      return hit ? lb.contains(hit) : false;
    }""")
    record("stacking", "lightbox paints above nav", on_top)
    page.keyboard.press("Escape")
    page.wait_for_timeout(400)
    record("interact", "lightbox Escape closes", page.locator("[role=dialog]").count() == 0)

    # body scroll lock while lightbox open
    page.locator("#gallery button[aria-label^='Open photo']").first.click()
    page.wait_for_timeout(400)
    lock = page.evaluate("getComputedStyle(document.body).overflow")
    record("stacking", "body scroll locked while lightbox open", lock in ("hidden", "clip"), f"overflow={lock}")
    page.keyboard.press("Escape")
    page.wait_for_timeout(300)
    unlock = page.evaluate("getComputedStyle(document.body).overflow")
    record("stacking", "body scroll restored after close", unlock not in ("hidden", "clip"), f"overflow={unlock}")


# =====================================================================
# 3. INTERACTIONS (desktop)
# =====================================================================

def test_interactions(page):
    print("\n=== 3. INTERACTIONS (desktop) ===")
    page.goto(BASE, wait_until="load")
    page.wait_for_timeout(2000)

    # --- nav: click each desktop link, verify scroll + URL hash + active state ---
    for href, label in [("#athletics", "Athletics"), ("#highlights", "Highlights"), ("#gallery", "Gallery")]:
        page.locator(f"nav[aria-label=Primary] a[href='{href}']").first.click()
        wait_scroll_settle(page)
        y = page.evaluate("window.scrollY")
        record("interact", f"nav '{label}' scrolls page", y > 200, f"scrollY={y}")
        hash_now = page.evaluate("location.hash")
        record("interact", f"nav '{label}' updates hash", hash_now == href, hash_now)

    # active state: while at #gallery, gallery link underline expands (w-full)
    # (color check is unreliable: Playwright hover leaves hover:text-paper active)
    page.wait_for_timeout(700)
    underline_w = page.evaluate("""() => {
      const a = document.querySelector("nav[aria-label=Primary] a[href='#gallery']");
      const span = a ? a.querySelector('span') : null;
      return span ? span.getBoundingClientRect().width : -1;
    }""")
    record("interact", "nav active state highlights current section",
           underline_w > 5, f"underline_width={underline_w:.0f}px (want >5)")

    # --- athletics autoplay video: scroll into view -> starts playing ---
    page.evaluate("document.getElementById('athletics').scrollIntoView()")
    page.wait_for_timeout(1500)
    auto = page.evaluate("""() => {
      const vids = [...document.querySelectorAll('#athletics video')];
      return vids.map(v => ({paused: v.paused, t: v.currentTime.toFixed(2)}));
    }""")
    record("interact", "athletics video autoplays on scroll into view",
           any(not v["paused"] and float(v["t"]) > 0 for v in auto) if auto else False, auto)

    # --- highlights player: play/pause/mute/playlist ---
    page.evaluate("document.getElementById('highlights').scrollIntoView({behavior: 'instant'})")
    page.wait_for_timeout(800)
    player = page.locator("#highlights video").first
    src_before = player.get_attribute("src")

    # REGRESSION (bug found in first run): while paused, the full-size center
    # overlay used to cover the bottom controls (mute/pause unclickable).
    # Verify the controls are now the top hit at their own coordinates.
    ctrl_ok = page.evaluate("""() => {
      const btn = document.querySelector("#highlights button[aria-label='Unmute video']");
      if (!btn) return null;
      const r = btn.getBoundingClientRect();
      const hit = document.elementFromPoint(r.left + r.width/2, r.top + r.height/2);
      return hit ? (btn.contains(hit) || hit.contains(btn)) : false;
    }""")
    record("stacking", "player controls clickable while paused (overlay fix)", ctrl_ok is True, f"hit_test={ctrl_ok}")

    # click the full-size center overlay play button (has class 'absolute')
    page.locator("#highlights button[aria-label='Play video'].absolute").click()
    page.wait_for_timeout(1200)
    playing = page.evaluate("() => { const v = document.querySelector('#highlights video'); return !v.paused && v.currentTime > 0; }")
    record("interact", "highlights player: play button starts video", playing)

    # playlist switch: click 2nd clip
    clips = page.locator("#highlights button[aria-label^='Play clip:']")
    n_clips = clips.count()
    record("interact", f"playlist has 5 clips", n_clips == 5, f"found={n_clips}")
    clips.nth(1).click()
    page.wait_for_timeout(1200)
    src_after = page.locator("#highlights video").first.get_attribute("src")
    record("interact", "playlist switching swaps video source", src_before != src_after,
           f"{os.path.basename(str(src_before))} -> {os.path.basename(str(src_after))}")
    playing2 = page.evaluate("() => { const v = document.querySelector('#highlights video'); return !v.paused; }")
    record("interact", "new clip auto-plays after switch", playing2)

    # pause via control
    page.locator("#highlights button[aria-label='Pause video']").first.click()
    page.wait_for_timeout(300)
    paused = page.evaluate("() => document.querySelector('#highlights video').paused")
    record("interact", "pause button pauses video", paused)

    # mute/unmute toggle
    muted_before = page.evaluate("() => document.querySelector('#highlights video').muted")
    page.locator("#highlights button[aria-label='Unmute video']").first.click()
    page.wait_for_timeout(200)
    muted_after = page.evaluate("() => document.querySelector('#highlights video').muted")
    record("interact", "mute toggle works", muted_before != muted_after,
           f"before={muted_before} after={muted_after}")
    # restore mute for politeness
    page.locator("#highlights button[aria-label='Mute video']").first.click()

    # --- gallery lightbox: open -> next -> prev -> keyboard -> close ---
    page.evaluate("document.getElementById('gallery').scrollIntoView()")
    page.wait_for_timeout(800)
    gal_buttons = page.locator("#gallery button[aria-label^='Open photo:']")
    n_photos = gal_buttons.count()
    record("interact", f"gallery grid has photos (n={n_photos})", n_photos >= 8)
    gal_buttons.first.click()
    page.wait_for_timeout(500)
    counter1 = page.locator("[role=dialog] figcaption span").first.text_content()
    record("interact", "lightbox opens with counter 01", counter1 and counter1.strip().startswith("01"), counter1)
    # next
    page.locator("button[aria-label='Next photo']").click()
    page.wait_for_timeout(400)
    counter2 = page.locator("[role=dialog] figcaption span").first.text_content()
    record("interact", "next button advances to 02", counter2 and counter2.strip().startswith("02"), counter2)
    # keyboard right
    page.keyboard.press("ArrowRight")
    page.wait_for_timeout(400)
    counter3 = page.locator("[role=dialog] figcaption span").first.text_content()
    record("interact", "ArrowRight advances to 03", counter3 and counter3.strip().startswith("03"), counter3)
    # keyboard left
    page.keyboard.press("ArrowLeft")
    page.wait_for_timeout(400)
    counter4 = page.locator("[role=dialog] figcaption span").first.text_content()
    record("interact", "ArrowLeft goes back to 02", counter4 and counter4.strip().startswith("02"), counter4)
    # close button
    page.locator("button[aria-label='Close photo viewer']").click()
    page.wait_for_timeout(400)
    record("interact", "close button closes lightbox", page.locator("[role=dialog]").count() == 0)

    # --- hero counters animate to final values ---
    page.evaluate("window.scrollTo({top: 0, behavior: 'instant'})")
    page.wait_for_timeout(2500)
    counters = page.evaluate("""() => {
      const el = document.querySelector('#top');
      return [...document.querySelectorAll('#top span')].map(s => s.textContent.trim())
        .filter(t => /^[$]?[\\d,]+[+×%]?$/.test(t));
    }""")
    expected = {"25", "5×", "6", "$7,000"}
    got = set(counters)
    record("interact", "hero counters animate to final values (25/5×/$7,000/6)",
           expected.issubset(got), f"got={counters}")

    # --- marquee animation actually running ---
    marq = page.evaluate("""() => {
      const t = document.querySelector('.marquee-track');
      if (!t) return null;
      const cs = getComputedStyle(t);
      return cs.animationName !== 'none' && cs.animationPlayState === 'running';
    }""")
    record("interact", "marquee ticker animating", marq is True)

    # --- smooth scroll behavior ---
    smooth = page.evaluate("getComputedStyle(document.documentElement).scrollBehavior")
    record("structure", "smooth scrolling enabled", smooth == "smooth", smooth)

    # --- reduced motion disables marquee (accessibility) ---
    # tested in separate context below for perf; here check CSS rule exists
    rm = page.evaluate("""() => {
      for (const sheet of document.styleSheets) {
        try { for (const r of sheet.cssRules) { if (r.media && r.media.mediaText.includes('prefers-reduced-motion')) return true; } } catch(e) {}
      }
      return false;
    }""")
    record("a11y", "prefers-reduced-motion media rule exists", rm)


# =====================================================================
# 4. MOBILE OPTIMIZATION
# =====================================================================

VIEWPORTS = [
    ("iphone-14", 390, 844, True, 3),      # iPhone 14 Pro
    ("small-android", 360, 800, True, 2),   # Pixel small
    ("iphone-se", 320, 568, True, 2),       # iPhone SE 1st gen stress test
    ("ipad", 768, 1024, True, 2),           # iPad portrait
    ("landscape", 844, 390, True, 2),       # iPhone landscape
]


def test_mobile(browser, name, w, h, touch, dsf):
    print(f"\n=== 4. MOBILE: {name} ({w}x{h}) ===")
    ctx = browser.new_context(
        viewport={"width": w, "height": h},
        device_scale_factor=dsf,
        is_mobile=(w < 500),
        has_touch=touch,
        user_agent=("Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
                    if w < 500 else
                    "Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"),
    )
    page = ctx.new_page()
    attach_listeners(page)
    page.goto(BASE, wait_until="load", timeout=30000)
    page.wait_for_timeout(2500)

    # -- no horizontal overflow (THE mobile killer) --
    ov = page.evaluate(JS_NO_H_OVERFLOW)
    record(f"mobile:{name}", "no horizontal overflow", ov["sw"] <= ov["cw"] + 1,
           f"sw={ov['sw']} cw={ov['cw']} offenders={ov['offenders']}")

    # -- layout viewport must equal visual viewport (no shrink-to-fit expansion) --
    iw = page.evaluate("innerWidth")
    record(f"mobile:{name}", "layout viewport == device width (no zoom-out fit)",
           iw == w, f"innerWidth={iw} expected={w}")

    # -- mobile chrome: hamburger visible, desktop links hidden (below lg=1024) --
    if w < 1024:
        burger_visible = page.locator("button[aria-label='Open menu']").is_visible()
        record(f"mobile:{name}", "hamburger menu visible", burger_visible)
        desktop_links = page.evaluate("""() => {
          const ul = document.querySelector("nav[aria-label=Primary] ul[class*='lg:flex']");
          return ul ? getComputedStyle(ul).display !== 'none' : null;
        }""")
        if w < 1024:
            record(f"mobile:{name}", "desktop nav links hidden", desktop_links is not True,
                   f"display={desktop_links}")

    # -- tap targets >= 40px (Apple HIG 44, Google 48; we accept 40+ with padding) --
    bad_taps = page.evaluate(JS_TAP_TARGETS)
    # ignore decorative zero-size / hidden; only fail on meaningful controls
    record(f"mobile:{name}", "tap targets >= 40px (above fold)", not bad_taps, bad_taps)

    # -- min font size >= 11px --
    bad_fonts = page.evaluate(JS_MIN_FONTS)
    record(f"mobile:{name}", "no text below 11px", not bad_fonts, bad_fonts)

    # -- images & videos fit viewport --
    bad_media = page.evaluate(JS_MEDIA_FITS)
    record(f"mobile:{name}", "all media fits viewport width", not bad_media, bad_media)

    # -- hamburger open/close/navigate --
    if w < 1024:
        page.locator("button[aria-label='Open menu']").tap(timeout=15000)
        page.wait_for_timeout(600)
        menu_open = page.locator("button[aria-label='Close menu']").is_visible()
        record(f"mobile:{name}", "hamburger opens menu", menu_open)
        # menu links visible & tap-sized (scope to the lg:hidden mobile panel,
        # NOT the desktop ul which is display:none below lg)
        menu_links = page.locator("header [class*='lg:hidden'] a[href='#athletics']")
        record(f"mobile:{name}", "menu shows section links",
               menu_links.count() >= 1 and menu_links.first.is_visible())
        ml_bad = page.evaluate(JS_TAP_TARGETS)
        record(f"mobile:{name}", "menu links are finger-friendly", not ml_bad, ml_bad)
        # navigate — use tap() (real touch input like an actual phone). Note:
        # synthetic .click() + framer exit animation can race the smooth scroll
        # under emulation; direct hash nav & plain anchor clicks verified correct.
        menu_links.first.tap()
        page.wait_for_timeout(1600)
        wait_scroll_settle(page)
        y = page.evaluate("window.scrollY")
        record(f"mobile:{name}", "menu link scrolls to athletics", y > 300, f"scrollY={y}")
        # menu auto-closes after navigation
        closed = page.locator("button[aria-label='Open menu']").is_visible()
        record(f"mobile:{name}", "menu auto-closes after link tap", closed)

    # -- scroll sweep for overflow at multiple scroll positions (marquee, reveal animations) --
    worst = None
    for frac in (0.15, 0.35, 0.55, 0.75, 0.95):
        page.evaluate(f"window.scrollTo({{top: document.body.scrollHeight * {frac}, behavior: 'instant'}})")
        page.wait_for_timeout(600)
        ov2 = page.evaluate(JS_NO_H_OVERFLOW)
        if ov2["sw"] > ov2["cw"] + 1:
            worst = {"frac": frac, **ov2}
            break
    record(f"mobile:{name}", "no overflow during full scroll sweep", worst is None, worst)

    # -- lightbox works on touch --
    page.evaluate("document.getElementById('gallery').scrollIntoView({behavior: 'instant'})")
    page.wait_for_timeout(900)
    gal = page.locator("#gallery button[aria-label^='Open photo:']")
    if gal.count() > 0:
        gal.first.tap()
        page.wait_for_timeout(600)
        opened = page.locator("[role=dialog]").count() == 1
        record(f"mobile:{name}", "lightbox opens on tap", opened)
        if opened:
            # next button reachable & image fits screen
            fits = page.evaluate("""() => {
              const img = document.querySelector('[role=dialog] img');
              if (!img) return null;
              const r = img.getBoundingClientRect();
              return {w: Math.round(r.width), h: Math.round(r.height), vw: innerWidth, vh: innerHeight,
                      okW: r.width <= innerWidth + 1, okH: r.height <= innerHeight + 1};
            }""")
            record(f"mobile:{name}", "lightbox image fits mobile screen",
                   fits and fits["okW"] and fits["okH"], fits)
            page.locator("button[aria-label='Close photo viewer']").tap()
            page.wait_for_timeout(400)
            record(f"mobile:{name}", "lightbox closes on tap",
                   page.locator("[role=dialog]").count() == 0)

    # -- highlights player usable on mobile --
    page.evaluate("document.getElementById('highlights').scrollIntoView({behavior: 'instant'})")
    page.wait_for_timeout(800)
    hv = page.locator("#highlights video").first
    fits_v = page.evaluate("""() => {
      const v = document.querySelector('#highlights video');
      const r = v.getBoundingClientRect();
      return r.width <= innerWidth + 1;
    }""")
    record(f"mobile:{name}", "highlights video fits width", fits_v)
    page.locator("#highlights button[aria-label='Play video'].absolute").tap(timeout=10000)
    page.wait_for_timeout(1200)
    playing = page.evaluate("() => { const v = document.querySelector('#highlights video'); return !v.paused; }")
    record(f"mobile:{name}", "video play button works on touch", playing)
    page.screenshot(path=f"{SHOT_DIR}/{name}-highlights.png")

    # -- screenshot hero for the report --
    page.evaluate("window.scrollTo({top: 0, behavior: 'instant'})")
    page.wait_for_timeout(800)
    page.screenshot(path=f"{SHOT_DIR}/{name}-hero.png")
    ctx.close()


# =====================================================================
# MAIN
# =====================================================================

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        # Desktop main run
        ctx = browser.new_context(viewport={"width": 1920, "height": 1080})
        page = ctx.new_page()
        attach_listeners(page)

        t0 = time.time()
        test_structure(page)
        test_overrides(page)
        test_interactions(page)
        page.evaluate("window.scrollTo(0,0)")
        page.wait_for_timeout(900)
        page.screenshot(path=f"{SHOT_DIR}/desktop-hero-full.png", full_page=False)
        ctx.close()

        # Mobile matrix
        for name, w, h, touch, dsf in VIEWPORTS:
            test_mobile(browser, name, w, h, touch, dsf)

        browser.close()

    # console / network verdict
    print("\n=== 5. CONSOLE & NETWORK ===")
    real_errors = [e for e in CONSOLE_ERRORS if "Download the React DevTools" not in e]
    record("console", "zero console errors (all viewports)", not real_errors, real_errors[:5])
    real_failed = [f for f in FAILED_REQUESTS if "favicon" not in f]
    record("network", "zero failed requests (4xx/5xx)", not real_failed, real_failed[:5])

    # summary
    total = len(RESULTS)
    passed = sum(1 for r in RESULTS if r["ok"])
    print("\n" + "=" * 64)
    print(f"RESULTS: {passed}/{total} passed  ({100*passed/total:.0f}%)")
    print("=" * 64)
    fails = [r for r in RESULTS if not r["ok"]]
    if fails:
        print("\nFAILURES:")
        for r in fails:
            print(f"  ✗ [{r['cat']}] {r['name']}: {r['detail']}")
    with open(f"{SHOT_DIR}/results.json", "w") as f:
        json.dump({"total": total, "passed": passed,
                   "results": RESULTS,
                   "console_errors": CONSOLE_ERRORS, "failed_requests": FAILED_REQUESTS}, f, indent=2)
    print(f"\nFull results: {SHOT_DIR}/results.json")
    print(f"Elapsed: {time.time()-t0:.0f}s")
    return 0 if not fails else 1


if __name__ == "__main__":
    sys.exit(main())
