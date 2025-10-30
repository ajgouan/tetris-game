import { TetrisGame } from "./components/TetrisGame";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black flex items-center justify-center p-4">
      <TetrisGame />
    </div>
  );
}
