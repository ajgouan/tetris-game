interface TetrominoPosition {
  x: number;
  y: number;
}

interface Piece {
  shape: number[][];
  color: string;
  position: TetrominoPosition;
}

interface TetrisBoardProps {
  board: (string | null)[][];
  currentPiece: Piece | null;
}

export function TetrisBoard({ board, currentPiece }: TetrisBoardProps) {
  const renderBoard = () => {
    const displayBoard = board.map((row) => [...row]);

    if (currentPiece) {
      currentPiece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value) {
            const boardY = currentPiece.position.y + y;
            const boardX = currentPiece.position.x + x;
            if (
              boardY >= 0 &&
              boardY < board.length &&
              boardX >= 0 &&
              boardX < board[0].length
            ) {
              displayBoard[boardY][boardX] = currentPiece.color;
            }
          }
        });
      });
    }

    return displayBoard;
  };

  const displayBoard = renderBoard();

  return (
    <div className="relative inline-block">
      <div
        className="grid gap-[1px] bg-gray-800 p-1 rounded"
        style={{
          gridTemplateColumns: `repeat(10, 1fr)`,
        }}
      >
        {displayBoard.map((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${y}-${x}`}
              className="w-6 h-6 sm:w-7 sm:h-7 border border-gray-700/50 rounded-sm transition-colors duration-100"
              style={{
                backgroundColor: cell || "#1a1a2e",
                boxShadow: cell
                  ? `inset 2px 2px 4px rgba(255,255,255,0.3), inset -2px -2px 4px rgba(0,0,0,0.5)`
                  : "inset 1px 1px 2px rgba(0,0,0,0.5)",
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}
