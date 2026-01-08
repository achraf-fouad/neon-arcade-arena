import { Layout } from "@/components/layout/Layout";
import { NeonButton } from "@/components/ui/NeonButton";
import { getAvailableGames } from "@/data/games";
import { Link } from "react-router-dom";
import { Zap, Users, Gift, Gamepad2 } from "lucide-react";
import { cn } from "@/lib/utils";

const Index = () => {
  const featuredGames = getAvailableGames().slice(0, 4);

  const advantages = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "INSTANT PLAY",
      description: "No downloads, no installs. Jump straight into the action.",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "LOCAL MULTIPLAYER",
      description: "Challenge your friends on the same keyboard.",
    },
    {
      icon: <Gift className="w-8 h-8" />,
      title: "100% FREE",
      description: "No ads, no paywalls. Just pure fun.",
    },
  ];

  return (
    <Layout>
      {/* HERO */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="mb-8 animate-float">
            <div className="relative inline-block">
              <Gamepad2 className="w-20 h-20 md:w-28 md:h-28 text-primary" />
              <div className="absolute inset-0 blur-2xl bg-primary/30 animate-pulse" />
            </div>
          </div>

          <h1 className="font-gaming text-4xl md:text-6xl lg:text-7xl mb-6">
            <span className="text-primary">PLAY</span> TOGETHER.
            <br />
            <span className="text-accent">FEEL</span> THE{" "}
            <span className="text-primary">NEON.</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Quick, competitive, and addictive mini-games.
          </p>

          <Link to="/games">
            <NeonButton variant="primary" size="xl">
              START PLAYING
            </NeonButton>
          </Link>
        </div>
      </section>

      {/* FEATURED GAMES */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-gaming text-3xl md:text-4xl mb-4">
              <span className="text-primary">FEATURED</span> GAMES
            </h2>
            <p className="text-muted-foreground">
              Our most popular games right now
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredGames.map((game, index) => (
              <Link
                key={game.id}
                to={`/games/${game.slug}`}
                className={cn(
                  "relative h-56 rounded-xl overflow-hidden group",
                  "animate-slide-up"
                )}
                style={{
                  animationDelay: `${index * 0.1}s`,
                  backgroundImage: `url(${game.icon})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-all" />

                {/* Mode badge */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="bg-black/70 px-2 py-1 text-xs font-gaming rounded">
                    {game.mode === "both"
                      ? "1–2 PLAYERS"
                      : game.mode.toUpperCase()}
                  </span>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 z-10 p-4">
                  <h3 className="font-gaming text-lg">{game.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {game.description}
                  </p>
                </div>

                {/* Hover zoom */}
                <div className="absolute inset-0 group-hover:scale-110 transition-transform duration-500" />
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/games">
              <NeonButton variant="outline" size="lg">
                VIEW ALL GAMES
              </NeonButton>
            </Link>
          </div>
        </div>
      </section>

      {/* ADVANTAGES */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {advantages.map((adv, index) => (
              <div
                key={adv.title}
                className="glass-card p-8 rounded-xl text-center hover:neon-border-cyan transition-all"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="inline-flex w-16 h-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-6">
                  {adv.icon}
                </div>
                <h3 className="font-gaming text-xl mb-4">{adv.title}</h3>
                <p className="text-muted-foreground">{adv.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center">
        <h2 className="font-gaming text-3xl md:text-4xl mb-6">
          READY TO <span className="text-primary">PLAY</span>?
        </h2>
        <Link to="/games">
          <NeonButton variant="accent" size="xl">
            LET'S GO
          </NeonButton>
        </Link>
      </section>
    </Layout>
  );
};

export default Index;
