/**
 * @fileoverview Central audio manager for Pixel Hero.
 *
 * Preloads every audio file once and exposes simple methods
 * for playing music (looped) and sound effects (one-shot).
 */

/** @const {string} Base path for all audio assets. */
const AUDIO_PATH = "/assets/sounds/";

/** @const {number} Default music volume. */
const MUSIC_VOLUME = 0.35;

/** @const {number} Default SFX volume. */
const SFX_VOLUME = 0.7;

/**
 * Central audio manager (singleton).
 *
 * Preloads every audio file once, prevents duplicate loading,
 * reuses audio objects, supports looped music and one-shot SFX.
 *
 * @class AudioManager
 */
class AudioManager {
  constructor() {
    /** @type {Map<string, HTMLAudioElement>} */
    this._sounds = new Map();

    /** @type {HTMLAudioElement|null} Currently playing music track. */
    this._currentMusic = null;

    /** @type {number} */
    this._musicVolume = MUSIC_VOLUME;

    /** @type {number} */
    this._sfxVolume = SFX_VOLUME;

    this._preloaded = false;
  }

  /* ------------------------------------------------------------------ */
  /*  Preloading                                                          */
  /* ------------------------------------------------------------------ */

  /**
   * Preload all audio files. Safe to call multiple times —
   * already-loaded files are skipped.
   * @returns {Promise<void>}
   */
  async preload() {
    if (this._preloaded) return;

    const files = [
      "menu-screen -sound.mp3",
      "game-screen-sound.mp3",
      "character-jumping-sound.wav",
      "character-death-sound.wav",
      "coin-collecting-sound.wav",
      "the-sound-of-victory-on-stage.wav",
      "the-sound-of-failure-in-the-stage.wav",
    ];

    const promises = files.map((filename) => this._load(filename));
    await Promise.all(promises);
    this._preloaded = true;
  }

  /**
   * Load a single audio file and store it in the map.
   * @param {string} filename
   * @returns {Promise<void>}
   */
  _load(filename) {
    return new Promise((resolve, reject) => {
      const audio = new Audio(AUDIO_PATH + filename);
      audio.preload = "auto";

      const onCanPlay = () => {
        audio.removeEventListener("canplaythrough", onCanPlay);
        audio.removeEventListener("error", onError);
        this._sounds.set(filename, audio);
        resolve();
      };

      const onError = () => {
        audio.removeEventListener("canplaythrough", onCanPlay);
        audio.removeEventListener("error", onError);
        // Resolve anyway so the game can continue without audio
        resolve();
      };

      audio.addEventListener("canplaythrough", onCanPlay, { once: true });
      audio.addEventListener("error", onError, { once: true });

      // In case the audio is already cached and fires canplaythrough
      // synchronously, start loading.
      audio.load();
    });
  }

  /* ------------------------------------------------------------------ */
  /*  Music API                                                          */
  /* ------------------------------------------------------------------ */

  /**
   * Play menu music (looped). If already playing, does nothing.
   */
  playMenuMusic() {
    this._playMusic("menu-screen -sound.mp3");
  }

  /**
   * Play gameplay music (looped). Stops any previous music first.
   */
  playGameplayMusic() {
    this._playMusic("game-screen-sound.mp3");
  }

  /**
   * Stop the currently playing music track.
   */
  stopMusic() {
    if (this._currentMusic) {
      this._currentMusic.pause();
      this._currentMusic.currentTime = 0;
      this._currentMusic = null;
    }
  }

  /**
   * Internal helper — start a new music track.
   * If the same track is already playing, do nothing.
   * Otherwise stops previous music, creates a fresh Audio node,
   * and starts playback looped.
   * @param {string} filename
   */
  _playMusic(filename) {
    const audio = this._sounds.get(filename);
    if (!audio) return;

    // If this exact track is already playing, skip
    if (this._currentMusic && this._currentMusic.src === audio.src && !this._currentMusic.paused) {
      return;
    }

    // Stop previous music
    this.stopMusic();

    // Clone the audio element for independent playback
    const music = audio.cloneNode();
    music.volume = this._musicVolume;
    music.loop = true;
    music.play().catch(() => {
      // Autoplay may be blocked — silently ignore
    });
    this._currentMusic = music;
  }

  /* ------------------------------------------------------------------ */
  /*  SFX API                                                            */
  /* ------------------------------------------------------------------ */

  /** Play the jump sound effect once. */
  playJump() {
    this._playSfx("character-jumping-sound.wav");
  }

  /** Play the coin collect sound effect once. */
  playCoin() {
    this._playSfx("coin-collecting-sound.wav");
  }

  /** Play the player death sound effect once. */
  playPlayerDeath() {
    this._playSfx("character-death-sound.wav");
  }

  /** Play the stage complete / victory sound effect once. */
  playStageComplete() {
    this._playSfx("the-sound-of-victory-on-stage.wav");
  }

  /** Play the game over sound effect once. */
  playGameOver() {
    this._playSfx("the-sound-of-failure-in-the-stage.wav");
  }

  /**
   * Internal helper — play a one-shot sound effect.
   * Uses a cloned node so overlapping SFX are supported.
   * @param {string} filename
   */
  _playSfx(filename) {
    const audio = this._sounds.get(filename);
    if (!audio) return;

    const sfx = audio.cloneNode();
    sfx.volume = this._sfxVolume;
    sfx.loop = false;
    sfx.play().catch(() => {
      // Silently ignore autoplay restrictions
    });
  }

  /* ------------------------------------------------------------------ */
  /*  Volume control                                                      */
  /* ------------------------------------------------------------------ */

  /**
   * Set music volume (0–1).
   * @param {number} value
   */
  setMusicVolume(value) {
    this._musicVolume = value;
    if (this._currentMusic) {
      this._currentMusic.volume = value;
    }
  }

  /**
   * Set SFX volume (0–1).
   * @param {number} value
   */
  setSfxVolume(value) {
    this._sfxVolume = value;
  }
}

/** @type {AudioManager} Singleton instance. */
const instance = new AudioManager();

export default instance;