import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

interface MemoryGameProps {
  isPlaying: boolean;
  mode: "solo" | "multiplayer";
  onScoreChange: (p1: number, p2?: number) => void;
  onGameOver: (winner: string) => void;
}

const EMOJIS = ["🎮", "🕹️", "🎯", "🎲", "🃏", "🎪", "🎨", "🎭"];

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const MemoryGame = ({ isPlaying, mode, onScoreChange, onGameOver }: MemoryGameProps) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
  const [scores, setScores] = useState({ player1: 0, player2: 0 });
  const [isChecking, setIsChecking] = useState(false);

  const initializeGame = useCallback(() => {
    const shuffledEmojis = [...EMOJIS, ...EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(shuffledEmojis);
    setFlippedCards([]);
    setCurrentPlayer(1);
    setScores({ player1: 0, player2: 0 });
    if (mode === "solo") {
      onScoreChange(0);
    } else {
      onScoreChange(0, 0);
    }
  }, [mode, onScoreChange]);

  useEffect(() => {
    if (isPlaying) {
      initializeGame();
    }
  }, [isPlaying, initializeGame]);

  const handleCardClick = (id: number) => {
    if (!isPlaying || isChecking) return;
    
    const card = cards.find((c) => c.id === id);
    if (!card || card.isFlipped || card.isMatched || flippedCards.length >= 2) return;

    const newCards = cards.map((c) =>
      c.id === id ? { ...c, isFlipped: true } : c
    );
    setCards(newCards);

    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setIsChecking(true);
      const [first, second] = newFlipped;
      const firstCard = newCards.find((c) => c.id === first);
      const secondCard = newCards.find((c) => c.id === second);

      if (firstCard?.emoji === secondCard?.emoji) {
        // Match found
        setTimeout(() => {
          const matchedCards = newCards.map((c) =>
            c.id === first || c.id === second ? { ...c, isMatched: true } : c
          );
          setCards(matchedCards);
          setFlippedCards([]);

          const newScores = {
            ...scores,
            [`player${currentPlayer}`]: scores[`player${currentPlayer}` as keyof typeof scores] + 1,
          };
          setScores(newScores);

          if (mode === "solo") {
            onScoreChange(newScores.player1);
          } else {
            onScoreChange(newScores.player1, newScores.player2);
          }

          // Check if game is over
          if (matchedCards.every((c) => c.isMatched)) {
            if (mode === "solo") {
              onGameOver(`YOU FOUND ALL PAIRS!`);
            } else {
              const winner =
                newScores.player1 > newScores.player2
                  ? "PLAYER 1 WINS!"
                  : newScores.player2 > newScores.player1
                  ? "PLAYER 2 WINS!"
                  : "IT'S A TIE!";
              onGameOver(winner);
            }
          }
          setIsChecking(false);
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setCards(newCards.map((c) =>
            c.id === first || c.id === second ? { ...c, isFlipped: false } : c
          ));
          setFlippedCards([]);
          if (mode === "multiplayer") {
            setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
          }
          setIsChecking(false);
        }, 1000);
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Current Player / Mode Indicator */}
      {mode === "multiplayer" && (
        <div className="font-gaming text-lg">
          <span className={currentPlayer === 1 ? "text-primary" : "text-accent"}>
            PLAYER {currentPlayer}
          </span>
          <span className="text-muted-foreground">'S TURN</span>
        </div>
      )}

      {/* Cards Grid */}
      <div className="grid grid-cols-4 gap-3 p-4 glass-card rounded-xl">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            disabled={!isPlaying || card.isFlipped || card.isMatched}
            className={cn(
              "w-16 h-16 md:w-20 md:h-20 rounded-lg",
              "font-gaming text-2xl md:text-3xl",
              "transition-all duration-300 transform",
              "border border-border",
              card.isFlipped || card.isMatched
                ? "bg-muted rotate-0"
                : "bg-secondary hover:bg-muted cursor-pointer",
              card.isMatched && "opacity-50",
              !card.isFlipped && !card.isMatched && "hover:scale-105"
            )}
            style={{
              transform: card.isFlipped || card.isMatched ? "rotateY(0)" : "rotateY(180deg)",
            }}
          >
            {(card.isFlipped || card.isMatched) && (
              <span className="block animate-scale-in">{card.emoji}</span>
            )}
          </button>
        ))}
      </div>

      {/* Instructions */}
      <div className="text-center text-sm text-muted-foreground font-gaming">
        Click cards to reveal and match pairs
      </div>
    </div>
  );
};

export { MemoryGame };
