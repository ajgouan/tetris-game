import { useState, useEffect, useCallback, useRef } from "react";
import { TetrisBoard } from "./TetrisBoard";
import { GameStats } from "./GameStats";
import { Button } from "./ui/button";
import { Play, RotateCcw } from "lucide-react";

// Types de pièces Tetris
export const TETROMINOS = {
  I: {
    shape: [[1, 1, 1, 1]],
    color: "#00f0f0",
  },
  O: {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: "#f0f000",
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
    ],
    color: "#a000f0",
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
    ],
    color: "#00f000",
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
    ],
    color: "#f00000",
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
    ],
    color: "#0000f0",
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
    ],
    color: "#f0a000",
  },
};

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;

type TetrominoType = keyof typeof TETROMINOS;
type Board = (string | null)[][];

interface Position {
  x: number;
  y: number;
}

interface Piece {
  shape: number[][];
  color: string;
  position: Position;
  type: TetrominoType;
}

const createEmptyBoard = (): Board => {
  return Array.from({ length: BOARD_HEIGHT }, () =>
    Array(BOARD_WIDTH).fill(null)
  );
};

const randomTetromino = (): TetrominoType => {
  const tetrominos = Object.keys(TETROMINOS) as TetrominoType[];
  return tetrominos[Math.floor(Math.random() * tetrominos.length)];
};

const createPiece = (type: TetrominoType): Piece => {
  const tetromino = TETROMINOS[type];
  return {
    shape: tetromino.shape,
    color: tetromino.color,
    position: { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 },
    type,
  };
};

export function TetrisGame() {
  const [board, setBoard] = useState<Board>(createEmptyBoard());
  const [currentPiece, setCurrentPiece] = useState<Piece | null>(null);
  const [nextPiece, setNextPiece] = useState<TetrominoType>(randomTetromino());
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem("tetris-highscore");
    return saved ? parseInt(saved, 10) : 0;
  });

  const dropTimeRef = useRef<number>(1000);
  const lastDropTimeRef = useRef<number>(Date.now());

  // Détection des collisions
  const checkCollision = useCallback(
    (piece: Piece, board: Board, offset: { x: number; y: number } = { x: 0, y: 0 }): boolean => {
      for (let y = 0; y < piece.shape.length; y++) {
        for (let x = 0; x < piece.shape[y].length; x++) {
          if (piece.shape[y][x]) {
            const newX = piece.position.x + x + offset.x;
            const newY = piece.position.y + y + offset.y;

            if (
              newX < 0 ||
              newX >= BOARD_WIDTH ||
              newY >= BOARD_HEIGHT ||
              (newY >= 0 && board[newY][newX])
            ) {
              return true;
            }
          }
        }
      }
      return false;
    },
    []
  );

  // Fusionner la pièce dans le plateau
  const mergePieceToBoard = useCallback((piece: Piece, board: Board): Board => {
    const newBoard = board.map((row) => [...row]);
    piece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value) {
          const boardY = piece.position.y + y;
          const boardX = piece.position.x + x;
          if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
            newBoard[boardY][boardX] = piece.color;
          }
        }
      });
    });
    return newBoard;
  }, []);

  // Supprimer les lignes complétées
  const clearLines = useCallback((board: Board): { newBoard: Board; linesCleared: number } => {
    let linesCleared = 0;
    const newBoard = board.filter((row) => {
      if (row.every((cell) => cell !== null)) {
        linesCleared++;
        return false;
      }
      return true;
    });

    while (newBoard.length < BOARD_HEIGHT) {
      newBoard.unshift(Array(BOARD_WIDTH).fill(null));
    }

    return { newBoard, linesCleared };
  }, []);

  // tourner la pièce
  const rotatePiece = useCallback(
    (piece: Piece): number[][] => {
      const rotated = piece.shape[0].map((_, i) =>
        piece.shape.map((row) => row[i]).reverse()
      );
      return rotated;
    },
    []
  );

  // Déplacer la pièce
  const movePiece = useCallback(
    (direction: "left" | "right" | "down") => {
      if (!currentPiece || gameOver || isPaused) return;

      const offset = {
        left: { x: -1, y: 0 },
        right: { x: 1, y: 0 },
        down: { x: 0, y: 1 },
      }[direction];

      if (!checkCollision(currentPiece, board, offset)) {
        setCurrentPiece({
          ...currentPiece,
          position: {
            x: currentPiece.position.x + offset.x,
            y: currentPiece.position.y + offset.y,
          },
        });
      } else if (direction === "down") {
        // La pièce a atterri
        const newBoard = mergePieceToBoard(currentPiece, board);
        const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);
        
        setBoard(clearedBoard);
        setLines((prev) => prev + linesCleared);
        
        if (linesCleared > 0) {
          const points = [0, 100, 300, 500, 800][linesCleared] * level;
          setScore((prev) => prev + points);
        }

        // Vérifier si le jeu est terminé
        const newPiece = createPiece(nextPiece);
        if (checkCollision(newPiece, clearedBoard)) {
          setGameOver(true);
          if (score > highScore) {
            setHighScore(score);
            localStorage.setItem("tetris-highscore", score.toString());
          }
        } else {
          setCurrentPiece(newPiece);
          setNextPiece(randomTetromino());
        }
      }
    },
    [currentPiece, board, gameOver, isPaused, checkCollision, mergePieceToBoard, clearLines, nextPiece, score, highScore, level]
  );

  // tourner la pièce
  const handleRotate = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return;

    const rotated = rotatePiece(currentPiece);
    const rotatedPiece = { ...currentPiece, shape: rotated };

    if (!checkCollision(rotatedPiece, board)) {
      setCurrentPiece(rotatedPiece);
    }
  }, [currentPiece, gameOver, isPaused, board, rotatePiece, checkCollision]);

  // chute rapide
  const handleHardDrop = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return;

    let dropDistance = 0;
    while (!checkCollision(currentPiece, board, { x: 0, y: dropDistance + 1 })) {
      dropDistance++;
    }

    const droppedPiece = {
      ...currentPiece,
      position: {
        x: currentPiece.position.x,
        y: currentPiece.position.y + dropDistance,
      },
    };

    const newBoard = mergePieceToBoard(droppedPiece, board);
    const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);
    
    setBoard(clearedBoard);
    setLines((prev) => prev + linesCleared);
    setScore((prev) => prev + dropDistance * 2 + (linesCleared > 0 ? [0, 100, 300, 500, 800][linesCleared] * level : 0));

    const newPiece = createPiece(nextPiece);
    if (checkCollision(newPiece, clearedBoard)) {
      setGameOver(true);
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem("tetris-highscore", score.toString());
      }
    } else {
      setCurrentPiece(newPiece);
      setNextPiece(randomTetromino());
    }
  }, [currentPiece, gameOver, isPaused, board, checkCollision, mergePieceToBoard, clearLines, nextPiece, score, highScore, level]);

  // Contrôles avec le clavier
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameOver || !gameStarted) return;

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          movePiece("left");
          break;
        case "ArrowRight":
          e.preventDefault();
          movePiece("right");
          break;
        case "ArrowDown":
          e.preventDefault();
          movePiece("down");
          break;
        case "ArrowUp":
          e.preventDefault();
          handleRotate();
          break;
        case " ":
          e.preventDefault();
          handleHardDrop();
          break;
        case "p":
        case "P":
          e.preventDefault();
          setIsPaused((prev) => !prev);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [movePiece, handleRotate, handleHardDrop, gameOver, gameStarted]);

  // Boucle de jeu
  useEffect(() => {
    if (!gameStarted || gameOver || isPaused || !currentPiece) return;

    const gameLoop = () => {
      const now = Date.now();
      if (now - lastDropTimeRef.current > dropTimeRef.current) {
        movePiece("down");
        lastDropTimeRef.current = now;
      }
    };

    const intervalId = setInterval(gameLoop, 50);
    return () => clearInterval(intervalId);
  }, [gameStarted, gameOver, isPaused, currentPiece, movePiece]);

  // Mise à jour du niveau et de la vitesse
  useEffect(() => {
    const newLevel = Math.floor(lines / 10) + 1;
    setLevel(newLevel);
    dropTimeRef.current = Math.max(100, 1000 - (newLevel - 1) * 100);
  }, [lines]);

  // Commencer le jeu
  const startGame = () => {
    setBoard(createEmptyBoard());
    const firstPiece = randomTetromino();
    setCurrentPiece(createPiece(firstPiece));
    setNextPiece(randomTetromino());
    setScore(0);
    setLines(0);
    setLevel(1);
    setGameOver(false);
    setIsPaused(false);
    setGameStarted(true);
    lastDropTimeRef.current = Date.now();
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      <div className="bg-black/50 backdrop-blur-sm p-6 rounded-lg border-4 border-purple-500 shadow-2xl">
        <div className="mb-4 text-center">
          <h1 className="text-cyan-400 mb-2 tracking-wider" style={{ fontFamily: 'monospace' }}>
            TETRIS
          </h1>
          <div className="h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
        </div>
        
        <TetrisBoard board={board} currentPiece={currentPiece} />
        
        {!gameStarted && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded">
            <div className="text-center">
              <h2 className="text-cyan-400 mb-4">Prêt à jouer ?</h2>
              <Button
                onClick={startGame}
                className="bg-cyan-500 hover:bg-cyan-600 text-black gap-2"
              >
                <Play className="w-5 h-5" />
                Commencer
              </Button>
            </div>
          </div>
        )}
        
        {gameOver && (
          <div className="absolute inset-0 bg-black/90 flex items-center justify-center rounded">
            <div className="text-center">
              <h2 className="text-red-500 mb-2">GAME OVER</h2>
              <p className="text-cyan-400 mb-4">Score: {score}</p>
              {score === highScore && score > 0 && (
                <p className="text-yellow-400 mb-4">🏆 Nouveau record !</p>
              )}
              <Button
                onClick={startGame}
                className="bg-cyan-500 hover:bg-cyan-600 text-black gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Rejouer
              </Button>
            </div>
          </div>
        )}
        
        {isPaused && gameStarted && !gameOver && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded">
            <div className="text-center">
              <h2 className="text-yellow-400 mb-4">PAUSE</h2>
              <p className="text-cyan-400">Appuyez sur P pour reprendre</p>
            </div>
          </div>
        )}
      </div>
      
      <GameStats
        score={score}
        highScore={highScore}
        lines={lines}
        level={level}
        nextPiece={nextPiece}
      />
    </div>
  );
}
