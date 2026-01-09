import { useState, useCallback } from "react";
import { useParams, Navigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { GameHUD } from "@/components/games/GameHUD";
import { getGameBySlug } from "@/data/games";
import { SnakeGame } from "@/components/games/SnakeGame";
import { PongGame } from "@/components/games/PongGame";
import { TicTacToeGame } from "@/components/games/TicTacToeGame";
import { MemoryGame } from "@/components/games/MemoryGame";
import { FlappyGame } from "@/components/games/FlappyGame";
import { ReactionGame } from "@/components/games/ReactionGame";
import { cn } from "@/lib/utils";
import "./GamePage.css"

const GamePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const game = slug ? getGameBySlug(slug) : undefined;

  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<string | undefined>();
  const [scores, setScores] = useState({
    solo: 0,
    player1: 0,
    player2: 0,
  });
  const [mode, setMode] = useState<"solo" | "multiplayer">(
    game?.mode === "multiplayer" ? "multiplayer" : "solo"
  );

  if (!game || !game.available) {
    return <Navigate to="/games" replace />;
  }

  const handlePlay = () => {
    if (gameOver) {
      handleRestart();
    } else {
      setIsPlaying(true);
      setIsPaused(false);
    }
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleRestart = () => {
    setIsPlaying(false);
    setIsPaused(false);
    setGameOver(false);
    setWinner(undefined);
    setScores({ solo: 0, player1: 0, player2: 0 });
    setTimeout(() => setIsPlaying(true), 100);
  };

  const handleScoreChange = useCallback((p1: number, p2?: number) => {
    if (p2 !== undefined) {
      setScores((prev) => ({ ...prev, player1: p1, player2: p2 }));
    } else {
      setScores((prev) => ({ ...prev, solo: p1 }));
    }
  }, []);

  const handleGameOver = useCallback((winnerText?: string) => {
    setGameOver(true);
    setIsPlaying(false);
    if (winnerText) {
      setWinner(winnerText);
    }
  }, []);

  const renderGame = () => {
    switch (game.slug) {
      case "snake":
        return (
          <SnakeGame
            isPlaying={isPlaying}
            isPaused={isPaused}
            onScoreChange={(score) => handleScoreChange(score)}
            onGameOver={() => handleGameOver()}
          />
        );
      case "pong":
        return (
          <PongGame
            isPlaying={isPlaying}
            isPaused={isPaused}
            onScoreChange={handleScoreChange}
            onGameOver={handleGameOver}
          />
        );
      case "tictactoe":
        return (
          <TicTacToeGame
            isPlaying={isPlaying}
            onScoreChange={handleScoreChange}
            onGameOver={handleGameOver}
          />
        );
      case "memory":
        return (
          <MemoryGame
            isPlaying={isPlaying}
            mode={mode}
            onScoreChange={handleScoreChange}
            onGameOver={handleGameOver}
          />
        );
      case "flappy":
        return (
          <FlappyGame
            isPlaying={isPlaying}
            isPaused={isPaused}
            onScoreChange={(score) => handleScoreChange(score)}
            onGameOver={() => handleGameOver()}
          />
        );
      case "reaction":
        return (
          <ReactionGame
            isPlaying={isPlaying}
            onScoreChange={handleScoreChange}
            onGameOver={handleGameOver}
          />
        );
      default:
        return (
          <div className="text-center text-muted-foreground font-gaming">
            Game not available
          </div>
        );
    }
  };

  const showModeSelector = game.mode === "both";

  return (
    <Layout showFooter={false} >
      <section className="py-6 md:py-8 min-h-[calc(100vh-5rem)] " id="gameP">
        <div className="container mx-auto px-4 max-w-4xl ">
          {/* Mode Selector */}
          {showModeSelector && !isPlaying && (
            <div className="flex justify-center mb-6">
              <div className="inline-flex glass-card rounded-lg p-1">
                <button
                  onClick={() => setMode("solo")}
                  className={cn(
                    "px-4 py-2 font-gaming text-xs tracking-wider rounded-md transition-all duration-300",
                    mode === "solo"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  SOLO
                </button>
                <button
                  onClick={() => setMode("multiplayer")}
                  className={cn(
                    "px-4 py-2 font-gaming text-xs tracking-wider rounded-md transition-all duration-300",
                    mode === "multiplayer"
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  2 PLAYERS
                </button>
              </div>
            </div>
          )}

          {/* HUD */}
          <GameHUD
            title={game.title}
            scores={mode === "solo" ? { solo: scores.solo } : { player1: scores.player1, player2: scores.player2 }}
            isPlaying={isPlaying}
            isPaused={isPaused}
            onPlay={handlePlay}
            onPause={handlePause}
            onRestart={handleRestart}
            mode={game.mode === "multiplayer" ? "multiplayer" : mode}
            gameOver={gameOver}
            winner={winner}
          />

          {/* Game Area */}
          <div className="mt-6 flex justify-center">
            <div className="glass-card rounded-xl p-6 md:p-8 ms:ml-10">
              {renderGame()}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default GamePage;
