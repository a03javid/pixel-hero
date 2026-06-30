import {
  ENEMY_WIDTH,
  ENEMY_HEIGHT,
  ENEMY_SPEED,
  ENEMY_BODY_COLOR,
  ENEMY_DETAIL_COLOR,
  ENEMY_OUTLINE_COLOR,
  SPRITE_GROUND_ENEMY_WALK,
  ENEMY_FRAME_WIDTH,
  ENEMY_FRAME_HEIGHT,
  ENEMY_WALK_FPS,
  ENEMY_WALK_FRAMES,
} from "../game/constants.js";
import SpriteLoader from "../game/SpriteLoader.js";
import SpriteAnimator from "../game/SpriteAnimator.js";

/**
 * A ground-based patrol enemy that walks back and forth between
 * two X boundaries.
 *
 * @class GroundEnemy
 */
class GroundEnemy {
  /** @type {number} */
  x;

  /** @type {number} */
  y;

  /** @type {number} */
  w;

  /** @type {number} */
  h;

  /** @type {number} Leftmost patrol X. */
  minX;

  /** @type {number} Rightmost patrol X. */
  maxX;

  /** @type {number} Current horizontal speed (positive = right). */
  vx;

  /** @type {boolean} Whether the enemy is still alive. */
  alive;

  /**
   * @param {number} x - Starting X position.
   * @param {number} y - Starting Y position (bottom-aligned on ground).
   * @param {number} minX - Left patrol boundary.
   * @param {number} maxX - Right patrol boundary.
   */
  constructor(x, y, minX, maxX) {
    this.x = x;
    this.y = y;
    this.w = ENEMY_WIDTH;
    this.h = ENEMY_HEIGHT;
    this.minX = minX;
    this.maxX = maxX;
    this.vx = ENEMY_SPEED;
    this.alive = true;

    this._animator = new SpriteAnimator();
    this._animator.addAnimation("walk", {
      spriteKey: SPRITE_GROUND_ENEMY_WALK,
      frameWidth: ENEMY_FRAME_WIDTH,
      frameHeight: ENEMY_FRAME_HEIGHT,
      frameCount: ENEMY_WALK_FRAMES,
      fps: ENEMY_WALK_FPS,
      loop: true,
    });
  }

  /* ------------------------------------------------------------------ */
  /*  Public API                                                         */
  /* ------------------------------------------------------------------ */

  /**
   * Advance the enemy position and flip direction at boundaries.
   * @param {number} dt - Delta time in seconds.
   */
  update(dt) {
    if (!this.alive) return;

    this._animator.update(dt);

    this.x += this.vx * dt;

    if (this.x <= this.minX) {
      this.x = this.minX;
      this.vx = ENEMY_SPEED;
    } else if (this.x + this.w >= this.maxX) {
      this.x = this.maxX - this.w;
      this.vx = -ENEMY_SPEED;
    }
  }

  /**
   * Draw the enemy as a simple pixel-style purple monster.
   * The eyes face the current movement direction.
   * @param {CanvasRenderingContext2D} ctx
   */
  render(ctx) {
    if (!this.alive) return;

    ctx.save();

    // Try sprite-sheet animation first, then single-image, then canvas fallback
    this._animator.play("walk");
    this._animator.draw(ctx, this.x, this.y, this.w, this.h, this.vx < 0);

    if (this._animator.isAvailable("walk")) {
      ctx.restore();
      return;
    }

    // Legacy single-sprite fallback (if ground_enemy.png exists without sheet)
    if (SpriteLoader.has(SPRITE_GROUND_ENEMY_WALK)) {
      SpriteLoader.drawSprite(ctx, SPRITE_GROUND_ENEMY_WALK, this.x, this.y, this.w, this.h, this.vx < 0);
      ctx.restore();
      return;
    }

    const cx = this.x + this.w / 2;
    const cy = this.y + this.h / 2;
    const facingRight = this.vx > 0;

    // Body
    ctx.fillStyle = ENEMY_BODY_COLOR;
    ctx.fillRect(this.x + 2, this.y + 4, this.w - 4, this.h - 8);

    // Head dome
    ctx.fillStyle = ENEMY_DETAIL_COLOR;
    ctx.beginPath();
    ctx.ellipse(cx, cy + 2, this.w / 2 - 2, 8, 0, Math.PI, 0);
    ctx.fill();

    // Eyes (white with dark pupils, offset toward facing direction)
    const eyeOffsetX = facingRight ? 3 : -3;
    const eyeY = cy - 2;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(cx - 6 + eyeOffsetX, eyeY - 3, 5, 5);
    ctx.fillRect(cx + 1 + eyeOffsetX, eyeY - 3, 5, 5);

    ctx.fillStyle = "#000000";
    ctx.fillRect(cx - 4 + eyeOffsetX, eyeY - 1, 3, 3);
    ctx.fillRect(cx + 3 + eyeOffsetX, eyeY - 1, 3, 3);

    // Feet
    ctx.fillStyle = ENEMY_DETAIL_COLOR;
    ctx.fillRect(this.x + 4, this.y + this.h - 6, 6, 6);
    ctx.fillRect(this.x + this.w - 10, this.y + this.h - 6, 6, 6);

    // Outline
    ctx.strokeStyle = ENEMY_OUTLINE_COLOR;
    ctx.lineWidth = 1;
    ctx.strokeRect(this.x, this.y, this.w, this.h);

    ctx.restore();
  }

  /**
   * Return the AABB for collision checks.
   * @returns {{ x: number, y: number, w: number, h: number }}
   */
  getBounds() {
    if (!this.alive) return null;
    return { x: this.x, y: this.y, w: this.w, h: this.h };
  }
}

export default GroundEnemy;