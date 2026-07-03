import {
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
  PLAYER_SPAWN_X,
  PLAYER_SPAWN_Y,
  PLAYER_MAX_SPEED,
  PLAYER_ACCELERATION,
  PLAYER_FRICTION,
  PLAYER_AIR_CONTROL_FACTOR,
  PLAYER_GRAVITY,
  PLAYER_JUMP_VELOCITY,
  PLAYER_TERMINAL_VELOCITY,
  PLAYER_FALL_THRESHOLD,
  DAMAGE_INVINCIBILITY_TIME,
  SPIKE_WIDTH,
  SPIKE_HEIGHT,
  MAX_LIVES,
  PLAYER_EMOJI,
  PLAYER_EMOJI_SIZE,
  PLAYER_HITBOX_COLOR,
  FONT_FAMILY,
  ATTACK_DURATION,
  ATTACK_WIDTH,
  ATTACK_HEIGHT,
  ATTACK_OFFSET,
  ATTACK_COLOR,
  SPRITE_PLAYER_IDLE,
  SPRITE_PLAYER_RUN,
  SPRITE_PLAYER_JUMP,
  SPRITE_PLAYER_ATTACK,
  PLAYER_FRAME_WIDTH,
  PLAYER_FRAME_HEIGHT,
  PLAYER_IDLE_FPS,
  PLAYER_IDLE_FRAMES,
  PLAYER_RUN_FPS,
  PLAYER_RUN_FRAMES,
  PLAYER_JUMP_FPS,
  PLAYER_JUMP_FRAMES,
  PLAYER_ATTACK_FPS,
  PLAYER_ATTACK_FRAMES,
} from "../game/constants.js";
import SpriteLoader from "../game/SpriteLoader.js";
import SpriteAnimator from "../game/SpriteAnimator.js";
import audioManager from "../game/AudioManager.js";

/**
 * Represents a rectangular axis-aligned collider in the level.
 * @typedef {{ x: number, y: number, w: number, h: number }} Collider
 */

/**
 * Player entity with movement, gravity, single-jump, and AABB
 * collision against level geometry.
 *
 * @class Player
 */
class Player {
  /** @type {number} */
  x;

  /** @type {number} */
  y;

  /** @type {number} */
  vx;

  /** @type {number} */
  vy;

  /** @type {number} */
  w;

  /** @type {number} */
  h;

  /** @type {boolean} Whether the player is standing on a surface. */
  grounded;

  /** @type {boolean} Whether the player is standing on an ice surface. */
  isOnIce;

  /** @type {number} Wind force applied to vx per second while in a wind zone. */
  windForce;

  /** @type {number} Player lives (max 3). */
  lives;

  /** @type {number} Coin score counter. */
  score;

  /** @type {boolean} Whether the player is currently attacking. */
  isAttacking;

  /** @type {number} Remaining attack duration in seconds. */
  attackTimer;

  /** @type {boolean} True if the player last moved left. */
  _facingLeft;

  /** @type {SpriteAnimator} */
  _animator;

  /** @type {Set<string>} Currently pressed keys. */
  _keys;

  /** @type {{ onKeyDown: (e: KeyboardEvent) => void, onKeyUp: (e: KeyboardEvent) => void }} */
  _handlers;

  /**
   * Create a new Player at the spawn position.
   */
  constructor() {
    this.x = PLAYER_SPAWN_X;
    this.y = PLAYER_SPAWN_Y;
    this.vx = 0;
    this.vy = 0;
    this.w = PLAYER_WIDTH;
    this.h = PLAYER_HEIGHT;
    this.grounded = false;
    this.isOnIce = false;
    this.windForce = 0;
    this.lives = MAX_LIVES;
    this.score = 0;

    this.isAttacking = false;
    this.attackTimer = 0;
    this._facingLeft = false;

    this._animator = new SpriteAnimator();
    this._setupAnimations();

    this._invincibleTimer = 0;

    this._keys = new Set();

    this._handlers = {
      onKeyDown: this._onKeyDown.bind(this),
      onKeyUp: this._onKeyUp.bind(this),
    };
  }

  /* ------------------------------------------------------------------ */
  /*  Public API                                                         */
  /* ------------------------------------------------------------------ */

  /** Start listening to keyboard events. */
  start() {
    window.addEventListener("keydown", this._handlers.onKeyDown);
    window.addEventListener("keyup", this._handlers.onKeyUp);
  }

  /** Stop listening to keyboard events. */
  stop() {
    window.removeEventListener("keydown", this._handlers.onKeyDown);
    window.removeEventListener("keyup", this._handlers.onKeyUp);
  }

  /**
   * Advance the player state by `dt` seconds.
   * @param {number} dt - Delta time in seconds.
   * @param {Collider[]} colliders - Level geometry to collide against.
   * @param {Collider[]} hazards - Spike / hazard colliders.
   * @param {Collider[]} enemies - Enemy AABB colliders.
   * @returns {boolean} True if the player is still alive.
   */
  update(dt, colliders, hazards, enemies) {
    if (this._invincibleTimer > 0) {
      this._invincibleTimer -= dt;
    }

    this._updateAttackTimer(dt);
    this._applyPhysics(dt);
    this._resolveCollisions(dt, colliders);
    this._updateAnimation(dt);
    this._checkHazards(hazards);
    this._checkEnemies(enemies);
    this._checkFallReset();

    return this.lives > 0;
  }

  /**
   * Draw the player using the idle sprite with horizontal flip.
   * Falls back to the emoji debug body if the sprite is unavailable.
   * @param {CanvasRenderingContext2D} ctx
   */
  render(ctx) {
    ctx.save();

    // Hitbox outline
    ctx.strokeStyle = PLAYER_HITBOX_COLOR;
    ctx.lineWidth = 1;
    ctx.strokeRect(this.x, this.y, this.w, this.h);

    // Draw current animation frame, or fall back to emoji
    this._animator.draw(ctx, this.x, this.y, this.w, this.h, this._facingLeft);

    const hasAnySprite = this._animator.isAvailable("idle");
    if (!hasAnySprite) {
      // Fallback: emoji centred inside the hitbox
      ctx.font = `${PLAYER_EMOJI_SIZE}px ${FONT_FAMILY}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(PLAYER_EMOJI, this.x + this.w / 2, this.y + this.h / 2);
    }

    // Attack hitbox (debug)
    if (this.isAttacking) {
      const attackBounds = this.getAttackBounds();
      ctx.fillStyle = ATTACK_COLOR;
      ctx.fillRect(attackBounds.x, attackBounds.y, attackBounds.w, attackBounds.h);
    }

    ctx.restore();
  }

  /* ------------------------------------------------------------------ */
  /*  Physics                                                            */
  /* ------------------------------------------------------------------ */

  /**
   * Apply acceleration, friction, gravity, and clamp velocity.
   * @param {number} dt
   */
  _applyPhysics(dt) {
    const moveLeft = this._keys.has("ArrowLeft") || this._keys.has("KeyA");
    const moveRight = this._keys.has("ArrowRight") || this._keys.has("KeyD");
    const jump = this._keys.has("Space");

    // Update facing direction based on movement input
    if (moveLeft && !moveRight) {
      this._facingLeft = true;
    } else if (moveRight && !moveLeft) {
      this._facingLeft = false;
    }

    // Apply wind force before acceleration
    this.vx += this.windForce * dt;

    const onIce = this.grounded && this.isOnIce;
    const accel = this.grounded
      ? (onIce ? PLAYER_ACCELERATION * 0.7 : PLAYER_ACCELERATION)
      : PLAYER_ACCELERATION * PLAYER_AIR_CONTROL_FACTOR;

    // Horizontal movement
    if (moveLeft && !moveRight) {
      this.vx -= accel * dt;
    } else if (moveRight && !moveLeft) {
      this.vx += accel * dt;
    } else if (this.grounded) {
      // Apply friction only when grounded and not pressing left/right
      const friction = (onIce ? PLAYER_FRICTION * 0.2 : PLAYER_FRICTION) * dt;
      if (this.vx > 0) {
        this.vx = Math.max(0, this.vx - friction);
      } else if (this.vx < 0) {
        this.vx = Math.min(0, this.vx + friction);
      }
    }

    // Clamp horizontal speed
    if (this.vx > PLAYER_MAX_SPEED) {
      this.vx = PLAYER_MAX_SPEED;
    } else if (this.vx < -PLAYER_MAX_SPEED) {
      this.vx = -PLAYER_MAX_SPEED;
    }

    // Gravity
    this.vy += PLAYER_GRAVITY * dt;
    if (this.vy > PLAYER_TERMINAL_VELOCITY) {
      this.vy = PLAYER_TERMINAL_VELOCITY;
    }

    // Jump
    if (jump && this.grounded) {
      this.vy = PLAYER_JUMP_VELOCITY;
      this.grounded = false;
      audioManager.playJump();
    }

    // Apply velocity to position
    this.x += this.vx * dt;
    this.y += this.vy * dt;
  }

  /* ------------------------------------------------------------------ */
  /*  Collision                                                          */
  /* ------------------------------------------------------------------ */

  /**
   * Resolve collisions against all colliders using X-then-Y separation.
   * @param {number} dt
   * @param {Collider[]} colliders
   */
  _resolveCollisions(dt, colliders) {
    this.grounded = false;

    for (let i = 0; i < colliders.length; i++) {
      const c = colliders[i];
      if (!this._overlap(c)) continue;

      // Calculate overlaps on each axis
      const overlapLeft = this.x + this.w - c.x;
      const overlapRight = c.x + c.w - this.x;
      const overlapTop = this.y + this.h - c.y;
      const overlapBottom = c.y + c.h - this.y;

      // Find the smallest overlap
      const minXOverlap = Math.min(overlapLeft, overlapRight);
      const minYOverlap = Math.min(overlapTop, overlapBottom);

      if (minXOverlap < minYOverlap) {
        // Resolve horizontally
        if (overlapLeft < overlapRight) {
          this.x = c.x - this.w;
        } else {
          this.x = c.x + c.w;
        }
        this.vx = 0;
      } else {
        // Resolve vertically
        if (overlapTop < overlapBottom) {
          // Landing on top
          this.y = c.y - this.h;
          this.vy = 0;
          this.grounded = true;
        } else {
          // Hitting bottom
          this.y = c.y + c.h;
          this.vy = 0;
        }
      }
    }
  }

  /**
   * Test whether the player AABB overlaps another AABB.
   * @param {Collider} c
   * @returns {boolean}
   */
  _overlap(c) {
    return (
      this.x < c.x + c.w &&
      this.x + this.w > c.x &&
      this.y < c.y + c.h &&
      this.y + this.h > c.y
    );
  }

  /* ------------------------------------------------------------------ */
  /*  Fall reset                                                         */
  /* ------------------------------------------------------------------ */

  /** Reset player to spawn if fallen below the threshold. Costs a life. */
  _checkFallReset() {
    if (this.y > PLAYER_FALL_THRESHOLD) {
      this.lives -= 1;
      audioManager.playPlayerDeath();
      this.respawn();
    }
  }

  /* ------------------------------------------------------------------ */
  /*  Hazards                                                            */
  /* ------------------------------------------------------------------ */

  /**
   * Check collision against spike hazards. Deducts a life and
   * respawns on contact (with a brief invincibility window).
   * @param {Collider[]} hazards
   */
  _checkHazards(hazards) {
    if (this._invincibleTimer > 0) return;

    for (let i = 0; i < hazards.length; i++) {
      if (this._overlap(hazards[i])) {
        this.lives -= 1;
        audioManager.playPlayerDeath();
        this.respawn();
        this._invincibleTimer = DAMAGE_INVINCIBILITY_TIME;
        return;
      }
    }
  }

  /* ------------------------------------------------------------------ */
  /*  Enemies                                                             */
  /* ------------------------------------------------------------------ */

  /**
   * Check collision against enemy patrols. Deducts a life and
   * respawns on contact with an invincibility window.
   * @param {Collider[]} enemies
   */
  _checkEnemies(enemies) {
    if (this._invincibleTimer > 0) return;

    for (let i = 0; i < enemies.length; i++) {
      if (this._overlap(enemies[i])) {
        this.lives -= 1;
        audioManager.playPlayerDeath();
        this.respawn();
        this._invincibleTimer = DAMAGE_INVINCIBILITY_TIME;
        return;
      }
    }
  }

  /* ------------------------------------------------------------------ */
  /*  Respawn                                                            */
  /* ------------------------------------------------------------------ */

  /**
   * Reset the player to the spawn point, clearing all temporary state.
   * Lives and score are preserved.
   */
  respawn() {
    this.x = PLAYER_SPAWN_X;
    this.y = PLAYER_SPAWN_Y;
    this.vx = 0;
    this.vy = 0;
    this.grounded = false;
    this.isAttacking = false;
    this.attackTimer = 0;
    this._keys.clear();
  }

  /* ------------------------------------------------------------------ */
  /*  Input                                                              */
  /* ------------------------------------------------------------------ */

  /**
   * Record a pressed key.
   * @param {KeyboardEvent} e
   */
  _onKeyDown(e) {
    this._keys.add(e.code);
  }

  /**
   * Release a key.
   * @param {KeyboardEvent} e
   */
  _onKeyUp(e) {
    this._keys.delete(e.code);
  }

  /* ------------------------------------------------------------------ */
  /*  Animation                                                          */
  /* ------------------------------------------------------------------ */

  /**
   * Register all player animations on the internal animator.
   */
  _setupAnimations() {
    this._animator.addAnimation("idle", {
      spriteKey: SPRITE_PLAYER_IDLE,
      frameWidth: PLAYER_FRAME_WIDTH,
      frameHeight: PLAYER_FRAME_HEIGHT,
      frameCount: PLAYER_IDLE_FRAMES,
      fps: PLAYER_IDLE_FPS,
      loop: true,
    });
    this._animator.addAnimation("run", {
      spriteKey: SPRITE_PLAYER_RUN,
      frameWidth: PLAYER_FRAME_WIDTH,
      frameHeight: PLAYER_FRAME_HEIGHT,
      frameCount: PLAYER_RUN_FRAMES,
      fps: PLAYER_RUN_FPS,
      loop: true,
    });
    this._animator.addAnimation("jump", {
      spriteKey: SPRITE_PLAYER_JUMP,
      frameWidth: PLAYER_FRAME_WIDTH,
      frameHeight: PLAYER_FRAME_HEIGHT,
      frameCount: PLAYER_JUMP_FRAMES,
      fps: PLAYER_JUMP_FPS,
      loop: true,
    });
    this._animator.addAnimation("attack", {
      spriteKey: SPRITE_PLAYER_ATTACK,
      frameWidth: PLAYER_FRAME_WIDTH,
      frameHeight: PLAYER_FRAME_HEIGHT,
      frameCount: PLAYER_ATTACK_FRAMES,
      fps: PLAYER_ATTACK_FPS,
      loop: false,
    });
  }

  /**
   * Select the animation state based on priority and advance the timer.
   *
   * Priority: Attack > Jump > Run > Idle
   * @param {number} dt
   */
  _updateAnimation(dt) {
    this._selectAnimation();
    this._animator.update(dt);
  }

  /**
   * Set the active animation based on current player state.
   */
  _selectAnimation() {
    if (this.isAttacking) {
      this._animator.play("attack");
    } else if (!this.grounded) {
      this._animator.play("jump");
    } else if (Math.abs(this.vx) > 1) {
      this._animator.play("run");
    } else {
      this._animator.play("idle");
    }
  }

  /* ------------------------------------------------------------------ */
  /*  Attack                                                             */
  /* ------------------------------------------------------------------ */

  /**
   * Begin a melee attack if not already attacking.
   */
  startAttack() {
    if (!this.isAttacking) {
      this.isAttacking = true;
      this.attackTimer = ATTACK_DURATION;
    }
  }

  /**
   * Update the attack timer. Ends the attack when the timer expires.
   * @param {number} dt - Delta time in seconds.
   */
  _updateAttackTimer(dt) {
    if (!this.isAttacking) return;

    this.attackTimer -= dt;
    if (this.attackTimer <= 0) {
      this.isAttacking = false;
      this.attackTimer = 0;
    }
  }

  /**
   * Return the attack hitbox bounds or null if not attacking.
   * The hitbox is positioned in front of the player based on facing direction.
   * @returns {Collider | null}
   */
  getAttackBounds() {
    if (!this.isAttacking) return null;

    const offsetX = ATTACK_OFFSET;
    const attackX = this._facingLeft
      ? this.x - ATTACK_WIDTH - offsetX
      : this.x + this.w + offsetX;
    const attackY = this.y + (this.h - ATTACK_HEIGHT) / 2;

    return { x: attackX, y: attackY, w: ATTACK_WIDTH, h: ATTACK_HEIGHT };
  }
}

export default Player;