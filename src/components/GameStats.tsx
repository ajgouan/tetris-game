import { Card } from "./ui/card";
import { TETROMINOS } from "./TetrisGame";

interface GameStatsProps {
  score: number;
  highScore: number;
  lines: number;
  level: number;
  nextPiece: keyof typeof TETROMINOS;
}

export function GameStats({ score, highScore, lines, level, nextPiece }: GameStatsProps) {
  const nextTetrominoData = TETROMINOS[nextPiece];

  return (
    <div className="flex flex-col gap-4 w-full lg:w-64">
      <Card className="bg-black/50 backdrop-blur-sm border-2 border-cyan-500 p-4">
        <h3 className="text-cyan-400 mb-3 text-center" style={{ fontFamily: 'monospace' }}>
          SCORES
        </h3>
        <div className="space-y-2 text-white" style={{ fontFamily: 'monospace' }}>
          <div className="flex justify-between">
            <span className="text-gray-400">Score:</span>
            <span className="text-cyan-400">{score}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Record:</span>
            <span className="text-yellow-400">{highScore}</span>
          </div>
          <div className="h-px bg-gray-700 my-2" />
          <div className="flex justify-between">
            <span className="text-gray-400">Lignes:</span>
            <span className="text-green-400">{lines}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Niveau:</span>
            <span className="text-purple-400">{level}</span>
          </div>
        </div>
      </Card>

      <Card className="bg-black/50 backdrop-blur-sm border-2 border-cyan-500 p-4">
        <h3 className="text-cyan-400 mb-3 text-center" style={{ fontFamily: 'monospace' }}>
          SUIVANT
        </h3>
        <div className="flex justify-center items-center min-h-[80px]">
          <div
            className="grid gap-[2px] p-2 bg-gray-900 rounded"
            style={{
              gridTemplateColumns: `repeat(${nextTetrominoData.shape[0].length}, 1fr)`,
            }}
          >
            {nextTetrominoData.shape.map((row, y) =>
              row.map((cell, x) => (
                <div
                  key={`${y}-${x}`}
                  className="w-5 h-5 rounded-sm"
                  style={{
                    backgroundColor: cell ? nextTetrominoData.color : "transparent",
                    boxShadow: cell
                      ? `inset 2px 2px 4px rgba(255,255,255,0.3), inset -2px -2px 4px rgba(0,0,0,0.5)`
                      : "none",
                  }}
                />
              ))
            )}
          </div>
        </div>
      </Card>

      <Card className="bg-black/50 backdrop-blur-sm border-2 border-cyan-500 p-4">
        <h3 className="text-cyan-400 mb-3 text-center" style={{ fontFamily: 'monospace' }}>
          CONTRÔLES
        </h3>
        <div className="space-y-2 text-sm text-white" style={{ fontFamily: 'monospace' }}>
          <div className="flex justify-between">
            <span className="text-gray-400">←/→:</span>
            <span className="text-cyan-400">Déplacer</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">↓:</span>
            <span className="text-cyan-400">Descendre</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">↑:</span>
            <span className="text-cyan-400">Rotation</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Espace:</span>
            <span className="text-cyan-400">Chute rapide</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">P:</span>
            <span className="text-cyan-400">Pause</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
