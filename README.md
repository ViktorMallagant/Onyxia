# Onyxia — The Living Lorebook

A standalone high-fantasy atlas and chronicle, written in British English.

## Features
- Pannable and zoomable world map with keyboard, mouse and touch controls
- Higher-density map image prepared during deployment from the original source
- A fallback to the existing map if high-density WebP cannot be loaded
- The Beginning and Shadows in Stone, polished without changing the established lore
- Interactive Year of the Sun chronicle (22 events), with search and filters
- Vanilla HTML/CSS/JS; no runtime framework needed

## Publishing
The GitHub Actions workflow at `.github/workflows/deploy.yml` publishes the site whenever `main` changes. It installs Pillow, runs `python tools/build_atlas.py`, then uploads the static site to GitHub Pages.

The generator enlarges `assets/onyxia-world-map.jpg` to a 2× WebP using Lanczos resampling and gentle sharpening. **This reduces visible blockiness, but does not introduce genuine new map detail**. If a larger original export becomes available, replace the JPG (keeping the original 1735:911 aspect ratio; update code's dimensions for a different ratio), and re-evaluate the upscaler settings. Do not redraw names with generative AI as this can corrupt map lettering.

For a local preview of the complete site:

```bash
python -m pip install Pillow
python tools/build_atlas.py
python -m http.server 8000
```

Visit `http://localhost:8000/`.

## Editing
- Prose and timeline events are in `lore-data.js`.
- Layout and chapters are in `index.html` and `styles.css`.
- Map markers, zoom and chronology controls are in `app.js`.
- Source manuscript: *The Beginning, Current Plot & Timeline*.
- The two dates 1020 and 1350 are inferred from relative dates in the manuscript, not independently established calendar years.
