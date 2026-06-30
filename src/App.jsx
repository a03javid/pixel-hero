import GameCanvas from "./components/GameCanvas.jsx";

/**
 * Root application component.
 *
 * Its only responsibility is centering the game canvas on the screen.
 * All game logic lives inside GameCanvas and its children.
 *
 * @component
 * @returns {JSX.Element}
 */
function App() {
  return <GameCanvas />;
}

export default App;