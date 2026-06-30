/**
 * A horizontally-moving platform that travels between minX and maxX.
 * The player can stand on it and move with it.
 * @module MovingPlatform
 */

/** Darker wood body colour. @const {string} */
const MOVING_PLATFORM_COLOR = "#5C3A1E";

/** Darker wood highlight colour. @const {string} */
const MOVING_PLATFORM_HIGHLIGHT = "#4A2E14";

/** Metal wheel colour. @const {string} */
const WHEEL_COLOR = "#888888";

/** Wheel highlight colour. @const {string} */
const WHEEL_HIGHLIGHT = "#AAAAAA";

/** Wheel radius in pixels. @const {number} */
const WHEEL_RADIUS = 5;

/**
 * @class MovingPlatform
 */
class MovingPlatform {
  /** @type {number} Current X position. */
  x;

  /** @type {number} Current Y position. */
  y;

  /** @type {number} Platform width. */
  width;

  /** @type {number} Platform height. */
  height;

  /** @type {number} Left movement boundary. */
  minX;

  /** @type {number} Right movement boundary. */
  maxX;

  /** @type {number} Movement speed in pixels per second. */
  speed;

  /** @type {number} Current direction: 1 = right, -1 = left. */
  _direction;

  /** @type {number} X position delta from the most recent update. */
  _deltaX;

  /**
   * @param {number} x - Initial X position.
   * @param {number} y - Initial Y position.
   * @param {number} width - Platform width.
   * @param {number} height - Platform height.
   * @param {number} minX - Left movement boundary.
   * @param {number} maxX - Right movement boundary.
   * @param {number} speed - Movement speed in pixels per second.
   */
  constructor(x, y, width, height, minX, maxX, speed) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.minX = minX;
    this.maxX = maxX;
    this.speed = speed;
    this._direction = 1;
    this._deltaX = 0;
  }

  /* ------------------------------------------------------------------ */
  /*  Public API                                                         */
  /* ------------------------------------------------------------------ */

  /**
   * Advance the platform by dt seconds.  Reverses direction
   * automatically when reaching minX or maxX.
   * @param {number} dt - Delta time in seconds.
   */
  update(dt) {
    const prevX = this.x;

    this.x += this.speed * dt * this._direction;

    if (this.x >= this.maxX) {
      this.x = this.maxX;
      this._direction = -1;
    } else if (this.x <= this.minX) {
      this.x = this.minX;
      this._direction = 1;
    }

    this._deltaX = this.x - prevX;
  }

  /**
   * Draw the platform as a darker wooden plank with metal wheels at both ends.
   * @param {CanvasRenderingContext2D} ctx
   */
  render(ctx) {
    const x = this.x;
    const y = this.y;
    const w = this.width;
    const h = this.height;

    // --- Wooden body ---
    ctx.fillStyle = MOVING_PLATFORM_COLOR;
    ctx.fillRect(x, y, w, h);

    // Top highlight strip
    ctx.fillStyle = MOVING_PLATFORM_HIGHLIGHT;
    ctx.fillRect(x, y, w, 3);

    // --- Metal wheels at both ends ---
    const wheelY = y + h + WHEEL_RADIUS;
    const leftWheelX = x + WHEEL_RADIUS + 2;
    const rightWheelX = x + w - WHEEL_RADIUS - 2;

    // Left wheel
    ctx.fillStyle = WHEEL_COLOR;
    ctx.beginPath();
    ctx.arc(leftWheelX, wheelY, WHEEL_RADIUS, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = WHEEL_HIGHLIGHT;
    ctx.beginPath();
    ctx.arc(leftWheelX - 1, wheelY - 2, 2, 0, Math.PI * 2);
    ctx.fill();

    // Right wheel
    ctx.fillStyle = WHEEL_COLOR;
    ctx.beginPath();
    ctx.arc(rightWheelX, wheelY, WHEEL_RADIUS, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = WHEEL_HIGHLIGHT;
    ctx.beginPath();
    ctx.arc(rightWheelX - 1, wheelY - 2, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  /**
   * Return the current AABB collider.
   * @returns {{ x: number, y: number, w: number, h: number }}
   */
  getBounds() {
    return { x: this.x, y: this.y, w: this.width, h: this.height };
  }

  /**
   * Return the X-axis delta from the most recent update call.
   * @returns {number}
   */
  getDeltaX() {
    return this._deltaX;
  }
}

export default MovingPlatform;