import { useEffect, useRef, useCallback } from "react";

interface FlappyGameProps {
  isPlaying: boolean;
  isPaused: boolean;
  onScoreChange: (score: number) => void;
  onGameOver: () => void;
}

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 600;
const BIRD_SIZE = 30;
const PIPE_WIDTH = 60;
const PIPE_GAP = 180;
const GRAVITY = 0.5;
const JUMP_FORCE = -10;
const PIPE_SPEED = 3;

interface Pipe {
  x: number;
  topHeight: number;
  passed: boolean;
}

const FlappyGame = ({ isPlaying, isPaused, onScoreChange, onGameOver }: FlappyGameProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef({
    birdY: CANVAS_HEIGHT / 2,
    birdVelocity: 0,
    pipes: [] as Pipe[],
    score: 0,
    frameCount: 0,
  });
  const animationRef = useRef<number>();

  const resetGame = useCallback(() => {
    gameRef.current = {
      birdY: CANVAS_HEIGHT / 2,
      birdVelocity: 0,
      pipes: [],
      score: 0,
      frameCount: 0,
    };
    onScoreChange(0);
  }, [onScoreChange]);

  useEffect(() => {
    if (!isPlaying) {
      resetGame();
    }
  }, [isPlaying, resetGame]);

  const jump = useCallback(() => {
    if (isPlaying && !isPaused) {
      gameRef.current.birdVelocity = JUMP_FORCE;
    }
  }, [isPlaying, isPaused]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        jump();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [jump]);

  useEffect(() => {
    if (!isPlaying || isPaused) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const gameLoop = () => {
      const game = gameRef.current;

      // Update bird
      game.birdVelocity += GRAVITY;
      game.birdY += game.birdVelocity;

      // Check bounds
      if (game.birdY < 0 || game.birdY > CANVAS_HEIGHT - BIRD_SIZE) {
        onGameOver();
        return;
      }

      // Spawn pipes
      game.frameCount++;
      if (game.frameCount % 100 === 0) {
        const topHeight = Math.random() * (CANVAS_HEIGHT - PIPE_GAP - 100) + 50;
        game.pipes.push({
          x: CANVAS_WIDTH,
          topHeight,
          passed: false,
        });
      }

      // Update pipes
      game.pipes = game.pipes.filter((pipe) => pipe.x > -PIPE_WIDTH);
      game.pipes.forEach((pipe) => {
        pipe.x -= PIPE_SPEED;

        // Check collision
        const birdRight = 50 + BIRD_SIZE;
        const birdLeft = 50;
        const birdTop = game.birdY;
        const birdBottom = game.birdY + BIRD_SIZE;

        if (
          birdRight > pipe.x &&
          birdLeft < pipe.x + PIPE_WIDTH
        ) {
          if (birdTop < pipe.topHeight || birdBottom > pipe.topHeight + PIPE_GAP) {
            onGameOver();
            return;
          }
        }

        // Score
        if (!pipe.passed && pipe.x + PIPE_WIDTH < 50) {
          pipe.passed = true;
          game.score++;
          onScoreChange(game.score);
        }
      });

      // Draw
      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
      gradient.addColorStop(0, "hsl(260, 30%, 8%)");
      gradient.addColorStop(1, "hsl(240, 20%, 4%)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Grid effect
      ctx.strokeStyle = "hsl(185, 100%, 50%, 0.05)";
      ctx.lineWidth = 1;
      for (let i = 0; i < CANVAS_WIDTH; i += 30) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, CANVAS_HEIGHT);
        ctx.stroke();
      }
      for (let i = 0; i < CANVAS_HEIGHT; i += 30) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(CANVAS_WIDTH, i);
        ctx.stroke();
      }

      // Pipes
      game.pipes.forEach((pipe) => {
        // Top pipe
        ctx.fillStyle = "hsl(155, 100%, 50%)";
        ctx.shadowColor = "hsl(155, 100%, 50%)";
        ctx.shadowBlur = 15;
        ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight);
        
        // Bottom pipe
        ctx.fillRect(
          pipe.x,
          pipe.topHeight + PIPE_GAP,
          PIPE_WIDTH,
          CANVAS_HEIGHT - pipe.topHeight - PIPE_GAP
        );

        // Pipe edges
        ctx.fillStyle = "hsl(155, 100%, 40%)";
        ctx.fillRect(pipe.x - 5, pipe.topHeight - 20, PIPE_WIDTH + 10, 20);
        ctx.fillRect(pipe.x - 5, pipe.topHeight + PIPE_GAP, PIPE_WIDTH + 10, 20);
      });

      // Bird
      ctx.fillStyle = "hsl(185, 100%, 50%)";
      ctx.shadowColor = "hsl(185, 100%, 50%)";
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.arc(50 + BIRD_SIZE / 2, game.birdY + BIRD_SIZE / 2, BIRD_SIZE / 2, 0, Math.PI * 2);
      ctx.fill();

      // Bird eye
      ctx.fillStyle = "hsl(240, 20%, 4%)";
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.arc(50 + BIRD_SIZE / 2 + 5, game.birdY + BIRD_SIZE / 2 - 3, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.shadowBlur = 0;

      animationRef.current = requestAnimationFrame(gameLoop);
    };

    animationRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, isPaused, onScoreChange, onGameOver]);

  return (
    <div className="flex flex-col items-center gap-4">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        onClick={jump}
        className="rounded-lg border border-border cursor-pointer max-w-full"
        style={{ maxWidth: "100%", height: "auto" }}
      />
      <div className="text-center text-sm text-muted-foreground font-gaming">
        Press <span className="text-primary">SPACE</span> or{" "}
        <span className="text-primary">CLICK</span> to flap
      </div>
    </div>
  );
};

export { FlappyGame };
