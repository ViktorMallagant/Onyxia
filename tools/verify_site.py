#!/usr/bin/env python3
"""Check every Onyxia illustration path after building the Pages artefact."""
from pathlib import Path
from PIL import Image
import re
import sys

root = Path("_site")
if not root.is_dir():
    sys.exit("Missing _site directory.")

pattern = re.compile(r'assets/lore/[a-zA-Z0-9._/-]+\.(?:webp|png|jpg|jpeg)', re.I)
references = set()
for source in [*root.glob("*.html"), *root.glob("*.json"), *root.glob("*.js")]:
    references.update(pattern.findall(source.read_text(encoding="utf-8")))

if len(references) < 60:
    sys.exit(f"Only {len(references)} artwork references found; expected at least 60.")

failures = []
for rel in sorted(references):
    asset = root / rel
    if not asset.is_file() or asset.stat().st_size < 200:
        failures.append(f"Missing or empty: {rel}")
        continue
    try:
        with Image.open(asset) as picture:
            picture.verify()
    except Exception as error:
        failures.append(f"Corrupt image {rel}: {error}")

if failures:
    print("\n".join(failures))
    sys.exit(f"Artwork audit failed: {len(failures)} broken assets.")
print(f"Artwork audit passed: {len(references)} referenced illustrations exist and decode correctly.")
