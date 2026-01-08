import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { GameCard } from "@/components/ui/GameCard";
import { games } from "@/data/games";
import { cn } from "@/lib/utils";

type FilterMode = "all" | "solo" | "multiplayer";

const Games = () => {
  const [filter, setFilter] = useState<FilterMode>("all");

  const filteredGames = games.filter((game) => {
    if (filter === "all") return true;
    if (filter === "solo") return game.mode === "solo" || game.mode === "both";
    if (filter === "multiplayer") return game.mode === "multiplayer" || game.mode === "both";
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
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-gaming text-4xl md:text-5xl mb-4">
              <span className="text-primary">GAME</span> LIBRARY
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Choose your challenge. Play solo or invite a friend for local multiplayer action.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex glass-card rounded-lg p-1">
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFilter(option.value)}
                  className={cn(
                    "px-4 py-2 md:px-6 md:py-3 font-gaming text-xs md:text-sm tracking-wider rounded-md transition-all duration-300",
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

          {/* Games Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGames.map((game, index) => (
              <div
                key={game.id}
                className={cn(
                  "animate-scale-in",
                  !game.available && "opacity-60"
                )}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="relative">
                  <GameCard
                    title={game.title}
                    description={game.description}
                    icon={<span className="text-4xl">{game.icon}</span>}
                    mode={game.mode}
                    slug={game.slug}
                  />
                  {!game.available && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-xl">
                      <span className="font-gaming text-sm text-muted-foreground">
                        COMING SOON
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredGames.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground font-gaming">
                No games found for this filter.
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Games;
