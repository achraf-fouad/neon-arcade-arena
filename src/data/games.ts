import { url } from "inspector";

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
    icon: "https://jeu-du-serpent.fr/wp-content/uploads/2021/11/jeu-snake.jpg",
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
    icon: "https://img.poki-cdn.com/cdn-cgi/image/q=78,scq=50,width=1200,height=1200,fit=cover,f=png/aa850a3705bb31cc524fec36f8d31320/ping-pong-html5.jpeg",
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
    icon: "https://play-lh.googleusercontent.com/zPxLgj5nvl20ahJV7aFC6S5mD8kii5CEEDj25j1P9CYAfXL9sdDuO-8eES0r4DhJHrU",
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
    icon: "https://images.genially.com/genial.ly/genially/templates/d2e1bb7a-5415-4796-977d-4dbe58e371b1.jpeg",
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
    icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOxYtqpL0TfXuH11QBByt0WKPGj0vzAEH7eA&s",
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
    icon: "https://hackaday.com/wp-content/uploads/2024/07/reaction-game-800.jpg?w=800",
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
    icon: "https://play-lh.googleusercontent.com/jiAJ1xoLhKs7DBP2SfmPQ-pgG0-g4vBJ2oXFJ2tAW1bMlzZ3O3qeqM6GU17AwgDRGXQ",
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
