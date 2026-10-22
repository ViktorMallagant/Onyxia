# Onyxia — Expanded Living Lorebook

This build adds seven linked, responsive reference chapters to the existing Onyxia atlas, Genesis, Shadows in Stone and interactive timeline. Each new chapter is based on the supplied manuscript, with optimised illustrations and searchable, expandable articles.

## New chapters
- `realms.html` — 8 realms, the Soaring Spires and the Crucible Islands
- `species.html` — 17 sentient species, in order of emergence
- `bestiary.html` — 16 creatures including subspecies illustrations
- `magic.html` — the 8 Onyx Stone affinities and their counters
- `religions.html` — 4 religious traditions
- `organisations.html` — 5 organisations
- `economics.html` — Daktari, wages, taxes, starting money, trade and the 35-item pricing table

## Deployment
Keep **all files and directories** together. The current GitHub Actions workflow can continue to publish the static files from `main`; no package manager or server-side code is required. The only extra asset is `lore-pages-data.json`, which the seven chapters load using JavaScript.

Important: On GitHub Pages, all 7 new HTML files, `lorebook.css`, `lorebook.js`, `lore-pages-data.json`, and the `assets/lore/` directory must be uploaded together. A ZIP is for backup and distribution; GitHub’s web uploader does not unzip it automatically. To deploy in one step, clone/pull the existing repository, copy the contents of this package into its root and run:

```sh
git add -A
git commit -m "Add Onyxia lorebook reference chapters"
git push origin main
```

The original map image and map build script remain intact. **No lore entry has been invented.** Source inconsistencies are documented in `EDITORIAL_REVIEW_NOTES.md` rather than corrected without permission.


## Atlas ↔ Realm articles

- Clicking a marker on the World Atlas selects the realm and offers **Read the realm chronicle**.
- Opening a complete realm entry shows **View this realm on the atlas**, which returns to the map with that realm selected and in focus.
- Realm deep links use `index.html?realm=astazulum#atlas`, with IDs for the eight named kingdoms/dynasty/republic/empire.
- The existing map coordinates and marker placements are unchanged.
