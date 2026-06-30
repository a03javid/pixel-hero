import {
  ENEMY_WIDTH,
  ENEMY_HEIGHT,
  ENEMY_OUTLINE_COLOR,
  SHOOTER_RANGE,
  SHOOTER_FIRE_INTERVAL,
  SPRITE_SHOOTER_ENEMY,
} from "../game/constants.js";
import SpriteLoader from "../game/SpriteLoader.js";
import SpriteAnimator from "../game/SpriteAnimator.js";

/**
 * A stationary enemy that detects the player within a configurable range
 * and periodically fires projectiles toward them.
 *
 * @class ShooterEnemy
 */
class ShooterEnemy {
  /** @type {number} */
  x;

  /** @type {number} */
  y;

  /** @type {number} */
  w;

  /** @type {number} */
  h;

  /** @type {boolean} Whether the enemy is still alive. */
  alive;

  /** @type {boolean} Whether the shooter last fired toward the left. */
  _facingLeft;

  /** @type {number} Remaining cooldown before the next shot can be fired (seconds). */
  _fireTimer;

  /** @type {SpriteAnimator} */
  _animator;

  /**
   * @param {number} x - X position.
   * @param {number} y - Y position.
   * @param {number} _minX - Unused (kept for stage-data compatibility).
   * @param {number} _maxX - Unused (kept for stage-data compatibility).
   */
  constructor(x, y, _minX, _maxX) {
    this.x = x;
    this.y = y;
    this.w = ENEMY_WIDTH;
    this.h = ENEMY_HEIGHT;
    this.alive = true;
    this._facingLeft = false;
    this._fireTimer = 0;

    this._animator = new SpriteAnimator();
    this._animator.addAnimation("idle", {
      spriteKey: SPRITE_SHOOTER_ENEMY,
      frameWidth: ENEMY_WIDTH,
      frameHeight: ENEMY_HEIGHT,
      frameCount: 1,
      fps: 1,
      loop: true,
    });
  }

  /* ------------------------------------------------------------------ */
  /*  Public API                                                         */
  /* ------------------------------------------------------------------ */

  /**
   * Advance the shooter state.  Tracks the fire cooldown and detects
   * whether the player is in range.
   *
   * @param {number} dt - Delta time in seconds.
   * @param {number} playerX - Player centre X position.
   * @returns {{ x: number, y: number, direction: number } | null}
   *   Fire data when ready, or null.
   */
  update(dt, playerX) {
    if (!this.alive) return null;

    this._animator.update(dt);

    if (this._fireTimer > 0) {
      this._fireTimer -= dt;
    }

    const centreX = this.x + this.w / 2;
    const dist = Math.abs(playerX - centreX);

    if (dist > SHOOTER_RANGE) {
      return null;
    }

    if (this._fireTimer > 0) {
      return null;
    }

    // Ready to fire — determine direction and reset cooldown
    this._fireTimer = SHOOTER_FIRE_INTERVAL;
    this._facingLeft = playerX < centreX;

    const spawnX = this._facingLeft
      ? this.x
      : this.x + this.w;
    const spawnY = this.y + this.h / 2;

    return {
      x: spawnX,
      y: spawnY,
      direction: this._facingLeft ? -1 : 1,
    };
  }

  /**
   * Draw the shooter enemy.
   * Uses sprite when available; falls back to a pixel archer canvas render.
   * @param {CanvasRenderingContext2D} ctx
   */
  render(ctx) {
    if (!this.alive) return;

    ctx.save();

    // Try sprite rendering first
    this._animator.play("idle");
    this._animator.draw(ctx, this.x, this.y, this.w, this.h, this._facingLeft);

    if (this._animator.isAvailable("idle")) {
      ctx.restore();
      return;
    }

    // Fallback: single-sprite
    if (SpriteLoader.has(SPRITE_SHOOTER_ENEMY)) {
      SpriteLoader.drawSprite(ctx, SPRITE_SHOOTER_ENEMY, this.x, this.y, this.w, this.h, this._facingLeft);
      ctx.restore();
      return;
    }

    // Canvas fallback: pixel-style archer
    const cx = this.x + this.w / 2;
    const cy = this.y + this.h / 2;

    // Body (dark brown tunic)
    ctx.fillStyle = "#5c3a1e";
    ctx.fillRect(cx - 8, cy - 6, 16, 20);

    // Head (skin tone)
    ctx.fillStyle = "#f5c6a0";
    ctx.fillRect(cx - 5, cy - 14, 10, 10);

    // Eyes (white with dark pupils, offset toward facing direction)
    const eyeOffsetX = this._facingLeft ? -2 : 2;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(cx - 4 + eyeOffsetX, cy - 11, 3, 3);
    ctx.fillRect(cx + 1 + eyeOffsetX, cy - 11, 3, 3);
    ctx.fillStyle = "#000000";
    ctx.fillRect(cx - 3 + eyeOffsetX, cy - 10, 2, 2);
    ctx.fillRect(cx + 2 + eyeOffsetX, cy - 10, 2, 2);

    // Bow (curved arc on the facing side)
    ctx.strokeStyle = "#8B4513";
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (this._facingLeft) {
      ctx.arc(cx - 12, cy, 8, -0.8, 0.8);
    } else {
      ctx.arc(cx + 12, cy, 8, Math.PI - 0.8, Math.PI + 0.8);
    }
    ctx.stroke();

    // Bowstring
    ctx.strokeStyle = "#d4c4a0";
    ctx.lineWidth = 1;
    ctx.beginPath();
    if (this._facingLeft) {
      ctx.moveTo(cx - 12 + 8 * Math.cos(-0.8), cy + 8 * Math.sin(-0.8));
      ctx.lineTo(cx - 12 + 8 * Math.cos(0.8), cy + 8 * Math.sin(0.8));
    } else {
      ctx.moveTo(cx + 12 + 8 * Math.cos(Math.PI - 0.8), cy + 8 * Math.sin(Math.PI - 0.8));
      ctx.lineTo(cx + 12 + 8 * Math.cos(Math.PI + 0.8), cy + 8 * Math.sin(Math.PI + 0.8));
    }
    ctx.stroke();

    // Legs
    ctx.fillStyle = "#3a2010";
    ctx.fillRect(cx - 6, cy + 14, 5, 8);
    ctx.fillRect(cx + 1, cy + 14, 5, 8);

    // Outline
    ctx.strokeStyle = ENEMY_OUTLINE_COLOR;
    ctx.lineWidth = 1;
    ctx.strokeRect(this.x, this.y, this.w, this.h);

    ctx.restore();
  }

  /**
   * Return the AABB for collision checks.
   * @returns {{ x: number, y: number, w: number, h: number } | null}
   */
  getBounds() {
    if (!this.alive) return null;
    return { x: this.x, y: this.y, w: this.w, h: this.h };
  }
}

export default ShooterEnemy;