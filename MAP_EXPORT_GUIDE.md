# Future native-resolution Onyxia map export

The site will use the improved **2340 × 1229** PNG once it is uploaded. For much cleaner deep zoom later, assemble a genuinely larger source export from the original map creator.

## Recommended export and assembly

1. Decide on a master target, ideally **5000–9000 pixels wide**, maintaining the map's existing approximately 1.904:1 aspect ratio.
2. Export the whole map as overlapping rectangular chunks from the creator at one **unchanging zoom level**. Do not change labels, layers, colours, or map render settings between exports.
3. Include **5–10% overlap** around the edges of neighbouring chunks; keep a note of the row, column and export order.
4. In Photoshop, Affinity Photo, GIMP or Photopea, create a canvas for the complete export. Place chunks as separate layers and align overlapping features (coastlines, grid lines and towns). Check that no text labels are cut or duplicated.
5. Verify alignment at full resolution, particularly along coastlines, roads, rivers, frame/grid intersections and settlement labels.
6. Preserve the **layered assembly project** for future edits; then export a flattened **lossless PNG**.
7. Replace `assets/onyxia-world-map-source.png` with that master, commit to `main`, and let GitHub Actions rebuild the WebP.

## Quality safeguards

- Use PNG for chunk exports. Do not repeatedly re-save JPEGs.
- Use a constant viewport and zoom for every chunk. A screenshot at arbitrary zoom can introduce scaling and seam mismatches.
- Retain the map's complete extent, border and orientation so interactive realm markers remain correctly placed.
- Do not use generative AI to redraw cartographic labels; it can introduce incorrect place names.
- A very large master could benefit from **tiled deep zoom** rather than one WebP. That is a later enhancement if needed.
