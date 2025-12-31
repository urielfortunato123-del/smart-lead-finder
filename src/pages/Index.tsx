import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import SearchHero from "@/components/SearchHero";
import StatsBar from "@/components/StatsBar";
import ResultsSection from "@/components/ResultsSection";
import Footer from "@/components/Footer";
import { Company } from "@/types/company";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { searchCompanies, saveSearchHistory, checkSearchLimit } from "@/services/api";

const Index = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [remainingSearches, setRemainingSearches] = useState<number | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Check remaining searches on load
  useEffect(() => {
    if (user) {
      checkSearchLimit().then((result) => {
        if (result.remaining !== undefined) {
          setRemainingSearches(result.remaining);
        }
      });
    }
  }, [user]);

  const handleSearch = async (query: string) => {
    if (!user) {
      toast({
        title: "Faça login",
        description: "Você precisa estar logado para fazer buscas",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    setSearchQuery(query);
    setIsLoading(true);
    setCompanies([]);

    try {
      const results = await searchCompanies(query);
      setCompanies(results);
      
      // Save search history
      await saveSearchHistory(query, results.length);

      // Update remaining searches
      const limitCheck = await checkSearchLimit();
      if (limitCheck.remaining !== undefined) {
        setRemainingSearches(limitCheck.remaining);
      }

      toast({
        title: "Busca concluída!",
        description: `Encontramos ${results.length} empresas no setor de ${query}`,
      });
    } catch (error) {
      console.error('Search error:', error);
      const errorMessage = error instanceof Error ? error.message : "Não foi possível buscar empresas";
      
      if (errorMessage.includes('limite') || errorMessage.includes('upgrade')) {
        toast({
          title: "Limite de buscas atingido",
          description: errorMessage,
          variant: "destructive",
        });
        // Redirect to pricing after a short delay
        setTimeout(() => navigate('/pricing'), 2000);
      } else {
        toast({
          title: "Erro na busca",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="pt-16 md:pt-20 flex-1">
        {user && remainingSearches !== null && remainingSearches < 999 && (
          <div className="bg-secondary/50 border-b border-border py-2 px-4 text-center">
            <p className="text-sm text-muted-foreground">
              {remainingSearches > 0 ? (
                <>
                  Você tem <span className="text-primary font-semibold">{remainingSearches}</span> busca{remainingSearches !== 1 ? 's' : ''} restante{remainingSearches !== 1 ? 's' : ''} hoje.{" "}
                  <a href="/pricing" className="text-accent hover:underline">
                    Fazer upgrade
                  </a>
                </>
              ) : (
                <>
                  Limite de buscas atingido.{" "}
                  <a href="/pricing" className="text-accent hover:underline font-semibold">
                    Faça upgrade para continuar
                  </a>
                </>
              )}
            </p>
          </div>
        )}
        <SearchHero onSearch={handleSearch} isLoading={isLoading} />
        <StatsBar />
        <ResultsSection
          companies={companies}
          searchQuery={searchQuery}
          isLoading={isLoading}
        />
      </main>
      <Footer />
    </div>
  );
};

export default Index;