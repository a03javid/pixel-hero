import {
  PROJECTILE_WIDTH,
  PROJECTILE_HEIGHT,
  PROJECTILE_SPEED,
  ENEMY_OUTLINE_COLOR,
  SPRITE_PROJECTILE,
} from "../game/constants.js";
import SpriteLoader from "../game/SpriteLoader.js";

/**
 * A projectile fired by a shooter enemy.
 * Moves horizontally toward the player and destroys itself on collision
 * or when leaving the level bounds.
 *
 * @class Projectile
 */
class Projectile {
  /** @type {number} */
  x;

  /** @type {number} */
  y;

  /** @type {number} */
  vx;

  /** @type {number} */
  w;

  /** @type {number} */
  h;

  /** @type {boolean} Whether this projectile is still active. */
  alive;

  /**
   * @param {number} x - Starting X position.
   * @param {number} y - Starting Y position (centred vertically on the enemy).
   * @param {number} direction - Direction multiplier (-1 for left, 1 for right).
   */
  constructor(x, y, direction) {
    this.x = x;
    this.y = y;
    this.w = PROJECTILE_WIDTH;
    this.h = PROJECTILE_HEIGHT;
    this.vx = PROJECTILE_SPEED * direction;
    this.alive = true;
  }

  /* ------------------------------------------------------------------ */
  /*  Public API                                                         */
  /* ------------------------------------------------------------------ */

  /**
   * Advance the projectile position.
   * @param {number} dt - Delta time in seconds.
   */
  update(dt) {
    if (!this.alive) return;
    this.x += this.vx * dt;
  }

  /**
   * Render the projectile.
   * Falls back to a simple arrow shape if the sprite is missing.
   * @param {CanvasRenderingContext2D} ctx
   */
  render(ctx) {
    if (!this.alive) return;

    ctx.save();

    if (SpriteLoader.has(SPRITE_PROJECTILE)) {
      SpriteLoader.drawSprite(ctx, SPRITE_PROJECTILE, this.x, this.y, this.w, this.h, this.vx < 0);
      ctx.restore();
      return;
    }

    const cy = this.y + this.h / 2;

    // Arrow-shaped projectile in canvas fallback
    ctx.fillStyle = "#ff4444";
    ctx.strokeStyle = ENEMY_OUTLINE_COLOR;
    ctx.lineWidth = 1;

    ctx.beginPath();
    if (this.vx > 0) {
      ctx.moveTo(this.x, cy);
      ctx.lineTo(this.x + this.w, cy);
      ctx.lineTo(this.x + this.w * 0.6, this.y);
      ctx.lineTo(this.x + this.w * 0.2, cy);
      ctx.lineTo(this.x + this.w * 0.6, this.y + this.h);
      ctx.closePath();
    } else {
      ctx.moveTo(this.x + this.w, cy);
      ctx.lineTo(this.x, cy);
      ctx.lineTo(this.x + this.w * 0.4, this.y);
      ctx.lineTo(this.x + this.w * 0.8, cy);
      ctx.lineTo(this.x + this.w * 0.4, this.y + this.h);
      ctx.closePath();
    }
    ctx.fill();
    ctx.stroke();

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

export default Projectile;