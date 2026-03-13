/**
 * SVG Exit Parser
 * Extracts enter/exit zones and spawn points from SVG files
 * Blue elements = Enter areas (re-enterable)
 * Black elements = Exit areas (progression)
 */

export class SVGExitParser {
  // Cache for parsed SVG data to avoid re-fetching
  static _cache = new Map();

  /**
   * Check if a color is blue (enter areas)
   * @param {string} color - Fill color from SVG
   * @returns {boolean}
   */
  static isBlue(color) {
    if (!color) return false;
    const normalized = color.toLowerCase().replace(/\s/g, '');
    // Match the specific blue used: #0D1DFF or similar blue shades
    return normalized.includes('0d1dff') ||
           normalized.includes('0d1d') ||
           normalized === 'blue' ||
           normalized === '#00f' ||
           normalized === '#0000ff';
  }

  /**
   * Check if a color is black (exit areas)
   * @param {string} color - Fill color from SVG
   * @returns {boolean}
   */
  static isBlack(color) {
    if (!color) return false;
    const normalized = color.toLowerCase().replace(/\s/g, '');
    return normalized === 'black' ||
           normalized === '#000000' ||
           normalized === '#000' ||
           normalized === 'rgb(0,0,0)';
  }

  /**
   * Fetch and parse SVG file to extract exit/enter data
   * @param {string} svgPath - Path to the SVG file (e.g., "assets/exits/storage-bay-exits.svg")
   * @returns {Promise<{enterZone: object, enterSpawn: object, exitZone: object, exitSpawn: object}>}
   */
  static async parseSVGFile(svgPath, offsetX = 0, offsetY = 0) {
    // Create cache key with offsets
    const cacheKey = `${svgPath}_${offsetX}_${offsetY}`;

    // Check cache first
    if (this._cache.has(cacheKey)) {
      console.log(`Using cached exit data for "${svgPath}"`);
      return this._cache.get(cacheKey);
    }

    try {
      // Fetch the SVG file
      console.log(`Fetching exit SVG from: ${svgPath}`);
      const response = await fetch(svgPath);
      if (!response.ok) {
        console.error(`Failed to fetch SVG file: ${svgPath}, status: ${response.status}`);
        return null;
      }

      const svgText = await response.text();
      console.log(`Fetched SVG, length: ${svgText.length} characters`);

      // Parse SVG string to DOM
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');

      // Check for parsing errors
      const parserError = svgDoc.querySelector('parsererror');
      if (parserError) {
        console.warn(`SVG parsing error for ${svgPath}:`, parserError);
        return null;
      }

      const exitData = {
        enterZone: null,
        enterSpawn: null,
        exitZone: null,
        exitSpawn: null
      };

      // Extract all <rect> elements
      const rects = svgDoc.querySelectorAll('rect');
      console.log(`Found ${rects.length} rectangles in SVG`);
      rects.forEach(rect => {
        const fill = rect.getAttribute('fill');
        const x = parseFloat(rect.getAttribute('x') || 0) + offsetX;
        const y = parseFloat(rect.getAttribute('y') || 0) + offsetY;
        const width = parseFloat(rect.getAttribute('width') || 0);
        const height = parseFloat(rect.getAttribute('height') || 0);

        console.log(`  Rect: fill="${fill}", pos=(${x},${y}), size=(${width}×${height})`);

        if (this.isBlue(fill)) {
          exitData.enterZone = { x, y, width, height };
          console.log(`    → Identified as ENTER zone (blue)`);
        } else if (this.isBlack(fill)) {
          exitData.exitZone = { x, y, width, height };
          console.log(`    → Identified as EXIT zone (black)`);
        }
      });

      // Extract all <circle> elements
      const circles = svgDoc.querySelectorAll('circle');
      console.log(`Found ${circles.length} circles in SVG`);
      circles.forEach(circle => {
        const fill = circle.getAttribute('fill');
        const cx = parseFloat(circle.getAttribute('cx') || 0) + offsetX;
        const cy = parseFloat(circle.getAttribute('cy') || 0) + offsetY;

        console.log(`  Circle: fill="${fill}", pos=(${cx},${cy})`);

        if (this.isBlue(fill)) {
          exitData.enterSpawn = { x: cx, y: cy };
          console.log(`    → Identified as ENTER spawn (blue)`);
        } else if (this.isBlack(fill)) {
          exitData.exitSpawn = { x: cx, y: cy };
          console.log(`    → Identified as EXIT spawn (black)`);
        }
      });

      console.log(`Parsed exit data from "${svgPath}":`, exitData);

      // Cache the results for future use
      this._cache.set(cacheKey, exitData);

      return exitData;
    } catch (error) {
      console.error(`Error parsing SVG file ${svgPath}:`, error);
      return null;
    }
  }
}
