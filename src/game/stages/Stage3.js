/**
 * Stage 3 data — narrower platforms and more spikes.
 * @module Stage3
 */

/**
 * Stage 3 level configuration.
 * @type {import("./StageData.js").StageData}
 */
const Stage3 = {
  label: "Stage 3",

  platforms: [
    [160, 400, 56],
    [300, 375, 48],
    [420, 395, 64],
    [680, 400, 56],
    [820, 365, 48],
    [960, 405, 64],
    [1250, 395, 48],
    [1400, 350, 56],
    [1580, 385, 64],
    [1920, 395, 56],
    [2100, 365, 48],
    [2280, 400, 64],
    [2620, 390, 56],
    [2750, 365, 48],
  ],

  movingPlatforms: [
    { x: 560, y: 360, width: 48, height: 12, minX: 480, maxX: 640, speed: 60 },
    { x: 1100, y: 370, width: 56, height: 12, minX: 1020, maxX: 1180, speed: 65 },
    { x: 1750, y: 355, width: 48, height: 12, minX: 1670, maxX: 1830, speed: 55 },
    { x: 2450, y: 360, width: 48, height: 12, minX: 2370, maxX: 2530, speed: 70 },
  ],

  enemies: [
    { x: 380, y: 422, minX: 330, maxX: 470 },
    { x: 780, y: 422, minX: 720, maxX: 860 },
    { x: 1180, y: 422, minX: 1120, maxX: 1280 },
    { x: 1600, y: 422, minX: 1520, maxX: 1700 },
    { x: 2200, y: 422, minX: 2120, maxX: 2300 },
    { type: "flying", x: 150, y: 150, minX: 100, maxX: 600 },
    { type: "flying", x: 900, y: 220, minX: 800, maxX: 1200 },
    { type: "flying", x: 2000, y: 170, minX: 1900, maxX: 2400 },
    { type: "shooter", x: 500, y: 422, minX: 0, maxX: 0 },
    { type: "shooter", x: 1700, y: 422, minX: 0, maxX: 0 },
  ],

  spikes: [200, 470, 750, 1050, 1320, 1680, 2050, 2520],

  coins: [
    { x: 250, y: 360 },
    { x: 480, y: 350 },
    { x: 720, y: 340 },
    { x: 900, y: 370 },
    { x: 1150, y: 320 },
    { x: 1480, y: 350 },
    { x: 1800, y: 340 },
    { x: 2320, y: 360 },
  ],

  hearts: [{ x: 1350, y: 400 }],

  castleX: 2780,

  goal: { x: 2800, y: 370, w: 60, h: 100 },
};

export default Stage3;