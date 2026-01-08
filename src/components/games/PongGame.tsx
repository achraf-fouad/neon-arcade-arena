import { useEffect, useRef, useCallback } from "react";

interface PongGameProps {
  isPlaying: boolean;
  isPaused: boolean;
  onScoreChange: (p1: number, p2: number) => void;
  onGameOver: (winner: string) => void;
}

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;
const PADDLE_HEIGHT = 80;
const PADDLE_WIDTH = 10;
const BALL_SIZE = 10;
const PADDLE_SPEED = 8;
const BALL_SPEED = 5;
const WIN_SCORE = 10;

const PongGame = ({ isPlaying, isPaused, onScoreChange, onGameOver }: PongGameProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef({
    paddle1Y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    paddle2Y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    ballX: CANVAS_WIDTH / 2,
    ballY: CANVAS_HEIGHT / 2,
    ballVX: BALL_SPEED,
    ballVY: BALL_SPEED * 0.5,
    score1: 0,
    score2: 0,
    keys: {} as Record<string, boolean>,
  });
  const animationRef = useRef<number>();

  const resetBall = useCallback((direction: number) => {
    gameRef.current.ballX = CANVAS_WIDTH / 2;
    gameRef.current.ballY = CANVAS_HEIGHT / 2;
    gameRef.current.ballVX = BALL_SPEED * direction;
    gameRef.current.ballVY = (Math.random() - 0.5) * BALL_SPEED;
  }, []);

  const resetGame = useCallback(() => {
    gameRef.current = {
      paddle1Y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
      paddle2Y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
      ballX: CANVAS_WIDTH / 2,
      ballY: CANVAS_HEIGHT / 2,
      ballVX: BALL_SPEED,
      ballVY: BALL_SPEED * 0.5,
      score1: 0,
      score2: 0,
      keys: {},
    };
    onScoreChange(0, 0);
  }, [onScoreChange]);

  useEffect(() => {
    if (!isPlaying) {
      resetGame();
    }
  }, [isPlaying, resetGame]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["w", "s", "ArrowUp", "ArrowDown"].includes(e.key)) {
        e.preventDefault();
        gameRef.current.keys[e.key] = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      gameRef.current.keys[e.key] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

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

      // Handle paddle movement
      if (game.keys["w"] && game.paddle1Y > 0) {
        game.paddle1Y -= PADDLE_SPEED;
      }
      if (game.keys["s"] && game.paddle1Y < CANVAS_HEIGHT - PADDLE_HEIGHT) {
        game.paddle1Y += PADDLE_SPEED;
      }
      if (game.keys["ArrowUp"] && game.paddle2Y > 0) {
        game.paddle2Y -= PADDLE_SPEED;
      }
      if (game.keys["ArrowDown"] && game.paddle2Y < CANVAS_HEIGHT - PADDLE_HEIGHT) {
        game.paddle2Y += PADDLE_SPEED;
      }

      // Move ball
      game.ballX += game.ballVX;
      game.ballY += game.ballVY;

      // Top/bottom collision
      if (game.ballY <= 0 || game.ballY >= CANVAS_HEIGHT - BALL_SIZE) {
        game.ballVY *= -1;
      }

      // Paddle 1 collision
      if (
        game.ballX <= PADDLE_WIDTH + 20 &&
        game.ballY + BALL_SIZE >= game.paddle1Y &&
        game.ballY <= game.paddle1Y + PADDLE_HEIGHT
      ) {
        game.ballVX = Math.abs(game.ballVX) * 1.05;
        const hitPos = (game.ballY - game.paddle1Y) / PADDLE_HEIGHT - 0.5;
        game.ballVY = hitPos * BALL_SPEED * 2;
      }

      // Paddle 2 collision
      if (
        game.ballX >= CANVAS_WIDTH - PADDLE_WIDTH - 20 - BALL_SIZE &&
        game.ballY + BALL_SIZE >= game.paddle2Y &&
        game.ballY <= game.paddle2Y + PADDLE_HEIGHT
      ) {
        game.ballVX = -Math.abs(game.ballVX) * 1.05;
        const hitPos = (game.ballY - game.paddle2Y) / PADDLE_HEIGHT - 0.5;
        game.ballVY = hitPos * BALL_SPEED * 2;
      }

      // Score
      if (game.ballX < 0) {
        game.score2++;
        onScoreChange(game.score1, game.score2);
        if (game.score2 >= WIN_SCORE) {
          onGameOver("PLAYER 2 WINS!");
          return;
        }
        resetBall(1);
      }
      if (game.ballX > CANVAS_WIDTH) {
        game.score1++;
        onScoreChange(game.score1, game.score2);
        if (game.score1 >= WIN_SCORE) {
          onGameOver("PLAYER 1 WINS!");
          return;
        }
        resetBall(-1);
      }

      // Draw
      ctx.fillStyle = "hsl(240, 20%, 6%)";
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Center line
      ctx.setLineDash([10, 10]);
      ctx.strokeStyle = "hsl(240, 20%, 20%)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(CANVAS_WIDTH / 2, 0);
      ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT);
      ctx.stroke();
      ctx.setLineDash([]);

      // Paddles
      ctx.fillStyle = "hsl(185, 100%, 50%)";
      ctx.shadowColor = "hsl(185, 100%, 50%)";
      ctx.shadowBlur = 15;
      ctx.fillRect(20, game.paddle1Y, PADDLE_WIDTH, PADDLE_HEIGHT);

      ctx.fillStyle = "hsl(300, 100%, 50%)";
      ctx.shadowColor = "hsl(300, 100%, 50%)";
      ctx.fillRect(CANVAS_WIDTH - 20 - PADDLE_WIDTH, game.paddle2Y, PADDLE_WIDTH, PADDLE_HEIGHT);

      // Ball
      ctx.fillStyle = "hsl(155, 100%, 50%)";
      ctx.shadowColor = "hsl(155, 100%, 50%)";
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.arc(game.ballX + BALL_SIZE / 2, game.ballY + BALL_SIZE / 2, BALL_SIZE / 2, 0, Math.PI * 2);
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
  }, [isPlaying, isPaused, onScoreChange, onGameOver, resetBall]);

  return (
    <div className="flex flex-col items-center gap-4">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="rounded-lg border border-border max-w-full"
        style={{ maxWidth: "100%", height: "auto" }}
      />
      <div className="flex justify-center gap-8 text-sm text-muted-foreground font-gaming">
        <span>
          <span className="text-primary">P1:</span> W / S
        </span>
        <span>
          <span className="text-accent">P2:</span> ↑ / ↓
        </span>
      </div>
    </div>
  );
};

export { PongGame };
