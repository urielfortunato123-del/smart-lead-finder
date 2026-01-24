import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onBack?: () => void;
  showBack?: boolean;
}

const Header = ({ onBack, showBack = false }: HeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showBack && onBack && (
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <div>
            <h1 className="text-xl font-heading font-bold text-gradient">
              CompraInteligente
            </h1>
            <p className="text-xs text-muted-foreground">
              Decida com clareza antes de gastar seu dinheiro.
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
