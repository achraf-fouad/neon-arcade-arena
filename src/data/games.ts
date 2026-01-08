export interface Game {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
  mode: "solo" | "multiplayer" | "both";
  controls: {
    solo?: string[];
    player1?: string[];
    player2?: string[];
  };
  available: boolean;
}

export const games: Game[] = [
  {
    id: "snake",
    title: "SNAKE",
    slug: "snake",
    description: "Classic snake game. Eat, grow, survive! How long can you last?",
    icon: "🐍",
    mode: "solo",
    controls: {
      solo: ["Arrow keys to move"],
    },
    available: true,
  },
  {
    id: "pong",
    title: "PONG",
    slug: "pong",
    description: "The legendary arcade game. First to 10 points wins!",
    icon: "🏓",
    mode: "multiplayer",
    controls: {
      player1: ["W / S keys"],
      player2: ["↑ / ↓ arrows"],
    },
    available: true,
  },
  {
    id: "tictactoe",
    title: "TIC-TAC-TOE",
    slug: "tictactoe",
    description: "Strategic X and O battle. Outsmart your opponent!",
    icon: "⭕",
    mode: "multiplayer",
    controls: {
      player1: ["Click to place X"],
      player2: ["Click to place O"],
    },
    available: true,
  },
  {
    id: "memory",
    title: "MEMORY",
    slug: "memory",
    description: "Match the pairs! Test your memory and concentration.",
    icon: "🧠",
    mode: "both",
    controls: {
      solo: ["Click cards to flip"],
      player1: ["Click cards on your turn"],
      player2: ["Click cards on your turn"],
    },
    available: true,
  },
  {
    id: "flappy",
    title: "FLAPPY NEON",
    slug: "flappy",
    description: "Navigate through neon pipes. One tap, infinite challenge!",
    icon: "🐦",
    mode: "solo",
    controls: {
      solo: ["Space / Click to flap"],
    },
    available: true,
  },
  {
    id: "reaction",
    title: "REACTION DUEL",
    slug: "reaction",
    description: "Lightning fast reflexes! First to click when the signal appears wins.",
    icon: "⚡",
    mode: "multiplayer",
    controls: {
      player1: ["Q key to react"],
      player2: ["P key to react"],
    },
    available: true,
  },
  {
    id: "quiz",
    title: "NEON QUIZ",
    slug: "quiz",
    description: "Test your knowledge! Answer fast, score high.",
    icon: "❓",
    mode: "both",
    controls: {
      solo: ["Click answer"],
      player1: ["1-4 keys"],
      player2: ["7-0 keys"],
    },
    available: false,
  },
];

export const getGameBySlug = (slug: string): Game | undefined => {
  return games.find((game) => game.slug === slug);
};

export const getAvailableGames = (): Game[] => {
  return games.filter((game) => game.available);
};
