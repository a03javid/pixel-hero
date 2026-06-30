/**
 * @fileoverview Central constants for Pixel Hero game configuration.
 */

/** @const {number} Internal canvas width in pixels. */
export const CANVAS_WIDTH = 960;

/** @const {number} Internal canvas height in pixels. */
export const CANVAS_HEIGHT = 540;

/** @const {string[]} Menu button labels in display order. */
export const MENU_BUTTONS = ["Start Game", "Help", "Credits", "Exit"];

/** @const {string} Title text displayed on the menu screen. */
export const TITLE_TEXT = "Pixel Hero";

/** @const {string} The CSS font family used for all in-game text. */
export const FONT_FAMILY = "'Press Start 2P', monospace";

/** @const {number} Base title font size in pixels. */
export const TITLE_FONT_SIZE = 48;

/** @const {number} Base button font size in pixels. */
export const BUTTON_FONT_SIZE = 24;

/** @const {number} Button height in pixels. */
export const BUTTON_HEIGHT = 40;

/** @const {number} Vertical gap between buttons in pixels. */
export const BUTTON_GAP = 16;

/** @const {number} Top margin before the first button in pixels. */
export const BUTTONS_TOP_OFFSET = 220;

/** @const {number} Scale multiplier applied to the selected button. */
export const SELECTED_SCALE = 1.1;

/** @const {number} Gold border width for the selected button in pixels. */
export const GOLD_BORDER_WIDTH = 3;

/** @const {string} Gold color used for selection border. */
export const GOLD_COLOR = "#FFD700";

/** @const {string} Color of a highlighted button's shadow. */
export const GLOW_COLOR = "rgba(255, 215, 0, 0.6)";

/** @const {number} Horizontal blur radius for the selection glow. */
export const GLOW_BLUR = 12;

/** @const {string} Default button background colour. */
export const BUTTON_BG_COLOR = "#222034";

/** @const {string} Default button text colour. */
export const BUTTON_TEXT_COLOR = "#e0e0e0";

/** @const {string} Hovered / selected button background colour. */
export const BUTTON_HOVER_BG_COLOR = "#3d3d5c";

/** @const {string} Title fill colour. */
export const TITLE_COLOR = "#ffffff";

/** @const {string} Title stroke colour for pixel-art outline. */
export const TITLE_STROKE_COLOR = "#1a1a2e";

/** @const {number} Title stroke line width in pixels. */
export const TITLE_STROKE_WIDTH = 4;

/* ------------------------------------------------------------------ */
/*  Background colours                                                 */
/* ------------------------------------------------------------------ */

/** @const {string} Top of the sky gradient. */
export const SKY_COLOR_TOP = "#0d1b2a";

/** @const {string} Bottom of the sky gradient. */
export const SKY_COLOR_BOTTOM = "#1b2838";

/** @const {string} Cloud fill colour. */
export const CLOUD_COLOR = "rgba(255, 255, 255, 0.3)";

/** @const {string} Mountain back-layer colour. */
export const MOUNTAIN_FAR_COLOR = "#2d3a4a";

/** @const {string} Mountain mid-layer colour. */
export const MOUNTAIN_MID_COLOR = "#1e2c3a";

/** @const {string} Mountain front-layer colour. */
export const MOUNTAIN_NEAR_COLOR = "#15202b";

/** @const {string} Snow cap colour. */
export const SNOW_COLOR = "#e8e8f0";

/** @const {string} Green ground base colour. */
export const GROUND_COLOR = "#2d5a27";

/** @const {string} Ground highlight colour. */
export const GROUND_HIGHLIGHT_COLOR = "#3a7a32";

/* ------------------------------------------------------------------ */
/*  Level dimensions                                                   */
/* ------------------------------------------------------------------ */

/** @const {number} Total level width in pixels. */
export const LEVEL_WIDTH = 3000;

/** @const {number} Top Y of the ground plane. */
export const GROUND_Y = 470;

/** @const {number} Height of the ground strip. */
export const GROUND_HEIGHT = 70;

/** @const {number} Width of the pit (gap in the ground). */
export const PIT_WIDTH = 150;

/** @const {number} X position where the pit begins. */
export const PIT_X = 1200;

/* ------------------------------------------------------------------ */
/*  Gameplay colours                                                   */
/* ------------------------------------------------------------------ */

/** @const {string} Sky top colour for the gameplay level. */
export const LEVEL_SKY_TOP = "#4a90d9";

/** @const {string} Sky bottom colour for the gameplay level. */
export const LEVEL_SKY_BOTTOM = "#87ceeb";

/** @const {string} Tree trunk colour. */
export const TREE_TRUNK_COLOR = "#5c3a1e";

/** @const {string} Tree foliage colour (leaves). */
export const TREE_FOLIAGE_COLOR = "#2d6a1e";

/** @const {string} Tree foliage highlight. */
export const TREE_FOLIAGE_HIGHLIGHT = "#3e8a2a";

/** @const {string} Platform fill colour. */
export const PLATFORM_COLOR = "#8B6914";

/** @const {string} Platform top highlight colour. */
export const PLATFORM_HIGHLIGHT = "#6B4F12";

/** @const {string} Castle wall colour. */
export const CASTLE_WALL_COLOR = "#6b6b7a";

/** @const {string} Castle tower colour. */
export const CASTLE_TOWER_COLOR = "#4a4a5a";

/** @const {string} Castle roof colour. */
export const CASTLE_ROOF_COLOR = "#8b2020";

/** @const {string} Castle door colour. */
export const CASTLE_DOOR_COLOR = "#3a2010";

/** @const {string} Castle window colour. */
export const CASTLE_WINDOW_COLOR = "#f0e68c";

/** @const {string} "FINISH" text colour. */
export const FINISH_TEXT_COLOR = "#FFD700";

/** @const {number} Font size for the "FINISH" label. */
export const FINISH_FONT_SIZE = 20;

/* ------------------------------------------------------------------ */
/*  Scene identifiers                                                  */
/* ------------------------------------------------------------------ */

/** @const {string} Menu scene identifier. */
export const SCENE_MENU = "menu";

/** @const {string} Gameplay scene identifier. */
export const SCENE_GAMEPLAY = "gameplay";

/** @const {string} Game Over scene identifier. */
export const SCENE_GAMEOVER = "gameover";

/** @const {string} Victory scene identifier. */
export const SCENE_VICTORY = "victory";

/** @const {string} Help scene identifier. */
export const SCENE_HELP = "help";

/** @const {string} Credits scene identifier. */
export const SCENE_CREDITS = "credits";

/* ------------------------------------------------------------------ */
/*  Help / Credits scene constants                                     */
/* ------------------------------------------------------------------ */

/** @const {number} Font size for section titles. */
export const SECTION_TITLE_SIZE = 14;

/** @const {number} Font size for body text. */
export const BODY_FONT_SIZE = 10;

/** @const {number} Font size for subtitle text. */
export const SUBTITLE_FONT_SIZE = 16;

/** @const {string} Section title text colour. */
export const SECTION_TITLE_COLOR = "#FFD700";

/** @const {string} Body text colour. */
export const BODY_TEXT_COLOR = "#ffffff";

/** @const {string} Secondary / grayed text colour. */
export const SECONDARY_TEXT_COLOR = "#c0c0c0";

/** @const {string} Semi-transparent dark panel colour. */
export const PANEL_BACKGROUND = "rgba(0, 0, 0, 0.5)";

/** @const {number} Vertical gap between sections. */
export const SECTION_GAP = 5;

/** @const {number} Vertical gap between lines of body text. */
export const BODY_LINE_HEIGHT = 14;

/** @const {number} Bottom prompt text offset from canvas bottom. */
export const BOTTOM_PROMPT_OFFSET = 30;

/* ------------------------------------------------------------------ */
/*  Player                                                            */
/* ------------------------------------------------------------------ */

/** @const {number} Player hitbox width in pixels. */
export const PLAYER_WIDTH = 32;

/** @const {number} Player hitbox height in pixels. */
export const PLAYER_HEIGHT = 48;

/** @const {number} Player spawn X position. */
export const PLAYER_SPAWN_X = 100;

/** @const {number} Player spawn Y position. */
export const PLAYER_SPAWN_Y = 350;

/** @const {number} Maximum horizontal speed in px/sec. */
export const PLAYER_MAX_SPEED = 220;

/** @const {number} Ground acceleration in px/sec². */
export const PLAYER_ACCELERATION = 1200;

/** @const {number} Ground friction in px/sec². */
export const PLAYER_FRICTION = 1600;

/** @const {number} Fraction of ground acceleration used in air. */
export const PLAYER_AIR_CONTROL_FACTOR = 0.7;

/** @const {number} Gravity acceleration in px/sec² (downward). */
export const PLAYER_GRAVITY = 1200;

/** @const {number} Jump impulse velocity in px/sec (upward). */
export const PLAYER_JUMP_VELOCITY = -500;

/** @const {number} Maximum downward velocity in px/sec. */
export const PLAYER_TERMINAL_VELOCITY = 700;

/** @const {number} Y threshold below which the player is considered fallen. */
export const PLAYER_FALL_THRESHOLD = 640;

/** @const {string} Emoji drawn as the player placeholder. */
export const PLAYER_EMOJI = "😀";

/** @const {number} Font size for the player emoji. */
export const PLAYER_EMOJI_SIZE = 28;

/** @const {string} Hitbox outline colour. */
export const PLAYER_HITBOX_COLOR = "#000000";

/* ------------------------------------------------------------------ */
/*  HUD                                                                */
/* ------------------------------------------------------------------ */

/** @const {number} Margin from canvas edges in pixels. */
export const HUD_MARGIN = 12;

/** @const {number} Internal padding of HUD panels. */
export const HUD_PADDING = 10;

/** @const {number} Font size for HUD text. */
export const HUD_FONT_SIZE = 14;

/** @const {number} Height of each HUD panel. */
export const HUD_PANEL_HEIGHT = 36;

/** @const {number} Width of the top-left HUD panel. */
export const HUD_PANEL_WIDTH = 280;

/** @const {string} Semi-transparent background for HUD panels. */
export const HUD_BACKGROUND = "rgba(0, 0, 0, 0.45)";

/** @const {number} Y position where the debug overlay starts (below the HUD). */
export const DEBUG_OVERLAY_Y = 68;

/** @const {string} HUD text colour. */
export const HUD_TEXT_COLOR = "#ffffff";

/** @const {number} Corner radius for HUD panel rounded corners. */
export const HUD_CORNER_RADIUS = 6;

/** @const {string} Stage label text. */
export const HUD_STAGE_LABEL = "Stage 1";

/** @const {number} Width of the top-right stage panel. */
export const HUD_STAGE_PANEL_WIDTH = 160;

/* ------------------------------------------------------------------ */
/*  Collectibles                                                       */
/* ------------------------------------------------------------------ */

/** @const {string} */
export const COLLECTIBLE_COIN = "COIN";

/** @const {string} */
export const COLLECTIBLE_HEART = "HEART";

/** @const {number} Coin diameter in pixels. */
export const COIN_SIZE = 14;

/** @const {string} Coin fill colour. */
export const COIN_COLOR = "#FFD700";

/** @const {string} Coin outline colour. */
export const COIN_OUTLINE_COLOR = "#B8860B";

/** @const {number} Heart diameter in pixels. */
export const HEART_SIZE = 20;

/** @const {number} Maximum player lives. */
export const MAX_LIVES = 3;

/* ------------------------------------------------------------------ */
/*  Spike hazards                                                       */
/* ------------------------------------------------------------------ */

/** @const {number} Width of a spike in pixels. */
export const SPIKE_WIDTH = 24;

/** @const {number} Height of a spike in pixels. */
export const SPIKE_HEIGHT = 16;

/* ------------------------------------------------------------------ */
/*  Enemy                                                              */
/* ------------------------------------------------------------------ */

/** @const {number} Enemy hitbox width in pixels. */
export const ENEMY_WIDTH = 32;

/** @const {number} Enemy hitbox height in pixels. */
export const ENEMY_HEIGHT = 40;

/** @const {number} Enemy patrol speed in px/sec. */
export const ENEMY_SPEED = 60;

/** @const {string} Enemy body colour. */
export const ENEMY_BODY_COLOR = "#6a0dad";

/** @const {string} Enemy lighter detail colour. */
export const ENEMY_DETAIL_COLOR = "#9b30ff";

/** @const {string} Enemy outline colour. */
export const ENEMY_OUTLINE_COLOR = "#2d004d";

/** @const {number} Duration of invincibility after taking damage, in seconds. */
export const DAMAGE_INVINCIBILITY_TIME = 1.5;

/* ------------------------------------------------------------------ */
/*  Stage completion                                                    */
/* ------------------------------------------------------------------ */

/** @const {number} Width of the goal trigger area in pixels. */
export const GOAL_WIDTH = 60;

/** @const {number} Height of the goal trigger area in pixels. */
export const GOAL_HEIGHT = 100;

/** @const {string} Colour of the semi-transparent completion overlay. */
export const OVERLAY_COLOR = "rgba(0, 0, 0, 0.6)";

/** @const {number} Font size for the "STAGE COMPLETE" title. */
export const COMPLETE_TITLE_SIZE = 40;

/** @const {number} Font size for the "Press ENTER" instruction. */
export const COMPLETE_TEXT_SIZE = 16;

/* ------------------------------------------------------------------ */
/*  Player attack                                                      */
/* ------------------------------------------------------------------ */

/** @const {number} Attack state duration in seconds. */
export const ATTACK_DURATION = 0.25;

/** @const {number} Attack hitbox width in pixels. */
export const ATTACK_WIDTH = 36;

/** @const {number} Attack hitbox height in pixels. */
export const ATTACK_HEIGHT = 24;

/** @const {number} Horizontal offset of the attack hitbox from the player edge. */
export const ATTACK_OFFSET = 0;

/** @const {string} Debug colour for the attack hitbox. */
export const ATTACK_COLOR = "#FFFF00";

/** @const {number} Score increment when an enemy is killed. */
export const PLAYER_ATTACK_SCORE = 5;

/* ------------------------------------------------------------------ */
/*  Sprite paths                                                       */
/* ------------------------------------------------------------------ */

/** @const {string} Key for the player idle sprite. */
export const SPRITE_PLAYER_IDLE = "player_idle";

/** @const {string} URL for the player idle sprite. */
export const SPRITE_PLAYER_IDLE_URL = "/assets/images/player/player_idle.png";

/** @const {string} Key for the player run sprite. */
export const SPRITE_PLAYER_RUN = "player_run";

/** @const {string} URL for the player run sprite. */
export const SPRITE_PLAYER_RUN_URL = "/assets/images/player/player_run.png";

/** @const {string} Key for the player jump sprite. */
export const SPRITE_PLAYER_JUMP = "player_jump";

/** @const {string} URL for the player jump sprite. */
export const SPRITE_PLAYER_JUMP_URL = "/assets/images/player/player_jump.png";

/** @const {string} Key for the player attack sprite. */
export const SPRITE_PLAYER_ATTACK = "player_attack";

/** @const {string} URL for the player attack sprite. */
export const SPRITE_PLAYER_ATTACK_URL = "/assets/images/player/player_attack.png";

/** @const {string} Key for the ground enemy walk sprite. */
export const SPRITE_GROUND_ENEMY_WALK = "ground_enemy_walk";

/** @const {string} URL for the ground enemy walk sprite. */
export const SPRITE_GROUND_ENEMY_WALK_URL = "/assets/images/enemies/ground_enemy_walk.png";

/** @const {number} Flying enemy horizontal patrol speed in px/sec. */
export const FLYING_ENEMY_SPEED = 80;

/** @const {string} Key for the flying enemy fly sprite. */
export const SPRITE_FLYING_ENEMY_FLY = "flying_enemy_fly";

/** @const {string} URL for the flying enemy fly sprite. */
export const SPRITE_FLYING_ENEMY_FLY_URL = "/assets/images/enemies/flying_enemy.png";

/** @const {number} Width of a single frame in the flying enemy fly sheet. */
export const FLYING_ENEMY_FRAME_WIDTH = 32;

/** @const {number} Height of a single frame in the flying enemy fly sheet. */
export const FLYING_ENEMY_FRAME_HEIGHT = 40;

/** @const {number} Frame playback rate for flying enemy fly. */
export const FLYING_ENEMY_FLY_FPS = 8;

/** @const {number} Number of frames in the flying enemy fly sheet. */
export const FLYING_ENEMY_FLY_FRAMES = 4;

/** @const {number} Angular speed for wing-flap canvas fallback animation (radians/sec). */
export const WING_FLAP_SPEED = 12;

/* ------------------------------------------------------------------ */
/*  Player animation definitions                                       */
/* ------------------------------------------------------------------ */

/** @const {number} Width of a single frame in the player sprite sheets. */
export const PLAYER_FRAME_WIDTH = 32;

/** @const {number} Height of a single frame in the player sprite sheets. */
export const PLAYER_FRAME_HEIGHT = 48;

/** @const {number} Frame playback rate for idle. */
export const PLAYER_IDLE_FPS = 4;

/** @const {number} Frame playback rate for run. */
export const PLAYER_RUN_FPS = 8;

/** @const {number} Frame playback rate for jump. */
export const PLAYER_JUMP_FPS = 6;

/** @const {number} Frame playback rate for attack. */
export const PLAYER_ATTACK_FPS = 10;

/** @const {number} Number of frames in the player idle sheet. */
export const PLAYER_IDLE_FRAMES = 4;

/** @const {number} Number of frames in the player run sheet. */
export const PLAYER_RUN_FRAMES = 4;

/** @const {number} Number of frames in the player jump sheet. */
export const PLAYER_JUMP_FRAMES = 4;

/** @const {number} Number of frames in the player attack sheet. */
export const PLAYER_ATTACK_FRAMES = 4;

/* ------------------------------------------------------------------ */
/*  Enemy animation definitions                                        */
/* ------------------------------------------------------------------ */

/** @const {number} Width of a single frame in the enemy walk sheet. */
export const ENEMY_FRAME_WIDTH = 32;

/** @const {number} Height of a single frame in the enemy walk sheet. */
export const ENEMY_FRAME_HEIGHT = 40;

/** @const {number} Frame playback rate for enemy walk. */
export const ENEMY_WALK_FPS = 6;

/** @const {number} Number of frames in the enemy walk sheet. */
export const ENEMY_WALK_FRAMES = 4;

/* ------------------------------------------------------------------ */
/*  Shooter enemy                                                      */
/* ------------------------------------------------------------------ */

/** @const {number} Detection range for the shooter enemy in pixels. */
export const SHOOTER_RANGE = 400;

/** @const {number} Cooldown between shots in seconds. */
export const SHOOTER_FIRE_INTERVAL = 2;

/** @const {number} Horizontal speed of projectiles in px/sec. */
export const PROJECTILE_SPEED = 220;

/** @const {number} Projectile width in pixels. */
export const PROJECTILE_WIDTH = 16;

/** @const {number} Projectile height in pixels. */
export const PROJECTILE_HEIGHT = 8;

/** @const {string} Key for the shooter enemy sprite. */
export const SPRITE_SHOOTER_ENEMY = "shooter_enemy";

/** @const {string} URL for the shooter enemy sprite. */
export const SPRITE_SHOOTER_ENEMY_URL = "/assets/images/enemies/shooter_enemy.png";

/** @const {string} Key for the projectile sprite. */
export const SPRITE_PROJECTILE = "projectile";

/** @const {string} URL for the projectile sprite. */
export const SPRITE_PROJECTILE_URL = "/assets/images/effects/projectile.png";

/* ------------------------------------------------------------------ */
/*  Boss enemy (Stage 5)                                               */
/* ------------------------------------------------------------------ */

/** @const {number} Boss hitbox width in pixels. */
export const BOSS_WIDTH = 64;

/** @const {number} Boss hitbox height in pixels. */
export const BOSS_HEIGHT = 80;

/** @const {number} Boss starting health. */
export const BOSS_HP = 3;

/** @const {number} Boss phase 1 patrol speed in px/sec. */
export const BOSS_PHASE1_SPEED = 50;

/** @const {number} Boss phase 2 patrol speed in px/sec. */
export const BOSS_PHASE2_SPEED = 80;

/** @const {number} Boss phase 3 patrol speed in px/sec. */
export const BOSS_PHASE3_SPEED = 120;

/** @const {number} Fireball cooldown in phase 2 (seconds). */
export const BOSS_FIREBALL_INTERVAL_PHASE2 = 2;

/** @const {number} Fireball cooldown in phase 3 (seconds). */
export const BOSS_FIREBALL_INTERVAL_PHASE3 = 1;

/** @const {number} Ground slam cooldown in seconds. */
export const BOSS_SLAM_INTERVAL = 4;

/** @const {number} Half-width of the slam damage zone in pixels. */
export const BOSS_SLAM_RANGE = 80;

/** @const {number} How long the slam damage zone lingers in seconds. */
export const BOSS_SLAM_ACTIVE_DURATION = 0.3;

/** @const {number} Score awarded when the boss is defeated. */
export const BOSS_SCORE = 50;

/** @const {string} Key for the boss sprite sheet. */
export const SPRITE_BOSS_ENEMY = "boss_enemy";

/** @const {string} URL for the boss sprite sheet. */
export const SPRITE_BOSS_ENEMY_URL = "/assets/images/enemies/boss_enemy.png";

/** @const {number} Width of a single frame in the boss walk sheet. */
export const BOSS_FRAME_WIDTH = 64;

/** @const {number} Height of a single frame in the boss walk sheet. */
export const BOSS_FRAME_HEIGHT = 80;

/** @const {number} Frame playback rate for boss walk. */
export const BOSS_WALK_FPS = 6;

/** @const {number} Number of frames in the boss walk sheet. */
export const BOSS_WALK_FRAMES = 4;
