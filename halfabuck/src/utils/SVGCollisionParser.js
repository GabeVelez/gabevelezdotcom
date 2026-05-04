/**
 * SVG Collision Parser
 * Extracts rectangle collision data from SVG files created in Figma
 */

export class SVGCollisionParser {
  // Cache for parsed SVG data to avoid re-fetching
  static _cache = new Map();

  /**
   * Fetch and parse SVG file to extract collision rectangles
   * @param {string} svgPath - Path to the SVG file (e.g., "assets/collision/cell-collision.svg")
   * @returns {Promise<Array<{x: number, y: number, width: number, height: number}>>}
   */
  static async parseSVGFile(svgPath) {
    // Check cache first
    if (this._cache.has(svgPath)) {
      console.log(`Using cached collision data for "${svgPath}"`);
      return this._cache.get(svgPath);
    }
    try {
      // Fetch the SVG file
      const response = await fetch(svgPath);
      if (!response.ok) {
        console.warn(`Failed to fetch SVG file: ${svgPath}`);
        return [];
      }

      const svgText = await response.text();

      // Parse SVG string to DOM
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');

      // Check for parsing errors
      const parserError = svgDoc.querySelector('parsererror');
      if (parserError) {
        console.warn(`SVG parsing error for ${svgPath}:`, parserError);
        return [];
      }

      // Extract <rect> elements — but skip any inside <defs>/<clipPath>,
      // which Figma adds as a full-canvas clipping mask (not a real wall).
      const rects = Array.from(svgDoc.querySelectorAll('rect'))
        .filter(r => !r.closest('defs') && !r.closest('clipPath'));
      const collisionRects = [];

      rects.forEach(rect => {
        let x = parseFloat(rect.getAttribute('x') || 0);
        let y = parseFloat(rect.getAttribute('y') || 0);
        let width = parseFloat(rect.getAttribute('width') || 0);
        let height = parseFloat(rect.getAttribute('height') || 0);

        const transform = rect.getAttribute('transform');
        if (transform) {
          // Handle transform="rotate(-90 cx cy)" - Figma's per-rect rotation form
          const rotMatch = transform.match(/rotate\(-90\s+([\d.]+)\s+([\d.]+)\)/);
          // Handle transform="matrix(a b c d e f)" - Figma's other rotation export form
          const matMatch = transform.match(/matrix\(\s*(-?[\d.]+)[ ,]+(-?[\d.]+)[ ,]+(-?[\d.]+)[ ,]+(-?[\d.]+)[ ,]+(-?[\d.]+)[ ,]+(-?[\d.]+)\s*\)/);

          if (rotMatch) {
            const cy = parseFloat(rotMatch[2]);
            const newX = parseFloat(rotMatch[1]);
            const newY = cy - width;
            const newWidth = height;
            const newHeight = width;
            x = newX;
            y = newY;
            width = newWidth;
            height = newHeight;
          } else if (matMatch) {
            // Apply the matrix to all 4 corners and take the axis-aligned bounding box.
            // matrix(a b c d e f) maps (px, py) -> (a*px + c*py + e, b*px + d*py + f)
            const a = parseFloat(matMatch[1]);
            const b = parseFloat(matMatch[2]);
            const c = parseFloat(matMatch[3]);
            const d = parseFloat(matMatch[4]);
            const e = parseFloat(matMatch[5]);
            const f = parseFloat(matMatch[6]);
            const corners = [
              [x, y],
              [x + width, y],
              [x, y + height],
              [x + width, y + height],
            ].map(([px, py]) => [a * px + c * py + e, b * px + d * py + f]);
            const xs = corners.map(p => p[0]);
            const ys = corners.map(p => p[1]);
            const minX = Math.min(...xs);
            const maxX = Math.max(...xs);
            const minY = Math.min(...ys);
            const maxY = Math.max(...ys);
            x = minX;
            y = minY;
            width = maxX - minX;
            height = maxY - minY;
          }
        }

        if (width > 0 && height > 0) {
          collisionRects.push({ x, y, width, height });
        }
      });

      console.log(`Parsed ${collisionRects.length} collision rectangles from "${svgPath}"`);

      // Cache the results for future use
      this._cache.set(svgPath, collisionRects);

      return collisionRects;
    } catch (error) {
      console.error(`Error parsing SVG file ${svgPath}:`, error);
      return [];
    }
  }

  /**
   * Create Phaser physics bodies from collision rectangles
   * @param {Phaser.Scene} scene - The scene context
   * @param {Array<{x: number, y: number, width: number, height: number}>} rects - Collision rectangles
   * @param {number} offsetX - X offset to apply to all bodies (default 0)
   * @param {number} offsetY - Y offset to apply to all bodies (default 0)
   * @returns {Array<Phaser.GameObjects.Rectangle>} - Array of physics-enabled rectangles
   */
  static createPhysicsBodies(scene, rects, offsetX = 0, offsetY = 0) {
    const bodies = [];

    rects.forEach((rect, index) => {
      // Create rectangle at the collision position with offset applied
      // Phaser rectangles are positioned by their center, so adjust coordinates
      const centerX = rect.x + rect.width / 2 + offsetX;
      const centerY = rect.y + rect.height / 2 + offsetY;

      const body = scene.add.rectangle(
        centerX,
        centerY,
        rect.width,
        rect.height,
        0xff0000,  // Red color
        0.3        // Semi-transparent for debug - will be hidden with setVisible(false)
      );

      // Make it a static physics body AFTER positioning
      scene.physics.add.existing(body, true);

      // Start invisible - can be toggled with C key
      body.setVisible(false);

      console.log(`Collision body ${index}: pos=(${centerX}, ${centerY}), size=(${rect.width}, ${rect.height}), hasBody=${!!body.body}, immovable=${body.body?.immovable}`);

      bodies.push(body);
    });

    console.log(`Created ${bodies.length} collision bodies with offset (${offsetX}, ${offsetY})`);
    return bodies;
  }

  /**
   * Parse SVG file and create physics bodies in one step
   * @param {Phaser.Scene} scene - The scene context
   * @param {string} svgPath - Path to the SVG file
   * @param {number} offsetX - X offset to apply to all bodies (default 0)
   * @param {number} offsetY - Y offset to apply to all bodies (default 0)
   * @returns {Promise<Array<Phaser.GameObjects.Rectangle>>} - Promise resolving to array of physics-enabled rectangles
   */
  static async parseAndCreateBodies(scene, svgPath, offsetX = 0, offsetY = 0) {
    const rects = await this.parseSVGFile(svgPath);
    return this.createPhysicsBodies(scene, rects, offsetX, offsetY);
  }
}
