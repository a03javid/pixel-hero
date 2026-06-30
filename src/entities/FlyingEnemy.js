import {
  ENEMY_WIDTH,
  ENEMY_HEIGHT,
  ENEMY_BODY_COLOR,
  ENEMY_DETAIL_COLOR,
  ENEMY_OUTLINE_COLOR,
  SPRITE_FLYING_ENEMY_FLY,
  FLYING_ENEMY_SPEED,
  FLYING_ENEMY_FRAME_WIDTH,
  FLYING_ENEMY_FRAME_HEIGHT,
  FLYING_ENEMY_FLY_FPS,
  FLYING_ENEMY_FLY_FRAMES,
  WING_FLAP_SPEED,
} from "../game/constants.js";
import SpriteLoader from "../game/SpriteLoader.js";
import SpriteAnimator from "../game/SpriteAnimator.js";

/**
 * A flying enemy that patrols horizontally between two X boundaries
 * without being affected by gravity or colliding with platforms.
 *
 * @class FlyingEnemy
 */
class FlyingEnemy {
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

  /** @type {number} Accumulated phase for wing-flap animation (canvas fallback). */
  _wingPhase;

  /**
   * @param {number} x - Starting X position.
   * @param {number} y - Starting Y position.
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
    this.vx = FLYING_ENEMY_SPEED;
    this.alive = true;
    this._wingPhase = 0;

    this._animator = new SpriteAnimator();
    this._animator.addAnimation("fly", {
      spriteKey: SPRITE_FLYING_ENEMY_FLY,
      frameWidth: FLYING_ENEMY_FRAME_WIDTH,
      frameHeight: FLYING_ENEMY_FRAME_HEIGHT,
      frameCount: FLYING_ENEMY_FLY_FRAMES,
      fps: FLYING_ENEMY_FLY_FPS,
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
    this._wingPhase += WING_FLAP_SPEED * dt;

    if (this.x <= this.minX) {
      this.x = this.minX;
      this.vx = FLYING_ENEMY_SPEED;
    } else if (this.x + this.w >= this.maxX) {
      this.x = this.maxX - this.w;
      this.vx = -FLYING_ENEMY_SPEED;
    }
  }

  /**
   * Draw the flying enemy as a bat-like creature.
   * Uses sprite animation when available; falls back to canvas rendering.
   * @param {CanvasRenderingContext2D} ctx
   */
  render(ctx) {
    if (!this.alive) return;

    ctx.save();

    // Try sprite-sheet animation first
    this._animator.play("fly");
    this._animator.draw(ctx, this.x, this.y, this.w, this.h, this.vx < 0);

    if (this._animator.isAvailable("fly")) {
      ctx.restore();
      return;
    }

    // Fallback: single-sprite
    if (SpriteLoader.has(SPRITE_FLYING_ENEMY_FLY)) {
      SpriteLoader.drawSprite(ctx, SPRITE_FLYING_ENEMY_FLY, this.x, this.y, this.w, this.h, this.vx < 0);
      ctx.restore();
      return;
    }

    const cx = this.x + this.w / 2;
    const cy = this.y + this.h / 2;
    const facingRight = this.vx > 0;
    const wingOffset = Math.sin(this._wingPhase) * 6;

    // Dark outline
    ctx.strokeStyle = ENEMY_OUTLINE_COLOR;
    ctx.lineWidth = 2;

    // Left wing
    ctx.fillStyle = ENEMY_BODY_COLOR;
    ctx.beginPath();
    ctx.ellipse(
      cx - 8 - wingOffset,
      cy - 2,
      10 + wingOffset * 0.5,
      12,
      0.3,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.stroke();

    // Right wing
    ctx.beginPath();
    ctx.ellipse(
      cx + 8 + wingOffset,
      cy - 2,
      10 + wingOffset * 0.5,
      12,
      -0.3,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.stroke();

    // Body (oval)
    ctx.fillStyle = ENEMY_BODY_COLOR;
    ctx.beginPath();
    ctx.ellipse(cx, cy, 8, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Eyes (white with dark pupils, offset toward facing direction)
    const eyeOffsetX = facingRight ? 3 : -3;
    const eyeY = cy - 4;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(cx - 5 + eyeOffsetX, eyeY - 2, 4, 4);
    ctx.fillRect(cx + 1 + eyeOffsetX, eyeY - 2, 4, 4);

    ctx.fillStyle = "#000000";
    ctx.fillRect(cx - 3 + eyeOffsetX, eyeY, 2, 2);
    ctx.fillRect(cx + 3 + eyeOffsetX, eyeY, 2, 2);

    // Fangs (tiny triangles below body)
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.moveTo(cx - 3, cy + 8);
    ctx.lineTo(cx - 1, cy + 14);
    ctx.lineTo(cx + 1, cy + 8);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(cx + 1, cy + 8);
    ctx.lineTo(cx + 3, cy + 14);
    ctx.lineTo(cx + 5, cy + 8);
    ctx.closePath();
    ctx.fill();

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

export default FlyingEnemy;