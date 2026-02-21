# Half-a-Buck (Phaser) — Starter Skeleton

## Requirements
- Node 18+ recommended

## Install
```bash
npm install
```

## Run locally
```bash
npm run dev
```

## Build
```bash
npm run build
```

## Deploy to GitHub Pages
This starter is configured with `base: "./"` for easy deployment.

### Option A: GitHub Pages from `/dist`
1. Run: `npm run build`
2. Push the `dist/` folder to a `gh-pages` branch (or configure Pages to serve from `docs/` and copy dist → docs).
3. In GitHub repo settings → Pages, choose the correct branch/folder.

### Option B (simple): Use `docs/` folder
1. Run: `npm run build`
2. Copy `dist/*` into `docs/` (create docs if needed)
3. Commit and push
4. GitHub Pages → Branch: `main`, Folder: `/docs`

## Mobile
Landscape-only is enforced. Portrait shows a rotate overlay.

---

## Tiled Map Editing (Warehouse)
This skeleton includes a working Tiled JSON map and a tiny tileset:

- `public/assets/maps/warehouse.json`
- `public/assets/tiles/warehouse_tiles.png`

### Recommended Tiled settings
- Orientation: Orthogonal
- Tile size: 16×16
- Map size: start with 40×22 (already provided)
- Add layers:
  - `Ground` (tile layer)
  - `Objects` (object layer)

### Objects layer conventions
- **player_spawn** (type: `spawn`)
- **guards** (type: `guard`) with a string property `path` containing patrol point names (comma-separated)
- **patrol points** (type: `patrol`) named like `g1p1`, `g1p2`, etc.

Example:
- guard object has property: `path = g1p1,g1p2,g1p3,g1p4`

### Collision
In the sample tileset:
- Tile ID **2** is the wall tile. `WarehouseScene` sets collision on `[2]`.

Press **F1** in-game to toggle collision debug overlay.

---

## Stealth Loop (MVP)
Implemented in `WarehouseScene`:

- **Knockout:** get behind a guard and press **Interact**
- **Drag:** press **Interact** near a knocked-out guard
- **Drop:** press **Interact** again
- **Hide body:**
  - Drag into a **locker zone** (object type `locker` / `hide_zone`)
  - OR drag into **shadow tiles** (tile ID 3 in the sample tileset)

## Debug Keys
- **F1:** collision debug overlay
- **F2:** vision cone + meter debug overlay
- **ESC:** jump to ending scene
