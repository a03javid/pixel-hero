import {
  ENEMY_OUTLINE_COLOR,
  BOSS_WIDTH,
  BOSS_HEIGHT,
  BOSS_HP,
  BOSS_PHASE1_SPEED,
  BOSS_PHASE2_SPEED,
  BOSS_PHASE3_SPEED,
  BOSS_FIREBALL_INTERVAL_PHASE2,
  BOSS_FIREBALL_INTERVAL_PHASE3,
  BOSS_SLAM_INTERVAL,
  BOSS_SLAM_RANGE,
  BOSS_SLAM_ACTIVE_DURATION,
  SPRITE_BOSS_ENEMY,
  BOSS_FRAME_WIDTH,
  BOSS_FRAME_HEIGHT,
  BOSS_WALK_FPS,
  BOSS_WALK_FRAMES,
} from "../game/constants.js";
import SpriteLoader from "../game/SpriteLoader.js";
import SpriteAnimator from "../game/SpriteAnimator.js";

/**
 * Final boss enemy for Stage 5.
 * Three-phase fight: patrol phase, fireball phase, fireball+slam phase.
 *
 * Phase 1 (3 HP): slow patrol, contact damage.
 * Phase 2 (2 HP): faster patrol, fires fireballs every 2 s.
 * Phase 3 (1 HP): fastest patrol, fireballs every 1 s, ground slam every 4 s.
 *
 * @class BossEnemy
 */
class BossEnemy {
  /** @type {number} */
  x;

  /** @type {number} */
  y;

  /** @type {number} */
  w;

  /** @type {number} */
  h;

  /** @type {boolean} Whether the boss is still alive. */
  alive;

  /** @type {number} Leftmost patrol boundary. */
  minX;

  /** @type {number} Rightmost patrol boundary. */
  maxX;

  /** @type {number} Current health (starts at BOSS_HP). */
  hp;

  /** @type {number} Current horizontal speed (positive = right). */
  vx;

  /** @type {boolean} Whether the boss is facing left. */
  _facingLeft;

  /** @type {number} Remaining cooldown before the next fireball (seconds). */
  _fireTimer;

  /** @type {number} Remaining time before the next ground slam (seconds). */
  _slamTimer;

  /** @type {string} Current slam state: 'idle', 'rising', 'falling', 'active'. */
  _slamState;

  /** @type {number} Timer within the current slam phase (seconds). */
  _slamPhaseTimer;

  /** @type {number} Vertical offset during slam animation. */
  _slamOffsetY;

  /** @type {SpriteAnimator} */
  _animator;

  /**
   * @param {number} x - Starting X position.
   * @param {number} y - Starting Y position (bottom-aligned on ground).
   * @param {number} minX - Left patrol boundary.
   * @param {number} maxX - Right patrol boundary.
   */
  constructor(x, y, minX, maxX) {
    this.x = x;
    this.y = y;
    this.w = BOSS_WIDTH;
    this.h = BOSS_HEIGHT;
    this.minX = minX;
    this.maxX = maxX;
    this.vx = BOSS_PHASE1_SPEED;
    this.alive = true;
    this.hp = BOSS_HP;
    this._facingLeft = false;
    this._fireTimer = BOSS_FIREBALL_INTERVAL_PHASE2;
    this._slamTimer = BOSS_SLAM_INTERVAL;
    this._slamState = "idle";
    this._slamPhaseTimer = 0;
    this._slamOffsetY = 0;

    this._groundY = y;

    this._animator = new SpriteAnimator();
    this._animator.addAnimation("walk", {
      spriteKey: SPRITE_BOSS_ENEMY,
      frameWidth: BOSS_FRAME_WIDTH,
      frameHeight: BOSS_FRAME_HEIGHT,
      frameCount: BOSS_WALK_FRAMES,
      fps: BOSS_WALK_FPS,
      loop: true,
    });
  }

  /* ------------------------------------------------------------------ */
  /*  Public API                                                         */
  /* ------------------------------------------------------------------ */

  /**
   * Advance the boss state by `dt` seconds.
   *
   * @param {number} dt - Delta time in seconds.
   * @param {number} playerX - Player centre X position.
   * @param {number} playerY - Player Y position.
   * @returns {{ fireball: { x: number, y: number, direction: number } | null, slamActive: boolean }}
   */
  update(dt, playerX, playerY) {
    if (!this.alive) {
      return { fireball: null, slamActive: false };
    }

    this._animator.update(dt);
    this._updateMovement(dt);
    this._updateSlam(dt);

    const hpRemaining = this.hp;

    // Fireball spawning (phases 2 & 3)
    let fireball = null;
    if (hpRemaining <= 2) {
      const interval =
        hpRemaining === 1
          ? BOSS_FIREBALL_INTERVAL_PHASE3
          : BOSS_FIREBALL_INTERVAL_PHASE2;

      this._fireTimer -= dt;
      if (this._fireTimer <= 0) {
        this._fireTimer = interval;
        const centreX = this.x + this.w / 2;
        this._facingLeft = playerX < centreX;

        const spawnX = this._facingLeft ? this.x : this.x + this.w;
        const spawnY = this.y + this._slamOffsetY + this.h / 2;
        fireball = {
          x: spawnX,
          y: spawnY,
          direction: this._facingLeft ? -1 : 1,
        };
      }
    }

    const slamActive =
      this._slamState === "active" &&
      this._isPlayerInSlamRange(playerX, playerY);

    return { fireball, slamActive };
  }

  /**
   * Reduce boss health by one point.
   */
  takeDamage() {
    if (!this.alive) return;
    this.hp -= 1;

    if (this.hp === 2) {
      this.vx = BOSS_PHASE2_SPEED;
      this._fireTimer = BOSS_FIREBALL_INTERVAL_PHASE2;
    } else if (this.hp === 1) {
      this.vx = BOSS_PHASE3_SPEED;
      this._fireTimer = BOSS_FIREBALL_INTERVAL_PHASE3;
      this._slamTimer = BOSS_SLAM_INTERVAL;
    }

    if (this.hp <= 0) {
      this.alive = false;
    }
  }

  /**
   * Whether the boss has zero HP.
   * @returns {boolean}
   */
  isDead() {
    return !this.alive;
  }

  /**
   * Draw the boss using sprite animation or canvas fallback.
   * @param {CanvasRenderingContext2D} ctx
   */
  render(ctx) {
    if (!this.alive) return;

    ctx.save();

    const drawY = this.y + this._slamOffsetY;

    // Try sprite-sheet animation first
    this._animator.play("walk");
    this._animator.draw(ctx, this.x, drawY, this.w, this.h, this._facingLeft);

    if (this._animator.isAvailable("walk")) {
      ctx.restore();
      return;
    }

    // Fallback: single-sprite
    if (SpriteLoader.has(SPRITE_BOSS_ENEMY)) {
      SpriteLoader.drawSprite(ctx, SPRITE_BOSS_ENEMY, this.x, drawY, this.w, this.h, this._facingLeft);
      ctx.restore();
      return;
    }

    // Canvas fallback: large pixel-art boss (knight / demon)
    const cx = this.x + this.w / 2;
    const cy = drawY + this.h / 2;

    // Body (large dark armour)
    ctx.fillStyle = "#4a3728";
    ctx.fillRect(cx - 18, cy - 12, 36, 40);

    // Armour plates
    ctx.fillStyle = "#6b4c3b";
    ctx.fillRect(cx - 16, cy - 8, 32, 28);

    // Head (horned helm)
    ctx.fillStyle = "#3a2a1e";
    ctx.fillRect(cx - 10, cy - 28, 20, 18);

    // Horns
    ctx.fillStyle = "#8b7355";
    ctx.beginPath();
    ctx.moveTo(cx - 8, cy - 28);
    ctx.lineTo(cx - 14, cy - 42);
    ctx.lineTo(cx - 2, cy - 28);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(cx + 8, cy - 28);
    ctx.lineTo(cx + 14, cy - 42);
    ctx.lineTo(cx + 2, cy - 28);
    ctx.fill();

    // Eyes (glowing red)
    const eyeOffsetX = this._facingLeft ? -3 : 3;
    ctx.fillStyle = "#ff2222";
    ctx.fillRect(cx - 6 + eyeOffsetX, cy - 22, 4, 4);
    ctx.fillRect(cx + 2 + eyeOffsetX, cy - 22, 4, 4);

    // Shoulder guards
    ctx.fillStyle = "#5c4033";
    ctx.fillRect(cx - 22, cy - 8, 8, 14);
    ctx.fillRect(cx + 14, cy - 8, 8, 14);

    // Arms
    ctx.fillStyle = "#3a2a1e";
    ctx.fillRect(cx - 20, cy + 4, 8, 16);
    ctx.fillRect(cx + 12, cy + 4, 8, 16);

    // Weapon (sword/mace on the side facing the player)
    ctx.fillStyle = "#a0a0a0";
    if (this._facingLeft) {
      ctx.fillRect(cx - 24, cy - 4, 6, 20);
      ctx.fillRect(cx - 28, cy - 10, 4, 10);
    } else {
      ctx.fillRect(cx + 18, cy - 4, 6, 20);
      ctx.fillRect(cx + 24, cy - 10, 4, 10);
    }

    // Legs
    ctx.fillStyle = "#302018";
    ctx.fillRect(cx - 14, cy + 28, 12, 14);
    ctx.fillRect(cx + 2, cy + 28, 12, 14);

    // Feet
    ctx.fillStyle = "#1a0e08";
    ctx.fillRect(cx - 16, cy + 40, 10, 6);
    ctx.fillRect(cx + 6, cy + 40, 10, 6);

    // Outline
    ctx.strokeStyle = ENEMY_OUTLINE_COLOR;
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x, drawY, this.w, this.h);

    ctx.restore();
  }

  /**
   * Return the AABB for collision checks.
   * @returns {{ x: number, y: number, w: number, h: number } | null}
   */
  getBounds() {
    if (!this.alive) return null;
    return {
      x: this.x,
      y: this.y + this._slamOffsetY,
      w: this.w,
      h: this.h,
    };
  }

  /* ------------------------------------------------------------------ */
  /*  Internal                                                            */
  /* ------------------------------------------------------------------ */

  /**
   * Handle patrolling left and right between boundaries.
   * @param {number} dt
   */
  _updateMovement(dt) {
    this.x += this.vx * dt;

    if (this.x <= this.minX) {
      this.x = this.minX;
      this.vx = Math.abs(this.vx);
    } else if (this.x + this.w >= this.maxX) {
      this.x = this.maxX - this.w;
      this.vx = -Math.abs(this.vx);
    }

    this._facingLeft = this.vx < 0;
  }

  /**
   * Advance the ground-slam state machine.
   * @param {number} dt
   */
  _updateSlam(dt) {
    if (this.hp > 1) {
      return;
    }

    switch (this._slamState) {
      case "idle": {
        this._slamTimer -= dt;
        if (this._slamTimer <= 0) {
          this._slamState = "rising";
          this._slamPhaseTimer = 0.2;
        }
        break;
      }
      case "rising": {
        this._slamPhaseTimer -= dt;
        const progress = 1 - this._slamPhaseTimer / 0.2;
        this._slamOffsetY = -20 * Math.sin(progress * Math.PI * 0.5);
        if (this._slamPhaseTimer <= 0) {
          this._slamState = "falling";
          this._slamPhaseTimer = 0.15;
        }
        break;
      }
      case "falling": {
        this._slamPhaseTimer -= dt;
        const progress = 1 - this._slamPhaseTimer / 0.15;
        this._slamOffsetY = -20 * Math.cos(progress * Math.PI * 0.5);
        if (this._slamPhaseTimer <= 0) {
          this._slamState = "active";
          this._slamPhaseTimer = BOSS_SLAM_ACTIVE_DURATION;
          this._slamOffsetY = 0;
        }
        break;
      }
      case "active": {
        this._slamPhaseTimer -= dt;
        if (this._slamPhaseTimer <= 0) {
          this._slamState = "idle";
          this._slamTimer = BOSS_SLAM_INTERVAL;
        }
        break;
      }
    }
  }

  /**
   * Check whether the player is within slam damage range.
   * @param {number} playerX - Player centre X.
   * @param {number} playerY - Player Y.
   * @returns {boolean}
   */
  _isPlayerInSlamRange(playerX, playerY) {
    const centreX = this.x + this.w / 2;
    const groundY = this.y + this.h;
    const dx = Math.abs(playerX - centreX);
    const dy = Math.abs(playerY - groundY);
    return dx < BOSS_SLAM_RANGE && dy < BOSS_SLAM_RANGE * 0.6;
  }
}

export default BossEnemy;