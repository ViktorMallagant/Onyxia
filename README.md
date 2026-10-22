# Onyxia — The Living Lorebook

A responsive, standalone high-fantasy lorebook featuring the world atlas, **The Beginning**, **Current Plot**, and an interactive **Chronicle of the Sun**.

## Features
- Pan/zoom world map with wheel, pinch, double-click, keyboard, and on-screen controls
- Eight selectable realm markers with links to relevant timeline entries
- Genesis and Current Plot rendered directly from the supplied manuscript
- 22 chronological entries (including inferred years **1020** and **1350** from the manuscript's relative dates)
- Search, category filtering, realm filtering, year scrubber, and expandable history cards
- Pure HTML/CSS/JavaScript; no build step, server, or dependencies

## Deployment
1. Place `index.html`, `styles.css`, `app.js`, `lore-data.js`, and `.nojekyll` in the repository root.
2. Place the supplied world map at `assets/onyxia-world-map.jpg` (1735×911). **This file is required.**
3. In GitHub, open **Settings → Pages**, choose **Deploy from a branch**, select `main` and `/ (root)`, and save. The site will be available at the GitHub Pages URL once publishing completes.

To preview locally, run `python -m http.server 8000` in the project directory and visit `http://localhost:8000/`.

## Editing lore
- Edit `lore-data.js` to update Genesis, Current Plot, or individual events.
- Events use `year`, `title`, `category`, `text`, and `regions`. The `year` field is for chronological sorting; the `text` field preserves source details.
- Add realm entries to the `realms` array in `app.js` for further map destinations.

Source: *The Beginning, Current Plot & Timeline* (user-supplied manuscript). All timeline event descriptions are drawn from that source. This first version includes no speculative new historical events.
