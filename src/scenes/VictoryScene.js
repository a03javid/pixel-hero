import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  FONT_FAMILY,
  SCENE_MENU,
  LEVEL_SKY_TOP,
  LEVEL_SKY_BOTTOM,
  GROUND_COLOR,
  GROUND_HIGHLIGHT_COLOR,
  CASTLE_WALL_COLOR,
  CASTLE_TOWER_COLOR,
  CASTLE_ROOF_COLOR,
  CASTLE_DOOR_COLOR,
  CASTLE_WINDOW_COLOR,
} from "../game/constants.js";

/**
 * Victory celebration scene shown after completing Stage 5.
 *
 * Displays a bright pixel-art backdrop with castle, green ground,
 * floating confetti, gold "YOU WIN!" title, final score, and
 * return-to-menu instruction.
 *
 * @class VictoryScene
 */
class VictoryScene {
  /** @type {number} Final score carried from the gameplay scene. */
  _score;

  /** @type {Function} Scene-switch callback. */
  _onChange;

  /** @type {(e: KeyboardEvent) => void} Bound keydown handler. */
  _boundKeyDown;

  /** @type {Array<{ x: number, y: number, vy: number, color: string, w: number, h: number }>} */
  _confetti;

  /**
   * @param {HTMLCanvasElement} canvas - The game canvas.
   * @param {(sceneId: string, options?: object) => void} onChange - Scene-switch callback.
   * @param {object} [options]
   * @param {number} [options.score=0] - Final score to display.
   */
  constructor(canvas, onChange, options) {
    /** @type {HTMLCanvasElement} */
    this.canvas = canvas;

    /** @type {CanvasRenderingContext2D} */
    this.ctx = canvas.getContext("2d");

    this._onChange = onChange;
    this._score = options?.score ?? 0;

    this._boundKeyDown = this._onKeyDown.bind(this);
    this._confetti = this._generateConfetti(60);
  }

  /* ------------------------------------------------------------------ */
  /*  Public API                                                         */
  /* ------------------------------------------------------------------ */

  /** Attach input listeners. */
  start() {
    window.addEventListener("keydown", this._boundKeyDown);
  }

  /** Detach input listeners. */
  stop() {
    window.removeEventListener("keydown", this._boundKeyDown);
  }

  /**
   * Animate confetti particles.
   * @param {number} dt - Delta time in seconds.
   */
  update(dt) {
    for (let i = 0; i < this._confetti.length; i++) {
      const c = this._confetti[i];
      c.y += c.vy * dt;
      if (c.y > CANVAS_HEIGHT + 16) {
        c.y = -16;
        c.x = Math.random() * CANVAS_WIDTH;
      }
    }
  }

  /** Clear and draw the victory celebration screen. */
  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    this._drawSky(ctx);
    this._drawGround(ctx);
    this._drawCastle(ctx);
    this._drawConfetti(ctx);
    this._drawText(ctx);
  }

  /* ------------------------------------------------------------------ */
  /*  Background                                                         */
  /* ------------------------------------------------------------------ */

  /**
   * Fill the sky with a bright daytime gradient.
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
   * Draw the green ground strip.
   * @param {CanvasRenderingContext2D} ctx
   */
  _drawGround(ctx) {
    const groundTop = CANVAS_HEIGHT * 0.78;
    const groundHeight = CANVAS_HEIGHT - groundTop;

    ctx.fillStyle = GROUND_COLOR;
    ctx.fillRect(0, groundTop, CANVAS_WIDTH, groundHeight);

    ctx.fillStyle = GROUND_HIGHLIGHT_COLOR;
    ctx.fillRect(0, groundTop, CANVAS_WIDTH, 6);
  }

  /**
   * Draw a simple pixel-art castle as the backdrop.
   * @param {CanvasRenderingContext2D} ctx
   */
  _drawCastle(ctx) {
    const cx = CANVAS_WIDTH * 0.75;
    const baseY = CANVAS_HEIGHT * 0.78;
    const bodyW = 100;
    const bodyH = 90;

    const bodyX = cx - bodyW / 2;
    const bodyY = baseY - bodyH;

    // Main body
    ctx.fillStyle = CASTLE_WALL_COLOR;
    ctx.fillRect(bodyX, bodyY, bodyW, bodyH);

    // Left tower
    const tw = 30;
    const th = 60;
    const ltx = bodyX - 6;
    const lty = bodyY - th + 14;
    ctx.fillStyle = CASTLE_TOWER_COLOR;
    ctx.fillRect(ltx, lty, tw, th);
    ctx.fillStyle = CASTLE_ROOF_COLOR;
    ctx.beginPath();
    ctx.moveTo(ltx - 6, lty);
    ctx.lineTo(ltx + tw / 2, lty - 20);
    ctx.lineTo(ltx + tw + 6, lty);
    ctx.closePath();
    ctx.fill();

    // Right tower
    const rtx = bodyX + bodyW - tw + 6;
    const rty = lty;
    ctx.fillStyle = CASTLE_TOWER_COLOR;
    ctx.fillRect(rtx, rty, tw, th);
    ctx.fillStyle = CASTLE_ROOF_COLOR;
    ctx.beginPath();
    ctx.moveTo(rtx - 6, rty);
    ctx.lineTo(rtx + tw / 2, rty - 20);
    ctx.lineTo(rtx + tw + 6, rty);
    ctx.closePath();
    ctx.fill();

    // Centre cap
    const capW = 34;
    const capH = 24;
    const capX = cx - capW / 2;
    const capY = bodyY - capH;
    ctx.fillStyle = CASTLE_TOWER_COLOR;
    ctx.fillRect(capX, capY, capW, capH);
    ctx.fillStyle = CASTLE_ROOF_COLOR;
    ctx.beginPath();
    ctx.moveTo(capX - 6, capY);
    ctx.lineTo(cx, capY - 26);
    ctx.lineTo(capX + capW + 6, capY);
    ctx.closePath();
    ctx.fill();

    // Door
    const dW = 20;
    const dH = 34;
    const dX = cx - dW / 2;
    const dY = baseY - dH;
    ctx.fillStyle = CASTLE_DOOR_COLOR;
    ctx.fillRect(dX, dY, dW, dH);
    ctx.beginPath();
    ctx.ellipse(cx, dY, dW / 2, 10, 0, Math.PI, 0);
    ctx.fill();

    // Windows
    ctx.fillStyle = CASTLE_WINDOW_COLOR;
    ctx.fillRect(bodyX + 16, bodyY + 24, 10, 10);
    ctx.fillRect(bodyX + bodyW - 16 - 10, bodyY + 24, 10, 10);
  }

  /* ------------------------------------------------------------------ */
  /*  Confetti                                                            */
  /* ------------------------------------------------------------------ */

  /**
   * Generate an array of confetti particles.
   * @param {number} count - Number of particles.
   * @returns {Array<{ x: number, y: number, vy: number, color: string, w: number, h: number }>}
   */
  _generateConfetti(count) {
    const colors = ["#ff4444", "#44ff44", "#4444ff", "#ffff44", "#ff44ff", "#44ffff", "#ff8844", "#ffffff"];
    const list = [];
    for (let i = 0; i < count; i++) {
      list.push({
        x: Math.random() * CANVAS_WIDTH,
        y: Math.random() * CANVAS_HEIGHT,
        vy: 40 + Math.random() * 80,
        color: colors[Math.floor(Math.random() * colors.length)],
        w: 4 + Math.random() * 6,
        h: 4 + Math.random() * 6,
      });
    }
    return list;
  }

  /**
   * Draw all confetti particles as simple coloured rectangles.
   * @param {CanvasRenderingContext2D} ctx
   */
  _drawConfetti(ctx) {
    for (let i = 0; i < this._confetti.length; i++) {
      const c = this._confetti[i];
      ctx.fillStyle = c.color;
      ctx.fillRect(Math.round(c.x), Math.round(c.y), c.w, c.h);
    }
  }

  /* ------------------------------------------------------------------ */
  /*  Text                                                                */
  /* ------------------------------------------------------------------ */

  /**
   * Draw the victory text centred on screen.
   * @param {CanvasRenderingContext2D} ctx
   */
  _drawText(ctx) {
    const centreX = CANVAS_WIDTH / 2;
    let y = CANVAS_HEIGHT / 2 - 80;

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // "YOU WIN!" title
    ctx.font = `48px ${FONT_FAMILY}`;
    ctx.fillStyle = "#FFD700";
    ctx.fillText("YOU WIN!", centreX, y);

    y += 50;

    // "Congratulations!"
    ctx.font = `20px ${FONT_FAMILY}`;
    ctx.fillStyle = "#ffffff";
    ctx.fillText("Congratulations!", centreX, y);

    y += 36;

    // Final score
    ctx.font = `18px ${FONT_FAMILY}`;
    ctx.fillStyle = "#FFD700";
    ctx.fillText(`Final Score: ${this._score}`, centreX, y);

    y += 40;

    // Thank you
    ctx.font = `14px ${FONT_FAMILY}`;
    ctx.fillStyle = "#cccccc";
    ctx.fillText("Thank you for playing Pixel Hero", centreX, y);

    y += 50;

    // Return instruction
    ctx.font = `14px ${FONT_FAMILY}`;
    ctx.fillStyle = "#aaaaaa";
    ctx.fillText("Press ENTER to return to Menu", centreX, y);
  }

  /* ------------------------------------------------------------------ */
  /*  Input                                                              */
  /* ------------------------------------------------------------------ */

  /**
   * Handle key presses. ENTER and ESC both return to the menu.
   * @param {KeyboardEvent} e
   */
  _onKeyDown(e) {
    if (e.key === "Enter" || e.key === "Escape") {
      e.preventDefault();
      this._onChange(SCENE_MENU);
    }
  }
}

export default VictoryScene;