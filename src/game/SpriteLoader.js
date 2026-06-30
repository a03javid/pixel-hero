/**
 * @fileoverview Centralised sprite loading, caching, and drawing utility.
 *
 * Sprites are loaded from `/assets/images/...` at runtime via `new Image()`.
 * If an image fails to load (e.g. file missing) it is marked as unavailable
 * so the caller can fall back to Canvas rendering.
 */

/**
 * In-memory cache for loaded HTMLImageElement objects.
 * @type {Map<string, HTMLImageElement>}
 */
const _cache = new Map();

/**
 * Names that were attempted but failed to load.
 * @type {Set<string>}
 */
const _missing = new Set();

/**
 * Preload a single sprite by name and URL path.
 *
 * @param {string} name - Unique key used to retrieve the sprite later.
 * @param {string} url - Image URL relative to the site root (e.g. `/assets/images/player/player_idle.png`).
 * @returns {Promise<void>} Resolves when the image is loaded or marked as missing.
 */
function load(name, url) {
  if (_cache.has(name) || _missing.has(name)) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      _cache.set(name, img);
      resolve();
    };
    img.onerror = () => {
      _missing.add(name);
      resolve();
    };
    img.src = url;
  });
}

/**
 * Returns true if the named sprite was loaded successfully.
 * @param {string} name
 * @returns {boolean}
 */
function has(name) {
  return _cache.has(name);
}

/**
 * Draw a cached sprite (or a region of it) into the destination rectangle.
 *
 * If the sprite is not cached this is a no-op; callers should provide
 * their own fallback rendering.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {string} name - Sprite key previously passed to `load()`.
 * @param {number} x - Destination X on the canvas.
 * @param {number} y - Destination Y on the canvas.
 * @param {number} w - Destination width.
 * @param {number} h - Destination height.
 * @param {boolean} [flipX=false] - When true, mirror the sprite horizontally.
 * @param {number} [sx=0] - Source X within the image.
 * @param {number} [sy=0] - Source Y within the image.
 * @param {number} [sw] - Source width. Defaults to the full image width.
 * @param {number} [sh] - Source height. Defaults to the full image height.
 */
function drawSprite(ctx, name, x, y, w, h, flipX = false, sx = 0, sy = 0, sw, sh) {
  const img = _cache.get(name);
  if (!img) return;

  const srcW = sw !== undefined ? sw : img.width;
  const srcH = sh !== undefined ? sh : img.height;

  ctx.save();
  if (flipX) {
    ctx.translate(x + w, y);
    ctx.scale(-1, 1);
    ctx.drawImage(img, sx, sy, srcW, srcH, 0, 0, w, h);
  } else {
    ctx.drawImage(img, sx, sy, srcW, srcH, x, y, w, h);
  }
  ctx.restore();
}

const SpriteLoader = { load, has, drawSprite };
export default SpriteLoader;