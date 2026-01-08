import { Gamepad2 } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border/50 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo & Description */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <Gamepad2 className="w-6 h-6 text-primary" />
              <span className="font-gaming text-lg tracking-wider">
                <span className="text-primary">NEON</span>
                <span className="text-foreground"> PLAYGROUND</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Your ultimate destination for quick, fun, and competitive mini-games. 
              Play solo or challenge a friend!
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-gaming text-sm text-foreground mb-4 tracking-wider">
              QUICK LINKS
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/games" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  All Games
                </Link>
              </li>
            </ul>
          </div>

          {/* Stats */}
          <div>
            <h4 className="font-gaming text-sm text-foreground mb-4 tracking-wider">
              PLATFORM STATS
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card p-3 rounded-lg text-center">
                <div className="font-gaming text-2xl text-primary">7+</div>
                <div className="text-xs text-muted-foreground">Games</div>
              </div>
              <div className="glass-card p-3 rounded-lg text-center">
                <div className="font-gaming text-2xl text-accent">2P</div>
                <div className="text-xs text-muted-foreground">Multiplayer</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-border/30 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-xs">
            © 2024 NEON PLAYGROUND. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="inline-block w-2 h-2 rounded-full bg-neon-green animate-pulse" />
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
