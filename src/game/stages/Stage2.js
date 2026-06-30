/**
 * Stage 2 data — harder placement with more enemies.
 * @module Stage2
 */

/**
 * Stage 2 level configuration.
 * @type {import("./StageData.js").StageData}
 */
const Stage2 = {
  label: "Stage 2",

  platforms: [
    [120, 390, 72],
    [240, 360, 56],
    [370, 400, 64],
    [490, 370, 72],
    [600, 345, 48],
    [740, 390, 64],
    [880, 355, 56],
    [1020, 405, 72],
    [1160, 375, 64],
    [1300, 350, 56],
    [1450, 395, 64],
    [1600, 365, 56],
    [1780, 400, 48],
    [1950, 370, 72],
    [2120, 390, 64],
    [2300, 350, 56],
    [2500, 380, 72],
    [2700, 355, 48],
  ],

  enemies: [
    { x: 350, y: 422, minX: 300, maxX: 450 },
    { x: 850, y: 422, minX: 780, maxX: 920 },
    { x: 1500, y: 422, minX: 1420, maxX: 1620 },
    { x: 2050, y: 422, minX: 1980, maxX: 2150 },
    { type: "flying", x: 200, y: 180, minX: 150, maxX: 500 },
    { type: "flying", x: 1800, y: 250, minX: 1700, maxX: 2200 },
    { type: "shooter", x: 700, y: 422, minX: 0, maxX: 0 },
  ],

  spikes: [380, 720, 1100, 1480, 1850, 2400],

  coins: [
    { x: 280, y: 350 },
    { x: 520, y: 340 },
    { x: 800, y: 360 },
    { x: 960, y: 320 },
    { x: 1350, y: 350 },
    { x: 1700, y: 330 },
    { x: 2200, y: 360 },
  ],

  hearts: [
    { x: 650, y: 400 },
    { x: 1900, y: 420 },
  ],

  castleX: 2780,

  goal: { x: 2800, y: 370, w: 60, h: 100 },
};

export default Stage2;