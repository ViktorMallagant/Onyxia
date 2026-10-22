"""Build the high-density Onyxia atlas without changing map lettering.

Use the best-quality source checked into the repository. The original JPEG is
retained to make the site buildable until a larger PNG master is uploaded.
"""
from pathlib import Path
from PIL import Image, ImageFilter, ImageOps

PNG_MASTER = Path("assets/onyxia-world-map-source.png")
LEGACY_JPG = Path("assets/onyxia-world-map.jpg")
OUTPUT = Path("assets/onyxia-world-map@2x.webp")


def main():
    source_path = PNG_MASTER if PNG_MASTER.exists() else LEGACY_JPG
    if not source_path.exists():
        raise FileNotFoundError(
            "Missing map source: upload assets/onyxia-world-map-source.png "
            "or restore assets/onyxia-world-map.jpg"
        )
    with Image.open(source_path) as image:
        original = ImageOps.exif_transpose(image).convert("RGB")
        new_size = (original.width * 2, original.height * 2)
        # Lanczos + restrained sharpening smooths raster scaling; it does not
        # invent fine cartographic features or change the labels.
        enlarged = original.resize(new_size, Image.Resampling.LANCZOS)
        enlarged = enlarged.filter(
            ImageFilter.UnsharpMask(radius=1.05, percent=94, threshold=3)
        )
        enlarged.save(OUTPUT, format="WEBP", quality=94, method=6)
        print(
            f"Source: {source_path} ({original.width} x {original.height}); "
            f"atlas: {OUTPUT} ({new_size[0]} x {new_size[1]})"
        )


if __name__ == "__main__":
    main()
