import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  FONT_FAMILY,
  SCENE_MENU,
} from "../game/constants.js";
import audioManager from "../game/AudioManager.js";

/**
 * Game Over screen shown when the player loses all lives.
 *
 * Displays a dark background with "GAME OVER" title,
 * the final score, and return-to-menu instructions.
 *
 * @class GameOverScene
 */
class GameOverScene {
  /** @type {number} Final score carried from the gameplay scene. */
  _score;

  /** @type {Function} Scene-switch callback. */
  _onChange;

  /**
   * @param {HTMLCanvasElement} canvas - The game canvas.
   * @param {(sceneId: string) => void} onChange - Scene-switch callback.
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

    this._onKeyDown = this._onKeyDown.bind(this);
  }

  /* ------------------------------------------------------------------ */
  /*  Public API                                                         */
  /* ------------------------------------------------------------------ */

  /** Attach input listeners. */
  start() {
    window.addEventListener("keydown", this._onKeyDown);
    audioManager.stopMusic();
    audioManager.playGameOver();
  }

  /** Detach input listeners. */
  stop() {
    window.removeEventListener("keydown", this._onKeyDown);
  }

  /**
   * No-op update — the game over screen is static.
   * @param {number} _dt - Delta time in seconds.
   */
  update(_dt) {
    // Static screen
  }

  /** Clear and draw the game over overlay. */
  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Dark background
    ctx.fillStyle = "#0a0a12";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    const centreX = CANVAS_WIDTH / 2;

    // "GAME OVER" title
    ctx.font = `48px ${FONT_FAMILY}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#cc2222";
    ctx.fillText("GAME OVER", centreX, CANVAS_HEIGHT / 2 - 60);

    // Final score
    ctx.font = `20px ${FONT_FAMILY}`;
    ctx.fillStyle = "#ffffff";
    ctx.fillText(`Final Score: ${this._score}`, centreX, CANVAS_HEIGHT / 2);

    // Return instruction
    ctx.font = `14px ${FONT_FAMILY}`;
    ctx.fillStyle = "#aaaaaa";
    ctx.fillText("Press ENTER to return to Menu", centreX, CANVAS_HEIGHT / 2 + 60);
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

export default GameOverScene;