import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  MENU_BUTTONS,
  SCENE_GAMEPLAY,
  SCENE_HELP,
  SCENE_CREDITS,
  TITLE_TEXT,
  FONT_FAMILY,
  TITLE_FONT_SIZE,
  BUTTON_FONT_SIZE,
  BUTTON_HEIGHT,
  BUTTON_GAP,
  BUTTONS_TOP_OFFSET,
  SELECTED_SCALE,
  GOLD_BORDER_WIDTH,
  GOLD_COLOR,
  GLOW_COLOR,
  GLOW_BLUR,
  BUTTON_BG_COLOR,
  BUTTON_TEXT_COLOR,
  BUTTON_HOVER_BG_COLOR,
  TITLE_COLOR,
  TITLE_STROKE_COLOR,
  TITLE_STROKE_WIDTH,
  SKY_COLOR_TOP,
  SKY_COLOR_BOTTOM,
  CLOUD_COLOR,
  MOUNTAIN_FAR_COLOR,
  MOUNTAIN_MID_COLOR,
  MOUNTAIN_NEAR_COLOR,
  SNOW_COLOR,
  GROUND_COLOR,
  GROUND_HIGHLIGHT_COLOR,
} from "../game/constants.js";

/**
 * Represents a rectangular region used for hit-testing a menu button.
 * @typedef {{ x: number, y: number, w: number, h: number }} HitRect
 */

/**
 * The main menu scene shown when the game starts.
 *
 * Renders a pixel-art background with mountains, clouds, and a green
 * foreground.  Displays the game title and four interactive menu
 * buttons that respond to mouse and keyboard input.
 *
 * @class MenuScene
 */
class MenuScene {
  /** @type {number} Index of the currently selected menu item. */
  _selectedIndex;

  /** @type {HitRect[]} Per-button hit-test rectangles (set once per frame). */
  _buttonRects;

  /**
   * Horizontal centre of the canvas cached once to avoid repeated
   * calculations.
   * @type {number}
   */
  _centerX;

  /**
   * @param {HTMLCanvasElement} canvas - The game canvas element.
   * @param {(sceneId: string) => void} onChange - Scene-switch callback.
   */
  constructor(canvas, onChange) {
    /** @type {HTMLCanvasElement} */
    this.canvas = canvas;

    /** @type {CanvasRenderingContext2D} */
    this.ctx = canvas.getContext("2d");

    /** @type {(sceneId: string) => void} */
    this._onChange = onChange;

    this._selectedIndex = 0;
    this._buttonRects = [];

    this._centerX = CANVAS_WIDTH / 2;

    this._onKeyDown = this._onKeyDown.bind(this);
    this._onMouseMove = this._onMouseMove.bind(this);
    this._onClick = this._onClick.bind(this);
  }

  /* ------------------------------------------------------------------ */
  /*  Public API                                                         */
  /* ------------------------------------------------------------------ */

  /** Attach event listeners for keyboard and mouse interaction. */
  start() {
    window.addEventListener("keydown", this._onKeyDown);
    this.canvas.addEventListener("mousemove", this._onMouseMove);
    this.canvas.addEventListener("click", this._onClick);
  }

  /** Remove event listeners. Call when leaving this scene. */
  stop() {
    window.removeEventListener("keydown", this._onKeyDown);
    this.canvas.removeEventListener("mousemove", this._onMouseMove);
    this.canvas.removeEventListener("click", this._onClick);
  }

  /**
   * Advance scene logic by `dt` seconds.
   * @param {number} dt - Delta time in seconds.
   */
  update(dt) {
    // Reserved for future animation (e.g. cloud drift).
  }

  /** Clear and redraw the entire scene. */
  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    this._drawBackground(ctx);
    this._drawTitle(ctx);
    this._buttonRects = this._drawButtons(ctx);
  }

  /* ------------------------------------------------------------------ */
  /*  Background                                                         */
  /* ------------------------------------------------------------------ */

  /**
   * Draw the pixel-art background: sky gradient, mountains, ground.
   * @param {CanvasRenderingContext2D} ctx
   */
  _drawBackground(ctx) {
    this._drawSky(ctx);
    this._drawClouds(ctx);
    this._drawMountains(ctx);
    this._drawGround(ctx);
  }

  /**
   * Fill the sky with a vertical gradient.
   * @param {CanvasRenderingContext2D} ctx
   */
  _drawSky(ctx) {
    const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    grad.addColorStop(0, SKY_COLOR_TOP);
    grad.addColorStop(1, SKY_COLOR_BOTTOM);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }

  /**
   * Draw a few simple pixel-art clouds.
   * @param {CanvasRenderingContext2D} ctx
   */
  _drawClouds(ctx) {
    ctx.fillStyle = CLOUD_COLOR;
    this._drawCloud(ctx, 120, 60, 1);
    this._drawCloud(ctx, 400, 40, 0.7);
    this._drawCloud(ctx, 700, 75, 0.85);
    this._drawCloud(ctx, 250, 90, 0.5);
    this._drawCloud(ctx, 820, 50, 0.6);
  }

  /**
   * Draw a single cloud built from overlapping rectangles.
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} x - Left anchor.
   * @param {number} y - Top anchor.
   * @param {number} scale - Uniform scale factor.
   */
  _drawCloud(ctx, x, y, scale) {
    const w = 60 * scale;
    const h = 20 * scale;
    const r = 0;
    ctx.beginPath();
    ctx.ellipse(x, y + h * 0.7, w * 0.8, h * 0.6, r, 0, Math.PI * 2);
    ctx.ellipse(x + w * 0.4, y + h * 0.35, w * 0.6, h * 0.7, r, 0, Math.PI * 2);
    ctx.ellipse(x + w * 0.8, y + h * 0.55, w * 0.5, h * 0.55, r, 0, Math.PI * 2);
    ctx.fill();
  }

  /**
   * Draw three layers of pixel-art mountains with snow caps.
   * @param {CanvasRenderingContext2D} ctx
   */
  _drawMountains(ctx) {
    this._drawMountainLayer(ctx, MOUNTAIN_FAR_COLOR, 160, CANVAS_HEIGHT * 0.45);
    this._drawMountainLayer(ctx, MOUNTAIN_MID_COLOR, 140, CANVAS_HEIGHT * 0.4);
    this._drawMountainLayer(ctx, MOUNTAIN_NEAR_COLOR, 120, CANVAS_HEIGHT * 0.38);
  }

  /**
   * Draw a single mountain ridge.
   * @param {CanvasRenderingContext2D} ctx
   * @param {string} color - Fill colour.
   * @param {number} baseY - Vertical position of the ridge base.
   * @param {number} snowLine - Y value above which snow caps appear.
   */
  _drawMountainLayer(ctx, color, baseY, snowLine) {
    const w = CANVAS_WIDTH;
    const h = CANVAS_HEIGHT;
    const step = 80;

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, baseY);

    for (let x = 0; x <= w; x += step) {
      const peakX = x + step / 2;
      const peakY = baseY - 40 - Math.random() * 50;
      ctx.lineTo(peakX, peakY);
      ctx.lineTo(x + step, baseY);
    }
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fill();

    // Snow caps
    ctx.fillStyle = SNOW_COLOR;
    ctx.beginPath();
    ctx.moveTo(0, baseY);
    for (let x = 0; x <= w; x += step) {
      const peakX = x + step / 2;
      const peakY = baseY - 40 - Math.random() * 50;
      if (peakY < snowLine) {
        const capWidth = 18;
        ctx.moveTo(peakX - capWidth, peakY + 6);
        ctx.lineTo(peakX, peakY - 4);
        ctx.lineTo(peakX + capWidth, peakY + 6);
      }
    }
    ctx.fill();
  }

  /**
   * Draw the green ground strip at the bottom with a subtle highlight
   * on top.
   * @param {CanvasRenderingContext2D} ctx
   */
  _drawGround(ctx) {
    const groundTop = CANVAS_HEIGHT * 0.62;
    const groundHeight = CANVAS_HEIGHT - groundTop;

    ctx.fillStyle = GROUND_COLOR;
    ctx.fillRect(0, groundTop, CANVAS_WIDTH, groundHeight);

    ctx.fillStyle = GROUND_HIGHLIGHT_COLOR;
    ctx.fillRect(0, groundTop, CANVAS_WIDTH, 6);
  }

  /* ------------------------------------------------------------------ */
  /*  Title                                                              */
  /* ------------------------------------------------------------------ */

  /**
   * Draw the "Pixel Hero" title with a pixel-art outline stroke.
   * @param {CanvasRenderingContext2D} ctx
   */
  _drawTitle(ctx) {
    ctx.save();
    ctx.font = `${TITLE_FONT_SIZE}px ${FONT_FAMILY}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const y = 80;

    ctx.lineWidth = TITLE_STROKE_WIDTH;
    ctx.strokeStyle = TITLE_STROKE_COLOR;
    ctx.strokeText(TITLE_TEXT, this._centerX, y);

    ctx.fillStyle = TITLE_COLOR;
    ctx.fillText(TITLE_TEXT, this._centerX, y);

    ctx.restore();
  }

  /* ------------------------------------------------------------------ */
  /*  Buttons                                                            */
  /* ------------------------------------------------------------------ */

  /**
   * Draw all menu buttons. Returns hit-test rectangles for the
   * current frame.
   * @param {CanvasRenderingContext2D} ctx
   * @returns {HitRect[]}
   */
  _drawButtons(ctx) {
    const rects = [];

    for (let i = 0; i < MENU_BUTTONS.length; i++) {
      const isSelected = i === this._selectedIndex;
      rects.push(this._drawOneButton(ctx, MENU_BUTTONS[i], i, isSelected));
    }

    return rects;
  }

  /**
   * Draw a single menu button and return its on-canvas hit rectangle.
   * @param {CanvasRenderingContext2D} ctx
   * @param {string} label - Button text.
   * @param {number} index - Zero-based button index.
   * @param {boolean} isSelected - Whether this button is the active one.
   * @returns {HitRect}
   */
  _drawOneButton(ctx, label, index, isSelected) {
    const baseW = 220;
    const baseH = BUTTON_HEIGHT;
    const yBase = BUTTONS_TOP_OFFSET + index * (baseH + BUTTON_GAP);

    const scale = isSelected ? SELECTED_SCALE : 1;
    const w = baseW * scale;
    const h = baseH * scale;
    const x = this._centerX - w / 2;
    const y = yBase - (h - baseH) / 2;

    ctx.save();

    // Glow behind selected button
    if (isSelected) {
      ctx.shadowColor = GLOW_COLOR;
      ctx.shadowBlur = GLOW_BLUR;
    }

    // Background rect
    ctx.fillStyle = isSelected ? BUTTON_HOVER_BG_COLOR : BUTTON_BG_COLOR;
    ctx.fillRect(x, y, w, h);

    // Gold border when selected
    if (isSelected) {
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
      ctx.strokeStyle = GOLD_COLOR;
      ctx.lineWidth = GOLD_BORDER_WIDTH;
      ctx.strokeRect(x, y, w, h);
    }

    // Text
    const fontSize = BUTTON_FONT_SIZE * (isSelected ? SELECTED_SCALE : 1);
    ctx.font = `${fontSize}px ${FONT_FAMILY}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = BUTTON_TEXT_COLOR;
    ctx.fillText(label, this._centerX, y + h / 2);

    ctx.restore();

    return { x, y, w, h };
  }

  /* ------------------------------------------------------------------ */
  /*  Input handling                                                     */
  /* ------------------------------------------------------------------ */

  /**
   * Keyboard navigation (Arrow Up / Arrow Down / Enter).
   * @param {KeyboardEvent} e
   * @returns {void}
   */
  _onKeyDown(e) {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      this._selectedIndex =
        (this._selectedIndex - 1 + MENU_BUTTONS.length) % MENU_BUTTONS.length;
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      this._selectedIndex = (this._selectedIndex + 1) % MENU_BUTTONS.length;
    } else if (e.key === "Enter") {
      e.preventDefault();
      this._activateButton(this._selectedIndex);
    }
  }

  /**
   * Update selection when the mouse moves over a button.
   * @param {MouseEvent} e
   * @returns {void}
   */
  _onMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = CANVAS_WIDTH / rect.width;
    const scaleY = CANVAS_HEIGHT / rect.height;

    const mx = (e.clientX - rect.left) * scaleX;
    const my = (e.clientY - rect.top) * scaleY;

    for (let i = 0; i < this._buttonRects.length; i++) {
      if (this._pointInRect(mx, my, this._buttonRects[i])) {
        this._selectedIndex = i;
        return;
      }
    }
  }

  /**
   * Handle mouse click on a button.
   * @param {MouseEvent} e
   * @returns {void}
   */
  _onClick(e) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = CANVAS_WIDTH / rect.width;
    const scaleY = CANVAS_HEIGHT / rect.height;

    const mx = (e.clientX - rect.left) * scaleX;
    const my = (e.clientY - rect.top) * scaleY;

    for (let i = 0; i < this._buttonRects.length; i++) {
      if (this._pointInRect(mx, my, this._buttonRects[i])) {
        this._activateButton(i);
        return;
      }
    }
  }

  /**
   * Point-vs-rectangle hit test.
   * @param {number} px
   * @param {number} py
   * @param {HitRect} r
   * @returns {boolean}
   */
  _pointInRect(px, py, r) {
    return px >= r.x && px <= r.x + r.w && py >= r.y && py <= r.y + r.h;
  }

  /**
   * Perform the action associated with a button.
   * Currently only "Start Game" (index 0) is wired.
   * @param {number} index
   * @returns {void}
   */
  _activateButton(index) {
    if (index === 0) {
      this._onChange(SCENE_GAMEPLAY);
    } else if (index === 1) {
      this._onChange(SCENE_HELP);
    } else if (index === 2) {
      this._onChange(SCENE_CREDITS);
    }
  }
}

export default MenuScene;