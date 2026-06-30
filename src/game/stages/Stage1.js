/**
 * Stage 1 data — the introductory level.
 * @module Stage1
 */

/**
 * Stage 1 level configuration.
 * @type {import("./StageData.js").StageData}
 */
const Stage1 = {
  label: "Stage 1",

  platforms: [
    [146, 403, 80],
    [250, 378, 64],
    [348, 408, 72],
    [432, 378, 56],
    [520, 398, 64],
    [658, 370, 72],
    [746, 400, 56],
    [820, 372, 64],
    [895, 398, 56],
    [186, 352, 48],
    [1040, 380, 72],
    [1400, 390, 64],
    [1580, 360, 56],
    [1720, 400, 64],
    [1950, 370, 72],
    [2120, 395, 56],
    [2350, 355, 64],
    [2600, 385, 56],
    [2810, 375, 48],
  ],

  enemies: [
    { x: 650, y: 422, minX: 580, maxX: 760 },
    { x: 1550, y: 422, minX: 1480, maxX: 1700 },
  ],

  spikes: [480, 540, 1060, 1640, 2200],

  coins: [
    { x: 330, y: 390 },
    { x: 470, y: 350 },
    { x: 690, y: 360 },
    { x: 870, y: 330 },
    { x: 1100, y: 300 },
  ],

  hearts: [{ x: 760, y: 420 }],

  castleX: 2780,

  goal: { x: 2800, y: 370, w: 60, h: 100 },
};

export default Stage1;