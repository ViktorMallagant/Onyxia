"""Prepare a higher-density, typography-safe Onyxia atlas asset.

No generative changes: the original art, geography, landmarks and labels remain
unaltered. Resize with Lanczos interpolation and gently sharpen for use at zoom.
The source JPG remains available as a browser fallback.
"""
from pathlib import Path
from PIL import Image, ImageFilter, ImageOps

SOURCE = Path('assets/onyxia-world-map.jpg')
OUTPUT = Path('assets/onyxia-world-map@2x.webp')

def main():
    with Image.open(SOURCE) as source:
        source = ImageOps.exif_transpose(source).convert('RGB')
        # Upsampling smooths stairsteps without inventing or redrawing labels.
        enlarged = source.resize((source.width*2, source.height*2), Image.Resampling.LANCZOS)
        enlarged = enlarged.filter(ImageFilter.UnsharpMask(radius=1.05, percent=94, threshold=3))
        enlarged.save(OUTPUT, format='WEBP', quality=94, method=6)
        print(f'Atlas: {source.width}x{source.height} -> {enlarged.width}x{enlarged.height}, {OUTPUT.stat().st_size:,} bytes')

if __name__ == '__main__':
    main()
