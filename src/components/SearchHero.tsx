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
    <section className="relative min-h-[50vh] md:min-h-[60vh] flex flex-col items-center justify-center px-4 py-12 md:py-16 gradient-hero overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 md:w-96 h-64 md:h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 md:w-80 h-48 md:h-80 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center w-full">
        <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full glass mb-4 md:mb-6 animate-fade-in">
          <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-accent" />
          <span className="text-xs md:text-sm text-muted-foreground">
            Prospecção inteligente com IA
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-6xl font-heading font-bold mb-4 md:mb-6 animate-slide-up leading-tight">
          Encontre leads qualificados
          <br />
          <span className="text-gradient">em segundos</span>
        </h1>

        <p className="text-base md:text-lg lg:text-xl text-muted-foreground mb-6 md:mb-10 max-w-2xl mx-auto animate-slide-up px-4" style={{ animationDelay: "0.1s" }}>
          Digite o setor que deseja prospectar e nossa IA encontra empresas com
          CNPJ, endereço e contatos para você.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 md:gap-4 max-w-2xl mx-auto mb-6 md:mb-8 animate-slide-up px-2"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="relative flex-1">
            <Building2 className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Ex: Restaurantes em São Paulo..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 md:pl-12 h-12 md:h-14 text-sm md:text-base"
            />
          </div>
          <Button
            type="submit"
            variant="hero"
            size="lg"
            disabled={isLoading || !query.trim()}
            className="w-full md:w-auto md:min-w-[160px] h-12 md:h-14"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                <span className="text-sm md:text-base">Buscando...</span>
              </div>
            ) : (
              <>
                <Search className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-sm md:text-base">Buscar Leads</span>
              </>
            )}
          </Button>
        </form>

        <div className="flex flex-wrap justify-center gap-2 animate-slide-up px-2" style={{ animationDelay: "0.3s" }}>
          <span className="text-xs md:text-sm text-muted-foreground mr-1 md:mr-2">
            Sugestões:
          </span>
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => {
                setQuery(suggestion);
                onSearch(suggestion);
              }}
              className="px-2 md:px-3 py-1 md:py-1.5 text-xs md:text-sm rounded-full border border-border hover:border-primary hover:bg-primary/10 transition-all duration-200"
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