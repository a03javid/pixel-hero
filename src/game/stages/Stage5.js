/**
 * Stage 5 data — the final challenge with a boss.
 * @module Stage5
 */

/**
 * Stage 5 level configuration.
 * @type {import("./StageData.js").StageData}
 */
const Stage5 = {
  label: "Stage 5",

  platforms: [
    [130, 395, 56],
    [260, 365, 48],
    [390, 400, 64],
    [520, 360, 48],
    [650, 390, 56],
    [790, 355, 48],
    [930, 400, 64],
    [1060, 370, 56],
    [1200, 395, 48],
    [1350, 350, 56],
    [1500, 385, 64],
    [1640, 355, 48],
    [1800, 400, 56],
    [1950, 365, 48],
    [2100, 390, 64],
    [2260, 355, 48],
    [2420, 395, 56],
    [2580, 365, 48],
    [2720, 380, 64],
  ],

  enemies: [
    { x: 300, y: 422, minX: 240, maxX: 380 },
    { x: 600, y: 422, minX: 540, maxX: 680 },
    { x: 900, y: 422, minX: 840, maxX: 980 },
    { x: 1200, y: 422, minX: 1140, maxX: 1280 },
    { x: 1500, y: 422, minX: 1440, maxX: 1580 },
    { x: 1800, y: 422, minX: 1740, maxX: 1880 },
    { x: 2100, y: 422, minX: 2040, maxX: 2180 },
    { x: 2450, y: 422, minX: 2380, maxX: 2540 },
    { type: "flying", x: 100, y: 180, minX: 50, maxX: 350 },
    { type: "flying", x: 500, y: 120, minX: 450, maxX: 750 },
    { type: "flying", x: 1000, y: 200, minX: 950, maxX: 1300 },
    { type: "flying", x: 1600, y: 160, minX: 1500, maxX: 1900 },
    { type: "flying", x: 2200, y: 140, minX: 2100, maxX: 2600 },
    { type: "shooter", x: 300, y: 422, minX: 0, maxX: 0 },
    { type: "shooter", x: 800, y: 422, minX: 0, maxX: 0 },
    { type: "shooter", x: 1400, y: 422, minX: 0, maxX: 0 },
    { type: "shooter", x: 2000, y: 422, minX: 0, maxX: 0 },
  ],

  boss: {
    x: 2500,
    y: 390,
    minX: 2400,
    maxX: 2800,
  },

  spikes: [180, 450, 720, 1000, 1280, 1560, 1850, 2150, 2450, 2620],

  coins: [
    { x: 220, y: 360 },
    { x: 450, y: 350 },
    { x: 680, y: 370 },
    { x: 880, y: 340 },
    { x: 1100, y: 330 },
    { x: 1400, y: 360 },
    { x: 1650, y: 350 },
    { x: 1900, y: 340 },
    { x: 2150, y: 360 },
    { x: 2480, y: 350 },
  ],

  hearts: [
    { x: 950, y: 400 },
    { x: 2050, y: 420 },
  ],

  castleX: 2780,

  goal: { x: 2800, y: 370, w: 60, h: 100 },
};

export default Stage5;