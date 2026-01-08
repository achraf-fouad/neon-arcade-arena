import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { games } from "@/data/games";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

type FilterMode = "all" | "solo" | "multiplayer";

const Games = () => {
  const [filter, setFilter] = useState<FilterMode>("all");

  const filteredGames = games.filter((game) => {
    if (filter === "all") return true;
    if (filter === "solo") return game.mode === "solo" || game.mode === "both";
    if (filter === "multiplayer")
      return game.mode === "multiplayer" || game.mode === "both";
    return true;
  });

  const filterOptions: { value: FilterMode; label: string }[] = [
    { value: "all", label: "ALL GAMES" },
    { value: "solo", label: "SOLO" },
    { value: "multiplayer", label: "2 PLAYERS" },
  ];

  return (
    <Layout>
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">

          {/* HEADER */}
          <div className="text-center mb-12">
            <h1 className="font-gaming text-4xl md:text-5xl mb-4">
              <span className="text-primary">GAME</span> LIBRARY
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Choose your challenge. Play solo or invite a friend.
            </p>
          </div>

          {/* FILTER */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex glass-card rounded-lg p-1">
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFilter(option.value)}
                  className={cn(
                    "px-4 py-2 md:px-6 md:py-3 font-gaming text-xs md:text-sm rounded-md transition-all",
                    filter === option.value
                      ? "bg-primary text-primary-foreground shadow-[0_0_20px_hsl(var(--primary)/0.5)]"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* GAMES GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGames.map((game, index) => (
              <Link
                key={game.id}
                to={game.available ? `/games/${game.slug}` : "#"}
                className={cn(
                  "relative h-56 rounded-xl overflow-hidden group",
                  "animate-scale-in",
                  !game.available && "opacity-60 pointer-events-none"
                )}
                style={{
                  animationDelay: `${index * 0.05}s`,
                  backgroundImage: `url(${game.icon})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {/* DARK OVERLAY */}
                <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-all" />

                {/* MODE BADGE */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="px-2 py-1 text-xs font-gaming rounded bg-black/70">
                    {game.mode === "both"
                      ? "1–2 PLAYERS"
                      : game.mode.toUpperCase()}
                  </span>
                </div>

                {/* BOTTOM CONTENT */}
                <div className="absolute bottom-0 left-0 right-0 z-10 p-4">
                  <h3 className="font-gaming text-lg leading-tight">
                    {game.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {game.description}
                  </p>
                </div>

                {/* HOVER ZOOM */}
                <div className="absolute inset-0 scale-100 group-hover:scale-110 transition-transform duration-500" />

                {/* COMING SOON */}
                {!game.available && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/80">
                    <span className="font-gaming text-sm text-muted-foreground">
                      COMING SOON
                    </span>
                  </div>
                )}
              </Link>
            ))}
          </div>

          {/* EMPTY */}
          {filteredGames.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground font-gaming">
                No games found.
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Games;
