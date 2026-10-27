import re
import json

with open('/home/z/my-project/media/folder.html', 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

# Collect first occurrence position of each unique ID
id_positions = {}
for m in re.finditer(r'data-id="([a-zA-Z0-9_-]{25,})"', content):
    fid = m.group(1)
    if fid not in id_positions:
        id_positions[fid] = m.start()

# Collect first occurrence position of each unique file name
names = [
    "WhatsApp Image 2026-10-22 at 23.56.41.jpeg",
    "WhatsApp Image 2026-10-22 at 23.56.42 (1).jpeg",
    "WhatsApp Image 2026-10-22 at 23.56.42 (2).jpeg",
    "WhatsApp Image 2026-10-22 at 23.56.42.jpeg",
    "WhatsApp Image 2026-10-22 at 23.56.43 (1).jpeg",
    "WhatsApp Image 2026-10-22 at 23.56.43 (2).jpeg",
    "WhatsApp Image 2026-10-22 at 23.56.43.jpeg",
    "WhatsApp Image 2026-10-22 at 23.56.44.jpeg",
    "WhatsApp Image 2026-10-24 at 11.59.15 (1).jpeg",
    "WhatsApp Image 2026-10-24 at 11.59.15.jpeg",
    "WhatsApp Image 2026-10-24 at 11.59.16.jpeg",
    "WhatsApp Image 2026-10-24 at 11.59.18 (1).jpeg",
    "WhatsApp Image 2026-10-24 at 11.59.18 (2).jpeg",
    "WhatsApp Image 2026-10-24 at 11.59.19.jpeg",
    "WhatsApp Image 2026-10-24 at 11.59.20 (1).jpeg",
    "WhatsApp Image 2026-10-24 at 11.59.20.jpeg",
    "WhatsApp Image 2026-10-24 at 11.59.21.jpeg",
    "WhatsApp Image 2026-10-26 at 22.47.44.jpeg",
    "WhatsApp Video 2026-10-22 at 23.56.41.mp4",
    "WhatsApp Video 2026-10-24 at 11.59.15.mp4",
    "WhatsApp Video 2026-10-24 at 11.59.21 (1).mp4",
    "WhatsApp Video 2026-10-24 at 11.59.22.mp4",
    "WhatsApp Video 2026-10-24 at 12.00.16.mp4",
    "WhatsApp Video 2026-10-24 at 12.00.17 (1).mp4",
    "WhatsApp Video 2026-10-24 at 12.00.18.mp4",
]

name_positions = {}
for n in names:
    # name may appear multiple times; take all occurrences
    occ = [m.start() for m in re.finditer(re.escape(n), content)]
    name_positions[n] = occ
    if not occ:
        print("NOT FOUND:", n)

# For each ID, find the closest name occurrence (within some window)
mapping = {}
used_names = set()
ids_sorted = sorted(id_positions.items(), key=lambda x: x[1])

# Alternative robust approach: for each id, search the surrounding window (say +/- 3000 chars) for name occurrences
for fid, pos in ids_sorted:
    window_start = max(0, pos - 5000)
    window_end = pos + 5000
    window = content[window_start:window_end]
    best = None
    best_dist = None
    for n, occs in name_positions.items():
        if n in used_names:
            continue
        for o in occs:
            if window_start <= o <= window_end:
                d = abs(o - pos)
                if best_dist is None or d < best_dist:
                    best_dist = d
                    best = n
    if best:
        mapping[fid] = best
        used_names.add(best)
        print(f"{fid} => {best} (dist {best_dist})")
    else:
        print(f"{fid} => NO MATCH")

print("\nMapped:", len(mapping), "of", len(names))
with open('/home/z/my-project/media/mapping.json', 'w') as f:
    json.dump(mapping, f, indent=2)
