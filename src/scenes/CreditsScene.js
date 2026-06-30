import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  SCENE_MENU,
  TITLE_TEXT,
  FONT_FAMILY,
  TITLE_FONT_SIZE,
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
  SECTION_TITLE_SIZE,
  BODY_FONT_SIZE,
  SUBTITLE_FONT_SIZE,
  SECTION_TITLE_COLOR,
  BODY_TEXT_COLOR,
  SECONDARY_TEXT_COLOR,
  PANEL_BACKGROUND,
  SECTION_GAP,
  BODY_LINE_HEIGHT,
  BOTTOM_PROMPT_OFFSET,
  GOLD_COLOR,
} from "../game/constants.js";

/**
 * Credits scene — shows developers, course info and acknowledgements.
 *
 * Uses the same retro background as MenuScene with centred content
 * inside semi-transparent panels.
 *
 * @class CreditsScene
 */
class CreditsScene {
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

    this._onKeyDown = this._onKeyDown.bind(this);
  }

  /* ------------------------------------------------------------------ */
  /*  Public API                                                         */
  /* ------------------------------------------------------------------ */

  /** Attach input listeners. */
  start() {
    window.addEventListener("keydown", this._onKeyDown);
  }

  /** Detach input listeners. */
  stop() {
    window.removeEventListener("keydown", this._onKeyDown);
  }

  /** No-op for static scenes. @param {number} dt */
  update(dt) {}

  /** Clear and redraw the entire scene. */
  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    this._drawBackground(ctx);
    this._drawTitle(ctx);
    this._drawContents(ctx);
    this._drawBottomPrompt(ctx);
  }

  /* ------------------------------------------------------------------ */
  /*  Background — identical to MenuScene                                */
  /* ------------------------------------------------------------------ */

  /** @param {CanvasRenderingContext2D} ctx */
  _drawBackground(ctx) {
    this._drawSky(ctx);
    this._drawClouds(ctx);
    this._drawMountains(ctx);
    this._drawGround(ctx);
  }

  /** @param {CanvasRenderingContext2D} ctx */
  _drawSky(ctx) {
    const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    grad.addColorStop(0, SKY_COLOR_TOP);
    grad.addColorStop(1, SKY_COLOR_BOTTOM);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }

  /** @param {CanvasRenderingContext2D} ctx */
  _drawClouds(ctx) {
    ctx.fillStyle = CLOUD_COLOR;
    this._drawCloud(ctx, 120, 60, 1);
    this._drawCloud(ctx, 400, 40, 0.7);
    this._drawCloud(ctx, 700, 75, 0.85);
    this._drawCloud(ctx, 250, 90, 0.5);
    this._drawCloud(ctx, 820, 50, 0.6);
  }

  /**
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} x
   * @param {number} y
   * @param {number} scale
   */
  _drawCloud(ctx, x, y, scale) {
    const w = 60 * scale;
    const h = 20 * scale;
    ctx.beginPath();
    ctx.ellipse(x, y + h * 0.7, w * 0.8, h * 0.6, 0, 0, Math.PI * 2);
    ctx.ellipse(x + w * 0.4, y + h * 0.35, w * 0.6, h * 0.7, 0, 0, Math.PI * 2);
    ctx.ellipse(x + w * 0.8, y + h * 0.55, w * 0.5, h * 0.55, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  /** @param {CanvasRenderingContext2D} ctx */
  _drawMountains(ctx) {
    this._drawMountainLayer(ctx, MOUNTAIN_FAR_COLOR, 160, CANVAS_HEIGHT * 0.45);
    this._drawMountainLayer(ctx, MOUNTAIN_MID_COLOR, 140, CANVAS_HEIGHT * 0.4);
    this._drawMountainLayer(ctx, MOUNTAIN_NEAR_COLOR, 120, CANVAS_HEIGHT * 0.38);
  }

  /**
   * @param {CanvasRenderingContext2D} ctx
   * @param {string} color
   * @param {number} baseY
   * @param {number} snowLine
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

    ctx.fillStyle = SNOW_COLOR;
    ctx.beginPath();
    for (let x = 0; x <= w; x += step) {
      const peakX = x + step / 2;
      const peakY = baseY - 40 - Math.random() * 50;
      if (peakY < snowLine) {
        ctx.moveTo(peakX - 18, peakY + 6);
        ctx.lineTo(peakX, peakY - 4);
        ctx.lineTo(peakX + 18, peakY + 6);
      }
    }
    ctx.fill();
  }

  /** @param {CanvasRenderingContext2D} ctx */
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

  /** @param {CanvasRenderingContext2D} ctx */
  _drawTitle(ctx) {
    ctx.save();
    ctx.font = `${TITLE_FONT_SIZE}px ${FONT_FAMILY}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const cx = CANVAS_WIDTH / 2;

    ctx.lineWidth = TITLE_STROKE_WIDTH;
    ctx.strokeStyle = TITLE_STROKE_COLOR;
    ctx.strokeText(TITLE_TEXT, cx, 50);

    ctx.fillStyle = TITLE_COLOR;
    ctx.fillText(TITLE_TEXT, cx, 50);

    // Subtitle
    ctx.font = `${SUBTITLE_FONT_SIZE}px ${FONT_FAMILY}`;
    ctx.fillStyle = GOLD_COLOR;
    ctx.fillText("CREDITS", cx, 95);

    ctx.restore();
  }

  /* ------------------------------------------------------------------ */
  /*  Contents                                                           */
  /* ------------------------------------------------------------------ */

  /** @param {CanvasRenderingContext2D} ctx */
  _drawContents(ctx) {
    const sections = [
      { title: "Developers", lines: [
        "Ali Yavari Javid",
        "AmirAli Akbari",
      ]},
      { title: "Course", lines: [
        "Computer Game Design",
      ]},
      { title: "Supervisor", lines: [
        "Dr. Mohammad Mehdi",
        "ShirMohammadi",
      ]},
      { title: "Technology", lines: [
        "React",
        "JavaScript",
        "HTML5 Canvas",
      ]},
      { title: "Special Thanks", lines: [
        "Faculty of Computer",
        "Engineering",
      ]},
    ];

    const panelW = 520;
    const titleH = SECTION_TITLE_SIZE + 6;
    const promptSpace = BODY_LINE_HEIGHT + BOTTOM_PROMPT_OFFSET;
    const availH = CANVAS_HEIGHT - 110 - promptSpace;
    const totalH = this._computeTotalHeight(sections, titleH);
    const startY = 110 + Math.max(0, (availH - totalH) / 2);

    this._drawAllSections(ctx, startY, sections, titleH, panelW);

    // Thank-you text after sections, before prompt
    const afterSectionsY = startY + totalH + SECTION_GAP;
    ctx.font = `${BODY_FONT_SIZE}px ${FONT_FAMILY}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillStyle = GOLD_COLOR;
    ctx.fillText("Thank you for playing", CANVAS_WIDTH / 2, afterSectionsY);
    ctx.fillText("Pixel Hero!", CANVAS_WIDTH / 2, afterSectionsY + BODY_LINE_HEIGHT);
  }

  /**
   * Compute the total vertical space needed for all sections.
   * @param {Array<{title: string, lines: string[]}>} sections
   * @param {number} titleH
   * @returns {number}
   */
  _computeTotalHeight(sections, titleH) {
    let h = 0;
    for (let i = 0; i < sections.length; i++) {
      if (i > 0) h += SECTION_GAP;
      const panelH = titleH + 6 + sections[i].lines.length * BODY_LINE_HEIGHT + 4;
      h += panelH;
    }
    return h;
  }

  /**
   * Draw all sections starting at the given Y offset.
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} startY
   * @param {Array<{title: string, lines: string[]}>} sections
   * @param {number} titleH
   * @param {number} panelW
   */
  _drawAllSections(ctx, startY, sections, titleH, panelW) {
    const cx = CANVAS_WIDTH / 2;
    let y = startY;

    for (let i = 0; i < sections.length; i++) {
      if (i > 0) y += SECTION_GAP;
      y = this._drawSection(ctx, cx, y, titleH, panelW, sections[i].title, sections[i].lines);
    }
  }

  /**
   * Draw a single compact section panel.
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} cx
   * @param {number} startY
   * @param {number} titleH
   * @param {number} panelW
   * @param {string} title
   * @param {string[]} lines
   * @returns {number} Y position after this section.
   */
  _drawSection(ctx, cx, startY, titleH, panelW, title, lines) {
    const pad = 6;
    const bodyH = lines.length * BODY_LINE_HEIGHT;
    const panelH = titleH + 2 + bodyH + pad;
    const panelX = cx - panelW / 2;

    // Background
    ctx.fillStyle = PANEL_BACKGROUND;
    ctx.fillRect(panelX, startY, panelW, panelH);

    // Title
    let y = startY + 3;
    ctx.font = `${SECTION_TITLE_SIZE}px ${FONT_FAMILY}`;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillStyle = SECTION_TITLE_COLOR;
    ctx.fillText(title, panelX + 8, y);
    y += titleH;

    // Separator
    ctx.strokeStyle = SECTION_TITLE_COLOR;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(panelX + 8, y);
    ctx.lineTo(panelX + panelW - 8, y);
    ctx.stroke();
    y += 4;

    // Body lines
    ctx.font = `${BODY_FONT_SIZE}px ${FONT_FAMILY}`;
    ctx.fillStyle = BODY_TEXT_COLOR;

    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], panelX + 8, y);
      y += BODY_LINE_HEIGHT;
    }

    return startY + panelH;
  }

  /* ------------------------------------------------------------------ */
  /*  Bottom prompt                                                      */
  /* ------------------------------------------------------------------ */

  /** @param {CanvasRenderingContext2D} ctx */
  _drawBottomPrompt(ctx) {
    ctx.save();
    ctx.font = `${BODY_FONT_SIZE}px ${FONT_FAMILY}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillStyle = SECONDARY_TEXT_COLOR;
    ctx.fillText(
      "Press ENTER or ESC to return",
      CANVAS_WIDTH / 2,
      CANVAS_HEIGHT - BOTTOM_PROMPT_OFFSET,
    );
    ctx.restore();
  }

  /* ------------------------------------------------------------------ */
  /*  Input                                                              */
  /* ------------------------------------------------------------------ */

  /** @param {KeyboardEvent} e */
  _onKeyDown(e) {
    if (e.key === "Enter" || e.key === "Escape") {
      e.preventDefault();
      this._onChange(SCENE_MENU);
    }
  }
}

export default CreditsScene;