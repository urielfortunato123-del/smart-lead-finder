import { Download, Filter, Users } from "lucide-react";
import { Company } from "@/types/company";
import CompanyCard from "./CompanyCard";
import { Button } from "@/components/ui/button";

interface ResultsSectionProps {
  companies: Company[];
  searchQuery: string;
  isLoading: boolean;
}

const ResultsSection = ({ companies, searchQuery, isLoading }: ResultsSectionProps) => {
  if (isLoading) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-accent rounded-full animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
            </div>
            <p className="mt-6 text-lg text-muted-foreground">
              Buscando empresas de <span className="text-primary font-semibold">{searchQuery}</span>...
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Nossa IA está analisando dados de empresas
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (companies.length === 0 && searchQuery) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-6">
              <Users className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-heading font-semibold mb-2">
              Nenhuma empresa encontrada
            </h3>
            <p className="text-muted-foreground max-w-md">
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
    const headers = ["Nome", "CNPJ", "Endereço", "Cidade", "Estado", "Telefone", "Email", "Website", "Setor"];
    const rows = companies.map((c) => [
      c.name,
      c.cnpj,
      c.address,
      c.city,
      c.state,
      c.phone || "",
      c.email || "",
      c.website || "",
      c.sector,
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
    <section className="py-16 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-heading font-bold">
              Resultados para "{searchQuery}"
            </h2>
            <p className="text-muted-foreground mt-1">
              {companies.length} empresa{companies.length !== 1 ? "s" : ""} encontrada{companies.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filtrar
            </Button>
            <Button variant="accent" size="sm" onClick={exportToCSV}>
              <Download className="w-4 h-4 mr-2" />
              Exportar CSV
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company, index) => (
            <CompanyCard key={company.id} company={company} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResultsSection;
