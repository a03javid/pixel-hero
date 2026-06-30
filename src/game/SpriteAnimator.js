/**
 * @fileoverview Generic sprite-sheet animation engine.
 *
 * Manages named animation definitions, frame timing, looping, and
 * renders the current frame via {@link SpriteLoader}.
 *
 * @module SpriteAnimator
 */

import SpriteLoader from "./SpriteLoader.js";

/* ------------------------------------------------------------------ */
/*  Type definitions                                                   */
/* ------------------------------------------------------------------ */

/**
 * Configuration for one animation.
 * @typedef {object} AnimConfig
 * @property {string} spriteKey - SpriteLoader cache key for the sprite sheet.
 * @property {number} frameWidth - Width of one frame on the sheet (px).
 * @property {number} frameHeight - Height of one frame on the sheet (px).
 * @property {number} frameCount - Number of frames laid out horizontally.
 * @property {number} fps - Playback speed in frames per second.
 * @property {boolean} loop - Whether the animation repeats after the last frame.
 */

/* ------------------------------------------------------------------ */
/*  SpriteAnimator                                                     */
/* ------------------------------------------------------------------ */

/**
 * Lightweight animation controller that holds animation definitions
 * and advances frame timing each update.
 *
 * @class SpriteAnimator
 */
class SpriteAnimator {
  /**
   * Map of animation name → config.
   * @type {Map<string, AnimConfig>}
   */
  _animations;

  /** @type {string|null} Currently playing animation name. */
  _currentName;

  /** @type {number} Zero-based index of the current frame. */
  _currentFrame;

  /** @type {number} Accumulated time within the current frame (seconds). */
  _timer;

  constructor() {
    this._animations = new Map();
    this._currentName = null;
    this._currentFrame = 0;
    this._timer = 0;
  }

  /* ------------------------------------------------------------------ */
  /*  Public API                                                         */
  /* ------------------------------------------------------------------ */

  /**
   * Register a new animation definition.
   * Frames are assumed to be laid out in a single horizontal row.
   *
   * @param {string} name - Unique animation identifier.
   * @param {AnimConfig} config
   */
  addAnimation(name, config) {
    this._animations.set(name, config);
  }

  /**
   * Switch to the named animation.
   * If the same animation is already playing this is a no-op to avoid
   * frame-jumping.
   *
   * @param {string} name
   */
  play(name) {
    if (this._currentName === name) return;
    this._currentName = name;
    this._currentFrame = 0;
    this._timer = 0;
  }

  /**
   * Advance the animation timer by `dt` seconds.
   *
   * @param {number} dt - Delta time in seconds.
   */
  update(dt) {
    const config = this._animations.get(this._currentName);
    if (!config) return;

    this._timer += dt;
    const frameDuration = 1 / config.fps;

    while (this._timer >= frameDuration) {
      this._timer -= frameDuration;
      this._currentFrame += 1;

      if (this._currentFrame >= config.frameCount) {
        if (config.loop) {
          this._currentFrame = 0;
        } else {
          this._currentFrame = config.frameCount - 1;
          this._timer = 0;
        }
      }
    }
  }

  /**
   * Draw the current animation frame into the destination rectangle.
   * No-op if the sprite is not loaded or no animation is active.
   *
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} x - Destination X on the canvas.
   * @param {number} y - Destination Y on the canvas.
   * @param {number} w - Destination width.
   * @param {number} h - Destination height.
   * @param {boolean} [flipX=false] - When true, mirror the frame horizontally.
   */
  draw(ctx, x, y, w, h, flipX = false) {
    const config = this._animations.get(this._currentName);
    if (!config) return;

    if (!SpriteLoader.has(config.spriteKey)) return;

    const sx = this._currentFrame * config.frameWidth;
    const sy = 0;
    const sw = config.frameWidth;
    const sh = config.frameHeight;

    ctx.save();
    if (flipX) {
      ctx.translate(x + w, y);
      ctx.scale(-1, 1);
      SpriteLoader.drawSprite(ctx, config.spriteKey, 0, 0, w, h, false, sx, sy, sw, sh);
    } else {
      SpriteLoader.drawSprite(ctx, config.spriteKey, x, y, w, h, false, sx, sy, sw, sh);
    }
    ctx.restore();
  }

  /**
   * Reset the current animation to frame 0.
   */
  reset() {
    this._currentFrame = 0;
    this._timer = 0;
  }

  /**
   * Return the name of the currently playing animation.
   * @returns {string|null}
   */
  getCurrentName() {
    return this._currentName;
  }

  /**
   * Returns true if the named animation's sprite sheet is loaded.
   * @param {string} name
   * @returns {boolean}
   */
  isAvailable(name) {
    const config = this._animations.get(name);
    if (!config) return false;
    return SpriteLoader.has(config.spriteKey);
  }
}

export default SpriteAnimator;