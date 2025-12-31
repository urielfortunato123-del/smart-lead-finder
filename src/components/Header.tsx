import { Zap } from "lucide-react";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center shadow-glow">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-heading font-bold text-xl">
            Lead<span className="text-gradient">Finder</span>
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <a
            href="#"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Como funciona
          </a>
          <a
            href="#"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Preços
          </a>
          <a
            href="#"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            API
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
