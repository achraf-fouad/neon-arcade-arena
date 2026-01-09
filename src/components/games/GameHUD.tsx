import { cn } from "@/lib/utils";
import { NeonButton } from "../ui/NeonButton";
import { Play, Pause, RotateCcw, Home } from "lucide-react";
import { Link } from "react-router-dom";

interface GameHUDProps {
  title: string;
  scores?: {
    player1?: number;
    player2?: number;
    solo?: number;
  };
  isPlaying: boolean;
  isPaused: boolean;
  onPlay: () => void;
  onPause: () => void;
  onRestart: () => void;
  mode: "solo" | "multiplayer";
  timer?: number;
  gameOver?: boolean;
  winner?: string;
  className?: string;
}

const GameHUD = ({
  title,
  scores,
  isPlaying,
  isPaused,
  onPlay,
  onPause,
  onRestart,
  mode,
  timer,
  gameOver,
  winner,
  className,
}: GameHUDProps) => {
  return (
    <div className={cn("w-full", className)}>
      {/* Top Bar */}
      <div className="glass-card rounded-xl p-4 mb-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Back Button & Title */}
          <div className="flex items-center gap-4">
            <Link to="/games">
              <NeonButton variant="ghost" size="sm">
                <Home className="w-4 h-4" />
              </NeonButton>
            </Link>
            <h1 className="font-gaming text-xl md:text-2xl text-primary">
              {title}
            </h1>
          </div>

          {/* Timer if applicable */}
          {timer !== undefined && (
            <div className="font-gaming text-2xl text-foreground">
              {Math.floor(timer / 60)}:
              {(timer % 60).toString().padStart(2, "0")}
            </div>
          )}

          
          
        </div>
      </div>

      {/* Scores Bar */}
      <div className="glass-card rounded-xl p-4">
        <div className="flex items-center justify-center gap-8">
          {mode === "solo" ? (
            <div className="text-center">
              <div className="text-sm text-muted-foreground font-gaming mb-1">
                SCORE
              </div>
              <div className="font-gaming text-4xl text-primary">
                {scores?.solo ?? 0}
              </div>
            </div>
          ) : (
            <>
              <div className="text-center flex-1">
                <div className="text-sm text-primary font-gaming mb-1">
                  PLAYER 1
                </div>
                <div className="font-gaming text-4xl text-foreground">
                  {scores?.player1 ?? 0}
                </div>
              </div>
              <div className="font-gaming text-2xl text-muted-foreground">
                VS
              </div>
              <div className="text-center flex-1">
                <div className="text-sm text-accent font-gaming mb-1">
                  PLAYER 2
                </div>
                <div className="font-gaming text-4xl text-foreground">
                  {scores?.player2 ?? 0}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      {/* Controls */}
      <div className="flex justify-center gap-2 mx-auto mt-4">
        {!isPlaying || isPaused ? (
          <NeonButton variant="primary" size="sm" onClick={onPlay} className="rounded-xl">
            <Play className="w-4 h-4 mr-1 " /> PLAY
          </NeonButton>
        ) : (
          <NeonButton variant="ghost" size="sm" className="rounded-xl" onClick={onPause}>
            <Pause className="w-4 h-4 mr-1" /> PAUSE
          </NeonButton>
        )}
        <NeonButton variant="ghost" size="sm" className="rounded-xl" onClick={onRestart}>
          <RotateCcw className="w-4 h-4" />
        </NeonButton>
      </div>

      {/* Game Over Overlay */}
      {gameOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm">
          <div className="glass-card neon-border-cyan rounded-2xl p-8 text-center animate-scale-in max-w-md mx-4">
            <h2 className="font-gaming text-3xl md:text-4xl mb-4 text-primary">
              GAME OVER
            </h2>
            {winner && (
              <p className="font-gaming text-xl mb-6 text-accent">{winner}</p>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <NeonButton variant="primary" size="lg" onClick={onRestart}>
                PLAY AGAIN
              </NeonButton>
              <Link to="/games">
                <NeonButton variant="ghost" size="lg">
                  BACK TO GAMES
                </NeonButton>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { GameHUD };
