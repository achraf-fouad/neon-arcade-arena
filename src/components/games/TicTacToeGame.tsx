import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface TicTacToeGameProps {
  isPlaying: boolean;
  onScoreChange: (p1: number, p2: number) => void;
  onGameOver: (winner: string) => void;
}

type Player = "X" | "O" | null;
type Board = Player[];

const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const TicTacToeGame = ({ isPlaying, onScoreChange, onGameOver }: TicTacToeGameProps) => {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X");
  const [winner, setWinner] = useState<Player>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [scores, setScores] = useState({ X: 0, O: 0 });

  const resetBoard = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer("X");
    setWinner(null);
    setWinningLine(null);
  };

  useEffect(() => {
    if (!isPlaying) {
      setScores({ X: 0, O: 0 });
      onScoreChange(0, 0);
      resetBoard();
    }
  }, [isPlaying, onScoreChange]);

  const checkWinner = (newBoard: Board): { winner: Player; line: number[] | null } => {
    for (const combo of WINNING_COMBINATIONS) {
      const [a, b, c] = combo;
      if (newBoard[a] && newBoard[a] === newBoard[b] && newBoard[a] === newBoard[c]) {
        return { winner: newBoard[a], line: combo };
      }
    }
    return { winner: null, line: null };
  };

  const handleCellClick = (index: number) => {
    if (!isPlaying || board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const result = checkWinner(newBoard);
    if (result.winner) {
      setWinner(result.winner);
      setWinningLine(result.line);
      const newScores = {
        ...scores,
        [result.winner]: scores[result.winner] + 1,
      };
      setScores(newScores);
      onScoreChange(newScores.X, newScores.O);
      setTimeout(() => {
        onGameOver(`PLAYER ${result.winner === "X" ? "1" : "2"} WINS!`);
      }, 1000);
    } else if (newBoard.every((cell) => cell !== null)) {
      setTimeout(() => {
        onGameOver("IT'S A DRAW!");
      }, 500);
    } else {
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Current Player Indicator */}
      <div className="font-gaming text-lg">
        {winner ? (
          <span className={winner === "X" ? "text-primary" : "text-accent"}>
            {winner} WINS!
          </span>
        ) : (
          <span>
            <span className={currentPlayer === "X" ? "text-primary" : "text-accent"}>
              PLAYER {currentPlayer === "X" ? "1" : "2"}
            </span>
            <span className="text-muted-foreground">'S TURN</span>
          </span>
        )}
      </div>

      {/* Board */}
      <div className="grid grid-cols-3 gap-3 p-4 glass-card rounded-xl">
        {board.map((cell, index) => (
          <button
            key={index}
            onClick={() => handleCellClick(index)}
            disabled={!isPlaying || !!cell || !!winner}
            className={cn(
              "w-20 h-20 md:w-24 md:h-24 rounded-lg",
              "font-gaming text-4xl md:text-5xl",
              "transition-all duration-300",
              "border border-border",
              !cell && isPlaying && !winner && "hover:bg-muted cursor-pointer",
              cell === "X" && "text-primary",
              cell === "O" && "text-accent",
              winningLine?.includes(index) && "animate-glow-pulse",
              winningLine?.includes(index) && cell === "X" && "neon-border-cyan",
              winningLine?.includes(index) && cell === "O" && "neon-border-magenta"
            )}
          >
            {cell}
          </button>
        ))}
      </div>

      {/* Instructions */}
      <div className="text-center text-sm text-muted-foreground font-gaming">
        <span className="text-primary">P1:</span> X &nbsp;|&nbsp;{" "}
        <span className="text-accent">P2:</span> O
      </div>
    </div>
  );
};

export { TicTacToeGame };
