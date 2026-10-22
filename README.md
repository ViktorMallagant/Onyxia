# Onyxia — The Living Lorebook

An interactive high-fantasy atlas and chronicle in British English, based on Maria's original world and historical manuscript.

## Features

- Pannable and zoomable atlas with eight interactive realm markers and accessible controls
- **The Beginning**, **Shadows in Stone**, and the interactive **Chronicle of the Sun**
- Searchable and filterable historical entries
- Static HTML, CSS and JavaScript, published automatically with GitHub Actions

## Improved map source (October 2026)

GitHub Actions runs `python tools/build_atlas.py` whenever changes are pushed to `main`. The builder uses:

1. **Preferred**: `assets/onyxia-world-map-source.png` — Maria's larger **2340 × 1229** PNG export (upload this file to activate the upgrade).
2. **Fallback**: `assets/onyxia-world-map.jpg` — the previous **1735 × 911** JPEG, already in the repository.

The builder produces `assets/onyxia-world-map@2x.webp` for the deployed site. With the preferred PNG it produces a **4680 × 2458** WebP; until then, it produces a 3470 × 1822 version from the original JPEG. Resampling can smooth zoomed edges but cannot recover detail absent from the source. We preserve the existing JPEG in the repository and as the browser's error fallback.

**Upload instruction:** Add the file exactly as `assets/onyxia-world-map-source.png` on the `main` branch using GitHub's **Add file → Upload files** interface. The deployment workflow will build and publish the high-resolution WebP on that push.

## Working locally

```bash
python -m pip install Pillow
python tools/build_atlas.py
python -m http.server 8000
```

Browse to `http://localhost:8000/`. This project has no runtime dependencies or build framework.

## Editing

- Chapters and events: `lore-data.js`
- Map and timeline interactions: `app.js`
- Layout and chapter names: `index.html` and `styles.css`
- Map generator: `tools/build_atlas.py`
- Future high-detail export instructions: `MAP_EXPORT_GUIDE.md`

Two years (1020 and 1350) are inferred from relative dating in the source manuscript.
