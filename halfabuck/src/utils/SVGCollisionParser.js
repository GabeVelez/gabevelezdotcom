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

      // Extract all <rect> elements
      const rects = svgDoc.querySelectorAll('rect');
      const collisionRects = [];

      rects.forEach(rect => {
        let x = parseFloat(rect.getAttribute('x') || 0);
        let y = parseFloat(rect.getAttribute('y') || 0);
        let width = parseFloat(rect.getAttribute('width') || 0);
        let height = parseFloat(rect.getAttribute('height') || 0);

        // Handle transform="rotate(-90 cx cy)" - Figma exports horizontal rects this way
        const transform = rect.getAttribute('transform');
        if (transform && transform.includes('rotate(-90')) {
          // For -90 degree rotation, swap width/height and adjust position
          // The rect is rotated 90 degrees clockwise around point (cx, cy)
          const match = transform.match(/rotate\(-90\s+([\d.]+)\s+([\d.]+)\)/);
          if (match) {
            const cx = parseFloat(match[1]);
            const cy = parseFloat(match[2]);

            // After -90 rotation around (cx, cy):
            // New position and dimensions
            const newX = cx;
            const newY = cy - width;
            const newWidth = height;
            const newHeight = width;

            x = newX;
            y = newY;
            width = newWidth;
            height = newHeight;
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
