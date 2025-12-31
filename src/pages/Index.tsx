import { useState } from "react";
import Header from "@/components/Header";
import SearchHero from "@/components/SearchHero";
import StatsBar from "@/components/StatsBar";
import ResultsSection from "@/components/ResultsSection";
import { Company } from "@/types/company";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { searchCompanies, saveSearchHistory } from "@/services/api";

const Index = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setIsLoading(true);
    setCompanies([]);

    try {
      const results = await searchCompanies(query);
      setCompanies(results);
      
      // Save search history if user is logged in
      if (user) {
        await saveSearchHistory(query, results.length);
      }

      toast({
        title: "Busca concluída!",
        description: `Encontramos ${results.length} empresas no setor de ${query}`,
      });
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Erro na busca",
        description: error instanceof Error ? error.message : "Não foi possível buscar empresas",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <SearchHero onSearch={handleSearch} isLoading={isLoading} />
        <StatsBar />
        <ResultsSection
          companies={companies}
          searchQuery={searchQuery}
          isLoading={isLoading}
        />
      </main>
    </div>
  );
};

export default Index;