# SVG Systems Documentation

This document covers both the SVG Collision and SVG Exits/Spawns systems used in Half a Buck.

---

## SVG Collision System

### Overview
The collision system uses SVG files to define walkable areas and collision boundaries for each scene. This provides precise, resolution-independent collision data that's easy to edit and maintain.

### File Location
`/public/assets/collision/[scene-name]-collision.svg`

### How It Works
1. Create an SVG file matching the exact scene dimensions
2. Draw filled shapes (rectangles, polygons, etc.) where collisions should occur
3. The `SVGCollisionParser` reads the SVG and creates Phaser physics bodies

### SVG Requirements
- **Dimensions:** Must match scene size exactly
  - Example: LoadingDock = 512×288, so SVG must be `width="512" height="288" viewBox="0 0 512 288"`
- **Shapes:** Any filled SVG shapes (rect, polygon, path, circle)
- **Fill:** Any solid color (color doesn't matter, only shapes are parsed)
- **No text needed:** Text labels can be removed from collision SVGs

### Parser Details
```javascript
SVGCollisionParser.parseAndCreateBodies(scene, svgPath, offsetX?, offsetY?)
```

**Parameters:**
- `scene` - Phaser scene instance
- `svgPath` - Path to SVG file (e.g., "assets/collision/cell-collision.svg")
- `offsetX` - Optional X offset for scenes with positioning (default: 0)
- `offsetY` - Optional Y offset for scenes with positioning (default: 0)

**Returns:** Array of Phaser physics bodies

### Scene Integration
```javascript
// Load collision
const collisionBodies = await SVGCollisionParser.parseAndCreateBodies(
  this,
  "assets/collision/warehouse-main-collision.svg"
);

// Store for reference
this.collisionBodies = collisionBodies;

// Add colliders
collisionBodies.forEach(body => {
  this.physics.add.collider(this.player, body);
  this.guards.forEach(guard => {
    this.physics.add.collider(guard, body);
  });
});
```

### With Offsets (for centered scenes)
```javascript
const collisionBodies = await SVGCollisionParser.parseAndCreateBodies(
  this,
  "assets/collision/cell-collision.svg",
  cellOffsetX,  // e.g., 40
  cellOffsetY   // e.g., 10
);
```

### Current Collision Files

| Scene | SVG File | Dimensions | Offsets |
|-------|----------|------------|---------|
| Cell | cell-collision.svg | 240×160 | Yes (40, 10) |
| Sewer | sewer-collision.svg | 288×192 | Yes (16, -6) |
| Corridor | corridor-collision.svg | 320×320 | No |
| Warehouse Main | warehouse-main-collision.svg | 480×288 | No |
| Storage Bay | storage-bay-collision.svg | 400×320 | No |
| Loading Dock | loading-dock-collision.svg | 512×288 | No |
| Security Office | security-office-collision.svg | 400×352 | Yes (0, 0) |
| Maintenance Tunnel | maintenance-tunnel-collision.svg | 480×256 | Yes (-80, -38) |
| Executive Wing | executive-wing-collision.svg | 544×320 | TBD |
| Rooftop Helipad | rooftop-helipad-collision.svg | TBD | TBD |

---

## SVG Exits/Spawns System

### Overview
The exits/spawns system uses color-coded SVG elements to define:
- Enter zones (return to previous scene)
- Exit zones (progress to next scene)
- Spawn points for each entry direction

### File Location
`/public/assets/exits/[scene-name]-exits.svg`

### Color Coding

| Color | Element Type | Purpose |
|-------|--------------|---------|
| Blue (#0D1DFF) | Rectangle | Enter zone (can return to previous scene) |
| Blue (#0D1DFF) | Circle | Enter spawn point (where player appears when entering) |
| Black (#000000) | Rectangle | Exit zone (progress to next scene) |
| Black (#000000) | Circle | Exit spawn point (where player appears when returning) |

### SVG Structure Example
```svg
<svg width="512" height="288" viewBox="0 0 512 288" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Enter zone (blue rectangle) -->
  <rect x="38.5" y="0" width="52.125" height="21.38" fill="#0D1DFF"/>

  <!-- Exit zone (black rectangle) -->
  <rect x="442.375" y="266.62" width="52.125" height="21.38" fill="black"/>

  <!-- Enter spawn (blue circle) -->
  <circle cx="64.5625" cy="49.1305" r="8" fill="#0D1DFF"/>

  <!-- Exit spawn (black circle) -->
  <circle cx="468.438" cy="254.677" r="8" fill="black"/>
</svg>
```

### Parser Details
```javascript
SVGExitParser.parseSVGFile(svgPath, offsetX?, offsetY?)
```

**Returns:** Object with:
```javascript
{
  enterZone: { x, y, width, height },  // Blue rectangle
  exitZone: { x, y, width, height },   // Black rectangle
  enterSpawn: { x, y },                // Blue circle
  exitSpawn: { x, y }                  // Black circle
}
```

### Scene Integration (BaseRoomScene Helper)
```javascript
const spawnPos = await this.setupExitsFromSVG(svgPath, exitConfig, offsetX?, offsetY?);
this.createPlayer(spawnPos.x, spawnPos.y);
```

**Exit Config Structure:**
```javascript
{
  enterZone: {
    scene: "PreviousScene",      // Scene this exit leads to
    direction: "north",           // Direction to pass to target scene
    entryDirection: "south"       // When THIS scene has this direction, use enterSpawn
  },
  exitZone: {
    scene: "NextScene",
    direction: "south",
    entryDirection: "north"
  }
}
```

### Example: LoadingDockScene
```javascript
const spawnPos = await this.setupExitsFromSVG("assets/exits/loading-dock-exits.svg", {
  enterZone: {
    scene: "StorageBayScene",
    direction: "north",      // Going back north to StorageBay
    entryDirection: "south"  // When entering from south (from StorageBay)
  },
  exitZone: {
    scene: "SecurityOfficeScene",
    direction: "south",      // Going south to SecurityOffice
    entryDirection: "north"  // When returning from north (from SecurityOffice)
  }
});
```

### Flow Example: StorageBay ↔ LoadingDock
1. **StorageBay → LoadingDock:**
   - Player exits StorageBay going "south"
   - LoadingDock receives `entryDirection="south"`
   - Uses `enterSpawn` (blue circle) - top of scene

2. **LoadingDock → SecurityOffice:**
   - Player exits LoadingDock going "south"
   - SecurityOffice receives `entryDirection="south"`

3. **SecurityOffice → LoadingDock (returning):**
   - Player exits SecurityOffice going "north"
   - LoadingDock receives `entryDirection="north"`
   - Uses `exitSpawn` (black circle) - bottom of scene

### Special Cases

#### Cell → Sewer (One-Way)
Cell scene has a hole that's one-way (can't return):
```javascript
// Cell has only exit zone (black), no enter zone
// Sewer has enter spawn (blue) for falling through hole
// Sewer has no blue enter zone (can't climb back up)
```

#### Testing Menu
When loading from testing menu, `entryDirection` is undefined, so scenes default to `enterSpawn` (blue circle).

### Current Exit Files

| Scene | Exits SVG | Dimensions | Enter → | Exit → |
|-------|-----------|------------|---------|--------|
| Cell | cell-exits.svg | 240×160 | (none) | Sewer |
| Sewer | sewer-exits.svg | 288×192 | (one-way from Cell) | Corridor |
| Corridor | corridor-exits.svg | 320×320 | Sewer | WarehouseMain |
| Warehouse Main | warehouse-main-exits.svg | 480×288 | Corridor | StorageBay |
| Storage Bay | storage-bay-exits.svg | 400×320 | WarehouseMain | LoadingDock |
| Loading Dock | loading-dock-exits.svg | 512×288 | StorageBay | SecurityOffice |
| Security Office | security-office-exits.svg | 400×352 | LoadingDock | MaintenanceTunnel |
| Maintenance Tunnel | maintenance-tunnel-exits.svg | 480×256 | SecurityOffice | ExecutiveWing |

---

## File Size Comparison

**All 8 exit SVG files:** 3.3 KB total
- Individual files: 220-507 bytes each
- Extremely lightweight!
- Much smaller than PNG equivalents would be

**Benefits of SVG:**
- ✅ Tiny file sizes (text-based)
- ✅ Resolution independent
- ✅ Precise coordinates
- ✅ Easy to edit in vector tools
- ✅ Git-friendly (readable diffs)
- ✅ No anti-aliasing issues
- ✅ Fast parsing

---

## Creating SVG Files

### Tools
- Figma (recommended)
- Inkscape
- Adobe Illustrator
- Any vector graphics editor

### Workflow
1. **Create artboard** matching scene dimensions exactly
2. **Import scene background** as reference layer
3. **Draw collision shapes** (any color, will be filled rectangles/polygons)
4. **For exits:** Draw blue rectangles for enter zones, black rectangles for exit zones
5. **Add spawn circles** (8px radius) in matching colors
6. **Export as SVG** with proper viewBox
7. **Verify dimensions** match scene size
8. **Test in game**

### Dimension Checklist
Always verify SVG matches scene:
```bash
# Check SVG dimensions
head -1 public/assets/exits/loading-dock-exits.svg
# Should show: width="512" height="288" viewBox="0 0 512 288"

# Check scene dimensions in code
grep -A3 "this.dockWidth\|this.dockHeight" src/scenes/rooms/LoadingDockScene.js
```

---

## Troubleshooting

### Issue: Exits not appearing correctly
- **Check:** SVG dimensions match scene dimensions
- **Check:** Colors are exactly #0D1DFF (blue) or #000000 (black)
- **Check:** Rectangles use fill attribute, not stroke
- **Check:** Coordinates are within scene bounds

### Issue: Spawn position wrong
- **Check:** Entry direction config matches scene flow
- **Check:** Circle coordinates include scene offsets if needed
- **Check:** Circle radius doesn't matter (center point is used)

### Issue: Player spawns in wrong location
- **Check:** entryDirection in exitConfig matches what previous scene sends
- **Check:** direction passed to target scene is correct

### Issue: Can't return to previous scene
- **Check:** Blue enter zone exists in SVG
- **Check:** enterZone config is defined
- **Check:** Blue rectangle is positioned correctly

---

## Migration Notes

All scenes have been migrated to use the SVG system as of the latest update. Manual exit creation and spawn positioning code has been removed in favor of SVG-based definitions.

**Removed from scenes:**
- Manual `createExit()` calls
- Hardcoded spawn position if/else blocks
- Collision debug toggle (keydown-C)

**Added to scenes:**
- `setupExitsFromSVG()` call with config
- SVG-based collision loading
- Consistent, maintainable structure
