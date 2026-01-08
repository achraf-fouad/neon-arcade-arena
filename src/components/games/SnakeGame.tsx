import { useEffect, useRef, useState, useCallback } from "react";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";

interface SnakeGameProps {
  isPlaying: boolean;
  isPaused: boolean;
  onScoreChange: (score: number) => void;
  onGameOver: () => void;
}

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 150;

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Position = { x: number; y: number };

const SnakeGame = ({
  isPlaying,
  isPaused,
  onScoreChange,
  onGameOver,
}: SnakeGameProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number>();
  const directionRef = useRef<Direction>("RIGHT");

  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Direction>("RIGHT");
  const [score, setScore] = useState(0);

  /* ======================
     HELPERS
  ====================== */

  const generateFood = useCallback((snakeBody: Position[]): Position => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (
      snakeBody.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      )
    );
    return newFood;
  }, []);

  const resetGame = useCallback(() => {
    const initialSnake = [{ x: 10, y: 10 }];
    setSnake(initialSnake);
    setFood(generateFood(initialSnake));
    setDirection("RIGHT");
    directionRef.current = "RIGHT";
    setScore(0);
    onScoreChange(0);
  }, [generateFood, onScoreChange]);

  const changeDirection = useCallback((newDirection: Direction) => {
    const current = directionRef.current;

    const isOpposite =
      (current === "UP" && newDirection === "DOWN") ||
      (current === "DOWN" && newDirection === "UP") ||
      (current === "LEFT" && newDirection === "RIGHT") ||
      (current === "RIGHT" && newDirection === "LEFT");

    if (!isOpposite) {
      directionRef.current = newDirection;
      setDirection(newDirection);
    }
  }, []);

  /* ======================
     GAME STATE
  ====================== */

  useEffect(() => {
    if (!isPlaying) resetGame();
  }, [isPlaying, resetGame]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying || isPaused) return;

      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          changeDirection("UP");
          break;
        case "ArrowDown":
          e.preventDefault();
          changeDirection("DOWN");
          break;
        case "ArrowLeft":
          e.preventDefault();
          changeDirection("LEFT");
          break;
        case "ArrowRight":
          e.preventDefault();
          changeDirection("RIGHT");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, isPaused, changeDirection]);

  useEffect(() => {
    if (!isPlaying || isPaused) {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
      return;
    }

    const moveSnake = () => {
      setSnake((prev) => {
        const head = { ...prev[0] };

        switch (directionRef.current) {
          case "UP":
            head.y--;
            break;
          case "DOWN":
            head.y++;
            break;
          case "LEFT":
            head.x--;
            break;
          case "RIGHT":
            head.x++;
            break;
        }

        // Wall collision
        if (
          head.x < 0 ||
          head.y < 0 ||
          head.x >= GRID_SIZE ||
          head.y >= GRID_SIZE
        ) {
          onGameOver();
          return prev;
        }

        // Self collision
        if (prev.some((s) => s.x === head.x && s.y === head.y)) {
          onGameOver();
          return prev;
        }

        const newSnake = [head, ...prev];

        // Food collision
        if (head.x === food.x && head.y === food.y) {
          const newScore = score + 10;
          setScore(newScore);
          onScoreChange(newScore);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    gameLoopRef.current = window.setInterval(moveSnake, INITIAL_SPEED);
    return () => clearInterval(gameLoopRef.current);
  }, [
    isPlaying,
    isPaused,
    food,
    score,
    generateFood,
    onGameOver,
    onScoreChange,
  ]);

  /* ======================
     DRAW
  ====================== */

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "hsl(240, 20%, 6%)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid
    ctx.strokeStyle = "hsl(240, 20%, 12%)";
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, GRID_SIZE * CELL_SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(GRID_SIZE * CELL_SIZE, i * CELL_SIZE);
      ctx.stroke();
    }

    // Snake
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? "hsl(185,100%,50%)" : "hsl(185,100%,40%)";
      ctx.shadowColor = "hsl(185,100%,50%)";
      ctx.shadowBlur = index === 0 ? 15 : 10;
      ctx.fillRect(
        segment.x * CELL_SIZE + 1,
        segment.y * CELL_SIZE + 1,
        CELL_SIZE - 2,
        CELL_SIZE - 2
      );
    });

    // Food
    ctx.fillStyle = "hsl(300,100%,50%)";
    ctx.shadowColor = "hsl(300,100%,50%)";
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(
      food.x * CELL_SIZE + CELL_SIZE / 2,
      food.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 2 - 2,
      0,
      Math.PI * 2
    );
    ctx.fill();

    ctx.shadowBlur = 0;
  }, [snake, food]);

  /* ======================
     UI
  ====================== */

  return (
    <div className="flex flex-col items-center gap-4">
      <canvas
        ref={canvasRef}
        width={GRID_SIZE * CELL_SIZE}
        height={GRID_SIZE * CELL_SIZE}
        className="rounded-lg border neon-border-cyan"
      />

      {/* Mobile Controls */}
      <div className="flex flex-col items-center gap-2 md:hidden">
        <button onClick={() => changeDirection("UP")}>
          <ArrowUp className="bg-black rounded-lg neon-border-cyan w-10"/>
        </button>

        <div className="flex gap-2">
          <button onClick={() => changeDirection("LEFT")}>
            <ArrowLeft className="bg-black rounded-lg neon-border-cyan w-10"/>
          </button>
          <button onClick={() => changeDirection("DOWN")}>
            <ArrowDown className="bg-black rounded-lg neon-border-cyan w-10"/>
          </button>
          <button onClick={() => changeDirection("RIGHT")}>
            <ArrowRight className="bg-black rounded-lg neon-border-cyan w-10"/>
          </button>
        </div>
      </div>

      <p className="text-sm text-muted-foreground font-gaming">
        Use <span className="text-primary">ARROW KEYS</span> or buttons
      </p>
    </div>
  );
};

export { SnakeGame };
