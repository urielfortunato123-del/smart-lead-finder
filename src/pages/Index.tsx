import { useState } from "react";
import Header from "@/components/Header";
import SearchHero from "@/components/SearchHero";
import StatsBar from "@/components/StatsBar";
import ResultsSection from "@/components/ResultsSection";
import { Company } from "@/types/company";
import { useToast } from "@/hooks/use-toast";

// Mock data generator - será substituído pela IA
const generateMockCompanies = (sector: string): Company[] => {
  const cities = [
    { city: "São Paulo", state: "SP" },
    { city: "Rio de Janeiro", state: "RJ" },
    { city: "Belo Horizonte", state: "MG" },
    { city: "Curitiba", state: "PR" },
    { city: "Porto Alegre", state: "RS" },
    { city: "Brasília", state: "DF" },
  ];

  const sizes = ["Microempresa", "Pequena", "Média", "Grande"];

  const generateCNPJ = () => {
    const random = () => Math.floor(Math.random() * 10);
    return `${random()}${random()}.${random()}${random()}${random()}.${random()}${random()}${random()}/0001-${random()}${random()}`;
  };

  const streetNames = [
    "Rua das Flores",
    "Av. Brasil",
    "Rua São Paulo",
    "Av. Paulista",
    "Rua XV de Novembro",
    "Av. Atlântica",
    "Rua Augusta",
    "Av. Rio Branco",
  ];

  const companyPrefixes = [
    "Alpha", "Beta", "Prime", "Master", "Gold", "Premium", "Elite", "Top", 
    "Super", "Mega", "Ultra", "Express", "Plus", "Pro", "Tech"
  ];

  const companySuffixes = [
    "Soluções", "Serviços", "Consultoria", "Assessoria", "Group", 
    "Brasil", "Tech", "Digital", "Solutions", "Partners"
  ];

  return Array.from({ length: 12 }, (_, i) => {
    const location = cities[Math.floor(Math.random() * cities.length)];
    const prefix = companyPrefixes[Math.floor(Math.random() * companyPrefixes.length)];
    const suffix = companySuffixes[Math.floor(Math.random() * companySuffixes.length)];
    const street = streetNames[Math.floor(Math.random() * streetNames.length)];
    const number = Math.floor(Math.random() * 2000) + 1;

    return {
      id: `company-${i + 1}`,
      name: `${prefix} ${sector} ${suffix}`,
      cnpj: generateCNPJ(),
      address: `${street}, ${number}`,
      city: location.city,
      state: location.state,
      phone: `(${Math.floor(Math.random() * 90) + 10}) 9${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`,
      email: `contato@${prefix.toLowerCase()}${sector.toLowerCase().replace(/\s/g, "")}.com.br`,
      website: `https://www.${prefix.toLowerCase()}${sector.toLowerCase().replace(/\s/g, "")}.com.br`,
      sector: sector,
      size: sizes[Math.floor(Math.random() * sizes.length)],
    };
  });
};

const Index = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setIsLoading(true);
    setCompanies([]);

    // Simula chamada de API
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const results = generateMockCompanies(query);
    setCompanies(results);
    setIsLoading(false);

    toast({
      title: "Busca concluída!",
      description: `Encontramos ${results.length} empresas no setor de ${query}`,
    });
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
