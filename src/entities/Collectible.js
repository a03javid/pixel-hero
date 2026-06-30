import {
  COLLECTIBLE_COIN,
  COLLECTIBLE_HEART,
  COIN_SIZE,
  COIN_COLOR,
  COIN_OUTLINE_COLOR,
  HEART_SIZE,
  MAX_LIVES,
} from "../game/constants.js";

/**
 * A collectible item placed in the level: coin or heart.
 *
 * Coins add +1 to the player's score.
 * Hearts add +1 life (capped at MAX_LIVES).
 *
 * @class Collectible
 */
class Collectible {
  /** @type {string} "COIN" or "HEART". */
  type;

  /** @type {number} */
  x;

  /** @type {number} */
  y;

  /** @type {number} */
  width;

  /** @type {number} */
  height;

  /** @type {boolean} Whether the item was already picked up. */
  collected;

  /**
   * @param {string} type - `COLLECTIBLE_COIN` or `COLLECTIBLE_HEART`.
   * @param {number} x - Centre X position.
   * @param {number} y - Centre Y position.
   */
  constructor(type, x, y) {
    this.type = type;
    this.collected = false;

    const size = type === COLLECTIBLE_COIN ? COIN_SIZE : HEART_SIZE;
    this.width = size;
    this.height = size;

    this.x = x - size / 2;
    this.y = y - size / 2;
  }

  /* ------------------------------------------------------------------ */
  /*  Public API                                                         */
  /* ------------------------------------------------------------------ */

  /**
   * Check collision with the player.
   * @param {number} dt - Delta time in seconds.
   * @param {import("./Player.js").default} player - The player entity.
   */
  update(dt, player) {
    if (this.collected) return;

    if (this._overlapsPlayer(player)) {
      this.collected = true;
      this._onCollect(player);
    }
  }

  /**
   * Draw the collectible unless already collected.
   * @param {CanvasRenderingContext2D} ctx
   */
  render(ctx) {
    if (this.collected) return;

    if (this.type === COLLECTIBLE_COIN) {
      this._renderCoin(ctx);
    } else {
      this._renderHeart(ctx);
    }
  }

  /**
   * Return the AABB of this collectible.
   * @returns {{ x: number, y: number, w: number, h: number }}
   */
  getBounds() {
    return { x: this.x, y: this.y, w: this.width, h: this.height };
  }

  /* ------------------------------------------------------------------ */
  /*  Collision                                                          */
  /* ------------------------------------------------------------------ */

  /**
   * Simple AABB overlap check against the player.
   * @param {import("./Player.js").default} player
   * @returns {boolean}
   */
  _overlapsPlayer(player) {
    return (
      this.x < player.x + player.w &&
      this.x + this.width > player.x &&
      this.y < player.y + player.h &&
      this.y + this.height > player.y
    );
  }

  /* ------------------------------------------------------------------ */
  /*  Collection effect                                                  */
  /* ------------------------------------------------------------------ */

  /**
   * Apply the collectible's effect to the player.
   * @param {import("./Player.js").default} player
   */
  _onCollect(player) {
    if (this.type === COLLECTIBLE_COIN) {
      player.score += 1;
    } else if (this.type === COLLECTIBLE_HEART) {
      if (player.lives < MAX_LIVES) {
        player.lives += 1;
      }
    }
  }

  /* ------------------------------------------------------------------ */
  /*  Rendering                                                          */
  /* ------------------------------------------------------------------ */

  /**
   * Draw a static gold coin circle with a darker outline.
   * @param {CanvasRenderingContext2D} ctx
   */
  _renderCoin(ctx) {
    const cx = this.x + this.width / 2;
    const cy = this.y + this.height / 2;
    const r = this.width / 2;

    ctx.save();

    // Outline
    ctx.strokeStyle = COIN_OUTLINE_COLOR;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    // Fill
    ctx.fillStyle = COIN_COLOR;
    ctx.beginPath();
    ctx.arc(cx, cy, r - 1, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  /**
   * Draw a heart emoji centred in the collectible bounds.
   * @param {CanvasRenderingContext2D} ctx
   */
  _renderHeart(ctx) {
    const cx = this.x + this.width / 2;
    const cy = this.y + this.height / 2;

    ctx.save();
    ctx.font = `${this.width}px serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("❤️", cx, cy);
    ctx.restore();
  }
}

export default Collectible;