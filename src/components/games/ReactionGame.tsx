import { useState, useEffect, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";

interface ReactionGameProps {
  isPlaying: boolean;
  onScoreChange: (p1: number, p2: number) => void;
  onGameOver: (winner: string) => void;
}

const WIN_SCORE = 5;

const ReactionGame = ({ isPlaying, onScoreChange, onGameOver }: ReactionGameProps) => {
  const [gameState, setGameState] = useState<"waiting" | "ready" | "go" | "result">("waiting");
  const [scores, setScores] = useState({ player1: 0, player2: 0 });
  const [winner, setWinner] = useState<1 | 2 | null>(null);
  const [tooEarly, setTooEarly] = useState<1 | 2 | null>(null);
  const [reactionTimes, setReactionTimes] = useState({ player1: 0, player2: 0 });
  const goTimeRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const player1TimeRef = useRef<number | null>(null);
  const player2TimeRef = useRef<number | null>(null);

  const resetRound = useCallback(() => {
    setGameState("waiting");
    setWinner(null);
    setTooEarly(null);
    setReactionTimes({ player1: 0, player2: 0 });
    player1TimeRef.current = null;
    player2TimeRef.current = null;
  }, []);

  const startRound = useCallback(() => {
    if (!isPlaying) return;
    
    resetRound();
    setGameState("ready");

    // Random delay between 2-5 seconds
    const delay = 2000 + Math.random() * 3000;
    timeoutRef.current = setTimeout(() => {
      goTimeRef.current = performance.now();
      setGameState("go");
    }, delay);
  }, [isPlaying, resetRound]);

  useEffect(() => {
    if (isPlaying) {
      setScores({ player1: 0, player2: 0 });
      onScoreChange(0, 0);
      startRound();
    } else {
      resetRound();
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isPlaying, startRound, resetRound, onScoreChange]);

  const handlePlayerReaction = useCallback((player: 1 | 2) => {
    if (!isPlaying) return;

    if (gameState === "ready") {
      // Too early!
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setTooEarly(player);
      setGameState("result");

      const otherPlayer = player === 1 ? 2 : 1;
      const newScores = {
        ...scores,
        [`player${otherPlayer}`]: scores[`player${otherPlayer}` as keyof typeof scores] + 1,
      };
      setScores(newScores);
      onScoreChange(newScores.player1, newScores.player2);

      if (newScores[`player${otherPlayer}` as keyof typeof newScores] >= WIN_SCORE) {
        setTimeout(() => {
          onGameOver(`PLAYER ${otherPlayer} WINS!`);
        }, 1500);
      } else {
        setTimeout(startRound, 2000);
      }
      return;
    }

    if (gameState === "go") {
      const reactionTime = performance.now() - goTimeRef.current;
      
      if (player === 1 && player1TimeRef.current === null) {
        player1TimeRef.current = reactionTime;
        setReactionTimes((prev) => ({ ...prev, player1: reactionTime }));
      } else if (player === 2 && player2TimeRef.current === null) {
        player2TimeRef.current = reactionTime;
        setReactionTimes((prev) => ({ ...prev, player2: reactionTime }));
      }

      // First valid reaction wins
      if (winner === null) {
        setWinner(player);
        setGameState("result");

        const newScores = {
          ...scores,
          [`player${player}`]: scores[`player${player}` as keyof typeof scores] + 1,
        };
        setScores(newScores);
        onScoreChange(newScores.player1, newScores.player2);

        if (newScores[`player${player}` as keyof typeof newScores] >= WIN_SCORE) {
          setTimeout(() => {
            onGameOver(`PLAYER ${player} WINS!`);
          }, 1500);
        } else {
          setTimeout(startRound, 2000);
        }
      }
    }
  }, [isPlaying, gameState, winner, scores, onScoreChange, onGameOver, startRound]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying || gameState === "result" || gameState === "waiting") return;

      if (e.key.toLowerCase() === "q") {
        e.preventDefault();
        handlePlayerReaction(1);
      } else if (e.key.toLowerCase() === "p") {
        e.preventDefault();
        handlePlayerReaction(2);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, gameState, handlePlayerReaction]);

  const getStateColor = () => {
    switch (gameState) {
      case "waiting":
        return "bg-muted";
      case "ready":
        return "bg-destructive/20";
      case "go":
        return "bg-neon-green/20";
      case "result":
        return tooEarly ? "bg-destructive/20" : "bg-primary/20";
    }
  };

  const getStateText = () => {
    switch (gameState) {
      case "waiting":
        return "GET READY...";
      case "ready":
        return "WAIT FOR GREEN...";
      case "go":
        return "GO! GO! GO!";
      case "result":
        if (tooEarly) {
          return `PLAYER ${tooEarly} WAS TOO EARLY!`;
        }
        return `PLAYER ${winner} WINS THE ROUND!`;
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl">
      {/* Main Signal Area */}
      <div
        className={cn(
          "h-full w-[360px] rounded-xl flex items-center justify-center transition-all duration-300",
          "border-2",
          getStateColor(),
          gameState === "ready" && "border-destructive animate-pulse",
          gameState === "go" && "border-neon-green neon-border-cyan ",
          gameState === "result" && (tooEarly ? "border-destructive" : "border-primary")
        )}
      >
        <div className="text-center p-8">
          <h2
            className={cn(
              "font-gaming text-2xl md:text-4xl mb-4",
              gameState === "go" && "text-neon-green animate-pulse",
              gameState === "result" && !tooEarly && "text-primary",
              gameState === "result" && tooEarly && "text-destructive"
            )}
          >
            {getStateText()}
          </h2>

          {/* Reaction Times */}
          {gameState === "result" && winner && (
            <div className="font-gaming text-lg text-muted-foreground">
              {reactionTimes.player1 > 0 && (
                <span className="text-primary mr-4">
                  P1: {reactionTimes.player1.toFixed(0)}ms
                </span>
              )}
              {reactionTimes.player2 > 0 && (
                <span className="text-accent">
                  P2: {reactionTimes.player2.toFixed(0)}ms
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Player Buttons */}
      <div className="grid grid-cols-2 gap-8 w-full">
        <button
          onClick={() => handlePlayerReaction(1)}
          disabled={gameState === "result" || gameState === "waiting"}
          className={cn(
            "aspect-square rounded-xl font-gaming text-xl transition-all duration-200",
            "border-2 border-primary/50",
            "bg-primary/10 text-primary",
            "hover:bg-primary hover:text-primary-foreground",
            "active:scale-95",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "focus:outline-none focus:ring-2 focus:ring-primary"
          )}
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-4xl">Q</span>
            <span className="text-sm">PLAYER 1</span>
          </div>
        </button>

        <button
          onClick={() => handlePlayerReaction(2)}
          disabled={gameState === "result" || gameState === "waiting"}
          className={cn(
            "aspect-square rounded-xl font-gaming text-xl transition-all duration-200",
            "border-2 border-accent/50",
            "bg-accent/10 text-accent",
            "hover:bg-accent hover:text-accent-foreground",
            "active:scale-95",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "focus:outline-none focus:ring-2 focus:ring-accent"
          )}
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-4xl">P</span>
            <span className="text-sm">PLAYER 2</span>
          </div>
        </button>
      </div>

      {/* Instructions */}
      <div className="text-center text-sm text-muted-foreground font-gaming">
        <span className="text-primary">P1:</span> Q key &nbsp;|&nbsp;{" "}
        <span className="text-accent">P2:</span> P key
        <br />
        <span className="text-muted-foreground">First to {WIN_SCORE} points wins!</span>
      </div>
    </div>
  );
};

export { ReactionGame };
