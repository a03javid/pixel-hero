import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  LEVEL_WIDTH,
  GROUND_Y,
  GROUND_HEIGHT,
  PIT_WIDTH,
  PIT_X,
  FONT_FAMILY,
  LEVEL_SKY_TOP,
  LEVEL_SKY_BOTTOM,
  CLOUD_COLOR,
  MOUNTAIN_FAR_COLOR,
  MOUNTAIN_MID_COLOR,
  MOUNTAIN_NEAR_COLOR,
  SNOW_COLOR,
  GROUND_COLOR,
  GROUND_HIGHLIGHT_COLOR,
  TREE_TRUNK_COLOR,
  TREE_FOLIAGE_COLOR,
  TREE_FOLIAGE_HIGHLIGHT,
  PLATFORM_COLOR,
  PLATFORM_HIGHLIGHT,
  CASTLE_WALL_COLOR,
  CASTLE_TOWER_COLOR,
  CASTLE_ROOF_COLOR,
  CASTLE_DOOR_COLOR,
  CASTLE_WINDOW_COLOR,
  FINISH_TEXT_COLOR,
  FINISH_FONT_SIZE,
  SCENE_MENU,
  SCENE_GAMEPLAY,
  SCENE_GAMEOVER,
  SCENE_VICTORY,
  OVERLAY_COLOR,
  COMPLETE_TITLE_SIZE,
  COMPLETE_TEXT_SIZE,
  HUD_MARGIN,
  HUD_PADDING,
  HUD_FONT_SIZE,
  HUD_PANEL_HEIGHT,
  HUD_PANEL_WIDTH,
  HUD_BACKGROUND,
  HUD_TEXT_COLOR,
  HUD_CORNER_RADIUS,
  HUD_STAGE_PANEL_WIDTH,
  DEBUG_OVERLAY_Y,
  COLLECTIBLE_COIN,
  COLLECTIBLE_HEART,
  SPIKE_WIDTH,
  SPIKE_HEIGHT,
  PLAYER_ATTACK_SCORE,
} from "../game/constants.js";
import Player from "../entities/Player.js";
import Collectible from "../entities/Collectible.js";
import GroundEnemy from "../entities/GroundEnemy.js";
import FlyingEnemy from "../entities/FlyingEnemy.js";
import ShooterEnemy from "../entities/ShooterEnemy.js";
import BossEnemy from "../entities/BossEnemy.js";
import Projectile from "../entities/Projectile.js";
import MovingPlatform from "../entities/MovingPlatform.js";
import SpriteLoader from "../game/SpriteLoader.js";
import Stage1 from "../game/stages/Stage1.js";
import Stage2 from "../game/stages/Stage2.js";
import Stage3 from "../game/stages/Stage3.js";
import Stage4 from "../game/stages/Stage4.js";
import Stage5 from "../game/stages/Stage5.js";
import {
  SPRITE_PLAYER_IDLE,
  SPRITE_PLAYER_IDLE_URL,
  SPRITE_PLAYER_RUN,
  SPRITE_PLAYER_RUN_URL,
  SPRITE_PLAYER_JUMP,
  SPRITE_PLAYER_JUMP_URL,
  SPRITE_PLAYER_ATTACK,
  SPRITE_PLAYER_ATTACK_URL,
  SPRITE_GROUND_ENEMY_WALK,
  SPRITE_GROUND_ENEMY_WALK_URL,
  SPRITE_FLYING_ENEMY_FLY,
  SPRITE_FLYING_ENEMY_FLY_URL,
  SPRITE_SHOOTER_ENEMY,
  SPRITE_SHOOTER_ENEMY_URL,
  SPRITE_PROJECTILE,
  SPRITE_PROJECTILE_URL,
  SPRITE_BOSS_ENEMY,
  SPRITE_BOSS_ENEMY_URL,
  DAMAGE_INVINCIBILITY_TIME,
  BOSS_SCORE,
} from "../game/constants.js";

/**
 * Lookup all stage data by number.
 * @type {Array<object>}
 */
const STAGES = [null, Stage1, Stage2, Stage3, Stage4, Stage5];

/**
 * The gameplay scene that renders a static pixel-art level.
 *
 * Draws sky, clouds, mountains, trees, ground with a pit gap,
 * floating platforms, and a castle with a "FINISH" label at the
 * far right.  Integrates a Player with movement, gravity, and
 * platform collisions.  Pressing ESC returns to the main menu.
 *
 * @class GameplayScene
 */
class GameplayScene {
  /** @type {Function} Callback invoked when the player presses ESC. */
  _onChange;

  /** @type {(e: KeyboardEvent) => void} Bound keydown handler. */
  _boundKeyDown;

  /** @type {Player} */
  _player;

  /** @type {number} Current stage number (1-5). */
  _stageNumber;

  /** @type {object} The stage data object for the current stage. */
  _stageData;

  /** @type {import("../entities/Player.js").Collider[]} Level colliders. */
  _colliders;

  /** @type {number} Camera X offset in world pixels. */
  _cameraX;

  /**
   * @param {HTMLCanvasElement} canvas - The game canvas.
   * @param {(sceneId: string, options?: object) => void} onChange - Scene-switch callback.
   * @param {number} stageNumber - The stage to load (1-5).
   * @param {Player | null} existingPlayer - If provided, reuse this player (lives/score carry over).
   */
  constructor(canvas, onChange, stageNumber, existingPlayer) {
    /** @type {HTMLCanvasElement} */
    this.canvas = canvas;

    /** @type {CanvasRenderingContext2D} */
    this.ctx = canvas.getContext("2d");

    this._onChange = onChange;
    this._boundKeyDown = this._onKeyDown.bind(this);

    this._stageNumber = stageNumber;
    this._stageData = STAGES[stageNumber];

    // Reuse existing player or create new one
    if (existingPlayer) {
      this._player = existingPlayer;
      this._player.respawn();
    } else {
      this._player = new Player();
    }

    this._colliders = [];
    this._collectibles = [];
    this._hazards = [];
    this._enemies = [];
    this._projectiles = [];
    this._movingPlatforms = [];
    this._iceColliders = [];
    this._windZones = [];
    this._boss = null;
    this._bossSlamActive = false;
    this._cameraX = 0;
    this._completed = false;
    this._goal = { x: 0, y: 0, w: 0, h: 0 };
  }

  /* ------------------------------------------------------------------ */
  /*  Public API                                                         */
  /* ------------------------------------------------------------------ */

  /** Attach input listeners for this scene and the player. */
  start() {
    window.addEventListener("keydown", this._boundKeyDown);
    this._player.start();
    this._colliders = this._buildColliders();
    this._collectibles = this._spawnCollectibles();
    this._hazards = this._buildHazards();
    this._movingPlatforms = this._spawnMovingPlatforms();
    this._iceColliders = this._buildIceColliders();
    this._windZones = this._buildWindZones();
    this._enemies = this._spawnEnemies();
    this._boss = this._spawnBoss();
    this._projectiles = [];

    const goalData = this._stageData.goal;
    this._goal.x = goalData.x;
    this._goal.y = goalData.y;
    this._goal.w = goalData.w;
    this._goal.h = goalData.h;
  }

  /** Detach input listeners. */
  stop() {
    window.removeEventListener("keydown", this._boundKeyDown);
    this._player.stop();
  }

  /**
   * Advance logic by `dt` seconds.
   * @param {number} dt
   */
  update(dt) {
    if (this._completed) return;

    const playerCentreX = this._player.x + this._player.w / 2;

    // 1. Update moving platforms and refresh their colliders into _colliders
    this._updateMovingPlatforms(dt);

    // 2. Detect whether the player is standing on ice
    this._detectIce();

    // 3. Detect whether the player is inside a wind zone
    this._detectWind();

    // 4. Update non-shooter, non-boss enemies
    for (let i = 0; i < this._enemies.length; i++) {
      const enemy = this._enemies[i];
      if (enemy instanceof ShooterEnemy) continue;
      if (enemy instanceof BossEnemy) continue;
      enemy.update(dt);
    }

    // 5. Spawn projectiles from shooter enemies (updates shooters internally)
    this._spawnShooterProjectiles(dt, playerCentreX);

    // 6. Update boss and spawn its projectiles
    this._bossSlamActive = this._updateBoss(dt, playerCentreX);

    // 7. Update projectiles
    for (let i = 0; i < this._projectiles.length; i++) {
      this._projectiles[i].update(dt);
    }

    // 8. Cull projectiles that are dead or out of level bounds
    this._cullProjectiles();

    // 9. Check projectile ↔ player collisions
    this._checkProjectilePlayerCollisions();

    // 10. Check projectile ↔ wall/platform collisions
    this._checkProjectileWallCollisions();

    // Apply moving-platform delta to player X if grounded on one
    this._applyMovingPlatformDelta();

    // Build live enemy collider list for player collision
    const enemyColliders = [];
    for (let i = 0; i < this._enemies.length; i++) {
      const bounds = this._enemies[i].getBounds();
      if (bounds !== null) {
        enemyColliders.push(bounds);
      }
    }

    // 11. Update player
    const alive = this._player.update(dt, this._colliders, this._hazards, enemyColliders);

    if (!alive) {
      this._onChange(SCENE_GAMEOVER, { score: this._player.score });
      return;
    }

    // 12. Check boss slam damage
    this._checkBossSlamDamage();

    // 13. Check attack collisions
    this._checkAttackCollisions();

    // 14. Check collectibles
    for (let i = 0; i < this._collectibles.length; i++) {
      this._collectibles[i].update(dt, this._player);
    }

    // 15. Check goal (only when boss is dead or no boss exists)
    this._checkGoal();
    this._updateCamera();
  }

  /** Clear and redraw the level through the camera lens. */
  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Sky stays in screen space (full canvas backdrop)
    this._drawSky(ctx);

    // Everything else is offset by the camera
    ctx.save();
    ctx.translate(-this._cameraX, 0);

    this._drawClouds(ctx);
    this._drawMountains(ctx);
    this._drawTrees(ctx);
    this._drawGround(ctx);
    this._drawIce(ctx);
    this._drawSpikes(ctx);
    this._drawPlatforms(ctx);
    this._drawMovingPlatforms(ctx);
    this._drawWind(ctx);
    this._drawCastle(ctx);
    this._drawFinishLabel(ctx);

    for (let i = 0; i < this._enemies.length; i++) {
      this._enemies[i].render(ctx);
    }

    if (this._boss !== null) {
      this._boss.render(ctx);
    }

    for (let i = 0; i < this._projectiles.length; i++) {
      this._projectiles[i].render(ctx);
    }

    for (let i = 0; i < this._collectibles.length; i++) {
      this._collectibles[i].render(ctx);
    }

    this._player.render(ctx);

    ctx.restore();

    // Screen-space overlays (not affected by camera)
    this._drawHUD(ctx);
    this._drawDebugOverlay(ctx);

    if (this._completed) {
      this._drawStageCompleteOverlay(ctx);
    }
  }

  /* ------------------------------------------------------------------ */
  /*  Background                                                         */
  /* ------------------------------------------------------------------ */

  /**
   * Fill the visible sky area with a daytime gradient.
   * @param {CanvasRenderingContext2D} ctx
   */
  _drawSky(ctx) {
    const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    grad.addColorStop(0, LEVEL_SKY_TOP);
    grad.addColorStop(1, LEVEL_SKY_BOTTOM);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }

  /**
   * Draw clouds distributed across the visible slice of the level.
   * @param {CanvasRenderingContext2D} ctx
   */
  _drawClouds(ctx) {
    ctx.fillStyle = CLOUD_COLOR;

    const cloudDefs = [
      [80, 50, 0.9],
      [300, 35, 0.7],
      [580, 60, 1.1],
      [860, 40, 0.6],
      [1050, 55, 0.8],
      [1550, 45, 0.75],
      [2020, 55, 0.9],
      [2480, 38, 0.65],
      [2820, 62, 0.85],
    ];

    for (let i = 0; i < cloudDefs.length; i++) {
      const [cx, cy, sc] = cloudDefs[i];
      this._drawCloud(ctx, cx, cy, sc);
    }
  }

  /**
   * Render a single cloud from overlapping ellipses.
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} x
   * @param {number} y
   * @param {number} scale
   */
  _drawCloud(ctx, x, y, scale) {
    const w = 60 * scale;
    const h = 20 * scale;
    ctx.beginPath();
    ctx.ellipse(x, y + h * 0.7, w * 0.8, h * 0.6, 0, 0, Math.PI * 2);
    ctx.ellipse(x + w * 0.4, y + h * 0.35, w * 0.6, h * 0.7, 0, 0, Math.PI * 2);
    ctx.ellipse(x + w * 0.8, y + h * 0.55, w * 0.5, h * 0.55, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  /**
   * Draw three static mountain layers for the visible window.
   * @param {CanvasRenderingContext2D} ctx
   */
  _drawMountains(ctx) {
    const baseFar = 155;
    const baseMid = 140;
    const baseNear = 125;
    const snowFar = CANVAS_HEIGHT * 0.42;
    const snowMid = CANVAS_HEIGHT * 0.38;
    const snowNear = CANVAS_HEIGHT * 0.35;

    this._drawMountainLayer(ctx, MOUNTAIN_FAR_COLOR, baseFar, snowFar, 90, 50);
    this._drawMountainLayer(ctx, MOUNTAIN_MID_COLOR, baseMid, snowMid, 75, 45);
    this._drawMountainLayer(ctx, MOUNTAIN_NEAR_COLOR, baseNear, snowNear, 70, 55);
  }

  /**
   * Render one mountain ridge across the visible canvas.
   * @param {CanvasRenderingContext2D} ctx
   * @param {string} color
   * @param {number} baseY
   * @param {number} snowLine
   * @param {number} step
   * @param {number} heightVariation
   */
  _drawMountainLayer(ctx, color, baseY, snowLine, step, heightVariation) {
    const w = LEVEL_WIDTH;
    const h = CANVAS_HEIGHT;

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, baseY);

    for (let x = 0; x <= w; x += step) {
      const seed = (x * 7 + step * 3) % 97;
      const peakX = x + step / 2;
      const peakY = baseY - 35 - (seed / 97) * heightVariation;
      ctx.lineTo(peakX, peakY);
      ctx.lineTo(x + step, baseY);
    }
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fill();

    // Snow caps
    ctx.fillStyle = SNOW_COLOR;
    ctx.beginPath();
    for (let x = 0; x <= w; x += step) {
      const seed = (x * 7 + step * 3) % 97;
      const peakX = x + step / 2;
      const peakY = baseY - 35 - (seed / 97) * heightVariation;
      if (peakY < snowLine) {
        const capW = 16;
        ctx.moveTo(peakX - capW, peakY + 5);
        ctx.lineTo(peakX, peakY - 6);
        ctx.lineTo(peakX + capW, peakY + 5);
      }
    }
    ctx.fill();
  }

  /* ------------------------------------------------------------------ */
  /*  Trees                                                              */
  /* ------------------------------------------------------------------ */

  /**
   * Draw trees at fixed positions across the visible area.
   * @param {CanvasRenderingContext2D} ctx
   */
  _drawTrees(ctx) {
    const treePositions = [
      100, 200, 340, 480, 620, 750, 880, 940,
      1150, 1420, 1580, 1700, 1820, 1920,
      2100, 2220, 2340, 2460, 2580, 2660, 2780, 2880,
    ];

    for (let i = 0; i < treePositions.length; i++) {
      this._drawTree(ctx, treePositions[i], GROUND_Y);
    }
  }

  /**
   * Draw a single pixel-art tree.
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} x - Base centre X.
   * @param {number} groundY - Top of the ground.
   */
  _drawTree(ctx, x, groundY) {
    const trunkW = 12;
    const trunkH = 40;
    const trunkX = x - trunkW / 2;
    const trunkY = groundY - trunkH;

    // Trunk
    ctx.fillStyle = TREE_TRUNK_COLOR;
    ctx.fillRect(trunkX, trunkY, trunkW, trunkH);

    // Foliage (triangle layers)
    const foliageBaseY = trunkY;
    ctx.fillStyle = TREE_FOLIAGE_COLOR;

    ctx.beginPath();
    ctx.moveTo(x, foliageBaseY - 35);
    ctx.lineTo(x - 28, foliageBaseY + 5);
    ctx.lineTo(x + 28, foliageBaseY + 5);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(x, foliageBaseY - 22);
    ctx.lineTo(x - 24, foliageBaseY + 15);
    ctx.lineTo(x + 24, foliageBaseY + 15);
    ctx.closePath();
    ctx.fill();

    // Highlight
    ctx.fillStyle = TREE_FOLIAGE_HIGHLIGHT;
    ctx.beginPath();
    ctx.moveTo(x - 8, foliageBaseY - 16);
    ctx.lineTo(x + 2, foliageBaseY - 2);
    ctx.lineTo(x - 6, foliageBaseY + 4);
    ctx.closePath();
    ctx.fill();
  }

  /* ------------------------------------------------------------------ */
  /*  Ground                                                             */
  /* ------------------------------------------------------------------ */

  /**
   * Draw the green ground strip with a 150-pixel pit gap.
   * @param {CanvasRenderingContext2D} ctx
   */
  _drawGround(ctx) {
    const y = GROUND_Y;
    const h = GROUND_HEIGHT;

    // Left section (0 to PIT_X)
    ctx.fillStyle = GROUND_COLOR;
    ctx.fillRect(0, y, PIT_X, h);
    ctx.fillStyle = GROUND_HIGHLIGHT_COLOR;
    ctx.fillRect(0, y, PIT_X, 6);

    // Right section (after pit to end of level)
    const rightStart = PIT_X + PIT_WIDTH;
    const rightW = LEVEL_WIDTH - rightStart;
    ctx.fillStyle = GROUND_COLOR;
    ctx.fillRect(rightStart, y, rightW, h);
    ctx.fillStyle = GROUND_HIGHLIGHT_COLOR;
    ctx.fillRect(rightStart, y, rightW, 6);
  }

  /* ------------------------------------------------------------------ */
  /*  Platforms                                                          */
  /* ------------------------------------------------------------------ */

  /**
   * Draw floating platforms from stage data.
   * @param {CanvasRenderingContext2D} ctx
   */
  _drawPlatforms(ctx) {
    const platforms = this._stageData.platforms;
    for (let i = 0; i < platforms.length; i++) {
      const [px, py, pw] = platforms[i];
      this._drawOnePlatform(ctx, px, py, pw);
    }
  }

  /**
   * Draw a single wooden platform.
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} x
   * @param {number} y
   * @param {number} w
   */
  _drawOnePlatform(ctx, x, y, w) {
    const h = 12;

    ctx.fillStyle = PLATFORM_COLOR;
    ctx.fillRect(x, y, w, h);

    ctx.fillStyle = PLATFORM_HIGHLIGHT;
    ctx.fillRect(x, y, w, 3);
  }

  /* ------------------------------------------------------------------ */
  /*  Moving Platforms                                                    */
  /* ------------------------------------------------------------------ */

  /**
   * Create MovingPlatform instances from the stage data (Stage 3 only).
   * Other stages have no movingPlatforms field and simply return an empty array.
   * @returns {MovingPlatform[]}
   */
  _spawnMovingPlatforms() {
    const list = [];
    const configs = this._stageData.movingPlatforms;
    if (!configs) return list;

    for (let i = 0; i < configs.length; i++) {
      const cfg = configs[i];
      list.push(
        new MovingPlatform(
          cfg.x,
          cfg.y,
          cfg.width,
          cfg.height,
          cfg.minX,
          cfg.maxX,
          cfg.speed,
        ),
      );
    }
    return list;
  }

  /**
   * Update each moving platform and rebuild the _colliders array
   * so that the player resolves against their current positions.
   * @param {number} dt - Delta time in seconds.
   */
  _updateMovingPlatforms(dt) {
    for (let i = 0; i < this._movingPlatforms.length; i++) {
      this._movingPlatforms[i].update(dt);
    }

    // Rebuild colliders: ground + static platforms + moving-platform colliders
    this._colliders = this._buildColliders();
    for (let i = 0; i < this._movingPlatforms.length; i++) {
      this._colliders.push(this._movingPlatforms[i].getBounds());
    }
  }

  /**
   * If the player is currently grounded on a moving platform,
   * apply that platform's X delta to the player's position.
   * Called before the player update so the player inherits
   * platform momentum, then normal collision resolution runs.
   */
  _applyMovingPlatformDelta() {
    if (!this._player.grounded) return;
    if (this._movingPlatforms.length === 0) return;

    for (let i = 0; i < this._movingPlatforms.length; i++) {
      const mp = this._movingPlatforms[i];
      const b = mp.getBounds();
      // Check if the player is standing on this platform
      const playerBottom = this._player.y + this._player.h;
      const onTop = Math.abs(playerBottom - b.y) < 2 &&
                    this._player.x + this._player.w > b.x &&
                    this._player.x < b.x + b.w;
      if (onTop) {
        this._player.x += mp.getDeltaX();
        return;
      }
    }
  }

  /**
   * Draw all moving platforms for the current stage.
   * @param {CanvasRenderingContext2D} ctx
   */
  _drawMovingPlatforms(ctx) {
    for (let i = 0; i < this._movingPlatforms.length; i++) {
      this._movingPlatforms[i].render(ctx);
    }
  }

  /* ------------------------------------------------------------------ */
  /*  Ice Zones                                                           */
  /* ------------------------------------------------------------------ */

  /**
   * Build AABB colliders for ice zones from stage data.
   * Only Stage 4 defines iceZones; other stages return an empty array.
   * @returns {import("../entities/Player.js").Collider[]}
   */
  _buildIceColliders() {
    const list = [];
    const zones = this._stageData.iceZones;
    if (!zones) return list;

    for (let i = 0; i < zones.length; i++) {
      const z = zones[i];
      list.push({ x: z.x, y: z.y, w: z.width, h: z.height });
    }
    return list;
  }

  /**
   * Set player.isOnIce when the player is grounded and overlapping an ice zone.
   */
  _detectIce() {
    this._player.isOnIce = false;
    if (!this._player.grounded) return;

    for (let i = 0; i < this._iceColliders.length; i++) {
      const c = this._iceColliders[i];
      if (
        this._player.x < c.x + c.w &&
        this._player.x + this._player.w > c.x &&
        this._player.y < c.y + c.h &&
        this._player.y + this._player.h > c.y
      ) {
        this._player.isOnIce = true;
        return;
      }
    }
  }

  /**
   * Draw ice zones as pale-blue glossy surfaces with shine lines.
   * @param {CanvasRenderingContext2D} ctx
   */
  _drawIce(ctx) {
    const zones = this._stageData.iceZones;
    if (!zones) return;

    for (let i = 0; i < zones.length; i++) {
      const z = zones[i];
      const x = z.x;
      const y = z.y;
      const w = z.width;
      const h = z.height;

      // Pale blue body
      ctx.fillStyle = "#B0E0E6";
      ctx.fillRect(x, y, w, h);

      // White highlight at top
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(x, y, w, 3);

      // Subtle shine lines
      ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
      ctx.lineWidth = 1;
      for (let lineX = x + 20; lineX < x + w - 20; lineX += 40) {
        ctx.beginPath();
        ctx.moveTo(lineX, y + 8);
        ctx.lineTo(lineX + 30, y + h - 8);
        ctx.stroke();
      }
    }
  }

  /* ------------------------------------------------------------------ */
  /*  Wind Zones                                                           */
  /* ------------------------------------------------------------------ */

  /**
   * Build wind zone colliders from stage data.
   * Only Stage 4 defines windZones; other stages return an empty array.
   * @returns {import("../entities/Player.js").Collider[]}
   */
  _buildWindZones() {
    const list = [];
    const zones = this._stageData.windZones;
    if (!zones) return list;

    for (let i = 0; i < zones.length; i++) {
      const z = zones[i];
      list.push({ x: z.x, y: z.y, w: z.width, h: z.height, force: z.force });
    }
    return list;
  }

  /**
   * Set player.windForce when the player is overlapping a wind zone.
   * Sets to 0 when outside all wind zones.
   */
  _detectWind() {
    this._player.windForce = 0;

    for (let i = 0; i < this._windZones.length; i++) {
      const c = this._windZones[i];
      if (
        this._player.x < c.x + c.w &&
        this._player.x + this._player.w > c.x &&
        this._player.y < c.y + c.h &&
        this._player.y + this._player.h > c.y
      ) {
        this._player.windForce = c.force;
        return;
      }
    }
  }

  /**
   * Draw wind zones as semi-transparent white left-pointing arrows for debugging.
   * @param {CanvasRenderingContext2D} ctx
   */
  _drawWind(ctx) {
    const zones = this._stageData.windZones;
    if (!zones) return;

    ctx.fillStyle = "rgba(255, 255, 255, 0.25)";

    for (let i = 0; i < zones.length; i++) {
      const z = zones[i];

      // Draw arrows every 60px
      for (let arrowY = z.y + 30; arrowY < z.y + z.height; arrowY += 60) {
        for (let arrowX = z.x + z.width - 60; arrowX > z.x; arrowX -= 60) {
          // Draw a small left-pointing arrow: <<<<
          const cx = arrowX;
          const cy = arrowY;
          const size = 8;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx + size, cy - size);
          ctx.lineTo(cx + size, cy - size * 0.4);
          ctx.lineTo(cx + size * 2, cy - size * 0.4);
          ctx.lineTo(cx + size * 2, cy + size * 0.4);
          ctx.lineTo(cx + size, cy + size * 0.4);
          ctx.lineTo(cx + size, cy + size);
          ctx.closePath();
          ctx.fill();
        }
      }
    }
  }

  /* ------------------------------------------------------------------ */
  /*  Castle                                                             */
  /* ------------------------------------------------------------------ */

  /**
   * Draw a simple pixel-art castle near the right edge of the visible
   * area.
   * @param {CanvasRenderingContext2D} ctx
   */
  _drawCastle(ctx) {
    const cx = this._stageData.castleX;
    const baseY = GROUND_Y;

    // Main body
    const bodyW = 80;
    const bodyH = 80;
    const bodyX = cx - bodyW / 2;
    const bodyY = baseY - bodyH;

    ctx.fillStyle = CASTLE_WALL_COLOR;
    ctx.fillRect(bodyX, bodyY, bodyW, bodyH);

    // Left tower
    const towerW = 24;
    const towerH = 50;
    const leftTowerX = bodyX - 4;
    const leftTowerY = bodyY - towerH + 10;

    ctx.fillStyle = CASTLE_TOWER_COLOR;
    ctx.fillRect(leftTowerX, leftTowerY, towerW, towerH);

    // Left tower roof
    ctx.fillStyle = CASTLE_ROOF_COLOR;
    ctx.beginPath();
    ctx.moveTo(leftTowerX - 4, leftTowerY);
    ctx.lineTo(leftTowerX + towerW / 2, leftTowerY - 16);
    ctx.lineTo(leftTowerX + towerW + 4, leftTowerY);
    ctx.closePath();
    ctx.fill();

    // Right tower
    const rightTowerX = bodyX + bodyW - towerW + 4;
    const rightTowerY = leftTowerY;

    ctx.fillStyle = CASTLE_TOWER_COLOR;
    ctx.fillRect(rightTowerX, rightTowerY, towerW, towerH);

    // Right tower roof
    ctx.fillStyle = CASTLE_ROOF_COLOR;
    ctx.beginPath();
    ctx.moveTo(rightTowerX - 4, rightTowerY);
    ctx.lineTo(rightTowerX + towerW / 2, rightTowerY - 16);
    ctx.lineTo(rightTowerX + towerW + 4, rightTowerY);
    ctx.closePath();
    ctx.fill();

    // Centre cap
    const capW = 28;
    const capH = 20;
    const capX = cx - capW / 2;
    const capY = bodyY - capH;

    ctx.fillStyle = CASTLE_TOWER_COLOR;
    ctx.fillRect(capX, capY, capW, capH);

    ctx.fillStyle = CASTLE_ROOF_COLOR;
    ctx.beginPath();
    ctx.moveTo(capX - 4, capY);
    ctx.lineTo(cx, capY - 22);
    ctx.lineTo(capX + capW + 4, capY);
    ctx.closePath();
    ctx.fill();

    // Door
    const doorW = 16;
    const doorH = 30;
    const doorX = cx - doorW / 2;
    const doorY = baseY - doorH;

    ctx.fillStyle = CASTLE_DOOR_COLOR;
    ctx.fillRect(doorX, doorY, doorW, doorH);
    ctx.beginPath();
    ctx.ellipse(cx, doorY, doorW / 2, 8, 0, Math.PI, 0);
    ctx.fill();

    // Windows
    const winSize = 8;
    ctx.fillStyle = CASTLE_WINDOW_COLOR;
    ctx.fillRect(bodyX + 12, bodyY + 20, winSize, winSize);
    ctx.fillRect(bodyX + bodyW - 12 - winSize, bodyY + 20, winSize, winSize);
  }

  /* ------------------------------------------------------------------ */
  /*  Finish label                                                       */
  /* ------------------------------------------------------------------ */

  /**
   * Draw the "FINISH" text above the castle.
   * @param {CanvasRenderingContext2D} ctx
   */
  _drawFinishLabel(ctx) {
    ctx.save();
    ctx.font = `${FINISH_FONT_SIZE}px ${FONT_FAMILY}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillStyle = FINISH_TEXT_COLOR;
    ctx.fillText("FINISH", this._stageData.castleX, GROUND_Y - 100);
    ctx.restore();
  }

  /* ------------------------------------------------------------------ */
  /*  Colliders                                                          */
  /* ------------------------------------------------------------------ */

  /**
   * Build an array of AABB colliders from the stage data.
   * @returns {import("../entities/Player.js").Collider[]}
   */
  _buildColliders() {
    const list = [];

    // Ground left (before pit)
    if (PIT_X > 0) {
      list.push({ x: 0, y: GROUND_Y, w: PIT_X, h: GROUND_HEIGHT });
    }

    // Ground right (after pit)
    const rightStart = PIT_X + PIT_WIDTH;
    list.push({
      x: rightStart,
      y: GROUND_Y,
      w: LEVEL_WIDTH - rightStart,
      h: GROUND_HEIGHT,
    });

    // Platforms from stage data
    const platforms = this._stageData.platforms;
    for (let i = 0; i < platforms.length; i++) {
      const [px, py, pw] = platforms[i];
      list.push({ x: px, y: py, w: pw, h: 12 });
    }

    return list;
  }

  /* ------------------------------------------------------------------ */
  /*  Spikes                                                              */
  /* ------------------------------------------------------------------ */

  /**
   * Draw spike hazards on the ground from stage data.
   * @param {CanvasRenderingContext2D} ctx
   */
  _drawSpikes(ctx) {
    const spikePositions = this._stageData.spikes;

    for (let i = 0; i < spikePositions.length; i++) {
      this._drawOneSpike(ctx, spikePositions[i], GROUND_Y);
    }
  }

  /**
   * Draw a single spike triangle pair.
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} x - Left edge.
   * @param {number} groundY - Top of the ground.
   */
  _drawOneSpike(ctx, x, groundY) {
    const w = SPIKE_WIDTH;
    const h = SPIKE_HEIGHT;

    ctx.fillStyle = "#888";
    ctx.beginPath();
    ctx.moveTo(x, groundY);
    ctx.lineTo(x + w / 2, groundY - h);
    ctx.lineTo(x + w, groundY);
    ctx.closePath();
    ctx.fill();

    // Second smaller spike
    ctx.beginPath();
    ctx.moveTo(x + w * 0.25, groundY);
    ctx.lineTo(x + w * 0.5, groundY - h * 0.6);
    ctx.lineTo(x + w * 0.75, groundY);
    ctx.closePath();
    ctx.fill();
  }

  /**
   * Build hazard AABBs used for player damage checks from stage data.
   * @returns {import("../entities/Player.js").Collider[]}
   */
  _buildHazards() {
    const spikePositions = this._stageData.spikes;
    const list = [];

    for (let i = 0; i < spikePositions.length; i++) {
      list.push({
        x: spikePositions[i],
        y: GROUND_Y - SPIKE_HEIGHT * 0.6,
        w: SPIKE_WIDTH,
        h: SPIKE_HEIGHT * 0.6,
      });
    }

    return list;
  }

  /* ------------------------------------------------------------------ */
  /*  Camera                                                             */
  /* ------------------------------------------------------------------ */

  /**
   * Center the camera on the player, clamped to level bounds.
   */
  _updateCamera() {
    const targetX =
      this._player.x - CANVAS_WIDTH / 2 + this._player.w / 2;
    this._cameraX = Math.max(
      0,
      Math.min(targetX, LEVEL_WIDTH - CANVAS_WIDTH),
    );
  }

  /* ------------------------------------------------------------------ */
  /*  HUD                                                                */
  /* ------------------------------------------------------------------ */

  /**
   * Draw the gameplay HUD fixed to the screen.
   * Top-left: lives and score.  Top-right: stage label.
   * @param {CanvasRenderingContext2D} ctx
   */
  _drawHUD(ctx) {
    ctx.save();

    // --- Top-left panel (lives + score) ---
    const panelX = HUD_MARGIN;
    const panelY = HUD_MARGIN;
    const panelW = HUD_PANEL_WIDTH;
    const panelH = HUD_PANEL_HEIGHT;

    this._drawHUDPanel(ctx, panelX, panelY, panelW, panelH);

    ctx.font = `${HUD_FONT_SIZE}px ${FONT_FAMILY}`;
    ctx.textBaseline = "middle";
    ctx.fillStyle = HUD_TEXT_COLOR;

    const iconSize = HUD_FONT_SIZE;
    const lineY1 = panelY + panelH * 0.3;
    const lineY2 = panelY + panelH * 0.7;
    const textX = panelX + HUD_PADDING + iconSize + 6;

    // ❤️ Lives: N
    ctx.textAlign = "left";
    ctx.font = `${iconSize}px ${FONT_FAMILY}`;
    ctx.fillText("❤️", panelX + HUD_PADDING, lineY1);
    ctx.font = `${HUD_FONT_SIZE}px ${FONT_FAMILY}`;
    ctx.fillText(`Lives: ${this._player.lives}`, textX, lineY1);

    // 🪙 Score: N
    ctx.font = `${iconSize}px ${FONT_FAMILY}`;
    ctx.fillText("🪙", panelX + HUD_PADDING, lineY2);
    ctx.font = `${HUD_FONT_SIZE}px ${FONT_FAMILY}`;
    ctx.fillText(`Score: ${this._player.score}`, textX, lineY2);

    // --- Top-right panel (stage) ---
    const stageW = HUD_STAGE_PANEL_WIDTH;
    const stageX = CANVAS_WIDTH - HUD_MARGIN - stageW;
    const stageY = HUD_MARGIN;

    this._drawHUDPanel(ctx, stageX, stageY, stageW, panelH);

    ctx.textAlign = "center";
    ctx.fillText(this._stageData.label, stageX + stageW / 2, stageY + panelH / 2);

    ctx.restore();
  }

  /**
   * Draw a single rounded semi-transparent panel.
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} x
   * @param {number} y
   * @param {number} w
   * @param {number} h
   */
  _drawHUDPanel(ctx, x, y, w, h) {
    const r = HUD_CORNER_RADIUS;
    ctx.fillStyle = HUD_BACKGROUND;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
    ctx.fill();
  }

  /* ------------------------------------------------------------------ */
  /*  Collectibles                                                        */
  /* ------------------------------------------------------------------ */

  /**
   * Create the collectibles from stage data.
   * @returns {Collectible[]}
   */
  _spawnCollectibles() {
    const list = [];

    const coins = this._stageData.coins;
    for (let i = 0; i < coins.length; i++) {
      list.push(new Collectible(COLLECTIBLE_COIN, coins[i].x, coins[i].y));
    }

    const hearts = this._stageData.hearts;
    for (let i = 0; i < hearts.length; i++) {
      list.push(new Collectible(COLLECTIBLE_HEART, hearts[i].x, hearts[i].y));
    }

    return list;
  }

  /* ------------------------------------------------------------------ */
  /*  Debug overlay                                                      */
  /* ------------------------------------------------------------------ */

  /**
   * Draw player debug information in the top-left corner.
   * @param {CanvasRenderingContext2D} ctx
   */
  _drawDebugOverlay(ctx) {
    const p = this._player;
    const lines = [
      `X: ${Math.round(p.x)}`,
      `Y: ${Math.round(p.y)}`,
      `VX: ${Math.round(p.vx)}`,
      `VY: ${Math.round(p.vy)}`,
      `Grounded: ${p.grounded}`,
    ];

    const fontSize = 12;
    const lineHeight = 18;
    const x = 10;
    let y = DEBUG_OVERLAY_Y;

    ctx.save();
    ctx.font = `${fontSize}px ${FONT_FAMILY}`;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillStyle = "#ffffff";
    ctx.shadowColor = "#000000";
    ctx.shadowBlur = 4;

    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], x, y);
      y += lineHeight;
    }

    ctx.restore();
  }

  /* ------------------------------------------------------------------ */
  /*  Enemies                                                             */
  /* ------------------------------------------------------------------ */

  /**
   * Spawn enemies from stage data based on their type.
   * Supports "ground" (GroundEnemy), "flying" (FlyingEnemy),
   * "shooter" (ShooterEnemy), and "boss" (BossEnemy).
   * Boss enemies are stored in `_boss`, not `_enemies`.
   * Falls back to GroundEnemy when no type is specified.
   * @returns {(GroundEnemy|FlyingEnemy|ShooterEnemy|BossEnemy)[]}
   */
  _spawnEnemies() {
    const enemies = this._stageData.enemies;
    const list = [];
    for (let i = 0; i < enemies.length; i++) {
      const e = enemies[i];
      if (e.type === "flying") {
        list.push(new FlyingEnemy(e.x, e.y, e.minX, e.maxX));
      } else if (e.type === "shooter") {
        list.push(new ShooterEnemy(e.x, e.y, e.minX, e.maxX));
      } else if (e.type === "boss") {
        list.push(new BossEnemy(e.x, e.y, e.minX, e.maxX));
      } else {
        list.push(new GroundEnemy(e.x, e.y, e.minX, e.maxX));
      }
    }
    return list;
  }

  /**
   * Create the boss for the current stage, if stage data includes boss config.
   * @returns {BossEnemy | null}
   */
  _spawnBoss() {
    const bossData = this._stageData.boss;
    if (!bossData) return null;
    return new BossEnemy(bossData.x, bossData.y, bossData.minX, bossData.maxX);
  }

  /**
   * Update the boss, spawn its fireballs, and check for contact damage.
   * @param {number} dt - Delta time in seconds.
   * @param {number} playerX - Player centre X position.
   * @returns {boolean} Whether the boss slam is currently active.
   */
  _updateBoss(dt, playerX) {
    if (this._boss === null || !this._boss.alive) return false;

    const result = this._boss.update(dt, playerX, this._player.y);

    // Spawn boss fireball
    if (result.fireball !== null) {
      this._projectiles.push(
        new Projectile(result.fireball.x, result.fireball.y, result.fireball.direction),
      );
    }

    // Boss contact damage
    if (this._player._invincibleTimer <= 0) {
      const bossBounds = this._boss.getBounds();
      if (bossBounds !== null) {
        const px = this._player.x + this._player.w / 2;
        const py = this._player.y + this._player.h / 2;
        const bx = bossBounds.x + bossBounds.w / 2;
        const by = bossBounds.y + bossBounds.h / 2;
        if (Math.abs(px - bx) < bossBounds.w / 2 + this._player.w / 2 - 10 &&
            Math.abs(py - by) < bossBounds.h / 2 + this._player.h / 2 - 10) {
          this._player.lives -= 1;
          this._player.respawn();
          this._player._invincibleTimer = DAMAGE_INVINCIBILITY_TIME;
        }
      }
    }

    return result.slamActive;
  }

  /**
   * Check if the boss slam is active and the player is within range.
   * Applies damage using the existing invincibility system.
   */
  _checkBossSlamDamage() {
    if (!this._bossSlamActive || this._player._invincibleTimer > 0) return;

    this._player.lives -= 1;
    this._player.respawn();
    this._player._invincibleTimer = DAMAGE_INVINCIBILITY_TIME;
  }

  /* ------------------------------------------------------------------ */
  /*  Projectile management                                               */
  /* ------------------------------------------------------------------ */

  /**
   * Iterate shooter enemies and spawn projectiles when they are ready
   * to fire and the player is within range.
   * @param {number} dt - Delta time in seconds.
   * @param {number} playerX - Player centre X position.
   */
  _spawnShooterProjectiles(dt, playerX) {
    for (let i = 0; i < this._enemies.length; i++) {
      const enemy = this._enemies[i];
      if (!enemy.alive) continue;
      // Only ShooterEnemy instances expose fire-on-update
      if (!(enemy instanceof ShooterEnemy)) continue;

      const fireData = enemy.update(dt, playerX);
      if (fireData !== null) {
        this._projectiles.push(
          new Projectile(fireData.x, fireData.y, fireData.direction),
        );
      }
    }
  }

  /**
   * Remove projectiles that are dead or have left the level bounds.
   */
  _cullProjectiles() {
    for (let i = this._projectiles.length - 1; i >= 0; i--) {
      const p = this._projectiles[i];
      if (!p.alive || p.x + p.w < 0 || p.x > LEVEL_WIDTH) {
        this._projectiles.splice(i, 1);
      }
    }
  }

  /**
   * Check collisions between projectiles and the player.
   * Overlapping projectiles kill the projectile and damage the player
   * (using the existing invincibility / respawn system).
   */
  _checkProjectilePlayerCollisions() {
    for (let i = 0; i < this._projectiles.length; i++) {
      const p = this._projectiles[i];
      if (!p.alive) continue;

      if (
        p.x < this._player.x + this._player.w &&
        p.x + p.w > this._player.x &&
        p.y < this._player.y + this._player.h &&
        p.y + p.h > this._player.y
      ) {
        p.alive = false;
        // The player handles damage + invincibility via its _checkEnemies
        // path, so we simulate an enemy collision by reducing a life and
        // respawning directly only when the player is not invincible.
        if (this._player._invincibleTimer <= 0) {
          this._player.lives -= 1;
          this._player.respawn();
          this._player._invincibleTimer = DAMAGE_INVINCIBILITY_TIME;
        }
      }
    }
  }

  /**
   * Check collisions between projectiles and level walls / platforms.
   * A projectile that hits a collider is destroyed.
   */
  _checkProjectileWallCollisions() {
    for (let i = 0; i < this._projectiles.length; i++) {
      const p = this._projectiles[i];
      if (!p.alive) continue;

      for (let j = 0; j < this._colliders.length; j++) {
        const c = this._colliders[j];
        if (
          p.x < c.x + c.w &&
          p.x + p.w > c.x &&
          p.y < c.y + c.h &&
          p.y + p.h > c.y
        ) {
          p.alive = false;
          break;
        }
      }
    }
  }

  /* ------------------------------------------------------------------ */
  /*  Attack collisions                                                   */
  /* ------------------------------------------------------------------ */

  /**
   * Check the player's attack hitbox against all alive enemies.
   * Kills any enemy that overlaps and awards score.
   */
  _checkAttackCollisions() {
    const attackBounds = this._player.getAttackBounds();
    if (attackBounds === null) return;

    // Check regular enemies — one-hit kill
    for (let i = 0; i < this._enemies.length; i++) {
      const enemy = this._enemies[i];
      if (!enemy.alive) continue;

      const eb = enemy.getBounds();
      if (eb === null) continue;

      if (
        attackBounds.x < eb.x + eb.w &&
        attackBounds.x + attackBounds.w > eb.x &&
        attackBounds.y < eb.y + eb.h &&
        attackBounds.y + attackBounds.h > eb.y
      ) {
        enemy.alive = false;
        this._player.score += PLAYER_ATTACK_SCORE;
      }
    }

    // Check boss — takes damage per hit
    if (this._boss !== null && this._boss.alive) {
      const bb = this._boss.getBounds();
      if (bb !== null) {
        if (
          attackBounds.x < bb.x + bb.w &&
          attackBounds.x + attackBounds.w > bb.x &&
          attackBounds.y < bb.y + bb.h &&
          attackBounds.y + attackBounds.h > bb.y
        ) {
          this._boss.takeDamage();
          if (this._boss.isDead()) {
            this._player.score += BOSS_SCORE;
          }
        }
      }
    }
  }

  /* ------------------------------------------------------------------ */
  /*  Goal                                                                */
  /* ------------------------------------------------------------------ */

  /**
   * Check whether the player overlaps the goal area.
   * Sets `_completed` to true on first overlap.
   */
  _checkGoal() {
    // Goal is blocked while the boss is still alive
    if (this._boss !== null && this._boss.alive) return;

    const p = this._player;
    const g = this._goal;

    if (
      p.x < g.x + g.w &&
      p.x + p.w > g.x &&
      p.y < g.y + g.h &&
      p.y + p.h > g.y
    ) {
      this._completed = true;
    }
  }

  /* ------------------------------------------------------------------ */
  /*  Stage complete overlay                                              */
  /* ------------------------------------------------------------------ */

  /**
   * Draw the semi-transparent stage-complete overlay.
   * Stages 1-4: "STAGE COMPLETE" → next stage.
   * Stage 5: "YOU WIN" → menu.
   * @param {CanvasRenderingContext2D} ctx
   */
  _drawStageCompleteOverlay(ctx) {
    const isFinalStage = this._stageNumber >= 5;

    ctx.save();

    // Full-screen dark overlay
    ctx.fillStyle = OVERLAY_COLOR;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    if (isFinalStage) {
      // "YOU WIN" overlay for the final stage
      ctx.font = `${COMPLETE_TITLE_SIZE}px ${FONT_FAMILY}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#FFD700";
      ctx.fillText("YOU WIN", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 30);

      ctx.font = `${COMPLETE_TEXT_SIZE}px ${FONT_FAMILY}`;
      ctx.fillStyle = "#ffffff";
      ctx.fillText(
        "Congratulations!",
        CANVAS_WIDTH / 2,
        CANVAS_HEIGHT / 2 + 15,
      );

      ctx.fillText(
        "Press ENTER to return to Menu",
        CANVAS_WIDTH / 2,
        CANVAS_HEIGHT / 2 + 45,
      );
    } else {
      // "STAGE COMPLETE" overlay for stages 1-4
      ctx.font = `${COMPLETE_TITLE_SIZE}px ${FONT_FAMILY}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#FFD700";
      ctx.fillText("STAGE COMPLETE", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 20);

      ctx.font = `${COMPLETE_TEXT_SIZE}px ${FONT_FAMILY}`;
      ctx.fillStyle = "#ffffff";
      ctx.fillText(
        "Press ENTER to continue",
        CANVAS_WIDTH / 2,
        CANVAS_HEIGHT / 2 + 40,
      );
    }

    ctx.restore();
  }

  /* ------------------------------------------------------------------ */
  /*  Input                                                              */
  /* ------------------------------------------------------------------ */

  /**
   * Handle keydown events. ESC returns to the menu scene.
   * Press ENTER after stage completion: next stage (1-4) or menu (5).
   * @param {KeyboardEvent} e
   */
  _onKeyDown(e) {
    if (e.key === "Escape") {
      e.preventDefault();
      this._onChange(SCENE_MENU);
    } else if (e.key === "Enter" && this._completed) {
      e.preventDefault();
      if (this._stageNumber >= 5) {
        this._onChange(SCENE_VICTORY, { score: this._player.score });
      } else {
        this._onChange(SCENE_GAMEPLAY, {
          stageNumber: this._stageNumber + 1,
          player: this._player,
        });
      }
    } else if (e.code === "KeyJ" || e.code === "KeyK") {
      e.preventDefault();
      this._player.startAttack();
    }
  }

  /**
   * Preload all sprites used by the gameplay scene.
   * Safe to call multiple times — already-loaded sprites are skipped.
   * @returns {Promise<void>}
   */
  static async preloadSprites() {
    await Promise.all([
      SpriteLoader.load(SPRITE_PLAYER_IDLE, SPRITE_PLAYER_IDLE_URL),
      SpriteLoader.load(SPRITE_PLAYER_RUN, SPRITE_PLAYER_RUN_URL),
      SpriteLoader.load(SPRITE_PLAYER_JUMP, SPRITE_PLAYER_JUMP_URL),
      SpriteLoader.load(SPRITE_PLAYER_ATTACK, SPRITE_PLAYER_ATTACK_URL),
      SpriteLoader.load(SPRITE_GROUND_ENEMY_WALK, SPRITE_GROUND_ENEMY_WALK_URL),
      SpriteLoader.load(SPRITE_FLYING_ENEMY_FLY, SPRITE_FLYING_ENEMY_FLY_URL),
      SpriteLoader.load(SPRITE_SHOOTER_ENEMY, SPRITE_SHOOTER_ENEMY_URL),
      SpriteLoader.load(SPRITE_PROJECTILE, SPRITE_PROJECTILE_URL),
      SpriteLoader.load(SPRITE_BOSS_ENEMY, SPRITE_BOSS_ENEMY_URL),
    ]);
  }
}

export default GameplayScene;
