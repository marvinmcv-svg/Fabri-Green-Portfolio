import re
import html as htmllib
import json

with open('/home/z/my-project/media/folder.html', 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

# Google Drive folder HTML: find blocks with data-id and nearby file name in aria-label or data tooltip
# Try pattern: data-id="ID" ... aria-label="FILENAME"
# Also try extracting from embedded JS: ["FILE_ID",...,"FILENAME.ext"]

pairs = {}

# Method 1: aria-label near data-id
for m in re.finditer(r'data-id="([a-zA-Z0-9_-]{25,})"[^>]*aria-label="([^"]+)"', content):
    fid, name = m.group(1), m.group(2)
    pairs[fid] = name

# Method 2: reversed order aria-label then data-id
for m in re.finditer(r'aria-label="([^"]+)"[^>]*data-id="([a-zA-Z0-9_-]{25,})"', content):
    name, fid = m.group(1), m.group(2)
    pairs.setdefault(fid, name)

print("Method 1+2 pairs:", len(pairs))
for fid, name in list(pairs.items())[:40]:
    print(fid, '=>', name)

# Method 3: embedded data with file names like "WhatsApp Image..."
# Look for patterns of ID followed by name in JS arrays
names_found = re.findall(r'"([a-zA-Z0-9_-]{25,})",?"?,?"?[^"]*"(WhatsApp [^"]+?)"', content)
print("\nMethod 3:", len(names_found))

# Method 4: find all WhatsApp file names and all unique IDs, print separately
wa_names = re.findall(r'(WhatsApp (?:Image|Video) [0-9]{4}-[0-9]{2}-[0-9]{2} at [0-9]{2}\.[0-9]{2}\.[0-9]{2}(?: \(\d+\))?\.(?:jpeg|jpg|png|mp4|mov))', content)
unique_names = []
seen = set()
for n in wa_names:
    if n not in seen:
        seen.add(n)
        unique_names.append(n)
print("\nUnique names:", len(unique_names))
for n in unique_names:
    print(' ', n)

unique_ids = []
seen_ids = set()
for i in re.findall(r'data-id="([a-zA-Z0-9_-]{25,})"', content):
    if i not in seen_ids:
        seen_ids.add(i)
        unique_ids.append(i)
print("\nUnique IDs:", len(unique_ids))
for i in unique_ids:
    print(' ', i)

with open('/home/z/my-project/media/drive_files.json', 'w') as f:
    json.dump({'pairs': pairs, 'names': unique_names, 'ids': unique_ids}, f, indent=2)
