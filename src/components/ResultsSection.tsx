import { Download, Filter, Users, X } from "lucide-react";
import { useState, useMemo } from "react";
import { Company } from "@/types/company";
import CompanyCard from "./CompanyCard";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface ResultsSectionProps {
  companies: Company[];
  searchQuery: string;
  isLoading: boolean;
  onLeadSaved?: () => void;
}

const ResultsSection = ({ companies, searchQuery, isLoading, onLeadSaved }: ResultsSectionProps) => {
  const [sizeFilters, setSizeFilters] = useState<string[]>([]);
  const [stateFilters, setStateFilters] = useState<string[]>([]);

  // Extrair valores únicos para filtros
  const uniqueSizes = useMemo(() => {
    const sizes = [...new Set(companies.map(c => c.size).filter(Boolean))];
    return sizes as string[];
  }, [companies]);

  const uniqueStates = useMemo(() => {
    const states = [...new Set(companies.map(c => c.state).filter(Boolean))];
    return states.sort() as string[];
  }, [companies]);

  // Aplicar filtros
  const filteredCompanies = useMemo(() => {
    return companies.filter(company => {
      const matchesSize = sizeFilters.length === 0 || sizeFilters.includes(company.size || '');
      const matchesState = stateFilters.length === 0 || stateFilters.includes(company.state || '');
      return matchesSize && matchesState;
    });
  }, [companies, sizeFilters, stateFilters]);

  const toggleSizeFilter = (size: string) => {
    setSizeFilters(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const toggleStateFilter = (state: string) => {
    setStateFilters(prev => 
      prev.includes(state) ? prev.filter(s => s !== state) : [...prev, state]
    );
  };

  const clearFilters = () => {
    setSizeFilters([]);
    setStateFilters([]);
  };

  const hasActiveFilters = sizeFilters.length > 0 || stateFilters.length > 0;

  if (isLoading) {
    return (
      <section className="py-12 md:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center justify-center py-16 md:py-20">
            <div className="relative">
              <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
              <div className="absolute inset-0 w-12 h-12 md:w-16 md:h-16 border-4 border-transparent border-r-accent rounded-full animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
            </div>
            <p className="mt-4 md:mt-6 text-base md:text-lg text-muted-foreground text-center px-4">
              Buscando empresas de <span className="text-primary font-semibold">{searchQuery}</span>...
            </p>
            <p className="mt-2 text-xs md:text-sm text-muted-foreground">
              Nossa IA está analisando dados de empresas
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (companies.length === 0 && searchQuery) {
    return (
      <section className="py-12 md:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center justify-center py-16 md:py-20 text-center px-4">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-secondary flex items-center justify-center mb-4 md:mb-6">
              <Users className="w-8 h-8 md:w-10 md:h-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg md:text-xl font-heading font-semibold mb-2">
              Nenhuma empresa encontrada
            </h3>
            <p className="text-sm md:text-base text-muted-foreground max-w-md">
              Não encontramos empresas para "{searchQuery}". Tente buscar por outro setor ou localidade.
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (companies.length === 0) {
    return null;
  }

  const exportToCSV = () => {
    const headers = ["Nome", "CNPJ", "Endereço", "Cidade", "Estado", "Telefone", "Email", "Website", "Setor", "Porte"];
    const rows = filteredCompanies.map((c) => [
      c.name,
      c.cnpj,
      c.address,
      c.city,
      c.state,
      c.phone || "",
      c.email || "",
      c.website || "",
      c.sector,
      c.size || "",
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `leads_${searchQuery}_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  return (
    <section className="py-12 md:py-16 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col gap-4 mb-6 md:mb-8">
          <div>
            <h2 className="text-xl md:text-2xl font-heading font-bold">
              Resultados para "{searchQuery}"
            </h2>
            <p className="text-sm md:text-base text-muted-foreground mt-1">
              {filteredCompanies.length} de {companies.length} empresa{companies.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 md:gap-3 items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="text-xs md:text-sm">
                  <Filter className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1 md:mr-2" />
                  Filtrar
                  {hasActiveFilters && (
                    <Badge variant="secondary" className="ml-2 px-1.5 py-0.5 text-xs">
                      {sizeFilters.length + stateFilters.length}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>Porte da Empresa</DropdownMenuLabel>
                {uniqueSizes.map((size) => (
                  <DropdownMenuCheckboxItem
                    key={size}
                    checked={sizeFilters.includes(size)}
                    onCheckedChange={() => toggleSizeFilter(size)}
                  >
                    {size}
                  </DropdownMenuCheckboxItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Estado</DropdownMenuLabel>
                {uniqueStates.map((state) => (
                  <DropdownMenuCheckboxItem
                    key={state}
                    checked={stateFilters.includes(state)}
                    onCheckedChange={() => toggleStateFilter(state)}
                  >
                    {state}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs md:text-sm text-muted-foreground">
                <X className="w-3.5 h-3.5 mr-1" />
                Limpar filtros
              </Button>
            )}

            <Button variant="accent" size="sm" onClick={exportToCSV} className="text-xs md:text-sm">
              <Download className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1 md:mr-2" />
              Exportar CSV
            </Button>
          </div>

          {/* Tags dos filtros ativos */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2">
              {sizeFilters.map(size => (
                <Badge key={size} variant="outline" className="cursor-pointer" onClick={() => toggleSizeFilter(size)}>
                  {size}
                  <X className="w-3 h-3 ml-1" />
                </Badge>
              ))}
              {stateFilters.map(state => (
                <Badge key={state} variant="outline" className="cursor-pointer" onClick={() => toggleStateFilter(state)}>
                  {state}
                  <X className="w-3 h-3 ml-1" />
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredCompanies.map((company, index) => (
            <CompanyCard 
              key={company.id} 
              company={company} 
              index={index}
              onSaved={onLeadSaved}
            />
          ))}
        </div>

        {filteredCompanies.length === 0 && hasActiveFilters && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground">Nenhuma empresa corresponde aos filtros selecionados.</p>
            <Button variant="link" onClick={clearFilters} className="mt-2">
              Limpar filtros
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ResultsSection;
