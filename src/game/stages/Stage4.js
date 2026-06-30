/**
 * Stage 4 data — dense enemies and spike-heavy layout.
 * @module Stage4
 */

/**
 * Stage 4 level configuration.
 * @type {import("./StageData.js").StageData}
 */
const Stage4 = {
  label: "Stage 4",

  platforms: [
    [100, 395, 64],
    [220, 370, 48],
    [340, 400, 56],
    [460, 360, 48],
    [590, 395, 64],
    [720, 365, 56],
    [850, 400, 48],
    [980, 370, 64],
    [1120, 390, 48],
    [1250, 355, 56],
    [1400, 395, 64],
    [1550, 365, 48],
    [1700, 400, 56],
    [1850, 360, 48],
    [2000, 390, 64],
    [2160, 355, 48],
    [2320, 395, 56],
    [2500, 365, 64],
    [2680, 390, 48],
  ],

  enemies: [
    { x: 280, y: 422, minX: 230, maxX: 370 },
    { x: 550, y: 422, minX: 490, maxX: 630 },
    { x: 900, y: 422, minX: 840, maxX: 980 },
    { x: 1200, y: 422, minX: 1140, maxX: 1280 },
    { x: 1500, y: 422, minX: 1440, maxX: 1580 },
    { x: 1950, y: 422, minX: 1880, maxX: 2040 },
    { x: 2350, y: 422, minX: 2280, maxX: 2440 },
    { type: "flying", x: 100, y: 160, minX: 50, maxX: 400 },
    { type: "flying", x: 700, y: 200, minX: 600, maxX: 1000 },
    { type: "flying", x: 1300, y: 140, minX: 1200, maxX: 1600 },
    { type: "flying", x: 2100, y: 230, minX: 2000, maxX: 2500 },
    { type: "shooter", x: 400, y: 422, minX: 0, maxX: 0 },
    { type: "shooter", x: 1000, y: 422, minX: 0, maxX: 0 },
    { type: "shooter", x: 1700, y: 422, minX: 0, maxX: 0 },
  ],

  iceZones: [
    { x: 600, y: 470, width: 500, height: 70 },
    { x: 1700, y: 470, width: 450, height: 70 },
  ],

  windZones: [
    { x: 1200, y: 0, width: 700, height: 540, force: -180 },
  ],

  spikes: [170, 420, 680, 950, 1180, 1430, 1780, 2100, 2560],

  coins: [
    { x: 200, y: 360 },
    { x: 400, y: 350 },
    { x: 620, y: 370 },
    { x: 820, y: 340 },
    { x: 1080, y: 330 },
    { x: 1360, y: 360 },
    { x: 1600, y: 350 },
    { x: 1820, y: 340 },
    { x: 2100, y: 360 },
  ],

  hearts: [
    { x: 750, y: 400 },
    { x: 1550, y: 420 },
  ],

  castleX: 2780,

  goal: { x: 2800, y: 370, w: 60, h: 100 },
};

export default Stage4;