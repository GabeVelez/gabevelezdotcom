# SVG Collision System

**Technical Specification for SVG-Based Collision in Half-a-Buck**

---

## Overview

The SVG Collision System allows collision boundaries to be designed visually in Figma and exported as lightweight SVG files. This replaces traditional tilemap-based collision with a more flexible, designer-friendly approach.

## Architecture

### Components

1. **SVGCollisionParser** (`src/utils/SVGCollisionParser.js`)
   - Fetches and parses SVG files
   - Extracts `<rect>` elements
   - Handles rotated rectangles (Figma's `rotate(-90)` transform)
   - Creates Phaser physics bodies
   - Implements caching for performance

2. **SVG Collision Files** (`public/assets/collision/`)
   - Small SVG files (~700 bytes each)
   - Define collision rectangles for each scene
   - Created in Figma, exported as SVG

3. **Scene Integration** (BaseRoomScene + individual scenes)
   - Loads collision during scene initialization
   - Stores collision bodies for player/guard interaction
   - Supports debug visualization

---

## Workflow

### 1. Design Collision in Figma

**Setup:**
- Create a frame matching scene dimensions
  - Cell: 240×160
  - Sewer: 288×192
  - Corridor: 320×320
- Use the rectangle tool to draw collision areas
- Rectangles can be rotated (system handles rotation)
- Color doesn't matter (will be red in debug mode)

**Best Practices:**
- Name layers descriptively (e.g., "Top Wall", "Left Shelf")
- Group related collision areas
- Use precise pixel values (avoid decimals when possible)
- Test with grid alignment (16px grid recommended)

### 2. Export from Figma

**Export Settings:**
- Format: SVG
- Ensure "Include 'id' attribute" is enabled
- Export at 1x scale
- No need to flatten or outline

**File Naming:**
- Pattern: `{scene-name}-collision.svg`
- Examples:
  - `cell-collision.svg`
  - `corridor-collision.svg`
  - `sewer-collision.svg`

### 3. Place in Assets

```bash
# Copy exported SVG to collision directory
cp ~/Downloads/cell-collision.svg public/assets/collision/
```

### 4. Load in Scene

```javascript
// In your scene's create() or initializeScene() method
const collisionBodies = await SVGCollisionParser.parseAndCreateBodies(
  this,                                    // Scene reference
  "assets/collision/cell-collision.svg",  // SVG path
  40,                                      // X offset (scene positioning)
  10                                       // Y offset (scene positioning)
);

// Store for collision system and player interaction
this.collisionBodies = collisionBodies;
```

---

## Technical Details

### SVG Parsing

**Supported Elements:**
- `<rect>` with attributes: `x`, `y`, `width`, `height`
- Rotated rectangles with `transform="rotate(-90 cx cy)"`

**Transform Handling:**

The parser automatically handles Figma's rotation transforms:

```javascript
// Figma exports rotated rectangles like this:
<rect x="0" y="0" width="320" height="16"
      transform="rotate(-90 160 8)"/>

// Parser calculates new position and dimensions:
const cx = 160;  // Rotation center X
const cy = 8;    // Rotation center Y

// After -90° rotation:
newX = cx;
newY = cy - width;
newWidth = height;
newHeight = width;
```

**Result:** A 320×16 horizontal rectangle rotated -90° becomes a 16×320 vertical rectangle.

### Physics Body Creation

Each rectangle becomes a Phaser physics body:

```javascript
// Create rectangle game object
const body = scene.add.rectangle(
  centerX,      // X position (center)
  centerY,      // Y position (center)
  width,        // Width
  height,       // Height
  0xff0000,     // Red color (for debug)
  0             // Alpha 0 (invisible by default)
);

// Add static physics
scene.physics.add.existing(body, true);

// Initially hidden
body.setVisible(false);

// Stored in array
collisionBodies.push(body);
```

**Properties:**
- **Static bodies** (immovable: true)
- **Rectangular collision shape**
- **Initially invisible** (toggled with C key)
- **Positioned with scene offsets** applied

### Caching System

**First Load:**
```javascript
// Fetch SVG file
const response = await fetch(svgPath);
const svgText = await response.text();

// Parse and extract rectangles
const collisionRects = parseSVG(svgText);

// Cache the results
SVGCollisionParser._cache.set(svgPath, collisionRects);
```

**Subsequent Loads:**
```javascript
// Check cache first
if (this._cache.has(svgPath)) {
  return this._cache.get(svgPath);  // Instant!
}
```

**Benefits:**
- First scene load: ~5ms to fetch and parse
- Subsequent loads: <1ms (instant retrieval)
- Cache persists for entire game session
- No re-fetching or re-parsing

### Collision Integration

**Player Collision:**
```javascript
// In scene's create() method
if (this.collisionBodies) {
  this.collisionBodies.forEach(body => {
    this.physics.add.collider(this.player, body);
  });
}
```

**Guard Collision:**
```javascript
// Guards also collide with collision bodies
this.guards.forEach(guard => {
  this.collisionBodies.forEach(body => {
    this.physics.add.collider(guard, body);
  });
});
```

**Vision System:**
- Collision bodies participate in ray-casting
- Walls block line of sight
- Uses Phaser's built-in physics collision checks

---

## Debug Visualization

### Toggle with C Key

**Implementation:**
```javascript
// In BaseRoomScene.js
_toggleCollisionDebug() {
  this._collisionDebugOn = !this._collisionDebugOn;

  // Toggle SVG collision bodies visibility
  if (this.collisionBodies) {
    this.collisionBodies.forEach(body => {
      body.setVisible(this._collisionDebugOn);
    });
  }
}
```

**Visual Appearance:**
- Red rectangles (#ff0000)
- 30% opacity (0.3 alpha)
- Overlaid on gameplay
- Clearly shows collision boundaries

**Use Cases:**
- Verify collision matches visual design
- Debug player getting stuck
- Fine-tune collision rectangles
- Validate rotation transforms

---

## File Sizes

Actual file sizes from current implementation:

```
cell-collision.svg      652 bytes
corridor-collision.svg  1,597 bytes
sewer-collision.svg     705 bytes
─────────────────────────────────
Total:                  2,954 bytes (~3 KB)
```

**Comparison to Tiled:**
- Tiled JSON map: ~10-50 KB (depending on layers)
- Tileset PNG: ~5-20 KB (for 16×16 tiles)
- **SVG approach: 95% smaller**

---

## Advantages

### Designer-Friendly
- Visual design in Figma (familiar tool)
- No need to learn Tiled
- Instant preview in design tool
- Easy iteration (export → refresh)

### Performance
- Tiny file sizes (~700 bytes each)
- Automatic caching (instant subsequent loads)
- No tileset images needed
- Minimal runtime overhead

### Flexibility
- Not constrained to tile grid
- Pixel-perfect positioning
- Rotated collision boxes
- Complex shapes via multiple rectangles

### Maintainability
- Collision lives in version control
- Easy to diff changes
- Clear relationship between visual and collision
- No binary tilemap files

---

## Limitations

### Current Implementation

**Only Rectangles:**
- No circles, polygons, or complex shapes
- Workaround: Approximate with multiple rectangles

**No Tilemap Features:**
- No tile properties or custom collision shapes per tile
- No animated tiles or tile variants
- Workaround: Use background images for visuals

**Manual Positioning:**
- Must manually specify scene offsets
- Workaround: Document offsets in scene comments

### Future Improvements

**Potential Enhancements:**
- Support for `<circle>` elements
- Support for `<polygon>` elements
- Automatic offset detection from SVG viewBox
- Layer-based collision groups
- Metadata in SVG (collision tags, properties)

---

## Migration Guide

### Converting from Tiled

**Step 1: Extract Collision Boundaries**
1. Open Tiled map
2. Note collision layer tiles
3. Identify rectangular regions

**Step 2: Recreate in Figma**
1. Create frame matching scene size
2. Draw rectangles matching collision regions
3. Export as SVG

**Step 3: Update Scene Code**
```javascript
// Old (Tiled)
const map = this.make.tilemap({ key: "warehouse" });
const wallsLayer = map.createLayer("Walls", tileset);
this.physics.add.collider(this.player, wallsLayer);

// New (SVG)
const collisionBodies = await SVGCollisionParser.parseAndCreateBodies(
  this,
  "assets/collision/warehouse-collision.svg",
  0,
  0
);
this.collisionBodies = collisionBodies;
collisionBodies.forEach(body => {
  this.physics.add.collider(this.player, body);
});
```

**Step 4: Test**
- Load scene
- Press C to verify collision boundaries
- Adjust rectangles in Figma if needed
- Re-export and test

---

## Best Practices

### Designing Collision

**1. Match Visual Design**
- Collision should align with visible walls/obstacles
- Extend collision slightly beyond visual edges (1-2px) to prevent clipping

**2. Use Consistent Thickness**
- Standard wall thickness: 16px (1 tile)
- Narrow barriers: 8px
- Thick walls: 24-32px

**3. Avoid Tiny Gaps**
- Minimum gap for player: 20px (player is 16px wide)
- Gaps smaller than player size create unreachable areas

**4. Test with Grid**
- Align to 16px grid when possible
- Makes collision predictable and clean

### File Organization

**Naming Convention:**
```
{scene-name}-collision.svg
```

**Examples:**
- `cell-collision.svg` (not `CellCollision.svg`)
- `warehouse-main-collision.svg` (not `warehouse_collision.svg`)

**Version Control:**
- Commit SVG files with scene updates
- Use descriptive commit messages
- Keep collision in sync with background images

### Performance

**Do:**
- Keep rectangle count reasonable (<20 per scene)
- Combine adjacent rectangles when possible
- Use caching (it's automatic)

**Don't:**
- Don't create hundreds of tiny rectangles
- Don't re-parse SVG every frame
- Don't disable caching

---

## Troubleshooting

### Common Issues

**Problem: Collision not appearing**
- Check SVG path is correct
- Verify offsetX and offsetY match scene positioning
- Press C to see if collision bodies are created

**Problem: Player walks through walls**
- Ensure `this.collisionBodies` is set before player creation
- Check collider is added: `this.physics.add.collider(player, body)`
- Verify collision bodies have physics enabled

**Problem: Rotated rectangles positioned incorrectly**
- Check rotation center (cx, cy) in SVG
- Verify transform is `rotate(-90 cx cy)` format
- Try exporting from Figma again (ensure no manual edits)

**Problem: Performance issues**
- Check rectangle count (should be <20 per scene)
- Verify caching is working (check console logs)
- Consider combining small rectangles into larger ones

### Debug Steps

**1. Enable Console Logging**
```javascript
// SVGCollisionParser logs automatically
console.log(`Parsed ${rects.length} collision rectangles`);
console.log(`Using cached collision data`);
```

**2. Enable Collision Debug**
- Press C key in-game
- Verify red rectangles appear
- Check alignment with visual design

**3. Check Physics Bodies**
- Open Phaser DevTools (if available)
- Inspect collision body properties
- Verify `immovable: true` and `static: true`

---

## API Reference

### SVGCollisionParser

**Static Methods:**

```javascript
/**
 * Parse SVG file and create physics bodies
 * @param {Phaser.Scene} scene - The scene to create bodies in
 * @param {string} svgPath - Path to SVG file (e.g., "assets/collision/cell-collision.svg")
 * @param {number} offsetX - X offset for positioning bodies in scene
 * @param {number} offsetY - Y offset for positioning bodies in scene
 * @returns {Promise<Phaser.GameObjects.Rectangle[]>} Array of collision bodies
 */
static async parseAndCreateBodies(scene, svgPath, offsetX, offsetY)

/**
 * Parse SVG file to extract collision rectangles
 * @param {string} svgPath - Path to SVG file
 * @returns {Promise<Array<{x, y, width, height}>>} Array of rectangle data
 */
static async parseSVGFile(svgPath)
```

**Cache:**
```javascript
// Access cache (for debugging)
SVGCollisionParser._cache.get(svgPath)

// Clear cache (if needed)
SVGCollisionParser._cache.clear()
```

---

## Examples

### Basic Scene Setup

```javascript
// In CellScene.js
async initializeScene() {
  const cellOffsetX = 40;
  const cellOffsetY = 10;

  // Load collision
  const collisionBodies = await SVGCollisionParser.parseAndCreateBodies(
    this,
    "assets/collision/cell-collision.svg",
    cellOffsetX,
    cellOffsetY
  );

  this.collisionBodies = collisionBodies;

  // Create player
  this.createPlayer(152, 90);

  // Add collision
  collisionBodies.forEach(body => {
    this.physics.add.collider(this.player, body);
  });
}
```

### Debug Toggle

```javascript
// In BaseRoomScene.js (already implemented)
create() {
  // Add keyboard shortcut
  this.input.keyboard.on('keydown-C', () => {
    this._toggleCollisionDebug();
  });
}

_toggleCollisionDebug() {
  this._collisionDebugOn = !this._collisionDebugOn;

  if (this.collisionBodies) {
    this.collisionBodies.forEach(body => {
      body.setVisible(this._collisionDebugOn);
    });
  }
}
```

---

## Changelog

### Version 1.0 (2026-02-24)
- Initial implementation
- Support for `<rect>` elements
- Rotation transform handling (rotate(-90))
- Automatic caching
- Debug visualization (C key)
- Implemented in Cell, Sewer, and Corridor scenes

---

**Document Version:** 1.0
**Last Updated:** 2026-02-24
**Author:** Gabe Velez
