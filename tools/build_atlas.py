"""Build the Onyxia atlas from the best available export.

If assets/onyxia-8000px-master.webp exists, use that genuinely detailed native
export without resampling. Otherwise retain the existing legacy atlas workflow.
Stage coordinates remain in the site's original 1735x911 reference space.
"""
from pathlib import Path
from shutil import copyfile
from PIL import Image, ImageFilter, ImageOps

MASTER = Path("assets/onyxia-8000px-master.webp")
PNG = Path("assets/onyxia-world-map-source.png")
JPEG = Path("assets/onyxia-world-map.jpg")
OUTPUT = Path("assets/onyxia-world-map@2x.webp")


def main():
    if MASTER.exists():
        with Image.open(MASTER) as image:
            if image.size != (8000, 4200):
                raise ValueError(f"Expected an 8000x4200 master, found {image.size}")
        copyfile(MASTER, OUTPUT)
        print(f"Native map, 8000x4200, no upscaling or re-encoding: {OUTPUT}")
        return
    source = PNG if PNG.exists() else JPEG
    if not source.exists():
        raise FileNotFoundError("Missing both the map master and legacy sources")
    with Image.open(source) as image:
        image = ImageOps.exif_transpose(image).convert("RGB")
        resized = image.resize((image.width * 2, image.height * 2), Image.Resampling.LANCZOS)
        resized = resized.filter(ImageFilter.UnsharpMask(radius=1.05, percent=94, threshold=3))
        resized.save(OUTPUT, format="WEBP", quality=94, method=6)
        print(f"Legacy source {source}: {image.width}x{image.height} -> {resized.width}x{resized.height}")


if __name__ == "__main__":
    main()
