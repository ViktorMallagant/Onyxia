"""Stamp atlas image URLs with a content hash to prevent stale map caches.

This runs *after* assembling _site and must be repeated on every deployment.
When the native 8000px master is uploaded, the resulting image hash changes,
automatically changing the URL both on the atlas and Realms header.
"""
from hashlib import sha256
from pathlib import Path

site=Path("_site")
asset=site/"assets/onyxia-world-map@2x.webp"
if not asset.is_file():
    raise SystemExit("Missing generated atlas WebP")
fingerprint=sha256(asset.read_bytes()).hexdigest()[:12]
needle="assets/onyxia-world-map@2x.webp"
replacement=f"{needle}?v={fingerprint}"
for filename in ("index.html","realms.html"):
    source=site/filename
    html=source.read_text(encoding="utf-8")
    if needle not in html:
        raise SystemExit(f"No atlas reference in {filename}")
    source.write_text(html.replace(needle,replacement),encoding="utf-8")
    print(f"{filename}: atlas version {fingerprint}")
