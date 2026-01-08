import { Layout } from "@/components/layout/Layout";
import { NeonButton } from "@/components/ui/NeonButton";
import { GameCard } from "@/components/ui/GameCard";
import { getAvailableGames } from "@/data/games";
import { Link } from "react-router-dom";
import { Zap, Users, Gift, Gamepad2 } from "lucide-react";

const Index = () => {
  const featuredGames = getAvailableGames().slice(0, 4);

  const advantages = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "INSTANT PLAY",
      description: "No downloads, no installs. Jump straight into the action in seconds.",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "LOCAL MULTIPLAYER",
      description: "Challenge your friends on the same keyboard. Real competition!",
    },
    {
      icon: <Gift className="w-8 h-8" />,
      title: "100% FREE",
      description: "All games are completely free. No ads, no paywalls, just fun.",
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px]" />
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 relative z-10 text-center">
          {/* Animated Icon */}
          <div className="mb-8 animate-float">
            <div className="relative inline-block">
              <Gamepad2 className="w-20 h-20 md:w-28 md:h-28 text-primary" />
              <div className="absolute inset-0 blur-2xl bg-primary/30 animate-pulse" />
            </div>
          </div>

          {/* Main Title */}
          <h1 className="font-gaming text-4xl md:text-6xl lg:text-7xl mb-6 animate-slide-up">
            <span className="text-primary animate-neon-flicker">PLAY</span>
            <span className="text-foreground"> TOGETHER.</span>
            <br />
            <span className="text-accent">FEEL</span>
            <span className="text-foreground"> THE </span>
            <span className="text-primary">NEON.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Quick, competitive, and addictive mini-games. 
            Play solo or challenge a friend right in your browser.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <Link to="/games">
              <NeonButton variant="primary" size="xl">
                START PLAYING
              </NeonButton>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 flex justify-center gap-8 md:gap-16 animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <div className="text-center">
              <div className="font-gaming text-3xl md:text-4xl text-primary">7+</div>
              <div className="text-sm text-muted-foreground">GAMES</div>
            </div>
            <div className="text-center">
              <div className="font-gaming text-3xl md:text-4xl text-accent">2P</div>
              <div className="text-sm text-muted-foreground">LOCAL</div>
            </div>
            <div className="text-center">
              <div className="font-gaming text-3xl md:text-4xl text-neon-green">∞</div>
              <div className="text-sm text-muted-foreground">FUN</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Games Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-gaming text-3xl md:text-4xl mb-4">
              <span className="text-primary">FEATURED</span> GAMES
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Jump into our most popular games. Solo challenges or head-to-head battles await!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredGames.map((game, index) => (
              <div
                key={game.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <GameCard
                  title={game.title}
                  description={game.description}
                  icon={<span className="text-4xl">{game.icon}</span>}
                  mode={game.mode}
                  slug={game.slug}
                />
              </div>
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

      {/* Advantages Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-gaming text-3xl md:text-4xl mb-4">
              WHY <span className="text-primary">NEON PLAYGROUND</span>?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {advantages.map((advantage, index) => (
              <div
                key={advantage.title}
                className="glass-card p-8 rounded-xl text-center animate-slide-up hover:neon-border-cyan transition-all duration-500"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6">
                  {advantage.icon}
                </div>
                <h3 className="font-gaming text-xl mb-4">{advantage.title}</h3>
                <p className="text-muted-foreground">{advantage.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="font-gaming text-3xl md:text-4xl mb-6">
            READY TO <span className="text-primary">PLAY</span>?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            No signup required. Just pick a game and start playing. It's that simple.
          </p>
          <Link to="/games">
            <NeonButton variant="accent" size="xl">
              LET'S GO
            </NeonButton>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
