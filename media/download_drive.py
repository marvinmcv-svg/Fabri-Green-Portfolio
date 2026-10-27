import json
import os
import subprocess
import time

with open('/home/z/my-project/media/mapping.json') as f:
    mapping = json.load(f)

out_dir = '/home/z/my-project/media/raw'
os.makedirs(out_dir, exist_ok=True)

def sanitize(name):
    return name.replace(' ', '_').replace('(', '').replace(')', '')

results = []
for fid, name in mapping.items():
    safe = sanitize(name)
    out_path = os.path.join(out_dir, safe)
    if os.path.exists(out_path) and os.path.getsize(out_path) > 10000:
        print(f"SKIP (exists): {safe}")
        results.append((fid, name, safe, 'ok'))
        continue
    url = f"https://drive.google.com/uc?export=download&id={fid}"
    r = subprocess.run(['curl', '-sL', url, '-o', out_path, '--max-time', '120'],
                       capture_output=True, text=True)
    size = os.path.getsize(out_path) if os.path.exists(out_path) else 0
    # Check if it's an HTML page (virus scan warning) instead of the actual file
    is_html = False
    if size < 100000:
        try:
            with open(out_path, 'r', errors='ignore') as fh:
                head = fh.read(2000)
                if '<html' in head.lower() or '<!doctype' in head.lower():
                    is_html = True
        except Exception:
            pass
    status = 'ok' if (size > 10000 and not is_html) else f'FAIL size={size} html={is_html}'
    print(f"{status}: {safe} ({size} bytes)")
    results.append((fid, name, safe, status))
    time.sleep(0.5)

fails = [r for r in results if r[3] != 'ok']
print(f"\nDone. {len(results)-len(fails)} ok, {len(fails)} failed")
if fails:
    for f_ in fails:
        print("FAILED:", f_[1], f_[2])
