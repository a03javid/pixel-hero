import { useRef, useEffect } from "react";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "../game/constants.js";
import Game from "../game/Game.js";

/**
 * Renders a single fixed-resolution Canvas and bootstraps the Game
 * loop on mount.  CSS is used exclusively for centering and scaling;
 * the internal resolution never changes.
 *
 * @component
 * @returns {JSX.Element}
 */
function GameCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const game = new Game(canvas);
    game.start();

    return () => {
      game.stop();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      style={{
        maxWidth: "100%",
        maxHeight: "100%",
        display: "block",
        imageRendering: "pixelated",
      }}
    />
  );
}

export default GameCanvas;