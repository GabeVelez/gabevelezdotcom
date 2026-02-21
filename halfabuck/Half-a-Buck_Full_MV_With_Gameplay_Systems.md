# HALF-A-BUCK

## Mission: Brooklyn

### 16-Bit Tactical Stealth Birthday Game

**Full MV Design Document -- Gameplay Systems Included**

------------------------------------------------------------------------

# 1. CORE CONCEPT

On the night of your 50th birthday, you leave your Whitestone apartment
heading to Brooklyn to celebrate.

You never arrive.

Intercepted by the fictional villain organization known as the HATE
Brigade, you awaken inside a mysterious compound.

Your mission: Escape. Reach Brooklyn. Celebrate.

Tone: Retro 16-bit stealth thriller with cinematic tension and a
triumphant birthday twist.

------------------------------------------------------------------------

# 2. PLATFORM & TECH STACK

Target Platform: HTML5 (Browser-based)\
Framework: Phaser.js\
Hosting: GitHub Pages (via GabeVelez.com)\
Visual Style: Clean 16-bit top-down stealth aesthetic (SNES-inspired)

------------------------------------------------------------------------

# 3. OPENING CINEMATIC SCRIPT

## Scene 1 --- Interior: Whitestone

INTERIOR: WHITESTONE\
AGE: 50\
STATUS: HALF-A-BUCK\
DESTINATION: BROOKLYN

"Fifty years. Let's move."

------------------------------------------------------------------------

## Scene 2 --- En Route

ETA: 21 MINUTES\
"Something feels... off."

Radio glitches.\
Green vapor fills screen.\
Blackout.

"Intercepted."

------------------------------------------------------------------------

# 4. AWAKENING

UNKNOWN LOCATION\
ABDUCTED BY: HATE BRIGADE\
OBJECTIVE: PREVENT BROOKLYN ARRIVAL\
BIRTHDAY STATUS: COMPROMISED

Player ties red bandana.

NEW STATUS: ACTIVE

------------------------------------------------------------------------

# 5. CORE GAMEPLAY SYSTEMS

## 5.1 Player State Machine

Player can be in one of these states:

-   Idle
-   Walking
-   Crouching
-   Knockout Animation
-   Dragging Body
-   Hiding (Box / Locker)
-   Detected
-   Parachuting

Movement Speeds: - Walk: 100% - Crouch: 60% - Drag: 50% - Box Shuffle:
40%

------------------------------------------------------------------------

## 5.2 Enemy AI State Machine

Enemy States:

-   Patrol
-   Suspicious
-   Alert
-   Searching
-   Returning

### Patrol

Default route following predefined waypoints.

### Suspicious

Triggered by: - Edge of vision cone - Noise - Distractions

Investigates briefly, then returns to patrol.

### Alert

Triggered by: - Full detection - Body discovered - Close fire usage

Immediate pursuit.

### Searching

Triggered after losing sight of player. Wider movement around last known
location.

------------------------------------------------------------------------

## 5.3 Vision Cone System

Each enemy has:

-   Angle (60°--120° depending on type)
-   Distance
-   Detection meter (fills over 1--2 seconds)

Detection drains if player exits cone.

Enemy Types:

Guards: - Small cone - Medium distance

Lead Guards: - Wider cone - Longer distance

Overseer Soldiers: - Narrow but long cone - Slower movement

------------------------------------------------------------------------

## 5.4 Alert Levels (Optional Global System)

Level 0 -- Normal\
Level 1 -- Suspicious\
Level 2 -- Active Alert

Higher levels increase patrol speed and cone overlap.

MVP may keep alerts local per enemy.

------------------------------------------------------------------------

## 5.5 Knockout & Body System

-   Must approach from behind
-   1 second wind-up animation
-   Non-lethal only

Body Rules: - Left exposed → triggers alert - Hidden in locker/dark zone
→ safe - Hidden via box zone → safe

------------------------------------------------------------------------

## 5.6 Cardboard Box Mechanic

-   Sprite swaps to box
-   Movement slowed
-   Guards ignore if stationary
-   Moving box in full vision triggers Suspicious state

------------------------------------------------------------------------

# 6. BOARD STRUCTURE

## Board 1 --- Warehouse

Introduces: - Basic stealth - Box mechanic - Guards + 1 Lead Guard

------------------------------------------------------------------------

## Board 2 --- Wine Cellar Maze

New Mechanic: Molotov distraction tool (environmental use only)

Enemies: - 2 Lead Guards - 1 Overseer

------------------------------------------------------------------------

## Board 3 --- Cigar Humidor

New Mechanic: Butane lighter micro-flame

Hardest stealth board.

Mixed enemy types with overlapping cones.

------------------------------------------------------------------------

# 7. PLANE & PARACHUTE SEQUENCE

Gameplay shift to controlled descent.

Landing precision rating: - Perfect - Good - Rough - Missed

------------------------------------------------------------------------

# 8. FINAL SCENE

"They tried to delay you."\
"They tried to intercept you."\
"But nothing stops Half-A-Buck."

HAPPY 50TH BIRTHDAY

Final Stats: - Time - Guards Knocked Out - Detections - Landing
Accuracy - Age: 50 - Status: Legend

------------------------------------------------------------------------

# 9. MVP SCOPE

Minimum Includes: - 3 stealth boards - 1 parachute mini-game - Intro
cinematic - Ending scene - Basic AI system - 16-bit sprite set - Minimal
sound effects

Target Playtime: 10--20 minutes

------------------------------------------------------------------------

# 10. FUTURE EXPANSION

-   Hard Mode
-   Speed Run Timer
-   Collectibles
-   Brooklyn Rooftop Chase
-   Uber Driver Reveal Cutscene

------------------------------------------------------------------------

HALF-A-BUCK\
Mission: Brooklyn
