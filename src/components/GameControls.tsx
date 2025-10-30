import { Button } from "./ui/button";
import { Pause, Play, RotateCcw, ArrowLeft, ArrowRight, ArrowDown, RotateCw, ChevronsDown } from "lucide-react";

interface GameControlsProps {
  isPaused: boolean;
  gameStarted: boolean;
  gameOver: boolean;
  onPause: () => void;
  onRestart: () => void;
  onMove: (direction: "left" | "right" | "down") => void;
  onRotate: () => void;
  onHardDrop: () => void;
}

export function GameControls({
  isPaused,
  gameStarted,
  gameOver,
  onPause,
  onRestart,
  onMove,
  onRotate,
  onHardDrop,
}: GameControlsProps) {
  return (
    <div className="bg-black/50 backdrop-blur-sm p-4 rounded-lg border-2 border-purple-500">
      <div className="flex gap-2 mb-4">
        <Button
          onClick={onPause}
          disabled={!gameStarted || gameOver}
          className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black gap-2"
        >
          {isPaused ? (
            <>
              <Play className="w-4 h-4" />
              Reprendre
            </>
          ) : (
            <>
              <Pause className="w-4 h-4" />
              Pause
            </>
          )}
        </Button>
        <Button
          onClick={onRestart}
          className="flex-1 bg-green-500 hover:bg-green-600 text-black gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Recommencer
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Button
          onClick={() => onMove("left")}
          disabled={!gameStarted || gameOver || isPaused}
          className="bg-blue-500 hover:bg-blue-600 text-white aspect-square p-0"
          size="lg"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <Button
          onClick={onRotate}
          disabled={!gameStarted || gameOver || isPaused}
          className="bg-purple-500 hover:bg-purple-600 text-white aspect-square p-0"
          size="lg"
        >
          <RotateCw className="w-6 h-6" />
        </Button>
        <Button
          onClick={() => onMove("right")}
          disabled={!gameStarted || gameOver || isPaused}
          className="bg-blue-500 hover:bg-blue-600 text-white aspect-square p-0"
          size="lg"
        >
          <ArrowRight className="w-6 h-6" />
        </Button>
        <Button
          onClick={() => onMove("down")}
          disabled={!gameStarted || gameOver || isPaused}
          className="bg-blue-500 hover:bg-blue-600 text-white aspect-square p-0"
          size="lg"
        >
          <ArrowDown className="w-6 h-6" />
        </Button>
        <Button
          onClick={onHardDrop}
          disabled={!gameStarted || gameOver || isPaused}
          className="bg-red-500 hover:bg-red-600 text-white aspect-square p-0 col-span-2"
          size="lg"
        >
          <ChevronsDown className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}
