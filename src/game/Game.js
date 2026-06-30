import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  SCENE_MENU,
  SCENE_GAMEPLAY,
  SCENE_GAMEOVER,
  SCENE_VICTORY,
  SCENE_HELP,
  SCENE_CREDITS,
} from "./constants.js";
import MenuScene from "../scenes/MenuScene.js";
import GameplayScene from "../scenes/GameplayScene.js";
import GameOverScene from "../scenes/GameOverScene.js";
import VictoryScene from "../scenes/VictoryScene.js";
import HelpScene from "../scenes/HelpScene.js";
import CreditsScene from "../scenes/CreditsScene.js";

/**
 * Minimal game runner.
 *
 * Owns the requestAnimationFrame loop, tracks delta-time, and delegates
 * to the active scene.  Scenes can request a switch via the
 * `onChangeScene` callback.
 *
 * @class Game
 */
class Game {
  /** @type {?number} ID returned by requestAnimationFrame. */
  _rafId;

  /** @type {number} Timestamp of the previous frame in milliseconds. */
  _lastTime;

  /** @type {MenuScene|GameplayScene} The currently active scene. */
  _scene;

  /**
   * Initialise the game on the supplied canvas.
   * @param {HTMLCanvasElement} canvas
   */
  constructor(canvas) {
    /** @type {HTMLCanvasElement} */
    this.canvas = canvas;

    this.canvas.width = CANVAS_WIDTH;
    this.canvas.height = CANVAS_HEIGHT;

    /** @type {CanvasRenderingContext2D} */
    this.ctx = this.canvas.getContext("2d");

    this._rafId = null;
    this._lastTime = 0;

    this._scene = new MenuScene(this.canvas, this._onChangeScene);
  }

  /** Start the requestAnimationFrame loop and attach scene listeners. */
  start() {
    this._scene.start();
    this._lastTime = performance.now();
    this._rafId = requestAnimationFrame(this._loop);
  }

  /** Cancel the animation loop and detach scene listeners. */
  stop() {
    if (this._rafId !== null) {
      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
    this._scene.stop();
  }

  /**
   * Scene-switch callback passed to every scene.
   * Stops the current scene, instantiates the requested one, and starts it.
   * @param {string} sceneId - One of the SCENE_* constants.
   * @param {object} [options] - Optional parameters for the scene.
   * @param {number} [options.stageNumber] - Stage to load (for gameplay).
   * @param {number} [options.score] - Final score to display (Game Over).
   * @param {import("../entities/Player.js").default} [options.player] - Player to reuse.
   */
  _onChangeScene = async (sceneId, options) => {
    this._scene.stop();

    if (sceneId === SCENE_MENU) {
      this._scene = new MenuScene(this.canvas, this._onChangeScene);
    } else if (sceneId === SCENE_GAMEPLAY) {
      await GameplayScene.preloadSprites();
      const stageNumber = options?.stageNumber ?? 1;
      const player = options?.player ?? null;
      this._scene = new GameplayScene(this.canvas, this._onChangeScene, stageNumber, player);
    } else if (sceneId === SCENE_GAMEOVER) {
      const score = options?.score ?? 0;
      this._scene = new GameOverScene(this.canvas, this._onChangeScene, { score });
    } else if (sceneId === SCENE_VICTORY) {
      const score = options?.score ?? 0;
      this._scene = new VictoryScene(this.canvas, this._onChangeScene, { score });
    } else if (sceneId === SCENE_HELP) {
      this._scene = new HelpScene(this.canvas, this._onChangeScene);
    } else if (sceneId === SCENE_CREDITS) {
      this._scene = new CreditsScene(this.canvas, this._onChangeScene);
    }

    this._scene.start();
    this._lastTime = performance.now();
  };

  /**
   * The main game loop (arrow function to preserve `this` binding).
   * @param {DOMHighResTimeStamp} now
   */
  _loop = (now) => {
    const dt = (now - this._lastTime) / 1000;
    this._lastTime = now;

    this._scene.update(dt);
    this._scene.render();

    this._rafId = requestAnimationFrame(this._loop);
  };
}

export default Game;