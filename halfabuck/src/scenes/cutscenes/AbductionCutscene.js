import Phaser from "phaser";

export class AbductionCutscene extends Phaser.Scene {
  constructor() {
    super("AbductionCutscene");

    // Define all cutscene frames with timing and text
    // Sound handling is done separately in showFrame() for better control
    this.frames = [
      {
        image: "cutscene_abduction_01",
        duration: 2200, // +10% (was 2000)
        text: ["EN ROUTE TO MY BIRTHDAY PARTY TONIGHT"]
      },
      {
        image: "cutscene_abduction_02",
        duration: 2200, // +10% (was 2000)
        text: ["GUBER BLACK - CONFIRMED"]
      },
      {
        image: "cutscene_abduction_03",
        duration: 2625, // +5% (was 2500)
        text: ["ON THE MAJOR DEEGAN"]
      },
      {
        image: "cutscene_abduction_04",
        duration: 2100, // +5% (was 2000)
        text: ["ON MY WAY TO THE PARTY!"]
      },
      {
        image: "cutscene_abduction_05",
        duration: 1500,
        text: [] // No text, just door lock sound
      },
      {
        image: "cutscene_abduction_06",
        duration: 1500,
        text: [] // No text, partition starts raising
      },
      {
        image: "cutscene_abduction_07",
        duration: 1500,
        text: [] // No text, partition sealed
      },
      {
        image: "cutscene_abduction_08",
        duration: 1575, // +5% (was 1500)
        text: ["WHAT THA HELL!"]
      },
      {
        image: "cutscene_abduction_09",
        duration: 1500,
        text: ["LET ME OUT!"]
      },
      {
        image: "cutscene_abduction_10",
        duration: 1575, // +5% (was 1500)
        text: ["LOSING CONSCIOUSNESS..."]
      }
    ];

    this.currentFrame = 0;
    this.skipped = false;

    // Track active sounds for cleanup
    this.activeSounds = {
      uptownFunk: null,
      carDriving: null,
      alarm: null,
      gasFlow: null
    };
  }

  preload() {
    // Load all cutscene images
    for (let i = 1; i <= 10; i++) {
      const frameNum = i.toString().padStart(2, '0');
      this.load.image(
        `cutscene_abduction_${frameNum}`,
        `assets/cutscenes/abduction/cutscene_abduction_${frameNum}.png`
      );
    }

    // Load music
    this.load.audio('uptown_funk', 'assets/audio/music/uptownfunk.mp3');

    // Load sound effects
    this.load.audio('car_driving', 'assets/sounds/cutscenes/random_car_driving.mp3');
    this.load.audio('door_lock', 'assets/sounds/cutscenes/door_lock.mp3');
    this.load.audio('partition_raise', 'assets/sounds/cutscenes/partition_raise.mp3');
    this.load.audio('alarm', 'assets/sounds/cutscenes/alarm.mp3');
    this.load.audio('gas_flow', 'assets/sounds/cutscenes/gas_flow.mp3');
    this.load.audio('man_coughing', 'assets/sounds/cutscenes/man coughing.mp3');
  }

  create() {
    const { width, height } = this.scale;

    // Hide HTML UI overlay during cutscene
    const gameUI = this.registry.get("gameUI");
    if (gameUI) {
      gameUI.setVisible(false);
    }

    // Black background
    this.add.rectangle(0, 0, width, height, 0x000000).setOrigin(0, 0);

    // Container for current frame image
    this.currentImage = null;

    // Container for text objects
    this.textObjects = [];

    // Letterbox bars (cinematic black bars at top and bottom)
    const letterboxHeight = 20; // Height of each bar
    this.topLetterbox = this.add.rectangle(0, 0, width, letterboxHeight, 0x000000).setOrigin(0, 0).setDepth(10);
    this.bottomLetterbox = this.add.rectangle(0, height - letterboxHeight, width, letterboxHeight, 0x000000).setOrigin(0, 0).setDepth(10);

    // Skip instruction (in top letterbox, right aligned)
    this.skipText = this.add.text(width - 5, 6, "PRESS SPACE TO SKIP", {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: "6px",
      color: "#888888"
    }).setOrigin(1, 0).setDepth(11);

    // Skip listener - SPACE key only
    this.input.keyboard.on("keydown-SPACE", () => {
      if (!this.skipped) {
        this.skipCutscene();
      }
    });

    // Start showing frames
    this.showFrame(0);
  }

  showFrame(index) {
    const { width, height } = this.scale;

    // Clear previous frame
    if (this.currentImage) {
      this.currentImage.destroy();
    }
    this.textObjects.forEach(text => text.destroy());
    this.textObjects = [];

    // Check if we've shown all frames
    if (index >= this.frames.length) {
      // Show fade to black, then awakening text
      this.showBlackTransition();
      return;
    }

    const frame = this.frames[index];
    this.currentFrame = index;

    // Display the frame image (scaled to fit canvas)
    // Offset Y position downward by 12px to keep faces clear of top letterbox
    this.currentImage = this.add.image(width / 2, height / 2 + 12, frame.image);

    // Scale image to cover canvas while maintaining aspect ratio
    const scaleX = width / this.currentImage.width;
    const scaleY = height / this.currentImage.height;
    const scale = Math.max(scaleX, scaleY);
    this.currentImage.setScale(scale);

    // Fade in image
    this.currentImage.setAlpha(0);
    this.tweens.add({
      targets: this.currentImage,
      alpha: 1,
      duration: 300,
      ease: 'Power2'
    });

    // Display text overlays if any (in bottom letterbox area)
    if (frame.text && frame.text.length > 0) {
      const letterboxBottom = height - 20; // Bottom letterbox starts here
      const textY = letterboxBottom + 10; // Center text in letterbox

      frame.text.forEach((line, i) => {
        // Add semi-transparent background behind text for better legibility
        const padding = 4;
        const tempText = this.add.text(0, 0, line, {
          fontFamily: "'Orbitron', sans-serif",
          fontSize: "10px"
        });
        const textWidth = tempText.width;
        const textHeight = tempText.height;
        tempText.destroy();

        // Dark background box
        this.add.rectangle(
          width / 2,
          textY + (i * 12),
          textWidth + padding * 2,
          textHeight + padding,
          0x000000,
          0.7
        ).setDepth(10);

        // Text with better styling
        const textObj = this.add.text(width / 2, textY + (i * 12), line, {
          fontFamily: "'Orbitron', sans-serif",
          fontSize: "10px",
          color: "#ffffff",
          stroke: "#000000",
          strokeThickness: 4,
          align: "center",
          fontStyle: "bold"
        }).setOrigin(0.5).setDepth(11);

        // Fade in text
        textObj.setAlpha(0);
        this.tweens.add({
          targets: textObj,
          alpha: 1,
          duration: 300,
          delay: 200,
          ease: 'Power2'
        });

        this.textObjects.push(textObj);
      });
    }

    // Handle sound effects based on frame
    this.playSoundsForFrame(index);

    // Set timer for next frame
    this.time.delayedCall(frame.duration, () => {
      if (!this.skipped) {
        this.showFrame(index + 1);
      }
    });
  }

  showBlackTransition() {
    const { width, height } = this.scale;

    // Fade current image to black
    if (this.currentImage) {
      this.tweens.add({
        targets: this.currentImage,
        alpha: 0,
        duration: 1000,
        ease: 'Power2'
      });
    }
    this.textObjects.forEach(text => {
      this.tweens.add({
        targets: text,
        alpha: 0,
        duration: 1000,
        ease: 'Power2'
      });
    });

    // Hold black screen for 2 seconds, then show awakening
    this.time.delayedCall(2000, () => {
      if (!this.skipped) {
        this.showAwakening();
      }
    });
  }

  showAwakening() {
    const { width, height } = this.scale;

    // Hide skip instruction (awakening screen cannot be skipped)
    if (this.skipText) {
      this.skipText.destroy();
    }
    if (this.topLetterbox) {
      this.topLetterbox.destroy();
    }
    if (this.bottomLetterbox) {
      this.bottomLetterbox.destroy();
    }

    // Show cell scene background (if we have it loaded)
    // For now, keep black and just show text

    // Define text messages
    const messages = [
      {
        text: "UNKNOWN LOCATION",
        y: height / 2 - 15,
        fontSize: "10px",
        color: "#ffffff"
      },
      {
        text: "MISSION:",
        y: height / 2 + 5,
        fontSize: "9px",
        color: "#00ff00"
      },
      {
        text: "ESCAPE BY ALL MEANS!",
        y: height / 2 + 15,
        fontSize: "9px",
        color: "#00ff00"
      }
    ];

    // Always use typewriter effect (looks great!)
    const typeSpeed = 75;

    // Create text objects (empty initially)
    const textObjects = messages.map((msg) => {
      return this.add.text(width / 2, msg.y, "", {
        fontFamily: "'Orbitron', sans-serif",
        fontSize: msg.fontSize,
        color: msg.color,
        stroke: "#000000",
        strokeThickness: 3
      }).setOrigin(0.5);
    });

    // Typewriter effect for first message (UNKNOWN LOCATION)
    this.typewriterText(textObjects[0], messages[0].text, typeSpeed, 0);

    // Typewriter effect for second message (MISSION:) - starts after first finishes
    const delay1 = messages[0].text.length * typeSpeed + 500;
    this.typewriterText(textObjects[1], messages[1].text, typeSpeed, delay1);

    // Typewriter effect for third message (ESCAPE BY ALL MEANS!) - starts after second finishes
    const delay2 = delay1 + messages[1].text.length * typeSpeed + 300;
    this.typewriterText(textObjects[2], messages[2].text, typeSpeed, delay2);

    // After all text shown, wait 2 seconds then smoothly transition to game
    const totalDuration = delay2 + (messages[2].text.length * typeSpeed) + 2000;
    this.time.delayedCall(totalDuration, () => {
      this.transitionToGame(textObjects);
    });
  }

  typewriterText(textObject, fullText, charDelay, startDelay) {
    let currentIndex = 0;

    this.time.delayedCall(startDelay, () => {
      const typingEvent = this.time.addEvent({
        delay: charDelay,
        callback: () => {
          if (this.skipped) {
            typingEvent.remove();
            return;
          }

          if (currentIndex < fullText.length) {
            textObject.setText(fullText.substring(0, currentIndex + 1));
            currentIndex++;
          } else {
            typingEvent.remove();
          }
        },
        loop: true
      });
    });
  }

  transitionToGame(textObjects = []) {
    // Stop all sounds before transitioning
    this.stopAllSounds();

    // Fade out awakening text to black
    textObjects.forEach(textObj => {
      this.tweens.add({
        targets: textObj,
        alpha: 0,
        duration: 1000,
        ease: 'Power2'
      });
    });

    // Fade camera to black
    this.cameras.main.fadeOut(1000, 0, 0, 0);

    // After fade completes, start CellScene
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('CellScene');
    });
  }

  playSoundsForFrame(frameIndex) {
    const soundEnabled = this.registry.get("soundEnabled");
    if (!soundEnabled) return;

    // Frame 1: Start Uptown Funk music (loops through entire cutscene)
    if (frameIndex === 0) { // Index 0 = Frame 1
      this.activeSounds.uptownFunk = this.sound.add('uptown_funk', {
        loop: true,
        volume: 0.6
      });
      this.activeSounds.uptownFunk.play();
    }

    // Frame 3: Reduce Uptown Funk to 6% volume (subtle background music)
    if (frameIndex === 2) { // Index 2 = Frame 3
      if (this.activeSounds.uptownFunk && this.activeSounds.uptownFunk.isPlaying) {
        this.tweens.add({
          targets: this.activeSounds.uptownFunk,
          volume: 0.06, // 6% volume (10% of original 0.6)
          duration: 1000,
          ease: 'Power2'
        });
      }
    }

    // Frame 3: Start car driving (loops in background through frame 10)
    if (frameIndex === 2) { // Index 2 = Frame 3
      this.activeSounds.carDriving = this.sound.add('car_driving', {
        loop: true,
        volume: 0.4
      });
      this.activeSounds.carDriving.play();
    }

    // Frame 5: Door lock sound
    if (frameIndex === 4) { // Index 4 = Frame 5
      this.sound.play('door_lock', { volume: 0.8 });
    }

    // Frame 6: Partition starts raising
    if (frameIndex === 5) { // Index 5 = Frame 6
      this.sound.play('partition_raise', { volume: 0.7 });
    }

    // Frame 8: Alarm starts (continues through frames 8-9, fades in frame 10)
    if (frameIndex === 7) { // Index 7 = Frame 8
      this.activeSounds.alarm = this.sound.add('alarm', {
        loop: true,
        volume: 0.6
      });
      this.activeSounds.alarm.play();
    }

    // Frame 9: Gas flow starts, then coughing after delay
    if (frameIndex === 8) { // Index 8 = Frame 9
      // Start gas flow (continues into frame 10)
      this.activeSounds.gasFlow = this.sound.add('gas_flow', {
        loop: true,
        volume: 0.5
      });
      this.activeSounds.gasFlow.play();

      // Coughing starts after gas (500ms delay)
      this.time.delayedCall(500, () => {
        if (!this.skipped) {
          this.sound.play('man_coughing', { volume: 0.7 });
        }
      });
    }

    // Frame 10: Fade out alarm, music, and gas flow
    if (frameIndex === 9) { // Index 9 = Frame 10
      // Fade out alarm
      if (this.activeSounds.alarm && this.activeSounds.alarm.isPlaying) {
        this.tweens.add({
          targets: this.activeSounds.alarm,
          volume: 0,
          duration: 1500,
          ease: 'Power2',
          onComplete: () => {
            if (this.activeSounds.alarm) {
              this.activeSounds.alarm.stop();
            }
          }
        });
      }

      // Fade out Uptown Funk
      if (this.activeSounds.uptownFunk && this.activeSounds.uptownFunk.isPlaying) {
        this.tweens.add({
          targets: this.activeSounds.uptownFunk,
          volume: 0,
          duration: 1500,
          ease: 'Power2',
          onComplete: () => {
            if (this.activeSounds.uptownFunk) {
              this.activeSounds.uptownFunk.stop();
            }
          }
        });
      }

      // Fade out gas flow
      if (this.activeSounds.gasFlow && this.activeSounds.gasFlow.isPlaying) {
        this.tweens.add({
          targets: this.activeSounds.gasFlow,
          volume: 0,
          duration: 1500,
          ease: 'Power2',
          onComplete: () => {
            if (this.activeSounds.gasFlow) {
              this.activeSounds.gasFlow.stop();
            }
          }
        });
      }
    }
  }

  stopAllSounds() {
    // Stop all active looping sounds
    if (this.activeSounds.uptownFunk && this.activeSounds.uptownFunk.isPlaying) {
      this.activeSounds.uptownFunk.stop();
    }
    if (this.activeSounds.carDriving && this.activeSounds.carDriving.isPlaying) {
      this.activeSounds.carDriving.stop();
    }
    if (this.activeSounds.alarm && this.activeSounds.alarm.isPlaying) {
      this.activeSounds.alarm.stop();
    }
    if (this.activeSounds.gasFlow && this.activeSounds.gasFlow.isPlaying) {
      this.activeSounds.gasFlow.stop();
    }
  }

  skipCutscene() {
    // Stop all timers and tweens
    this.time.removeAllEvents();
    this.tweens.killAll();

    // Stop all sounds
    this.stopAllSounds();

    // Clear current frame
    if (this.currentImage) {
      this.currentImage.destroy();
    }
    this.textObjects.forEach(text => text.destroy());
    this.textObjects = [];

    // Go to awakening screen (will show typewriter effect)
    this.showAwakening();
  }
}
