"""Stamp both live atlas references with a hash of the uploaded native map."""
from hashlib import sha256
from pathlib import Path

site=Path("_site")
asset=site/"assets/onyxia-8000px-master.webp"
if not asset.is_file():
    raise SystemExit("Native 8000px atlas is missing from the assembled site.")
from PIL import Image
with Image.open(asset) as image:
    if image.size!=(8000,4200):
        raise SystemExit(f"Unexpected native atlas dimensions: {image.size}")
fingerprint=sha256(asset.read_bytes()).hexdigest()[:12]
needle="assets/onyxia-8000px-master.webp"
replacement=f"{needle}?v={fingerprint}"
for filename in ("index.html","realms.html"):
    source=site/filename
    html=source.read_text(encoding="utf-8")
    n=html.count(needle)
    if n==0:
        raise SystemExit(f"No native atlas URL found in {filename}")
    source.write_text(html.replace(needle,replacement),encoding="utf-8")
    print(f"{filename}: {n} atlas links stamped, native 8000x4200, SHA256 {fingerprint}")
