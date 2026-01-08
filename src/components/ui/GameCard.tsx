import { cn } from "@/lib/utils";
import { NeonButton } from "./NeonButton";
import { Link } from "react-router-dom";

interface GameCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  mode: "solo" | "multiplayer" | "both";
  slug: string;
  className?: string;
}

const GameCard = ({ title, description, icon, mode, slug, className }: GameCardProps) => {
  const getModeLabel = () => {
    switch (mode) {
      case "solo":
        return { text: "SOLO", color: "bg-neon-green/20 text-neon-green border-neon-green/50" };
      case "multiplayer":
        return { text: "2 PLAYERS", color: "bg-accent/20 text-accent border-accent/50" };
      case "both":
        return { text: "SOLO / 2P", color: "bg-primary/20 text-primary border-primary/50" };
    }
  };

  const modeInfo = getModeLabel();

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl",
        "glass-card p-6",
        "border border-border/50",
        "transition-all duration-500",
        "hover:border-primary/50",
        "hover:shadow-[0_0_40px_hsl(var(--primary)/0.2)]",
        className
      )}
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Mode Badge */}
        <div className="flex justify-between items-start mb-4">
          <span
            className={cn(
              "px-3 py-1 text-xs font-gaming tracking-wider rounded-full border",
              modeInfo.color
            )}
          >
            {modeInfo.text}
          </span>
        </div>

        {/* Icon */}
        <div className="mb-4 text-primary group-hover:text-neon-cyan transition-colors duration-300">
          <div className="w-16 h-16 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
        </div>

        {/* Title */}
        <h3 className="font-gaming text-xl text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>

        {/* Description */}
        <p className="text-muted-foreground text-sm mb-6 line-clamp-2">
          {description}
        </p>

        {/* Play Button */}
        <Link to={`/games/${slug}`}>
          <NeonButton variant="primary" size="sm" className="w-full">
            PLAY NOW
          </NeonButton>
        </Link>
      </div>
    </div>
  );
};

export { GameCard };
