import { useState } from "react";
import { Search, Sparkles, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchHeroProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

const SearchHero = ({ onSearch, isLoading }: SearchHeroProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const suggestions = [
    "Restaurantes",
    "Advocacia",
    "Tecnologia",
    "Saúde",
    "Construção Civil",
    "Varejo",
  ];

  return (
    <section className="relative min-h-[60vh] flex flex-col items-center justify-center px-4 py-16 gradient-hero overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 animate-fade-in">
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="text-sm text-muted-foreground">
            Prospecção inteligente com IA
          </span>
        </div>

        <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6 animate-slide-up">
          Encontre leads qualificados
          <br />
          <span className="text-gradient">em segundos</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "0.1s" }}>
          Digite o setor que deseja prospectar e nossa IA encontra empresas com
          CNPJ, endereço e contatos para você.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mb-8 animate-slide-up"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="relative flex-1">
            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Ex: Restaurantes em São Paulo, Advocacia, Tecnologia..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-12 h-14 text-base"
            />
          </div>
          <Button
            type="submit"
            variant="hero"
            size="xl"
            disabled={isLoading || !query.trim()}
            className="min-w-[160px]"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Buscando...
              </div>
            ) : (
              <>
                <Search className="w-5 h-5" />
                Buscar Leads
              </>
            )}
          </Button>
        </form>

        <div className="flex flex-wrap justify-center gap-2 animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <span className="text-sm text-muted-foreground mr-2">
            Sugestões:
          </span>
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => {
                setQuery(suggestion);
                onSearch(suggestion);
              }}
              className="px-3 py-1.5 text-sm rounded-full border border-border hover:border-primary hover:bg-primary/10 transition-all duration-200"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SearchHero;
