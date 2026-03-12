/**
 * Scene Selector Overlay - HTML-based testing tool
 * Clean, crisp fonts and scrollable list of all scenes
 */

export class SceneSelectorOverlay {
  constructor() {
    this.overlay = null;
    this.game = null;
  }

  create(game) {
    this.game = game;

    // Create overlay container
    this.overlay = document.createElement('div');
    this.overlay.id = 'scene-selector-overlay';
    this.overlay.style.cssText = `
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.95);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      font-family: 'Orbitron', sans-serif;
    `;

    // Create content container
    const content = document.createElement('div');
    content.style.cssText = `
      background: #111;
      border: 3px solid #00ff88;
      border-radius: 8px;
      padding: 24px;
      max-width: 500px;
      max-height: 80vh;
      overflow-y: auto;
    `;

    // Title
    const title = document.createElement('h2');
    title.textContent = 'SCENE SELECTOR (TESTING)';
    title.style.cssText = `
      margin: 0 0 8px 0;
      font-family: 'Press Start 2P', monospace;
      font-size: 14px;
      color: #00ff88;
      text-align: center;
      letter-spacing: 2px;
    `;

    // Subtitle
    const subtitle = document.createElement('p');
    subtitle.textContent = 'Click a scene to test';
    subtitle.style.cssText = `
      margin: 0 0 20px 0;
      font-size: 12px;
      color: #888;
      text-align: center;
    `;

    // Scene list
    const scenes = [
      { name: "IntroScene", label: "Intro" },
      { name: "AbductionCutscene", label: "Abduction Cutscene" },
      { name: "CellScene", label: "Cell" },
      { name: "SewerScene", label: "Sewer" },
      { name: "WarehouseCorridorScene", label: "Warehouse Corridor" },
      { name: "WarehouseMainScene", label: "Warehouse Main" },
      { name: "StorageBayScene", label: "Storage Bay" },
      { name: "LoadingDockScene", label: "Loading Dock" },
      { name: "SecurityOfficeScene", label: "Security Office" },
      { name: "MaintenanceTunnelScene", label: "Maintenance Tunnel" },
      { name: "ExecutiveWingScene", label: "Executive Wing" },
      { name: "RooftopHelipadScene", label: "Rooftop Helipad" },
      { name: "SurroundedScene", label: "Surrounded" },
      { name: "GameOverScene", label: "Game Over" },
      { name: "EndingScene", label: "Ending" }
    ];

    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 8px;
    `;

    scenes.forEach(scene => {
      const button = document.createElement('button');
      button.textContent = scene.label;
      button.style.cssText = `
        background: #222;
        border: 2px solid #444;
        color: #fff;
        padding: 12px 16px;
        font-family: 'Orbitron', sans-serif;
        font-size: 13px;
        font-weight: 700;
        cursor: pointer;
        border-radius: 4px;
        transition: all 0.2s ease;
        text-align: left;
      `;

      button.addEventListener('mouseenter', () => {
        button.style.background = '#333';
        button.style.borderColor = '#00ff88';
        button.style.transform = 'translateX(4px)';
      });

      button.addEventListener('mouseleave', () => {
        button.style.background = '#222';
        button.style.borderColor = '#444';
        button.style.transform = 'translateX(0)';
      });

      button.addEventListener('click', () => {
        this.hide();
        this.game.scene.start(scene.name);
      });

      buttonContainer.appendChild(button);
    });

    // Instructions
    const instructions = document.createElement('p');
    instructions.textContent = 'Press ESC to close';
    instructions.style.cssText = `
      margin: 20px 0 0 0;
      font-size: 11px;
      color: #666;
      text-align: center;
    `;

    // Assemble
    content.appendChild(title);
    content.appendChild(subtitle);
    content.appendChild(buttonContainer);
    content.appendChild(instructions);
    this.overlay.appendChild(content);
    document.body.appendChild(this.overlay);

    // ESC to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.overlay.style.display === 'flex') {
        this.hide();
      }
    });
  }

  show() {
    if (this.overlay) {
      this.overlay.style.display = 'flex';
    }
  }

  hide() {
    if (this.overlay) {
      this.overlay.style.display = 'none';
    }
  }

  destroy() {
    if (this.overlay) {
      this.overlay.remove();
      this.overlay = null;
    }
  }
}
