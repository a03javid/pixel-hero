# 🎮 Pixel Hero

A retro pixel-art platformer built with HTML5 Canvas, React, and Vite. Navigate through five challenging stages, battle enemies, dodge hazards, and defeat the Final Boss.

[![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-yellow)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![HTML5 Canvas](https://img.shields.io/badge/HTML5-Canvas-orange)](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-purple)](https://vitejs.dev)

---

## 🎯 Features

- **5 Playable Stages** — Each stage with unique platform layouts, enemy placements, and environmental hazards.
- **Stage Progression** — Clear a stage by reaching the castle goal; player score and lives carry over between stages.
- **4 Enemy Types**
  - **Ground Enemy** — Patrols back and forth along a defined range.
  - **Flying Enemy** — Hovers and patrols horizontally with a wing-flap animation.
  - **Shooter Enemy** — Detects the player within range and fires projectiles.
  - **Boss Enemy** (Stage 5) — Three-phase boss fight with escalating attack patterns.
- **Player Attack System** — Melee attack (J/K) with a timed hitbox that destroys enemies on contact.
- **Collectibles**
  - **Coins** — Add +1 to the score counter.
  - **Hearts** — Restore +1 life (up to 3 max).
- **Lives System** — Start with 3 lives; lose one on enemy contact, hazard damage, or falling into a pit.
- **Score System** — Earn points from defeating enemies (5 pts) and the boss (50 pts); displayed on the HUD and all end screens.
- **Moving Platforms** — Horizontally oscillating platforms in Stage 3 that carry the player.
- **Ice Physics** — Slippery ground surfaces in Stage 4 with reduced friction and acceleration.
- **Wind Zones** — Stage 4 areas that push the player leftward with a constant force.
- **Spike Hazards** — Ground-level spikes that damage the player on contact.
- **Pits** — A gap in the ground that causes fall damage and respawns the player.
- **Scrolling Camera** — Smoothly follows the player across the 3000px-wide level.
- **HUD** — Fixed screen-space overlay showing lives, score, and current stage label.
- **Main Menu** — Animated pixel-art menu with keyboard and mouse navigation.
- **Help Screen** — Full controls, items, enemies, and hazards reference.
- **Credits Screen** — Developers, course, and acknowledgements.
- **Game Over Screen** — Displays final score and return-to-menu prompt.
- **Victory Scene** — Confetti animation, castle backdrop, final score, and thank-you message.
- **Sprite Animation System** — Frame-based animation engine with horizontal sprite sheets and mirror flipping.
- **Sprite Loader** — Runtime image loading with fallback to procedural Canvas rendering when sprites are unavailable.
- **Canvas Fallback Rendering** — All entities render with colored geometric shapes when sprite sheets are missing.

---

## 🛠 Technologies

| Technology | Purpose |
|---|---|
| **JavaScript (ES6+)** | Core game logic, physics, entity management |
| **HTML5 Canvas** | 960×540 pixel-art rendering with `imageRendering: pixelated` |
| **React 19** | Application shell and Canvas mounting via `createRoot` |
| **Vite 8** | Dev server, HMR, and production bundling |
| **npm** | Package management |
| **[Press Start 2P](https://fonts.google.com/specimen/Press+Start+2P)** | Google Font for all in-game text |

---

## 🎮 Controls

| Key | Action |
|---|---|
| `A` / `←` | Move Left |
| `D` / `→` | Move Right |
| `Space` | Jump |
| `J` / `K` | Attack |
| `Enter` | Continue / Select Menu Item |
| `Esc` | Return to Menu |
| `↑` / `↓` | Navigate Menu |

---

## 🗺 Game Flow

```
        ┌──────────┐
        │   Menu   │
        │  ┌─────┐ │
        │  │Start│ │──────────────┐
        │  ├─────┤ │              │
        │  │Help │ │              ▼
        │  ├─────┤ │        ┌──────────┐
        │  │Credits│     │ Stage 1  │
        │  └─────┘ │        └────┬─────┘
        └──────────┘             │
              ▲                  ▼
              │            ┌──────────┐
              │            │ Stage 2  │
              │            └────┬─────┘
              │                 │
              │                 ▼
              │            ┌──────────┐
              │            │ Stage 3  │  ← Moving Platforms
              │            └────┬─────┘
              │                 │
              │                 ▼
              │            ┌──────────┐
              │            │ Stage 4  │  ← Ice + Wind
              │            └────┬─────┘
              │                 │
              │                 ▼
              │            ┌──────────┐
              │            │ Stage 5  │  ← Boss Fight
              │            └────┬─────┘
              │                 │
              │         ┌──────┴──────┐
              │         │             │
              │      (Win)        (0 Lives)
              │         │             │
              │         ▼             ▼
              │   ┌──────────┐  ┌──────────┐
              └───│ Victory  │  │Game Over │
                  └──────────┘  └──────────┘
```

**Game Over flow:** Losing all 3 lives transitions to the Game Over screen, which shows the final score and returns to the Menu on ENTER or ESC.

---

## 👾 Enemies

### Ground Enemy
A purple-bodied patroller that walks back and forth between two X boundaries. Contact damages the player. Can be defeated with one melee hit.

### Flying Enemy
An airborne enemy that flaps horizontally within a patrol range. Uses a wing-flap animation (or a rotating canvas fallback). One hit to defeat.

### Shooter Enemy
A stationary ranged enemy that detects the player within 400px and fires projectiles every 2 seconds. Projectiles travel horizontally toward the player and are destroyed on wall/platform collision. One hit to defeat.

### Final Boss (Stage 5)
A large 64×80px enemy with **3 HP** and three escalating phases:

| Phase | HP | Behavior |
|---|---|---|
| **1** | 3 | Slow patrol (50 px/s). Contact damage only. |
| **2** | 2 | Faster patrol (80 px/s). Fires fireballs every 2 seconds. |
| **3** | 1 | Fastest patrol (120 px/s). Fires fireballs every 1 second. Performs a ground slam every 4 seconds that damages nearby players. |

Defeating the boss awards 50 score points and unlocks the castle goal for stage completion.

---

## 🪙 Collectibles

| Item | Effect |
|---|---|
| **Coin** (🪙) | +1 Score |
| **Heart** (❤️) | +1 Life (up to 3 max) |

---

## ⚠ Hazards

| Hazard | Description | Appears In |
|---|---|---|
| **Spikes** | Ground-level triangular hazards that deal damage on touch. | Stages 1–5 |
| **Pit** | A 150px gap in the ground at X=1200. Falling through costs 1 life and respawns the player. | All stages |
| **Ice** | Pale-blue ground surfaces in Stage 4. Reduces friction (80% less) and acceleration (30% less), making movement slippery. | Stage 4 |
| **Wind** | Semi-transparent zones in Stage 4 that apply a constant leftward force (80 px/s²) to the player. | Stage 4 |

---

## 📦 Installation

```bash
# Clone the repository
git clone <repo-url>
cd Pixel-hero

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | Lint via oxlint |

---

## 📁 Project Structure

```text
Pixel-hero/
├── index.html                    # Vite entry point, loads Press Start 2P font
├── package.json                  # Dependencies and scripts
├── package-lock.json
├── vite.config.js                # Vite configuration with React plugin
├── .gitignore
├── README.md
├── public/
│   ├── favicon.svg               # Site favicon
│   └── icons.svg                 # SVG icon set
├── assets/
│   ├── images/
│   │   ├── .gitkeep
│   │   ├── player/               # Player sprite sheets
│   │   │   ├── player_idle.png
│   │   │   ├── player_run.png
│   │   │   ├── player_jump.png
│   │   │   └── player_attack.png
│   │   ├── enemies/              # Enemy sprite sheets
│   │   │   ├── ground_enemy_walk.png
│   │   │   ├── flying_enemy.png
│   │   │   ├── shooter_enemy.png
│   │   │   └── boss_enemy.png
│   │   └── effects/
│   │       └── projectile.png
│   └── sounds/
│       └── .gitkeep
└── src/
    ├── main.jsx                  # React 19 entry point (createRoot)
    ├── App.jsx                   # Root component → GameCanvas
    ├── components/
    │   └── GameCanvas.jsx        # Canvas mount, Game bootstrap
    ├── game/
    │   ├── constants.js          # All game configuration (602 lines)
    │   ├── Game.js               # Main loop, scene switching, delta-time
    │   ├── SpriteAnimator.js     # Frame-based animation engine
    │   ├── SpriteLoader.js       # Image loading, caching, fallback
    │   └── stages/
    │       ├── Stage1.js         # Stage 1 data (platforms, enemies, coins, etc.)
    │       ├── Stage2.js
    │       ├── Stage3.js         # Includes moving platforms
    │       ├── Stage4.js         # Includes ice and wind zones
    │       └── Stage5.js         # Includes boss configuration
    ├── entities/
    │   ├── Player.js             # Player movement, physics, attack, animation
    │   ├── GroundEnemy.js        # Patrolling ground enemy
    │   ├── FlyingEnemy.js        # Hovering flying enemy
    │   ├── ShooterEnemy.js       # Ranged projectile-firing enemy
    │   ├── BossEnemy.js          # 3-phase final boss
    │   ├── Projectile.js         # Enemy/boss projectile
    │   ├── Collectible.js        # Coin and heart pickups
    │   └── MovingPlatform.js     # Horizontally oscillating platform
    └── scenes/
        ├── MenuScene.js          # Main menu with 4 buttons
        ├── HelpScene.js          # Controls and gameplay guide
        ├── CreditsScene.js       # Developer credits
        ├── GameplayScene.js      # Core gameplay loop (1551 lines)
        ├── GameOverScene.js      # Game over overlay
        └── VictoryScene.js       # Victory celebration with confetti
```

---

## 📸 Screenshots

### Main Menu

*(Add screenshot here)*

### Gameplay

*(Add screenshot here)*

### Boss Battle

*(Add screenshot here)*

---

## 👥 Credits

### Developers

- **Ali Yavari Javid**
- **AmirAli Akbari**

### Course

Computer Game Design

### Supervisor

Dr. Mohammad Mehdi ShirMohammadi

### Special Thanks

Faculty of Computer Engineering

---

## 📄 License

This project was developed for educational purposes.